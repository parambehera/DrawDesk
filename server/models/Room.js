const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
  elements: { type: Array, default: [] }, // <-- our whiteboard shapes/lines
  createdBy: { type: String, required: true }, // user's email
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);