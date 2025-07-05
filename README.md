# PropertyConnect - Real Estate Platform

A comprehensive real estate platform that connects buyers with agents, featuring blockchain verification, AI-powered insights, and modern web technologies.

## 🚀 Features

- **Property Listings**: Browse and search properties with advanced filters
- **Agent Management**: Connect with verified real estate professionals
- **Blockchain Verification**: Property authenticity verified on blockchain
- **AI Insights**: Market analysis and property recommendations
- **Interactive Maps**: Location-based property discovery
- **Real-time Chat**: Communication between buyers and agents
- **Virtual Tours**: 360° property viewing experience
- **Mobile Responsive**: Works seamlessly on all devices

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Blockchain**: Ethereum (Solidity)
- **AI Services**: Python + Flask
- **Deployment**: Docker + Kubernetes

## 📁 Project Structure

```
propertyconnect/
├── frontend/                 # React frontend application
├── backend/                  # Node.js API server
├── blockchain/              # Smart contracts and blockchain integration
├── ai/                      # AI services and machine learning
├── infrastructure/          # Docker, Kubernetes, and deployment configs
└── docs/                   # Documentation
```

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Mapbox GL for maps
- React Hook Form for forms

### Backend
- Node.js with Express
- TypeScript for type safety
- Prisma ORM for database management
- JWT for authentication
- bcrypt for password hashing
- Joi for validation
- Socket.io for real-time features

### Database
- PostgreSQL for primary data
- Redis for caching and sessions

### Blockchain
- Ethereum smart contracts
- Web3.js for blockchain interaction
- Truffle for development

### AI Services
- Python with Flask
- OpenAI API integration
- Natural language processing
- Market analysis algorithms

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- Docker and Docker Compose
- PostgreSQL
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/propertyconnect.git
   cd propertyconnect
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   
   # Install AI service dependencies
   cd ../ai && pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   cp ai/.env.example ai/.env
   
   # Edit environment variables
   nano .env
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up postgres redis -d
   
   # Run database migrations
   cd backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually:
   # Frontend (http://localhost:3000)
   cd frontend && npm run dev
   
   # Backend (http://localhost:5000)
   cd backend && npm run dev
   
   # AI Service (http://localhost:8000)
   cd ai && python app.py
   ```

## 🐳 Docker Deployment

### Development
```bash
# Build and start all services
docker-compose up --build

# Start specific services
docker-compose up frontend backend postgres redis
```

### Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Property Endpoints
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/search` - Search properties

### Agent Endpoints
- `GET /api/agents` - List agents
- `GET /api/agents/:id` - Get agent details
- `POST /api/agents` - Create agent profile
- `PUT /api/agents/:id` - Update agent profile

### Chat Endpoints
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/send` - Send message
- `GET /api/chat/history/:sessionId` - Get chat history

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your-mapbox-token
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/propertyconnect
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

#### AI Service (.env)
```env
OPENAI_API_KEY=your-openai-api-key
FLASK_ENV=development
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Run all tests
npm test
```

## 📦 Build for Production

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build

# Build all
npm run build
```

## 🚀 Deployment

### Kubernetes
```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/

# Check deployment status
kubectl get pods
kubectl get services
```

### Docker Swarm
```bash
# Deploy to Docker Swarm
docker stack deploy -c docker-compose.prod.yml propertyconnect
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.propertyconnect.com](https://docs.propertyconnect.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/propertyconnect/issues)
- **Discord**: [Join our community](https://discord.gg/propertyconnect)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Mapbox](https://www.mapbox.com/) - Maps and location services
- [OpenAI](https://openai.com/) - AI services

---

**PropertyConnect** - Connecting buyers with trusted agents through blockchain-verified properties and AI-powered insights. 