Index: src/server/api/implementation-toolkit/download/POST.ts
===================================================================
--- src/server/api/implementation-toolkit/download/POST.ts	original
+++ src/server/api/implementation-toolkit/download/POST.ts	modified
@@ -1,39 +1,65 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../../db/client.js';
+import { resources, resourceDownloads } from '../../../../db/schema.js';
+import { eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    const { resourceId, resourceTitle, userId } = req.body;
+    const { resourceId, userId, userName, userEmail } = req.body;
 
-    // Validation
-    if (!resourceId || !resourceTitle) {
+    // Validate required fields
+    if (!resourceId) {
       return res.status(400).json({
         success: false,
-        error: 'Resource ID and title are required',
+        error: 'Missing required field',
+        message: 'resourceId is required'
       });
     }
 
-    // In production, log download and update statistics in database
-    // For now, return success response
-    const downloadLog = {
-      id: Date.now(),
+    // Check if resource exists
+    const resource = await db.select()
+      .from(resources)
+      .where(eq(resources.id, resourceId))
+      .limit(1);
+
+    if (!resource || resource.length === 0) {
+      return res.status(404).json({
+        success: false,
+        error: 'Resource not found',
+        message: `Resource with ID ${resourceId} does not exist`
+      });
+    }
+
+    // Record download
+    await db.insert(resourceDownloads).values({
       resourceId,
-      resourceTitle,
-      userId: userId || 'Anonymous',
-      timestamp: new Date().toISOString(),
-      status: 'completed',
-    };
+      userId: userId || null,
+      userName: userName || 'Anonymous',
+      userEmail: userEmail || null,
+      downloadedAt: new Date()
+    });
 
-    return res.status(200).json({
+    // Update resource download count
+    await db.update(resources)
+      .set({
+        downloads: (resource[0].downloads || 0) + 1
+      })
+      .where(eq(resources.id, resourceId));
+
+    res.json({
       success: true,
-      data: downloadLog,
-      message: 'Download logged successfully',
+      message: 'Download recorded successfully',
+      data: {
+        resource: resource[0],
+        downloadUrl: resource[0].fileUrl
+      }
     });
   } catch (error) {
-    console.error('Download logging error:', error);
-    return res.status(500).json({
+    console.error('Download API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to process download',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
