Index: src/server/api/stakeholders/engagement/POST.ts
===================================================================
--- src/server/api/stakeholders/engagement/POST.ts	non-existent
+++ src/server/api/stakeholders/engagement/POST.ts	new file
@@ -0,0 +1,45 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { type, title, date, time, location, attendees, agenda, description } = req.body;
+
+    // Validation
+    if (!type || !title || !date) {
+      return res.status(400).json({
+        success: false,
+        error: 'Type, title, and date are required',
+      });
+    }
+
+    // In production, save engagement activity to database
+    // For now, return success response
+    const activity = {
+      id: Date.now(),
+      type,
+      title,
+      date,
+      time: time || '09:00',
+      location: location || 'TBD',
+      attendees: attendees || 0,
+      agenda: agenda || [],
+      description: description || '',
+      status: 'scheduled',
+      createdAt: new Date().toISOString(),
+      createdBy: 'Current User',
+    };
+
+    return res.status(201).json({
+      success: true,
+      data: activity,
+      message: 'Engagement activity created successfully',
+    });
+  } catch (error) {
+    console.error('Engagement activity creation error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
