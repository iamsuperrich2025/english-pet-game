@echo off
chcp 65001 >nul
title ship - ส่งงานขึ้นเว็บ Vocab World
cd /d "%~dp0"
echo.
echo  ========================================
echo   Vocab World - ส่งงานขึ้นเว็บจริง
echo  ========================================
echo.
"C:\Program Files\Git\bin\bash.exe" tools/ship.sh %*
echo.
echo  ---------------------------------------
echo   เสร็จแล้ว กด Enter เพื่อปิดหน้าต่างนี้
pause >nul
