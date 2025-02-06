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

  return (
    <div className="flex">
      {userInfo && <Sidebar />}
      <Routes>
        {!userInfo && (
          <>
            <Route
              path="/login"
              element={
                <AuthReCheck>
                  {" "}
                  <Login />{" "}
                </AuthReCheck>
              }
            ></Route>
            <Route
              path="/signUp"
              element={
                <AuthReCheck>
                  {" "}
                  <SignUp />{" "}
                </AuthReCheck>
              }
            ></Route>{" "}
          </>
        )}
        <Route
          path="/home"
          element={
            <AuthReCheck>
              <Home />
            </AuthReCheck>
          }
        ></Route>
        <Route
          path="/notifications"
          element={
            <AuthReCheck>
              <NotificationPage />{" "}
            </AuthReCheck>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <AuthReCheck>
              {" "}
              <ProfilePage />
            </AuthReCheck>
          }
        />
      </Routes>
      {userInfo && <RightPanel />}
    </div>
  );
}

export default App;
