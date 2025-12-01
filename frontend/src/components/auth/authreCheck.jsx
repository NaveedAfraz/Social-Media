import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth, Logout } from "../../redux/authSlice";
import PostSkeleton from "../skeleton/postSkeleton";
import ProfileHeaderSkeleton from "../skeleton/profileSkeleton";
import { useToast } from "../../components/ui/ToastContainer";

function AuthReCheck({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { toastError } = useToast();
  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);
  // Execute the auth check via React Query
  const { data, isLoading, isSuccess, isError, refetch } = useQuery({
    queryKey: ["authReCheck"],
    queryFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/authReCheck`,
        {},
        { withCredentials: true }
      );
      return response.data;
    },
    retry: 2, // Retry 2 times on failure
    retryDelay: 1000, // Wait 1 second between retries
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
    onSuccess: (data) => {
      console.log("AuthReCheck success:", data);
      // Success is handled in useEffect below
    },
    onError: (error) => {
      console.error("AuthReCheck error:", error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(isAuth(data.UserDetails));
    }
    if (isError || !data?.UserDetails) {
      console.log("AuthReCheck failed");
      dispatch(Logout());
    }
  }, [data, isSuccess, isError, dispatch]);

  // Redirect unauthenticated users to login based on query result, not Redux state
  useEffect(() => {
    console.log("Auth check status:", { isLoading, isSuccess, isError, hasData: !!data?.UserDetails });

    if (!isLoading && (isError || !data?.UserDetails) && !isPublicRoute) {
      console.log("Redirecting to login - auth failed");
      toastError("Please login to continue");
      navigate("/login");
    }
  }, [isLoading, isError, data, isPublicRoute, navigate, toastError]);
  if (isLoading) {
    return (
      <>
        <div className="flex flex-col gap-4 w-full">
          <ProfileHeaderSkeleton />
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </>
    );
  }

  return <Outlet />;
}

export default AuthReCheck;
