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

set MACARONI_ADMIN_ENABLED=1

echo Starting MACARONI local dev server.
echo Admin: http://localhost:3000/admin
echo.

call npm run dev
if errorlevel 1 goto run_error

exit /b 0

:cd_error
echo Failed to cd into D:\Codex\MACARONI.
pause
exit /b 1

:missing_project
echo package.json was not found. Check D:\Codex\MACARONI.
pause
exit /b 1

:run_error
echo npm run dev failed.
pause
exit /b 1
