import React from "react";
import Seats from "../Seats/Seats";

const FlightCard = () => {
  return (
    <div className="bg-white min-h-screen p-4 rounded-3xl mx-auto max-w-4xl">
      <div className="bg-slate-200 shadow rounded p-4 mb-4 w-full">
        <div className="flex flex-wrap justify-between text-sm text-gray-700">
          <span className="mb-2 sm:mb-0">Flight: AI-202</span>
          <span className="mb-2 sm:mb-0">Departure: 10:30 AM</span>
          <span className="mb-2 sm:mb-0">Arrival: 12:45 PM</span>
          <span className="mb-2 sm:mb-0">Gate: B4</span>
        </div>
      </div>
      <Seats />
    </div>
  );
};

export default FlightCard;
