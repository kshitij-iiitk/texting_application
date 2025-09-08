import React, { useState,useEffect, useRef } from "react";
import config from "../../../config/config";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: config.googleClientId,
          callback: handleGoogleSignIn,
        });

        // Render the Google button
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "sign_in_with",
            shape: "rectangular",
          }
        );
      }
    };

    return () => {
      // Cleanup script on component unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
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
      console.error("Google auth error:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto w-full">
      <div ref={googleButtonRef}></div>
    </div>
  );
};

export default GoogleButton;