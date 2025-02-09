const post = require("../../models/post");

const cloudinary = require("cloudinary").v2;
const Notification = require("../../models/nodification");
const user = require("../../models/userSchema");
const fetchAllPosts = async (req, res) => {
  try {
    const posts = await post
      .find()
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const CreatePost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userid = req.User._id;

    if (!text) {
      console.log("text is not defined");
      return res.status(400).json({ message: "Text is required" });
    }

    const UserData = await user.findById(userid);
    if (!UserData) {
      return res.status(400).json({ message: "User not found" });
    }

    if (img) {
      const upload = await cloudinary.uploader.upload(img);
      img = upload.secure_url;
    }

    const newPost = new post({ text, img, user: userid });
    await newPost.save();
    return res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postid } = req.params;
    if (!postid) {
      console.log("postid is not there");
      return res.status(400).json({ message: "Post id is required" });
    }

    const userid = req.User._id;
    // console.log("user is this :", userid);
    // console.log("post id is this :", postid);

    if (!userid) {
      console.log("user is not there");
      return res.status(400).json({ message: "User is not Found" });
    }

    // const User = await user.findById(userid);
    // if (!User) return res.status(400).json({ message: "User not found" });

    const Post = await post.findById(postid);
    if (!Post) return res.status(400).json({ message: "Post not found" });

    if (userid.toString() !== Post.user.toString()) {
      console.log("post user is this :", Post.user.toString());
      console.log("user id is this :", userid.toString());
      return res.status(400).json({ message: "User not found" });
    }

    if (Post.img) {
      await cloudinary.uploader.destroy(Post.img);
    }

    const deletepost = await post.findByIdAndDelete(postid);
    if (!deletepost) return res.status(400).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postid = req.params.id;
    if (!postid)
      return res.status(400).json({ message: "Post id is required" });
    if (!text) return res.status(400).json({ message: "Text is required" });

    const userid = req.User._id;

    if (!userid) {
      return res.status(400).json({ message: "User id is required" });
    }

    console.log("post id is this : ", postid);
    const Post = await post.findById(postid);

    if (!Post) return res.status(400).json({ message: "Post not found" });

    const postComment = await post.findByIdAndUpdate(
      postid,
      {
        $push: {
          comments: { text: text, user: userid },
        },
      },
      { new: true }
    );

    if (!postComment)
      return res.status(400).json({ message: "Comment to posted" });

    await postComment.save();
    return res.status(200).json({ message: "Comment posted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const userid = req.User._id;

    if (!userid) {
      return res.status(400).json({ message: "User id is required" });
    }
    const postid = req.params.id;
    if (!postid)
      return res.status(400).json({ message: "Post id is required" });
    console.log(postid);
    const USER = await user.findById(userid);
    const Post = await post.findById(postid);

    if (!Post) return res.status(400).json({ message: "Post not found" });
    console.log(Post.likes);

    if (Post.likes.includes(userid)) {
      const postUnLike = await post.findByIdAndUpdate(postid, {
        $pull: { likes: userid },
      });
      const notification = new Notification({
        senderId: userid,
        receiverId: Post.user._id,
        message: `${USER.username} unliked your post`,
      });
      // console.log("post unlike before appending:", postLike);
      // console.log("unlike id is here", USER.likedPosts[postLike._id]);

      const unlikePost = await user.findByIdAndUpdate(
        userid,
        {
          $pull: { likedPosts: postid },
        },
        { new: true }
      );
      // console.log("this is liked post:", likedPost);

      const updatedPost = await post.findById(postid);
      await notification.save();

      return res
        .status(200)
        .json({ message: "Post unliked successfully", data: updatedPost });
    } else {
      const postLike = await post.findByIdAndUpdate(
        postid,
        {
          $push: { likes: userid },
        },
        { new: true }
      );
      // console.log("post like before appending:", postLike);
      const likedPost = await user.findByIdAndUpdate(userid, {
        $push: { likedPosts: postLike._id },
      });
      // console.log("this is liked post:", likedPost);
      const notification = new Notification({
        senderId: userid,
        receiverId: Post.user._id,
        message: `${USER.username} liked your post`,
      });

      const updatedPost = await post.findById(postid);

      await notification.save();

      return res
        .status(200)
        .json({ message: "Post liked successfully", data: updatedPost });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchLikedPosts = async (req, res) => {
  const userid = req.params.id;

  if (!userid) return res.status(400).json({ message: "User id is required" });
  console.log("this is user id:", userid);

  try {
    const userData = await user.findById(userid);
    if (!userData) return res.status(400).json({ message: "User not found" });

    const likedposts = await post
      .find({ _id: { $in: userData.likedPosts } })
      .populate("user")
      .populate("comments");

    if (!likedposts)
      return res.status(400).json({ message: "No liked posts found" });

    return res.status(200).json(likedposts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchfollowingPost = async (req, res) => {
  const userid = req.User._id;
  // console.log("this is user id:", userid);

  if (!userid) return res.status(400).json({ message: "User id is required" });

  try {
    const userData = await user.findById(userid);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const following = userData.following;
    // console.log(following);

    if (following.length == 0)
      return res.status(400).json({ message: "No following found" });
    const posts = await post.find({ user: userid });
   // console.log("posts:", posts); // Check if this is an array of Mongoose documents

    const followingPosts = await post
      .find({ user: { $in: following } }) // ✅ Corrected query syntax
      .populate("user")
      .populate("comments.user"); // ✅ Populate nested user in comments

   // console.log(followingPosts);

    if (!followingPosts)
      return res.status(400).json({ message: "No posts found" });

    return res.status(200).json(followingPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const User = await user.findOne({ username });
    if (!User) return res.status(404).json({ error: "User not found" });
    console.log(User._id);

    const posts = await post
      .find({ user: User._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  CreatePost,
  commentPost,
  likeUnlikePost,
  deletePost,
  fetchLikedPosts,
  fetchAllPosts,
  fetchUserPosts,
  fetchfollowingPost,
};
