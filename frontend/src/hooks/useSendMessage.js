import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { toast } from "react-hot-toast";
import useGetMessage from "./useGetMessage";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { message, setMessage, selectedConversations } = useConversation();
  const { getMessages } = useGetMessage();

  const sendMessage = async (messageContent) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/message/send/${selectedConversations._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageContent }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error || "Failed to send message");
      }
      setMessage([...message, data]);
      await getMessages(); // Refresh messages after sending
      toast.success("Message sent successfully"); //remove this toast
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};

export default useSendMessage;
