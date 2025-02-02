const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET,PUT,POST,DELETE"],
  })
);

// console.log(process.env.MONGODB_URL);
const authRoutes = require("./routes/auth/auth");
const db = require("./db/database");
app.use("/api/auth", authRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
 // console.log("data base connected", db);
});
