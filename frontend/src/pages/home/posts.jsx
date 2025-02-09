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
  const username = location.pathname.split("/").pop();
  
  console.log(username);
  
  // Compute error immediately based on feedType, userInfo, and username.
  const computedError =
    feedType === "likes" && userInfo?.username !== username
      ? "Cannot fetch liked posts for this user at the moment"
      : "";

  // Set the URL based on feedType.
  let url;
  switch (feedType) {
    case "following":
      url = "http://localhost:3006/api/posts/fetchfollowingPost";
      break;
    case "all":
      url = "http://localhost:3006/api/posts/fetchAllPosts";
      break;
    case "posts":
      url = `http://localhost:3006/api/posts/fetchUserPosts/${username}`;
      break;
    case "likes":
      if (feedType === "likes" && userInfo?.username === username) {
        console.log(userInfo);
        url = `http://localhost:3006/api/posts/fetchLikedPosts/${userInfo?._id}`;
      } else {
        url = undefined; // Not a valid URL when error condition holds.
      }
      break;
    default:
      url = "http://localhost:3006/api/posts/fetchAllPosts";
  }

  const {
    isLoading,
    data: POSTS,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // Immediately throw an error if our computed error exists.
      if (computedError) {
        throw new Error(computedError);
      }
      // If no valid URL exists, return an empty array.
      if (!url) {
        return [];
      }
      const response = await axios.get(url, { withCredentials: true });
      console.log(response);

      return response.data;
    },
    // Disable query execution if there is a computed error.
    enabled: computedError === "",
    retry: 2,
    retryDelay: 100,
  });

  // Optionally refetch if location or feedType changes and there's no error.
  useEffect(() => {
    if (computedError === "") {
      refetch();
      console.log("Refetching posts...");
    }
  }, [location.pathname, feedType, computedError, refetch]);

  return (
    <>
      {/* Display the computed error immediately if it exists */}
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
            <Post key={post._id} post={post} />
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
