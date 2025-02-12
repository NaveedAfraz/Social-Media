const mongoose = require("mongoose");
const { messageSchema } = require("../models/messages");

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: String,
      ref: "user",
      required: true,
    },
  ],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
