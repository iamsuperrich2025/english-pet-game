@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Vocab World - Commit and Deploy
cd /d "%~dp0"

echo.
echo  ======================================================
echo          VOCAB WORLD - COMMIT + DEPLOY
echo  ======================================================
echo.

set "GIT_EXE="
set "BASH_EXE="

if exist "C:\Program Files\Git\cmd\git.exe" set "GIT_EXE=C:\Program Files\Git\cmd\git.exe"
if exist "C:\Program Files\Git\bin\bash.exe" set "BASH_EXE=C:\Program Files\Git\bin\bash.exe"

if not defined GIT_EXE if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
if not defined BASH_EXE if exist "%LOCALAPPDATA%\Programs\Git\bin\bash.exe" set "BASH_EXE=%LOCALAPPDATA%\Programs\Git\bin\bash.exe"

if not defined GIT_EXE goto :missing_git
if not defined BASH_EXE goto :missing_git

rem Prevent "detected dubious ownership" in Codex-created folders.
"%GIT_EXE%" config --global --add safe.directory "%CD%" >nul 2>&1

echo  This program will:
echo    1. Show files waiting to be shipped
echo    2. Ask for confirmation
echo    3. Update version and cache
echo    4. Commit, deploy Firebase, and push GitHub
echo.

"%BASH_EXE%" tools/ship_entry.sh %*
set "SHIP_EXIT=%ERRORLEVEL%"

echo.
echo  ------------------------------------------------------
if "%SHIP_EXIT%"=="0" goto :success
if "%SHIP_EXIT%"=="10" goto :no_action

echo  [FAILED] The program stopped before every step completed.
echo  Send Codex a screenshot of the last error shown above.
echo  ------------------------------------------------------
echo.
pause
exit /b %SHIP_EXIT%

:no_action
echo  [NO ACTION] Nothing was committed or deployed.
echo  ------------------------------------------------------
echo.
pause
exit /b 0

:success
echo  [SUCCESS] Commit / Deploy / Push completed.
echo  Website: https://vocabworld.web.app
echo  ------------------------------------------------------
echo.
pause
exit /b 0

:missing_git
echo  [FAILED] Git for Windows was not found.
echo  Install it from https://git-scm.com/download/win and try again.
echo.
pause
exit /b 2
