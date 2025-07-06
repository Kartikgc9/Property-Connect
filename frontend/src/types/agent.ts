import { User } from './user';
import { Property } from './property';

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
  user: User;
}

export interface AgentProfile extends Agent {
  properties: Property[];
  metrics: AgentMetric[];
  collaborations: Collaboration[];
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
  searchTerm?: string;
  location?: string;
  specialties?: string[];
  rating?: number;
  experience?: number;
  isActive?: boolean;
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
