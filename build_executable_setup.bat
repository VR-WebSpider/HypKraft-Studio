@echo off
title HypKraft Studio Executable Setup Builder
echo ===================================================================
echo             Building HypKraft Windows Executable Setup
echo ===================================================================
echo.
echo [1/3] Building Optimized Frontend Production Bundle...
cd frontend
call npm run build

echo.
echo [2/3] Packaging Executable Setup with Electron-Builder...
call npx electron-builder --win nsis portable

echo.
echo [3/3] Build Finished!
echo ===================================================================
echo The standalone executable setup is located in:
echo   frontend\dist_electron\
echo ===================================================================
pause
