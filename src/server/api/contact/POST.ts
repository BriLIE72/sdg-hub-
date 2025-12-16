Index: src/server/api/contact/POST.ts
===================================================================
--- src/server/api/contact/POST.ts	original
+++ src/server/api/contact/POST.ts	modified
@@ -1,15 +1,18 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../server/db/client.js';
+import { contactSubmissions } from '../../../server/db/schema.js';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    const { name, email, subject, message, category, phone } = req.body;
+    const { name, email, phone, category, subject, message } = req.body;
 
     // Validation
-    if (!name || !email || !message) {
+    if (!name || !email || !subject || !message) {
       return res.status(400).json({
         success: false,
-        error: 'Name, email, and message are required',
+        error: 'Missing required fields',
+        message: 'Name, email, subject, and message are required'
       });
     }
 
     // Email validation
@@ -17,44 +20,62 @@
     if (!emailRegex.test(email)) {
       return res.status(400).json({
         success: false,
         error: 'Invalid email format',
+        message: 'Please provide a valid email address'
       });
     }
 
-    // In production, this would:
-    // 1. Save to database
-    // 2. Send email notification to admin
-    // 3. Send confirmation email to user
-    // 4. Create support ticket
+    // Category validation
+    const validCategories = ['general', 'technical', 'policy', 'partnership', 'data', 'feedback'];
+    if (category && !validCategories.includes(category.toLowerCase())) {
+      return res.status(400).json({
+        success: false,
+        error: 'Invalid category',
+        message: 'Category must be one of: general, technical, policy, partnership, data, feedback'
+      });
+    }
 
-    // For now, simulate successful submission
-    const contactSubmission = {
-      id: Date.now(),
+    // Insert into database
+    const result = await db.insert(contactSubmissions).values({
       name,
       email,
-      subject: subject || 'General Inquiry',
-      message,
-      category: category || 'general',
       phone: phone || null,
-      status: 'received',
-      createdAt: new Date().toISOString(),
-      ticketNumber: `SDG-${Date.now().toString().slice(-6)}`,
-    };
+      category: category || 'general',
+      subject,
+      message,
+      status: 'pending',
+      submittedAt: new Date()
+    });
 
-    // Simulate email sending delay
-    await new Promise((resolve) => setTimeout(resolve, 500));
+    // Get the inserted ID (MySQL specific)
+    const insertId = Number(result[0].insertId);
 
-    return res.status(201).json({
+    // Generate ticket number
+    const ticketNumber = `SDGHUB-${insertId.toString().padStart(6, '0')}`;
+
+    // Return success response
+    res.status(201).json({
       success: true,
-      data: contactSubmission,
-      message: 'Your message has been received. We will respond within 24 hours.',
+      message: 'Contact form submitted successfully',
+      data: {
+        ticketNumber,
+        id: insertId,
+        name,
+        email,
+        category: category || 'general',
+        subject,
+        status: 'pending',
+        submittedAt: new Date().toISOString(),
+        estimatedResponseTime: '24-48 hours'
+      }
     });
+
   } catch (error) {
-    console.error('Contact form error:', error);
-    return res.status(500).json({
+    console.error('Contact Form Submission Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to submit contact form',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
