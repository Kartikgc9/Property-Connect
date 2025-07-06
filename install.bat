@echo off
echo ========================================
echo PropertyConnect Installation Script
echo ========================================
echo.

echo Checking prerequisites...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed. Please install Python 3.8+ from https://python.org/
    pause
    exit /b 1
)

echo Prerequisites check passed!
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
    pause
    exit /b 1
)
cd ..

echo.
echo Installing AI service dependencies...
cd ai
call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install AI service dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Setting up environment files...
if not exist ".env" (
    copy "env.example" ".env"
    echo Created .env file from template
)

if not exist "frontend\.env" (
    copy "env.example" "frontend\.env"
    echo Created frontend .env file from template
)

if not exist "backend\.env" (
    copy "env.example" "backend\.env"
    echo Created backend .env file from template
)

if not exist "ai\.env" (
    copy "env.example" "ai\.env"
    echo Created AI service .env file from template
)

echo.
echo Setting up database...
cd backend
call npm run db:generate
if %errorlevel% neq 0 (
    echo WARNING: Failed to generate Prisma client
)

call npm run db:push
if %errorlevel% neq 0 (
    echo WARNING: Failed to push database schema
)
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
echo For more information, see README.md
echo.
pause 