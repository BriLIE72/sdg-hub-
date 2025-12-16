Index: src/server/api/auth/login/POST.ts
===================================================================
--- src/server/api/auth/login/POST.ts	non-existent
+++ src/server/api/auth/login/POST.ts	new file
@@ -0,0 +1,104 @@
+import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { users } from '../../../db/schema.js';
+import { eq } from 'drizzle-orm';
+import { comparePassword, generateToken } from '../../../middleware/auth.js';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { email, password } = req.body;
+
+    // Validation
+    if (!email || !password) {
+      return res.status(400).json({
+        success: false,
+        error: 'Email and password are required',
+      });
+    }
+
+    // Email format validation
+    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
+    if (!emailRegex.test(email)) {
+      return res.status(400).json({
+        success: false,
+        error: 'Invalid email format',
+      });
+    }
+
+    // Find user by email
+    const userResults = await db
+      .select()
+      .from(users)
+      .where(eq(users.email, email.toLowerCase()))
+      .limit(1);
+
+    if (!userResults || userResults.length === 0) {
+      return res.status(401).json({
+        success: false,
+        error: 'Invalid email or password',
+      });
+    }
+
+    const user = userResults[0];
+
+    // Check if user is active
+    if (!user.active) {
+      return res.status(403).json({
+        success: false,
+        error: 'Account is deactivated. Please contact support.',
+      });
+    }
+
+    // Verify password
+    const isPasswordValid = await comparePassword(password, user.passwordHash);
+
+    if (!isPasswordValid) {
+      return res.status(401).json({
+        success: false,
+        error: 'Invalid email or password',
+      });
+    }
+
+    // Update last login timestamp
+    await db
+      .update(users)
+      .set({ lastLogin: new Date() })
+      .where(eq(users.id, user.id));
+
+    // Generate JWT token
+    const token = generateToken({
+      id: user.id,
+      email: user.email,
+      role: user.role || 'user',
+    });
+
+    // Return user data (without password hash)
+    return res.status(200).json({
+      success: true,
+      message: 'Login successful',
+      data: {
+        token,
+        user: {
+          id: user.id,
+          email: user.email,
+          firstName: user.firstName,
+          lastName: user.lastName,
+          organization: user.organization,
+          role: user.role,
+          ministry: user.ministry,
+          phone: user.phone,
+          country: user.country,
+          verified: user.verified,
+          createdAt: user.createdAt,
+        },
+      },
+    });
+  } catch (error) {
+    console.error('Login error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
