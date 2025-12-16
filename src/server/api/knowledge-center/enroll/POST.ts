Index: src/server/api/knowledge-center/enroll/POST.ts
===================================================================
--- src/server/api/knowledge-center/enroll/POST.ts	original
+++ src/server/api/knowledge-center/enroll/POST.ts	modified
@@ -1,42 +1,87 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../../db/client.js';
+import { enrollments, courses } from '../../../../db/schema.js';
+import { eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
     const { courseId, userId, userName, userEmail } = req.body;
 
-    // Validation
-    if (!courseId || !userId) {
+    // Validate required fields
+    if (!courseId || !userId || !userName || !userEmail) {
       return res.status(400).json({
         success: false,
-        error: 'Course ID and User ID are required',
+        error: 'Missing required fields',
+        message: 'courseId, userId, userName, and userEmail are required'
       });
     }
 
-    // In production, save enrollment to database
-    // For now, return success response
-    const enrollment = {
-      id: Date.now(),
+    // Check if course exists
+    const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
+    
+    if (!course || course.length === 0) {
+      return res.status(404).json({
+        success: false,
+        error: 'Course not found',
+        message: `Course with ID ${courseId} does not exist`
+      });
+    }
+
+    // Check if user is already enrolled
+    const existingEnrollment = await db.select()
+      .from(enrollments)
+      .where(eq(enrollments.courseId, courseId))
+      .where(eq(enrollments.userId, userId))
+      .limit(1);
+
+    if (existingEnrollment && existingEnrollment.length > 0) {
+      return res.status(409).json({
+        success: false,
+        error: 'Already enrolled',
+        message: 'You are already enrolled in this course'
+      });
+    }
+
+    // Create enrollment
+    const result = await db.insert(enrollments).values({
       courseId,
       userId,
-      userName: userName || 'User',
-      userEmail: userEmail || 'user@example.com',
-      enrolledAt: new Date().toISOString(),
+      userName,
+      userEmail,
+      enrolledAt: new Date(),
       status: 'active',
       progress: 0,
-      completedModules: 0,
-    };
+      completedModules: 0
+    });
 
-    return res.status(201).json({
+    // Update course enrollment count
+    await db.update(courses)
+      .set({ 
+        enrollmentCount: (course[0].enrollmentCount || 0) + 1 
+      })
+      .where(eq(courses.id, courseId));
+
+    // Fetch the newly created enrollment
+    const insertId = Number(result[0].insertId);
+    const newEnrollment = await db.select()
+      .from(enrollments)
+      .where(eq(enrollments.id, insertId))
+      .limit(1);
+
+    res.status(201).json({
       success: true,
-      data: enrollment,
       message: 'Successfully enrolled in course',
+      data: {
+        enrollment: newEnrollment[0],
+        course: course[0]
+      }
     });
   } catch (error) {
-    console.error('Course enrollment error:', error);
-    return res.status(500).json({
+    console.error('Enrollment API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to enroll in course',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
