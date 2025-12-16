Index: src/server/api/implementation-toolkit/GET.ts
===================================================================
--- src/server/api/implementation-toolkit/GET.ts	original
+++ src/server/api/implementation-toolkit/GET.ts	modified
@@ -1,450 +1,60 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { resources } from '../../../db/schema.js';
+import { desc, eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    // In production, fetch from database
-    // For now, return comprehensive implementation toolkit data
-    const toolkitData = {
-      overview: {
-        totalResources: 156,
-        templates: 42,
-        guides: 38,
-        tools: 28,
-        caseStudies: 48,
-        lastUpdated: new Date().toISOString(),
+    // Fetch all resources from database
+    const resourcesData = await db.select()
+      .from(resources)
+      .where(eq(resources.status, 'published'))
+      .orderBy(desc(resources.createdAt));
+
+    // Calculate statistics
+    const stats = {
+      totalResources: resourcesData.length,
+      totalDownloads: resourcesData.reduce((sum, r) => sum + (r.downloads || 0), 0),
+      byCategory: {
+        templates: resourcesData.filter(r => r.category === 'Template').length,
+        guides: resourcesData.filter(r => r.category === 'Guide').length,
+        toolkits: resourcesData.filter(r => r.category === 'Toolkit').length,
+        frameworks: resourcesData.filter(r => r.category === 'Framework').length,
+        checklists: resourcesData.filter(r => r.category === 'Checklist').length
       },
+      bySDG: resourcesData.reduce((acc, r) => {
+        if (r.sdgs && Array.isArray(r.sdgs)) {
+          r.sdgs.forEach((sdg: string) => {
+            acc[sdg] = (acc[sdg] || 0) + 1;
+          });
+        }
+        return acc;
+      }, {} as Record<string, number>)
+    };
 
-      categories: [
-        {
-          id: 1,
-          name: 'Policy Design',
-          icon: 'FileText',
-          description: 'Templates and frameworks for designing effective policies',
-          resourceCount: 28,
-          color: 'blue',
-          resources: [
-            {
-              id: 1,
-              title: 'Policy Design Framework Template',
-              type: 'template',
-              format: 'PDF',
-              size: '2.4 MB',
-              downloads: 1247,
-              rating: 4.8,
-              description: 'Comprehensive framework for designing evidence-based policies aligned with SDG goals',
-              sdgs: ['SDG 1', 'SDG 4', 'SDG 8'],
-              lastUpdated: '2024-11-15',
-              author: 'Policy Lab Team',
-            },
-            {
-              id: 2,
-              title: 'Stakeholder Analysis Worksheet',
-              type: 'template',
-              format: 'Excel',
-              size: '1.2 MB',
-              downloads: 892,
-              rating: 4.6,
-              description: 'Identify and analyze key stakeholders for policy implementation',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-10-22',
-              author: 'Engagement Team',
-            },
-            {
-              id: 3,
-              title: 'Theory of Change Template',
-              type: 'template',
-              format: 'PowerPoint',
-              size: '3.1 MB',
-              downloads: 1056,
-              rating: 4.9,
-              description: 'Map out the causal pathway from inputs to long-term outcomes',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-12-01',
-              author: 'M&E Department',
-            },
-          ],
-        },
-        {
-          id: 2,
-          name: 'Implementation Planning',
-          icon: 'Calendar',
-          description: 'Tools for planning and scheduling policy implementation',
-          resourceCount: 35,
-          color: 'green',
-          resources: [
-            {
-              id: 4,
-              title: 'Implementation Roadmap Template',
-              type: 'template',
-              format: 'Excel',
-              size: '1.8 MB',
-              downloads: 1534,
-              rating: 4.7,
-              description: 'Create detailed timelines and milestones for policy rollout',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-11-28',
-              author: 'Project Management Office',
-            },
-            {
-              id: 5,
-              title: 'Resource Allocation Calculator',
-              type: 'tool',
-              format: 'Excel',
-              size: '2.2 MB',
-              downloads: 967,
-              rating: 4.5,
-              description: 'Optimize budget and resource distribution across policy activities',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-10-15',
-              author: 'Finance Team',
-            },
-            {
-              id: 6,
-              title: 'Risk Management Framework',
-              type: 'guide',
-              format: 'PDF',
-              size: '3.5 MB',
-              downloads: 1123,
-              rating: 4.8,
-              description: 'Identify, assess, and mitigate implementation risks',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-11-10',
-              author: 'Risk Management Unit',
-            },
-          ],
-        },
-        {
-          id: 3,
-          name: 'Monitoring & Evaluation',
-          icon: 'BarChart',
-          description: 'M&E frameworks and data collection tools',
-          resourceCount: 32,
-          color: 'purple',
-          resources: [
-            {
-              id: 7,
-              title: 'KPI Dashboard Template',
-              type: 'template',
-              format: 'Excel',
-              size: '2.8 MB',
-              downloads: 1678,
-              rating: 4.9,
-              description: 'Track key performance indicators with automated visualizations',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-12-05',
-              author: 'M&E Team',
-            },
-            {
-              id: 8,
-              title: 'Impact Assessment Guide',
-              type: 'guide',
-              format: 'PDF',
-              size: '4.2 MB',
-              downloads: 1345,
-              rating: 4.7,
-              description: 'Comprehensive methodology for measuring policy impact',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-11-20',
-              author: 'Research Department',
-            },
-            {
-              id: 9,
-              title: 'Data Collection Forms',
-              type: 'template',
-              format: 'Word',
-              size: '1.5 MB',
-              downloads: 1089,
-              rating: 4.6,
-              description: 'Standardized forms for collecting monitoring data',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-10-30',
-              author: 'Data Team',
-            },
-          ],
-        },
-        {
-          id: 4,
-          name: 'Stakeholder Engagement',
-          icon: 'Users',
-          description: 'Resources for engaging stakeholders effectively',
-          resourceCount: 24,
-          color: 'orange',
-          resources: [
-            {
-              id: 10,
-              title: 'Consultation Workshop Guide',
-              type: 'guide',
-              format: 'PDF',
-              size: '2.9 MB',
-              downloads: 876,
-              rating: 4.8,
-              description: 'Step-by-step guide for conducting effective stakeholder consultations',
-              sdgs: ['SDG 16', 'SDG 17'],
-              lastUpdated: '2024-11-12',
-              author: 'Engagement Team',
-            },
-            {
-              id: 11,
-              title: 'Communication Strategy Template',
-              type: 'template',
-              format: 'PowerPoint',
-              size: '3.3 MB',
-              downloads: 1234,
-              rating: 4.7,
-              description: 'Develop comprehensive communication plans for policy rollout',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-12-08',
-              author: 'Communications Office',
-            },
-            {
-              id: 12,
-              title: 'Feedback Collection Tool',
-              type: 'tool',
-              format: 'Excel',
-              size: '1.7 MB',
-              downloads: 945,
-              rating: 4.5,
-              description: 'Gather and analyze stakeholder feedback systematically',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-10-25',
-              author: 'Engagement Team',
-            },
-          ],
-        },
-        {
-          id: 5,
-          name: 'Budget & Finance',
-          icon: 'DollarSign',
-          description: 'Financial planning and budget management tools',
-          resourceCount: 19,
-          color: 'red',
-          resources: [
-            {
-              id: 13,
-              title: 'Budget Planning Template',
-              type: 'template',
-              format: 'Excel',
-              size: '2.1 MB',
-              downloads: 1456,
-              rating: 4.9,
-              description: 'Create detailed budgets with automatic calculations and forecasts',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-11-30',
-              author: 'Finance Department',
-            },
-            {
-              id: 14,
-              title: 'Cost-Benefit Analysis Tool',
-              type: 'tool',
-              format: 'Excel',
-              size: '2.5 MB',
-              downloads: 1178,
-              rating: 4.8,
-              description: 'Evaluate economic viability of policy interventions',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-11-18',
-              author: 'Economic Analysis Unit',
-            },
-            {
-              id: 15,
-              title: 'Financial Reporting Framework',
-              type: 'guide',
-              format: 'PDF',
-              size: '3.8 MB',
-              downloads: 823,
-              rating: 4.6,
-              description: 'Standards and templates for financial reporting',
-              sdgs: ['All SDGs'],
-              lastUpdated: '2024-10-20',
-              author: 'Audit Team',
-            },
-          ],
-        },
-        {
-          id: 6,
-          name: 'Case Studies',
-          icon: 'BookOpen',
-          description: 'Real-world examples of successful policy implementation',
-          resourceCount: 18,
-          color: 'teal',
-          resources: [
-            {
-              id: 16,
-              title: 'Education Reform Success Story',
-              type: 'case-study',
-              format: 'PDF',
-              size: '4.5 MB',
-              downloads: 1567,
-              rating: 4.9,
-              description: 'How Singapore achieved universal quality education',
-              sdgs: ['SDG 4'],
-              lastUpdated: '2024-12-10',
-              author: 'Best Practices Team',
-            },
-            {
-              id: 17,
-              title: 'Renewable Energy Transition',
-              type: 'case-study',
-              format: 'PDF',
-              size: '5.2 MB',
-              downloads: 1423,
-              rating: 4.8,
-              description: 'Denmark\'s journey to 100% renewable energy',
-              sdgs: ['SDG 7', 'SDG 13'],
-              lastUpdated: '2024-11-25',
-              author: 'International Team',
-            },
-            {
-              id: 18,
-              title: 'Poverty Reduction Program',
-              type: 'case-study',
-              format: 'PDF',
-              size: '3.9 MB',
-              downloads: 1289,
-              rating: 4.7,
-              description: 'Brazil\'s Bolsa Família conditional cash transfer program',
-              sdgs: ['SDG 1', 'SDG 2'],
-              lastUpdated: '2024-11-05',
-              author: 'Social Policy Unit',
-            },
-          ],
-        },
-      ],
+    // Get featured resources (most downloaded)
+    const featuredResources = [...resourcesData]
+      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
+      .slice(0, 6);
 
-      guides: [
-        {
-          id: 1,
-          title: 'Complete Policy Implementation Guide',
-          description: 'End-to-end guide covering all phases of policy implementation',
-          chapters: 12,
-          pages: 156,
-          duration: '8 hours',
-          difficulty: 'Intermediate',
-          rating: 4.9,
-          downloads: 2345,
-        },
-        {
-          id: 2,
-          title: 'SDG Integration Handbook',
-          description: 'How to align policies with Sustainable Development Goals',
-          chapters: 8,
-          pages: 98,
-          duration: '5 hours',
-          difficulty: 'Beginner',
-          rating: 4.8,
-          downloads: 1987,
-        },
-        {
-          id: 3,
-          title: 'Data-Driven Decision Making',
-          description: 'Using evidence and analytics for policy decisions',
-          chapters: 10,
-          pages: 124,
-          duration: '6 hours',
-          difficulty: 'Advanced',
-          rating: 4.7,
-          downloads: 1654,
-        },
-      ],
+    // Get recent resources
+    const recentResources = resourcesData.slice(0, 6);
 
-      tools: [
-        {
-          id: 1,
-          name: 'Policy Impact Calculator',
-          description: 'Estimate the potential impact of policy interventions',
-          type: 'Calculator',
-          platform: 'Web',
-          status: 'active',
-          users: 3456,
-        },
-        {
-          id: 2,
-          name: 'Stakeholder Mapping Tool',
-          description: 'Visualize stakeholder relationships and influence',
-          type: 'Visualization',
-          platform: 'Web',
-          status: 'active',
-          users: 2789,
-        },
-        {
-          id: 3,
-          name: 'Budget Optimizer',
-          description: 'Optimize resource allocation across activities',
-          type: 'Optimization',
-          platform: 'Excel',
-          status: 'active',
-          users: 2134,
-        },
-      ],
-
-      recentDownloads: [
-        {
-          id: 1,
-          resource: 'KPI Dashboard Template',
-          user: 'Ministry of Education',
-          timestamp: '2024-12-16T10:30:00Z',
-          category: 'Monitoring & Evaluation',
-        },
-        {
-          id: 2,
-          resource: 'Implementation Roadmap Template',
-          user: 'Ministry of Health',
-          timestamp: '2024-12-16T09:15:00Z',
-          category: 'Implementation Planning',
-        },
-        {
-          id: 3,
-          resource: 'Education Reform Success Story',
-          user: 'Policy Lab',
-          timestamp: '2024-12-15T16:45:00Z',
-          category: 'Case Studies',
-        },
-      ],
-
-      popularResources: [
-        { name: 'KPI Dashboard Template', downloads: 1678, trend: 'up' },
-        { name: 'Education Reform Success Story', downloads: 1567, trend: 'up' },
-        { name: 'Implementation Roadmap Template', downloads: 1534, trend: 'stable' },
-        { name: 'Budget Planning Template', downloads: 1456, trend: 'up' },
-        { name: 'Renewable Energy Transition', downloads: 1423, trend: 'stable' },
-      ],
-
-      recommendations: [
-        {
-          title: 'Start with Policy Design Framework',
-          description: 'Begin your implementation journey with our comprehensive policy design template',
-          resourceId: 1,
-          category: 'Policy Design',
-          priority: 'high',
-        },
-        {
-          title: 'Learn from Success Stories',
-          description: 'Review case studies from countries that achieved similar goals',
-          resourceId: 16,
-          category: 'Case Studies',
-          priority: 'high',
-        },
-        {
-          title: 'Set Up Monitoring Early',
-          description: 'Implement KPI tracking from day one for better outcomes',
-          resourceId: 7,
-          category: 'Monitoring & Evaluation',
-          priority: 'medium',
-        },
-      ],
-    };
-
-    return res.status(200).json({
+    res.json({
       success: true,
-      data: toolkitData,
-      timestamp: new Date().toISOString(),
+      data: {
+        stats,
+        resources: resourcesData,
+        featured: featuredResources,
+        recent: recentResources
+      }
     });
   } catch (error) {
-    console.error('Implementation toolkit error:', error);
-    return res.status(500).json({
+    console.error('Implementation Toolkit API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to fetch implementation toolkit data',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
