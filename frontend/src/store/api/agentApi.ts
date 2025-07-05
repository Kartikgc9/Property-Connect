import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Agent, AgentFilters } from '../../types/agent';

export const agentApi = createApi({
  reducerPath: 'agentApi',
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
  tagTypes: ['Agent'],
  endpoints: (builder) => ({
    getAgents: builder.query<{ agents: Agent[]; total: number }, AgentFilters>({
      query: (filters) => ({
        url: '/agents',
        params: filters,
      }),
      providesTags: ['Agent'],
    }),
    getAgent: builder.query<Agent, string>({
      query: (id) => `/agents/${id}`,
      providesTags: (result, error, id) => [{ type: 'Agent', id }],
    }),
    createAgent: builder.mutation<Agent, Partial<Agent>>({
      query: (agent) => ({
        url: '/agents',
        method: 'POST',
        body: agent,
      }),
      invalidatesTags: ['Agent'],
    }),
    updateAgent: builder.mutation<Agent, { id: string; updates: Partial<Agent> }>({
      query: ({ id, updates }) => ({
        url: `/agents/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Agent', id }],
    }),
    deleteAgent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/agents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Agent'],
    }),
    searchAgents: builder.query<{ agents: Agent[]; total: number }, AgentFilters>({
      query: (filters) => ({
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
