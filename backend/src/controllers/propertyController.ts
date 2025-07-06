// backend/src/controllers/propertyController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

export class PropertyController {
  // Get all properties with filtering and pagination
  static async getProperties(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 12,
        query,
        type,
        minPrice,
        maxPrice,
        minBedrooms,
        maxBedrooms,
        minBathrooms,
        maxBathrooms,
        minArea,
        maxArea,
        city,
        state,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Build where clause
      const where: any = {
        status: 'ACTIVE'
      };

      if (query) {
        where.OR = [
          { title: { contains: String(query), mode: 'insensitive' } },
          { description: { contains: String(query), mode: 'insensitive' } },
          { address: { contains: String(query), mode: 'insensitive' } },
          { city: { contains: String(query), mode: 'insensitive' } }
        ];
      }

      if (type) where.type = String(type);
      if (city) where.city = { contains: String(city), mode: 'insensitive' };
      if (state) where.state = { contains: String(state), mode: 'insensitive' };

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = Number(minPrice);
        if (maxPrice) where.price.lte = Number(maxPrice);
      }

      if (minBedrooms || maxBedrooms) {
        where.bedrooms = {};
        if (minBedrooms) where.bedrooms.gte = Number(minBedrooms);
        if (maxBedrooms) where.bedrooms.lte = Number(maxBedrooms);
      }

      if (minBathrooms || maxBathrooms) {
        where.bathrooms = {};
        if (minBathrooms) where.bathrooms.gte = Number(minBathrooms);
        if (maxBathrooms) where.bathrooms.lte = Number(maxBathrooms);
      }

      if (minArea || maxArea) {
        where.area = {};
        if (minArea) where.area.gte = Number(minArea);
        if (maxArea) where.area.lte = Number(maxArea);
      }

      // Build order by clause
      const orderBy: any = {};
      orderBy[String(sortBy)] = String(sortOrder);

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            agent: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    email: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }),
        prisma.property.count({ where })
      ]);

      res.json({
        properties,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get single property by ID
  static async getPropertyById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          agent: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true,
                  avatar: true
                }
              }
            }
          },
          transactions: {
            where: {
              status: 'COMPLETED'
            },
            take: 5,
            orderBy: {
              completedAt: 'desc'
            }
          }
        }
      });

      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new property (agents only)
  static async createProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const {
        title,
        description,
        type,
        price,
        currency = 'USD',
        bedrooms,
        bathrooms,
        area,
        areaUnit = 'sqft',
        address,
        city,
        state,
        zipCode,
        country = 'US',
        coordinates,
        images,
        virtualTourUrl,
        amenities = [],
        yearBuilt,
        lotSize
      } = req.body;

      // Check if user is an agent
      const agent = await prisma.agent.findUnique({
        where: { userId }
      });

      if (!agent) {
        return res.status(403).json({ error: 'Only agents can create properties' });
      }

      const property = await prisma.property.create({
        data: {
          title,
          description,
          type,
          price,
          currency,
          bedrooms,
          bathrooms,
          area,
          areaUnit,
          address,
          city,
          state,
          zipCode,
          country,
          coordinates,
          images,
          virtualTourUrl,
          amenities,
          yearBuilt,
          lotSize,
          agentId: agent.id
        },
        include: {
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      });

      res.status(201).json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update property (agent only)
  static async updateProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      // Check if property exists and belongs to the agent
      const existingProperty = await prisma.property.findUnique({
        where: { id },
        include: {
          agent: true
        }
      });

      if (!existingProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (existingProperty.agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this property' });
      }

      const property = await prisma.property.update({
        where: { id },
        data: updateData,
        include: {
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        }
      });

      res.json(property);
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete property (agent only)
  static async deleteProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Check if property exists and belongs to the agent
      const existingProperty = await prisma.property.findUnique({
        where: { id },
        include: {
          agent: true
        }
      });

      if (!existingProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (existingProperty.agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to delete this property' });
      }

      await prisma.property.delete({
        where: { id }
      });

      res.json({ message: 'Property deleted successfully' });
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get properties by agent
  static async getAgentProperties(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // Get agent
      const agent = await prisma.agent.findUnique({
        where: { userId }
      });

      if (!agent) {
        return res.status(403).json({ error: 'Only agents can access this endpoint' });
      }

      const where: any = {
        agentId: agent.id
      };

      if (status) {
        where.status = String(status);
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.property.count({ where })
      ]);

      res.json({
        properties,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching agent properties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Search properties with AI recommendations
  static async searchProperties(req: Request, res: Response) {
    try {
      const { query, location, preferences } = req.body;

      // Basic search implementation
      const where: any = {
        status: 'ACTIVE'
      };

      if (query) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } }
        ];
      }

      if (location) {
        where.city = { contains: location, mode: 'insensitive' };
      }

      const properties = await prisma.property.findMany({
        where,
        take: 20,
        include: {
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        properties,
        total: properties.length,
        query,
        location
      });
    } catch (error) {
      console.error('Error searching properties:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}