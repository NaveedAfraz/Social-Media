import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAuth, Logout } from "../../redux/authSlice";

function AuthReCheck({ children }) {
  const dispatch = useDispatch();

  // Execute the auth check via React Query
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["authReCheck"],
    queryFn: async () => {
      const response = await axios.post(
        "http://localhost:3006/api/auth/authReCheck",
        {},
        { withCredentials: true }
      );

      return response.data; 
    },
    retry: false,
    refetchOnMount: true, 
    cacheTime: 0,
    staleTime: 0,
    onSuccess: (data) => {
      console.log("AuthReCheck success:", data);
      dispatch(Logout());
    },
    onError: (error) => {
      console.error("AuthReCheck error:", error);
    },
  });
  // console.log("running");

  useEffect(() => {
    if (isSuccess) {
      dispatch(isAuth(data));
    }
  }, [data]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data?.success) {
    console.log("AuthReCheck failed");
  }

  return <>{children}</>;
}

export default AuthReCheck;
