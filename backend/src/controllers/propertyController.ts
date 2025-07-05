// backend/src/controllers/propertyController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { blockchainService } from '../services/blockchainService';
import { aiService } from '../services/aiService';
import { mapService } from '../services/mapService';
import { validateProperty } from '../utils/validation';

const prisma = new PrismaClient();

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { error } = validateProperty(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { agentId } = req.user;