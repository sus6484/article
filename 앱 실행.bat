@echo off
chcp 65001 >nul
title 홀덤 기사 생성기

cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================
echo   홀덤 기사 ^& 쇼츠 제목 생성기
echo ========================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo https://nodejs.org 에서 Node.js LTS를 설치한 뒤 다시 실행해 주세요.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo 의존성 설치 중... ^(최초 1회, 1~2분 소요^)
    call npm install --strict-ssl=false
    if errorlevel 1 (
        echo [오류] npm install 실패
        pause
        exit /b 1
    )
    echo.
)

if not exist ".env.local" (
    echo [경고] .env.local 파일이 없습니다.
    echo Google Gemini API 키를 설정해야 기사 작성이 됩니다.
    echo .env.local.example 파일을 참고해 .env.local 을 만들어 주세요.
    echo.
)

echo 서버 시작 중...
echo 브라우저가 자동으로 열립니다: http://localhost:3000
echo.
echo 종료하려면 이 창에서 Ctrl+C 를 누르거나 창을 닫으세요.
echo ========================================
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

call npm run dev

pause
