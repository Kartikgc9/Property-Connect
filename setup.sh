#!/bin/bash

# PropertyConnect Setup Script
# This script automates the setup process for the PropertyConnect platform

echo "🚀 PropertyConnect Setup Script"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install @prisma/client prisma bcrypt jsonwebtoken express cors helmet compression express-rate-limit
npm install -D @types/bcrypt @types/jsonwebtoken @types/node @types/express @types/cors nodemon ts-node typescript

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install axios react-query @types/react @types/react-dom @types/google.maps

echo "✅ Dependencies installed"

# Create environment files
echo "🔧 Creating environment files..."

# Backend .env
cat > ../backend/.env << EOL
DATABASE_URL="postgresql://postgres:password@localhost:5432/propertyconnect"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
REDIS_URL=redis://localhost:6379
NODE_ENV=development
EOL

# Frontend .env
cat > .env << EOL
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOL

# AI service .env
cat > ../ai/.env << EOL
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=1
EOL

echo "✅ Environment files created"

# Create Docker Compose file
echo "🐳 Creating Docker Compose configuration..."
cat > ../docker-compose.yml << EOL
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/propertyconnect
      JWT_SECRET: your-super-secret-jwt-key
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  ai:
    build: ./ai
    ports:
      - "5000:5000"
    environment:
      OPENAI_API_KEY: your_openai_api_key_here
    volumes:
      - ./ai:/app

volumes:
  postgres_data:
EOL

echo "✅ Docker Compose file created"

# Create package.json scripts for easier development
echo "📝 Updating package.json scripts..."

# Backend package.json scripts
cd ../backend
npm pkg set scripts.dev="nodemon --exec ts-node src/app.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/app.js"
npm pkg set scripts.db:generate="prisma generate"
npm pkg set scripts.db:migrate="prisma migrate dev"
npm pkg set scripts.db:seed="ts-node prisma/seed.ts"
npm pkg set scripts.db:studio="prisma studio"

# Frontend package.json scripts
cd ../frontend
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"

echo "✅ Package.json scripts updated"

# Create development startup script
echo "🔧 Creating development startup script..."
cat > ../start-dev.sh << EOL
#!/bin/bash

echo "🚀 Starting PropertyConnect in development mode..."

# Start database services
echo "📊 Starting database services..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Generate Prisma client and run migrations
echo "🗄️ Setting up database..."
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed

# Start all services
echo "🚀 Starting all services..."
cd ..
docker-compose up -d

echo "✅ All services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "🤖 AI Service: http://localhost:5000"
echo "📊 Database: localhost:5432"
echo "🗄️ Prisma Studio: npm run db:studio (in backend folder)"
EOL

chmod +x ../start-dev.sh

echo "✅ Development startup script created"

# Create production build script
echo "🔧 Creating production build script..."
cat > ../build-prod.sh << EOL
#!/bin/bash

echo "🏗️ Building PropertyConnect for production..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build

# Build frontend
echo "📦 Building frontend..."
cd ../frontend
npm run build

# Build Docker images
echo "🐳 Building Docker images..."
cd ..
docker-compose build

echo "✅ Production build complete!"
echo "🚀 Run 'docker-compose up -d' to start in production mode"
EOL

chmod +x ../build-prod.sh

echo "✅ Production build script created"

# Create README with quick start instructions
echo "📚 Creating README with quick start instructions..."
cat > ../QUICK_START.md << EOL
# PropertyConnect Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Development Setup

1. **Clone and Setup**
   \`\`\`bash
   git clone <repository-url>
   cd PropertyConnect
   chmod +x setup.sh
   ./setup.sh
   \`\`\`

2. **Start Development Environment**
   \`\`\`bash
   ./start-dev.sh
   \`\`\`

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - AI Service: http://localhost:5000

### Manual Setup (Alternative)

1. **Install Dependencies**
   \`\`\`bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   \`\`\`

2. **Setup Database**
   \`\`\`bash
   # Start PostgreSQL
   docker run -d -p 5432:5432 -e POSTGRES_DB=propertyconnect -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password postgres:15
   
   # Run migrations
   cd backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   \`\`\`

3. **Start Services**
   \`\`\`bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   
   # Terminal 3: AI Service
   cd ai
   python -m flask run
   \`\`\`

### Production Deployment

1. **Build for Production**
   \`\`\`bash
   ./build-prod.sh
   \`\`\`

2. **Deploy with Docker**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

### Environment Variables

Update the following files with your actual values:

- \`backend/.env\` - Database URL, JWT secret
- \`frontend/.env\` - API URL, Google Maps API key
- \`ai/.env\` - OpenAI API key

### Default Test Accounts

After seeding the database:

- **Admin**: admin@propertyconnect.com / password123
- **Agent**: john.agent@propertyconnect.com / password123
- **Buyer**: mike.buyer@email.com / password123

### API Endpoints

- \`GET /api/properties\` - List properties
- \`POST /api/users/register\` - Register user
- \`POST /api/users/login\` - Login user
- \`GET /api/agents\` - List agents

### Useful Commands

\`\`\`bash
# Database management
npm run db:studio          # Open Prisma Studio
npm run db:migrate         # Run migrations
npm run db:seed           # Seed database

# Development
npm run dev               # Start development server
npm run build            # Build for production
npm run start            # Start production server
\`\`\`

### Troubleshooting

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Ensure PostgreSQL is running
3. **API errors**: Check backend logs and environment variables
4. **Frontend issues**: Verify API URL in frontend/.env

For detailed implementation guide, see \`IMPLEMENTATION_GUIDE.md\`.
EOL

echo "✅ Quick start guide created"

cd ..

echo ""
echo "🎉 PropertyConnect setup complete!"
echo "=================================="
echo ""
echo "📁 Files created:"
echo "  - backend/.env"
echo "  - frontend/.env"
echo "  - ai/.env"
echo "  - docker-compose.yml"
echo "  - start-dev.sh"
echo "  - build-prod.sh"
echo "  - QUICK_START.md"
echo ""
echo "🚀 Next steps:"
echo "  1. Update environment variables with your API keys"
echo "  2. Run './start-dev.sh' to start development environment"
echo "  3. Visit http://localhost:3000 to see the application"
echo ""
echo "📚 For detailed instructions, see:"
echo "  - QUICK_START.md (basic setup)"
echo "  - IMPLEMENTATION_GUIDE.md (complete guide)"
echo ""
echo "✅ Happy coding!"