import React, { useEffect, useState } from "react";
import {
  BiMessageAdd,
  BiMessageSquareAdd,
  BiSolidMessageSquareAdd,
} from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import SearchBar from "../../components/messages/searchBar";

import ChatList from "../../components/messages/chatList";
import ChatBox from "../../components/messages/chatBox";
import { useQueryClient } from "@tanstack/react-query";

function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleChatOpen = ({ id, username }) => {
    console.log("Chat opened");
    setChatOpen(true);
    console.log(id);
    setSelectedChat(username);
  };

  useEffect(() => {
    socket.on("new message", (message) => {
      if (selectedChat && message.chatId === selectedChat.id) {
        queryClient.invalidateQueries(["messages", selectedChat.id]);
      }
    });
    return () => {
      socket.off("new message");
    };
  }, [selectedChat, queryClient]);

  return (
    <>
      <div className="flex-[4_4_0] mr-auto w-full border-gray-700 min-h-screen">
        <div className="flex items-center  p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold mb-4 pl-10 mt-2.5 text-white">
            Messages
          </h2>
          <IoSettings className="text-white text-2xl cursor-pointer  mx-2.5 float-right ml-auto" />
          <BiSolidMessageSquareAdd className="text-white text-2xl cursor-pointer" />
        </div>
        <SearchBar />
        <ChatList
          handleChatOpen={handleChatOpen}
          setSelectedChat={setSelectedChat}
        />
      </div>
      <ChatBox chatOpen={chatOpen} selectedChat={selectedChat} />
    </>
  );
}

export default Messages;
