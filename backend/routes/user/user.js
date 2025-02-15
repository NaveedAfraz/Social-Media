const express = require("express");
const { protectedRoute } = require("../../middleware/authReCheck");
const {
  getUserProfile,
  followUnfollowUserProfile,
  getSuggestedUsers,
  updateUserProfile,
  // fetchFollowedAndfollowingUsers,
} = require("../../controller/user/user");
const router = express.Router();

router.get("/getUser/:username", protectedRoute, getUserProfile);
// router.get(
//   "/getFollowingAndFollowers/:id",
//   protectedRoute,
//   fetchFollowedAndfollowingUsers
// );
router.post("/follow/:id", protectedRoute, followUnfollowUserProfile);
router.get("/suggestedUsers", protectedRoute, getSuggestedUsers);
router.post("/updateUser/:id", protectedRoute, updateUserProfile);
module.exports = router;
