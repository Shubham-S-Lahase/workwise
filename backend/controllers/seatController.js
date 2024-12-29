const { sql } = require("../config/db");

// Constants
const TOTAL_ROWS = 12;
const SEATS_PER_ROW = 7;
const LAST_ROW_SEATS = 3;

// Booking Controller
const bookingController = async (req, res) => {
  const { numOfSeats, user_id } = req.body;

  // Validate the number of seats to be booked
  if (numOfSeats > SEATS_PER_ROW) {
    return res
      .status(400)
      .json({ message: "Cannot book more than 7 seats at a time." });
  }

  try {
    // Get all available seats ordered by row and seat number
    const availableSeats = await sql`
      SELECT * FROM seats WHERE is_booked = false ORDER BY row_number, seat_number
    `;

    // If there are not enough available seats
    if (availableSeats.length < numOfSeats) {
      return res.status(400).json({
        message: `Only ${availableSeats.length} seats are available.`,
      });
    }

    let bookedSeats = [];

    // Try to book seats in the same row
    for (let row = 1; row <= TOTAL_ROWS; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.row_number === row);
      const availableInRow = rowSeats.filter((seat) => !seat.is_booked).length;

      // Special case for the last row with fewer seats
      if (row === TOTAL_ROWS && rowSeats.length === LAST_ROW_SEATS) {
        // Check if enough seats are available in the last row
        if (availableInRow >= numOfSeats) {
          bookedSeats = rowSeats
            .filter((seat) => !seat.is_booked)
            .slice(0, numOfSeats);
          const seatIdsToBook = bookedSeats.map((seat) => parseInt(seat.id));
          const formattedArray = `{${seatIdsToBook.join(",")}}`;

          // Update seats as booked in the database
          await sql`
            UPDATE seats 
            SET is_booked = true, user_id = ${user_id} 
              WHERE id = ANY(${formattedArray}::int[])
          `;

          return res.status(200).json({
            message: "Seats booked successfully in the last row.",
            seats: bookedSeats.map((seat) => seat.seat_number),
          });
        }
      } else if (availableInRow >= numOfSeats) {
        bookedSeats = rowSeats
          .filter((seat) => !seat.is_booked)
          .slice(0, numOfSeats);
        const seatIdsToBook = bookedSeats.map((seat) => parseInt(seat.id));
        const formattedArray = `{${seatIdsToBook.join(",")}}`;
        // console.log(typeof(seatIdsToBook[0]));

        // Update seats as booked in the database
        await sql`
          UPDATE seats 
          SET is_booked = true, user_id = ${user_id} 
          WHERE id = ANY(${formattedArray}::int[])
        `;

        return res.status(200).json({
          message: "Seats booked successfully in the same row.",
          seats: bookedSeats.map((seat) => seat.seat_number),
        });
      }
    }

    // If no full row is available, book seats from nearby rows
    let finalSeats = [];
    for (let row = 1; row <= TOTAL_ROWS; row++) {
      const rowSeats = availableSeats.filter((seat) => seat.row_number === row);
      finalSeats.push(...rowSeats.filter((seat) => !seat.is_booked));
      if (finalSeats.length >= numOfSeats) break;
    }

    // If we found enough seats, book them
    if (finalSeats.length >= numOfSeats) {
      finalSeats = finalSeats.slice(0, numOfSeats);
      const seatIdsToBook = finalSeats.map((seat) => parseInt(seat.id));
      const formattedArray = `{${seatIdsToBook.join(",")}}`;

      // Update seats as booked in the database
      await sql`
        UPDATE seats 
        SET is_booked = true, user_id = ${user_id} 
        WHERE id = ANY(${formattedArray}::int[])
      `;

      return res.status(200).json({
        message: "Seats booked successfully in nearby rows.",
        seats: finalSeats.map((seat) => seat.seat_number),
      });
    }

    // If not enough seats were found
    return res
      .status(400)
      .json({ message: "Booking failed. Not enough available seats." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// Admin Reset Controller
const resetSeatsController = async (req, res) => {
  try {
    // Reset all seats to unbooked
    await sql`UPDATE seats SET is_booked = false, user_id = NULL`; // Clear user_id when resetting
    res.status(200).json({ message: "All seats have been reset." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Get All Seats
const getSeats = async (req, res) => {
  try {
    // Get all available seats
    const availableSeats = await sql`
      SELECT * FROM seats ORDER BY row_number, seat_number
    `;
    return res.status(200).json({ availableSeats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Booked Seats for Specific User
const getBookedSeats = async (req, res) => {
  const { user_id } = req.params; // Get user_id from route parameters

  try {
    // Get all seats booked by the specified user, with seat details
    const bookedSeats = await sql`
      SELECT seat_number, row_number FROM seats WHERE user_id = ${user_id} AND is_booked = true ORDER BY row_number, seat_number
    `;

    if (bookedSeats.length === 0) {
      return res.status(404).json({ message: "No seats booked by this user." });
    }

    return res.status(200).json({
      message: "Booked seats found",
      bookedSeats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  bookingController,
  resetSeatsController,
  getSeats,
  getBookedSeats,
};
