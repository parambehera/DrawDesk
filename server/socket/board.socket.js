const Room = require("../models/Room");

module.exports = (io, socket) => {
  
  // Load board when user joins
  socket.on("get-board", async ({ roomId }) => {
    try {
      let board = await Room.findOne({ roomId });

      if (!board) {
        board = await Room.create({
          roomId,
          elements: []
        });
      }

      socket.emit("board-data", board.elements);
    } catch (err) {
      console.error("Error loading board:", err);
    }
  });

  // When board updates
  socket.on("board-update", async ({ roomId, boardData }) => {
    try {
      await Room.findOneAndUpdate(
        { roomId },
        { $set: { elements: boardData, updatedAt: new Date() } },
        { upsert: true }
      );

      socket.to(roomId).emit("board-data", boardData);
    } catch (err) {
      console.error("Error saving board:", err);
    }
  });

};
