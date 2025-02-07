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

router.get("/fetchAllPosts", protectedRoute, fetchAllPosts);
router.get("/fetchfollowingPost", protectedRoute, fetchfollowingPost);
router.get("/fetchUserPosts/:id", protectedRoute, fetchUserPosts);


router.get("/fetchLikedPosts/:id", protectedRoute, fetchLikedPosts);
router.post("/createPost", protectedRoute, CreatePost);
router.post("/likes/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/deletePost/:postid", protectedRoute, deletePost);
module.exports = router;
