export default function Seat({ seatNumber, isBooked }) {
  const seatStyles = `w-10 h-10 flex items-center justify-center rounded text-white font-bold text-sm ${
    isBooked ? "bg-yellow-500" : "bg-green-500"
  }`;

  return <div className={seatStyles}>{seatNumber}</div>;
}
