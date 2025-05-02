import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListAllSeats } from '../../API_handler';

const MonitorSeats = () => {
  const {gameId} = useParams(); // Assuming gameId is passed as a URL parameter
  const navigate = useNavigate()
  // Mock data for demonstration
  const [seats, setSeats] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      status: 'available', // available, booked, selected
      userName: null
    }))
  );

  useEffect(()=>{

    ListAllSeats(gameId).then((res)=>{
      if(res.status === 200 ){
        const updatedSeats = res.data.map((seat) => {
          return {
            id: seat.seatNumber,
            status: seat.isOccupied ? 'booked' : 'available',
            userName: seat.userId ? seat.userId.username : null
          };
        });
        setSeats(updatedSeats);
      }else{
        console.error("Error fetching seats data");
      }
    })
  

  },[])

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-red-500';
      case 'selected':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Monitor Seats</h1>
        <button
        onClick={()=> navigate('/admin/dashboard') }
        className=' bg-black text-white w-24 h-10 rounded-lg  '
        >Back</button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4 cursor-pointer sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  ">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`p-4 rounded-lg text-white text-center cursor-pointer transition-colors
                ${getSeatColor(seat.status)} hover:opacity-90`}
            >
              <div className="font-bold">Seat {seat.id}</div>
              {seat.userName && (
                <div className="text-sm mt-1">{seat.userName}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorSeats; 