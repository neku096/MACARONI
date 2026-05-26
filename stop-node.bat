@echo off
chcp 65001 >nul
setlocal

echo Checking Node.js processes listening on ports 3000-3999.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "foreach ($line in netstat -ano) { if ($line -match '^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$') { $port = [int]$matches[1]; $pidValue = [int]$matches[2]; if ($port -ge 3000 -and $port -le 3999) { $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue; if ($process -and $process.ProcessName -eq 'node') { Write-Host ('Port ' + $port + '  PID ' + $pidValue + '  ' + $process.Path) } } } }"

echo.
set /p CONFIRM=Stop the listed Node.js processes? [y/N]: 
if /I not "%CONFIRM%"=="Y" (
  echo Canceled. No process was stopped.
  pause
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$targets = @{}; foreach ($line in netstat -ano) { if ($line -match '^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$') { $port = [int]$matches[1]; $pidValue = [int]$matches[2]; if ($port -ge 3000 -and $port -le 3999) { $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue; if ($process -and $process.ProcessName -eq 'node') { $targets[[string]$pidValue] = $true } } } }; if ($targets.Count -eq 0) { Write-Host 'No Node.js process to stop.'; exit 0 }; foreach ($id in $targets.Keys) { Stop-Process -Id ([int]$id) -Force; Write-Host ('Stopped PID ' + $id) }"
if errorlevel 1 goto stop_error

pause
exit /b 0

:stop_error
echo Failed to stop Node.js processes.
pause
exit /b 1
