// API Request and Response Type Definitions

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedApiResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'BUYER' | 'AGENT';
  // Agent-specific fields
  agency?: string;
  experience?: number;
  specialties?: string[];
  serviceAreas?: string[];
  // Buyer-specific fields
  preferredAreas?: string[];
  budgetMin?: number;
  budgetMax?: number;
  propertyTypes?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    agent?: {
      id: string;
      licenseNumber: string;
      agency: string;
      experience: number;
      rating: number;
      reviewCount: number;
      responseTime: number;
      bio?: string;
      specialties: string[];
      serviceAreas: string[];
      isActive: boolean;
    };
    buyer?: {
      id: string;
      preferredAreas: string[];
      budgetMin?: number;
      budgetMax?: number;
      propertyTypes: string[];
    };
  };
  token: string;
}

// Property Types
export interface PropertyCreateRequest {
  title: string;
  description: string;
  type: 'HOUSE' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL';
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images?: string[];
  virtualTourUrl?: string;
  amenities?: string[];
  yearBuilt?: number;
  lotSize?: number;
}

export interface PropertyUpdateRequest extends Partial<PropertyCreateRequest> {}

export interface PropertySearchQuery {
  searchTerm?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaMin?: number;
  areaMax?: number;
  amenities?: string;
  yearBuilt?: number;
  sortBy?: 'price' | 'date' | 'area';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
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

// Agent Types
export interface AgentCreateRequest {
  licenseNumber: string;
  agency: string;
  experience: number;
  bio?: string;
  specialties?: string[];
  serviceAreas?: string[];
}

export interface AgentUpdateRequest extends Partial<AgentCreateRequest> {}

export interface AgentSearchQuery {
  searchTerm?: string;
  location?: string;
  specialties?: string;
  rating?: number;
  experience?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Chat Types
export interface ChatMessageRequest {
  message: string;
  propertyId?: string;
  agentId?: string;
}

export interface ChatMessageResponse {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: string;
  type: 'text' | 'image' | 'document';
  metadata?: {
    propertyId?: string;
    agentId?: string;
    suggestions?: string[];
  };
}

// File Upload Types
export interface FileUploadRequest {
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Uint8Array;
  };
  folder?: string;
  resize?: {
    width: number;
    height: number;
  };
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: ValidationError[];
  stack?: string;
}

// Blockchain Types
export interface BlockchainVerificationRequest {
  propertyId: string;
  transactionHash?: string;
}

export interface BlockchainVerificationResponse {
  isVerified: boolean;
  transactionHash: string;
  blockNumber?: number;
  timestamp?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

// AI Analysis Types
export interface AIAnalysisRequest {
  propertyId: string;
  analysisType: 'MARKET_TREND' | 'PRICE_ESTIMATE' | 'INVESTMENT_SCORE' | 'FULL_ANALYSIS';
}

export interface AIAnalysisResponse {
  propertyId: string;
  analysisType: string;
  result: {
    marketTrend?: 'RISING' | 'STABLE' | 'DECLINING';
    priceEstimate?: {
      min: number;
      max: number;
      confidence: number;
    };
    investmentScore?: number;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendations?: string[];
    comparableProperties?: Array<{
      id: string;
      price: number;
      similarity: number;
    }>;
  };
  confidence: number;
  timestamp: string;
}

// Notification Types
export interface NotificationRequest {
  userId: string;
  type: 'PROPERTY_ALERT' | 'PRICE_CHANGE' | 'NEW_MESSAGE' | 'SYSTEM';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}