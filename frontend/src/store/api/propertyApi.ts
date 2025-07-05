import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Property, PropertyFilters } from '../../types/property';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
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
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    getProperties: builder.query<{ properties: Property[]; total: number }, PropertyFilters>({
      query: (filters) => ({
        url: '/properties',
        params: filters,
      }),
      providesTags: ['Property'],
    }),
    getProperty: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    createProperty: builder.mutation<Property, Partial<Property>>({
      query: (property) => ({
        url: '/properties',
        method: 'POST',
        body: property,
      }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation<Property, { id: string; updates: Partial<Property> }>({
      query: ({ id, updates }) => ({
        url: `/properties/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
    searchProperties: builder.query<{ properties: Property[]; total: number }, PropertyFilters>({
      query: (filters) => ({
        url: '/properties/search',
        params: filters,
      }),
      providesTags: ['Property'],
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useSearchPropertiesQuery,
} = propertyApi;
