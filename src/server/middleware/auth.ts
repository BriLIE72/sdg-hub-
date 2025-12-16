Index: src/server/middleware/auth.ts
===================================================================
--- src/server/middleware/auth.ts	original
+++ src/server/middleware/auth.ts	modified
@@ -1,115 +1,91 @@
 import type { Request, Response, NextFunction } from 'express';
-import { db } from '../db/client.js';
-import { apiKeys } from '../db/schema.js';
-import { eq } from 'drizzle-orm';
-import crypto from 'crypto';
+import jwt from 'jsonwebtoken';
 
+const JWT_SECRET = process.env.JWT_SECRET || 'sdg-hub-secret-key-change-in-production';
+
+export interface AuthRequest extends Request {
+  user?: {
+    id: number;
+    email: string;
+    role: string;
+  };
+}
+
 /**
- * Authentication middleware for API endpoints
- * 
- * Checks for API key in Authorization header: Bearer <api-key>
- * Validates key against database and checks rate limits
+ * Middleware to verify JWT token
  */
-export async function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
-  try {
-    const authHeader = req.headers.authorization;
+export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
+  const authHeader = req.headers['authorization'];
+  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
 
-    if (!authHeader || !authHeader.startsWith('Bearer ')) {
-      return res.status(401).json({
-        success: false,
-        error: 'Missing or invalid Authorization header',
-        message: 'Please provide API key in format: Authorization: Bearer <api-key>',
-      });
-    }
+  if (!token) {
+    return res.status(401).json({
+      success: false,
+      error: 'Access token required',
+    });
+  }
 
-    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
-    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
+  try {
+    const decoded = jwt.verify(token, JWT_SECRET) as {
+      id: number;
+      email: string;
+      role: string;
+    };
+    req.user = decoded;
+    next();
+  } catch (error) {
+    return res.status(403).json({
+      success: false,
+      error: 'Invalid or expired token',
+    });
+  }
+}
 
-    // Find API key in database
-    const keys = await db
-      .select()
-      .from(apiKeys)
-      .where(eq(apiKeys.keyHash, keyHash))
-      .limit(1);
-
-    if (!keys || keys.length === 0) {
+/**
+ * Middleware to check if user has required role
+ */
+export function requireRole(...roles: string[]) {
+  return (req: AuthRequest, res: Response, next: NextFunction) => {
+    if (!req.user) {
       return res.status(401).json({
         success: false,
-        error: 'Invalid API key',
+        error: 'Authentication required',
       });
     }
 
-    const key = keys[0];
-
-    // Check if key is active
-    if (!key.active) {
-      return res.status(401).json({
+    if (!roles.includes(req.user.role)) {
+      return res.status(403).json({
         success: false,
-        error: 'API key is inactive',
+        error: 'Insufficient permissions',
       });
     }
 
-    // Check if key is expired
-    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
-      return res.status(401).json({
-        success: false,
-        error: 'API key has expired',
-      });
-    }
-
-    // Check rate limit (simple hourly check)
-    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
-    if (key.lastUsed && new Date(key.lastUsed) > hourAgo) {
-      if (key.requestCount >= key.rateLimit) {
-        return res.status(429).json({
-          success: false,
-          error: 'Rate limit exceeded',
-          message: `Maximum ${key.rateLimit} requests per hour`,
-        });
-      }
-    }
-
-    // Update request count and last used timestamp
-    await db
-      .update(apiKeys)
-      .set({
-        requestCount: key.requestCount + 1,
-        lastUsed: new Date(),
-      })
-      .where(eq(apiKeys.id, key.id));
-
-    // Attach user info to request
-    (req as any).apiKey = key;
-    (req as any).userId = key.userId;
-
     next();
-  } catch (error) {
-    console.error('Authentication error:', error);
-    res.status(500).json({
-      success: false,
-      error: 'Authentication failed',
-      message: String(error),
-    });
-  }
+  };
 }
 
 /**
- * Optional authentication middleware
- * Allows requests without API key but attaches user info if provided
+ * Generate JWT token
  */
-export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
-  const authHeader = req.headers.authorization;
+export function generateToken(payload: { id: number; email: string; role: string }): string {
+  return jwt.sign(payload, JWT_SECRET, {
+    expiresIn: '7d', // Token expires in 7 days
+  });
+}
 
-  if (!authHeader || !authHeader.startsWith('Bearer ')) {
-    // No auth provided, continue without user info
-    return next();
-  }
+/**
+ * Hash password using bcrypt
+ */
+export async function hashPassword(password: string): Promise<string> {
+  const bcrypt = await import('bcryptjs');
+  const salt = await bcrypt.genSalt(10);
+  return bcrypt.hash(password, salt);
+}
 
-  // Try to authenticate, but don't fail if invalid
-  try {
-    await authenticateApiKey(req, res, next);
-  } catch (error) {
-    // Continue without auth
-    next();
-  }
+/**
+ * Compare password with hash
+ */
+export async function comparePassword(password: string, hash: string): Promise<boolean> {
+  const bcrypt = await import('bcryptjs');
+  return bcrypt.compare(password, hash);
 }
