const express = require("express");
const { sendMessages, StartChat, getMessages, startMessage } = require("../../controller/chat/messages");
const { protectedRoute } = require("../../middleware/authReCheck");
const router = express.Router();

router.post("/sendMessage/:userId", protectedRoute, startMessage);
router.post("/startChat", protectedRoute, StartChat);
router.get("/:chatId/messages", protectedRoute, getMessages);

module.exports = router;
