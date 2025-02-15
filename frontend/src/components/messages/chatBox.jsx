import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ChatBoxSkeleton from "../skeleton/chatBoxSkeleton";

function ChatBox({ chatOpen, selectedChat, socket }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messagesArr, setMessagesArr] = useState([]);
  const userInfo = useSelector((state) => state.auth);

  const senderUser = selectedChat?.senderUserName;
  const receiverUser = selectedChat?.receiverUserName;

  // Start chat mutation - now with proper error handling and state management
  const startChatMutation = useMutation({
    mutationFn: async ({ senderUsername, receiverUsername }) => {
      const { data } = await axios.post(
        `https://social-media-85xj.onrender.com/api/Communication/startChat`,
        { senderUsername, receiverUsername },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      const newChatId = data.existingChat?._id || data._id;
      setChatId(newChatId);

      // Only join the chat room if we have a valid chat ID
      if (newChatId) {
        socket?.emit("join chat", newChatId);
      }
    },
  });

  // Messages query - now with proper dependency tracking
  const { data: fetchedMessages, isLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://social-media-85xj.onrender.com/api/Communication/${chatId}/messages`,
        { withCredentials: true }
      );
      console.log(data);

      return data.messages;
    },
    enabled: Boolean(chatId),
    staleTime: 0,
  });

  // Send message mutation - simplified and more robust
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      const { data } = await axios.post(
        `https://social-media-85xj.onrender.com/api/Communication/sendMessage/${senderUser}`,
        { chatId, content },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", chatId]);
      setNewMessage("");
    },
  });

  // Effect to initialize chat when selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      startChatMutation.mutate({
        senderUsername: senderUser,
        receiverUsername: receiverUser,
      });
    }
  }, [selectedChat]);

  // Effect to update messages array when new messages are fetched
  useEffect(() => {
    if (fetchedMessages) {
      setMessagesArr(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Socket event listener - now with proper cleanup and dependency tracking
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (incomingMessage) => {
      setMessagesArr((prev) => {
        if (prev.some((msg) => msg._id === incomingMessage._id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
    };

    socket.on("new message", handleNewMessage);

    // Clean up socket listener when component unmounts or chatId changes
    return () => {
      socket.off("new message", handleNewMessage);
    };
  }, [socket, chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatId) return;

    sendMessageMutation.mutate({
      chatId,
      content: newMessage.trim(),
    });
  };

  const lastMessage = messagesArr[messagesArr.length - 1];

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesArr]);
  const { isVisbile } = useSelector((state) => state.Chat);
  console.log(isVisbile, "isVisbile");
  console.log(messagesArr, "messagesArr");

  return (
    <div className={`flex-[4_4_0] mr-auto w-full border-gray-700`}>
      <div className="text-white text-xl font-bold p-4 w-full ">
        {chatOpen && selectedChat
          ? `Chat with ${selectedChat.receiverUserName}`
          : null}
      </div>

      {chatOpen && selectedChat && (
        <div className="p-4  overflow-y-auto scroll-auto">
          {isLoading ? (
            <ChatBoxSkeleton />
          ) : (
            <div className="space-y-2 h-[100vh] overflow-y-auto scroll-auto ">
              {messagesArr?.map((msg, index) => {
                if (
                  index === messagesArr.length - 1 &&
                  !msg?.sender?.username
                ) {
                  return null;
                }
                return (
                  <div
                    key={msg._id}
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
                );
              })}
              <div ref={bottomRef} />
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
