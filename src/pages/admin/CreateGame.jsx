import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGameAPI } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
const CreateGame = () => {
  const navigate = useNavigate();
  const initialGameState = {
    gameName: '',
    totalSeats: '',
    freeSeats: '',
    paidSeats: '',
    seats: [],
    defaultPrice: ''
  };

  const [gameDetails, setGameDetails] = useState(initialGameState);
  const [showPriceSettings, setShowPriceSettings] = useState(false);
  const [universalPaidPrice, setUniversalPaidPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberOfSeatsChange = (e) => {
    const numSeats = e.target.value === '' ? '' : parseInt(e.target.value);
    if (numSeats === '' || (numSeats >= 0 && numSeats <= 100)) {
      setGameDetails(prev => ({
        ...prev,
        totalSeats: numSeats,
        freeSeats: '', // Reset free seats when total changes
        paidSeats: '', // Reset paid seats when total changes
        seats: numSeats ? Array.from({ length: numSeats }, (_, index) => ({
          seatNumber: index + 1,
          price: '',
          gift: '',
          isPaid: false
        })) : []
      }));
      setUniversalPaidPrice('');
    }
  };

  const handleFreeSeatsChange = (e) => {
    const freeSeatsCount = e.target.value === '' ? '' : parseInt(e.target.value);
    const totalSeats = parseInt(gameDetails.totalSeats) || 0;
    
    if (freeSeatsCount === '' || (freeSeatsCount >= 0 && freeSeatsCount <= totalSeats)) {
      // Calculate paid seats automatically
      const calculatedPaidSeats = freeSeatsCount === '' ? '' : 
                                (totalSeats >= freeSeatsCount ? totalSeats - freeSeatsCount : 0);
      
      setGameDetails(prev => ({
        ...prev,
        freeSeats: freeSeatsCount,
        paidSeats: calculatedPaidSeats,
        // Keep existing seat configurations
        seats: prev.seats.map(seat => ({
          ...seat,
          isPaid: false,
          price: ''
        }))
      }));
    }
  };

  const handlePaidSeatsChange = (e) => {
    const paidSeatsCount = e.target.value === '' ? '' : parseInt(e.target.value);
    const totalSeats = parseInt(gameDetails.totalSeats) || 0;
    
    if (paidSeatsCount === '' || (paidSeatsCount >= 0 && paidSeatsCount <= totalSeats)) {
      // Don't automatically update free seats, just update paid seats
      setGameDetails(prev => ({
        ...prev,
        paidSeats: paidSeatsCount
      }));
    }
  };

  const handleSeatStatusChange = (index, isPaid) => {
    const paidSeatsCount = gameDetails.seats.filter((seat, i) => i !== index && seat.isPaid).length + (isPaid ? 1 : 0);
    const totalPaidSeats = parseInt(gameDetails.paidSeats) || 0;

    if (isPaid && paidSeatsCount > totalPaidSeats) {
      toast.error(`You can only select ${totalPaidSeats} paid seats`);
      return;
    }

    setGameDetails(prev => ({
      ...prev,
      seats: prev.seats.map((seat, i) => 
        i === index ? { 
          ...seat, 
          isPaid,
          price: isPaid ? (universalPaidPrice || '') : ''
        } : seat
      )
    }));
  };

  const handleUniversalPaidPriceChange = (e) => {
    const price = e.target.value === '' ? '' : parseInt(e.target.value);
    if (price === '' || price >= 0) {
      setUniversalPaidPrice(price);
      setGameDetails(prev => ({
        ...prev,
        seats: prev.seats.map(seat => ({ 
          ...seat, 
          price: seat.isPaid ? (price || '') : ''
        }))
      }));
    }
  };

  const handleSeatPriceChange = (index, price) => {
    const parsedPrice = price === '' ? '' : parseInt(price);
    if (parsedPrice === '' || parsedPrice >= 0) {
      setGameDetails(prev => ({
        ...prev,
        seats: prev.seats.map((seat, i) => 
          i === index ? { ...seat, price: parsedPrice || '' } : seat
        )
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = [];
    
    // Basic field validation
    if (!gameDetails.gameName.trim()) {
      validationErrors.push("Game name is required");
    }
    
    if (!gameDetails.totalSeats) {
      validationErrors.push("Total seats is required");
    }

    const totalSeats = parseInt(gameDetails.totalSeats) || 0;
    const freeSeats = parseInt(gameDetails.freeSeats) || 0;
    const paidSeats = parseInt(gameDetails.paidSeats) || 0;
    
    // Validate seat numbers
    if (totalSeats <= 0) {
      validationErrors.push("Please enter a valid number of seats");
    }

    if (freeSeats < 0 || paidSeats < 0) {
      validationErrors.push("Number of free and paid seats cannot be negative");
    }

    // Strict validation for seat counts
    if (freeSeats + paidSeats !== totalSeats) {
      validationErrors.push(`Total seats (${totalSeats}) must equal sum of free (${freeSeats}) and paid seats (${paidSeats})`);
    }

    // Validate paid seats have prices
    const paidSeatsWithoutPrice = gameDetails.seats.filter(
      seat => seat.isPaid && (!seat.price && seat.price !== 0)
    );
    
    if (paidSeatsWithoutPrice.length > 0) {
      validationErrors.push("All paid seats must have a price set");
    }

    // Validate selected paid seats match the count
    const selectedPaidSeats = gameDetails.seats.filter(seat => seat.isPaid).length;
    if (selectedPaidSeats !== paidSeats) {
      validationErrors.push(`Number of selected paid seats (${selectedPaidSeats}) must match the specified paid seats count (${paidSeats})`);
    }

    if (validationErrors.length > 0) {
      validationErrors.map(error => toast.error(error));
      setLoading(false);
      return;
    }

    // Prepare data for API
    const gameData = {
      ...gameDetails,
      seats: gameDetails.seats.map(seat => ({
        ...seat,
        price: seat.isPaid ? (seat.price || 0) : 0,
        gift: seat.gift || ''
      }))
    };

    CreateGameAPI(gameData)
      .then((res) => {
        toast.success(res.message);
        navigate('/admin/dashboard');
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create game. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
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
          <h1 className="text-2xl font-bold text-gray-800">Create New Game</h1>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
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
              onChange={(e) => setGameDetails(prev => ({ ...prev, gameName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              required
              placeholder="Enter Game Name"
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
              max="100"
              required
              placeholder="Enter Number of Seats"
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
              onChange={handleFreeSeatsChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              min="0"
              max={gameDetails.totalSeats}
              required
              placeholder="Enter Number of Free Seats"
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
              onChange={handlePaidSeatsChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
              min="0"
              max={gameDetails.totalSeats}
              required
              placeholder="Enter Number of Paid Seats"
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {gameDetails.seats.map((seat, index) => (
                      <div key={index} className="space-y-1 p-2 border rounded-lg">
                        <label className="block text-xs font-medium text-gray-600">
                          Seat {seat.seatNumber}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`paid-${index}`}
                            checked={seat.isPaid}
                            onChange={(e) => handleSeatStatusChange(index, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={
                              !gameDetails.paidSeats || 
                              (gameDetails.seats.filter(s => s.isPaid).length >= gameDetails.paidSeats && !seat.isPaid)
                            }
                          />
                          <label htmlFor={`paid-${index}`} className="text-xs text-gray-500">
                            Paid Seat
                          </label>
                        </div>
                        <input
                          type="number"
                          value={seat.price}
                          onChange={(e) => handleSeatPriceChange(index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                          placeholder="Price"
                          disabled={!seat.isPaid}
                          min="0"
                        />
                        <input
                          type="text"
                          value={seat.gift || ''}
                          onChange={(e) => setGameDetails(prev => ({
                            ...prev,
                            seats: prev.seats.map((s, i) => 
                              i === index ? { ...s, gift: e.target.value } : s
                            )
                          }))}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                          placeholder="Gift (Optional)"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;