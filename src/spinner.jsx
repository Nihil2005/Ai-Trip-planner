// Spinner.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon from react-icons

const Spinner = () => (
  <div className="flex justify-center items-center">
    <FaSpinner className="text-gray-500 animate-spin" size={24} />
  </div>
);

export default Spinner;
