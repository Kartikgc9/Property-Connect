@echo off
echo ========================================
echo PropertyConnect Simple Installation
echo ========================================
echo.

echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Installing blockchain dependencies...
cd blockchain
call npm install
if %errorlevel% neq 0 (
    echo WARNING: Failed to install blockchain dependencies
)
cd ..

echo.
echo Installing AI service dependencies...
cd ai
call pip install --upgrade pip
call pip install flask==2.3.3 flask-cors==4.0.0 openai==1.3.0 python-dotenv==1.0.0
call pip install redis==5.0.1 requests==2.31.0 pandas==2.1.1 numpy==1.24.3
call pip install scikit-learn==1.3.0 nltk==3.8.1 spacy==3.7.2
call pip install transformers==4.35.0 torch==2.1.0 gunicorn==21.2.0
call pip install python-socketio==5.9.0 eventlet==0.33.3
call pip install pytest==7.4.3 black==23.12.1 flake8==6.1.0 mypy==1.7.1
cd ..

echo.
echo Setting up environment files...
if not exist ".env" (
    copy "env.example" ".env"
    echo Created .env file
)

if not exist "frontend\.env" (
    copy "env.example" "frontend\.env"
    echo Created frontend .env file
)

if not exist "backend\.env" (
    copy "env.example" "backend\.env"
    echo Created backend .env file
)

if not exist "ai\.env" (
    copy "env.example" "ai\.env"
    echo Created AI service .env file
)

echo.
echo Downloading spaCy model...
cd ai
call python -m spacy download en_core_web_sm
cd ..

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Edit the .env files with your configuration
echo 2. Start the development servers with: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
pause 