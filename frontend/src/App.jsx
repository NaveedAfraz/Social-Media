import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import Sidebar from "./components/common/sidebar";
import RightPanel from "./components/common/rightPanel";
import NotificationPage from "./pages/notification/nodification";
import ProfilePage from "./pages/profile/profile";
function App() {
  return (
    <>
      <Router>
        <div className="flex ">
          <Sidebar />
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signUp" element={<SignUp />}></Route>
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Routes>
          <RightPanel />
        </div>
      </Router>
    </>
  );
}

export default App;
