@echo off
rem Keep the old entry point working by forwarding to the new launcher.
call "%~dp0COMMIT_DEPLOY.bat" %*
exit /b %ERRORLEVEL%
