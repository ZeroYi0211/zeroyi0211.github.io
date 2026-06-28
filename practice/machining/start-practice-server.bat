@echo off
setlocal
cd /d "%~dp0"

set "HTML=site\index.html"

if not exist "%HTML%" (
  echo Cannot find "%CD%\%HTML%".
  echo.
  pause
  exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
  echo Cannot find python in PATH.
  echo Please install Python or add it to PATH.
  echo.
  pause
  exit /b 1
)

set "PORT="
for /L %%P in (8765,1,8799) do (
  powershell -NoProfile -Command "try { $l=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,%%P); $l.Start(); $l.Stop(); exit 0 } catch { exit 1 }" >nul 2>nul
  if not errorlevel 1 (
    set "PORT=%%P"
    goto :found_port
  )
)

echo Ports 8765-8799 are all busy.
echo.
pause
exit /b 1

:found_port
set "URL=http://127.0.0.1:%PORT%/site/index.html"
echo.
echo Question practice server started.
echo URL: %URL%
echo.
echo Keep this window open. Closing it stops the server.
echo.

start "" "%URL%"
python -m http.server %PORT% --bind 127.0.0.1
pause
