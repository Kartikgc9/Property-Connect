import express from 'express';
import { authenticateToken, requireAgent } from '../middleware/auth';
import {
  createProperty,
  listProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController';

const router = express.Router();

// Public routes
router.get('/', listProperties);
router.get('/:id', getPropertyById);

// Protected routes (Agent only)
router.post('/', authenticateToken, requireAgent, createProperty);
router.put('/:id', authenticateToken, requireAgent, updateProperty);
router.delete('/:id', authenticateToken, requireAgent, deleteProperty);

export default router;