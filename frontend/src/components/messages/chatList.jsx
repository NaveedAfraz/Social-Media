import React from "react";
import { useSelector } from "react-redux";

function ChatList({ handleChatOpen, filtered }) {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="w-full bg-black text-white rounded-xl shadow-sm">
      {filtered?.map((follow) => (
        <button
          key={follow._id}
          className="w-full flex items-center p-4 space-x-3 hover:bg-gray-50 hover:text-black  cursor-pointer transition-colors border-b border-black text-white last:border-b-0"
          onClick={() =>
            handleChatOpen({
              receiverUserName: follow.username,
              senderUserName: userInfo.username,
            })
          }
        >
          {/* Avatar placeholder */}
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200">
            <span className="text-gray-600 uppercase text-lg">
              {follow.username[0]}
            </span>
          </div>

          {/* User info */}
          <div className="text-left">
            <p className="font-semibold text-sm">{follow.username}</p>
            {/* If you have additional user info like display name:
            <p className="text-gray-500 text-sm">@{follow.username}</p> */}
          </div>
        </button>
      ))}
    </div>
  );
}

export default ChatList;
