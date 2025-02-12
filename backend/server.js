const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const dotenv = require("dotenv");
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
dotenv.config();
require("./config/cloudinary");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET,PUT,POST,DELETE"],
  })
);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
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
