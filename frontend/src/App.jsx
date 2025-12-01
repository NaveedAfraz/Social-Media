import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
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
import { ToastProvider } from "./components/ui/ToastContainer";
import AuthLayout from "./components/auth/AuthLayout";
import { Analytics } from "@vercel/analytics/react"
function App() {
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  console.log(userInfo);
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    if (userInfo && window.location.pathname === "/login") {
      navigate("/home");
      console.log("navigated to home");
    }
  }, [userInfo, navigate]);

  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    if (location.pathname == "/") {
      navigate("/home")
    }
  }, [])
  console.log(isAuthenticated)
 
  return (
    <ToastProvider>
      <Analytics />
      <div className="flex">
        {!isPublicRoute && <Sidebar />}
        <Routes>
          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/signUp" element={<AuthLayout />}>
            <Route index element={<SignUp />} />
          </Route>

          <Route element={<AuthReCheck />}>
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/notifications" element={isAuthenticated ? <NotificationPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" replace />}>
              <Route path=":username" element={isAuthenticated ? <Messages /> : <Navigate to="/login" replace />} />
            </Route>
          </Route>
        </Routes>
        {!isPublicRoute && !location.pathname.includes("messages") && (
          <RightPanel />
        )}

        {/* <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </div>
    </ToastProvider>
  );
}

export default App;
