#!/bin/bash

echo "🚀 開始安裝 MySQL 和後端服務..."

# 安裝 MySQL
echo "📦 安裝 MySQL..."
sudo apt-get update
sudo apt-get install -y mysql-server

# 啟動 MySQL 服務
echo "▶️  啟動 MySQL 服務..."
sudo service mysql start

# 創建數據庫
echo "🗄️  創建數據庫..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS admin_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON admin_db.* TO 'admin'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 安裝後端依賴
echo "📦 安裝後端依賴..."
cd /workspaces/admin-backend/server
npm install

echo "✅ 安裝完成！"
echo ""
echo "🔧 接下來的步驟："
echo "1. 編輯 server/.env 文件，設置數據庫密碼"
echo "2. 運行: cd server && npm run dev"
echo "3. 前端會自動連接到後端 API"
