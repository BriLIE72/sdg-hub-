Index: src/server/api/stakeholders/engagement/POST.ts
===================================================================
--- src/server/api/stakeholders/engagement/POST.ts	original
+++ src/server/api/stakeholders/engagement/POST.ts	modified
@@ -1,45 +1,67 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../../server/db/client.js';
+import { engagementActivities } from '../../../../server/db/schema.js';
 +import { eq } from 'drizzle-orm';

 export default async function handler(req: Request, res: Response) {
   try {
-    const { type, title, date, time, location, attendees, agenda, description } = req.body;
+    const { title, type, date, time, location, description, stakeholderIds, organizer } = req.body;
 
-    // Validation
-    if (!type || !title || !date) {
+    // Validate required fields
+    if (!title || !type || !date) {
       return res.status(400).json({
         success: false,
-        error: 'Type, title, and date are required',
+        error: 'Missing required fields',
+        message: 'title, type, and date are required',
       });
     }
 
-    // In production, save engagement activity to database
-    // For now, return success response
-    const activity = {
-      id: Date.now(),
-      type,
+    // Validate type
+    const validTypes = ['meeting', 'workshop', 'consultation', 'webinar', 'conference', 'other'];
+    if (!validTypes.includes(type)) {
+      return res.status(400).json({
+        success: false,
+        error: 'Invalid type',
+        message: `Type must be one of: ${validTypes.join(', ')}`,
+      });
+    }
+
+    // Insert engagement activity into database
+    const result = await db.insert(engagementActivities).values({
       title,
-      date,
-      time: time || '09:00',
-      location: location || 'TBD',
-      attendees: attendees || 0,
-      agenda: agenda || [],
-      description: description || '',
+      type,
+      date: new Date(date),
+      time: time || null,
+      location: location || null,
+      description: description || null,
+      stakeholderIds: stakeholderIds || [],
+      organizer: organizer || 'SDG Hub',
+      attendees: 0,
       status: 'scheduled',
-      createdAt: new Date().toISOString(),
-      createdBy: 'Current User',
-    };
+      notes: null,
+      createdAt: new Date(),
+    });
 
-    return res.status(201).json({
+    // Get the inserted ID
+    const insertedId = Number(result[0].insertId);
+
+    // Fetch the newly created activity
+    const newActivity = await db
+      .select()
+      .from(engagementActivities)
+      .where(eq(engagementActivities.id, insertedId))
+      .limit(1);
+
+    res.status(201).json({
       success: true,
-      data: activity,
       message: 'Engagement activity created successfully',
+      data: newActivity[0],
     });
   } catch (error) {
-    console.error('Engagement activity creation error:', error);
-    return res.status(500).json({
+    console.error('Error creating engagement activity:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to create engagement activity',
+      message: error instanceof Error ? error.message : 'Unknown error',
     });
   }
 }
