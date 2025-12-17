Index: CPANEL_DEPLOYMENT_GUIDE.md
===================================================================
--- CPANEL_DEPLOYMENT_GUIDE.md	non-existent
+++ CPANEL_DEPLOYMENT_GUIDE.md	new file
@@ -0,0 +1,423 @@
+# SDG Hub - cPanel Deployment Guide
+
+Complete step-by-step guide for deploying SDG Hub to cPanel shared hosting.
+
+---
+
+## **📋 PREREQUISITES**
+
+Before deploying, ensure you have:
+
+- ✅ cPanel hosting account with Node.js support
+- ✅ MySQL database access
+- ✅ SSH access (optional but recommended)
+- ✅ Domain name configured
+- ✅ SSL certificate installed (recommended)
+- ✅ Node.js 18.x or higher available in cPanel
+
+---
+
+## **🚀 DEPLOYMENT STEPS**
+
+### **STEP 1: Upload Files to cPanel**
+
+#### **Option A: Using File Manager (Recommended for beginners)**
+
+1. **Login to cPanel**
+   - Go to `https://yourdomain.com/cpanel`
+   - Enter your cPanel username and password
+
+2. **Navigate to File Manager**
+   - Click "File Manager" in cPanel
+   - Navigate to `public_html` or your application directory
+
+3. **Upload Files**
+   - Click "Upload" button
+   - Upload your project as a ZIP file
+   - Extract the ZIP file in cPanel File Manager
+
+#### **Option B: Using FTP (Recommended for large files)**
+
+1. **Connect via FTP**
+   - Use FileZilla or any FTP client
+   - Host: `ftp.yourdomain.com`
+   - Username: Your cPanel username
+   - Password: Your cPanel password
+   - Port: 21
+
+2. **Upload Files**
+   - Navigate to `public_html` or your app directory
+   - Upload all project files
+
+#### **Option C: Using Git (Recommended for developers)**
+
+1. **SSH into cPanel**
+   ```bash
+   ssh username@yourdomain.com
+   ```
+
+2. **Navigate to directory**
+   ```bash
+   cd public_html
+   ```
+
+3. **Clone repository**
+   ```bash
+   git clone https://github.com/yourusername/sdg-hub.git
+   cd sdg-hub
+   ```
+
+---
+
+### **STEP 2: Setup MySQL Database**
+
+1. **Create Database in cPanel**
+   - Go to cPanel → MySQL Databases
+   - Create new database: `username_sdghub`
+   - Create new user: `username_sdguser`
+   - Set strong password
+   - Add user to database with ALL PRIVILEGES
+
+2. **Note Database Credentials**
+   ```
+   Database Name: username_sdghub
+   Database User: username_sdguser
+   Database Password: [your password]
+   Database Host: localhost
+   ```
+
+---
+
+### **STEP 3: Configure Environment Variables**
+
+1. **Create .env file**
+   - Copy `.env.production` to `.env`
+   - Update with your actual values:
+
+   ```bash
+   # Database Configuration
+   DATABASE_URL=mysql://username_sdguser:password@localhost:3306/username_sdghub
+   DB_HOST=localhost
+   DB_PORT=3306
+   DB_USER=username_sdguser
+   DB_PASSWORD=your_password
+   DB_NAME=username_sdghub
+
+   # Application Configuration
+   NODE_ENV=production
+   PORT=3000
+   APP_URL=https://yourdomain.com
+   API_URL=https://yourdomain.com/api
+
+   # Security (CHANGE THESE!)
+   JWT_SECRET=your-super-secret-jwt-key-change-this
+   SESSION_SECRET=your-session-secret-change-this
+
+   # Email Configuration (use cPanel email)
+   SMTP_HOST=mail.yourdomain.com
+   SMTP_PORT=587
+   SMTP_USER=noreply@yourdomain.com
+   SMTP_PASSWORD=your_email_password
+   SMTP_FROM=noreply@yourdomain.com
+   ```
+
+2. **Set File Permissions**
+   ```bash
+   chmod 600 .env
+   ```
+
+---
+
+### **STEP 4: Setup Node.js Application in cPanel**
+
+1. **Navigate to Node.js Selector**
+   - Go to cPanel → Software → Setup Node.js App
+
+2. **Create Application**
+   - Click "Create Application"
+   - **Node.js Version**: Select 18.x or higher
+   - **Application Mode**: Production
+   - **Application Root**: `/home/username/public_html/sdg-hub` (or your path)
+   - **Application URL**: Your domain or subdomain
+   - **Application Startup File**: `server.js`
+   - **Passenger Log File**: Leave default
+
+3. **Click "Create"**
+
+---
+
+### **STEP 5: Install Dependencies**
+
+1. **Open Terminal in cPanel**
+   - Go to cPanel → Advanced → Terminal
+   - Or use SSH
+
+2. **Navigate to Application Directory**
+   ```bash
+   cd public_html/sdg-hub
+   ```
+
+3. **Install Node Modules**
+   ```bash
+   npm install --production
+   ```
+
+   This will install all dependencies from `package.json`.
+
+4. **Wait for Installation**
+   - This may take 5-10 minutes
+   - Watch for any errors
+
+---
+
+### **STEP 6: Build Application**
+
+1. **Build Frontend**
+   ```bash
+   npm run build
+   ```
+
+   This creates the `dist/` directory with compiled files.
+
+2. **Verify Build**
+   ```bash
+   ls -la dist/
+   ```
+
+   You should see `index.html` and other files.
+
+---
+
+### **STEP 7: Run Database Migrations**
+
+1. **Generate Migration Files**
+   ```bash
+   npm run db:generate
+   ```
+
+2. **Apply Migrations**
+   ```bash
+   npm run db:migrate
+   ```
+
+3. **Verify Tables Created**
+   - Go to cPanel → phpMyAdmin
+   - Select your database
+   - You should see 34 tables
+
+---
+
+### **STEP 8: Seed Database with Initial Data**
+
+1. **Run Seed Scripts**
+   ```bash
+   npm run db:seed
+   ```
+
+2. **Verify Data**
+   - Go to phpMyAdmin
+   - Check tables like `ministries`, `sdg_goals`, `stakeholders`
+   - You should see initial data
+
+---
+
+### **STEP 9: Start Application**
+
+1. **Restart Node.js Application**
+   - Go to cPanel → Setup Node.js App
+   - Click "Restart" button next to your application
+
+2. **Check Application Status**
+   - Status should show "Running"
+   - Note the port number (usually 3000)
+
+---
+
+### **STEP 10: Configure .htaccess**
+
+The `.htaccess` file is already created. Verify it exists in your application root:
+
+```apache
+# Redirect all requests to Node.js server
+RewriteCond %{REQUEST_FILENAME} !-f
+RewriteCond %{REQUEST_FILENAME} !-d
+RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
+```
+
+**Important:** Update port `3000` if cPanel assigned a different port.
+
+---
+
+### **STEP 11: Test Application**
+
+1. **Visit Your Domain**
+   - Go to `https://yourdomain.com`
+   - You should see the SDG Hub homepage
+
+2. **Test API Endpoints**
+   - Visit `https://yourdomain.com/api/health`
+   - Should return JSON: `{"status":"ok"}`
+
+3. **Test Features**
+   - ✅ Homepage loads
+   - ✅ Dashboard displays data
+   - ✅ Login/Signup works
+   - ✅ Contact form submits
+   - ✅ AI Chatbot responds
+
+---
+
+## **🔧 TROUBLESHOOTING**
+
+### **Issue: Application Not Starting**
+
+**Solution:**
+1. Check Node.js version: `node --version` (should be 18+)
+2. Check logs in cPanel → Setup Node.js App → View Log
+3. Verify `server.js` exists and is executable
+4. Restart application in cPanel
+
+### **Issue: Database Connection Error**
+
+**Solution:**
+1. Verify database credentials in `.env`
+2. Test connection in phpMyAdmin
+3. Ensure database user has ALL PRIVILEGES
+4. Check `DATABASE_URL` format: `mysql://user:pass@localhost:3306/dbname`
+
+### **Issue: 500 Internal Server Error**
+
+**Solution:**
+1. Check error logs: cPanel → Errors
+2. Check Node.js logs in cPanel
+3. Verify `.env` file exists and has correct values
+4. Check file permissions: `chmod 644 server.js`
+
+### **Issue: API Routes Not Working**
+
+**Solution:**
+1. Verify `dist/server/api/` directory exists
+2. Check `.htaccess` is redirecting to correct port
+3. Restart Node.js application
+4. Check API logs in terminal
+
+### **Issue: Static Files Not Loading**
+
+**Solution:**
+1. Verify `dist/` directory exists
+2. Check file permissions: `chmod -R 755 dist/`
+3. Clear browser cache
+4. Check `.htaccess` rules
+
+---
+
+## **📊 POST-DEPLOYMENT CHECKLIST**
+
+After deployment, verify:
+
+- ✅ Homepage loads correctly
+- ✅ All pages accessible
+- ✅ Dashboard displays real data
+- ✅ Login/Signup works
+- ✅ Database queries work
+- ✅ API endpoints respond
+- ✅ Contact form submits
+- ✅ AI Chatbot works
+- ✅ SSL certificate active (HTTPS)
+- ✅ Email sending works
+- ✅ File uploads work
+- ✅ No console errors
+
+---
+
+## **🔒 SECURITY CHECKLIST**
+
+- ✅ Change default JWT_SECRET
+- ✅ Change default SESSION_SECRET
+- ✅ Enable HTTPS (SSL certificate)
+- ✅ Set strong database password
+- ✅ Restrict .env file permissions (chmod 600)
+- ✅ Enable firewall in cPanel
+- ✅ Keep Node.js updated
+- ✅ Regular backups enabled
+
+---
+
+## **📈 PERFORMANCE OPTIMIZATION**
+
+1. **Enable Caching**
+   - Browser caching configured in `.htaccess`
+   - Set appropriate cache headers
+
+2. **Enable Compression**
+   - Gzip compression enabled in `.htaccess`
+
+3. **Optimize Images**
+   - Compress images before upload
+   - Use WebP format when possible
+
+4. **Monitor Resources**
+   - Check CPU/RAM usage in cPanel
+   - Upgrade to VPS if needed
+
+---
+
+## **🔄 UPDATING APPLICATION**
+
+When you need to update code:
+
+1. **Pull Latest Code**
+   ```bash
+   cd public_html/sdg-hub
+   git pull origin main
+   ```
+
+2. **Install New Dependencies**
+   ```bash
+   npm install --production
+   ```
+
+3. **Rebuild Application**
+   ```bash
+   npm run build
+   ```
+
+4. **Run New Migrations**
+   ```bash
+   npm run db:generate
+   npm run db:migrate
+   ```
+
+5. **Restart Application**
+   - Go to cPanel → Setup Node.js App → Restart
+
+---
+
+## **📞 SUPPORT**
+
+If you encounter issues:
+
+1. Check cPanel error logs
+2. Check Node.js application logs
+3. Review this guide
+4. Contact your hosting provider
+5. Check GitHub issues
+
+---
+
+## **🎉 CONGRATULATIONS!**
+
+Your SDG Hub platform is now live on cPanel!
+
+**Next Steps:**
+- Monitor application performance
+- Setup regular backups
+- Configure email notifications
+- Add monitoring/analytics
+- Plan VPS upgrade when needed
+
+---
+
+**Deployment Date:** [Add date]
+**Version:** 1.0.0
+**Environment:** Production (cPanel)
