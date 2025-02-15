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

app.use(
  "/assets",
  express.static(path.join(__dirname, "../frontend/dist/assets"))
);

const fs = require("fs");
app.get("/list-files", (req, res) => {
  const distPath = path.join(__dirname, "../frontend/dist");
  fs.readdir(distPath, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ files });
  });
});

app.get('/*', function(req, res) {
  // Don't serve index.html for API routes or asset requests
  if (req.url.startsWith('/api') || req.url.startsWith('/assets')) {
      return res.status(404).send('Not found');
  }
  
  try {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), function(err) {
          if (err) {
              console.error('Error sending index.html:', err);
              res.status(500).send('Error loading page');
          }
      });
  } catch (error) {
      console.error('Error in catch block:', error);
      res.status(500).send('Server error');
  }
});
console.log('Attempted path:', path.join(__dirname, '../frontend/dist/index.html'));


// console.log(process.env.MONGODB_URL);
const authRoutes = require("./routes/auth/auth");
const userRoutes = require("./routes/user/user");
const postRoutes = require("./routes/post/post");
const nodificationRoutes = require("./routes/nodification/nodification");
const CommunicationRoutes = require("./routes/chat/messages");
const db = require("./db/database");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/nodification", nodificationRoutes);
app.use("/api/Communication", CommunicationRoutes);
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
