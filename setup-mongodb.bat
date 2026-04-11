@echo off
REM MongoDB Atlas Setup Script for Windows

echo ================================
echo 130 MongoDB Atlas Setup Helper
echo ================================
echo.

echo 130 Generating secure JWT secret...
FOR /F "tokens=*" %%i IN ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') DO SET JWT_SECRET=%%i

echo 156 JWT_SECRET: %JWT_SECRET%
echo.

echo 1571️⃣ Create MongoDB Atlas Account:
echo    → Visit: https://www.mongodb.com/cloud/atlas/register
echo    → Sign up and create a free cluster
echo.

echo 2️⃣ Get Your Connection String:
echo    → Go to: Databases → Connect
echo    → Copy the Node.js connection string
echo    → Format: mongodb+srv://username:password@cluster.mongodb.net/database
echo.

echo 3️⃣ Update .env file:
echo    → Copy JWT_SECRET value above into your .env file
echo    → Paste your MongoDB Atlas connection string
echo.

echo 4️⃣ Test Connection:
echo    → Run: node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Error:', err.message));"
echo.

echo 5️⃣ Start Server:
echo    → Run: npm run dev
echo.

echo ================================
echo Security Reminder:
echo - Never commit .env to GitHub
echo - Use strong passwords
echo - Keep secrets private
echo - Rotate secrets quarterly
echo ================================
pause
