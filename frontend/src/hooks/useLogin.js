import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (userName, password) => {
    const success = handleInputErrors(userName, password);
    if (!success) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      if(data.error) {
        throw new Error(data.error);
      }
        localStorage.setItem("User", JSON.stringify(data));
        setAuthUser(data);
        console.log(data);

      
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return {login, loading};
};

export default useLogin;


function handleInputErrors(userName, password) {

  if (!userName || !password ) {
    toast.error("All fields are required.");
    return false;
  }
  return true;
}