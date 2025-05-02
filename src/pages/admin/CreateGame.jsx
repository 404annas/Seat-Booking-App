import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adjust the import path as necessary
import { CreateGameAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
const CreateGame = () => {
  const navigate = useNavigate();
  const [gameDetails, setGameDetails] = useState({
    gameName: '',
    totalSeats: null,
    freeSeats: null,
    paidSeats: null,
    seats: [
      { seatNumber: null, price: 0, gift: null, isPaid: false }
    ],
    defaultPrice: 0,
  });

  const [showPriceSettings, setShowPriceSettings] = useState(false);
  const [universalPaidPrice, setUniversalPaidPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNumberOfSeatsChange = (e) => {
    const numSeats = parseInt(e.target.value) || 0;
    setGameDetails(prev => ({
      ...prev,
      totalSeats: numSeats,
      seats: Array.from({ length: numSeats }, (_, index) => ({
        seatNumber: index + 1,
        price: 0,
        gift: " ",
        isPaid: false
      })),
    }));
  };

  const handleDefaultPriceChange = (e) => {
    const price = parseInt(e.target.value) || 0;
    setGameDetails(prev => ({
      ...prev,
      defaultPrice: price,
      seats: prev.seats.map(seat => ({ ...seat, price: seat.isPaid ? universalPaidPrice : 0 }))
    }));
  };

  const handleUniversalPaidPriceChange = (e) => {
    const price = parseInt(e.target.value) || 0;
    setUniversalPaidPrice(price);
    setGameDetails(prev => ({
      ...prev,
      seats: prev.seats.map(seat => ({ 
        ...seat, 
        price: seat.isPaid ? price : 0 
      }))
    }));
  };

  const handleSeatPaidChange = (index, isPaid) => {
    setGameDetails(prev => ({
      ...prev,
      seats: prev.seats.map((seat, i) => ({
        ...seat,
        isPaid: i === index ? isPaid : seat.isPaid,
        price: i === index ? (isPaid ? universalPaidPrice : 0) : seat.price
      }))
    }));
  };

  const handleSeatPriceChange = (index, price) => {
    const parsedPrice = parseInt(price) || 0;
    setGameDetails(prev => ({
      ...prev,
      seats: prev.seats.map((seat, i) => (i === index ? { ...seat, price: parsedPrice } : seat)),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if(gameDetails.totalSeats < gameDetails.freeSeats + gameDetails.paidSeats) {
      alert("Total seats cannot be less than the sum of free and paid seats.");
      return;
    }
    if(gameDetails.totalSeats <= 0) {
      alert("Please enter a valid number of seats.");
      return;
    }

    if(gameDetails.freeSeats < 0 || gameDetails.paidSeats < 0) {
      alert("Number of free and paid seats cannot be negative.");
      return;
    }
    if(gameDetails.freeSeats + gameDetails.paidSeats > gameDetails.totalSeats) {
      alert("Total seats cannot be less than the sum of free and paid seats.");
      return;
    }

    CreateGameAPI(gameDetails)
      .then((res) =>{
        alert(res.message);
        navigate('/admin/dashboard');
      }).catch((err) => {
        console.error(err);
      }).finally(()=>{
        setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Game</h1>
          <button
            onClick={()=> navigate('/admin/dashboard')}
            className='bg-black text-white w-24 h-10 rounded-lg'
          >Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="gameName" className="block text-sm font-medium text-gray-700">
              Game Name
            </label>
            <input
              type="text"
              id="gameName"
              value={gameDetails.gameName}
              onChange={(e) => setGameDetails({ ...gameDetails, gameName: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              required
              placeholder='Enter Game Name'
            />
          </div>

          <div>
            <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700">
              Number of Seats
            </label>
            <input
              type="number"
              id="numberOfSeats"
              value={gameDetails.totalSeats}
              onChange={handleNumberOfSeatsChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              min="1"
              required
              placeholder='Enter Number Of Seats eg:5'
            />
          </div>

          <div>
            <label htmlFor="freeseats" className="block text-sm font-medium text-gray-700">
              Number of Free Seats
            </label>
            <input
              type="number"
              id="freeseats"
              value={gameDetails.freeSeats}
              onChange={(e) => setGameDetails({ ...gameDetails, freeSeats: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              required
              placeholder='Enter Number Of Free Seats'
            />
          </div>

          <div>
            <label htmlFor="paidseats" className="block text-sm font-medium text-gray-700">
              Number of Paid Seats
            </label>
            <input
              type="number"
              id="paidseats"
              value={gameDetails.paidSeats}
              onChange={(e) => setGameDetails({ ...gameDetails, paidSeats: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              required
              placeholder='Enter Number Of Paid Seats'
            />
          </div>

          {gameDetails.totalSeats > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Seat Pricing</h3>
                <button
                  type="button"
                  onClick={() => setShowPriceSettings(!showPriceSettings)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showPriceSettings ? 'Hide Price Settings' : 'Show Price Settings'}
                </button>
              </div>

              <div>
                <label htmlFor="universalPaidPrice" className="block text-sm font-medium text-gray-700">
                  Universal Price for Paid Seats ($)
                </label>
                <input
                  type="number"
                  id="universalPaidPrice"
                  value={universalPaidPrice}
                  onChange={handleUniversalPaidPriceChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  min="0"
                  placeholder="Enter universal price for paid seats"
                />
              </div>

              {showPriceSettings && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Individual Seat Settings</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {gameDetails.seats.map((seat, index) => (
                      <div key={index} className="space-y-1">
                        <label htmlFor={`seat-${index}`} className="block text-xs text-gray-500">
                          Seat {seat.seatNumber}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`paid-${index}`}
                            checked={seat.isPaid}
                            onChange={(e) => handleSeatPaidChange(index, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`paid-${index}`} className="text-xs text-gray-500">
                            Paid Seat
                          </label>
                        </div>
                        <input
                          type="number"
                          id={`seat-${index}`}
                          value={seat.price}
                          onChange={(e) => handleSeatPriceChange(index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                          placeholder="Price"
                          disabled={!seat.isPaid}
                        />
                        <label htmlFor={`Gift-${index}`} className="block text-xs text-gray-500">
                          Gift (Optional)
                        </label>
                        <input
                          type="text"
                          id={`Gift-${index}`}
                          value={seat.gift}
                          onChange={(e) => setGameDetails({ ...gameDetails, seats: gameDetails.seats.map((s, i) => i === index ? { ...s, gift: e.target.value } : s) })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                          placeholder="Gift"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame; 