@echo off
title HypKraft Studio - Setup ^& Installer
echo ===================================================================
echo               HypKraft Studio - Windows Setup ^& Installer
echo ===================================================================
echo.
echo Installing HypKraft Desktop Shortcut...

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"
set TARGET="%~dp0HypKraft-Studio-Setup\HypKraft.exe"
set SHORTCUT="%USERPROFILE%\Desktop\HypKraft Studio.lnk"
set ICON="%~dp0frontend\public\assets\hypkraft_icon.ico"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%SHORTCUT%" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = %TARGET% >> %SCRIPT%
echo oLink.WorkingDirectory = "%~dp0HypKraft-Studio-Setup" >> %SCRIPT%
echo oLink.Description = "HypKraft AI Video & Motion Graphics Studio" >> %SCRIPT%
echo oLink.IconLocation = %ICON% >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

echo.
echo [OK] Desktop Shortcut Created at: "%SHORTCUT%"
echo [OK] HypKraft Standalone Executable: "%TARGET%"
echo.
echo ===================================================================
echo Setup Finished! Starting HypKraft AI Studio...
echo ===================================================================
echo.
start "" "%TARGET%"
