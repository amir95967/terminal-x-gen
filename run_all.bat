@echo off
echo 🚀 Starting TerminalX Gen System...

:: הפעלת הבוט בחלון חדש
start cmd /k "node app.js"
echo ✅ Backend is starting...

:: המתנה של 2 שניות כדי לוודא שהשרת עלה
timeout /t 2 /nobreak > nul

:: הפעלת ngrok בחלון חדש
start cmd /k "ngrok.exe http 3001"
echo ✅ ngrok tunnel is starting...

echo.
echo --------------------------------------------------
echo ⭐ System is LIVE!
echo 🔗 URL: https://humped-defection-smugness.ngrok-free.dev
echo --------------------------------------------------
pause