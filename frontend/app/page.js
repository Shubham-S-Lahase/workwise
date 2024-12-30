"use client";

import { useEffect, useState } from "react";
import Coach from "./components/Coach";
import BookingBox from "./components/BookingBox";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://workwise-l26d.onrender.com/api/seats/seats");
      setData(response.data.availableSeats);
    } catch (error) {
      console.error("Error fetching seats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-around items-center gap-4 sm:h-screen bg-gray-200 p-4">
      <Coach data={data} loading={loading} />
      <BookingBox fetchData={fetchData} />
    </div>
  );
}