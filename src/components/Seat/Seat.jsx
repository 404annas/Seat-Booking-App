import React from "react";
import CustomerPreview from "../Preview/CustomerPreview";

const Seat = ({ seat }) => {
  console.log(seat.number);
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer
        text-white text-xs relative group transition-all duration-300
        ${seat.isBooked ? "bg-red-600" : "bg-green-600"}`}
    >
      {seat.number}
      {seat.user && (
        <div className="absolute top-full left-0 -translate-x-1/2 mt-2 hidden group-hover:block z-20">
          <CustomerPreview user={seat.user} />
        </div>
      )}
    </div>
  );
};

export default Seat;
