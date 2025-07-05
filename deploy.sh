#!/bin/bash

# PropertyConnect Deployment Script
# This script deploys the application to production

set -e

echo "🚀 PropertyConnect Deployment Script"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from env.example"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Load environment variables
source .env

# Build and deploy
echo "🏗️  Building and deploying services..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npm run db:migrate

# Check service health
echo "🏥 Checking service health..."

# Check backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Check AI service
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ AI service is healthy"
else
    echo "❌ AI service health check failed"
fi

# Check frontend
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Services are available at:"
echo "- Frontend: http://localhost"
echo "- Backend API: http://localhost:5000"
echo "- AI Service: http://localhost:8000"
echo ""
echo "📊 View logs:"
echo "- docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Stop services:"
echo "- docker-compose -f docker-compose.prod.yml down" 