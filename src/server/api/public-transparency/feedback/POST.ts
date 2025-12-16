Index: src/server/api/public-transparency/feedback/POST.ts
===================================================================
--- src/server/api/public-transparency/feedback/POST.ts	original
+++ src/server/api/public-transparency/feedback/POST.ts	modified
@@ -1,43 +1,55 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../../db/client.js';
+import { citizenFeedback } from '../../../../db/schema.js';
 +import { eq } from 'drizzle-orm';

 export default async function handler(req: Request, res: Response) {
   try {
-    const { category, title, description, priority, submittedBy } = req.body;
+    const { category, title, description, submittedBy, email, priority } = req.body;
 
-    // Validation
+    // Validate required fields
     if (!category || !title || !description) {
       return res.status(400).json({
         success: false,
-        error: 'Category, title, and description are required',
+        error: 'Missing required fields',
+        message: 'category, title, and description are required'
       });
     }
 
-    // In production, save to database
-    // For now, return success response
-    const feedback = {
-      id: Date.now(),
+    // Create feedback submission
+    const result = await db.insert(citizenFeedback).values({
       category,
       title,
       description,
-      priority: priority || 'medium',
       submittedBy: submittedBy || 'Anonymous',
-      submittedDate: new Date().toISOString(),
-      status: 'under-review',
+      email: email || null,
+      priority: priority || 'medium',
+      status: 'pending',
       votes: 0,
       responses: 0,
-    };
+      createdAt: new Date()
+    });
 
-    return res.status(201).json({
+    // Fetch the newly created feedback
+    const insertId = Number(result[0].insertId);
+    const newFeedback = await db.select()
+      .from(citizenFeedback)
+      .where(eq(citizenFeedback.id, insertId))
+      .limit(1);
+
+    res.status(201).json({
       success: true,
-      data: feedback,
-      message: 'Feedback submitted successfully. You will receive updates via email.',
+      message: 'Feedback submitted successfully',
+      data: {
+        feedback: newFeedback[0],
+        trackingId: `FB-${String(insertId).padStart(6, '0')}`
+      }
     });
   } catch (error) {
-    console.error('Feedback submission error:', error);
-    return res.status(500).json({
+    console.error('Feedback API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to submit feedback',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
