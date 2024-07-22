import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelPage = ({ trip }) => {
  const [hotelsWithImages, setHotelsWithImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!trip?.tripData?.travel_plan?.hotels) {
        setLoading(false);
        return;
      }

      const hotels = trip.tripData.travel_plan.hotels;

      try {
        const updatedHotels = await Promise.all(
          hotels.map(async (hotel) => {
            try {
              // Foursquare API Key (should be stored securely)
              const apiKey = 'fsq3Ok57VbpU7YNgQM0YuaoyxioW0OXCzVG7yEv21WnLezA=';

              const searchResponse = await axios.get('https://api.foursquare.com/v3/places/search', {
                params: {
                  near: hotel.address, // Adjust as needed
                  limit: 1,
                  fields: 'fsq_id,name,location,photos'
                },
                headers: {
                  Authorization: `fsq3Ok57VbpU7YNgQM0YuaoyxioW0OXCzVG7yEv21WnLezA=`, // Authorization header
                  'Content-Type': 'application/json' // Additional header for JSON
              }
              });

              const place = searchResponse.data.results[0];
              console.log('API response:', place); // Debugging: Log API response

              if (place && place.photos && place.photos.length > 0) {
                const photo = place.photos[0];
                const photoUrl = `${photo.prefix}300x300${photo.suffix}`; // Adjust size if needed
                return { ...hotel, images: [photoUrl] };
              } else {
                return { ...hotel, images: ['/bgimage.jpg'] }; // Fallback image
              }
            } catch (error) {
              console.error('Error fetching image from FourSquare', error.response ? error.response.data : error.message);
              return { ...hotel, images: ['/bgimage.jpg'] }; // Fallback image
            }
          })
        );

        setHotelsWithImages(updatedHotels);
      } catch (error) {
        setError('Error fetching hotel images.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [trip]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!hotelsWithImages.length) return <p>No hotel data available</p>;

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold text-center mb-8'>Hotel Recommendations</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {hotelsWithImages.map((item, index) => (
          <a
            key={index}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105'
          >
            {/* Image Section */}
            <div className='relative'>
              <img 
                src={item.images[0]} 
                alt={item.name} 
                className='w-full h-48 object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>
            </div>
            
            {/* Content Section */}
            <div className='p-4 flex-grow'>
              <h2 className='text-xl font-semibold text-white mb-1'>{item.name}</h2>
              <p className='text-lg text-white'>{item.price}</p>
              {item.rating && <p className='text-yellow-400'>Rating: {item.rating}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HotelPage;
