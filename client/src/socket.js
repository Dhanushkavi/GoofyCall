import { io } from "socket.io-client";

export const socket = io("https://goofycall.onrender.com/", {
  transports: ["websocket"],
  autoConnect: true, // IMPORTANT: keep it true for simple flow
});
