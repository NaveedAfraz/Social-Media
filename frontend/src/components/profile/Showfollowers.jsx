import React from "react";
import { useNavigate } from "react-router-dom";

function ShowfollowersModal({ isModalOpen, setIsModalOpen, user }) {
  const navigate = useNavigate();
  console.log(user,"..")
  return (
    <dialog open={isModalOpen} className="modal">
      <div className="modal-box max-w-lg w-full max-h-[80vh] bg-black border border-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">
            {user?.length > 0 ? `${user.length} Followers` : "Followers"}
          </h3>
          <button
            className="p-2 hover:bg-gray-900 rounded-full transition-colors duration-200 text-white"
            onClick={() => setIsModalOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {user?.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {user.map((follower) => (
                <div
                  key={follower._id}
                  onClick={() => {
                    navigate(`/profile/${follower.username}`);
                    setIsModalOpen(false);
                  }}
                  className="flex items-center p-4 hover:bg-gray-900 cursor-pointer transition-colors duration-200 group"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    {follower.profileImg ? (
                      <img 
                        src={follower.profileImg} 
                        alt={follower.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {follower.username[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors duration-200">
                      {follower.username}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      @{follower.username}
                    </p>
                  </div>

                  {/* Follow Button */}
                  <div className="flex-shrink-0">
                    <button
                      className="px-3 py-1 text-xs font-medium text-white border border-gray-600 rounded-full hover:bg-gray-800 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add follow/unfollow logic here
                      }}
                    >
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No followers yet</p>
              <p className="text-gray-600 text-sm mt-1">When someone follows this account, they'll appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="modal-backdrop bg-black/50 backdrop-blur-sm"
        onClick={() => setIsModalOpen(false)}
      />
    </dialog>
  );
}

export default ShowfollowersModal;
