import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import useGetMessage from "../../hooks/useGetMessage.js";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";
import useListenMessages from "../../hooks/useListenMessages.js";

const Messages = () => {
  const { loading, message } = useGetMessage(); 
  useListenMessages();
  const lastMessageRef = useRef();


  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [message]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading && Array.isArray(message) && message.length > 0 && 
        message.map((msg, idx) => {
          return (
            <div key={msg._id} ref={idx === message.length - 1 ? lastMessageRef : null}>
              <Message message={msg} />
            </div>
          );
        })}
      
      {!loading && (!message || !Array.isArray(message) || message.length === 0) && (
        <p className="text-center">Send a message to start a conversation</p>
      )}
      
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
    </div>
  );
};

export default Messages;