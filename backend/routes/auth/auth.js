const express = require("express");
const router = express.Router();
const {
  Login,
  Register,
  logout,
  authReCheck,
} = require("../../controller/auth/auth");
const { protectedRoute } = require("../../middleware/authReCheck");

router.post("/authReCheck", protectedRoute, authReCheck);
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", logout);

module.exports = router;
