const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.use("/api/users", require("./routes/userRoutes"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.emit("me", socket.id);

  socket.on("callUser", ({ to, offer, name }) => {
    io.to(to).emit("incomingCall", { from: socket.id, offer, name });
  });

  socket.on("acceptCall", ({ to, answer }) => {
    io.to(to).emit("callAccepted", { from: socket.id, answer });
  });

  socket.on("iceCandidate", ({ to, candidate }) => {
    io.to(to).emit("iceCandidate", { from: socket.id, candidate });
  });

  socket.on("endCall", ({ to }) => {
    io.to(to).emit("callEnded");
  });
});

server.listen(PORT, () => console.log("Server running on", PORT));
