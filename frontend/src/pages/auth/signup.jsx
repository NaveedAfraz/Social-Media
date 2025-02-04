import React, { useState } from "react";
import { MdOutlineMail, MdPassword, MdPerson } from "react-icons/md";
import { Link } from "react-router-dom";
import XLogo from "../../assets/X-black-copy.jpg";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left Section: Only visible on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={XLogo} alt="xlogo" className="max-w-full h-[60%]" />
      </div>

      {/* Right Section: Form & Small Logo for mobile */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        {/* Top Logo for small screens */}
        <div className="block lg:hidden mb-6">
          <img src={XLogo} alt="xlogo" className="w-16 h-16" />
        </div>

        <form
          className="flex flex-col gap-4 w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Create Account
          </h1>

          {/* Username Input */}
          <div className="relative">
            <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full bg-black text-white pl-10 py-2  border-gray-700 rounded-3xl  focus:outline-none"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <MdOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-black text-white pl-10 py-2  border-gray-700 rounded-3xl focus:outline-none"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <MdPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be at least 8 characters, including a number, a lowercase letter, and an uppercase letter"
              className="w-full bg-black text-white pl-10 py-2 border-2  border-gray-700 rounded-3xl  focus:outline-none"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <MdPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="w-full bg-black text-white pl-10 py-2  border-gray-700 rounded-3xl focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <p className="text-sm text-gray-500">
            Password must be at least 8 characters long, including at least one
            number, one lowercase letter, and one uppercase letter.
          </p>

          <button
            type="submit"
            className="btn btn-outline rounded-full text-white w-full"
          >
            Sign Up
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
          <p className="text-white text-center">Already have an account?</p>
          <Link to="/login">
            <button className="btn btn-outline rounded-full text-white w-full">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
