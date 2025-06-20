@echo off
cd /d C:\Users\pauwiks\Desktop\soltv

echo 🔄 Updating Sol.tv...
git add .

set /p commitMsg=Enter commit message (or press Enter for default): 
if "%commitMsg%"=="" set commitMsg=✅ Sol.tv update

git commit -m "%commitMsg%"
git push origin main

echo ✅ Update pushed! Check https://vercel.com/dashboard or https://soltv.vercel.app
pause
