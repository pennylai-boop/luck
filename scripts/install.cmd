@echo off
set "ROOT=%~dp0.."
pushd "%ROOT%" || (
  echo 無法進入專案目錄: %ROOT%
  exit /b 1
)
call npm install
set EXITCODE=%ERRORLEVEL%
popd
exit /b %EXITCODE%
