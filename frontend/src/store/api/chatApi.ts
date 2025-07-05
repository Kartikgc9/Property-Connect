import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Chat'],
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], void>({
      query: () => '/chat/messages',
      providesTags: ['Chat'],
    }),
    sendMessage: builder.mutation<Message, { content: string; type?: string }>({
      query: (message) => ({
        url: '/chat/send',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Chat'],
    }),
    getChatHistory: builder.query<Message[], string>({
      query: (sessionId) => `/chat/history/${sessionId}`,
      providesTags: (result, error, sessionId) => [{ type: 'Chat', id: sessionId }],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetChatHistoryQuery,
} = chatApi;
