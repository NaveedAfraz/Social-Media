import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import Sidebar from "./components/common/sidebar";
import RightPanel from "./components/common/rightPanel";
import NotificationPage from "./pages/notification/nodification";
import ProfilePage from "./pages/profile/profile";
import AuthReCheck from "./components/auth/authreCheck";
import { useSelector } from "react-redux";
import Messages from "./pages/messages/messages";
function App() {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo && window.location.pathname === "/login") {
      navigate("/home");
      console.log("navigated to home");
    }
  }, [userInfo, navigate]);
  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex">
      {!isPublicRoute && <Sidebar />}
      <Routes>
        {/* <Route element={<Authrecheck/>}> */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        {/* </Route> */}

        <Route element={<AuthReCheck />}>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/messages" element={<Messages />}></Route>
        </Route>
      </Routes>
      {!isPublicRoute&& !location.pathname.includes("messages") && <RightPanel />}

      {/* <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </div>
  );
}

export default App;
