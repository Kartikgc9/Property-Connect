// backend/src/controllers/propertyController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';
import { mapService } from '../services/mapService';
import { validateProperty } from '../utils/validation';
import { logger } from '../middleware/logger';
import { AuthRequest } from '../middleware/auth';
import { PropertyCreateRequest, PropertyUpdateRequest, PropertySearchQuery, PropertyResponse, ApiResponse, PaginatedApiResponse } from '../types/api';

const prisma = new PrismaClient();

export const createProperty = async (req: AuthRequest, res: Response<ApiResponse<PropertyResponse>>) => {
  try {
    const { error } = validateProperty(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Make sure the request is coming from an authenticated Agent
    const agentId = req.user?.agentId;
    if (!agentId) {
      return res.status(403).json({ error: 'Only agents can create properties' });
    }

    const propertyData = {
      ...req.body,
      agentId,
    };

    // Store property in DB
    const property = await prisma.property.create({
      data: propertyData,
    });

    // Kick-off async verification on blockchain (non-blocking)
    blockchainService
      .verifyAndRecordTitle(property)
      .catch((err: unknown) => logger.error('Blockchain verification failed', err));

    // Optional: run AI analysis & local insights asynchronously
    aiService
      .generateRateAnalysis(property)
      .catch((err: unknown) => logger.error('AI analysis failed', err));

    mapService
      .enrichWithLocalInsights(property)
      .catch((err: unknown) => logger.error('Local insights fetch failed', err));

    res.status(201).json({ success: true, data: property });
  } catch (err) {
    logger.error('Create property error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listProperties = async (req: Request<{}, PaginatedApiResponse<PropertyResponse>, {}, PropertySearchQuery>, res: Response<PaginatedApiResponse<PropertyResponse>>) => {
  try {
    // Basic filtering (extend later)
    const { city, state, type, page = 1, limit = 10 } = req.query;

    const where: Record<string, unknown> = {};
    if (city) where.city = city;
    if (state) where.state = state;
    if (type) where.type = type;

    const skip = (Number(page) - 1) * Number(limit);

    const [properties, total] = await Promise.all([
      prisma.property.findMany({ 
        where,
        skip,
        take: Number(limit),
        include: {
          agent: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      }),
      prisma.property.count({ where })
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({ 
      success: true, 
      data: properties as PropertyResponse[],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (err) {
    logger.error('List properties error', err);
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

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ success: true, data: property });
  } catch (err) {
    logger.error('Get property error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const agentId = req.user?.agentId;

    // Ensure ownership
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (property.agentId !== agentId) {
      return res.status(403).json({ error: 'Not authorised to update this property' });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    logger.error('Update property error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const agentId = req.user?.agentId;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (property.agentId !== agentId) {
      return res.status(403).json({ error: 'Not authorised to delete this property' });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    logger.error('Delete property error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  createProperty,
  listProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};