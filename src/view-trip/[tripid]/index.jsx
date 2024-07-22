import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import InfoSection from '@/components/infoSection';
import HotelPage from '@/components/Hotels';
import TravelPlans from '@/components/TravelPlans'
import Footer from '@/components/Fotter'
const ViewTrip = () => {
    const { tripid } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tripid) {
            getTripData(tripid);
        }
    }, [tripid]);

    const getTripData = async (tripid) => {
        setLoading(true);
        try {
            console.log('Fetching trip data for ID:', tripid);
            const docRef = doc(db, 'AITrips', tripid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log('Document data:', docSnap.data());
                setTrip(docSnap.data());
            } else {
                console.log('No such document');
                setError('No document found');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            setError('Error fetching document');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            <h1 className='text-xl font-bold'>Trip Details</h1>
            {error ? (
                <p className='text-red-500'>{error}</p>
            ) : trip ? (
                <>
                    <InfoSection trip={trip} />
                    <HotelPage trip={trip} />
                    <TravelPlans trip={trip} />
                    <Footer trip={trip} />
                 
                </>
            ) : (
                <p>No trip data available</p>
            )}
        </div>
    );
};

export default ViewTrip;
