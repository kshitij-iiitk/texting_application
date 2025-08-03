import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authcontext";
const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async (input) => {
    const { fullName, userName, password, confirmPassword, gender } = input;
    const success = handleInputErrors(input);
    if (!success) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, userName, password, confirmPassword, gender }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      if(data.error){
        throw new Error(data.error);
      }

      localStorage.setItem("User", JSON.stringify(data));
     setAuthUser(data);
      console.log(data);

      toast.success("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };
  return { signup, loading };
};

export default useSignup;

function handleInputErrors(input) {
  const { fullName, userName, password, confirmPassword} = input;

  if (!fullName || !userName || !password || !confirmPassword) {
    toast.error("All fields are required.");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return false;
  }
  return true;
}
