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
    setAgents: (state: AgentState, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    setCurrentAgent: (state: AgentState, action: PayloadAction<Agent>) => {
      state.currentAgent = action.payload;
    },
    setFilters: (state: AgentState, action: PayloadAction<AgentFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state: AgentState) => {
      state.filters = {};
    },
    setLoading: (state: AgentState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: AgentState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTotalCount: (state: AgentState, action: PayloadAction<number>) => {
      state.totalCount = action.payload;
    },
    addAgent: (state: AgentState, action: PayloadAction<Agent>) => {
      state.agents.unshift(action.payload);
    },
    updateAgent: (state: AgentState, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex((a: Agent) => a.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
      }
      if (state.currentAgent?.id === action.payload.id) {
        state.currentAgent = action.payload;
      }
    },
    removeAgent: (state: AgentState, action: PayloadAction<string>) => {
      state.agents = state.agents.filter((a: Agent) => a.id !== action.payload);
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
