import axios from 'axios';

const BASE_URL = 'https://api.foursquare.com/v3/places/search';

export const GetPlaceDetails = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: 'fsq3rtCmv3dyJ1hvaSSpbvvLpYkcenI1GNGJ8V0nRKE8baA=', // Replace with your Foursquare API token
            },
            params: {
                query: query,
                limit: 1, // Adjust as needed
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching place details:', error);
        throw error;
    }
};
