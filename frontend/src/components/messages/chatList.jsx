import React from "react";
import { useSelector } from "react-redux";

function ChatList({ handleChatOpen, filtered }) {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(filtered)
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
              receiverProfile: follow,
            })
          }
        >
          {/* Avatar */}
          <div className="flex items-center justify-center h-12 w-12 rounded-full">
            {follow.profileImg ? (
              <img 
                src={follow.profileImg} 
                alt={follow.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {follow.username[0].toUpperCase()}
                </span>
              </div>
            )}
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
