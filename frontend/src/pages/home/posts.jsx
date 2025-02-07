// import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import Post from "../../components/home/post";
import PostSkeleton from "../../components/skeleton/postSkeleton";
import { useEffect } from "react";
import axios from "axios";

const Posts = ({ feedType }) => {
  console.log(feedType);

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
        const url =
          feedType === "following"
            ? "http://localhost:3006/api/posts/fetchfollowingPost"
            : "http://localhost:3006/api/posts/fetchAllPosts";

        const response = await axios.get(url, { withCredentials: true });
        return response.data;
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        throw error;
      }
    },
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
      {!isLoading && POSTS?.length > 0 && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
