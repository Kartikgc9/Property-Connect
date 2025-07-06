import express from 'express';
import { PropertyController } from '../controllers/propertyController';
import { auth } from '../middleware/auth';
import { validateProperty, validatePropertyUpdate } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/', PropertyController.getProperties);
router.get('/:id', PropertyController.getPropertyById);
router.post('/search', PropertyController.searchProperties);

// Protected routes (require authentication)
router.post('/', auth, validateProperty, PropertyController.createProperty);
router.put('/:id', auth, validatePropertyUpdate, PropertyController.updateProperty);
router.delete('/:id', auth, PropertyController.deleteProperty);

// Agent-specific routes
router.get('/agent/my-properties', auth, PropertyController.getAgentProperties);

export default router;