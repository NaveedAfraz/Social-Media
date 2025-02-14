import XLogo from "../../assets/X-black-copy.jpg";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../../redux/authSlice";
import { FaMessage } from "react-icons/fa6";
import { ShowChat } from "../../redux/messagesControlSlice";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const data = {
  //   fullName: "John Doe",
  //   username: "johndoe",
  //   profileImg: "/avatars/boy1.png",
  // };
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const queryClient = useQueryClient();
  const {
    isError,
    isSuccess,
    mutate: logoutMutate,
  } = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3006/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    cacheTime: 0,
    staleTime: 0,
    onSuccess: (data) => {
      console.log("Logout successful");
      console.log(data);
      if (data.success) {
        // navigate("/login");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        dispatch(isAuth(false));
      }
    },
    onError: (error) => {
      console.log("Logout failed", error);
    },
  });

  const handleLogout = () => {
    // alert("Logout");
    logoutMutate();
  };
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default link behavior
    console.log("Login navigation triggered");
    navigate("/login");
  };
  console.log(userInfo);
  const { isVisbile } = useSelector((state) => state.Chat);
  return (
    <div className="md:flex-[2_2_0]  max-w-64">
      <div className="sticky top-0 left-0 p-3 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/home" className="flex justify-center md:justify-start">
          <img
            src={XLogo}
            className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900"
          />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/home"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <button
              onClick={() => {
                console.log("Profile invalidated");
                navigate(`/profile/${userInfo?.username}`);
              }}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </button>
          </li>
          <li className="flex justify-center md:justify-start">
            <button
              onClick={() => {
                navigate(`/messages`);
                dispatch(ShowChat({ isVisbile: false }));
              }}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaMessage className="w-6 h-6" />
              <span className="text-lg hidden md:block">Messages</span>
            </button>
          </li>
        </ul>
        {userInfo ? (
          <Link
            to={`/profile/${userInfo.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={userInfo?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {userInfo?.fullName}
                </p>
                <button
                  onClick={() => {
                    console.log("Profile invalidated");
                    queryClient.invalidateQueries(["userProfile"]).then(() => {
                      navigate(`/profile/${userInfo?.username}`);
                    });
                  }}
                >
                  @{userInfo?.username}
                </button>
              </div>
              {userInfo ? (
                <BiLogOut
                  onClick={handleLogout}
                  className="w-5 h-5 cursor-pointer"
                />
              ) : (
                <BiLogIn
                  onClick={handleLogin}
                  className="w-5 h-5 cursor-pointer"
                ></BiLogIn>
              )}
            </div>
          </Link>
        ) : (
          <div className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818]  py-2 px-4 rounded-full">
            <BiLogIn className="w-6 h-6" />
            <button onClick={handleLogin} className="text-center">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
