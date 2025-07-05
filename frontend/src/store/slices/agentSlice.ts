import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Agent, AgentFilters } from '../../types/agent';

interface AgentState {
  agents: Agent[];
  currentAgent: Agent | null;
  filters: AgentFilters;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: AgentState = {
  agents: [],
  currentAgent: null,
  filters: {},
  isLoading: false,
  error: null,
  totalCount: 0,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    setCurrentAgent: (state, action: PayloadAction<Agent>) => {
      state.currentAgent = action.payload;
    },
    setFilters: (state, action: PayloadAction<AgentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTotalCount: (state, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.agents.unshift(action.payload);
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
      }
      if (state.currentAgent?.id === action.payload.id) {
        state.currentAgent = action.payload;
      }
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(a => a.id !== action.payload);
      if (state.currentAgent?.id === action.payload) {
        state.currentAgent = null;
      }
    },
  },
});

export const {
  setAgents,
  setCurrentAgent,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  setTotalCount,
  addAgent,
  updateAgent,
  removeAgent,
} = agentSlice.actions;

export default agentSlice.reducer;
