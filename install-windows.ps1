# PropertyConnect Windows Installation Script (PowerShell)
Write-Host "========================================" -ForegroundColor Green
Write-Host "PropertyConnect Windows Installation" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Python is not installed. Please install Python 3.8+ from https://python.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Prerequisites check passed!" -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ Root dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Failed to install root dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
try {
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
try {
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}

# Install AI service dependencies
Write-Host ""
Write-Host "Installing AI service dependencies..." -ForegroundColor Yellow
try {
    Set-Location ai
    Write-Host "Upgrading pip..." -ForegroundColor Cyan
    python -m pip install --upgrade pip
    
    Write-Host "Installing Python packages..." -ForegroundColor Cyan
    pip install -r requirements.txt
    
    Set-Location ..
    Write-Host "✓ AI service dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ WARNING: Some AI dependencies failed, trying individual packages..." -ForegroundColor Yellow
    try {
        pip install flask==2.3.3 flask-cors==4.0.0 openai==1.3.0 python-dotenv==1.0.0
        pip install redis==5.0.1 requests==2.31.0 pandas==2.1.1 numpy==1.24.3
        pip install scikit-learn==1.3.0 nltk==3.8.1 spacy==3.7.2
        pip install transformers==4.35.0 torch==2.1.0 gunicorn==21.2.0
        pip install python-socketio==5.9.0 eventlet==0.33.3
        pip install pytest==7.4.3 black==23.12.1 flake8==6.1.0 mypy==1.7.1
        Write-Host "✓ AI dependencies installed individually" -ForegroundColor Green
    } catch {
        Write-Host "⚠ WARNING: Some AI dependencies may not be installed" -ForegroundColor Yellow
    }
    Set-Location ..
}

# Install blockchain dependencies
Write-Host ""
Write-Host "Installing blockchain dependencies..." -ForegroundColor Yellow
try {
    Set-Location blockchain
    npm install
    Set-Location ..
    Write-Host "✓ Blockchain dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ WARNING: Failed to install blockchain dependencies" -ForegroundColor Yellow
    Set-Location ..
}

# Setup environment files
Write-Host ""
Write-Host "Setting up environment files..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
}

if (!(Test-Path "frontend\.env")) {
    Copy-Item "env.example" "frontend\.env"
    Write-Host "✓ Created frontend .env file" -ForegroundColor Green
}

if (!(Test-Path "backend\.env")) {
    Copy-Item "env.example" "backend\.env"
    Write-Host "✓ Created backend .env file" -ForegroundColor Green
}

if (!(Test-Path "ai\.env")) {
    Copy-Item "env.example" "ai\.env"
    Write-Host "✓ Created AI service .env file" -ForegroundColor Green
}

# Setup database
Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow
try {
    Set-Location backend
    npm run db:generate
    Write-Host "✓ Prisma client generated" -ForegroundColor Green
    
    npm run db:push
    Write-Host "✓ Database schema pushed" -ForegroundColor Green
    Set-Location ..
} catch {
    Write-Host "⚠ WARNING: Database setup failed" -ForegroundColor Yellow
    Set-Location ..
}

# Download spaCy model
Write-Host ""
Write-Host "Downloading spaCy model..." -ForegroundColor Yellow
try {
    Set-Location ai
    python -m spacy download en_core_web_sm
    Write-Host "✓ spaCy model downloaded" -ForegroundColor Green
    Set-Location ..
} catch {
    Write-Host "⚠ WARNING: Failed to download spaCy model" -ForegroundColor Yellow
    Set-Location ..
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit the .env files with your configuration" -ForegroundColor White
Write-Host "2. Start the development servers with: npm run dev" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue" 