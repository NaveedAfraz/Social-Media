const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
app.use(express.json({limit: "50mb"}));
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


// console.log(process.env.MONGODB_URL);
const authRoutes = require("./routes/auth/auth");
const userRoutes = require("./routes/user/user");
const postRoutes = require("./routes/post/post");
const nodificationRoutes = require("./routes/nodification/nodification");
const db = require("./db/database");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/nodification", nodificationRoutes);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // console.log("data base connected", db);
});
