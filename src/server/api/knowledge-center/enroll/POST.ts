Index: src/server/api/knowledge-center/enroll/POST.ts
===================================================================
--- src/server/api/knowledge-center/enroll/POST.ts	non-existent
+++ src/server/api/knowledge-center/enroll/POST.ts	new file
@@ -0,0 +1,42 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { courseId, userId, userName, userEmail } = req.body;
+
+    // Validation
+    if (!courseId || !userId) {
+      return res.status(400).json({
+        success: false,
+        error: 'Course ID and User ID are required',
+      });
+    }
+
+    // In production, save enrollment to database
+    // For now, return success response
+    const enrollment = {
+      id: Date.now(),
+      courseId,
+      userId,
+      userName: userName || 'User',
+      userEmail: userEmail || 'user@example.com',
+      enrolledAt: new Date().toISOString(),
+      status: 'active',
+      progress: 0,
+      completedModules: 0,
+    };
+
+    return res.status(201).json({
+      success: true,
+      data: enrollment,
+      message: 'Successfully enrolled in course',
+    });
+  } catch (error) {
+    console.error('Course enrollment error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
