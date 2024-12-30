"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
import Loader from "../../components/Loader";

export default function BookingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (id && user?.token) {
      const fetchDetails = async () => {
        try {
          const response = await axios.get(
            `https://workwise-l26d.onrender.com/api/seats/booked-seats/${id}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setDetails(response.data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [id, user?.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!details || !details.bookedSeats || details.bookedSeats.length === 0) {
    return (
      <div className="flex  flex-col justify-center items-center h-screen">
        <h2 className="text-center text-lg font-semibold">
          No Booking Details Found
        </h2>
        <div className="mt-6 text-center">
        <button
          onClick={() => router.back()} // Navigate back to the previous page
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <h2 className="text-2xl font-bold text-center mb-6">Booking Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {details.bookedSeats.map((seat) => (
          <div
            key={seat.id}
            className="p-4 bg-gray-100 rounded-lg shadow-md text-center"
          >
            <p className="text-lg font-semibold text-gray-800">Seat Number: {seat.id}</p>
            <p className="text-md text-gray-600">Row Number: {seat.row_number}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => router.back()} // Navigate back to the previous page
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
