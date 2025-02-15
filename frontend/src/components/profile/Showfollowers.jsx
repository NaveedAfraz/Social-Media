import React from "react";
import { useNavigate } from "react-router-dom";

function ShowfollowersModal({ isModalOpen, setIsModalOpen, user }) {
  const navigate = useNavigate();

  return (
    <dialog open={isModalOpen} className="modal">
      <div className="modal-box h-[70%] w-[90%] z-10 bg-black border border-white">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white hover:bg-gray-800 cursor-pointer"
          onClick={() => {
            setIsModalOpen(false);
            // console.log(isModalOpen);
            // console.log("Modal closed");
          }}
        >
          X
        </button>
        {user?.length > 0 ? (
          <div className="overflow-y-auto h-full hover:text-black ">
            {user.map((follower) => (
              <div
                key={follower._id}
                onClick={() => {
                  navigate(`/profile/${follower.username}`);
                  setIsModalOpen(false);
                }}
                className="w-full flex items-center p-4 my- space-x-3 hover:bg-white hover:text-black !important cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200">
                  <span className="text-gray-600 hover:text-black uppercase text-lg h-12 w-12 rounded-full text-center flex items-center justify-center">
                    {follower.username[0]}
                  </span>
                </div>

                <div className="group flex items-center w-full h-12 hover:text-black">
                  <p className="font-semibold text-sm text-white group-hover:text-black">
                    {follower.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-2xl text-white">
            No followers yet
          </div>
        )}
      </div>
    </dialog>
  );
}

export default ShowfollowersModal;
