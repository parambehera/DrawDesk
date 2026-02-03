
const Room = require("../models/Room.js");
// CREATE ROOM
exports.createRoom = async (req, res) => {
  try {
    const { roomId, roomName, email } = req.body;
    
    const room = new Room({ roomId, roomName, createdBy: email });
    await room.save();

    res.json({ message: "Room created", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ROOMS OF USER
exports.getRooms = async (req, res) => {
  try {
    // console.log("Rooms is called");
    const { email } = req.query;
    // console.log("Fetching rooms for email:", email);
    const rooms = await Room.find({ createdBy: email }).sort({ createdAt: -1 });
    // console.log("Rooms fetched:", rooms);
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RENAME ROOM
exports.renameRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { newName } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { roomName: newName },
      { new: true }
    );

    res.json({ message: "Room renamed", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ROOM
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findOneAndDelete({ roomId: req.params.roomId });

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 