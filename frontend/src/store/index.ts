import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { propertyApi } from './api/propertyApi';
import { agentApi } from './api/agentApi';
import { chatApi } from './api/chatApi';
import authSlice from './slices/authSlice';
import propertySlice from './slices/propertySlice';
import agentSlice from './slices/agentSlice';
import chatSlice from './slices/chatSlice';
import mapSlice from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    property: propertySlice,
    agent: agentSlice,
    chat: chatSlice,
    map: mapSlice,
    [authApi.reducerPath]: authApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      propertyApi.middleware,
      agentApi.middleware,
      chatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
