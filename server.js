
+#!/usr/bin/env node
+
+/**
+ * SDG Hub - Production Server Entry Point
+ * This file is used by cPanel's Node.js application manager
+ * and Passenger to start the application
+ */
+
+// Load environment variables
require('dotenv-local').config();
+
const express = require('express');
const path = require('path');
const fs = require('fs');
+
+// Create Express app
const app = express();
+
+// Get port from environment or use default
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
+
+// Trust proxy (important for cPanel/Passenger)
+app.set('trust proxy', 1);
+
+// Security middleware
app.use((req, res, next) => {
+  res.setHeader('X-Powered-By', 'SDG Hub');
+  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
+  res.setHeader('X-Content-Type-Options', 'nosniff');
+  res.setHeader('X-XSS-Protection', '1; mode=block');
+  next();
});

+// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
+
+// CORS middleware
app.use((req, res, next) => {
+  const allowedOrigins = process.env.CORS_ORIGIN 
+    ? process.env.CORS_ORIGIN.split(',') 
+    : ['*'];
+  
+  const origin = req.headers.origin;
+  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
+    res.setHeader('Access-Control-Allow-Origin', origin || '*');
+  }
+  
+  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
+  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
+  res.setHeader('Access-Control-Allow-Credentials', 'true');
+  
+  if (req.method === 'OPTIONS') {
+    return res.sendStatus(200);
+  }
+  
+  next();
+});
+
+// Serve static files from dist directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
+  app.use(express.static(distPath, {
+    maxAge: '1y',
+    etag: true,
+    lastModified: true,
+  }));
+}
+
+// Serve public assets
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
+  app.use('/assets', express.static(path.join(publicPath, 'assets'), {
+    maxAge: '1y',
+  }));
+  app.use('/images', express.static(path.join(publicPath, 'images'), {
+    maxAge: '1y',
+  }));
+}
+
+// API routes - dynamically load from dist/server/api
const apiPath = path.join(__dirname, 'dist', 'server', 'api');
if (fs.existsSync(apiPath)) {
+  // Health check endpoint
+  app.get('/api/health', (req, res) => {
+    res.json({ 
+      status: 'ok', 
+      timestamp: new Date().toISOString(),
+      environment: process.env.NODE_ENV || 'development',
+      version: require('./package.json').version,
+    });
+  });
+
+  // Load API routes recursively
+  function loadApiRoutes(dir, prefix = '/api') {
+    const files = fs.readdirSync(dir);
+    
+    files.forEach(file => {
+      const filePath = path.join(dir, file);
+      const stat = fs.statSync(filePath);
+      
+      if (stat.isDirectory()) {
+        // Recursively load subdirectories
+        loadApiRoutes(filePath, `${prefix}/${file}`);
+      } else if (file.endsWith('.js')) {
+        // Extract HTTP method from filename (GET.js, POST.js, etc.)
+        const method = file.replace('.js', '').toLowerCase();
+        const validMethods = ['get', 'post', 'put', 'delete', 'patch'];
+        
+        if (validMethods.includes(method)) {
+          try {
+            const handler = require(filePath);
+            const route = prefix.replace(/\[([^\]]+)\]/g, ':$1'); // Convert [id] to :id
+            
+            app[method](route, async (req, res) => {
+              try {
+                if (typeof handler.default === 'function') {
+                  await handler.default(req, res);
+                } else if (typeof handler === 'function') {
+                  await handler(req, res);
+                } else {
+                  res.status(500).json({ error: 'Invalid API handler' });
+                }
+              } catch (error) {
+                console.error(`API Error [${method.toUpperCase()} ${route}]:`, error);
+                res.status(500).json({ 
+                  error: 'Internal server error',
+                  message: process.env.NODE_ENV === 'development' ? error.message : undefined,
+                });
+              }
+            });
+            
+            console.log(`✅ Loaded API route: ${method.toUpperCase()} ${route}`);
+          } catch (error) {
+            console.error(`❌ Failed to load API route: ${filePath}`, error);
+          }
+        }
+      }
+    });
+  }
+  
+  // Load all API routes
+  loadApiRoutes(apiPath);
+}
+
+// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
+  if (fs.existsSync(indexPath)) {
+    res.sendFile(indexPath);
+  } else {
+    res.status(404).send('Application not built. Run "npm run build" first.');
+  }
+});
+
+// Error handling middleware
app.use((err, req, res, next) => {
+  console.error('Server Error:', err);
+  res.status(500).json({
+    error: 'Internal server error',
+    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
+  });
+});
+
+// Start server
const server = app.listen(PORT, HOST, () => {
+  console.log('');
+  console.log('🚀 SDG Hub Server Started!');
+  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
+  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
+  console.log(`🌐 Server URL: http://${HOST}:${PORT}`);
+  console.log(`📁 Serving from: ${distPath}`);
+  console.log(`🔌 API Base: http://${HOST}:${PORT}/api`);
+  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
+  console.log('');
+});
+
+// Graceful shutdown
process.on('SIGTERM', () => {
+  console.log('SIGTERM signal received: closing HTTP server');
+  server.close(() => {
+    console.log('HTTP server closed');
+    process.exit(0);
+  });
+});
+
process.on('SIGINT', () => {
+  console.log('SIGINT signal received: closing HTTP server');
+  server.close(() => {
+    console.log('HTTP server closed');
+    process.exit(0);
+  });
+});
+
+// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
+  console.error('Uncaught Exception:', error);
+  process.exit(1);
+});
+
process.on('unhandledRejection', (reason, promise) => {
+  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
+  process.exit(1);
+});
+
module.exports = app;
