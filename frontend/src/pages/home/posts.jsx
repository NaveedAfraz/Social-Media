// import Post from "./Post";
import Post from "../../components/home/post";
import PostSkeleton from "../../components/skeleton/postSkeleton";

const Posts = () => {
  const isLoading = true;
  const POSTS = [];
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
      {!isLoading && (
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
