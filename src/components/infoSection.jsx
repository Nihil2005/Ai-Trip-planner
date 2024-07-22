import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InfoSection = ({ trip }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            if (!trip || !trip.userSelection || !trip.userSelection.destination) return;

            const { destination } = trip.userSelection;
       // Provided FourSquare API Key

            try {
                const searchResponse = await axios.get('https://api.foursquare.com/v3/places/search', {
                    params: {
                        near: destination,
                        limit: 1,
                        fields: 'fsq_id,name,location,photos' // Ensure photos are included in the response
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
                    setImageUrl(photoUrl);
                } else {
                    setImageUrl('/bgimage.jpg'); // Fallback image
                }
            } catch (error) {
                console.error('Error fetching image from FourSquare', error.response ? error.response.data : error.message);
                setImageUrl('/bgimage.jpg'); // Fallback image
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [trip]);

    if (loading) return <p>Loading...</p>;
    if (!trip) return <p>No trip data available</p>;

    const { userSelection } = trip;
    const { destination, days, budget, planType } = userSelection || {};

    return (
        <div className='flex flex-col gap-4'>
            <img src={imageUrl} className='h-[340px] w-full object-cover rounded-lg' alt='Destination' />
            <div className='flex flex-col gap-4'>
                <h2 className='font-bold text-2xl'>Destination: {destination}</h2>
                <div className='bg-slate-100 p-4 rounded-lg'>
                    <p className='text-lg'><strong>Days:</strong> {days}</p>
                    <p className='text-lg'><strong>Budget:</strong> {budget}</p>
                    <p className='text-lg'><strong>Plan Type:</strong> {planType}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoSection;
