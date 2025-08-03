import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversations: null,
  setSelectedConversations: (selectedConversations) =>
    set({ selectedConversations }),
  message: [],
  setMessage: (message) => set({ message })
}));
 
export default useConversation;