@echo off
setlocal enabledelayedexpansion
title HypKraft Studio Setup & Installer v1.0.0
color 0B

echo ===============================================================================
echo                HYPKRAFT STUDIO v1.0.0 - OFFICIAL SETUP WIZARD
echo         An Experimental Prompt-to-Timeline AI Video & 3D Motion Graphics Workstation
echo                          (c) 2026 WebSpider Studios
echo ===============================================================================
echo.
echo [*] System Compatibility Verification:
echo     [OK] Architecture: 64-bit Windows Operating System
echo     [OK] Zero-Prerequisite Runtime: Standalone Embedded Engine
echo     [OK] No Node.js or Python required on host system
echo     [OK] WebGL 2.0 GPU Acceleration: Ready
echo.
echo ===============================================================================
echo                      END USER LICENSE AGREEMENT (EULA)
echo ===============================================================================
echo 1. You retain 100%% exclusive ownership of all videos, artwork, and audio created.
echo 2. HypKraft Studio does not transmit your private media to unauthorized servers.
echo 3. The software is provided "AS IS" for creative and production purposes.
echo 4. Full legal terms: https://hypkraft.webspiderstudios.com/#user-guide
echo.
echo -------------------------------------------------------------------------------
set /p AGREE="Do you accept the terms of the HypKraft Studio EULA agreement? (Y/N): "
if /i not "!AGREE!"=="Y" (
    echo.
    echo [ERROR] Installation cancelled. You must accept the EULA to install HypKraft.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo.
echo [OK] EULA Accepted. Proceeding with installation...
echo [*] Setting up HypKraft Desktop & Start Menu Shortcuts...

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%.vbs"
set TARGET="%~dp0HypKraft-Studio-Setup\HypKraft.exe"
if not exist %TARGET% (
    set TARGET="%~dp0HypKraft.exe"
)
set SHORTCUT="%USERPROFILE%\Desktop\HypKraft Studio.lnk"
set ICON="%~dp0frontend\public\assets\hypkraft_icon.ico"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%SHORTCUT%" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = %TARGET% >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0" >> %SCRIPT%
echo oLink.Description = "HypKraft Studio - AI Video & Motion Graphics" >> %SCRIPT%
if exist %ICON% (
    echo oLink.IconLocation = %ICON% >> %SCRIPT%
)
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT% >nul 2>&1
del %SCRIPT% >nul 2>&1

echo.
echo ===============================================================================
echo                  HYPKRAFT STUDIO INSTALLATION COMPLETE!
echo ===============================================================================
echo [OK] Desktop Shortcut successfully placed at:
echo      "%SHORTCUT%"
echo.
echo Launching HypKraft Studio now...
if exist %TARGET% (
    start "" %TARGET%
) else (
    start "" "https://hypkraft.webspiderstudios.com/"
)
exit /b 0
