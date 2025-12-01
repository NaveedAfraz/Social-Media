const express = require("express");
const { protectedRoute } = require("../../middleware/authReCheck");
const {
  CreatePost,
  likeUnlikePost,
  commentPost,
  deletePost,
  fetchAllPosts,
  fetchLikedPosts,
  fetchfollowingPost,
  fetchUserPosts,
} = require("../../controller/post/post");

const router = express.Router();

console.log("Post routes loaded");

router.get("/fetchAllPosts", (req, res, next) => {
  console.log("fetchAllPosts route hit");
  next();
}, fetchAllPosts);
router.get("/fetchfollowingPost", protectedRoute, fetchfollowingPost)
router.get("/fetchUserPosts/:username", fetchUserPosts);
router.get("/fetchLikedPosts/:id", protectedRoute, fetchLikedPosts);
router.post("/createPost", protectedRoute, CreatePost);
router.post("/likes/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/deletePost/:postid", protectedRoute, deletePost);
module.exports = router;
