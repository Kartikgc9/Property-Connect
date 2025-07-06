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
  coordinates: {
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
  localInsights?: {
    walkScore?: number;
    nearbySchools?: Array<{
      name: string;
      rating: number;
      distance: number;
    }>;
    crimeRate?: number;
    averageCommute?: number;
    nearbyAmenities?: string[];
  };
  aiAnalysis?: {
    marketTrend: 'RISING' | 'STABLE' | 'DECLINING';
    priceEstimate: {
      min: number;
      max: number;
      confidence: number;
    };
    investmentScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations: string[];
    comparableProperties?: Array<{
      id: string;
      price: number;
      similarity: number;
    }>;
  };
  agentId: string;
  agent: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    agency: string;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  searchTerm?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: PropertyType[];
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  amenities?: string[];
  yearBuilt?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
