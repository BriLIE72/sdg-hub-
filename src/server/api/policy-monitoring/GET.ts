import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    // In production, fetch from database
    // For now, return comprehensive monitoring data
    const monitoringData = {
      overview: {
        totalPolicies: 47,
        activePolicies: 32,
        completedPolicies: 12,
        atRiskPolicies: 3,
        totalBudget: 245000000,
        budgetUtilized: 178500000,
        overallProgress: 68,
      },
      
      activePolicies: [
        {
          id: 1,
          name: 'National Education Reform',
          sdg: 'SDG 4',
          status: 'on-track',
          progress: 72,
          budget: 45000000,
          spent: 32400000,
          startDate: '2023-01-15',
          endDate: '2025-12-31',
          milestones: {
            completed: 8,
            total: 12,
          },
          kpis: [
            { name: 'School Enrollment', target: 95, current: 87, unit: '%' },
            { name: 'Teacher Training', target: 5000, current: 3800, unit: 'teachers' },
            { name: 'Infrastructure', target: 200, current: 156, unit: 'schools' },
          ],
          alerts: [],
          lastUpdate: '2024-12-14',
        },
        {
          id: 2,
          name: 'Universal Healthcare Access',
          sdg: 'SDG 3',
          status: 'on-track',
          progress: 65,
          budget: 78000000,
          spent: 50700000,
          startDate: '2022-06-01',
          endDate: '2026-05-31',
          milestones: {
            completed: 6,
            total: 10,
          },
          kpis: [
            { name: 'Coverage Rate', target: 90, current: 78, unit: '%' },
            { name: 'Health Centers', target: 150, current: 112, unit: 'facilities' },
            { name: 'Vaccinations', target: 2000000, current: 1650000, unit: 'people' },
          ],
          alerts: [],
          lastUpdate: '2024-12-13',
        },
        {
          id: 3,
          name: 'Renewable Energy Transition',
          sdg: 'SDG 7',
          status: 'at-risk',
          progress: 48,
          budget: 95000000,
          spent: 52250000,
          startDate: '2023-03-01',
          endDate: '2028-02-29',
          milestones: {
            completed: 4,
            total: 15,
          },
          kpis: [
            { name: 'Solar Capacity', target: 500, current: 285, unit: 'MW' },
            { name: 'Wind Capacity', target: 300, current: 142, unit: 'MW' },
            { name: 'Carbon Reduction', target: 40, current: 18, unit: '%' },
          ],
          alerts: [
            {
              type: 'warning',
              message: 'Budget utilization below target by 15%',
              date: '2024-12-10',
            },
            {
              type: 'warning',
              message: 'Milestone 5 delayed by 3 months',
              date: '2024-12-08',
            },
          ],
          lastUpdate: '2024-12-15',
        },
        {
          id: 4,
          name: 'Clean Water Infrastructure',
          sdg: 'SDG 6',
          status: 'on-track',
          progress: 81,
          budget: 52000000,
          spent: 42120000,
          startDate: '2021-09-01',
          endDate: '2024-08-31',
          milestones: {
            completed: 11,
            total: 12,
          },
          kpis: [
            { name: 'Water Access', target: 95, current: 92, unit: '%' },
            { name: 'Treatment Plants', target: 25, current: 23, unit: 'facilities' },
            { name: 'Pipeline Network', target: 1200, current: 1050, unit: 'km' },
          ],
          alerts: [],
          lastUpdate: '2024-12-16',
        },
        {
          id: 5,
          name: 'Poverty Reduction Program',
          sdg: 'SDG 1',
          status: 'critical',
          progress: 35,
          budget: 68000000,
          spent: 27200000,
          startDate: '2023-07-01',
          endDate: '2027-06-30',
          milestones: {
            completed: 3,
            total: 14,
          },
          kpis: [
            { name: 'Beneficiaries', target: 500000, current: 185000, unit: 'people' },
            { name: 'Cash Transfers', target: 50000000, current: 18500000, unit: '$' },
            { name: 'Job Placements', target: 25000, current: 7800, unit: 'jobs' },
          ],
          alerts: [
            {
              type: 'critical',
              message: 'Progress significantly behind schedule',
              date: '2024-12-12',
            },
            {
              type: 'critical',
              message: 'Budget utilization only 40% at mid-point',
              date: '2024-12-09',
            },
            {
              type: 'warning',
              message: 'Stakeholder engagement below target',
              date: '2024-12-05',
            },
          ],
          lastUpdate: '2024-12-14',
        },
      ],

      performanceMetrics: {
        budgetEfficiency: 73,
        timelineAdherence: 68,
        kpiAchievement: 71,
        stakeholderSatisfaction: 78,
      },

      recentActivities: [
        {
          id: 1,
          policy: 'National Education Reform',
          activity: 'Milestone 8 completed: Teacher training program phase 2',
          timestamp: '2024-12-16T10:30:00Z',
          type: 'milestone',
        },
        {
          id: 2,
          policy: 'Clean Water Infrastructure',
          activity: 'KPI update: Water access increased to 92%',
          timestamp: '2024-12-16T09:15:00Z',
          type: 'kpi',
        },
        {
          id: 3,
          policy: 'Renewable Energy Transition',
          activity: 'Alert: Budget utilization below target',
          timestamp: '2024-12-15T16:45:00Z',
          type: 'alert',
        },
        {
          id: 4,
          policy: 'Universal Healthcare Access',
          activity: 'Progress update: 112 health centers operational',
          timestamp: '2024-12-15T14:20:00Z',
          type: 'progress',
        },
        {
          id: 5,
          policy: 'Poverty Reduction Program',
          activity: 'Critical alert: Progress significantly behind schedule',
          timestamp: '2024-12-14T11:00:00Z',
          type: 'alert',
        },
      ],

      upcomingMilestones: [
        {
          id: 1,
          policy: 'National Education Reform',
          milestone: 'Complete infrastructure upgrades for 200 schools',
          dueDate: '2025-01-15',
          daysRemaining: 30,
          status: 'upcoming',
        },
        {
          id: 2,
          policy: 'Clean Water Infrastructure',
          milestone: 'Final project evaluation and handover',
          dueDate: '2024-12-31',
          daysRemaining: 15,
          status: 'upcoming',
        },
        {
          id: 3,
          policy: 'Universal Healthcare Access',
          milestone: 'Launch mobile health clinics in rural areas',
          dueDate: '2025-02-01',
          daysRemaining: 47,
          status: 'upcoming',
        },
      ],
    };

    return res.status(200).json({
      success: true,
      data: monitoringData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Policy monitoring error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
