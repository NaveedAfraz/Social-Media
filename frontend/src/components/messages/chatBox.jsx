import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function ChatBox({ chatOpen, selectedChat, socket }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", selectedChat?.id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3006/api/Communication/${selectedChat.id}/messages`
      );
      return data;
    },
    enabled: !!selectedChat?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      const { data } = await axios.post(`http://localhost:3006/api/Communication/sendMessage`, { chatId, content });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["messages", selectedChat.id]);

      const lastMessage = data.messages.slice(-1)[0];
      socket.emit("new message", lastMessage);
      setNewMessage("");
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      sendMessageMutation.mutate({
        chatId: selectedChat.id,
        content: newMessage,
      });
    }
  };

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
