import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { validateAgent } from '../utils/validation';
import { logger } from '../middleware/logger';
import { AgentCreateRequest, AgentUpdateRequest, AgentSearchQuery, ApiResponse, PaginatedApiResponse } from '../types/api';

const prisma = new PrismaClient();

interface AgentResponse {
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
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  properties: Array<{
    id: string;
    title: string;
    price: number;
    status: string;
  }>;
  metrics: Array<{
    id: string;
    month: number;
    year: number;
    propertiesListed: number;
    propertiesSold: number;
    totalRevenue: number;
  }>;
}

export const createAgent = async (req: AuthRequest & { body: AgentCreateRequest }, res: Response<ApiResponse<AgentResponse>>) => {
  try {
    const { error } = validateAgent(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const userId = req.user!.id;
    const { licenseNumber, agency, experience, bio, specialties, serviceAreas } = req.body;

    // Check if agent profile already exists
    const existingAgent = await prisma.agent.findUnique({
      where: { userId }
    });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        error: 'Agent profile already exists'
      });
    }

    const agent = await prisma.agent.create({
      data: {
        userId,
        licenseNumber,
        agency,
        experience,
        bio,
        specialties: specialties || [],
        serviceAreas: serviceAreas || [],
        rating: 0,
        reviewCount: 0,
        responseTime: 0,
        isActive: true
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
        },
        properties: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true
          }
        },
        metrics: true
      }
    });

    logger.info(`Agent profile created for user ${userId}`);

    res.status(201).json({
      success: true,
      data: agent as AgentResponse
    });
  } catch (error) {
    logger.error('Create agent error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getAgents = async (req: Request<{}, PaginatedApiResponse<AgentResponse>, {}, AgentSearchQuery>, res: Response<PaginatedApiResponse<AgentResponse>>) => {
  try {
    const {
      searchTerm,
      location,
      specialties,
      rating,
      experience,
      isActive,
      page = 1,
      limit = 10
    } = req.query;

    const where: Record<string, unknown> = {};

    if (searchTerm) {
      where.OR = [
        { user: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
        { agency: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.serviceAreas = {
        has: location
      };
    }

    if (specialties) {
      where.specialties = {
        hasSome: specialties.split(',')
      };
    }

    if (rating) {
      where.rating = {
        gte: Number(rating)
      };
    }

    if (experience) {
      where.experience = {
        gte: Number(experience)
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        skip,
        take: Number(limit),
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
            select: {
              id: true,
              title: true,
              price: true,
              status: true
            }
          },
          metrics: true
        },
        orderBy: {
          rating: 'desc'
        }
      }),
      prisma.agent.count({ where })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: agents as AgentResponse[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    logger.error('Get agents error', error);
    res.status(500).json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    });
  }
};

export const getAgentById = async (req: Request, res: Response<ApiResponse<AgentResponse>>) => {
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
          select: {
            id: true,
            title: true,
            price: true,
            status: true
          }
        },
        metrics: true
      }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent as AgentResponse
    });
  } catch (error) {
    logger.error('Get agent error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateAgent = async (req: AuthRequest & { params: { id: string }; body: AgentUpdateRequest }, res: Response<ApiResponse<AgentResponse>>) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Ensure the agent belongs to the authenticated user
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    if (existingAgent.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this agent profile'
      });
    }

    const updateData = req.body;

    const updatedAgent = await prisma.agent.update({
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
        },
        properties: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true
          }
        },
        metrics: true
      }
    });

    logger.info(`Agent profile updated: ${id}`);

    res.json({
      success: true,
      data: updatedAgent as AgentResponse
    });
  } catch (error) {
    logger.error('Update agent error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteAgent = async (req: AuthRequest & { params: { id: string } }, res: Response<ApiResponse<{ message: string }>>) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Ensure the agent belongs to the authenticated user
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    });

    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    if (existingAgent.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this agent profile'
      });
    }

    await prisma.agent.delete({
      where: { id }
    });

    logger.info(`Agent profile deleted: ${id}`);

    res.json({
      success: true,
      data: { message: 'Agent profile deleted successfully' }
    });
  } catch (error) {
    logger.error('Delete agent error', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export default {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent
};