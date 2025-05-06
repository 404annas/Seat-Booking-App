import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RequestPending = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-600 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1.5 14h-3v-3h3zm0-4.5h-3V7h3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Request Sended Successfully </h1>
          <p className="text-gray-600 mb-6">
            Your request to join the game is being reviewed by the admin.
            We'll notify you once it's approved.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="text-blue-800 font-medium">What happens next?</p>
            <ul className="text-blue-600 text-sm mt-2 space-y-2">
              <li>• Admin will review your request</li>
              <li>• You'll be notified when approved</li>
              <li>• Then you can proceed to select your seat</li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/games')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestPending; 