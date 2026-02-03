import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:4000",
  {
  withCredentials: true,
  }
);

export default socket;
