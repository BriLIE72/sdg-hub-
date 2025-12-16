Index: src/server/api/auth/signup/POST.ts
===================================================================
--- src/server/api/auth/signup/POST.ts	non-existent
+++ src/server/api/auth/signup/POST.ts	new file
@@ -0,0 +1,115 @@
+import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { users } from '../../../db/schema.js';
+import { eq } from 'drizzle-orm';
+import { hashPassword, generateToken } from '../../../middleware/auth.js';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { email, password, firstName, lastName, organization, role, ministry, phone, country } =
+      req.body;
+
+    // Validation
+    if (!email || !password || !firstName || !lastName) {
+      return res.status(400).json({
+        success: false,
+        error: 'Email, password, first name, and last name are required',
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
+    // Password strength validation
+    if (password.length < 8) {
+      return res.status(400).json({
+        success: false,
+        error: 'Password must be at least 8 characters long',
+      });
+    }
+
+    // Check if user already exists
+    const existingUsers = await db
+      .select()
+      .from(users)
+      .where(eq(users.email, email.toLowerCase()))
+      .limit(1);
+
+    if (existingUsers && existingUsers.length > 0) {
+      return res.status(409).json({
+        success: false,
+        error: 'User with this email already exists',
+      });
+    }
+
+    // Hash password
+    const passwordHash = await hashPassword(password);
+
+    // Create user
+    const result = await db.insert(users).values({
+      email: email.toLowerCase(),
+      passwordHash,
+      firstName,
+      lastName,
+      organization: organization || null,
+      role: role || 'user',
+      ministry: ministry || null,
+      phone: phone || null,
+      country: country || null,
+      verified: false,
+      active: true,
+    });
+
+    // Get the newly created user
+    const insertId = Number(result[0].insertId);
+    const newUserResults = await db.select().from(users).where(eq(users.id, insertId)).limit(1);
+
+    if (!newUserResults || newUserResults.length === 0) {
+      throw new Error('Failed to retrieve created user');
+    }
+
+    const newUser = newUserResults[0];
+
+    // Generate JWT token
+    const token = generateToken({
+      id: newUser.id,
+      email: newUser.email,
+      role: newUser.role || 'user',
+    });
+
+    // Return user data (without password hash)
+    return res.status(201).json({
+      success: true,
+      message: 'Account created successfully',
+      data: {
+        token,
+        user: {
+          id: newUser.id,
+          email: newUser.email,
+          firstName: newUser.firstName,
+          lastName: newUser.lastName,
+          organization: newUser.organization,
+          role: newUser.role,
+          ministry: newUser.ministry,
+          phone: newUser.phone,
+          country: newUser.country,
+          verified: newUser.verified,
+          createdAt: newUser.createdAt,
+        },
+      },
+    });
+  } catch (error) {
+    console.error('Signup error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
