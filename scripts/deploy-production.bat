@echo off
REM SoloSuccess AI - Production Deployment Script for Windows
REM This script helps you deploy your app to production

echo 🚀 SoloSuccess AI - Production Deployment Script
echo ================================================

:menu
echo.
echo What would you like to do?
echo 1) Check dependencies and environment
echo 2) Build application
echo 3) Test build locally
echo 4) Deploy to Vercel
echo 5) Full deployment (all steps)
echo 6) Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto check_deps
if "%choice%"=="2" goto build_app
if "%choice%"=="3" goto test_build
if "%choice%"=="4" goto deploy_vercel
if "%choice%"=="5" goto full_deploy
if "%choice%"=="6" goto exit
echo ❌ Invalid choice. Please try again.
goto menu

:check_deps
echo 📋 Checking dependencies...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    goto menu
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    goto menu
)

echo ✅ Node.js and npm are installed

echo 📋 Checking environment variables...
if not exist ".env.local" (
    echo ⚠️  .env.local file not found. Creating from template...
    if exist ".env.production.example" (
        copy ".env.production.example" ".env.local" >nul
        echo ✅ Created .env.local from template
        echo ⚠️  Please edit .env.local with your actual production values before continuing
        pause
    ) else (
        echo ❌ .env.production.example not found. Please create .env.local manually.
        pause
        goto menu
    )
)

echo ✅ Environment file found
pause
goto menu

:build_app
echo 🔨 Building application...

echo 📦 Installing dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    goto menu
)

echo 🔍 Running type check...
call npm run typecheck
if %errorlevel% neq 0 (
    echo ❌ Type check failed
    pause
    goto menu
)

echo 🧹 Running linting...
call npm run lint
if %errorlevel% neq 0 (
    echo ❌ Linting failed
    pause
    goto menu
)

echo 🏗️  Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    goto menu
)

echo ✅ Build successful!
pause
goto menu

:test_build
echo 🧪 Testing production build locally...
echo Starting production server on port 3000...
echo Open http://localhost:3000 to test your app
echo Press Ctrl+C to stop the server when you're done testing
echo.
call npm start
pause
goto menu

:deploy_vercel
echo 🚀 Deploying to Vercel...

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
)

echo 🔐 Logging into Vercel...
call vercel login

echo 🚀 Deploying to production...
call vercel --prod

echo ✅ Deployment complete!
echo 📋 Don't forget to:
echo    1. Set environment variables in Vercel dashboard
echo    2. Configure your custom domain
echo    3. Test all features on the live site
pause
goto menu

:full_deploy
call :check_deps
call :build_app
echo.
set /p test_choice="Test the build locally? (y/n): "
if /i "%test_choice%"=="y" call :test_build
echo.
set /p deploy_choice="Deploy to Vercel now? (y/n): "
if /i "%deploy_choice%"=="y" call :deploy_vercel
goto menu

:exit
echo 👋 Goodbye!
exit /b 0
