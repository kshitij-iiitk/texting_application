import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useGetConverstions = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (data.error) {
          throw new Error("Data error has occurred");
        }
        setConversations(data);
      } catch (error) {
        toast.error("An error occurred while fetching conversations.");
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);
  return { loading, conversations };
};

export default useGetConverstions;
