const Chat = require("../../models/chat");

const sendMessages = async () => {
  try {
    const userID = req.user._id;
    const existingChat = await Chat.findOne({
      participants: {
        $all: [userID, req.params.userId],
        $size: 2,
      },
    }).populate("participants", "username");

    if (existingChat) return res.json(existingChat);

    // Create new chat
    const newChat = new Chat({
      participants: [userID, req.params.userId],
    });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const startChat = async () => {
  try {
    const userID = req.user._id;
    const { chatId, content } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: {
            sender: userID,
            content: content,
          },
        },
      },
      { new: true }
    );

    // Emit socket.io event
    io.to(chatId).emit("new message", chat.messages.slice(-1)[0]);

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "username"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  sendMessages,
  startChat,
  getMessages,
};
