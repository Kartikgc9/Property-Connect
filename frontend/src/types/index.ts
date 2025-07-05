export * from './property';
export * from './user';
export * from './agent';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface SearchFilters {
  searchTerm?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string[];
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  amenities?: string[];
  yearBuilt?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MapCoordinates {
  lat: number;
  lng: number;
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
