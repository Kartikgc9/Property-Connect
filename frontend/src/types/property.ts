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

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'HOUSE' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL';
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'INACTIVE';
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  virtualTourUrl?: string;
  amenities: string[];
  yearBuilt?: number;
  lotSize?: number;
  isVerified: boolean;
  blockchainTxHash?: string;
  localInsights?: any;
  aiAnalysis?: any;
  agentId: string;
  agent?: {
    id: string;
    licenseNumber: string;
    agency: string;
    rating: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  state?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PropertySearchResult {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
