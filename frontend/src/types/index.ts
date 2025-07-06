// Central types index file for common types

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters extends FilterOptions {
  searchTerm?: string;
  location?: string;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: string;
  read: boolean;
}

// Re-export all types from other modules
export * from './user';
export * from './property';
export * from './agent';

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface LocalInsights {
  schoolRating?: number;
  crimeRate?: number;
  walkScore?: number;
  transitScore?: number;
  nearbyAmenities?: string[];
}

export interface AIAnalysis {
  marketTrend?: string;
  pricePrediction?: number;
  investmentScore?: number;
  neighborhoodInsights?: string;
  recommendations?: string[];
}
