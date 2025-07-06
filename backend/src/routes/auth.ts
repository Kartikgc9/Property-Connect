import express from 'express';
import { register, login, getCurrentUser, updateProfile, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/me', authenticateToken, updateProfile);
router.post('/logout', authenticateToken, logout);

export default router;