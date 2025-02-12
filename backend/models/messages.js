const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  chat: { type: String, ref: "Chat", required: true },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
