#!/bin/bash
# SwMaster Build Validation Script (Linux/macOS)

echo -e "\033[0;36m🚀 Starting SwMaster Build Validation...\033[0m"

# 1. Backend Build
echo -e "\n\033[0;33m📦 Building Backend...\033[0m"
docker build -t swmaster-backend-test ./backend
if [ $? -ne 0 ]; then
    echo -e "\033[0;31m❌ Backend Build Failed!\033[0m"
    exit 1
fi

# 2. Frontend Build
echo -e "\n\033[0;33m📦 Building Frontend...\033[0m"
docker build -t swmaster-frontend-test ./frontend
if [ $? -ne 0 ]; then
    echo -e "\033[0;31m❌ Frontend Build Failed!\033[0m"
    exit 1
fi

echo -e "\n\033[0;32m✅ All builds passed successfully!\033[0m"
