import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

export class AgentController {
  // Get all agents with filtering and pagination
  static async getAgents(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        city, 
        state, 
        specialty,
        minRating,
        sortBy = 'rating',
        sortOrder = 'desc'
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = {
        isActive: true
      };

      if (city) {
        where.serviceAreas = {
          has: String(city)
        };
      }

      if (state) {
        where.serviceAreas = {
          has: String(state)
        };
      }

      if (specialty) {
        where.specialties = {
          has: String(specialty)
        };
      }

      if (minRating) {
        where.rating = {
          gte: Number(minRating)
        };
      }

      const orderBy: any = {};
      orderBy[String(sortBy)] = String(sortOrder);

      const [agents, total] = await Promise.all([
        prisma.agent.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true
              }
            },
            _count: {
              select: {
                properties: true
              }
            }
          }
        }),
        prisma.agent.count({ where })
      ]);

      res.json({
        agents,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get agent by ID
  static async getAgentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const agent = await prisma.agent.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          properties: {
            where: {
              status: 'ACTIVE'
            },
            take: 10,
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              properties: true
            }
          }
        }
      });

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create agent profile
  static async createAgentProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { 
        licenseNumber, 
        agency, 
        experience, 
        bio, 
        specialties = [], 
        serviceAreas 
      } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if user already has an agent profile
      const existingAgent = await prisma.agent.findUnique({
        where: { userId }
      });

      if (existingAgent) {
        return res.status(400).json({ error: 'Agent profile already exists' });
      }

      // Check if license number is already taken
      const existingLicense = await prisma.agent.findUnique({
        where: { licenseNumber }
      });

      if (existingLicense) {
        return res.status(400).json({ error: 'License number already registered' });
      }

      const agent = await prisma.agent.create({
        data: {
          userId,
          licenseNumber,
          agency,
          experience,
          bio,
          specialties,
          serviceAreas
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      });

      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update agent profile
  static async updateAgentProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const updateData = req.body;

      // Check if agent exists and belongs to user
      const existingAgent = await prisma.agent.findUnique({
        where: { id }
      });

      if (!existingAgent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      if (existingAgent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to update this agent profile' });
      }

      // Check if license number is already taken (excluding current agent)
      if (updateData.licenseNumber && updateData.licenseNumber !== existingAgent.licenseNumber) {
        const existingLicense = await prisma.agent.findUnique({
          where: { licenseNumber: updateData.licenseNumber }
        });

        if (existingLicense) {
          return res.status(400).json({ error: 'License number already registered' });
        }
      }

      const agent = await prisma.agent.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true
            }
          }
        }
      });

      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get agent metrics
  static async getAgentMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Check if agent exists and belongs to user
      const agent = await prisma.agent.findUnique({
        where: { id }
      });

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      if (agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to view these metrics' });
      }

      const metrics = await prisma.agentMetric.findMany({
        where: { agentId: id },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      });

      // Calculate current month metrics
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const currentMonthMetric = metrics.find(
        m => m.month === currentMonth && m.year === currentYear
      );

      // Get property statistics
      const propertyStats = await prisma.property.groupBy({
        by: ['status'],
        where: {
          agentId: id
        },
        _count: true
      });

      const totalProperties = propertyStats.reduce((sum, stat) => sum + stat._count, 0);
      const activeProperties = propertyStats.find(s => s.status === 'ACTIVE')?._count || 0;
      const soldProperties = propertyStats.find(s => s.status === 'SOLD')?._count || 0;

      res.json({
        metrics,
        currentMonth: currentMonthMetric || {
          propertiesListed: 0,
          propertiesSold: 0,
          totalRevenue: 0,
          avgResponseTime: agent.responseTime,
          customerSatisfaction: agent.rating
        },
        summary: {
          totalProperties,
          activeProperties,
          soldProperties,
          rating: agent.rating,
          reviewCount: agent.reviewCount
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Deactivate agent profile
  static async deactivateAgent(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // Check if agent exists and belongs to user
      const agent = await prisma.agent.findUnique({
        where: { id }
      });

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      if (agent.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to deactivate this agent profile' });
      }

      await prisma.agent.update({
        where: { id },
        data: { isActive: false }
      });

      res.json({ message: 'Agent profile deactivated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get agent's properties
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
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}