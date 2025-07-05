#!/bin/bash

# PropertyConnect Installation Script
# This script installs all dependencies and sets up the development environment

set -e

echo "🚀 PropertyConnect Installation Script"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Some features may not work."
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install blockchain dependencies
echo "📦 Installing blockchain dependencies..."
cd blockchain
npm install
cd ..

# Install AI service dependencies
echo "📦 Installing AI service dependencies..."
cd ai
pip install -r requirements.txt
cd ..

# Create environment files
echo "🔧 Setting up environment files..."

# Copy environment examples
cp env.example .env
cp frontend/.env.example frontend/.env 2>/dev/null || echo "Frontend .env.example not found"
cp backend/.env.example backend/.env 2>/dev/null || echo "Backend .env.example not found"
cp ai/.env.example ai/.env 2>/dev/null || echo "AI .env.example not found"

echo "📝 Environment files created. Please edit them with your configuration."

# Generate Prisma client
echo "🗄️  Setting up database..."
cd backend
npx prisma generate
cd ..

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit the .env files with your configuration"
echo "2. Start PostgreSQL and Redis: docker-compose up postgres redis -d"
echo "3. Run database migrations: cd backend && npm run db:migrate"
echo "4. Start development servers: npm run dev"
echo ""
echo "🌐 Access the application:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo "- AI Service: http://localhost:8000"
echo ""
echo "📚 Documentation: README.md" 