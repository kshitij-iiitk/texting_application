import React, { useEffect } from "react";
import Messages from "./Messages.jsx";
import MessageInput from "./MessageInput.jsx";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation.js";
import { useAuthContext } from "../../context/authcontext.jsx";


const MessageContainer = () => {
  const { selectedConversations, setSelectedConversations } = useConversation();

  useEffect(() => {
    return () => {
      //reset selected conversations when component unmounts
      setSelectedConversations(null);
    };
  }, []);

  return (
    <div className=" md:min-w-[450px] flex flex-col">
      {
        <>
          {!selectedConversations ? (
            <NoChatSelected />
          ) : (
            <>
              {/* Header */}
              <div className=" flex items-start bg-slate-500 px-4 py-2 mb-2">
                <span className="label-text mr-1">{"To: "}</span>
                <span className="text-gray-900 font-bold">
                  {" "}
                  {selectedConversations?.fullName}
                </span>
              </div>
              <Messages />
            </>
          )}
          <MessageInput />
        </>
      }
    </div>
  );
};

export default MessageContainer;

const NoChatSelected = () => {
  const {authUser}= useAuthContext();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col
     items-center gap-2"
      >
        <p>Welcome {authUser?.fullName}</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-6xl text-gray-400" />
      </div>
    </div>
  );
};
