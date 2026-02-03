// RoomCard.jsx
export default function RoomCard({ name, id }) {
  return (
    <div
      onClick={() => (window.location.href = `/whiteboard/${id}`)}
      className="p-4 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-800"
    >
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-gray-400 text-sm">{id}</p>
    </div>
  );
}
