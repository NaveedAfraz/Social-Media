const express = require("express");
const { sendMessages, startChat, getMessages } = require("../../controller/chat/messages");
const { protectedRoute } = require("../../middleware/authReCheck");
const router = express.Router();

router.post("/sendMessage", protectedRoute, sendMessages);
router.post("/startchat/:userId", protectedRoute, startChat);
router.get("/:chatId/messages", protectedRoute, getMessages);

module.exports = router;
