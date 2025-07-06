import { User } from './user';

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
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

export interface AgentProfile extends Agent {
  properties: any[];
  metrics: AgentMetric[];
  collaborations: any[];
}

export interface AgentMetric {
  id: string;
  agentId: string;
  month: number;
  year: number;
  propertiesListed: number;
  propertiesSold: number;
  totalRevenue: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  createdAt: string;
}

export interface AgentFilters {
  search?: string;
  specialties?: string[];
  serviceAreas?: string[];
  minExperience?: number;
  maxExperience?: number;
  minRating?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface Collaboration {
  id: string;
  propertyId: string;
  primaryAgentId: string;
  secondaryAgentId: string;
  type: 'CO_LISTING' | 'REFERRAL' | 'JOINT_VENTURE';
  splitRatio: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface AgentMetrics {
  propertiesListed: number;
  propertiesSold: number;
  totalRevenue: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  month: number;
  year: number;
}
