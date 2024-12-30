"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Seat from "./Seat";
import { useUser } from "../../context/UserContext";

export default function BookingBox({ fetchData }) {
  const [numberOfSeat, setNumberOfSeat] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const handleBooking = async () => {
    if (!user) {
      setErrorMessage("You need to log in first to book seats.");
      return;
    }

    if (numberOfSeat > 7 || numberOfSeat <= 0) {
      alert("Invalid seat number (1-7 allowed).");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(
        "https://workwise-l26d.onrender.com/api/seats/book",
        {
          numOfSeats: parseInt(numberOfSeat),
          user_id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Seats booked successfully.");
      setBookedSeats(response.data.seats)
      // console.log(response);
      fetchData();
      const viewBookings = window.confirm("Do you want to see your bookings?");
      if (viewBookings) {
        router.push(`/bookings/${response.data.user_id}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  const handleViewBookings = () => {
    if (user) {
      router.push(`/bookings/${user.id}`);
    } else {
      setErrorMessage("You need to log in first to view your bookings.");
    }
  };

  const handleResetBookings = async () => {
    if (!user) {
      setErrorMessage('You need to log in first to reset bookings.');
      return;
    }

    setProcessing(true);
    try {
      await axios.post(
        'https://workwise-l26d.onrender.com/api/seats/reset',
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert('Bookings reset successfully.');
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred while resetting bookings.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs p-4 bg-white rounded-lg shadow-md">
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}

      {/* Display booked seats or a message if there are none */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <h2 className="font-semibold text-gray-900">Booked Seats:</h2>
        {bookedSeats.length > 0 ? (
          bookedSeats.map((seat) => (
            <Seat key={seat} seatNumber={seat} isBooked={true} />
          ))
        ) : (
          <p className="text-gray-500">No seats booked yet.</p>
        )}
      </div>

      {/* Seat booking input */}
      <input
        type="number"
        placeholder="Enter number of seats"
        required
        value={numberOfSeat}
        onChange={(e) => setNumberOfSeat(e.target.value)}
        disabled={processing}
        className="p-2 border border-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Book Seats Button */}
      <button
        onClick={handleBooking}
        disabled={processing}
        className={`py-2 rounded text-white ${
          processing ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } transition duration-200`}
      >
        {processing ? "Processing..." : "Book Seats"}
      </button>
      <button
        onClick={handleViewBookings}
        disabled={processing}
        className={`py-2 rounded text-white ${
          processing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } transition duration-200`}
      >
        See Your Bookings
      </button>

       {/* Conditionally render Reset Booking button if the user is an admin */}
       {user?.role === 'admin' && (
        <button
          onClick={handleResetBookings}
          disabled={processing}
          className={`py-2 rounded text-white ${
            processing ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
          } transition duration-200`}
        >
          {processing ? 'Resetting...' : 'Reset Bookings'}
        </button>
      )}
    </div>
  );
}
