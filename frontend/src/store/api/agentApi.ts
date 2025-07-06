import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Agent, AgentFilters } from '../../types/agent';

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_URL?: string;
      readonly VITE_MAPBOX_TOKEN?: string;
    };
  }
}

export const agentApi = createApi({
  reducerPath: 'agentApi',
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
  tagTypes: ['Agent'],
  endpoints: (builder) => ({
    getAgents: builder.query<{ agents: Agent[]; total: number }, AgentFilters>({
      query: (filters: AgentFilters) => ({
        url: '/agents',
        params: filters,
      }),
      providesTags: ['Agent'],
    }),
    getAgent: builder.query<Agent, string>({
      query: (id: string) => `/agents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Agent', id }],
    }),
    createAgent: builder.mutation<Agent, Partial<Agent>>({
      query: (agent: Partial<Agent>) => ({
        url: '/agents',
        method: 'POST',
        body: agent,
      }),
      invalidatesTags: ['Agent'],
    }),
    updateAgent: builder.mutation<Agent, { id: string; updates: Partial<Agent> }>({
      query: ({ id, updates }: { id: string; updates: Partial<Agent> }) => ({
        url: `/agents/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agent', id }],
    }),
    deleteAgent: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/agents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agent'],
    }),
    searchAgents: builder.query<{ agents: Agent[]; total: number }, AgentFilters>({
      query: (filters: AgentFilters) => ({
        url: '/agents/search',
        params: filters,
      }),
      providesTags: ['Agent'],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useSearchAgentsQuery,
} = agentApi;
