const mongoose = require("mongoose");
require("dotenv").config(); 


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Get the connection object
const db = mongoose.connection;

// Handle connection errors
db.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
});

module.exports = db;
