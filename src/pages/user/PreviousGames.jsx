import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllNonActiveGames } from '../../API_handler';

const PreviousGames = () => {
  const navigate = useNavigate();
  // Mock data for demonstration
  const [games, setGames] = useState([ ]);

  useEffect(()=>{
   GetAllNonActiveGames().then((res)=>{
    if(res.status === 200){
      
      setGames(res.data.map((game) => ({
        id: game._id,
        name: game.gameId,
        availableSeats: game.seats.filter(seat => seat.isOccupied === false).length,
        totalSeats: game.totalSeats,
        requestStatus: game.Approved_Users.find(user => user._id === localStorage.getItem('userId')) ? 'approved': null ,
        status: game.status
      })));
      
    }
    else{
      alert("Error fetching games");
    }
   })
  },[])




  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Previous Games</h1>
        <button
        onClick={()=> navigate('/games')}
        className=' bg-black text-white w-24 h-10 rounded-lg  '
        >Back</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length>0 ?
           games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{game.name}</h2>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Available Seats</span>
                  <span>{game.availableSeats} / {game.totalSeats}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(game.availableSeats / game.totalSeats) * 100}%` }}
                  ></div>
                </div>
              </div>

              {
              game.status === 'ended' && (
                <button
                onClick={() => navigate(`/leaderboard/${game.id}`)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
              Game Ended! View Leaderboard
              </button>
              ) 
               }
            </div>
          ))
          :
          <div className="text-center text-gray-600">
            No games available
          </div>
        }
        </div>
      </div>
    </div>
  );
};

export default PreviousGames; 