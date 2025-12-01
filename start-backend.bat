@echo off
echo ============================================================
echo    PLACEMENT TRACKING SYSTEM - Backend Server
echo ============================================================
echo.

cd backend

echo [1/3] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)
echo.

echo [2/3] Installing/Updating dependencies...
pip install -r requirements.txt --quiet
echo Dependencies installed successfully!
echo.

echo [3/3] Starting Django development server...
echo.
echo Server will be available at: http://localhost:8000
echo Admin panel: http://localhost:8000/admin
echo API Root: http://localhost:8000/api/
echo.
echo Demo Credentials:
echo   Admin    - Username: admin       Password: admin123
echo   Student  - Username: john.doe    Password: student123
echo   Company  - Username: company.rep Password: company123
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.

python manage.py runserver

pause
