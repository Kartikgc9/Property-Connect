import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type: 'text' | 'image' | 'document';
}

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
      readonly VITE_MAPBOX_TOKEN?: string;
    };
  }
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }: { getState: () => any }) => {
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
      query: (message: { content: string; type?: string }) => ({
        url: '/chat/send',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Chat'],
    }),
    getChatHistory: builder.query<Message[], string>({
      query: (sessionId: string) => `/chat/history/${sessionId}`,
      providesTags: (result, error, sessionId) => [{ type: 'Chat', id: sessionId }],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetChatHistoryQuery,
} = chatApi;
