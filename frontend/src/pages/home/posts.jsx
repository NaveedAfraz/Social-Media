import { useQuery } from "@tanstack/react-query";
import Post from "../../components/home/post";
import PostSkeleton from "../../components/skeleton/postSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const ProfileUsername = location.pathname.split("/").pop();
  // console.log(username);

  // const { username } = userInfo;
  // Compute error immediately based on feedType, userInfo, and username.
  const computedError =
    feedType === "likes" && userInfo?.username !== ProfileUsername
      ? "Cannot fetch liked posts for this user at the moment"
      : "";

  // Set the URL based on feedType.
  let url;
  switch (feedType) {
    case "following":
      url =
        "https://social-media-85xj.onrender.com/api/posts/fetchfollowingPost";
      break;
    case "all":
      url = "https://social-media-85xj.onrender.com/api/posts/fetchAllPosts";
      break;
    case "posts":
      url = `https://social-media-85xj.onrender.com/api/posts/fetchUserPosts/${ProfileUsername}`;
      break;
    case "likes":
      if (feedType === "likes" && userInfo?.username === ProfileUsername) {
        url = `https://social-media-85xj.onrender.com/api/posts/fetchLikedPosts/${userInfo?._id}`;
      } else {
        url = undefined; // Not a valid URL when error condition holds.
      }
      break;
    default:
      url = "https://social-media-85xj.onrender.com/api/posts/fetchAllPosts";
  }
  console.log(ProfileUsername);

  const {
    isLoading,
    data: POSTS,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts", feedType, ProfileUsername],
    queryFn: async () => {
      console.log("loading is ", isLoading);
      if (computedError) {
        throw new Error(computedError);
      }

      if (!url) {
        return [];
      }
      console.log("url is ", url);

      const response = await axios.get(url, { withCredentials: true });
      console.log(response);

      return response.data;
    },

    enabled: computedError === "",
    retry: 2,
    retryDelay: 100,
  });

  useEffect(() => {
    if (computedError === "") {
      refetch();
      console.log("Refetching posts...");
    }
  }, [location.pathname, feedType, computedError, refetch]);
  console.log("loading is ", isLoading);
  console.log("posts are ", POSTS);

  return (
    <>
      {computedError && (
        <div className="text-center my-4 text-red-500">{computedError}</div>
      )}

      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && POSTS?.length === 0 && computedError === "" && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && !isError && POSTS?.length > 0 && (
        <div>
          {POSTS.map((post) => (
            <Post
              key={post._id}
              post={post}
              feedType={feedType}
              ProfileUsername={ProfileUsername}
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center my-4 text-red-500">
          {error.response?.data?.message ||
            error.message ||
            "An error occurred"}
        </p>
      )}
    </>
  );
};

export default Posts;
