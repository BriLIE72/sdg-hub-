Index: src/server/api/knowledge-center/GET.ts
===================================================================
--- src/server/api/knowledge-center/GET.ts	original
+++ src/server/api/knowledge-center/GET.ts	modified
@@ -1,419 +1,70 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { courses, articles, videos, webinars, researchPapers } from '../../../db/schema.js';
+import { desc, eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    // In production, fetch from database
-    // For now, return comprehensive knowledge center data
-    const knowledgeData = {
-      overview: {
-        totalResources: 1847,
-        courses: 156,
-        articles: 892,
-        videos: 324,
-        webinars: 145,
-        researchPapers: 330,
-        activeUsers: 12450,
-        completionRate: 78,
-        lastUpdated: new Date().toISOString(),
-      },
+    // Fetch all learning resources from database
+    const [
+      coursesData,
+      articlesData,
+      videosData,
+      webinarsData,
+      researchPapersData
+    ] = await Promise.all([
+      db.select().from(courses).where(eq(courses.status, 'published')).orderBy(desc(courses.createdAt)),
+      db.select().from(articles).where(eq(articles.status, 'published')).orderBy(desc(articles.publishedAt)),
+      db.select().from(videos).where(eq(videos.status, 'published')).orderBy(desc(videos.publishedAt)),
+      db.select().from(webinars).where(eq(webinars.status, 'published')).orderBy(desc(webinars.scheduledAt)),
+      db.select().from(researchPapers).where(eq(researchPapers.status, 'published')).orderBy(desc(researchPapers.publishedAt))
+    ]);
 
-      featuredCourses: [
-        {
-          id: 1,
-          title: 'SDG Implementation Fundamentals',
-          description:
-            'Comprehensive introduction to implementing Sustainable Development Goals in government policy.',
-          instructor: 'Dr. Sarah Johnson',
-          duration: '8 weeks',
-          level: 'Beginner',
-          enrolled: 2450,
-          rating: 4.8,
-          reviews: 342,
-          modules: 12,
-          hours: 24,
-          certificate: true,
-          sdgs: ['SDG 1', 'SDG 2', 'SDG 3', 'SDG 4'],
-          thumbnail: '/images/courses/sdg-fundamentals.jpg',
-          price: 'Free',
-          startDate: '2025-01-15',
-          language: 'English',
-          subtitles: ['English', 'Spanish', 'French'],
-        },
-        {
-          id: 2,
-          title: 'Climate Action Policy Design',
-          description:
-            'Advanced strategies for designing and implementing climate action policies aligned with SDG 13.',
-          instructor: 'Prof. Michael Chen',
-          duration: '6 weeks',
-          level: 'Advanced',
-          enrolled: 1820,
-          rating: 4.9,
-          reviews: 256,
-          modules: 10,
-          hours: 18,
-          certificate: true,
-          sdgs: ['SDG 13', 'SDG 7', 'SDG 11'],
-          thumbnail: '/images/courses/climate-action.jpg',
-          price: 'Free',
-          startDate: '2025-02-01',
-          language: 'English',
-          subtitles: ['English', 'Spanish', 'French', 'Arabic'],
-        },
-        {
-          id: 3,
-          title: 'Gender Equality in Policy Making',
-          description:
-            'Learn how to integrate gender perspectives into policy design and implementation.',
-          instructor: 'Dr. Emily Rodriguez',
-          duration: '4 weeks',
-          level: 'Intermediate',
-          enrolled: 1650,
-          rating: 4.7,
-          reviews: 198,
-          modules: 8,
-          hours: 12,
-          certificate: true,
-          sdgs: ['SDG 5', 'SDG 10'],
-          thumbnail: '/images/courses/gender-equality.jpg',
-          price: 'Free',
-          startDate: '2025-01-20',
-          language: 'English',
-          subtitles: ['English', 'Spanish', 'French'],
-        },
-        {
-          id: 4,
-          title: 'Data-Driven Policy Monitoring',
-          description:
-            'Master the use of data analytics and visualization for effective policy monitoring and evaluation.',
-          instructor: 'Dr. David Thompson',
-          duration: '5 weeks',
-          level: 'Intermediate',
-          enrolled: 1420,
-          rating: 4.6,
-          reviews: 167,
-          modules: 9,
-          hours: 15,
-          certificate: true,
-          sdgs: ['SDG 16', 'SDG 17'],
-          thumbnail: '/images/courses/data-monitoring.jpg',
-          price: 'Free',
-          startDate: '2025-02-10',
-          language: 'English',
-          subtitles: ['English', 'Spanish'],
-        },
-      ],
+    // Calculate statistics
+    const stats = {
+      totalCourses: coursesData.length,
+      totalArticles: articlesData.length,
+      totalVideos: videosData.length,
+      totalWebinars: webinarsData.length,
+      totalResearchPapers: researchPapersData.length,
+      totalResources: coursesData.length + articlesData.length + videosData.length + webinarsData.length + researchPapersData.length
+    };
 
-      articles: [
-        {
-          id: 1,
-          title: 'Best Practices in SDG Localization',
-          author: 'Dr. Sarah Johnson',
-          category: 'Policy Implementation',
-          readTime: 12,
-          views: 8450,
-          likes: 342,
-          publishedDate: '2024-12-10',
-          sdgs: ['SDG 11', 'SDG 16', 'SDG 17'],
-          excerpt:
-            'Explore proven strategies for adapting global SDG targets to local contexts and ensuring effective implementation at the municipal level.',
-          featured: true,
-        },
-        {
-          id: 2,
-          title: 'Financing Sustainable Development: Innovative Approaches',
-          author: 'Prof. Michael Chen',
-          category: 'Finance & Budget',
-          readTime: 15,
-          views: 7230,
-          likes: 298,
-          publishedDate: '2024-12-08',
-          sdgs: ['SDG 17', 'SDG 8'],
-          excerpt:
-            'Discover innovative financing mechanisms including green bonds, impact investing, and public-private partnerships for SDG achievement.',
-          featured: true,
-        },
-        {
-          id: 3,
-          title: 'Stakeholder Engagement in Policy Design',
-          author: 'Dr. Emily Rodriguez',
-          category: 'Stakeholder Engagement',
-          readTime: 10,
-          views: 6890,
-          likes: 267,
-          publishedDate: '2024-12-05',
-          sdgs: ['SDG 16', 'SDG 17'],
-          excerpt:
-            'Learn effective methods for engaging diverse stakeholders in the policy design process to ensure inclusive and sustainable outcomes.',
-          featured: false,
-        },
-        {
-          id: 4,
-          title: 'Measuring SDG Progress: Key Indicators',
-          author: 'Dr. Lisa Wang',
-          category: 'Monitoring & Evaluation',
-          readTime: 18,
-          views: 5670,
-          likes: 234,
-          publishedDate: '2024-12-01',
-          sdgs: ['SDG 17'],
-          excerpt:
-            'Comprehensive guide to selecting, tracking, and reporting on key performance indicators for SDG monitoring and evaluation.',
-          featured: false,
-        },
-        {
-          id: 5,
-          title: 'Climate Adaptation Strategies for Cities',
-          author: 'Eng. David Thompson',
-          category: 'Climate Action',
-          readTime: 14,
-          views: 5420,
-          likes: 221,
-          publishedDate: '2024-11-28',
-          sdgs: ['SDG 11', 'SDG 13'],
-          excerpt:
-            'Practical strategies for urban climate adaptation including green infrastructure, resilient design, and community preparedness.',
-          featured: false,
-        },
-      ],
+    // Get featured content (highest rated or most enrolled)
+    const featuredCourses = coursesData
+      .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
+      .slice(0, 3);
 
-      videos: [
-        {
-          id: 1,
-          title: 'Introduction to SDG Framework',
-          presenter: 'UN SDG Team',
-          duration: '15:30',
-          views: 45600,
-          likes: 1820,
-          category: 'Fundamentals',
-          publishedDate: '2024-11-15',
-          sdgs: ['All SDGs'],
-          thumbnail: '/images/videos/sdg-intro.jpg',
-          description:
-            'Comprehensive overview of the 17 Sustainable Development Goals and their interconnections.',
-        },
-        {
-          id: 2,
-          title: 'Policy Lab Walkthrough',
-          presenter: 'Dr. Sarah Johnson',
-          duration: '22:45',
-          views: 32400,
-          likes: 1340,
-          category: 'Tools & Platforms',
-          publishedDate: '2024-11-20',
-          sdgs: ['SDG 16', 'SDG 17'],
-          thumbnail: '/images/videos/policy-lab.jpg',
-          description: 'Step-by-step guide to using the Policy Lab for collaborative policy design.',
-        },
-        {
-          id: 3,
-          title: 'Stakeholder Mapping Techniques',
-          presenter: 'Prof. Michael Chen',
-          duration: '18:20',
-          views: 28900,
-          likes: 1120,
-          category: 'Stakeholder Engagement',
-          publishedDate: '2024-11-25',
-          sdgs: ['SDG 16', 'SDG 17'],
-          thumbnail: '/images/videos/stakeholder-mapping.jpg',
-          description:
-            'Learn how to identify, analyze, and engage stakeholders effectively in policy processes.',
-        },
-        {
-          id: 4,
-          title: 'Budget Allocation for SDGs',
-          presenter: 'Dr. Emily Rodriguez',
-          duration: '25:10',
-          views: 24500,
-          likes: 980,
-          category: 'Finance & Budget',
-          publishedDate: '2024-12-01',
-          sdgs: ['SDG 17'],
-          thumbnail: '/images/videos/budget-allocation.jpg',
-          description:
-            'Strategies for aligning national budgets with SDG priorities and tracking expenditure.',
-        },
-      ],
+    const featuredArticles = articlesData
+      .sort((a, b) => (b.views || 0) - (a.views || 0))
+      .slice(0, 3);
 
-      webinars: [
-        {
-          id: 1,
-          title: 'Future of Sustainable Cities',
-          host: 'UN-Habitat',
-          date: '2025-01-25',
-          time: '14:00 UTC',
-          duration: '90 minutes',
-          registered: 3450,
-          capacity: 5000,
-          status: 'upcoming',
-          speakers: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Eng. David Thompson'],
-          sdgs: ['SDG 11', 'SDG 13'],
-          description:
-            'Expert panel discussion on innovative approaches to building sustainable, resilient cities.',
-          registrationLink: '/register/webinar/1',
-        },
-        {
-          id: 2,
-          title: 'Gender-Responsive Budgeting',
-          host: 'UN Women',
-          date: '2025-02-05',
-          time: '15:00 UTC',
-          duration: '120 minutes',
-          registered: 2890,
-          capacity: 4000,
-          status: 'upcoming',
-          speakers: ['Dr. Emily Rodriguez', 'Dr. Lisa Wang'],
-          sdgs: ['SDG 5', 'SDG 10'],
-          description:
-            'Workshop on integrating gender perspectives into budget planning and allocation.',
-          registrationLink: '/register/webinar/2',
-        },
-        {
-          id: 3,
-          title: 'Climate Finance Mechanisms',
-          host: 'UNDP',
-          date: '2024-12-10',
-          time: '13:00 UTC',
-          duration: '90 minutes',
-          registered: 4200,
-          capacity: 5000,
-          status: 'completed',
-          speakers: ['Prof. Michael Chen', 'Dr. David Thompson'],
-          sdgs: ['SDG 13', 'SDG 17'],
-          description:
-            'Overview of climate finance instruments and accessing international funding.',
-          recordingLink: '/recordings/webinar/3',
-        },
-      ],
+    const upcomingWebinars = webinarsData
+      .filter(w => w.scheduledAt && new Date(w.scheduledAt) > new Date())
+      .slice(0, 3);
 
-      researchPapers: [
-        {
-          id: 1,
-          title: 'Impact of Digital Transformation on SDG Achievement',
-          authors: ['Dr. Lisa Wang', 'Prof. Michael Chen'],
-          institution: 'Global Policy Institute',
-          publishedDate: '2024-11-01',
-          pages: 45,
-          citations: 128,
-          sdgs: ['SDG 9', 'SDG 17'],
-          abstract:
-            'This paper examines how digital technologies are accelerating progress toward the Sustainable Development Goals, with case studies from 15 countries.',
-          downloadLink: '/papers/digital-transformation-sdg.pdf',
-          category: 'Technology & Innovation',
-        },
-        {
-          id: 2,
-          title: 'Multi-Stakeholder Partnerships for SDG Implementation',
-          authors: ['Dr. Sarah Johnson', 'Dr. Emily Rodriguez'],
-          institution: 'International Development Research Center',
-          publishedDate: '2024-10-15',
-          pages: 62,
-          citations: 94,
-          sdgs: ['SDG 17'],
-          abstract:
-            'Analysis of successful multi-stakeholder partnerships and their contribution to SDG implementation across different sectors.',
-          downloadLink: '/papers/multi-stakeholder-partnerships.pdf',
-          category: 'Partnerships & Collaboration',
-        },
-        {
-          id: 3,
-          title: 'Climate Adaptation in Small Island Developing States',
-          authors: ['Eng. David Thompson', 'Dr. Michael Chen'],
-          institution: 'Climate Research Institute',
-          publishedDate: '2024-09-20',
-          pages: 38,
-          citations: 76,
-          sdgs: ['SDG 13', 'SDG 14'],
-          abstract:
-            'Comprehensive study of climate adaptation strategies in SIDS, including policy recommendations and best practices.',
-          downloadLink: '/papers/climate-adaptation-sids.pdf',
-          category: 'Climate Action',
-        },
-      ],
-
-      learningPaths: [
-        {
-          id: 1,
-          title: 'SDG Policy Practitioner',
-          description: 'Complete learning path for policy professionals working on SDG implementation',
-          courses: 8,
-          duration: '6 months',
-          level: 'Intermediate to Advanced',
-          enrolled: 1240,
-          completion: 68,
-          certificate: true,
-        },
-        {
-          id: 2,
-          title: 'Climate Action Specialist',
-          description: 'Specialized track focusing on climate policy and SDG 13 implementation',
-          courses: 6,
-          duration: '4 months',
-          level: 'Advanced',
-          enrolled: 890,
-          completion: 72,
-          certificate: true,
-        },
-        {
-          id: 3,
-          title: 'Stakeholder Engagement Expert',
-          description: 'Master the art of engaging diverse stakeholders in policy processes',
-          courses: 5,
-          duration: '3 months',
-          level: 'Intermediate',
-          enrolled: 1120,
-          completion: 75,
-          certificate: true,
-        },
-      ],
-
-      categories: [
-        { name: 'Policy Implementation', count: 245, icon: 'target' },
-        { name: 'Climate Action', count: 189, icon: 'cloud' },
-        { name: 'Stakeholder Engagement', count: 167, icon: 'users' },
-        { name: 'Monitoring & Evaluation', count: 156, icon: 'chart' },
-        { name: 'Finance & Budget', count: 134, icon: 'dollar' },
-        { name: 'Technology & Innovation', count: 128, icon: 'zap' },
-        { name: 'Gender Equality', count: 112, icon: 'heart' },
-        { name: 'Partnerships & Collaboration', count: 98, icon: 'network' },
-      ],
-
-      insights: [
-        {
-          type: 'trending',
-          title: 'Climate Action Resources Most Popular',
-          description:
-            'Climate action courses and articles have seen 45% increase in engagement this month.',
-          priority: 'high',
-        },
-        {
-          type: 'recommendation',
-          title: 'New Course: Data-Driven Policy Monitoring',
-          description:
-            'Based on your interests, we recommend enrolling in our new data analytics course.',
-          priority: 'medium',
-        },
-        {
-          type: 'achievement',
-          title: '10,000+ Active Learners Milestone',
-          description:
-            'The Knowledge Center community has reached 10,000 active learners this quarter.',
-          priority: 'low',
-        },
-      ],
-    };
-
-    return res.status(200).json({
+    res.json({
       success: true,
-      data: knowledgeData,
-      timestamp: new Date().toISOString(),
+      data: {
+        stats,
+        courses: coursesData,
+        articles: articlesData,
+        videos: videosData,
+        webinars: webinarsData,
+        researchPapers: researchPapersData,
+        featured: {
+          courses: featuredCourses,
+          articles: featuredArticles,
+          webinars: upcomingWebinars
+        }
+      }
     });
   } catch (error) {
-    console.error('Knowledge center data error:', error);
-    return res.status(500).json({
+    console.error('Knowledge Center API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to fetch knowledge center data',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
