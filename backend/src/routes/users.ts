import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { userRegistrationSchema } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { prisma } from '../app';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            id: true,
            licenseNumber: true,
            agency: true,
            experience: true,
            rating: true,
            reviewCount: true,
            bio: true,
            specialties: true,
            serviceAreas: true,
            isActive: true
          }
        },
        buyer: {
          select: {
            id: true,
            preferredAreas: true,
            budgetMin: true,
            budgetMax: true,
            propertyTypes: true,
            savedProperties: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', 
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, phone, avatar } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phone,
          avatar
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get user's properties (for agents)
router.get('/properties', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Check if user is an agent
    const agent = await prisma.agent.findUnique({
      where: { userId }
    });

    if (!agent) {
      return res.status(403).json({ error: 'Only agents can access this endpoint' });
    }

    const where: any = {
      agentId: agent.id
    };

    if (status) {
      where.status = String(status);
    }

    const properties = await prisma.property.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.property.count({ where });

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's saved properties (for buyers)
router.get('/saved-properties', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const buyer = await prisma.buyer.findUnique({
      where: { userId }
    });

    if (!buyer) {
      return res.status(403).json({ error: 'Only buyers can access this endpoint' });
    }

    const properties = await prisma.property.findMany({
      where: {
        id: {
          in: buyer.savedProperties
        }
      },
      include: {
        agent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save/unsave property (for buyers)
router.post('/save-property/:propertyId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    const buyer = await prisma.buyer.findUnique({
      where: { userId }
    });

    if (!buyer) {
      return res.status(403).json({ error: 'Only buyers can save properties' });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const isSaved = buyer.savedProperties.includes(propertyId);
    
    const updatedSavedProperties = isSaved
      ? buyer.savedProperties.filter(id => id !== propertyId)
      : [...buyer.savedProperties, propertyId];

    await prisma.buyer.update({
      where: { userId },
      data: {
        savedProperties: updatedSavedProperties
      }
    });

    res.json({ 
      message: isSaved ? 'Property removed from saved list' : 'Property saved successfully',
      saved: !isSaved
    });
  } catch (error) {
    console.error('Error saving/unsaving property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update buyer preferences
router.put('/buyer-preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { preferredAreas, budgetMin, budgetMax, propertyTypes } = req.body;

    let buyer = await prisma.buyer.findUnique({
      where: { userId }
    });

    if (!buyer) {
      // Create buyer profile if it doesn't exist
      buyer = await prisma.buyer.create({
        data: {
          userId,
          preferredAreas: preferredAreas || [],
          budgetMin,
          budgetMax,
          propertyTypes: propertyTypes || []
        }
      });
    } else {
      buyer = await prisma.buyer.update({
        where: { userId },
        data: {
          preferredAreas: preferredAreas || buyer.preferredAreas,
          budgetMin: budgetMin !== undefined ? budgetMin : buyer.budgetMin,
          budgetMax: budgetMax !== undefined ? budgetMax : buyer.budgetMax,
          propertyTypes: propertyTypes || buyer.propertyTypes
        }
      });
    }

    res.json(buyer);
  } catch (error) {
    console.error('Error updating buyer preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    // Delete related data first
    await prisma.agent.deleteMany({
      where: { userId }
    });

    await prisma.buyer.deleteMany({
      where: { userId }
    });

    await prisma.message.deleteMany({
      where: { senderId: userId }
    });

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;