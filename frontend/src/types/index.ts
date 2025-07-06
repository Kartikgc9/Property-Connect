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

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: MapCoordinates;
  images: string[];
  virtualTourUrl?: string;
  amenities: string[];
  yearBuilt?: number;
  lotSize?: number;
  isVerified: boolean;
  blockchainTxHash?: string;
  localInsights?: any;
  aiAnalysis?: any;
  createdAt: string;
  updatedAt: string;
  agentId: string;
  agent?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL'
}

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  WITHDRAWN = 'WITHDRAWN'
}

export interface PropertyFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
  status?: PropertyStatus[];
  agentId?: string;
  features?: string[];
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
