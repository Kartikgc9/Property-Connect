import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
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

// Async thunk for searching properties
export const searchProperties = createAsyncThunk(
  'property/searchProperties',
  async (filters: PropertyFilters) => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters.location) params.append('location', filters.location);
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.propertyType) params.append('propertyType', filters.propertyType.join(','));
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.areaMin) params.append('areaMin', filters.areaMin.toString());
    if (filters.areaMax) params.append('areaMax', filters.areaMax.toString());
    if (filters.amenities) params.append('amenities', filters.amenities.join(','));
    if (filters.yearBuilt) params.append('yearBuilt', filters.yearBuilt.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/properties/search?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to search properties');
    }
    
    const data = await response.json();
    return data.data || [];
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(searchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload;
        state.error = null;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to search properties';
      });
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
