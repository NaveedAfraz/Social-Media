const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
require("dotenv").config({ path: "./.env" });
require("./config/cloudinary");

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
    methods: ["GET,PUT,POST,DELETE"],
  })
);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
app.locals.io = io;
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const fs = require("fs");
app.get("/list-files", (req, res) => {
  const distPath = path.join(__dirname, "../frontend/dist");
  fs.readdir(distPath, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ files });
  });
});

// Simple health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// console.log(process.env.MONGODB_URL);
const authRoutes = require("./routes/auth/auth");
const userRoutes = require("./routes/user/user");
const nodificationRoutes = require("./routes/nodification/nodification");
const CommunicationRoutes = require("./routes/chat/messages");
const db = require("./db/database");

console.log("Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

try {
  const postRoutes = require("./routes/post/post");
  app.use("/api/posts", postRoutes);
  console.log("Post routes loaded successfully");
} catch (error) {
  console.error("Error loading post routes:", error);
}

app.use("/api/nodification", nodificationRoutes);
app.use("/api/Communication", CommunicationRoutes);

// Debug route to catch all API requests
app.use("/api/*", (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

console.log("Routes registered");
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
