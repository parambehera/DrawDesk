import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createRoomAPI,
  getRoomsAPI,
  renameRoomAPI,
  deleteRoomAPI,
} from "../api/room";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myRooms, setMyRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    if (user?.email) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    if (!user?.email) return;
    const data = await getRoomsAPI(user.email);
    if (data) {
      setMyRooms(data.rooms || []);
    }
  };

  // Create room handler
  const createRoom = async () => {
    if (!roomName.trim()) return toast.error("Enter room name");
    if (!user?.email) return toast.error("User not logged in");

    // Generate unique room ID
    const roomId = crypto.randomUUID();

    setLoading(true);
    const data = await createRoomAPI({
      roomName: roomName,
      email: user.email,
      roomId: roomId,
    });
    setLoading(false);

    if (data) {
      setIsCreateOpen(false);
      setRoomName("");
      await fetchRooms();
      navigate(`/whiteboard/${data.room.roomId || roomId}`);
    }
  };

  // Join room handler (will be used after socket connections)
  const joinRoom = () => {
    if (!joinCode.trim()) return toast.error("Enter room code");
    navigate(`/whiteboard/${joinCode}`);
  };

  // Rename room handler
  const handleRenameRoom = async () => {
    if (!newRoomName.trim()) return toast.error("Enter new room name");
    if (!editingRoom) return;

    setLoading(true);
    const data = await renameRoomAPI(editingRoom.roomId, newRoomName);
    setLoading(false);

    if (data) {
      setIsRenameOpen(false);
      setEditingRoom(null);
      setNewRoomName("");
      await fetchRooms();
    }
  };

  // Delete room handler
  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;

    setLoading(true);
    const data = await deleteRoomAPI(deletingRoom.roomId);
    setLoading(false);

    if (data) {
      setIsDeleteOpen(false);
      setDeletingRoom(null);
      await fetchRooms();
    }
  };

  // Open delete modal
  const openDeleteModal = (room, e) => {
    e.stopPropagation();
    setDeletingRoom(room);
    setIsDeleteOpen(true);
  };

  // Open rename modal
  const openRenameModal = (room, e) => {
    e.stopPropagation();
    setEditingRoom(room);
    setNewRoomName(room.name);
    setIsRenameOpen(true);
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] px-6 md:px-14 lg:px-20 py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Your Whiteboards
          </h1>
          <p className="text-gray-600 mt-2">
            Create or join a room and collaborate live.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2 rounded-full border border-blue-400 text-blue-700 bg-white/60 backdrop-blur hover:bg-blue-50 transition font-medium shadow-sm"
          >
            Create Room
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="px-6 py-2 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:opacity-95 transition"
          >
            Join Room
          </button>
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myRooms.length === 0 ? (
          <div className="col-span-full">
            <div className="rounded-3xl bg-white/60 border border-white/70 shadow-sm p-10 text-center">
              <p className="text-gray-600 text-lg font-medium">
                No rooms yet.
              </p>
              <p className="text-gray-500 mt-2">
                Create one to start collaborating ✨
              </p>
            </div>
          </div>
        ) : (
          myRooms.map((room) => (
            <div
              key={room.roomId}
              className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/70 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div
                onClick={() => navigate(`/whiteboard/${room.roomId}`)}
                className="cursor-pointer p-6"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {room.roomName}
                </h2>
                <p className="text-sm text-gray-500 mt-2 break-all">
                  {room.roomId}
                </p>
              </div>

              {/* Rename & Delete Buttons */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={(e) => openRenameModal(room, e)}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-white/70 hover:bg-gray-50 transition font-medium"
                >
                  Rename
                </button>

                <button
                  onClick={(e) => openDeleteModal(room, e)}
                  className="flex-1 px-4 py-2 rounded-full border border-red-300 text-red-600 bg-white/70 hover:bg-red-50 transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE ROOM MODAL */}
      {isCreateOpen && (
        <ModalWrapper onClose={() => setIsCreateOpen(false)}>
          <ModalCard title="Create a Room">
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={createRoom}
                disabled={loading}
                className={`px-6 py-2 rounded-full text-white font-semibold shadow transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95"
                }`}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {/* JOIN ROOM MODAL */}
      {isJoinOpen && (
        <ModalWrapper onClose={() => setIsJoinOpen(false)}>
          <ModalCard title="Join a Room">
            <input
              type="text"
              placeholder="Enter room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsJoinOpen(false)}
                className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={joinRoom}
                className="px-6 py-2 rounded-full text-white font-semibold shadow transition bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95"
              >
                Join
              </button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {/* RENAME ROOM MODAL */}
      {isRenameOpen && (
        <ModalWrapper
          onClose={() => {
            setIsRenameOpen(false);
            setEditingRoom(null);
            setNewRoomName("");
          }}
        >
          <ModalCard title="Rename Room">
            <input
              type="text"
              placeholder="Enter new room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsRenameOpen(false);
                  setEditingRoom(null);
                  setNewRoomName("");
                }}
                className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleRenameRoom}
                disabled={loading}
                className={`px-6 py-2 rounded-full text-white font-semibold shadow transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95"
                }`}
              >
                {loading ? "Renaming..." : "Rename"}
              </button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}

      {/* DELETE ROOM MODAL */}
      {isDeleteOpen && (
        <ModalWrapper
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingRoom(null);
          }}
        >
          <ModalCard title="Delete Room">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">"{deletingRoom?.roomName}"</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeletingRoom(null);
                }}
                className="px-5 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteRoom}
                disabled={loading}
                className={`px-6 py-2 rounded-full text-white font-semibold shadow transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-red-600 to-red-500 hover:opacity-95"
                }`}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </ModalCard>
        </ModalWrapper>
      )}
    </main>
  );
}

/* ------------------ Modal Components (UI Only) ------------------ */

function ModalWrapper({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

function ModalCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_30px_80px_rgba(0,0,0,0.18)] p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
