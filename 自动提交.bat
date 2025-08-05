@echo off
REM 提交并推送 metamask-wallet-app 项目代码到 GitHub（稳健版）

cd /d D:\project\metamask-wallet-app

echo.
echo ===========================================
echo 开始提交代码到 GitHub...
echo 当前路径: %cd%
echo ===========================================
echo.

REM 确保是 Git 仓库
IF NOT EXIST ".git" (
    echo ❌ 当前目录不是 Git 仓库！
    pause
    exit /b 1
)

REM 检查是否是 unborn branch（尚未创建分支）
git symbolic-ref HEAD >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ⚠️ 当前处于未创建分支状态，初始化 main 分支...
    git checkout -b main
    git remote add origin https://github.com/syongjie/metamask-wallet-app.git
)

REM 添加所有更改
git add -A

REM 获取当前时间作为提交信息
for /f "tokens=1-3 delims=/- " %%a in ("%date%") do (
    set datestr=%%a-%%b-%%c
)
set timestr=%time:~0,2%-%time:~3,2%-%time:~6,2%
set commit_msg=auto-commit on %datestr% %timestr%

REM 检查是否有改动需要提交
git diff --cached --quiet
IF %ERRORLEVEL% EQU 0 (
    echo ✅ 没有改动需要提交。
) ELSE (
    git commit -m "%commit_msg%"
    echo ✅ 已提交更改: %commit_msg%
)

REM 拉取远程代码（如果已有远程分支）
git rev-parse --verify origin/main >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    git pull origin main --rebase
    IF %ERRORLEVEL% NEQ 0 (
        echo ❌ 拉取失败，请解决冲突！
        pause
        exit /b 1
    )
)

REM 推送代码到远程
git push -u origin master
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ 推送失败！
    pause
    exit /b 1
)

echo.
echo 🎉 代码已成功提交并推送到 GitHub！
pause
