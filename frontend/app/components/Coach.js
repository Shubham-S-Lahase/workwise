import Seat from "./Seat";
import Loader from "./Loader";

export default function Coach({ data, loading }) {
  return (
    <div className="flex flex-col gap-4 text-center">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Sample Seat Indicators */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <Seat seatNumber="" status="available" />
              <p className="font-bold text-gray-800">Available</p>
            </div>
            <div className="flex items-center gap-2">
              <Seat seatNumber="" status="booked" isBooked="true" />
              <p className="font-bold text-gray-800">Booked</p>
            </div>
          </div>

          {/* Render Seat Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 bg-gray-100 p-4 rounded-lg">
            {data.map((seat) => (
              <Seat
                key={seat.id}
                seatNumber={seat.id}
                isBooked={seat.is_booked}
                status={seat.is_booked ? "booked" : "available"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
