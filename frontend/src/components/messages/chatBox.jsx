import React, { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { Send, MoreHorizontal, ArrowLeft } from "lucide-react";
import ChatBoxSkeleton from "../skeleton/chatBoxSkeleton";

function ChatBox({ chatOpen, selectedChat, socket, receiverProfile }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messagesArr, setMessagesArr] = useState([]);
  const userInfo = useSelector((state) => state.auth);

  const senderUser = selectedChat?.senderUserName;
  const receiverUser = selectedChat?.receiverUserName;

  // Start chat mutation
  const startChatMutation = useMutation({
    mutationFn: async ({ senderUsername, receiverUsername }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Communication/startChat`,
        { senderUsername, receiverUsername },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data) => {
      const newChatId = data.existingChat?._id || data._id;
      setChatId(newChatId);

      if (newChatId) {
        socket?.emit("join chat", newChatId);
      }
    },
  });

  // Messages query
  const { data: fetchedMessages, isLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Communication/${chatId}/messages`,
        { withCredentials: true }
      );
      return data.messages;
    },
    enabled: Boolean(chatId),
    staleTime: 0,
  });
  console.log(fetchedMessages)
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }) => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Communication/sendMessage/${senderUser}`,
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

  useEffect(() => {
    if (selectedChat) {
      startChatMutation.mutate({
        senderUsername: senderUser,
        receiverUsername: receiverUser,
      });
    }
  }, [selectedChat]);

  useEffect(() => {
    if (fetchedMessages) {
      setMessagesArr(fetchedMessages);
    }
  }, [fetchedMessages]);

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

    return () => {
      socket.off("new message", handleNewMessage);
    };
  }, [socket, chatId]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    sendMessageMutation.mutate({
      chatId,
      content: newMessage.trim(),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  console.log(selectedChat)
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesArr]);

  return (
    <div className="flex-[4_4_0] mr-auto w-full bg-black border-l border-r border-gray-800">
      {/* Twitter/X Style Header */}
      {chatOpen && selectedChat ? (
        <>
          <div className="sticky top-0 z-10 backdrop-blur-md bg-black/80 border-b border-gray-800">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                <button className="lg:hidden hover:bg-gray-900 rounded-full p-2 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full">
                    {receiverProfile?.profileImg ? (
                      <img
                        src={receiverProfile.profileImg}
                        alt={selectedChat.receiverUserName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {selectedChat.receiverUserName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">
                      {selectedChat.receiverUserName}
                    </h2>
                    <p className="text-gray-500 text-xs">@{selectedChat.receiverUserName}</p>
                  </div>
                </div>
              </div>
              <button className="hover:bg-gray-900 rounded-full p-2 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[calc(100vh-140px)] overflow-y-auto">
            {isLoading ? (
              <ChatBoxSkeleton />
            ) : (
              <div className="px-4 py-4 space-y-4">
                {messagesArr?.map((msg, index) => {
                  if (
                    index === messagesArr.length - 1 &&
                    !msg?.sender?.username
                  ) {
                    return null;
                  }

                  const isCurrentUser = msg.sender.username === senderUser;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl break-words ${isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-800 text-white rounded-bl-sm'
                            }`}
                        >
                          <p className="text-[15px] leading-5">{msg.content}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 px-1">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Twitter/X Style Input */}
          <div className="sticky     border-gray-800 bg-black px-4 py-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-gray-900 rounded-full border border-gray-800 focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Start a new message"
                  className="w-full bg-transparent text-white px-5 py-3 outline-none placeholder-gray-500 text-[15px] border-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed rounded-full p-3 transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">Select a message</h3>
            <p className="text-gray-500 text-[15px]">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;