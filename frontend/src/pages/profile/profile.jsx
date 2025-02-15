import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import Posts from "../home/posts";
import ProfileHeaderSkeleton from "../../components/skeleton/profileSkeleton";
import EditProfileModal from "../profile/editProfile";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import useFollow from "../../hooks/followUnfollow";
import ShowfollowersModal from "../../components/profile/Showfollowers";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const [showFollowing, setShowFollowing] = useState("");
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      console.log("refetching3");
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/api/user/getUser/${
            location.pathname.split("/")[2]
          }`,
          {
            withCredentials: true,
          }
        );
        console.log(res);
        return res.data.User;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: 4,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries(["userProfile"]);

    console.log("refetching2");
    refetch();
  }, [location.pathname]);

  const isMyProfile = user?._id === userInfo?._id;
  // console.log(userInfo);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const POSTS = [];

  const {
    isError,
    isSuccess,
    isLoading: isUpdating,
    mutate: updateProfile,
  } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(
          `${process.env.BACKEND_URL}/api/user/updateUser/${user?._id}`,
          {
            profileImg,
            coverImg,
          },
          { withCredentials: true }
        );
        console.log(res);
        return res.data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(["userProfile"]);
      queryClient.invalidateQueries(["userInfo"]);
      setCoverImg("");
      setProfileImg("");
      setBio("");
      setFullName("");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  console.log(user);

  const handleProfileUpdate = () => {
    console.log("updating profile");
    updateProfile();
  };

  console.log(userInfo);

  const amIFollowing = user?.followers?.some(
    (val) => val?.username === userInfo?.username
  );
  console.log(amIFollowing);
  const [expanded, setExpanded] = useState(false);
  // console.log(showFollowing);

  const { follow, isPending } = useFollow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShowFollowing = (e) => {
    console.log(e);
    setShowFollowing(e);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="flex-[4_4_0]  border-r border-gray-700 min-h-screen">
        {/* HEADER */}
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-4 items-center">
                <Link to="/home">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-64 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />

                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-40 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal user={user} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={() => handleProfileUpdate()}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span
                    className={`text-sm my-1 ${expanded ? "" : "line-clamp-5"}`}
                  >
                    {user?.bio}
                  </span>
                  {user?.bio?.length > 20 && (
                    <button
                      className="text-sm text-blue-500 flex"
                      onClick={() => setExpanded((prev) => !prev)}
                    >
                      {expanded ? "Less..." : "More..."}
                    </button>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@asaprogrammer_"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          youtube.com/@asaprogrammer_
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {user?.createdAt?.split("T")[0]}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 cursor-pointer">
                  <div className="flex gap-1 items-center cursor-pointer">
                    <span className="font-bold text-xs">
                      {user?.following?.length}
                    </span>
                    <button
                      onClick={() => handleShowFollowing("following")}
                      className="text-slate-500 text-xs cursor-pointer"
                    >
                      Following
                    </button>
                  </div>
                  <div className="flex gap-1 items-center cursor-pointer">
                    <span className="font-bold text-xs ">
                      {user?.followers?.length}
                    </span>
                    <button
                      onClick={() => handleShowFollowing("followers")}
                      className="text-slate-500 text-xs cursor-pointer"
                    >
                      Followers
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 y transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} />
          {showFollowing && (
            <ShowfollowersModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              user={user[showFollowing]}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
