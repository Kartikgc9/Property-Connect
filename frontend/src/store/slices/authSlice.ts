import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, LoginCredentials, RegisterData } from '../../types/user';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state: AuthState, action: PayloadAction<AuthUser>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state: AuthState, action: PayloadAction<AuthUser>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    registerFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
    updateUser: (state: AuthState, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
