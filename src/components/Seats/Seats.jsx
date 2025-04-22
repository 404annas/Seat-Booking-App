import React from "react";
import Seat from "../Seat/Seat";

const Seats = () => {
  const rows = 10;
  const columns = 8;

  const generateSeats = (rows, cols) => {
    const seats = [];

    for (let row = 0; row < rows; row++) {
      const rowLetter = String.fromCharCode(65 + row);

      for (let col = 1; col <= cols; col++) {
        let seatId = `${rowLetter}${Number(col)}`;
        console.log(`Generated seat ID: ${seatId}`);
        const random = Math.random() < 0.3;
        seats.push({
          id: seatId,
          number: seatId,
          isBooked: random,
          user: random
            ? {
                name: "Passenger",
                nickname: "Nickname",
                image:
                  "https://images.unsplash.com/photo-1681486902789-077d69cead51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzc2FuZ2VyfGVufDB8fDB8fHww",
              }
            : null,
        });
      }
    }
    return seats;
  };

  const seats = generateSeats(rows, columns);

  return (
    <>
      <div
        className="p-4 w-full gap-2 md:grid hidden justify-center"
        style={{
          display: "",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          justifyItems: "center",
        }}
      >
        {seats.map((seat) => (
          <Seat key={seat.id} seat={seat} />
        ))}
      </div>

      <div className="sm:grid md:hidden hidden grid-cols-4 w-full gap-2 p-4 justify-center">
        {seats.map((seat) => (
          <Seat key={seat.id} seat={seat} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 sm:hidden w-full p-4 justify-center">
        {seats.map((seat) => (
          <Seat key={seat.id} seat={seat} />
        ))}
      </div>
    </>
  );
};

export default Seats;
