import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RequestPending = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Request Pending</h1>
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