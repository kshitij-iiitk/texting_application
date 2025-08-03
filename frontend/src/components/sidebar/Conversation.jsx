import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversations, setSelectedConversations } = useConversation();
  const isSelected = selectedConversations?._id===conversation._id;
const {onlineUsers} = useSocketContext();
const isOnline = onlineUsers.includes(conversation._id);


  return (
    <>
      <div className={` flex gap-2 items-center hover:bg-sky-500 p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
        onClick={() => setSelectedConversations(conversation)}
      >
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
          <div className="w-12 rounded-full">
            <img
              src={conversation?.ProfilePic || "https://www.gravatar.com/avatar/"}
              alt="user avatar"
            />
          </div>
        </div>

        <div className=" flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
          </div>
        </div>
      </div>

     {lastIdx && <div className="divider my-0 py-0 h-1 "/>}
    </>
  );
};

export default Conversation;
