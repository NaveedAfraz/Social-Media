import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeleton/RigthSkeleton";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useFollow from "../../hooks/followUnfollow";

const RightPanel = () => {
  const queryClient = useQueryClient();
  const { isLoading, data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/suggestedUsers`,
        {
          withCredentials: true,
        }
      );
      return res.data.suggested;
    },
    onSuccess: (data) => {
      console.log("onSuccess triggered with data:", data);

      queryClient.invalidateQueries(["userProfile"]).then(() => {
        console.log("Invalidated userProfile");
      });
    },
    onError: (error) => {
      console.error("Error fetching suggested users:", error);
    },
  });
  console.log("Suggested Users:", suggestedUsers);

  const { follow, isPending } = useFollow();

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        {suggestedUsers?.length !== 0 && (
          <p className="font-bold text-center pb-5">Suggested Users for you</p>
        )}
        <div className="flex flex-col gap-4">
          {/* item */}

          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      {user.profileImg ? (
                        <img src={user.profileImg} alt={user.username} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.username?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    Follow
                  </button>
                </div>
              </Link>
            ))}
          {suggestedUsers?.length === 0 && (
            <div className="md:w-64 w-0 text-center h-7 font-bold">
              No suggested users for you
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
