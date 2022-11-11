import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, UserSnapshot } from "../../models/models";

interface ChatState {
  currentChat: UserSnapshot | null;
  messages: Message[];
  chats: UserSnapshot[];
}

const initialState: ChatState = {
  currentChat: null,
  messages: [],
  chats: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<UserSnapshot | null>) => {
      state.currentChat = action.payload;
    },
    setChats: (state, action: PayloadAction<UserSnapshot[]>) => {
      state.chats = action.payload;
    },
    setMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { setCurrentChat, setChats, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
