import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGameAPI, uploadImage } from '../../API_handler';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
const CreateGame = () => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [gameDataToSubmit, setGameDataToSubmit] = useState(null);
  const initialGameState = {
    gameName: '',
    description: '',
    additionalInfo: '',
    universalGift: '',
    universalGiftImage: '',
    totalSeats: '',
    freeSeats: '',
    paidSeats: '',
    seats: [],
    defaultPrice: ''
  };

  const [gameDetails, setGameDetails] = useState(initialGameState);
  const [imagePreview, setImagePreview] = useState('');
  const [showPriceSettings, setShowPriceSettings] = useState(true);
  const [universalPaidPrice, setUniversalPaidPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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
  }; const handleSubmit = (e) => {
    e.preventDefault();

    // Don't set loading true during validation phase
    const validationErrors = [];
    const MAX_NAME_LENGTH = 100;
    const MIN_NAME_LENGTH = 3;
    const MAX_DESCRIPTION_LENGTH = 1000;
    const MAX_PRICE = 999999; // Set a reasonable max price

    // Game name validations
    if (!gameDetails.gameName.trim()) {
      validationErrors.push("Game name is required");
    } else {
      // Check for invalid characters in game name
      if (!/^[a-zA-Z0-9\s\-_]+$/.test(gameDetails.gameName)) {
        validationErrors.push("Game name can only contain letters, numbers, spaces, hyphens and underscores");
      }
    }

    // Description validations (if provided)
    if (gameDetails.description && gameDetails.description.length > MAX_DESCRIPTION_LENGTH) {
      validationErrors.push(`Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`);
    }

    // Basic seat validations
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

    if (totalSeats > 100) {
      validationErrors.push("Total seats cannot exceed 100");
    }

    // Strict validation for seat counts
    if (freeSeats + paidSeats !== totalSeats) {
      validationErrors.push(`Total seats (${totalSeats}) must equal sum of free (${freeSeats}) and paid seats (${paidSeats})`);
    }

    // Price validations for paid seats
    const paidSeatsWithoutPrice = gameDetails.seats.filter(
      seat => seat.isPaid && (!seat.price && seat.price !== 0)
    );

    if (paidSeatsWithoutPrice.length > 0) {
      validationErrors.push("All paid seats must have a price set");
    }

    // Validate price ranges and format
    const invalidPrices = gameDetails.seats.filter(
      seat => seat.isPaid && (
        seat.price > MAX_PRICE ||
        seat.price < 0 ||
        !Number.isInteger(Number(seat.price))
      )
    );

    if (invalidPrices.length > 0) {
      validationErrors.push(`All paid seat prices must be whole numbers between 0 and ${MAX_PRICE}`);
    }

    // Validate selected paid seats match the count
    const selectedPaidSeats = gameDetails.seats.filter(seat => seat.isPaid).length;
    if (selectedPaidSeats !== paidSeats) {
      validationErrors.push(`Number of selected paid seats (${selectedPaidSeats}) must match the specified paid seats count (${paidSeats})`);
    }

    // Validate gift text length if provided
    if (gameDetails.universalGift && gameDetails.universalGift.length > 200) {
      validationErrors.push("Universal gift description must be at most 200 characters");
    } if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    // Prepare data for API
    const gameData = {
      ...gameDetails,
      gameName: gameDetails.gameName.trim(),
      description: gameDetails.description?.trim(),
      additionalInfo: gameDetails.additionalInfo?.trim(),
      universalGift: gameDetails.universalGift?.trim(),
      seats: gameDetails.seats.map(seat => ({
        ...seat,
        price: seat.isPaid ? (seat.price || 0) : 0,
        gift: seat.gift?.trim() || ''
      }))
    };

    setGameDataToSubmit(gameData);
    setShowConfirmDialog(true);
  }; const handleConfirmCreate = async () => {
    try {
      setLoading(true);
      const res = await CreateGameAPI(gameDataToSubmit);
      toast.success(res.message);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Failed to create game. Please try again.");
      setLoading(false); // Make sure to set loading false if there's an error
    } finally {
      setShowConfirmDialog(false);
    };
  }; const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }

      setUploadingImage(true);
      const formData = new FormData();
      formData.append('giftImage', file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);      // Upload image using API handler
      const data = await uploadImage(formData);
      setGameDetails(prev => ({
        ...prev,
        universalGiftImage: data.imageUrl
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  // Cleanup function for image preview
  const cleanupImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
  };

  // Cleanup effect for image preview
  useEffect(() => {
    return () => {
      cleanupImagePreview();
    };
  }, []);

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 p-6">
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmCreate}
        title="Create New Game"
        message="Are you sure you want to create this game? Please confirm all the seat settings and prices are correct."
      />
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
          <div className="space-y-6">
            {/* Game Name - Full width */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Game Name</label>
              <input
                type="text"
                value={gameDetails.gameName}
                onChange={(e) => setGameDetails(prev => ({ ...prev, gameName: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                required
                placeholder="Enter Game Name"
              />
            </div>

            {/* Seats Configuration - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Seats</label>
                <input
                  type="number"
                  value={gameDetails.totalSeats}
                  onChange={handleNumberOfSeatsChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  min="1"
                  max="100"
                  required
                  placeholder="Enter total seats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Free Seats</label>
                <input
                  type="number"
                  value={gameDetails.freeSeats}
                  onChange={handleFreeSeatsChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  min="0"
                  max={gameDetails.totalSeats}
                  required
                  placeholder="Enter free seats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Paid Seats</label>
                <input
                  type="number"
                  value={gameDetails.paidSeats}
                  onChange={handlePaidSeatsChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  min="0"
                  max={gameDetails.totalSeats}
                  required
                  placeholder="Enter paid seats"
                />
              </div>
            </div>

            {/* Universal Price Setting */}
            {gameDetails.totalSeats > 0 && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Universal Price for Paid Seats ($)</label>
                <input
                  type="number"
                  value={universalPaidPrice}
                  onChange={handleUniversalPaidPriceChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  min="0"
                  placeholder="Enter universal price"
                />
              </div>
            )}

            {/* Gift Configuration - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Universal Gift</label>
                <input
                  type="text"
                  value={gameDetails.universalGift}
                  onChange={(e) => setGameDetails(prev => ({ ...prev, universalGift: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                  placeholder="Enter universal gift"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Universal Gift Image</label>
                <div className="mt-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={uploadingImage}
                    />
                  </div>

                  {uploadingImage && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <Loader />
                      <span>Uploading image...</span>
                    </div>
                  )}

                  {gameDetails.universalGiftImage && !uploadingImage && (
                    <div className="flex items-center space-x-4">
                      <img
                        src={gameDetails.universalGiftImage}
                        alt="Universal gift"
                        className="h-20 w-20 object-cover rounded-md shadow-md"
                      />
                      <span className="text-sm text-green-600">✓ Image uploaded successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Game Information - Full width fields */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={gameDetails.description}
                onChange={(e) => setGameDetails(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                rows={3}
                placeholder="Enter game description"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Additional Information</label>
              <textarea
                value={gameDetails.additionalInfo}
                onChange={(e) => setGameDetails(prev => ({ ...prev, additionalInfo: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border-2 p-2"
                rows={3}
                placeholder="Enter additional information"
              />
            </div>
          </div>

          {/* Individual Seat Settings */}
          {gameDetails.totalSeats > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Individual Seat Settings</h3>
                <button
                  type="button"
                  onClick={() => setShowPriceSettings(!showPriceSettings)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showPriceSettings ? 'Hide Settings' : 'Show Settings'}
                </button>
              </div>

              {showPriceSettings && (
                <div className="mt-4">
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;