Index: src/server/api/chatbot/POST.ts
===================================================================
--- src/server/api/chatbot/POST.ts	original
+++ src/server/api/chatbot/POST.ts	modified
@@ -1,164 +1,165 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../server/db/client.js';
+import { chatbotConversations, chatbotMessages } from '../../../server/db/schema.js';
+import { eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
     const { message, conversationId } = req.body;
 
-    if (!message) {
+    // Validation
+    if (!message || typeof message !== 'string' || message.trim().length === 0) {
       return res.status(400).json({
         success: false,
-        error: 'Message is required',
+        error: 'Invalid message',
+        message: 'Message is required and must be a non-empty string'
       });
     }
 
-    // In production, this would integrate with an AI service (OpenAI, Claude, etc.)
-    // For now, we'll provide intelligent responses based on keywords
+    let currentConversationId = conversationId;
 
-    const lowerMessage = message.toLowerCase();
-    let response = '';
-    let suggestions: string[] = [];
-
-    // SDG-related queries
-    if (lowerMessage.includes('sdg') || lowerMessage.includes('sustainable development')) {
-      response =
-        "The SDG Hub tracks all 17 Sustainable Development Goals. You can view detailed progress, policies, and initiatives for each goal on our SDG Progress page. Which specific SDG would you like to learn more about?";
-      suggestions = [
-        'Show me SDG 1 - No Poverty',
-        'View all SDG progress',
-        'What policies support SDG 4?',
-      ];
+    // Create new conversation if none exists
+    if (!conversationId) {
+      const newConversation = await db.insert(chatbotConversations).values({
+        userId: null, // Can be linked to authenticated user later
+        startedAt: new Date(),
+        lastMessageAt: new Date(),
+        status: 'active'
+      });
+      currentConversationId = Number(newConversation[0].insertId);
+    } else {
+      // Update last message timestamp
+      await db
+        .update(chatbotConversations)
+        .set({ lastMessageAt: new Date() })
+        .where(eq(chatbotConversations.id, Number(conversationId)));
     }
-    // Policy-related queries
-    else if (lowerMessage.includes('policy') || lowerMessage.includes('policies')) {
-      response =
-        "Our Policy Lab provides comprehensive tools for policy design, simulation, and monitoring. You can create new policies, simulate their impact, and track implementation progress. Would you like to explore the Policy Lab or run a simulation?";
-      suggestions = [
-        'Open Policy Lab',
-        'Run a policy simulation',
-        'View active policies',
-      ];
-    }
-    // Dashboard queries
-    else if (lowerMessage.includes('dashboard') || lowerMessage.includes('overview')) {
-      response =
-        "The Dashboard provides a comprehensive overview of all SDG initiatives, budget utilization, recent policies, and performance metrics across 10 government ministries. You can access real-time analytics and strategic recommendations there.";
-      suggestions = [
-        'Go to Dashboard',
-        'Show budget breakdown',
-        'View performance metrics',
-      ];
-    }
-    // Stakeholder queries
-    else if (lowerMessage.includes('stakeholder') || lowerMessage.includes('partner')) {
-      response =
-        "The Multi-Stakeholder Portal connects you with 8 stakeholder groups and enables collaboration through engagement activities, feedback requests, and direct communication. You can also view stakeholder insights and satisfaction metrics.";
-      suggestions = [
-        'View stakeholders',
-        'Submit feedback',
-        'Schedule engagement',
-      ];
-    }
-    // International cooperation
-    else if (lowerMessage.includes('international') || lowerMessage.includes('cooperation')) {
-      response =
-        "The International Cooperation Hub features 45 partner organizations, 128 active projects, and $2.45B in committed funding. You can explore funding opportunities, connect with international experts, and access knowledge exchange resources.";
-      suggestions = [
-        'View international partners',
-        'Explore funding opportunities',
-        'Connect with experts',
-      ];
-    }
-    // Data and transparency
-    else if (lowerMessage.includes('data') || lowerMessage.includes('transparency')) {
-      response =
-        "The Public Transparency Portal provides access to 6 open datasets, budget transparency information, citizen feedback mechanisms, and public reports. All data is searchable and downloadable for public use.";
-      suggestions = [
-        'Browse open datasets',
-        'View budget transparency',
-        'Submit citizen feedback',
-      ];
-    }
-    // Learning and resources
-    else if (
-      lowerMessage.includes('learn') ||
-      lowerMessage.includes('course') ||
-      lowerMessage.includes('training')
-    ) {
-      response =
-        "The Knowledge & Learning Center offers 156 courses, 892 articles, 324 videos, and 145 webinars covering SDG implementation, policy design, and best practices. You can enroll in courses and earn certificates.";
-      suggestions = [
-        'Browse courses',
-        'View learning paths',
-        'Enroll in a course',
-      ];
-    }
-    // Implementation toolkit
-    else if (lowerMessage.includes('toolkit') || lowerMessage.includes('template')) {
-      response =
-        "The Implementation Toolkit provides 156 resources including templates, guides, tools, and case studies to support policy implementation. You can search by category and download resources for your projects.";
-      suggestions = [
-        'Browse toolkit resources',
-        'Download templates',
-        'View case studies',
-      ];
-    }
-    // Help and support
-    else if (
-      lowerMessage.includes('help') ||
-      lowerMessage.includes('support') ||
-      lowerMessage.includes('how')
-    ) {
-      response =
-        "I'm here to help! You can ask me about SDG progress, policies, stakeholders, international cooperation, data access, learning resources, or any other feature of the SDG Hub. What would you like to know?";
-      suggestions = [
-        'Show me around the platform',
-        'How do I create a policy?',
-        'Where can I find data?',
-      ];
-    }
-    // Greeting
-    else if (
-      lowerMessage.includes('hello') ||
-      lowerMessage.includes('hi') ||
-      lowerMessage.includes('hey')
-    ) {
-      response =
-        "Hello! Welcome to the SDG Hub. I'm your AI assistant, here to help you navigate the platform and find information about sustainable development initiatives. How can I assist you today?";
-      suggestions = [
-        'Show me the dashboard',
-        'Tell me about SDGs',
-        'What can you help me with?',
-      ];
-    }
-    // Default response
-    else {
-      response =
-        "I can help you with information about SDG progress, policies, stakeholders, international cooperation, data access, learning resources, and more. Could you please provide more details about what you're looking for?";
-      suggestions = [
-        'View SDG progress',
-        'Explore policies',
-        'Access data',
-      ];
-    }
 
-    // Simulate AI processing delay
-    await new Promise((resolve) => setTimeout(resolve, 800));
+    // Save user message to database
+    await db.insert(chatbotMessages).values({
+      conversationId: currentConversationId,
+      sender: 'user',
+      message: message.trim(),
+      timestamp: new Date()
+    });
 
-    return res.status(200).json({
+    // Generate bot response based on message content
+    const botResponse = generateBotResponse(message.trim().toLowerCase());
+
+    // Save bot response to database
+    await db.insert(chatbotMessages).values({
+      conversationId: currentConversationId,
+      sender: 'bot',
+      message: botResponse.text,
+      timestamp: new Date()
+    });
+
+    // Return response
+    res.json({
       success: true,
       data: {
-        message: response,
-        suggestions,
-        conversationId: conversationId || `conv-${Date.now()}`,
-        timestamp: new Date().toISOString(),
-      },
+        conversationId: currentConversationId,
+        response: botResponse.text,
+        suggestions: botResponse.suggestions,
+        timestamp: new Date().toISOString()
+      }
     });
+
   } catch (error) {
-    console.error('Chatbot error:', error);
-    return res.status(500).json({
+    console.error('Chatbot API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to process message',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
+
+// Generate intelligent bot responses
+function generateBotResponse(message: string): { text: string; suggestions: string[] } {
+  // Greetings
+  if (message.match(/^(hi|hello|hey|greetings)/i)) {
+    return {
+      text: "Hello! I'm the SDG Hub AI Assistant. I can help you with information about SDG goals, policies, stakeholders, international cooperation, and more. How can I assist you today?",
+      suggestions: ['Show SDG Progress', 'View Policies', 'Find Stakeholders', 'Help']
+    };
+  }
+
+  // SDG related queries
+  if (message.includes('sdg') || message.includes('goal') || message.includes('sustainable development')) {
+    return {
+      text: "I can help you with SDG-related information. We track all 17 Sustainable Development Goals with real-time progress monitoring, targets, and indicators. Would you like to see the progress dashboard or learn about a specific goal?",
+      suggestions: ['View SDG Progress', 'SDG 1: No Poverty', 'SDG 3: Good Health', 'All SDGs']
+    };
+  }
+
+  // Policy queries
+  if (message.includes('policy') || message.includes('policies')) {
+    return {
+      text: "Our platform offers comprehensive policy management tools including the Policy Lab for creating new policies, Policy Simulation for impact analysis, and Policy Monitoring for tracking implementation. Which would you like to explore?",
+      suggestions: ['Policy Lab', 'Policy Simulation', 'Policy Monitoring', 'Recent Policies']
+    };
+  }
+
+  // Dashboard queries
+  if (message.includes('dashboard') || message.includes('overview') || message.includes('summary')) {
+    return {
+      text: "The Dashboard provides a comprehensive overview of all SDG activities, including policy progress, budget utilization across 10 ministries, recent updates, and strategic recommendations. You can access it from the main navigation.",
+      suggestions: ['Go to Dashboard', 'View Budget', 'See Alerts', 'Performance Metrics']
+    };
+  }
+
+  // Stakeholder queries
+  if (message.includes('stakeholder') || message.includes('partner') || message.includes('collaboration')) {
+    return {
+      text: "The Multi-Stakeholder Portal connects you with 45+ organizations, government ministries, NGOs, and international partners. You can view stakeholder profiles, engagement activities, and collaboration opportunities.",
+      suggestions: ['View Stakeholders', 'Engagement Activities', 'Submit Feedback', 'Partnership Requests']
+    };
+  }
+
+  // International cooperation
+  if (message.includes('international') || message.includes('global') || message.includes('cooperation')) {
+    return {
+      text: "The International Cooperation Hub showcases 128 active projects with 45 international partners, $2.45B in funding, and opportunities for global collaboration. You can explore funding opportunities and connect with international experts.",
+      suggestions: ['View Partners', 'Funding Opportunities', 'International Projects', 'Expert Network']
+    };
+  }
+
+  // Data and transparency
+  if (message.includes('data') || message.includes('transparency') || message.includes('open data')) {
+    return {
+      text: "The Public Transparency Portal provides access to 6 open datasets, 1,248 public documents, budget transparency reports, and citizen feedback mechanisms. All data is freely accessible and downloadable.",
+      suggestions: ['Open Datasets', 'Budget Transparency', 'Submit Feedback', 'Public Reports']
+    };
+  }
+
+  // Learning and resources
+  if (message.includes('learn') || message.includes('course') || message.includes('training') || message.includes('resource')) {
+    return {
+      text: "The Knowledge & Learning Center offers 156 courses, 892 articles, 324 videos, and 145 webinars on SDG implementation, policy design, and best practices. You can enroll in courses and earn certificates.",
+      suggestions: ['Browse Courses', 'View Articles', 'Watch Videos', 'Upcoming Webinars']
+    };
+  }
+
+  // Implementation toolkit
+  if (message.includes('toolkit') || message.includes('template') || message.includes('guide') || message.includes('implement')) {
+    return {
+      text: "The Implementation Toolkit provides 156 resources including templates, step-by-step guides, interactive tools, and case studies to help you design, implement, and monitor policies effectively.",
+      suggestions: ['Browse Templates', 'Implementation Guides', 'Interactive Tools', 'Case Studies']
+    };
+  }
+
+  // Help and support
+  if (message.includes('help') || message.includes('support') || message.includes('how to') || message.includes('guide')) {
+    return {
+      text: "I'm here to help! You can ask me about SDG goals, policies, stakeholders, international cooperation, data access, learning resources, or any feature of the SDG Hub platform. What would you like to know?",
+      suggestions: ['Platform Overview', 'Getting Started', 'Contact Support', 'FAQ']
+    };
+  }
+
+  // Default response
+  return {
+    text: "I understand you're asking about '" + message + "'. Could you please provide more details or choose from these options? I can help you navigate the SDG Hub platform and find the information you need.",
+    suggestions: ['View Dashboard', 'SDG Progress', 'Policies', 'Stakeholders', 'Help']
+  };
+}
