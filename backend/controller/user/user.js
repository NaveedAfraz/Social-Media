const Nodification = require("../../models/nodification");
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
      const notification = new Nodification({
        senderId: userid,
        receiverId: id,
        message: `${currentuser.username} unfollowed you`,
      });
      await notification.save();
      return res
        .status(200)
        .json({ message: "User unfollowed", Nodification: notification });
    } else {
      //follow
      await user.findByIdAndUpdate(userid, {
        $push: { following: id },
      });
      await user.findByIdAndUpdate(id, { $push: { followers: userid } });
      const notification = new Nodification({
        senderId: userid,
        receiverId: id,
        message: `${currentuser.username} started following you`,
      });
      await notification.save();
      return res
        .status(200)
        .json({ message: "User followed", Nodification: notification });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getSuggestedUsers = async (req, res) => {
  const userid = req.User._id;
  try {
    if (!userid) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const currentuser = await user.findById(userid);
    if (!currentuser) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log(currentuser);

    const suggestedUsers = await user.aggregate([
      { $match: { _id: { $ne: userid } } },
      { $sample: { size: 10 } },
    ]);

    const filtering = suggestedUsers.filter((user) => {
      return !currentuser.following.includes(user._id);
    });
    const suggested = filtering.slice(0, 5);
    res.status(200).json({ suggested });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { username, email, coverImg, profileImg, bio } = req.body;
  console.log(username, email, coverImg, profileImg, bio);

  if (!username || !email || !coverImg || !profileImg || !bio) {
    console.log("some of the details to update is missing");
    return res
      .status(400)
      .json({ message: "some of the details to update is missing" });
  }
  const userid = req.User._id;
  try {
    const updatedUser = await user.findByIdAndUpdate(
      userid,
      {
        username,
        email,
        coverImg,
        profileImg,
        bio,
      },
      { new: true }
    );
    console.log(updatedUser);

    if (!updatedUser) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  followUnfollowUserProfile,
  getSuggestedUsers,
  updateUserProfile,
};
