import React, { useState, useEffect} from 'react';
import { EndGameManually, GetGameById } from '../../API_handler';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
const GameControl = () => {
  // Mock data for demonstration
  const {gameId} = useParams();
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState({});
  const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
   GetGameById(gameId).then((res)=>{
    if(res && res.status === 200){
      const bookedSeats = res.data.seats.filter(seat => seat.isOccupied === true ).length;
      const totalSeats = res.data.seats.length;
      const remainingSeats = totalSeats - bookedSeats;
      setGameStats({
        totalSeats: totalSeats,
        bookedSeats: bookedSeats,
        remainingSeats: remainingSeats,
        gameStatus: res.data.status
      })
    }
   }).catch((e)=>{
    console.log(e);
   }).finally(()=>{
    setLoading(false);
   })
},[])


  

  const handleEndGame = () => {
   EndGameManually(gameId).then((res)=>{
     alert(res.message);
     navigate('/admin/dashboard');
   })
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Game Control</h1>
        <button
        onClick={()=> navigate('/admin/dashboard') }
        className=' bg-black text-white w-24 h-10 rounded-lg  '
        >Back</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Total Seats</h2>
            <p className="text-3xl font-bold text-blue-600">{gameStats.totalSeats}</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Booked Seats</h2>
            <p className="text-3xl font-bold text-green-600">{gameStats.bookedSeats}</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Remaining Seats</h2>
            <p className="text-3xl font-bold text-yellow-600">{gameStats.remainingSeats}</p>
          </div>
        </div>

        <div className="flex justify-center">
          {gameStats.gameStatus === 'active' ? (
            <button
              onClick={handleEndGame}
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              End Game
            </button>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold text-red-600 mb-2">Game Ended</p>
              <p className="text-gray-600">The game has been ended by the admin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameControl; 