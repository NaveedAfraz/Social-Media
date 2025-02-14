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
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { ShowChat } from "../../redux/messagesControlSlice";
import { useNavigate } from "react-router-dom";
function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isVisbile } = useSelector((state) => state.Chat);
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const handleChatOpen = ({ receiverUserName, senderUserName }) => {
    setChatOpen(true);

    const data = {
      senderUserName,
      receiverUserName,
    };
    console.log(data);
    naviagte(`/messages/${receiverUserName}`);
    setSelectedChat(data);
    dispatch(ShowChat({ isVisbile: !isVisbile }));
  };

  useEffect(() => {
    socket.on("new message", (message) => {
      if (selectedChat) {
        queryClient.invalidateQueries(["messages", selectedChat.id]);
      }
    });
    return () => {
      socket.off("new message");
    };
  }, [selectedChat, queryClient]);
  const { userInfo } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  useEffect(() => {
    if (userInfo?.following) {
      const results = userInfo.following.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFollowing(results);
    }
  }, [searchQuery, userInfo?.following]);

  return (
    <>
      <div
        className={`${
          !isVisbile ? "block" : "hidden"
        } flex-[4_4_0] mr-auto w-full border-gray-700 min-h-screen`}
      >
        <div className="flex items-center  p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold mb-4 pl-10 mt-2.5 text-white">
            Messages
          </h2>
          <IoSettings className="text-white text-2xl cursor-pointer  mx-2.5 float-right ml-auto" />
          <BiSolidMessageSquareAdd className="text-white text-2xl cursor-pointer" />
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ChatList
          filtered={filteredFollowing}
          handleChatOpen={handleChatOpen}
          setSelectedChat={setSelectedChat}
        />
      </div>
      {isVisbile && (
        <ChatBox
          chatOpen={chatOpen}
          selectedChat={selectedChat}
          socket={socket}
        />
      )}
    </>
  );
}

export default Messages;
