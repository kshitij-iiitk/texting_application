import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversations, setMessage, message } = useConversation();
  const getMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/message/${selectedConversations._id}`);
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        throw new Error(data.error);
      }
      setMessage(data.messages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedConversations?._id) getMessages();
  }, [selectedConversations?._id, setMessage]);
  return { loading, message, getMessages };
};

export default useGetMessage;
