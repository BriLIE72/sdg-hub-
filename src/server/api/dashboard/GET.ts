Index: src/server/api/dashboard/GET.ts
===================================================================
--- src/server/api/dashboard/GET.ts	original
+++ src/server/api/dashboard/GET.ts	modified
@@ -1,337 +1,317 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../server/db/client.js';
+import { 
+  ministries, 
+  sdgGoals, 
+  policies, 
+  stakeholders,
+  users 
+} from '../../../server/db/schema.js';
+import { sql, desc, eq, and, gte } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    // In production, fetch from database
-    // For now, return comprehensive dashboard analytics data
-    const dashboardData = {
-      overview: {
-        totalPolicies: 342,
-        activePolicies: 156,
-        completedPolicies: 128,
-        pendingPolicies: 58,
-        totalBudget: 1250000000,
-        budgetUtilized: 892000000,
-        budgetUtilizationRate: 71.4,
-        totalStakeholders: 1248,
-        activeStakeholders: 892,
-        totalSDGs: 17,
-        sdgsOnTrack: 12,
-        sdgsAtRisk: 3,
-        sdgsCritical: 2,
-        lastUpdated: new Date().toISOString(),
-      },
+    // Fetch all ministries with their data
+    const ministriesData = await db.select().from(ministries);
 
-      sdgProgress: [
-        { id: 1, name: 'No Poverty', score: 68, target: 85, status: 'at-risk', trend: 'up', change: 2.3 },
-        { id: 2, name: 'Zero Hunger', score: 54, target: 80, status: 'critical', trend: 'down', change: -1.2 },
-        { id: 3, name: 'Good Health', score: 72, target: 85, status: 'on-track', trend: 'up', change: 3.5 },
-        { id: 4, name: 'Quality Education', score: 81, target: 90, status: 'on-track', trend: 'up', change: 4.2 },
-        { id: 5, name: 'Gender Equality', score: 63, target: 85, status: 'at-risk', trend: 'stable', change: 0.5 },
-        { id: 6, name: 'Clean Water', score: 76, target: 90, status: 'on-track', trend: 'up', change: 2.8 },
-        { id: 7, name: 'Clean Energy', score: 58, target: 85, status: 'critical', trend: 'down', change: -0.8 },
-        { id: 8, name: 'Economic Growth', score: 69, target: 80, status: 'on-track', trend: 'up', change: 1.9 },
-        { id: 9, name: 'Innovation', score: 65, target: 85, status: 'at-risk', trend: 'stable', change: 0.3 },
-        { id: 10, name: 'Reduced Inequalities', score: 52, target: 80, status: 'critical', trend: 'down', change: -1.5 },
-        { id: 11, name: 'Sustainable Cities', score: 71, target: 85, status: 'on-track', trend: 'up', change: 2.1 },
-        { id: 12, name: 'Responsible Consumption', score: 59, target: 80, status: 'at-risk', trend: 'stable', change: 0.7 },
-        { id: 13, name: 'Climate Action', score: 48, target: 85, status: 'critical', trend: 'down', change: -2.1 },
-        { id: 14, name: 'Life Below Water', score: 45, target: 80, status: 'critical', trend: 'down', change: -1.8 },
-        { id: 15, name: 'Life on Land', score: 55, target: 80, status: 'at-risk', trend: 'stable', change: 0.4 },
-        { id: 16, name: 'Peace & Justice', score: 67, target: 85, status: 'on-track', trend: 'up', change: 1.6 },
-        { id: 17, name: 'Partnerships', score: 74, target: 90, status: 'on-track', trend: 'up', change: 3.2 },
-      ],
+    // Fetch all SDG goals with progress
+    const sdgGoalsData = await db.select().from(sdgGoals).orderBy(sdgGoals.goalNumber);
 
-      recentPolicies: [
-        {
-          id: 1,
-          title: 'National Renewable Energy Transition Program',
-          sdg: 'SDG 7',
-          status: 'active',
-          progress: 68,
-          budget: 95000000,
-          startDate: '2024-01-15',
-          endDate: '2029-01-15',
-          ministry: 'Ministry of Energy',
-          priority: 'high',
-        },
-        {
-          id: 2,
-          title: 'Universal Healthcare Coverage Initiative',
-          sdg: 'SDG 3',
-          status: 'active',
-          progress: 72,
-          budget: 78000000,
-          startDate: '2023-06-01',
-          endDate: '2028-06-01',
-          ministry: 'Ministry of Health',
-          priority: 'critical',
-        },
-        {
-          id: 3,
-          title: 'Digital Learning Platform Expansion',
-          sdg: 'SDG 4',
-          status: 'active',
-          progress: 85,
-          budget: 25000000,
-          startDate: '2023-09-01',
-          endDate: '2026-09-01',
-          ministry: 'Ministry of Education',
-          priority: 'high',
-        },
-        {
-          id: 4,
-          title: 'Carbon Reduction Strategy',
-          sdg: 'SDG 13',
-          status: 'at-risk',
-          progress: 35,
-          budget: 28000000,
-          startDate: '2024-03-01',
-          endDate: '2030-03-01',
-          ministry: 'Ministry of Environment',
-          priority: 'critical',
-        },
-        {
-          id: 5,
-          title: 'Poverty Reduction Program',
-          sdg: 'SDG 1',
-          status: 'at-risk',
-          progress: 42,
-          budget: 68000000,
-          startDate: '2023-01-01',
-          endDate: '2028-01-01',
-          ministry: 'Ministry of Social Welfare',
-          priority: 'critical',
-        },
-      ],
+    // Fetch recent policies (last 5)
+    const recentPolicies = await db
+      .select()
+      .from(policies)
+      .orderBy(desc(policies.createdAt))
+      .limit(5);
 
-      budgetByMinistry: [
-        { ministry: 'Ministry of Health', allocated: 245000000, utilized: 201000000, utilization: 82, projects: 32, sdgFocus: ['SDG 3', 'SDG 6'], performance: 78 },
-        { ministry: 'Ministry of Education', allocated: 185000000, utilized: 144000000, utilization: 78, projects: 24, sdgFocus: ['SDG 4', 'SDG 8'], performance: 82 },
-        { ministry: 'Ministry of Energy', allocated: 195000000, utilized: 146000000, utilization: 75, projects: 21, sdgFocus: ['SDG 7', 'SDG 13'], performance: 72 },
-        { ministry: 'Ministry of Technology', allocated: 165000000, utilized: 145000000, utilization: 88, projects: 28, sdgFocus: ['SDG 9', 'SDG 4'], performance: 85 },
-        { ministry: 'Ministry of Social Welfare', allocated: 135000000, utilized: 108000000, utilization: 80, projects: 26, sdgFocus: ['SDG 1', 'SDG 10'], performance: 75 },
-        { ministry: 'Ministry of Environment', allocated: 125000000, utilized: 81000000, utilization: 65, projects: 18, sdgFocus: ['SDG 13', 'SDG 15'], performance: 68 },
-        { ministry: 'Ministry of Infrastructure', allocated: 200000000, utilized: 67000000, utilization: 34, projects: 19, sdgFocus: ['SDG 9', 'SDG 11'], performance: 70 },
-        { ministry: 'Ministry of Agriculture', allocated: 155000000, utilized: 118000000, utilization: 76, projects: 22, sdgFocus: ['SDG 2', 'SDG 15'], performance: 73 },
-        { ministry: 'Ministry of Labor', allocated: 98000000, utilized: 82000000, utilization: 84, projects: 17, sdgFocus: ['SDG 8', 'SDG 10'], performance: 79 },
-        { ministry: 'Ministry of Finance', allocated: 112000000, utilized: 95000000, utilization: 85, projects: 15, sdgFocus: ['SDG 8', 'SDG 17'], performance: 81 },
-      ],
+    // Fetch total stakeholders count
+    const stakeholdersCount = await db
+      .select({ count: sql<number>`count(*)` })
+      .from(stakeholders);
 
-      upcomingMilestones: [
-        {
-          id: 1,
-          title: 'Q1 2025 SDG Progress Review',
-          date: '2025-03-31',
-          type: 'review',
-          priority: 'high',
-          description: 'Comprehensive review of all SDG targets and policy performance',
-        },
-        {
-          id: 2,
-          title: 'Renewable Energy Phase 2 Launch',
-          date: '2025-04-15',
-          type: 'launch',
-          priority: 'critical',
-          description: 'Initiation of second phase of renewable energy transition program',
-        },
-        {
-          id: 3,
-          title: 'Healthcare Coverage Expansion',
-          date: '2025-05-01',
-          type: 'expansion',
-          priority: 'high',
-          description: 'Extend universal healthcare to additional 500,000 citizens',
-        },
-        {
-          id: 4,
-          title: 'Climate Action Summit',
-          date: '2025-06-10',
-          type: 'event',
-          priority: 'medium',
-          description: 'National summit on climate change mitigation strategies',
-        },
-        {
-          id: 5,
-          title: 'Mid-Year Budget Review',
-          date: '2025-06-30',
-          type: 'review',
-          priority: 'high',
-          description: 'Review budget utilization and reallocate resources as needed',
-        },
-      ],
+    // Calculate total budget and utilization
+    const totalBudget = ministriesData.reduce((sum, m) => sum + Number(m.budgetAllocated), 0);
+    const totalUtilized = ministriesData.reduce((sum, m) => sum + Number(m.budgetUtilized), 0);
+    const utilizationRate = totalBudget > 0 ? (totalUtilized / totalBudget) * 100 : 0;
 
-      alerts: [
-        {
-          id: 1,
-          type: 'critical',
-          title: 'Climate Action Policy Behind Schedule',
-          message: 'Carbon Reduction Strategy is 30% behind target. Immediate intervention required.',
-          sdg: 'SDG 13',
-          date: new Date().toISOString(),
-          actionRequired: true,
-        },
-        {
-          id: 2,
-          type: 'warning',
-          title: 'Budget Utilization Low - Infrastructure',
-          message: 'Ministry of Infrastructure has only utilized 34% of allocated budget. Review needed.',
-          ministry: 'Ministry of Infrastructure',
-          date: new Date().toISOString(),
-          actionRequired: true,
-        },
-        {
-          id: 3,
-          type: 'success',
-          title: 'Digital Learning Platform Exceeds Target',
-          message: 'Education technology initiative has reached 85% completion, ahead of schedule.',
-          sdg: 'SDG 4',
-          date: new Date().toISOString(),
-          actionRequired: false,
-        },
-        {
-          id: 4,
-          type: 'warning',
-          title: 'Stakeholder Engagement Declining',
-          message: 'Citizen participation in consultations down 15% this quarter.',
-          date: new Date().toISOString(),
-          actionRequired: true,
-        },
-      ],
+    // Calculate total policies
+    const totalPoliciesCount = await db
+      .select({ count: sql<number>`count(*)` })
+      .from(policies);
 
-      performanceMetrics: {
-        policyEffectiveness: 76.5,
-        stakeholderSatisfaction: 82.3,
-        budgetEfficiency: 71.4,
-        timelinessScore: 68.9,
-        innovationIndex: 74.2,
-        collaborationScore: 79.8,
+    // Calculate average performance
+    const avgPerformance = ministriesData.reduce((sum, m) => sum + Number(m.performanceScore), 0) / ministriesData.length;
+
+    // Prepare overview stats
+    const overviewStats = {
+      totalPolicies: totalPoliciesCount[0].count,
+      totalBudget: totalBudget,
+      budgetUtilization: utilizationRate,
+      totalStakeholders: stakeholdersCount[0].count,
+      sdgsTracked: sdgGoalsData.length,
+      avgPerformance: avgPerformance
+    };
+
+    // Prepare SDG progress data
+    const sdgProgress = sdgGoalsData.map(goal => ({
+      id: goal.id,
+      goalNumber: goal.goalNumber,
+      title: goal.title,
+      description: goal.description,
+      progress: Number(goal.progress),
+      target: Number(goal.target),
+      status: goal.status,
+      trend: goal.trend,
+      lastUpdated: goal.lastUpdated
+    }));
+
+    // Prepare recent policies data
+    const policiesData = recentPolicies.map(policy => ({
+      id: policy.id,
+      title: policy.title,
+      ministry: policy.ministry,
+      status: policy.status,
+      priority: policy.priority,
+      progress: Number(policy.progress),
+      budget: Number(policy.budget),
+      startDate: policy.startDate,
+      endDate: policy.endDate,
+      sdgs: policy.sdgs as number[],
+      description: policy.description
+    }));
+
+    // Prepare budget by ministry
+    const budgetByMinistry = ministriesData.map(ministry => ({
+      id: ministry.id,
+      name: ministry.name,
+      code: ministry.code,
+      budgetAllocated: Number(ministry.budgetAllocated),
+      budgetUtilized: Number(ministry.budgetUtilized),
+      utilizationRate: Number(ministry.budgetAllocated) > 0 
+        ? (Number(ministry.budgetUtilized) / Number(ministry.budgetAllocated)) * 100 
+        : 0,
+      projectsCount: ministry.projectsCount,
+      sdgFocus: ministry.sdgFocus as number[],
+      performanceScore: Number(ministry.performanceScore)
+    }));
+
+    // Mock data for alerts (can be moved to database later)
+    const alerts = [
+      {
+        id: 1,
+        type: 'critical',
+        title: 'Budget Overrun Alert',
+        message: 'Ministry of Health budget utilization at 95%. Immediate review required.',
+        timestamp: new Date().toISOString(),
+        action: 'Review Budget'
       },
+      {
+        id: 2,
+        type: 'warning',
+        title: 'Policy Deadline Approaching',
+        message: 'Clean Energy Initiative deadline in 7 days. Current progress: 68%',
+        timestamp: new Date().toISOString(),
+        action: 'Monitor Progress'
+      },
+      {
+        id: 3,
+        type: 'success',
+        title: 'Milestone Achieved',
+        message: 'Digital Literacy Program reached 1 million beneficiaries',
+        timestamp: new Date().toISOString(),
+        action: 'View Details'
+      },
+      {
+        id: 4,
+        type: 'info',
+        title: 'New Stakeholder Request',
+        message: '3 new partnership requests pending review',
+        timestamp: new Date().toISOString(),
+        action: 'Review Requests'
+      }
+    ];
 
-      recentActivity: [
-        {
-          id: 1,
-          type: 'policy_update',
-          title: 'Healthcare policy updated',
-          user: 'Dr. Sarah Johnson',
-          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
-          description: 'Updated coverage targets for rural areas',
-        },
-        {
-          id: 2,
-          type: 'milestone_completed',
-          title: 'Digital platform milestone achieved',
-          user: 'Ministry of Education',
-          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
-          description: 'Reached 500,000 active users',
-        },
-        {
-          id: 3,
-          type: 'budget_allocated',
-          title: 'Additional funding approved',
-          user: 'Ministry of Finance',
-          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
-          description: '$15M allocated to climate action',
-        },
-        {
-          id: 4,
-          type: 'stakeholder_feedback',
-          title: 'New citizen feedback received',
-          user: 'Public Portal',
-          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
-          description: '45 new feedback items submitted',
-        },
-        {
-          id: 5,
-          type: 'collaboration',
-          title: 'Cross-ministry partnership formed',
-          user: 'Ministry of Environment',
-          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
-          description: 'Joint initiative with Ministry of Transport',
-        },
-      ],
+    // Mock data for milestones (can be moved to database later)
+    const milestones = [
+      {
+        id: 1,
+        title: 'Q1 Policy Review Meeting',
+        date: '2025-03-15',
+        type: 'meeting',
+        status: 'upcoming',
+        participants: 45,
+        description: 'Quarterly review of all active policies'
+      },
+      {
+        id: 2,
+        title: 'SDG Progress Report Submission',
+        date: '2025-03-20',
+        type: 'deadline',
+        status: 'upcoming',
+        participants: 0,
+        description: 'Submit annual SDG progress report to UN'
+      },
+      {
+        id: 3,
+        title: 'Stakeholder Consultation Workshop',
+        date: '2025-03-25',
+        type: 'workshop',
+        status: 'upcoming',
+        participants: 120,
+        description: 'Multi-stakeholder consultation on climate policies'
+      },
+      {
+        id: 4,
+        title: 'Budget Allocation Finalization',
+        date: '2025-03-30',
+        type: 'deadline',
+        status: 'upcoming',
+        participants: 0,
+        description: 'Finalize Q2 budget allocations across ministries'
+      },
+      {
+        id: 5,
+        title: 'International Partnership Summit',
+        date: '2025-04-05',
+        type: 'event',
+        status: 'upcoming',
+        participants: 200,
+        description: 'Annual summit with international development partners'
+      }
+    ];
 
-      topPerformers: [
-        {
-          category: 'Policy Implementation',
-          winner: 'Ministry of Technology',
-          score: 88,
-          achievement: 'Digital Infrastructure Program - 85% completion',
-        },
-        {
-          category: 'Budget Efficiency',
-          winner: 'Ministry of Education',
-          score: 92,
-          achievement: 'Optimal resource allocation with 78% utilization',
-        },
-        {
-          category: 'Stakeholder Engagement',
-          winner: 'Ministry of Health',
-          score: 86,
-          achievement: 'Highest citizen satisfaction rating (4.6/5)',
-        },
-        {
-          category: 'Innovation',
-          winner: 'Ministry of Technology',
-          score: 94,
-          achievement: 'AI Innovation Hub - 15 startups launched',
-        },
-      ],
+    // Mock data for activity feed (can be moved to database later)
+    const recentActivity = [
+      {
+        id: 1,
+        type: 'policy_update',
+        title: 'Clean Energy Initiative updated',
+        description: 'Progress increased to 68%',
+        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
+        user: 'Ministry of Energy'
+      },
+      {
+        id: 2,
+        type: 'stakeholder_feedback',
+        title: 'New feedback received',
+        description: 'Civil Society Coalition submitted recommendations',
+        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
+        user: 'Stakeholder Portal'
+      },
+      {
+        id: 3,
+        type: 'budget_update',
+        title: 'Budget allocation approved',
+        description: 'Q2 budget for Digital Literacy Program approved',
+        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
+        user: 'Ministry of Technology'
+      },
+      {
+        id: 4,
+        type: 'milestone_completed',
+        title: 'Milestone achieved',
+        description: 'Healthcare Access Program reached 500K beneficiaries',
+        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
+        user: 'Ministry of Health'
+      },
+      {
+        id: 5,
+        type: 'collaboration',
+        title: 'New collaboration initiated',
+        description: 'Cross-ministry task force on climate action formed',
+        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
+        user: 'Ministry of Environment'
+      }
+    ];
 
-      recommendations: [
-        {
-          id: 1,
-          priority: 'critical',
-          title: 'Accelerate Climate Action Implementation',
-          description: 'Carbon Reduction Strategy requires immediate resource reallocation and timeline adjustment.',
-          impact: 'High',
-          effort: 'Medium',
-          sdg: 'SDG 13',
-          estimatedCost: 5000000,
-        },
-        {
-          id: 2,
-          priority: 'high',
-          title: 'Improve Infrastructure Budget Utilization',
-          description: 'Ministry of Infrastructure needs process optimization to improve spending efficiency.',
-          impact: 'Medium',
-          effort: 'Low',
-          ministry: 'Ministry of Infrastructure',
-          estimatedCost: 500000,
-        },
-        {
-          id: 3,
-          priority: 'medium',
-          title: 'Expand Successful Education Model',
-          description: 'Replicate Digital Learning Platform success to vocational training programs.',
-          impact: 'High',
-          effort: 'Medium',
-          sdg: 'SDG 4',
-          estimatedCost: 8000000,
-        },
-        {
-          id: 4,
-          priority: 'high',
-          title: 'Enhance Stakeholder Engagement',
-          description: 'Launch targeted campaign to increase citizen participation in policy consultations.',
-          impact: 'Medium',
-          effort: 'Low',
-          estimatedCost: 1200000,
-        },
-      ],
+    // Performance metrics
+    const performanceMetrics = {
+      policyEffectiveness: 76.5,
+      stakeholderSatisfaction: 82.3,
+      budgetEfficiency: utilizationRate,
+      timelinessScore: 68.9,
+      innovationIndex: 74.2,
+      collaborationScore: 79.8
     };
 
-    return res.status(200).json({
+    // Top performers (ministries with highest performance scores)
+    const topPerformers = ministriesData
+      .sort((a, b) => Number(b.performanceScore) - Number(a.performanceScore))
+      .slice(0, 5)
+      .map(m => ({
+        name: m.name,
+        score: Number(m.performanceScore),
+        change: Math.random() > 0.5 ? '+' + (Math.random() * 5).toFixed(1) : '-' + (Math.random() * 3).toFixed(1)
+      }));
+
+    // Strategic recommendations (AI-powered - mock for now)
+    const recommendations = [
+      {
+        id: 1,
+        title: 'Accelerate Digital Literacy Program',
+        description: 'Current pace suggests 12-month delay. Recommend increasing budget by 15% and adding 3 regional coordinators.',
+        priority: 'high',
+        impact: 'High',
+        effort: 'Medium',
+        estimatedCost: 450000,
+        expectedOutcome: '+25% faster completion, reach 1.5M beneficiaries'
+      },
+      {
+        id: 2,
+        title: 'Optimize Healthcare Budget Allocation',
+        description: 'Analysis shows 8% efficiency gain possible through resource reallocation between urban and rural programs.',
+        priority: 'medium',
+        impact: 'Medium',
+        effort: 'Low',
+        estimatedCost: 0,
+        expectedOutcome: 'Serve additional 50K patients with same budget'
+      },
+      {
+        id: 3,
+        title: 'Strengthen Climate Policy Coordination',
+        description: 'Three ministries working on overlapping climate initiatives. Recommend unified task force to avoid duplication.',
+        priority: 'high',
+        impact: 'High',
+        effort: 'Medium',
+        estimatedCost: 200000,
+        expectedOutcome: 'Save $1.2M annually, improve policy coherence'
+      },
+      {
+        id: 4,
+        title: 'Expand Stakeholder Engagement',
+        description: 'Only 45% of registered stakeholders actively engaged. Recommend quarterly consultation workshops.',
+        priority: 'low',
+        impact: 'Medium',
+        effort: 'Low',
+        estimatedCost: 75000,
+        expectedOutcome: 'Increase engagement to 70%, better policy feedback'
+      }
+    ];
+
+    // Return comprehensive dashboard data
+    res.json({
       success: true,
-      data: dashboardData,
-      timestamp: new Date().toISOString(),
+      data: {
+        overview: overviewStats,
+        alerts,
+        sdgProgress,
+        recentPolicies: policiesData,
+        budgetByMinistry,
+        milestones,
+        recentActivity,
+        topPerformers,
+        performanceMetrics,
+        recommendations
+      },
+      timestamp: new Date().toISOString()
     });
+
   } catch (error) {
-    console.error('Dashboard data error:', error);
-    return res.status(500).json({
+    console.error('Dashboard API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to fetch dashboard data',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
