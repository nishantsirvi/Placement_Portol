@echo off
echo ============================================================
echo    PLACEMENT TRACKING SYSTEM - FULL STACK STARTUP
echo ============================================================
echo.
echo Starting both Frontend and Backend servers...
echo.

REM Start Backend in new window
echo [1/2] Starting Backend Server (Django)...
start "Backend Server - Django" cmd /k "cd backend && echo Backend starting... && python manage.py runserver"
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo [2/2] Starting Frontend Server (React)...
start "Frontend Server - React" cmd /k "cd frontend && echo Frontend starting... && npm start"

echo.
echo ============================================================
echo Both servers are starting in separate windows!
echo ============================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo LOGIN CREDENTIALS:
echo   Admin:    admin / admin123
echo   Student:  john.doe / student123
echo   Company:  company.rep / company123
echo.
echo The browser will open automatically when React starts.
echo Click the demo buttons for quick login!
echo.
echo To stop servers: Close both command prompt windows
echo ============================================================
echo.
pause
