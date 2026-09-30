@echo off
title Rotaract Club of NIBM Kandy - Digital Portal
color 0B
cls

echo ===================================================================
echo     ROTARACT CLUB OF NIBM KANDY - DIGITAL PORTAL
echo     Rotary International District 3220
echo ===================================================================
echo.

:: Ensure working directory is this script's directory
cd /d "%~dp0"

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js from https://nodejs.org and run this again.
    echo.
    pause
    exit /b 1
)

:: 2. Check Dependencies
if not exist "node_modules\" (
    echo [SETUP] Installing required dependencies (first-time only)...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

:: 3. Check Production Build
if not exist "build\" (
    echo [BUILD] Creating optimized production build...
    call npm run build
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

:: 4. Free port 5000 if previously occupied
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5000 "') do (
    taskkill /f /pid %%a >nul 2>&1
)

:: 5. Launch Option Selection (Auto-defaults to Fast Mode in 3s)
echo Select Launch Mode:
echo   [1] Fast Mode (Instant startup, serves full app on http://localhost:5000) [Default]
echo   [2] Dev Mode  (Hot-reloading frontend on http://localhost:3000 + API on :5000)
echo.
choice /c 12 /t 3 /d 1 /m "Auto-starting Fast Mode in 3 seconds (or press 1 or 2):"
set LAUNCH_MODE=%errorlevel%

echo.
if "%LAUNCH_MODE%"=="2" (
    echo [STARTING] Launching in Development Mode...
    echo Starting backend API on http://localhost:5000...
    start "Rotaract Backend API (5000)" /min cmd /c "node server.js"
    timeout /t 2 /nobreak >nul
    echo Starting React development server on http://localhost:3000...
    call npm start
) else (
    echo [STARTING] Launching Rotaract NIBM Portal on http://localhost:5000...
    start "" "http://localhost:5000"
    echo.
    echo ===================================================================
    echo   WEBSITE IS NOW LIVE AT: http://localhost:5000
    echo   Press Ctrl+C or close this window to stop the server.
    echo ===================================================================
    echo.
    node server.js
)
