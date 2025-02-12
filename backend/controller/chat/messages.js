const Chat = require("../../models/chat");
const { Message } = require("../../models/messages");

const StartChat = async (req, res) => {
  try {
    // const userID = req.User._id;
    // console.log("body", req.body);
    const senderUsername = req.body.senderUsername;
    const receiverUsername = req.body.receiverUsername;
    // const senderUsername = await user.findOne({
    //   username: req.body.senderUsername,
    // });
    // const receiverUsername = await user.findOne({
    //   username: req.body.receiverUsername,
    // });

    if (!receiverUsername)
      return res.status(402).json({ message: "Recivername not found" });
    if (!senderUsername)
      return res.status(401).json({ message: "user id not found" });

    const existingChat = await Chat.findOne({
      participants: { $all: [senderUsername, receiverUsername] },
    });
    // console.log("existingChat :", existingChat);

    if (existingChat)
      return res.json({ message: "existingchat", existingChat });
    // console.log("existingChat :", existingChat);

    // Create new chat
    const newChat = new Chat({
      participants: [senderUsername, receiverUsername],
    });
    // console.log("newChat :", newChat);

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
    if (!chatId)
      return res.status(400).json({ message: "Chat ID is required" });

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    if (!userID) return res.status(401).json({ message: "Unauthorized" });
    const newMessage = await Message.create({
      sender: userID,
      content: content,
      chat: chatId,
    });

    // 2. Push the message ID into Chat (if you maintain a messages array)
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
    });

    const io = req.app.locals.io;
    // Emit socket.io event
    io.to(chatId).emit("new message", newMessage);

    //console.log(content);
    return res.status(201).json(newMessage);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "username",
      },
    });

    console.log("shat", chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json(chat);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  StartChat,
  startMessage,
  getMessages,
};
