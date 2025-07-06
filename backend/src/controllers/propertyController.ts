// backend/src/controllers/propertyController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';
import { mapService } from '../services/mapService';
import { validateProperty } from '../utils/validation';
import { logger } from '../middleware/logger';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = validateProperty(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Make sure the request is coming from an authenticated Agent
    const agentId = (req as any).user?.agentId;
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
      .catch((err: any) => logger.error('Blockchain verification failed', err));

    // Optional: run AI analysis & local insights asynchronously
    aiService
      .generateRateAnalysis(property)
      .catch((err: any) => logger.error('AI analysis failed', err));

    mapService
      .enrichWithLocalInsights(property)
      .catch((err: any) => logger.error('Local insights fetch failed', err));

    res.status(201).json({ success: true, data: property });
  } catch (err) {
    logger.error('Create property error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listProperties = async (req: Request, res: Response) => {
  try {
    // Basic filtering (extend later)
    const { city, state, type } = req.query as Record<string, string>;

    const where: any = {};
    if (city) where.city = city;
    if (state) where.state = state;
    if (type) where.type = type;

    const properties = await prisma.property.findMany({ where });

    res.json({ success: true, data: properties });
  } catch (err) {
    logger.error('List properties error', err);
    res.status(500).json({ error: 'Internal server error' });
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

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agentId = (req as any).user?.agentId;

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

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agentId = (req as any).user?.agentId;

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