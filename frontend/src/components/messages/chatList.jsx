import React from "react";
import { useSelector } from "react-redux";

function ChatList({ handleChatOpen }) {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  return (
    <div>
      {userInfo?.following?.map((follow) => {
        return (
          <button
            key={follow._id}
            className="cursor-pointer w-[99%] bg-amber-300 flex *:hover:bg-amber-400 items-center  p-2 rounded-md"
            onClick={() =>
              handleChatOpen({
                userID: follow._id,
                username: follow.username,
                receiverID: userInfo._id,
              })
            }
          >
            {follow.username}
          </button>
        );
      })}
    </div>
  );
}

export default ChatList;
