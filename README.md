# PropertyConnect

PropertyConnect is a comprehensive SaaS real-estate platform that connects trusted agents with buyers/renters. It combines blockchain-backed title verification, hyper-local insights, AI search assistance, and collaborative tools in a modern, cloud-native stack.

## 🚀 Features

### Core Platform Features
- **Property Listings**: Advanced search with filters, map integration, and detailed property information
- **Agent Management**: Verified real estate professionals with performance metrics and ratings
- **Buyer Dashboard**: Personalized property recommendations and saved searches
- **Real-time Communication**: Built-in messaging system for agent-buyer interactions

### Advanced Features
- **Blockchain Verification**: Property title verification using Ethereum for transparency and fraud prevention
- **AI-Powered Analysis**: Machine learning-driven property rate analysis and market insights
- **Hyper-Local Data**: School ratings, crime statistics, commute times, and infrastructure data
- **Virtual Tours**: 360° property viewing with embedded Matterport integration
- **Agent Collaboration**: Tools for co-listing properties and sharing leads

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **State Management** | Redux Toolkit, React Query |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Cache** | Redis |
| **Blockchain** | Ethereum via Ethers.js |
| **AI/ML** | OpenAI API, TensorFlow.js (planned) |
| **Maps** | Mapbox GL JS |
| **Testing** | Jest (Backend), Vitest (Frontend), Supertest |
| **Infrastructure** | Docker, GitHub Actions CI/CD |

## 🏗️ Project Structure

```
propertyconnect/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic (AI, blockchain, maps)
│   │   ├── middleware/      # Auth, logging, error handling
│   │   ├── routes/          # API routes
│   │   └── utils/           # Validation, helpers
│   ├── tests/               # API integration tests
│   └── prisma/              # Database schema and migrations
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Route components
│   │   ├── store/           # Redux store and slices
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript definitions
│   └── tests/               # Component tests
├── ai/                      # AI/ML services (Python/Flask)
├── blockchain/              # Smart contracts and utilities
├── infrastructure/          # Docker, K8s, deployment configs
└── .github/                 # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 8+
- **Docker** & Docker Compose
- **PostgreSQL** 15+
- **Redis** 7+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/propertyconnect.git
   cd propertyconnect
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp env.example .env
   
   # Edit with your API keys and database credentials
   nano .env
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   ```bash
   cd backend
   
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma db push
   
   # Seed database (optional)
   npm run db:seed
   ```

### Development

#### Using Docker (Recommended)
```bash
# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

#### Manual Setup
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - Database (if not using Docker)
# Start PostgreSQL and Redis manually
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/propertyconnect
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Blockchain (Ethereum)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
PRIVATE_KEY=your-wallet-private-key
CONTRACT_ADDRESS=your-contract-address

# APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
MAPBOX_ACCESS_TOKEN=your-mapbox-token

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloud Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=propertyconnect-uploads

# Development
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

### Frontend Tests
```bash
cd frontend

# Run component tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run full test suite
npm run test:e2e
```

## � Build & Deployment

### Development Build
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Production Deployment

#### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### Manual Deployment
```bash
# Build applications
npm run build

# Start production servers
cd backend && npm start
cd frontend && npm run preview
```

## � API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration (agent/buyer)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/logout` - User logout

### Property Endpoints
- `GET /api/properties` - List properties with filters
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (agents only)
- `PUT /api/properties/:id` - Update property (agents only)
- `DELETE /api/properties/:id` - Delete property (agents only)

### Agent Endpoints
- `GET /api/agents` - List verified agents
- `GET /api/agents/:id` - Get agent profile and metrics
- `POST /api/agents/collaborate` - Create collaboration request

### Chat Endpoints
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/history` - Get chat history

### Blockchain Endpoints
- `POST /api/blockchain/verify` - Verify property on blockchain
- `GET /api/blockchain/status/:txHash` - Get verification status

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure all tests pass**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Maintain >80% test coverage for new features
- **TypeScript**: Use strict typing, avoid `any` types
- **Commits**: Use conventional commit messages
- **Documentation**: Update README and API docs for new features

## 🐛 Troubleshooting

### Common Issues

**TypeScript Errors**
```bash
# Install missing type declarations
cd backend && npm install --save-dev @types/node @types/express
cd frontend && npm install --save-dev @types/react @types/react-dom
```

**Database Connection Issues**
```bash
# Check PostgreSQL is running
docker-compose ps

# Reset database
npx prisma db push --force-reset
```

**Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Conflicts**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill processes or change ports in .env
```

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework  
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Mapbox](https://www.mapbox.com/) - Maps and location services
- [OpenAI](https://openai.com/) - AI services
- [Ethers.js](https://ethers.org/) - Ethereum library

## 🆘 Support

- **Documentation**: [docs.propertyconnect.com](https://docs.propertyconnect.com)
- **Issues**: [GitHub Issues](https://github.com/yourorg/propertyconnect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourorg/propertyconnect/discussions)
- **Email**: support@propertyconnect.com

---

**PropertyConnect** - Revolutionizing real estate through blockchain verification, AI insights, and seamless agent-buyer connections. 