# SwMaster Build Validation Script (Windows)

Write-Host "🚀 Starting SwMaster Build Validation..." -ForegroundColor Cyan

# 1. Backend Build
Write-Host "`n📦 Building Backend..." -ForegroundColor Yellow
docker build -t swmaster-backend-test ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend Build Failed!" -ForegroundColor Red
    exit 1
}

# 2. Frontend Build
Write-Host "`n📦 Building Frontend..." -ForegroundColor Yellow
docker build -t swmaster-frontend-test ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend Build Failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ All builds passed successfully!" -ForegroundColor Green
