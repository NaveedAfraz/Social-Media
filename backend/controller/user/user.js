const user = require("../../models/userSchema");

const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await user.findone({ username: username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", User: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const followUnfollowUserProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const userid = req.User._id; // logged in user id
    // console.log(userid, "userid is this ");
    const userToModify = await user.findById(id); // user to follow/unfollow
    const currentuser = await user.findById(userid); // logged in user
    // console.log(userToModify, "userto modiy is this ");

    if (!userToModify || !userid) {
      console.log("userid or userToModify not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (currentuser._id == id) {
      console.log("User cannot follow/unfollow themselves");
      return res
        .status(400)
        .json({ message: "User cannot follow/unfollow themselves" });
    }

    if (userToModify.followers.includes(userid)) {
      //umfollow
      await user.findByIdAndUpdate(id, {
        $pull: { followers: userid },
      });
      await user.findByIdAndUpdate(userid, { $pull: { following: id } });
      return res.status(200).json({ message: "User unfollowed" });
    } else {
      //follow
      await user.findByIdAndUpdate(userid, {
        $push: { following: id },
      });
      await user.findByIdAndUpdate(id, { $push: { followers: userid } });
      return res.status(200).json({ message: "User followed" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { getUserProfile, followUnfollowUserProfile };
