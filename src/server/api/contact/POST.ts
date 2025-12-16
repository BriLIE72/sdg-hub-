Index: src/server/api/contact/POST.ts
===================================================================
--- src/server/api/contact/POST.ts	non-existent
+++ src/server/api/contact/POST.ts	new file
@@ -0,0 +1,60 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { name, email, subject, message, category, phone } = req.body;
+
+    // Validation
+    if (!name || !email || !message) {
+      return res.status(400).json({
+        success: false,
+        error: 'Name, email, and message are required',
+      });
+    }
+
+    // Email validation
+    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
+    if (!emailRegex.test(email)) {
+      return res.status(400).json({
+        success: false,
+        error: 'Invalid email format',
+      });
+    }
+
+    // In production, this would:
+    // 1. Save to database
+    // 2. Send email notification to admin
+    // 3. Send confirmation email to user
+    // 4. Create support ticket
+
+    // For now, simulate successful submission
+    const contactSubmission = {
+      id: Date.now(),
+      name,
+      email,
+      subject: subject || 'General Inquiry',
+      message,
+      category: category || 'general',
+      phone: phone || null,
+      status: 'received',
+      createdAt: new Date().toISOString(),
+      ticketNumber: `SDG-${Date.now().toString().slice(-6)}`,
+    };
+
+    // Simulate email sending delay
+    await new Promise((resolve) => setTimeout(resolve, 500));
+
+    return res.status(201).json({
+      success: true,
+      data: contactSubmission,
+      message: 'Your message has been received. We will respond within 24 hours.',
+    });
+  } catch (error) {
+    console.error('Contact form error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
