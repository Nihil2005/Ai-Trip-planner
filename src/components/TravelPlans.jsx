import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TravelPlans = ({ trip }) => {
    const [activitiesWithImages, setActivitiesWithImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!trip?.tripData?.travel_plan) {
                setLoading(false);
                return;
            }

            const { travel_plan } = trip.tripData;

            try {
                const updatedActivities = await Promise.all(
                    travel_plan.itinerary.flatMap(dayPlan =>
                        dayPlan.activities.map(async activity => {
                            if (!activity?.name) return { ...activity, images: ['/bgimage.jpg'] };

                            try {
                                const apiKey = 'fsq3Ok57VbpU7YNgQM0YuaoyxioW0OXCzVG7yEv21WnLezA=';
                                const searchResponse = await axios.get('https://api.foursquare.com/v3/places/search', {
                                    params: {
                                        near: activity.name,
                                        limit: 1,
                                        fields: 'fsq_id,name,location,photos'
                                    },
                                    headers: {
                                        Authorization: `fsq3Ok57VbpU7YNgQM0YuaoyxioW0OXCzVG7yEv21WnLezA=`,
                                        'Content-Type': 'application/json'
                                    }
                                });

                                const place = searchResponse.data.results[0];
                                const images = place?.photos?.length
                                    ? place.photos.map(photo => `${photo.prefix}300x300${photo.suffix}`)
                                    : ['/bgimage.jpg'];

                                return { ...activity, images };
                            } catch (error) {
                                console.error('Error fetching images from FourSquare', error.response?.data || error.message);
                                return { ...activity, images: ['/bgimage.jpg'] };
                            }
                        })
                    )
                );

                setActivitiesWithImages(updatedActivities);
            } catch (error) {
                setError('Error fetching activity images.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [trip]);

    if (loading) return <p className='text-center text-gray-600'>Loading...</p>;
    if (error) return <p className='text-center text-red-600'>{error}</p>;
    if (!trip || !trip.tripData || !trip.tripData.travel_plan) return <p className='text-center text-gray-600'>No trip data available</p>;

    const { travel_plan } = trip.tripData;

    return (
        <div className='p-6 max-w-7xl mx-auto'>
            <h3 className='text-4xl font-bold mb-12 text-center text-gray-800'>Travel Plan</h3>
            <div className='space-y-12'>
                {travel_plan.itinerary.map((dayPlan, index) => (
                    <div key={index} className='bg-white shadow-xl rounded-xl border border-gray-200 p-6'>
                        <h4 className='text-3xl font-semibold mb-8'>Day {dayPlan.day}: {dayPlan.title}</h4>
                        <div className='space-y-8'>
                            {activitiesWithImages.filter(activity => dayPlan.activities.some(a => a.name === activity.name)).map((activity, activityIndex) => (
                                <div key={activityIndex} className='bg-gray-50 p-6 rounded-lg border border-gray-300 shadow-md'>
                                    <h5 className='text-xl font-medium mb-4'>{activity.name || 'Activity'}</h5>
                                    <p className='text-gray-800 mb-4'>{activity.details || 'No details available'}</p>
                                    <p className='text-xl text-black mb-2'>Time: {activity.time || 'No time specified'}</p>
                                    <p className='text-xl text-gray-600 mb-4'>Ticket Pricing: {activity.ticket_pricing || 'No pricing available'}</p>

                                    {/* Display activity images */}
                                    <div className='grid grid-cols-2 gap-4 mb-4'>
                                        {activity.images.map((img, imgIndex) => (
                                            <img 
                                                key={imgIndex} 
                                                src={img} 
                                                alt={activity.name || 'Activity'} 
                                                className='w-full h-48 object-cover rounded-lg'
                                                loading="lazy" 
                                            />
                                        ))}
                                    </div>

                                    {activity.geo_coordinates && <p className='text-sm text-gray-600 mb-2'>Coordinates: {activity.geo_coordinates}</p>}
                                    {activity.rating && <p className='text-sm text-gray-600 mb-4'>Rating: {activity.rating}</p>}
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name)}`} target="_blank" rel="noopener noreferrer" className='text-blue-600 hover:underline'>View on Google Maps</a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TravelPlans;
