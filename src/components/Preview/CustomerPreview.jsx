import React from "react";

const CustomerPreview = ({ user }) => {
  return (
    <div className="bg-white flex items-center shadow-lg rounded-md p-2 sm:w-40 w-32 text-center sm:text-sm text-xs z-50">
      <img
        src={user.image}
        alt={user.name}
        className="sm:w-10 sm:h-10 w-6 h-6 rounded-full mx-auto my-2"
      />
      <div className="flex flex-col">
        <div className="text-gray-500 font-semibold">{user.name}</div>
        <div className="text-gray-500">{user.nickname}</div>
      </div>
    </div>
  );
};

export default CustomerPreview;
