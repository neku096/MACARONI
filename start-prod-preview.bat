@echo off
chcp 65001 >nul
setlocal

cd /d D:\Codex\MACARONI
if errorlevel 1 goto cd_error

if not exist package.json goto missing_project
if not exist node_modules (
  echo node_modules is missing. Run npm install first.
  pause
  exit /b 1
)

set MACARONI_ADMIN_ENABLED=

echo Building for production preview.
echo.
call npm run build
if errorlevel 1 goto build_error

echo.
echo Starting production preview.
echo Site:  http://localhost:3000
echo Admin: disabled in production preview.
echo.
call npm run start
if errorlevel 1 goto start_error

exit /b 0

:cd_error
echo Failed to cd into D:\Codex\MACARONI.
pause
exit /b 1

:missing_project
echo package.json was not found. Check D:\Codex\MACARONI.
pause
exit /b 1

:build_error
echo npm run build failed.
pause
exit /b 1

:start_error
echo npm run start failed.
pause
exit /b 1
