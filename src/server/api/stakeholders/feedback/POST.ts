Index: src/server/api/stakeholders/feedback/POST.ts
===================================================================
--- src/server/api/stakeholders/feedback/POST.ts	original
+++ src/server/api/stakeholders/feedback/POST.ts	modified
@@ -1,42 +1,64 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../../server/db/client.js';
+import { feedbackRequests } from '../../../../server/db/schema.js';
+import { eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    const { stakeholderId, feedbackType, rating, comment, category } = req.body;
+    const { requestId, stakeholderId, response, rating, comments } = req.body;
 
-    // Validation
-    if (!stakeholderId || !feedbackType || !rating) {
+    // Validate required fields
+    if (!requestId || !stakeholderId || !response) {
       return res.status(400).json({
         success: false,
-        error: 'Stakeholder ID, feedback type, and rating are required',
+        error: 'Missing required fields',
+        message: 'requestId, stakeholderId, and response are required',
       });
     }
 
-    // In production, save feedback to database
-    // For now, return success response
-    const feedback = {
-      id: Date.now(),
-      stakeholderId,
-      feedbackType,
-      rating,
-      comment: comment || '',
-      category: category || 'General',
-      date: new Date().toISOString(),
-      submittedBy: 'Current User',
-      status: 'submitted',
-    };
+    // Check if feedback request exists
+    const feedbackRequest = await db
+      .select()
+      .from(feedbackRequests)
+      .where(eq(feedbackRequests.id, requestId))
+      .limit(1);
 
-    return res.status(201).json({
+    if (feedbackRequest.length === 0) {
+      return res.status(404).json({
+        success: false,
+        error: 'Feedback request not found',
+      });
+    }
+
+    // Update response count
+    const currentCount = feedbackRequest[0].responsesCount || 0;
+    await db
+      .update(feedbackRequests)
+      .set({
+        responsesCount: currentCount + 1,
+        updatedAt: new Date(),
+      })
+      .where(eq(feedbackRequests.id, requestId));
+
+    // In production, you would also save the individual response to a separate table
+    // For now, we'll just increment the count
+
+    res.json({
       success: true,
-      data: feedback,
       message: 'Feedback submitted successfully',
+      data: {
+        requestId,
+        stakeholderId,
+        submittedAt: new Date().toISOString(),
+        status: 'received',
+      },
     });
   } catch (error) {
-    console.error('Feedback submission error:', error);
-    return res.status(500).json({
+    console.error('Error submitting feedback:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to submit feedback',
+      message: error instanceof Error ? error.message : 'Unknown error',
     });
   }
 }
