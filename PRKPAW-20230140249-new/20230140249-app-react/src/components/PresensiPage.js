import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

function PresensiPage({ navigate }) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const handleAction = async (endpoint, actionName) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/presensi/${endpoint}`, {}, headers);
      setMessage(`${actionName} berhasil pada ${new Date().toLocaleTimeString('id-ID')}.`);
    } catch (err) {
      const errorMessage = err.response 
        ? err.response.data.message 
        : `Gagal melakukan ${actionName}.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = () => handleAction('check-in', 'Check-In');
  const handleCheckOut = () => handleAction('check-out', 'Check-Out');

  return (
    <div className="min-h-screen bg-amber-100 flex items-center justify-center p-8 font-sans">
      <div className="bg-white border-4 border-gray-800 p-10 rounded-none shadow-xl w-full max-w-lg text-center">

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-wider uppercase">
          [ USER PRESENSI ]
        </h1>
        <p className="text-gray-700 mb-8 text-sm font-medium border-t-2 border-b-2 border-gray-400 py-2">
          SILAKAN LAKUKAN CHECK-IN ATAU CHECK-OUT
        </p>

        {isLoading && (
          <p className="text-yellow-700 mb-4 bg-yellow-100 p-2 border-2 border-yellow-500 font-bold">
            MEMPROSES PERMINTAAN...
          </p>
        )}

        {message && (
          <p className="text-green-700 mb-4 bg-green-100 p-2 border-2 border-green-500 font-bold">
            SUCCESS: {message}
          </p>
        )}

        {error && (
          <p className="text-red-700 mb-4 bg-red-100 p-2 border-2 border-red-700 font-bold">
            ERROR: {error}
          </p>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-green-600 text-white font-extrabold uppercase rounded-none shadow-lg"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-red-600 text-white font-extrabold uppercase rounded-none shadow-lg"
          >
            Check-Out
          </button>
        </div>

      </div>
    </div>
  );
}

export default PresensiPage;
