import Joi from 'joi';

export const validateRegistration = (data: unknown) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().optional(),
    role: Joi.string().valid('BUYER', 'AGENT').required(),
    agency: Joi.string().when('role', {
      is: 'AGENT',
      then: Joi.string().optional(),
      otherwise: Joi.forbidden(),
    }),
    experience: Joi.number().when('role', {
      is: 'AGENT',
      then: Joi.number().min(0).optional(),
      otherwise: Joi.forbidden(),
    }),
    specialties: Joi.array().items(Joi.string()).when('role', {
      is: 'AGENT',
      then: Joi.array().optional(),
      otherwise: Joi.forbidden(),
    }),
    serviceAreas: Joi.array().items(Joi.string()).when('role', {
      is: 'AGENT',
      then: Joi.array().optional(),
      otherwise: Joi.forbidden(),
    }),
    preferredAreas: Joi.array().items(Joi.string()).when('role', {
      is: 'BUYER',
      then: Joi.array().optional(),
      otherwise: Joi.forbidden(),
    }),
    budgetMin: Joi.number().when('role', {
      is: 'BUYER',
      then: Joi.number().min(0).optional(),
      otherwise: Joi.forbidden(),
    }),
    budgetMax: Joi.number().when('role', {
      is: 'BUYER',
      then: Joi.number().min(0).optional(),
      otherwise: Joi.forbidden(),
    }),
    propertyTypes: Joi.array().items(Joi.string()).when('role', {
      is: 'BUYER',
      then: Joi.array().optional(),
      otherwise: Joi.forbidden(),
    }),
  });

  return schema.validate(data);
};

export const validateLogin = (data: unknown) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

export const validateProperty = (data: unknown) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    type: Joi.string().valid('HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL').required(),
    price: Joi.number().min(0).required(),
    currency: Joi.string().default('USD'),
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    area: Joi.number().min(0).required(),
    areaUnit: Joi.string().default('sqft'),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('US'),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
    }).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    virtualTourUrl: Joi.string().uri().optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    yearBuilt: Joi.number().min(1800).max(new Date().getFullYear()).optional(),
    lotSize: Joi.number().min(0).optional(),
  });

  return schema.validate(data);
};

export const validatePropertyUpdate = (data: unknown) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    type: Joi.string().valid('HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL').optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().optional(),
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    area: Joi.number().min(0).optional(),
    areaUnit: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    country: Joi.string().optional(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      lng: Joi.number().min(-180).max(180).required(),
    }).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    virtualTourUrl: Joi.string().uri().optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    yearBuilt: Joi.number().min(1800).max(new Date().getFullYear()).optional(),
    lotSize: Joi.number().min(0).optional(),
  });

  return schema.validate(data);
};

export const validateAgent = (data: unknown) => {
  const schema = Joi.object({
    licenseNumber: Joi.string().required(),
    agency: Joi.string().required(),
    experience: Joi.number().min(0).required(),
    bio: Joi.string().max(1000).optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    serviceAreas: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data);
};

export const validateSearchFilters = (data: unknown) => {
  const schema = Joi.object({
    searchTerm: Joi.string().optional(),
    location: Joi.string().optional(),
    priceMin: Joi.number().min(0).optional(),
    priceMax: Joi.number().min(0).optional(),
    propertyType: Joi.array().items(Joi.string()).optional(),
    bedrooms: Joi.number().min(0).optional(),
    bathrooms: Joi.number().min(0).optional(),
    areaMin: Joi.number().min(0).optional(),
    areaMax: Joi.number().min(0).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    yearBuilt: Joi.number().min(1800).max(new Date().getFullYear()).optional(),
    sortBy: Joi.string().valid('price', 'date', 'area').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
  });

  return schema.validate(data);
};