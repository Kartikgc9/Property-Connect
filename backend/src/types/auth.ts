import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'BUYER' | 'AGENT' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  agent?: Agent;
  buyer?: Buyer;
}

export interface Agent {
  id: string;
  userId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Buyer {
  id: string;
  userId: string;
  preferredAreas: string[];
  budgetMin?: number;
  budgetMax?: number;
  propertyTypes: string[];
  savedProperties: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}