@echo off
echo ========================================
echo PropertyConnect Installation Test
echo ========================================
echo.

echo Testing Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not working properly
    pause
    exit /b 1
)

echo.
echo Testing Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not working properly
    pause
    exit /b 1
)

echo.
echo Testing npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not working properly
    pause
    exit /b 1
)

echo.
echo Testing pip installation...
pip --version
if %errorlevel% neq 0 (
    echo ERROR: pip is not working properly
    pause
    exit /b 1
)

echo.
echo Testing frontend dependencies...
cd frontend
call npm list --depth=0
if %errorlevel% neq 0 (
    echo WARNING: Some frontend dependencies may be missing
)
cd ..

echo.
echo Testing backend dependencies...
cd backend
call npm list --depth=0
if %errorlevel% neq 0 (
    echo WARNING: Some backend dependencies may be missing
)
cd ..

echo.
echo Testing AI service dependencies...
cd ai
call pip list
if %errorlevel% neq 0 (
    echo WARNING: Some AI service dependencies may be missing
)
cd ..

echo.
echo Testing TypeScript compilation...
cd frontend
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo WARNING: TypeScript compilation has errors
)
cd ..

echo.
echo Testing backend TypeScript compilation...
cd backend
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo WARNING: Backend TypeScript compilation has errors
)
cd ..

echo.
echo ========================================
echo Test completed!
echo ========================================
echo.
echo If you see any warnings or errors above, please:
echo 1. Run install.bat again
echo 2. Check that all dependencies are installed
echo 3. Verify your environment configuration
echo.
pause 