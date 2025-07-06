import { PrismaClient } from '@prisma/client';
import { Property, PropertyStatus, PropertyType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface PropertyCreateData {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
  features: string[];
  images: string[];
  agentId: string;
  status: PropertyStatus;
  latitude?: number;
  longitude?: number;
}

export interface PropertyUpdateData extends Partial<PropertyCreateData> {
  id: string;
}

export interface PropertySearchFilters {
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
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PropertyService {
  /**
   * Create a new property
   */
  static async createProperty(data: PropertyCreateData): Promise<Property> {
    try {
      const property = await prisma.property.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          agent: true,
          transactions: true
        }
      });

      return property;
    } catch (error) {
      console.error('Create property error:', error);
      throw new Error('Failed to create property');
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          agent: true,
          transactions: true,
          verifications: true
        }
      });

      return property;
    } catch (error) {
      console.error('Get property error:', error);
      return null;
    }
  }

  /**
   * Update property
   */
  static async updateProperty(data: PropertyUpdateData): Promise<Property | null> {
    try {
      const { id, ...updateData } = data;
      
      const property = await prisma.property.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          agent: true,
          transactions: true
        }
      });

      return property;
    } catch (error) {
      console.error('Update property error:', error);
      return null;
    }
  }

  /**
   * Delete property
   */
  static async deleteProperty(id: string): Promise<boolean> {
    try {
      await prisma.property.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Delete property error:', error);
      return false;
    }
  }

  /**
   * Search properties with filters
   */
  static async searchProperties(
    filters: PropertySearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PropertySearchResult> {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause
      const where: any = {};

      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        where.propertyType = { in: filters.propertyType };
      }

      if (filters.bedrooms) {
        where.bedrooms = { gte: filters.bedrooms };
      }

      if (filters.bathrooms) {
        where.bathrooms = { gte: filters.bathrooms };
      }

      if (filters.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
      }

      if (filters.state) {
        where.state = { contains: filters.state, mode: 'insensitive' };
      }

      if (filters.status && filters.status.length > 0) {
        where.status = { in: filters.status };
      }

      if (filters.agentId) {
        where.agentId = filters.agentId;
      }

      // Get total count
      const total = await prisma.property.count({ where });

      // Get properties
      const properties = await prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          agent: true,
          transactions: true
        }
      });

      const totalPages = Math.ceil(total / limit);

      return {
        properties,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Search properties error:', error);
      throw new Error('Failed to search properties');
    }
  }

  /**
   * Get properties by agent
   */
  static async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: { agentId },
        include: {
          agent: true,
          transactions: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return properties;
    } catch (error) {
      console.error('Get properties by agent error:', error);
      return [];
    }
  }

  /**
   * Get featured properties
   */
  static async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          status: 'ACTIVE',
          isFeatured: true
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          agent: true
        }
      });

      return properties;
    } catch (error) {
      console.error('Get featured properties error:', error);
      return [];
    }
  }

  /**
   * Get recent properties
   */
  static async getRecentProperties(limit: number = 10): Promise<Property[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          status: 'ACTIVE'
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          agent: true
        }
      });

      return properties;
    } catch (error) {
      console.error('Get recent properties error:', error);
      return [];
    }
  }

  /**
   * Update property status
   */
  static async updatePropertyStatus(id: string, status: PropertyStatus): Promise<Property | null> {
    try {
      const property = await prisma.property.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date()
        },
        include: {
          agent: true
        }
      });

      return property;
    } catch (error) {
      console.error('Update property status error:', error);
      return null;
    }
  }

  /**
   * Toggle property featured status
   */
  static async toggleFeatured(id: string): Promise<Property | null> {
    try {
      const property = await prisma.property.findUnique({
        where: { id }
      });

      if (!property) return null;

      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          isFeatured: !property.isFeatured,
          updatedAt: new Date()
        },
        include: {
          agent: true
        }
      });

      return updatedProperty;
    } catch (error) {
      console.error('Toggle featured error:', error);
      return null;
    }
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats(): Promise<any> {
    try {
      const totalProperties = await prisma.property.count();
      const activeProperties = await prisma.property.count({
        where: { status: 'ACTIVE' }
      });
      const soldProperties = await prisma.property.count({
        where: { status: 'SOLD' }
      });
      const pendingProperties = await prisma.property.count({
        where: { status: 'PENDING' }
      });

      const avgPrice = await prisma.property.aggregate({
        where: { status: 'ACTIVE' },
        _avg: { price: true }
      });

      return {
        total: totalProperties,
        active: activeProperties,
        sold: soldProperties,
        pending: pendingProperties,
        averagePrice: avgPrice._avg.price || 0
      };
    } catch (error) {
      console.error('Get property stats error:', error);
      return {
        total: 0,
        active: 0,
        sold: 0,
        pending: 0,
        averagePrice: 0
      };
    }
  }

  /**
   * Get properties by location
   */
  static async getPropertiesByLocation(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<Property[]> {
    try {
      // Simple radius search (you might want to use PostGIS for more accurate results)
      const properties = await prisma.property.findMany({
        where: {
          status: 'ACTIVE',
          latitude: {
            gte: latitude - (radius / 69), // Approximate degrees
            lte: latitude + (radius / 69)
          },
          longitude: {
            gte: longitude - (radius / 69),
            lte: longitude + (radius / 69)
          }
        },
        include: {
          agent: true
        }
      });

      return properties;
    } catch (error) {
      console.error('Get properties by location error:', error);
      return [];
    }
  }
}
