import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import axios from "axios";
const NotificationPage = () => {
  // const isLoading = false;
  // const notifications = [];
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/nodification/FetchNodification`,
          {
            withCredentials: true,
          }
        );
        if (res.status !== 200 || res.status == 404 || res.status == 500)
          throw new Error(res.data?.error || "Something went wrong");
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error);
        queryClient.setQueryData(["notifications"], []);
        throw new Error("Failed to fetch notifications");
      }
    },
    retry: 1,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      queryClient.setQueryData(["notifications"], []);
    },
  });

  const {
    isLoading: loadingDelete,
    mutate: deleteNotification,
    error: deleteError,
    isSuccess: deleteSuccess,
  } = useMutation({
    mutationFn: async ({ nodificationOneID }) => {
      console.log(nodificationOneID);
      let url;
      if (nodificationOneID) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/nodification/DeleteNodification/${nodificationOneID}`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/nodification/DeleteNodification`;
      }
      try {
        const response = await axios.delete(url, { withCredentials: true });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to delete notifications");
      }
    },
    onSuccess: () => {
      console.log("Notifications deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const deleteNotifications = () => {
    // alert("All notifications deleted");
    deleteNotification({ nodificationOneID: null });
  };
  console.log(notifications);

  const handleDeleteOne = (id) => {
    console.log(id);
    deleteNotification({ nodificationOneID: id });
  };
  console.log(notifications);

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {/* {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )} */}
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div className="border-b border-gray-700" key={notification._id}>
              <div className="flex justify-between items-center gap-2 p-4">
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}
                <Link to={`/profile/${notification.senderId.username}`}>
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={
                          notification.profileImg || "/avatar-placeholder.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">
                      @{notification.senderId.username}
                    </span>
                    {notification.type === "follow"
                      ? "followed you"
                      : notification.message}
                  </div>
                </Link>
                <button
                  onClick={() => handleDeleteOne(notification._id)}
                  className="btn btn-xs btn-circle btn-ghost *:hover:bg-transparent"
                >
                  X
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
      </div>
    </>
  );
};
export default NotificationPage;
