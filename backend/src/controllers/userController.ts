import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

export class UserController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const { 
        email, 
        password, 
        firstName, 
        lastName, 
        phone, 
        role = 'BUYER' 
      } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true
        }
      });

      // Create buyer profile if role is BUYER
      if (role === 'BUYER') {
        await prisma.buyer.create({
          data: {
            userId: user.id,
            preferredAreas: [],
            propertyTypes: [],
            savedProperties: []
          }
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        user,
        token,
        message: 'User registered successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          agent: true,
          buyer: true
        }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user profile
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          agent: true,
          buyer: true
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
          updatedAt: true,
          agent: true,
          buyer: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update user profile
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, phone, avatar } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

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
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user's saved properties (buyers only)
  static async getSavedProperties(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const buyer = await prisma.buyer.findUnique({
        where: { userId }
      });

      if (!buyer) {
        return res.status(403).json({ error: 'Only buyers can access saved properties' });
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
        }
      });

      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Save property (buyers only)
  static async saveProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { propertyId } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

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

      // Check if already saved
      if (buyer.savedProperties.includes(propertyId)) {
        return res.status(400).json({ error: 'Property already saved' });
      }

      // Add to saved properties
      await prisma.buyer.update({
        where: { userId },
        data: {
          savedProperties: {
            push: propertyId
          }
        }
      });

      res.json({ message: 'Property saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Remove saved property (buyers only)
  static async removeSavedProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { propertyId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const buyer = await prisma.buyer.findUnique({
        where: { userId }
      });

      if (!buyer) {
        return res.status(403).json({ error: 'Only buyers can manage saved properties' });
      }

      // Remove from saved properties
      const updatedSavedProperties = buyer.savedProperties.filter(id => id !== propertyId);

      await prisma.buyer.update({
        where: { userId },
        data: {
          savedProperties: updatedSavedProperties
        }
      });

      res.json({ message: 'Property removed from saved properties' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update buyer preferences
  static async updateBuyerPreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { 
        preferredAreas, 
        budgetMin, 
        budgetMax, 
        propertyTypes 
      } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const buyer = await prisma.buyer.findUnique({
        where: { userId }
      });

      if (!buyer) {
        return res.status(403).json({ error: 'Only buyers can update preferences' });
      }

      const updatedBuyer = await prisma.buyer.update({
        where: { userId },
        data: {
          preferredAreas,
          budgetMin,
          budgetMax,
          propertyTypes
        }
      });

      res.json(updatedBuyer);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete user account
  static async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Delete user (cascade will handle related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}