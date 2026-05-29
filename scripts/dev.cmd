@echo off
REM UNC 網路路徑無法直接當 CMD 工作目錄；pushd 會暫時對應成磁碟代號
set "ROOT=%~dp0.."
pushd "%ROOT%" || (
  echo 無法進入專案目錄: %ROOT%
  exit /b 1
)

if not exist "node_modules\next\dist\bin\next" (
  echo 尚未安裝依賴，正在執行 npm install...
  call npm install
  if errorlevel 1 exit /b 1
)

echo.
echo 啟動開發伺服器: http://localhost:3000
echo 按 Ctrl+C 結束
echo.
call npm run dev
set EXITCODE=%ERRORLEVEL%
popd
exit /b %EXITCODE%
