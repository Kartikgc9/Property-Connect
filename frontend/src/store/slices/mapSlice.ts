import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapCoordinates } from '../../types';

interface MapState {
  center: MapCoordinates;
  zoom: number;
  selectedProperty: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MapState = {
  center: { lat: 40.7128, lng: -74.0060 }, // New York default
  zoom: 10,
  selectedProperty: null,
  isLoading: false,
  error: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state: MapState, action: PayloadAction<MapCoordinates>) => {
      state.center = action.payload;
    },
    setZoom: (state: MapState, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setSelectedProperty: (state: MapState, action: PayloadAction<string | null>) => {
      state.selectedProperty = action.payload;
    },
    setLoading: (state: MapState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: MapState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetMap: (state: MapState) => {
      state.center = { lat: 40.7128, lng: -74.0060 };
      state.zoom = 10;
      state.selectedProperty = null;
    },
  },
});

export const {
  setCenter,
  setZoom,
  setSelectedProperty,
  setLoading,
  setError,
  resetMap,
} = mapSlice.actions;

export default mapSlice.reducer;
