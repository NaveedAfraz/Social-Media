import React from 'react';
import { Outlet } from 'react-router-dom';
import XLogo from '../../assets/X-black-copy.jpg';

const AuthLayout = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left Section: Only visible on large screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={XLogo} alt="xlogo" className="max-w-full  h-[60%]" />
      </div>

      {/* Right Section: Form & Small Logo for mobile */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        {/* Top Logo for small screens */}

        {/* Render the auth form (Login/Signup) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
