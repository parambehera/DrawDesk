const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket"); // 👈 ADD
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 INIT SOCKET.IO
initSocket(server);

// ❌ app.listen → ✅ server.listen
server.listen(port, () => console.log(`Server running on ${port}`));
