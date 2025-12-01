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
import { useNavigate, useLocation } from "react-router-dom";
function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isVisbile } = useSelector((state) => state.Chat);
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on the main messages page (no username in URL)
    if (location.pathname === '/messages') {
      // Reset chat state when going back to main messages page
      setChatOpen(false);
      setSelectedChat(null);
      dispatch(ShowChat({ isVisbile: false }));
    }
  }, [location.pathname, dispatch]);
  const handleChatOpen = ({ receiverUserName, senderUserName, receiverProfile }) => {
    setChatOpen(true);

    const data = {
      senderUserName,
      receiverUserName,
    };
    console.log(data);
    naviagte(`/messages/${receiverUserName}`);
    setSelectedChat({ ...data, receiverProfile });
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
      console.log(userInfo)
      const results = userInfo.following.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())

      );
      setFilteredFollowing(results);
    }
  }, [searchQuery, userInfo?.following]);

  return (
    <>
      <div
        className={`${!isVisbile ? "flex" : "hidden"
          } flex-[4_4_0] flex-col border-r border-gray-700 min-h-screen bg-black`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-900 rounded-full transition-colors duration-200">
              <BiSolidMessageSquareAdd className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-gray-900 rounded-full transition-colors duration-200">
              <IoSettings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            filtered={filteredFollowing}
            handleChatOpen={handleChatOpen}
            setSelectedChat={setSelectedChat}
          />
        </div>
      </div>
      {isVisbile && (
        <ChatBox
          chatOpen={chatOpen}
          selectedChat={selectedChat}
          socket={socket}
          receiverProfile={selectedChat?.receiverProfile}
        />
      )}
    </>
  );
}

export default Messages;
