const express = require("express");
const bcrypt = require("bcryptjs");
const user = require("../../models/userSchema");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  const { formData } = req.body;

  if (!formData.username || !formData.email || !formData.password) {
    console.log("form Data is missing");
    return res.status(400).json({ error: "formData is missing" });
  }

  try {
    const emailExists = await user.findOne({ email: formData.email });
    const usernameExists = await user.findOne({ userName: formData.userName });
    if (emailExists || usernameExists) {
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
      sameSite: "none",
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
    res.clearCookie("authtoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const authReCheck = async (req, res) => {
  try {
    const User = await user.findById(req.User._id).select("-password");
    if (!User) {
      return res.status(400).json({ error: "User does not exist" });
    } else {
      return res.status(200).json({ success: true, user: User });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { Register, Login, logout, authReCheck };
