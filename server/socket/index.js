const { Server } = require("socket.io");
const roomSocket = require("./room.socket");
const boardSocket = require("./board.socket");
const { rooms } = require("./store");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // console.log("🟢 Socket connected:", socket.id);

    roomSocket(io, socket);
    boardSocket(io, socket); // 🆕

    socket.on("disconnect", () => {
      // console.log("🔴 Socket disconnected:", socket.id);

      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(
          (u) => u.socketId !== socket.id
        );
      }
    });
  });
}

module.exports = { initSocket };
