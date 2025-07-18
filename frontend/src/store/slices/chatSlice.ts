import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state: ChatState, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state: ChatState, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    clearMessages: (state: ChatState) => {
      state.messages = [];
    },
    setLoading: (state: ChatState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: ChatState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleChat: (state: ChatState) => {
      state.isOpen = !state.isOpen;
    },
    openChat: (state: ChatState) => {
      state.isOpen = true;
    },
    closeChat: (state: ChatState) => {
      state.isOpen = false;
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setLoading,
  setError,
  toggleChat,
  openChat,
  closeChat,
} = chatSlice.actions;

export default chatSlice.reducer;
