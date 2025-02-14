import React from "react";

const ChatBoxSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
        <div className="skeleton h-4 w-32 rounded"></div>
      </div>

      {/* Chat messages skeleton */}
      <div className="flex flex-col gap-2">
        <div className="skeleton w-3/4 h-6 rounded-lg"></div>
        <div className="skeleton w-1/2 h-6 rounded-lg"></div>
        <div className="skeleton w-2/3 h-6 rounded-lg"></div>
        <div className="skeleton w-full h-6 rounded-lg"></div>
        <div className="skeleton w-5/6 h-6 rounded-lg"></div>
      </div>

      {/* Input skeleton */}
      <div className="skeleton w-full h-10 rounded-lg mt-4"></div>
    </div>
  );
};

export default ChatBoxSkeleton;
