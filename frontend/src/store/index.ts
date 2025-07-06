import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { propertyApi } from './api/propertyApi';
import { agentApi } from './api/agentApi';
import { chatApi } from './api/chatApi';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import agentReducer from './slices/agentSlice';
import chatReducer from './slices/chatSlice';
import mapSlice from './slices/mapSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    agent: agentReducer,
    chat: chatReducer,
    map: mapSlice,
    [authApi.reducerPath]: authApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      propertyApi.middleware,
      agentApi.middleware,
      chatApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
