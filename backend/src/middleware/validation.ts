import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }))
      });
    }
    next();
  };
};

// Query parameter validation
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Query Validation Error',
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          type: detail.type
        }))
      });
    }
    next();
  };
};

// User registration validation schema
export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
  role: Joi.string().valid('BUYER', 'AGENT').required()
});

// User login validation schema
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Property creation validation schema
export const propertyCreationSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(2000).required(),
  type: Joi.string().valid('HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL').required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD').default('USD'),
  bedrooms: Joi.number().integer().min(0).max(20).optional(),
  bathrooms: Joi.number().integer().min(0).max(20).optional(),
  area: Joi.number().positive().required(),
  areaUnit: Joi.string().valid('sqft', 'sqm').default('sqft'),
  address: Joi.string().min(10).max(200).required(),
  city: Joi.string().min(2).max(100).required(),
  state: Joi.string().min(2).max(100).required(),
  zipCode: Joi.string().min(3).max(20).required(),
  country: Joi.string().min(2).max(100).default('US'),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).required(),
  images: Joi.array().items(Joi.string().uri()).min(1).max(20).required(),
  virtualTourUrl: Joi.string().uri().optional(),
  amenities: Joi.array().items(Joi.string().max(50)).max(50).optional(),
  yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  lotSize: Joi.number().positive().optional()
});

// Property update validation schema
export const propertyUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(20).max(2000).optional(),
  type: Joi.string().valid('HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL').optional(),
  price: Joi.number().positive().optional(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP', 'CAD').optional(),
  bedrooms: Joi.number().integer().min(0).max(20).optional(),
  bathrooms: Joi.number().integer().min(0).max(20).optional(),
  area: Joi.number().positive().optional(),
  areaUnit: Joi.string().valid('sqft', 'sqm').optional(),
  address: Joi.string().min(10).max(200).optional(),
  city: Joi.string().min(2).max(100).optional(),
  state: Joi.string().min(2).max(100).optional(),
  zipCode: Joi.string().min(3).max(20).optional(),
  country: Joi.string().min(2).max(100).optional(),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required()
  }).optional(),
  images: Joi.array().items(Joi.string().uri()).min(1).max(20).optional(),
  virtualTourUrl: Joi.string().uri().optional(),
  amenities: Joi.array().items(Joi.string().max(50)).max(50).optional(),
  yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  lotSize: Joi.number().positive().optional(),
  status: Joi.string().valid('ACTIVE', 'PENDING', 'SOLD', 'WITHDRAWN').optional()
});

// Agent profile validation schema
export const agentProfileSchema = Joi.object({
  licenseNumber: Joi.string().min(5).max(50).required(),
  agency: Joi.string().min(2).max(100).required(),
  experience: Joi.number().integer().min(0).max(50).required(),
  bio: Joi.string().max(1000).optional(),
  specialties: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  serviceAreas: Joi.array().items(Joi.string().max(100)).min(1).max(20).required()
});

// Search query validation schema
export const propertySearchSchema = Joi.object({
  query: Joi.string().max(200).optional(),
  type: Joi.string().valid('HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL').optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  minBedrooms: Joi.number().integer().min(0).max(20).optional(),
  maxBedrooms: Joi.number().integer().min(0).max(20).optional(),
  minBathrooms: Joi.number().integer().min(0).max(20).optional(),
  maxBathrooms: Joi.number().integer().min(0).max(20).optional(),
  minArea: Joi.number().positive().optional(),
  maxArea: Joi.number().positive().optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  zipCode: Joi.string().max(20).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('price', 'area', 'bedrooms', 'bathrooms', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// Message validation schema
export const messageSchema = Joi.object({
  receiverId: Joi.string().required(),
  content: Joi.string().min(1).max(1000).required(),
  type: Joi.string().valid('TEXT', 'IMAGE', 'DOCUMENT').default('TEXT')
});

// Sanitize input by removing potentially harmful characters
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  return input;
};

// Sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};