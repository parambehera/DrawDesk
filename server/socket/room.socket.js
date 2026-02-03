// socket/room.socket.js

module.exports = (io, socket) => {
  // JOIN ROOM
  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);

    // console.log(`👤 ${user} joined room ${roomId}`);

    // notify others in the room
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      user,
    });
  });

  // LEAVE ROOM (optional but good)
  socket.on("leave-room", ({ roomId, user }) => {
    socket.leave(roomId);

    // console.log(`👤 ${user} left room ${roomId}`);

    socket.to(roomId).emit("user-left", {
      socketId: socket.id,
      user,
    });
  });
};
