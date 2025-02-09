const cloudinary = require("cloudinary").v2;
const Nodification = require("../../models/nodification");
const user = require("../../models/userSchema");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res) => {
  const { username } = req.params;
  console.log("username is this ", username);

  try {
    const UserDeatils = await user
      .findOne({ username: username })
      .select("-password");
    console.log("user is this ", UserDeatils);

    if (!UserDeatils) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", User: UserDeatils });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const followUnfollowUserProfile = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const userid = req.User._id;
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
  const { username, email, newPassword, currentPassword, bio } = req.body;

  let coverImg = req.body.coverImg;
  let profileImg = req.body.profileImg;

  console.log(coverImg, profileImg);
  console.log(username, email, bio);
  // if (!username || !email || !bio) {
  //   console.log("some of the details to update is missing");
  //   return res
  //     .status(400)
  //     .json({ message: "some of the details to update is missing" });
  // }
  const userid = req.User._id;
  try {
    const data = await user.findById(userid);

    if (!data) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    let hashedPassword;
    if (currentPassword && newPassword) {
      const check = await bcrypt.compare(currentPassword, data.password);
      if (!check) {
        console.log(check);

        return res
          .status(400)
          .json({ message: "Current password is incorrect didn't match" });
      }

      if (
        (currentPassword && !newPassword) ||
        (newPassword && !currentPassword)
      ) {
        console.log("current password and new password are required");
        return res
          .status(400)
          .json({ message: "current password and new password are required" });
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
      console.log("Cloudinary API Secret: ", process.env.CLOUDINARY_API_SECRET);
    }

    if (profileImg) {
      if (data.profileImg) {
        await cloudinary.uploader.destroy(data.profileImg);
      }
      const updatedImg = await cloudinary.uploader.upload(profileImg);
      profileImg = updatedImg.secure_url;
      console.log("updated img is :", updatedImg);
    }
    if (coverImg) {
      if (data.coverImg) {
        await cloudinary.uploader.destroy(data.coverImg);
      }
      const uploadedCoverImg = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedCoverImg.secure_url;
    }

    const updatedUser = await user.findByIdAndUpdate(
      userid,
      {
        username: username || data.username,
        email: email || data.email,
        password: hashedPassword || data.password,
        coverImg: coverImg || data.coverImg,
        profileImg: profileImg || data.profileImg,
        bio: bio || data.bio,
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
