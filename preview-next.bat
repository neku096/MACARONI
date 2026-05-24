@echo off
setlocal EnableExtensions EnableDelayedExpansion

if /I "%~1"=="--serve" goto serve

cd /d "%~dp0"

set "BASE_PORT=3100"
set "MAX_PORT=3199"
set "LOCK_ROOT=%TEMP%\macaroni-next-preview-locks"

if not exist "package.json" (
  echo [ERROR] package.json was not found.
  echo Run this file from the project root.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  where npm >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo Install Node.js/npm, then run this file again.
    pause
    exit /b 1
  )
)

if not exist "node_modules\" (
  echo node_modules was not found.
  echo Run npm install before starting the preview.
  echo.
  set /p INSTALL_NOW="Run npm install now? [y/N]: "
  if /I "!INSTALL_NOW!"=="Y" (
    call npm install
    if errorlevel 1 (
      echo.
      echo [ERROR] npm install failed.
      pause
      exit /b 1
    )
  ) else (
    echo.
    echo Preview was not started.
    pause
    exit /b 1
  )
)

if not exist "%LOCK_ROOT%" mkdir "%LOCK_ROOT%" >nul 2>nul

set "PORT="
set "LOCK_DIR="
for /f %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "$start=%BASE_PORT%; $end=%MAX_PORT%; $lockRoot=$env:LOCK_ROOT; New-Item -ItemType Directory -Path $lockRoot -Force | Out-Null; for ($p=$start; $p -le $end; $p++) { $lock=Join-Path $lockRoot ('port-' + $p + '.lock'); if (Test-Path $lock) { continue }; $listener=$null; try { $listener=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $p); $listener.Start(); $listener.Stop(); $listener=$null; New-Item -ItemType Directory -Path $lock -ErrorAction Stop | Out-Null; Write-Output $p; exit 0 } catch { if ($listener) { $listener.Stop() } } }; exit 1"') do (
  set "PORT=%%P"
)

if not defined PORT (
  echo [ERROR] No free port was found from %BASE_PORT% to %MAX_PORT%.
  pause
  exit /b 1
)

set "LOCK_DIR=%LOCK_ROOT%\port-%PORT%.lock"

echo Starting Next.js dev server on port %PORT%...
start "Macaroni Next dev :%PORT%" cmd /k call "%~f0" --serve %PORT% "%LOCK_DIR%"

echo Waiting for http://localhost:%PORT% ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$port=%PORT%; $baseUrl='http://localhost:' + $port; $productsUrl=$baseUrl + '/products'; $ready=$false; for ($i=0; $i -lt 60; $i++) { try { $response=Invoke-WebRequest -Uri $baseUrl -UseBasicParsing -TimeoutSec 1; if ($response.StatusCode -lt 500) { $ready=$true; break } } catch { Start-Sleep -Milliseconds 500 } }; Start-Process $baseUrl; Start-Process $productsUrl; if (-not $ready) { exit 2 }"
if errorlevel 2 (
  if defined LOCK_DIR (
    rmdir "%LOCK_DIR%" >nul 2>nul
  )
  echo.
  echo The browser was opened, but the dev server did not respond yet.
  echo Check the "Macaroni Next dev :%PORT%" window for details.
  pause
)

exit /b 0

:serve
set "PORT=%~2"
set "LOCK_DIR=%~3"

cd /d "%~dp0"
echo Next.js dev server
echo URL: http://localhost:%PORT%
echo Products: http://localhost:%PORT%/products
echo.

call npm run dev -- -p %PORT%
set "EXIT_CODE=%ERRORLEVEL%"

if defined LOCK_DIR (
  rmdir "%LOCK_DIR%" >nul 2>nul
)

echo.
echo Dev server stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%
