const Chat = require("../../models/chat");

const StartChat = async (req, res) => {
  try {
    const userID = req.User._id;
    console.log(req.body);
    // console.log(req.body.participants.senderID);

    const { receiverID, senderID } = req.body.participants;
    console.log(receiverID);

    if (!receiverID)
      return res.status(402).json({ message: "ReciverID not found" });
    if (!userID) return res.status(401).json({ message: "user id not found" });
    const existingChat = await Chat.findOne({
      participants: {
        $all: [userID, receiverID],
        $size: 2,
      },
    }).populate("participants", "username");

    if (existingChat)
      return res.json({ message: "existingchat", existingChat });

    // Create new chat
    const newChat = new Chat({
      participants: [userID, receiverID],
    });
    await newChat.save();
    return res.status(201).json(newChat);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err.message });
  }
};

const startMessage = async (req, res) => {
  try {
    const userID = req.User._id;
    const { chatId, content } = req.body;

    console.log();
    if (!userID) return res.status(401).json({ message: "Unauthorized" });
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
    // console.log(err);

    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "username"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat.messages);
  } catch (err) {
    // console.log(err);

    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  StartChat,
  startMessage,
  getMessages,
};
