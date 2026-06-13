# Jekyll 博客部署脚本
# 用法: .\deploy.ps1 [commit message]

param(
    [string]$Message = "Site updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Jekyll Blog Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. 构建站点
Write-Host "`n[1/4] Building site..." -ForegroundColor Yellow
bundle exec jekyll build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed." -ForegroundColor Green

# 2. 进入 _site 目录
Write-Host "`n[2/4] Entering _site directory..." -ForegroundColor Yellow
if (-not (Test-Path "_site")) {
    Write-Host "_site directory not found!" -ForegroundColor Red
    exit 1
}
Push-Location _site

# 3. 初始化 Git 仓库
Write-Host "`n[3/4] Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "Git repository initialized." -ForegroundColor Green
} else {
    Write-Host "Git repository already exists." -ForegroundColor Green
}

# 设置 remote
$remoteUrl = "https://github.com/ZeroYi0211/zeroyi0211.github.io.git"
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    git remote add origin $remoteUrl
    Write-Host "Remote added: $remoteUrl" -ForegroundColor Green
}

# 4. 添加 .nojekyll 文件（告诉 GitHub Pages 不要重新构建）
Write-Host "`n[4/4] Preparing for deployment..." -ForegroundColor Yellow
New-Item -Path ".nojekyll" -ItemType File -Force | Out-Null
Write-Host "Added .nojekyll file." -ForegroundColor Green

# 5. 提交并推送
Write-Host "`n[5/5] Deploying to GitHub Pages..." -ForegroundColor Yellow
git add -A
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
    Pop-Location
    exit 0
}

git push -f origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Visit: https://zeroyi0211.github.io" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
