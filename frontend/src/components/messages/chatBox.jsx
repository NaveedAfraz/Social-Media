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
  const [socketMessages, setSocketMessages] = useState([]);

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
        if (data) {
          console.log("data.messages");

          setMessagesArr(fetchedMessages);
          console.log(messagesArr);
        }
        return data.messages;
      } catch (error) {
        console.error("Error fetching messages in queryFn:", error);
        throw error;
      }
    },
    enabled: !!chatId,
    staleTime: 0,
    onSuccess: (data) => {
      console.log("Messages fetched successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching messages:", error);
    },
  });
  console.log(fetchedMessages);

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
      // if (data.existingChat._id) {
      //   setChatId(data.existingChat._id);
      // } else {
      //   const newChatId = data._id;
      //   setChatId(newChatId);
      // }
      const newChatId = data.existingChat?._id || data._id;
      // Update the state
      setChatId(newChatId);
      // setChatId(data.existingChat._id);
      socket.emit("join chat", chatId);
      queryClient.invalidateQueries(["messages", chatId]);
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
      console.log("New message received: ", incomingMessage);

      setMessagesArr((prev) => {
        return [...prev, incomingMessage];
      });
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
              {fetchedMessages?.map((msg, index) => (
                <div
                  key={`${msg._id}-${index}`}
                  className={`flex flex-col w-[80%] ${
                    msg.sender.username === senderUser ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`text-sm font-semibold mb-1 ${
                      msg.sender.username === senderUser
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {msg.sender.username}
                  </div>
                  <div
                    className={`p-3 rounded-lg break-words ${
                      msg.sender.username === senderUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
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
