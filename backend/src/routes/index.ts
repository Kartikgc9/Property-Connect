import { Router } from 'express';
import authRoutes from './auth';
import propertyRoutes from './properties';
import chatRoutes from './chat';
// import other route files as they are implemented

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/chat', chatRoutes);
// Future: router.use('/agents', agentRoutes);
// Future: router.use('/blockchain', blockchainRoutes);
// Future: router.use('/chat', chatRoutes);

export default router;