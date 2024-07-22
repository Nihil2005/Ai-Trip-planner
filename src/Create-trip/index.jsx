import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SelecTraveleslist, selextBuggetOptions } from '@/constanta/options';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AI_PROMPT, chatSession } from '@/service/AImodel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { doc, setDoc } from "firebase/firestore";
import { useGoogleLogin } from '@react-oauth/google';
import Spinner from '@/spinner';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: '',
    planType: '',
  });
  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (formData.destination && formData.days && formData.budget && formData.planType) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  }, [formData]);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      axios
        .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=pk.eyJ1IjoibmloaWw3MDciLCJhIjoiY2x5cmUyZ2ZoMDdpNTJyczYwcHRvb2F4NCJ9.fqLPFm4FokiklI0MQzlpzA`)
        .then((response) => {
          setSuggestions(response.data.features);
        })
        .catch((error) => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (place_name) => {
    setSelectedSuggestion(place_name);
    handleInputChange('destination', place_name);
    setSuggestions([]);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      GetUserProfile(codeResponse);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    setLoading(true); // Start loading spinner
    axios
      .get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        setOpenDialog(false);
        generateTrip();
      })
      .catch((error) => console.error('Error fetching user profile:', error))
      .finally(() => setLoading(false)); // Stop loading spinner
  };

  const SaveAiTrip = async (TripData) => {
    let docId = Date.now().toString();
    try {
      setLoading(true); // Start loading spinner
      const user = JSON.parse(localStorage.getItem('user'));

      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId
      });
      setFormData({ destination: '', days: '', budget: '', planType: '' }); // Reset form data
    } catch (error) {
      console.error('Error saving AI trip:', error);
    } finally {
      setLoading(false);
      if (docId) {
        navigate('/view-trip/' + docId); // Navigate to the trip view page
      }
    }
  };

  const generateTrip = async () => {
    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDialog(true);
      return;
    }

    setLoading(true); // Start loading spinner

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.destination)
      .replace('{totalDays}', formData.days)
      .replace('{traveler}', formData.planType)
      .replace('{budget}', formData.budget);

    console.log('Generating Trip with prompt:', FINAL_PROMPT);
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log('Result:', result?.response?.text());
      await SaveAiTrip(result?.response.text());
    } catch (error) {
      console.error('Error generating trip:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <Spinner /> {/* Show the spinner when loading */}
        </div>
      )}
      <h2 className="font-bold text-3xl">Tell us your Travel Preference 🏖️</h2>
      <p className="text-xl text-gray-500">Tell us your Travel Preference</p>

      <div className="mt-20">
        <div>
          <h2 className="text-xl my-3 font-medium">What is your Destination of Choice?</h2>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            className="border p-2 rounded w-full"
            placeholder="Enter a place"
          />
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} className="border-b p-2 cursor-pointer" onClick={() => handleSuggestionClick(suggestion.place_name)}>
                {suggestion.place_name}
              </li>
            ))}
          </ul>
          {selectedSuggestion && (
            <div className="mt-2 p-2 border">
              Selected: {selectedSuggestion}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">How many days are you going to plan?</h2>
        <Input
          className="border-2"
          placeholder="Ex. 3"
          type="number"
          onChange={(e) => handleInputChange('days', e.target.value)}
        />
      </div>

      <h2 className="font-bold text-3xl">What is your Budget?</h2>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {selextBuggetOptions.map((item, index) => (
          <div
            key={index}
            className={`p-4 border-2 hover:shadow-xl cursor-pointer rounded-lg ${formData.budget === item.title ? 'shadow-lg border-black border-4' : ''}`}
            onClick={() => handleInputChange('budget', item.title)}
          >
            <h2 className="text-lg font-bold">{item.title}</h2>
            <h2 className="text-sm text-gray-500">{item.desc}</h2>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-3xl">What Type of Your Plan?</h2>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {SelecTraveleslist.map((item, index) => (
          <div
            key={index}
            className={`p-4 border-2 hover:shadow-xl cursor-pointer rounded-lg ${formData.planType === item.title ? 'shadow-lg border-black border-4' : ''}`}
            onClick={() => handleInputChange('planType', item.title)}
          >
            <h2 className="text-lg font-bold">{item.title}</h2>
            <h2>{item.people}</h2>
            <h2 className="text-sm text-gray-500">{item.desc}</h2>
          </div>
        ))}
      </div>

      <div className="my-10 flex justify-end">
        <Button onClick={generateTrip} disabled={!isFormComplete}>Generate Trip 🏕️</Button>
      </div>

      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <h3 className="text-lg font-medium">Please Sign in With Google</h3>
            <DialogDescription>
              You need to be logged in to generate a trip. Please Sign in to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button onClick={login}>Sign in with Google</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
