const express = require("express");
const bcrypt = require("bcryptjs");
const user = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  const { formData } = req.body;
  console.log(formData);

  if (!formData.username || !formData.email || !formData.password) {
    console.log("form Data is missing");
    return res.status(400).json({ error: "formData is missing" });
  }

  try {
    const emailExists = await user.findOne({ email: formData.email });
    const usernameExists = await user.findOne({ userName: formData.username });
    if (emailExists || usernameExists) {
      console.log(emailExists);
      console.log(usernameExists);

      return res.status(400).json({
        error: "User or email already exists",
        success: false,
        message: "User or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const newUser = await user.create({
      ...formData,
      password: hashedPassword,
    });
    console.log(newUser);

    if (newUser) {
      console.log("User created successfully");
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: newUser,
      });
    } else {
      console.log("User not created");
      return res.status(400).json({ error: "User not created" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  const { formData } = req.body;
  console.log(formData);

  if (!formData.password || !formData.email) {
    console.log("email or password is missing");
    return res.status(400).json({ error: "formData is missing" });
  }

  try {
    const userExists = await user.findOne({ email: formData.email });
    if (!userExists) {
      console.log("User does not exist");
      return res.status(400).json({ error: "User does not exist" });
    }

    const matchPassword = await bcrypt.compare(
      formData.password,
      userExists.password
    );
    if (!matchPassword) {
      console.log("Password does not match");
      return res
        .status(400)
        .json({ error: "Password does not match", success: false });
    }

    const Authtoken = jwt.sign(
      {
        id: userExists._id,
        email: userExists.email,
        userName: userExists.username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("authtoken", Authtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, user: userExists });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  // const { formData } = req.body;

  try {
    if (req.cookies.authtoken) {
      console.log(req.cookies.authtoken);

      res.clearCookie("authtoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: "No cookie found" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const enrichFollowData = async (connections = []) => {
  const usernames = connections
    ?.map((connection) => connection?.username)
    .filter(Boolean);

  if (!usernames?.length) return connections || [];

  const profiles = await user
    .find({ username: { $in: usernames } })
    .select("username profileImg coverImg bio")
    .lean();

  const profileMap = new Map(
    profiles.map((profile) => [profile.username, profile])
  );

  return connections.map((connection) => {
    const profile = profileMap.get(connection.username) || {};
    return {
      ...connection,
      profileImg: profile.profileImg || "",
      coverImg: profile.coverImg || "",
      bio: profile.bio || "",
    };
  });
};
const authReCheck = async (req, res) => {
  try {
    const userData = await user.findById(req.User._id).select("-password").lean();
    console.log("user is this ", userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const [followers, following] = await Promise.all([
      enrichFollowData(userData.followers),
      enrichFollowData(userData.following),
    ]);

    const UserDetails = { ...userData, followers, following };
    console.log(UserDetails);
    if (!UserDetails) {
      return res.status(400).json({ error: "User does not exist" });
    } else {
      return res.status(200).json({ UserDetails });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { Register, Login, logout, authReCheck };
