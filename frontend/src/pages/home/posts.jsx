// import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/home/post";
import PostSkeleton from "../../components/skeleton/postSkeleton";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Posts = ({ feedType }) => {
  console.log(feedType);
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  let url;
  switch (feedType) {
    case "following":
      url = "http://localhost:3006/api/posts/fetchfollowingPost";
      break;
    case "all":
      url = "http://localhost:3006/api/posts/fetchAllPosts";
      break;
    case "posts":
      url = `http://localhost:3006/api/posts/fetchUserPosts/${userInfo?._id}`;
      break;
    case "likes":
      url = `http://localhost:3006/api/posts/fetchLikedPosts/${userInfo?._id}`;
      break;
    default:
      url = "http://localhost:3006/api/posts/fetchAllPosts";
  }
  console.log(url);
  const {
    isLoading,
    data: POSTS,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        // const url =
        //   feedType === "following"
        //     ? "http://localhost:3006/api/posts/fetchfollowingPost"
        //     : "http://localhost:3006/api/posts/fetchAllPosts";

        const response = await axios.get(url, { withCredentials: true });
        console.log(response.data);

        return response.data;
      } catch (error) {
        console.error("Fetch error: ", error.response?.data || error.message);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 100,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log("Error fetching posts:", error);
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {console.log(POSTS)}
      {!isLoading && !isError && POSTS?.length > 0 && POSTS && (
        <div>
          {POSTS.map((post) => (
            <P ost key={post._id} post={post} />
          ))}
        </div>
      )}
      {isError && (
        <p className="text-center my-4 text-red-500">
          {(error.response?.data?.message || "Please Login in ")||
            error.message ||
            "An error occurred"}
        </p>
      )}
    </>
  );
};
export default Posts;