@echo off
title NutriContext - Starting All Services
color 0A

echo.
echo ========================================
echo   NutriContext - Starting All Services
echo ========================================
echo.

REM Check if backend and frontend folders exist
if not exist "backend" (
    color 0C
    echo [ERROR] Backend folder not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "frontend" (
    color 0C
    echo [ERROR] Frontend folder not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server...
start "NutriContext Backend" cmd /k "cd backend && color 0B && title NutriContext Backend && npm run dev"

echo [2/2] Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "NutriContext Frontend" cmd /k "cd frontend && color 0E && title NutriContext Frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Wait 10-15 seconds for servers to start,
echo then open http://localhost:3000 in your browser
echo.
echo Press any key to exit (servers will keep running)...
pause > nul