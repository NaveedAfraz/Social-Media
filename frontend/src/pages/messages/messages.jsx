import React from "react";
import { BiMessageAdd, BiMessageSquareAdd, BiSolidMessageSquareAdd } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";

function Messages() {
  return (
    <div className="flex-[4_4_0] mr-auto w-full border-gray-700 min-h-screen">
      <div className="flex items-center  p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold mb-4 pl-10 mt-2.5 text-white">Messages</h2>
        <IoSettings className="text-white text-2xl cursor-pointer  mx-2.5 float-right ml-auto" />
        <BiSolidMessageSquareAdd className="text-white text-2xl cursor-pointer"/>
      </div>
    </div>
  );
}

export default Messages;
