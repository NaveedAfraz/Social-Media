const user = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const protectedRoute = async (req, res, next) => {
  const token = req.cookies.authtoken;
  // console.log("token is here", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized ,Please login in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      console.log("Token verification failed");
      return res.status(401).json({ message: "Unauthorized", succes: false });
    }
    // console.log("decoded is token is here", decoded);

    const storeduser = await user.findById(decoded.id).select("-password");

    if (!storeduser) {
      console.log("User not found");
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }
    req.User = storeduser;
    // console.log(storeduser,"stored user");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized ." });
  }
};

module.exports = { protectedRoute };
