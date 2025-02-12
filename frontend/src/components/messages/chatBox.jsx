import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

function ChatBox({ chatOpen, selectedChat, socket }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messagesArr, setMessagesArr] = useState([]);
  const userInfo = useSelector((state) => state.auth);

  const senderUser = selectedChat?.senderUserName;
  const receiverUser = selectedChat?.receiverUserName;

  const {
    data: fetchedMessages,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3006/api/Communication/${chatId}/messages`,
          { withCredentials: true }
        );
        console.log("chatId in useQuery", chatId);
        console.log("data in useQuery", data);
        if (data && data.messages) {
          setMessagesArr(data.messages);
        }
        return data.messages;
      } catch (error) {
        console.error("Error fetching messages in queryFn:", error);
        throw error;
      }
    },
    enabled: !!chatId,
    onSuccess: (data) => {
      console.log("Messages fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching messages:", error);
    },
  });

  const startChatMutation = useMutation({
    mutationFn: async ({ senderUsername, receiverUsername }) => {
      try {
        const { data } = await axios.post(
          `http://localhost:3006/api/Communication/startChat`,
          { senderUsername, receiverUsername },
          { withCredentials: true }
        );
        console.log("startChat response data:", data);
        return data;
      } catch (error) {
        console.error("Error in startChatMutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("startChatMutation onSuccess:", data);
      if (data.existingChat._id) {
        setChatId(data.existingChat._id);
      } else {
        const newChatId = data._id;
        setChatId(newChatId);
      }

      // setChatId(data.existingChat._id);
      socket.emit("join chat", chatId);
      queryClient.invalidateQueries(["messages", newChatId]);
      setNewMessage("");
    },
    onError: (error) => {
      console.error("startChatMutation onError:", error);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      try {
        const { data } = await axios.post(
          `http://localhost:3006/api/Communication/sendMessage/${senderUser}`,
          { chatId, content },
          { withCredentials: true }
        );
        console.log("data in sendMessageMutation", data);
        return data;
      } catch (error) {
        console.error("Error in sendMessageMutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      const lastMessage = data;
      console.log("lastMessage", lastMessage);

      setMessagesArr((prev) => [...prev, lastMessage]);
      socket.emit("new message", lastMessage);
      setNewMessage("");
    },
    onError: (error) => {
      console.error("sendMessageMutation onError:", error);
    },
  });

  // console.log(selectedChat);

  useEffect(() => {
    startChatMutation.mutate({
      chatId: chatId,
      receiverUsername: receiverUser,
      content: newMessage,
      senderUsername: senderUser,
    });
  }, [selectedChat]);

  console.log("chatID :", chatId);

  // useEffect(() => {
  //   if (chatId) {
  //     queryClient.invalidateQueries(["messages", chatId]);
  //     console.log("running1");
  //   }
  // }, [chatId,newMessage]);
  // console.log(selectedChat);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incomingMessage) => {
      setMessagesArr((prev) => [...prev, incomingMessage]);
    };
    console.log("running");

    socket.on("new message", handleNewMessage);
    return () => socket.off("new message", handleNewMessage);
  }, [socket]);
  console.log(messagesArr);

  const handleSendMessage = () => {
    if (newMessage.trim() && !chatId) {
      console.log(selectedChat);
      setMessagesArr("");
    } else {
      sendMessageMutation.mutate({ chatId, content: newMessage });
    }
  };

  return (
    <div className="flex-[4_4_0] w-full">
      <div className="text-white text-xl font-bold p-4 w-full bg-amber-300">
        {chatOpen && selectedChat
          ? `Chat with ${selectedChat.receiverUserName}`
          : "Select a chat to start chatting"}
      </div>
      {chatOpen && selectedChat && (
        <div className="p-4">
          {isLoading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="space-y-2">
              {messagesArr.map((msg, index) => (
                <div
                  key={`${msg._id}-${index}`}
                  className="p-2 bg-blue-700 rounded"
                >
                  <strong>{msg?.sender.username}: </strong>
                  {msg?.content}
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
