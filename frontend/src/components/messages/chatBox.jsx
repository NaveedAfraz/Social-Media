import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

function ChatBox({ chatOpen, selectedChat, socket }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  const userInfo = useSelector((state) => state.auth);
  const senderID = selectedChat?.userID;
  const receiverID = selectedChat?.receiverID;
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", selectedChat?.id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3006/api/Communication/${selectedChat.id}/messages`,
        { withCredentials: true }
      );
      return data;
    },
    enabled: !!selectedChat?.id,
  });

  const startChatMutation = useMutation({
    mutationFn: async ({ content, senderID, receiverID }) => {
      const { data } = await axios.post(
        `http://localhost:3006/api/Communication/startChat`,
        {
          participants: { senderID: senderID, receiverID: receiverID },
          message: content,
        },
        { withCredentials: true }
      );
      console.log(data);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["messages", selectedChat.id]);
      const chatId = data._id;

      socket.emit("join chat", chatId);
      queryClient.invalidateQueries(["messages", chatId]);
      setNewMessage("");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      const { data } = await axios.post(
        `http://localhost:3006/api/Communication/sendMessage/:${userInfo._id}`,
        { chatId, content },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["messages", data._id]);

      const lastMessage = data.messages.slice(-1)[0];
      socket.emit("new message", lastMessage);

      setNewMessage("");
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      console.log(selectedChat);

      startChatMutation.mutate({
        receiverID: receiverID,
        content: newMessage,
        senderID: senderID,
      });
    }
  };
  // console.log(selectedChat);

  return (
    <div className="flex-[4_4_0] w-full">
      <div className="text-white text-xl font-bold p-4 w-full bg-amber-300">
        {chatOpen && selectedChat
          ? `Chat with ${selectedChat.username}`
          : "Select a chat to start chatting"}
      </div>
      {chatOpen && selectedChat && (
        <div className="p-4">
          {isLoading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="space-y-2">
              {messages &&
                messages.map((msg) => (
                  <div key={msg._id} className="p-2 bg-gray-200 rounded">
                    <strong>{msg.senderUsername}: </strong>
                    {msg.content}
                  </div>
                ))}
            </div>
          )}
          <div className="mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="p-2 border rounded w-full"
            />
            <button
              onClick={handleSendMessage}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              disabled={sendMessageMutation.isLoading}
            >
              {sendMessageMutation.isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
