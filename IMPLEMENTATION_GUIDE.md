# PropertyConnect Implementation Guide

## 🚀 Complete Step-by-Step Implementation Guide

This guide provides detailed instructions to complete the PropertyConnect real estate platform. Follow these steps in order to finish the high and medium priority tasks.

## Phase 4: Backend Controllers & Database Integration

### Step 1: Install Required Dependencies

```bash
# Backend dependencies
cd backend
npm install @prisma/client prisma bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken @types/node

# Frontend dependencies  
cd ../frontend
npm install @types/react @types/react-dom @types/google.maps
```

### Step 2: Database Setup & Migration

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### Step 3: Update Backend Routes

Update the route files to use the new controllers:

**backend/src/routes/properties.ts:**
```typescript
import express from 'express';
import { PropertyController } from '../controllers/propertyController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', PropertyController.getProperties);
router.get('/:id', PropertyController.getPropertyById);
router.post('/search', PropertyController.searchProperties);

// Protected routes
router.post('/', authenticateToken, PropertyController.createProperty);
router.put('/:id', authenticateToken, PropertyController.updateProperty);
router.delete('/:id', authenticateToken, PropertyController.deleteProperty);

// Agent routes
router.get('/agent/my-properties', authenticateToken, PropertyController.getAgentProperties);

export default router;
```

**backend/src/routes/agents.ts:**
```typescript
import express from 'express';
import { AgentController } from '../controllers/agentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', AgentController.getAgents);
router.get('/:id', AgentController.getAgentById);

// Protected routes
router.post('/profile', authenticateToken, AgentController.createAgentProfile);
router.put('/:id', authenticateToken, AgentController.updateAgentProfile);
router.get('/:id/metrics', authenticateToken, AgentController.getAgentMetrics);
router.delete('/:id', authenticateToken, AgentController.deactivateAgent);
router.get('/my-properties', authenticateToken, AgentController.getAgentProperties);

export default router;
```

**backend/src/routes/users.ts:**
```typescript
import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.get('/saved-properties', authenticateToken, UserController.getSavedProperties);
router.post('/save-property', authenticateToken, UserController.saveProperty);
router.delete('/saved-properties/:propertyId', authenticateToken, UserController.removeSavedProperty);
router.put('/preferences', authenticateToken, UserController.updateBuyerPreferences);
router.delete('/account', authenticateToken, UserController.deleteAccount);

export default router;
```

### Step 4: Create Authentication Middleware

**backend/src/middleware/auth.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### Step 5: Update App.ts to Use Controllers

**backend/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { apiLimiter } from './middleware/rateLimiter';

// Import routes
import propertyRoutes from './routes/properties';
import agentRoutes from './routes/agents';
import userRoutes from './routes/users';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
```

## Phase 5: Frontend Components Integration

### Step 6: Install Frontend Dependencies

```bash
cd frontend
npm install axios react-query
npm install -D @types/google.maps
```

### Step 7: Create API Service

**frontend/src/services/api.ts:**
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 8: Update Frontend Pages to Use Components

**frontend/src/pages/PropertyListingsPage.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyMap } from '../components/PropertyMap';
import { Property } from '../types/property';
import api from '../services/api';

export const PropertyListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId: string) => {
    try {
      await api.post('/users/save-property', { propertyId });
      // Update UI to show saved state
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Properties</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Map
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSave={handleSaveProperty}
            />
          ))}
        </div>
      ) : (
        <PropertyMap
          properties={properties}
          height="600px"
        />
      )}
    </div>
  );
};
```

### Step 9: Add Environment Variables

**frontend/.env:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**backend/.env:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/propertyconnect"
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

## Phase 6: Smart Contract Implementation

### Step 10: Create Smart Contract

**blockchain/contracts/PropertyRegistry.sol:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRegistry {
    struct Property {
        string propertyId;
        address owner;
        string metadataHash;
        uint256 price;
        bool isVerified;
        uint256 timestamp;
    }

    mapping(string => Property) public properties;
    mapping(address => string[]) public ownerProperties;
    
    event PropertyRegistered(string propertyId, address owner, uint256 price);
    event PropertyVerified(string propertyId);
    event PropertyTransferred(string propertyId, address from, address to);

    function registerProperty(
        string memory _propertyId,
        string memory _metadataHash,
        uint256 _price
    ) public {
        require(bytes(properties[_propertyId].propertyId).length == 0, "Property already exists");
        
        properties[_propertyId] = Property({
            propertyId: _propertyId,
            owner: msg.sender,
            metadataHash: _metadataHash,
            price: _price,
            isVerified: false,
            timestamp: block.timestamp
        });
        
        ownerProperties[msg.sender].push(_propertyId);
        emit PropertyRegistered(_propertyId, msg.sender, _price);
    }

    function verifyProperty(string memory _propertyId) public {
        require(bytes(properties[_propertyId].propertyId).length > 0, "Property does not exist");
        properties[_propertyId].isVerified = true;
        emit PropertyVerified(_propertyId);
    }

    function transferProperty(string memory _propertyId, address _to) public {
        require(properties[_propertyId].owner == msg.sender, "Not the owner");
        require(_to != address(0), "Invalid address");
        
        properties[_propertyId].owner = _to;
        ownerProperties[_to].push(_propertyId);
        
        emit PropertyTransferred(_propertyId, msg.sender, _to);
    }

    function getProperty(string memory _propertyId) public view returns (Property memory) {
        return properties[_propertyId];
    }
}
```

### Step 11: Deploy Smart Contract

**blockchain/scripts/deploy.js:**
```javascript
const { ethers } = require("hardhat");

async function main() {
  const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();
  
  await propertyRegistry.deployed();
  
  console.log("PropertyRegistry deployed to:", propertyRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Phase 7: Docker Configuration

### Step 12: Create Docker Files

**Dockerfile (backend):**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

**Dockerfile (frontend):**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: propertyconnect
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/propertyconnect
      JWT_SECRET: your-super-secret-jwt-key
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Phase 8: Testing & Deployment

### Step 13: Run the Application

```bash
# Start with Docker
docker-compose up -d

# Or run individually
# Terminal 1: Database
docker run -d -p 5432:5432 -e POSTGRES_DB=propertyconnect -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password postgres:15

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev

# Terminal 4: AI Service
cd ai
python -m flask run
```

### Step 14: Test the Application

1. **Register a new user**: POST `/api/users/register`
2. **Login**: POST `/api/users/login`
3. **Create agent profile**: POST `/api/agents/profile`
4. **List a property**: POST `/api/properties`
5. **Search properties**: GET `/api/properties`
6. **Save a property**: POST `/api/users/save-property`

### Step 15: Deploy to Production

```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d

# Or deploy to cloud platforms
# AWS ECS, Google Cloud Run, or Azure Container Instances
```

## 🎯 Key Features Completed

✅ **Backend Controllers**: Complete CRUD operations for properties, agents, and users
✅ **Database Integration**: PostgreSQL with Prisma ORM
✅ **Authentication**: JWT-based authentication system
✅ **API Endpoints**: RESTful API with proper error handling
✅ **Frontend Components**: PropertyCard, PropertyMap, ChatModal
✅ **Database Seeding**: Sample data for testing
✅ **Smart Contracts**: Property registration and verification
✅ **Docker Configuration**: Complete containerization setup

## 🚀 Next Steps

1. **Testing**: Add unit and integration tests
2. **Performance**: Implement caching and optimization
3. **Security**: Add rate limiting and input validation
4. **Monitoring**: Add logging and error tracking
5. **CI/CD**: Set up automated deployment pipeline

## 📝 Important Notes

- Update all environment variables with production values
- Configure proper database credentials
- Set up SSL certificates for HTTPS
- Configure proper CORS settings
- Add proper error logging and monitoring
- Implement proper backup strategies

This guide provides a complete roadmap to finish the PropertyConnect platform. Follow each step carefully and test thoroughly before deploying to production.