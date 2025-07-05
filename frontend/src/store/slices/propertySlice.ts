import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertyFilters } from '../../types/property';

interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  filters: PropertyFilters;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
}

const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  filters: {},
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setCurrentProperty: (state, action: PayloadAction<Property>) => {
      state.currentProperty = action.payload;
    },
    setFilters: (state, action: PayloadAction<PropertyFilters>) => {
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
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.unshift(action.payload);
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
      if (state.currentProperty?.id === action.payload.id) {
        state.currentProperty = action.payload;
      }
    },
    removeProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter(p => p.id !== action.payload);
      if (state.currentProperty?.id === action.payload) {
        state.currentProperty = null;
      }
    },
  },
});

export const {
  setProperties,
  setCurrentProperty,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  setTotalCount,
  setCurrentPage,
  addProperty,
  updateProperty,
  removeProperty,
} = propertySlice.actions;

export default propertySlice.reducer;
