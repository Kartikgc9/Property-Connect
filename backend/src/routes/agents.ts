import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { agentProfileSchema } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { prisma } from '../app';

const router = express.Router();

// Get all agents
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state, specialty } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

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

    const agents = await prisma.agent.findMany({
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
        _count: {
          select: {
            properties: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    const total = await prisma.agent.count({ where });

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
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
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
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create agent profile
router.post('/', 
  authLimiter,
  authenticateToken,
  validate(agentProfileSchema),
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { licenseNumber, agency, experience, bio, specialties, serviceAreas } = req.body;

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
          specialties: specialties || [],
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
      console.error('Error creating agent profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update agent profile
router.put('/:id',
  authenticateToken,
  validate(agentProfileSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { licenseNumber, agency, experience, bio, specialties, serviceAreas } = req.body;

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
      if (licenseNumber !== existingAgent.licenseNumber) {
        const existingLicense = await prisma.agent.findUnique({
          where: { licenseNumber }
        });

        if (existingLicense) {
          return res.status(400).json({ error: 'License number already registered' });
        }
      }

      const agent = await prisma.agent.update({
        where: { id },
        data: {
          licenseNumber,
          agency,
          experience,
          bio,
          specialties: specialties || [],
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

      res.json(agent);
    } catch (error) {
      console.error('Error updating agent profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get agent metrics
router.get('/:id/metrics', authenticateToken, async (req, res) => {
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

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate agent profile
router.delete('/:id', authenticateToken, async (req, res) => {
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
    console.error('Error deactivating agent profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;