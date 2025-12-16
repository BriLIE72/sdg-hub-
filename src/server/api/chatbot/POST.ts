Index: src/server/api/chatbot/POST.ts
===================================================================
--- src/server/api/chatbot/POST.ts	non-existent
+++ src/server/api/chatbot/POST.ts	new file
@@ -0,0 +1,164 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { message, conversationId } = req.body;
+
+    if (!message) {
+      return res.status(400).json({
+        success: false,
+        error: 'Message is required',
+      });
+    }
+
+    // In production, this would integrate with an AI service (OpenAI, Claude, etc.)
+    // For now, we'll provide intelligent responses based on keywords
+
+    const lowerMessage = message.toLowerCase();
+    let response = '';
+    let suggestions: string[] = [];
+
+    // SDG-related queries
+    if (lowerMessage.includes('sdg') || lowerMessage.includes('sustainable development')) {
+      response =
+        "The SDG Hub tracks all 17 Sustainable Development Goals. You can view detailed progress, policies, and initiatives for each goal on our SDG Progress page. Which specific SDG would you like to learn more about?";
+      suggestions = [
+        'Show me SDG 1 - No Poverty',
+        'View all SDG progress',
+        'What policies support SDG 4?',
+      ];
+    }
+    // Policy-related queries
+    else if (lowerMessage.includes('policy') || lowerMessage.includes('policies')) {
+      response =
+        "Our Policy Lab provides comprehensive tools for policy design, simulation, and monitoring. You can create new policies, simulate their impact, and track implementation progress. Would you like to explore the Policy Lab or run a simulation?";
+      suggestions = [
+        'Open Policy Lab',
+        'Run a policy simulation',
+        'View active policies',
+      ];
+    }
+    // Dashboard queries
+    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
+      response =
+        "The Dashboard provides a comprehensive overview of all SDG initiatives, budget utilization, recent policies, and performance metrics across 10 government ministries. You can access real-time analytics and strategic recommendations there.";
+      suggestions = [
+        'Go to Dashboard',
+        'Show budget breakdown',
+        'View performance metrics',
+      ];
+    }
+    // Stakeholder queries
+    else if (lowerMessage.includes('stakeholder') || lowerMessage.includes('partner')) {
+      response =
+        "The Multi-Stakeholder Portal connects you with 8 stakeholder groups and enables collaboration through engagement activities, feedback requests, and direct communication. You can also view stakeholder insights and satisfaction metrics.";
+      suggestions = [
+        'View stakeholders',
+        'Submit feedback',
+        'Schedule engagement',
+      ];
+    }
+    // International cooperation
+    else if (lowerMessage.includes('international') || lowerMessage.includes('cooperation')) {
+      response =
+        "The International Cooperation Hub features 45 partner organizations, 128 active projects, and $2.45B in committed funding. You can explore funding opportunities, connect with international experts, and access knowledge exchange resources.";
+      suggestions = [
+        'View international partners',
+        'Explore funding opportunities',
+        'Connect with experts',
+      ];
+    }
+    // Data and transparency
+    else if (lowerMessage.includes('data') || lowerMessage.includes('transparency')) {
+      response =
+        "The Public Transparency Portal provides access to 6 open datasets, budget transparency information, citizen feedback mechanisms, and public reports. All data is searchable and downloadable for public use.";
+      suggestions = [
+        'Browse open datasets',
+        'View budget transparency',
+        'Submit citizen feedback',
+      ];
+    }
+    // Learning and resources
+    else if (
+      lowerMessage.includes('learn') ||
+      lowerMessage.includes('course') ||
+      lowerMessage.includes('training')
+    ) {
+      response =
+        "The Knowledge & Learning Center offers 156 courses, 892 articles, 324 videos, and 145 webinars covering SDG implementation, policy design, and best practices. You can enroll in courses and earn certificates.";
+      suggestions = [
+        'Browse courses',
+        'View learning paths',
+        'Enroll in a course',
+      ];
+    }
+    // Implementation toolkit
+    else if (lowerMessage.includes('toolkit') || lowerMessage.includes('template')) {
+      response =
+        "The Implementation Toolkit provides 156 resources including templates, guides, tools, and case studies to support policy implementation. You can search by category and download resources for your projects.";
+      suggestions = [
+        'Browse toolkit resources',
+        'Download templates',
+        'View case studies',
+      ];
+    }
+    // Help and support
+    else if (
+      lowerMessage.includes('help') ||
+      lowerMessage.includes('support') ||
+      lowerMessage.includes('how')
+    ) {
+      response =
+        "I'm here to help! You can ask me about SDG progress, policies, stakeholders, international cooperation, data access, learning resources, or any other feature of the SDG Hub. What would you like to know?";
+      suggestions = [
+        'Show me around the platform',
+        'How do I create a policy?',
+        'Where can I find data?',
+      ];
+    }
+    // Greeting
+    else if (
+      lowerMessage.includes('hello') ||
+      lowerMessage.includes('hi') ||
+      lowerMessage.includes('hey')
+    ) {
+      response =
+        "Hello! Welcome to the SDG Hub. I'm your AI assistant, here to help you navigate the platform and find information about sustainable development initiatives. How can I assist you today?";
+      suggestions = [
+        'Show me the dashboard',
+        'Tell me about SDGs',
+        'What can you help me with?',
+      ];
+    }
+    // Default response
+    else {
+      response =
+        "I can help you with information about SDG progress, policies, stakeholders, international cooperation, data access, learning resources, and more. Could you please provide more details about what you're looking for?";
+      suggestions = [
+        'View SDG progress',
+        'Explore policies',
+        'Access data',
+      ];
+    }
+
+    // Simulate AI processing delay
+    await new Promise((resolve) => setTimeout(resolve, 800));
+
+    return res.status(200).json({
+      success: true,
+      data: {
+        message: response,
+        suggestions,
+        conversationId: conversationId || `conv-${Date.now()}`,
+        timestamp: new Date().toISOString(),
+      },
+    });
+  } catch (error) {
+    console.error('Chatbot error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
