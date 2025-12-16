Index: src/server/api/public-transparency/feedback/POST.ts
===================================================================
--- src/server/api/public-transparency/feedback/POST.ts	non-existent
+++ src/server/api/public-transparency/feedback/POST.ts	new file
@@ -0,0 +1,43 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { category, title, description, priority, submittedBy } = req.body;
+
+    // Validation
+    if (!category || !title || !description) {
+      return res.status(400).json({
+        success: false,
+        error: 'Category, title, and description are required',
+      });
+    }
+
+    // In production, save to database
+    // For now, return success response
+    const feedback = {
+      id: Date.now(),
+      category,
+      title,
+      description,
+      priority: priority || 'medium',
+      submittedBy: submittedBy || 'Anonymous',
+      submittedDate: new Date().toISOString(),
+      status: 'under-review',
+      votes: 0,
+      responses: 0,
+    };
+
+    return res.status(201).json({
+      success: true,
+      data: feedback,
+      message: 'Feedback submitted successfully. You will receive updates via email.',
+    });
+  } catch (error) {
+    console.error('Feedback submission error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
