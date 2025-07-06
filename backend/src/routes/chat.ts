import express from 'express';
import { sendMessage } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Chatbot endpoint – authenticated (or could be public)
router.post('/message', authenticateToken, sendMessage);

export default router;