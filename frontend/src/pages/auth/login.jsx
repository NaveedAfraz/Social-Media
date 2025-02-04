import React, { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";
import XLogo from "../../assets/X-black-copy.jpg";

function LoginPage() {
  const [formdata, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formdata);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left Section: Only visible on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={XLogo} alt="xlogo" className="max-w-full  h-[60%]" />
      </div>

      {/* Right Section: Form & Small Logo for mobile */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        {/* Top Logo for small screens */}
        <div className="block lg:hidden mb-6">
          <img src={XLogo} alt="xlogo" className="w-16 h-16" />
        </div>

        <form
          className="flex flex-col gap-6 w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            {"Let's"} go.
          </h1>

          {/* Email Input */}
          <div className="relative">
            <MdOutlineMail className="absolute ml-3 text-gray-400 text-xl top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              name="username"
              placeholder="Email"
              className="w-full bg-black text-white border-2 border-gray-700 rounded-3xl pl-12 py-3 focus:outline-none "
              value={formdata.username}
              onChange={handleInputChange}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <MdPassword className="absolute ml-3 text-gray-400 text-xl top-1/2 transform -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              className="w-full bg-black text-white border-2 border-gray-700 rounded-3xl pl-12 py-3 focus:outline-none caret-transparent"
              value={formdata.password}
              onChange={handleInputChange}
            />
          </div>

          <p className="text-sm text-gray-500">
            Must be more than 8 characters, including at least one number, one
            lowercase letter, and one uppercase letter.
          </p>

          <button
            type="submit"
            className="btn btn-outline rounded-full text-white w-full"
          >
            Login
          </button>
        </form>

        <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
          <p className="text-white text-center">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn btn-outline rounded-full text-white w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
