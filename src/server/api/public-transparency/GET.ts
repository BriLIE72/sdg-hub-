Index: src/server/api/public-transparency/GET.ts
===================================================================
--- src/server/api/public-transparency/GET.ts	original
+++ src/server/api/public-transparency/GET.ts	modified
@@ -1,306 +1,66 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { publicDocuments, datasets, citizenFeedback, policies } from '../../../db/schema.js';
+import { desc, eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    // In production, fetch from database
-    // For now, return comprehensive public transparency data
-    const transparencyData = {
-      overview: {
-        totalPolicies: 47,
-        publicDocuments: 1248,
-        budgetDisclosed: 98.5,
-        citizenReports: 3456,
-        lastUpdated: new Date().toISOString(),
-      },
+    // Fetch all public transparency data from database
+    const [
+      documentsData,
+      datasetsData,
+      feedbackData,
+      policiesData
+    ] = await Promise.all([
+      db.select().from(publicDocuments).where(eq(publicDocuments.status, 'published')).orderBy(desc(publicDocuments.publishedAt)),
+      db.select().from(datasets).where(eq(datasets.status, 'published')).orderBy(desc(datasets.publishedAt)),
+      db.select().from(citizenFeedback).where(eq(citizenFeedback.status, 'published')).orderBy(desc(citizenFeedback.createdAt)),
+      db.select().from(policies).where(eq(policies.status, 'active')).orderBy(desc(policies.createdAt))
+    ]);
 
-      openData: [
-        {
-          id: 1,
-          category: 'Budget & Finance',
-          title: 'National Budget 2024',
-          description: 'Complete breakdown of government budget allocation across all ministries and programs',
-          format: 'CSV, JSON, PDF',
-          size: '45 MB',
-          downloads: 12456,
-          lastUpdated: '2024-01-15',
-          url: '/data/budget-2024.csv',
-          views: 45678,
-          rating: 4.7,
-        },
-        {
-          id: 2,
-          category: 'SDG Progress',
-          title: 'SDG Performance Metrics',
-          description: 'Real-time data on all 17 SDG indicators with quarterly updates',
-          format: 'JSON, Excel',
-          size: '12 MB',
-          downloads: 8934,
-          lastUpdated: '2024-12-01',
-          url: '/data/sdg-metrics.json',
-          views: 34567,
-          rating: 4.8,
-        },
-        {
-          id: 3,
-          category: 'Policy Documents',
-          title: 'Education Reform Policy',
-          description: 'Full policy document including implementation plan and budget allocation',
-          format: 'PDF',
-          size: '8 MB',
-          downloads: 15678,
-          lastUpdated: '2023-06-20',
-          url: '/data/education-reform.pdf',
-          views: 56789,
-          rating: 4.6,
-        },
-        {
-          id: 4,
-          category: 'Procurement',
-          title: 'Government Contracts 2024',
-          description: 'All government procurement contracts with vendor details and amounts',
-          format: 'CSV, Excel',
-          size: '28 MB',
-          downloads: 6789,
-          lastUpdated: '2024-11-30',
-          url: '/data/contracts-2024.csv',
-          views: 23456,
-          rating: 4.5,
-        },
-        {
-          id: 5,
-          category: 'Healthcare',
-          title: 'Hospital Performance Data',
-          description: 'Patient outcomes, wait times, and quality metrics for all public hospitals',
-          format: 'JSON, CSV',
-          size: '18 MB',
-          downloads: 9876,
-          lastUpdated: '2024-12-10',
-          url: '/data/hospital-performance.json',
-          views: 38901,
-          rating: 4.9,
-        },
-        {
-          id: 6,
-          category: 'Environment',
-          title: 'Air Quality Monitoring',
-          description: 'Real-time air quality data from 150+ monitoring stations nationwide',
-          format: 'JSON, API',
-          size: '5 MB',
-          downloads: 11234,
-          lastUpdated: '2024-12-16',
-          url: '/data/air-quality.json',
-          views: 67890,
-          rating: 4.8,
-        },
-      ],
+    // Calculate statistics
+    const stats = {
+      totalDocuments: documentsData.length,
+      totalDatasets: datasetsData.length,
+      totalFeedback: feedbackData.length,
+      totalPolicies: policiesData.length,
+      totalDownloads: documentsData.reduce((sum, d) => sum + (d.downloads || 0), 0) + 
+                      datasetsData.reduce((sum, d) => sum + (d.downloads || 0), 0),
+      averageRating: feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedbackData.length || 1)
+    };
 
-      budgetTransparency: {
-        totalBudget: 1250000000,
-        allocated: 1225000000,
-        spent: 892500000,
-        remaining: 332500000,
-        utilizationRate: 72.8,
-        byMinistry: [
-          { ministry: 'Education', budget: 185000000, spent: 142350000, percentage: 76.9 },
-          { ministry: 'Health', budget: 245000000, spent: 200850000, percentage: 82.0 },
-          { ministry: 'Infrastructure', budget: 195000000, spent: 136500000, percentage: 70.0 },
-          { ministry: 'Environment', budget: 125000000, spent: 81250000, percentage: 65.0 },
-          { ministry: 'Energy', budget: 195000000, spent: 146250000, percentage: 75.0 },
-          { ministry: 'Social Welfare', budget: 135000000, spent: 108000000, percentage: 80.0 },
-        ],
-        bySDG: [
-          { sdg: 'SDG 4: Education', budget: 185000000, spent: 142350000 },
-          { sdg: 'SDG 3: Health', budget: 245000000, spent: 200850000 },
-          { sdg: 'SDG 7: Energy', budget: 195000000, spent: 146250000 },
-          { sdg: 'SDG 13: Climate', budget: 125000000, spent: 81250000 },
-        ],
-      },
+    // Get featured content
+    const featuredDocuments = documentsData
+      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
+      .slice(0, 5);
 
-      citizenFeedback: [
-        {
-          id: 1,
-          category: 'Healthcare',
-          title: 'Long wait times at City Hospital',
-          description: 'Emergency room wait times exceeding 4 hours regularly',
-          status: 'under-review',
-          priority: 'high',
-          submittedBy: 'Anonymous',
-          submittedDate: '2024-12-10',
-          votes: 234,
-          responses: 12,
-          ministry: 'Ministry of Health',
-        },
-        {
-          id: 2,
-          category: 'Education',
-          title: 'Need more teachers in rural schools',
-          description: 'Rural schools have teacher-student ratio of 1:45, need more staff',
-          status: 'in-progress',
-          priority: 'high',
-          submittedBy: 'John D.',
-          submittedDate: '2024-12-05',
-          votes: 456,
-          responses: 8,
-          ministry: 'Ministry of Education',
-        },
-        {
-          id: 3,
-          category: 'Infrastructure',
-          title: 'Road repairs needed on Highway 12',
-          description: 'Multiple potholes causing accidents, urgent repairs required',
-          status: 'resolved',
-          priority: 'critical',
-          submittedBy: 'Sarah M.',
-          submittedDate: '2024-11-20',
-          votes: 789,
-          responses: 15,
-          ministry: 'Ministry of Infrastructure',
-          resolution: 'Repairs completed on December 8, 2024',
-        },
-        {
-          id: 4,
-          category: 'Environment',
-          title: 'Illegal dumping in Green Valley',
-          description: 'Industrial waste being dumped near residential area',
-          status: 'under-review',
-          priority: 'critical',
-          submittedBy: 'Community Group',
-          submittedDate: '2024-12-12',
-          votes: 567,
-          responses: 6,
-          ministry: 'Ministry of Environment',
-        },
-      ],
+    const featuredDatasets = datasetsData
+      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
+      .slice(0, 5);
 
-      performanceMetrics: [
-        {
-          ministry: 'Ministry of Education',
-          kpis: [
-            { name: 'School Enrollment Rate', target: 95, current: 87, unit: '%' },
-            { name: 'Teacher Training Completed', target: 5000, current: 3800, unit: 'teachers' },
-            { name: 'Digital Learning Access', target: 80, current: 62, unit: '%' },
-          ],
-          overallProgress: 72,
-        },
-        {
-          ministry: 'Ministry of Health',
-          kpis: [
-            { name: 'Healthcare Coverage', target: 90, current: 78, unit: '%' },
-            { name: 'Vaccination Rate', target: 95, current: 88, unit: '%' },
-            { name: 'Hospital Bed Availability', target: 3.5, current: 2.8, unit: 'per 1000' },
-          ],
-          overallProgress: 82,
-        },
-        {
-          ministry: 'Ministry of Environment',
-          kpis: [
-            { name: 'Carbon Emissions Reduction', target: 40, current: 18, unit: '%' },
-            { name: 'Renewable Energy Share', target: 50, current: 28, unit: '%' },
-            { name: 'Protected Areas', target: 25, current: 19, unit: '%' },
-          ],
-          overallProgress: 55,
-        },
-      ],
+    const recentFeedback = feedbackData.slice(0, 10);
 
-      publicReports: [
-        {
-          id: 1,
-          title: 'Quarterly Performance Report Q4 2024',
-          description: 'Comprehensive review of all government programs and initiatives',
-          category: 'Performance',
-          publishDate: '2024-12-15',
-          pages: 156,
-          downloads: 8934,
-          url: '/reports/q4-2024-performance.pdf',
-        },
-        {
-          id: 2,
-          title: 'Annual Budget Execution Report 2024',
-          description: 'Detailed analysis of budget utilization across all ministries',
-          category: 'Finance',
-          publishDate: '2024-12-01',
-          pages: 234,
-          downloads: 12456,
-          url: '/reports/budget-execution-2024.pdf',
-        },
-        {
-          id: 3,
-          title: 'SDG Progress Assessment 2024',
-          description: 'Annual evaluation of progress toward Sustainable Development Goals',
-          category: 'SDG',
-          publishDate: '2024-11-20',
-          pages: 189,
-          downloads: 15678,
-          url: '/reports/sdg-progress-2024.pdf',
-        },
-      ],
-
-      upcomingEvents: [
-        {
-          id: 1,
-          title: 'Public Budget Consultation',
-          description: 'Town hall meeting to discuss 2025 budget priorities',
-          date: '2025-01-15',
-          time: '14:00',
-          location: 'City Hall',
-          registrations: 234,
-          capacity: 500,
-        },
-        {
-          id: 2,
-          title: 'SDG Progress Town Hall',
-          description: 'Community discussion on SDG achievements and challenges',
-          date: '2025-01-22',
-          time: '18:00',
-          location: 'Community Center',
-          registrations: 156,
-          capacity: 300,
-        },
-        {
-          id: 3,
-          title: 'Open Data Workshop',
-          description: 'Learn how to access and use government open data',
-          date: '2025-02-05',
-          time: '10:00',
-          location: 'Online',
-          registrations: 445,
-          capacity: 1000,
-        },
-      ],
-
-      insights: [
-        {
-          type: 'success',
-          title: 'Budget Transparency Improved',
-          description: 'Budget disclosure rate increased from 85% to 98.5% this year, exceeding international standards.',
-          priority: 'medium',
-        },
-        {
-          type: 'opportunity',
-          title: 'High Citizen Engagement',
-          description: '3,456 citizen reports submitted this year, showing strong public participation. Consider expanding feedback channels.',
-          priority: 'high',
-        },
-        {
-          type: 'warning',
-          title: 'Response Time Delays',
-          description: 'Average response time to citizen feedback is 18 days, above target of 10 days. Need process improvement.',
-          priority: 'high',
-        },
-      ],
-    };
-
-    return res.status(200).json({
+    res.json({
       success: true,
-      data: transparencyData,
-      timestamp: new Date().toISOString(),
+      data: {
+        stats,
+        documents: documentsData,
+        datasets: datasetsData,
+        feedback: feedbackData,
+        policies: policiesData,
+        featured: {
+          documents: featuredDocuments,
+          datasets: featuredDatasets,
+          feedback: recentFeedback
+        }
+      }
     });
   } catch (error) {
-    console.error('Public transparency error:', error);
-    return res.status(500).json({
+    console.error('Public Transparency API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to fetch public transparency data',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
