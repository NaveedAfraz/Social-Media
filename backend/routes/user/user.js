const express = require("express");
const { protectedRoute } = require("../../middleware/authReCheck");
const {
  getUserProfile,
  followUnfollowUserProfile,
} = require("../../controller/user/user");
const router = express.Router();

router.get("/getUser/:username", protectedRoute, getUserProfile);
router.post("/follow/:id", protectedRoute, followUnfollowUserProfile);

module.exports = router;
