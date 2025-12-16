import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    // In production, fetch from database
    // For now, return comprehensive cross-ministry data
    const crossMinistryData = {
      overview: {
        totalMinistries: 12,
        activeCollaborations: 28,
        sharedInitiatives: 45,
        totalBudget: 1250000000,
        lastUpdated: new Date().toISOString(),
      },

      ministries: [
        {
          id: 1,
          name: 'Ministry of Education',
          abbreviation: 'MOE',
          minister: 'Dr. Sarah Johnson',
          budget: 185000000,
          staff: 12500,
          sdgFocus: ['SDG 4', 'SDG 8', 'SDG 10'],
          performance: {
            overall: 82,
            budgetUtilization: 78,
            projectCompletion: 85,
            stakeholderSatisfaction: 80,
            innovation: 75,
          },
          activeProjects: 24,
          completedProjects: 156,
          collaborations: [
            { ministry: 'Ministry of Health', projects: 8, budget: 12000000 },
            { ministry: 'Ministry of Technology', projects: 5, budget: 8500000 },
            { ministry: 'Ministry of Labor', projects: 6, budget: 9200000 },
          ],
          keyInitiatives: [
            {
              name: 'Digital Learning Platform',
              sdg: 'SDG 4',
              status: 'on-track',
              progress: 72,
              budget: 25000000,
              partners: ['Ministry of Technology'],
            },
            {
              name: 'Vocational Training Program',
              sdg: 'SDG 8',
              status: 'on-track',
              progress: 68,
              budget: 18000000,
              partners: ['Ministry of Labor'],
            },
          ],
          strengths: ['Teacher training', 'Curriculum development', 'Digital infrastructure'],
          challenges: ['Rural access', 'Budget constraints', 'Teacher retention'],
        },
        {
          id: 2,
          name: 'Ministry of Health',
          abbreviation: 'MOH',
          minister: 'Dr. Michael Chen',
          budget: 245000000,
          staff: 18200,
          sdgFocus: ['SDG 3', 'SDG 6', 'SDG 10'],
          performance: {
            overall: 78,
            budgetUtilization: 82,
            projectCompletion: 75,
            stakeholderSatisfaction: 76,
            innovation: 72,
          },
          activeProjects: 32,
          completedProjects: 189,
          collaborations: [
            { ministry: 'Ministry of Education', projects: 8, budget: 12000000 },
            { ministry: 'Ministry of Environment', projects: 6, budget: 9500000 },
            { ministry: 'Ministry of Social Welfare', projects: 10, budget: 15000000 },
          ],
          keyInitiatives: [
            {
              name: 'Universal Healthcare Coverage',
              sdg: 'SDG 3',
              status: 'on-track',
              progress: 65,
              budget: 78000000,
              partners: ['Ministry of Social Welfare'],
            },
            {
              name: 'Rural Health Clinics',
              sdg: 'SDG 3',
              status: 'at-risk',
              progress: 48,
              budget: 32000000,
              partners: ['Ministry of Infrastructure'],
            },
          ],
          strengths: ['Emergency response', 'Vaccination programs', 'Disease prevention'],
          challenges: ['Rural healthcare', 'Staff shortages', 'Equipment modernization'],
        },
        {
          id: 3,
          name: 'Ministry of Environment',
          abbreviation: 'MOE',
          minister: 'Dr. Emily Rodriguez',
          budget: 125000000,
          staff: 5800,
          sdgFocus: ['SDG 13', 'SDG 14', 'SDG 15'],
          performance: {
            overall: 68,
            budgetUtilization: 65,
            projectCompletion: 70,
            stakeholderSatisfaction: 72,
            innovation: 78,
          },
          activeProjects: 18,
          completedProjects: 92,
          collaborations: [
            { ministry: 'Ministry of Energy', projects: 12, budget: 18000000 },
            { ministry: 'Ministry of Agriculture', projects: 9, budget: 11500000 },
            { ministry: 'Ministry of Health', projects: 6, budget: 9500000 },
          ],
          keyInitiatives: [
            {
              name: 'National Reforestation Program',
              sdg: 'SDG 15',
              status: 'on-track',
              progress: 55,
              budget: 22000000,
              partners: ['Ministry of Agriculture'],
            },
            {
              name: 'Carbon Reduction Initiative',
              sdg: 'SDG 13',
              status: 'critical',
              progress: 35,
              budget: 28000000,
              partners: ['Ministry of Energy', 'Ministry of Transport'],
            },
          ],
          strengths: ['Environmental monitoring', 'Conservation programs', 'Research'],
          challenges: ['Funding limitations', 'Policy enforcement', 'Public awareness'],
        },
        {
          id: 4,
          name: 'Ministry of Energy',
          abbreviation: 'MOE',
          minister: 'Eng. David Thompson',
          budget: 195000000,
          staff: 7200,
          sdgFocus: ['SDG 7', 'SDG 9', 'SDG 13'],
          performance: {
            overall: 72,
            budgetUtilization: 75,
            projectCompletion: 68,
            stakeholderSatisfaction: 74,
            innovation: 82,
          },
          activeProjects: 21,
          completedProjects: 118,
          collaborations: [
            { ministry: 'Ministry of Environment', projects: 12, budget: 18000000 },
            { ministry: 'Ministry of Technology', projects: 8, budget: 14000000 },
            { ministry: 'Ministry of Infrastructure', projects: 7, budget: 12500000 },
          ],
          keyInitiatives: [
            {
              name: 'Renewable Energy Transition',
              sdg: 'SDG 7',
              status: 'at-risk',
              progress: 48,
              budget: 95000000,
              partners: ['Ministry of Environment', 'Ministry of Finance'],
            },
            {
              name: 'Smart Grid Implementation',
              sdg: 'SDG 9',
              status: 'on-track',
              progress: 62,
              budget: 42000000,
              partners: ['Ministry of Technology'],
            },
          ],
          strengths: ['Infrastructure development', 'Technical expertise', 'Innovation'],
          challenges: ['Renewable transition', 'Grid modernization', 'Investment needs'],
        },
        {
          id: 5,
          name: 'Ministry of Technology',
          abbreviation: 'MOT',
          minister: 'Dr. Lisa Wang',
          budget: 165000000,
          staff: 4500,
          sdgFocus: ['SDG 9', 'SDG 4', 'SDG 8'],
          performance: {
            overall: 85,
            budgetUtilization: 88,
            projectCompletion: 82,
            stakeholderSatisfaction: 84,
            innovation: 92,
          },
          activeProjects: 28,
          completedProjects: 145,
          collaborations: [
            { ministry: 'Ministry of Education', projects: 5, budget: 8500000 },
            { ministry: 'Ministry of Energy', projects: 8, budget: 14000000 },
            { ministry: 'Ministry of Health', projects: 4, budget: 6200000 },
          ],
          keyInitiatives: [
            {
              name: 'National Digital Infrastructure',
              sdg: 'SDG 9',
              status: 'on-track',
              progress: 78,
              budget: 52000000,
              partners: ['Ministry of Education', 'Ministry of Commerce'],
            },
            {
              name: 'AI Innovation Hub',
              sdg: 'SDG 9',
              status: 'on-track',
              progress: 71,
              budget: 38000000,
              partners: ['Ministry of Education'],
            },
          ],
          strengths: ['Digital innovation', 'Tech infrastructure', 'Startup ecosystem'],
          challenges: ['Cybersecurity', 'Digital divide', 'Talent retention'],
        },
        {
          id: 6,
          name: 'Ministry of Social Welfare',
          abbreviation: 'MOSW',
          minister: 'Hon. Patricia Martinez',
          budget: 135000000,
          staff: 8900,
          sdgFocus: ['SDG 1', 'SDG 2', 'SDG 10'],
          performance: {
            overall: 75,
            budgetUtilization: 80,
            projectCompletion: 72,
            stakeholderSatisfaction: 78,
            innovation: 68,
          },
          activeProjects: 26,
          completedProjects: 167,
          collaborations: [
            { ministry: 'Ministry of Health', projects: 10, budget: 15000000 },
            { ministry: 'Ministry of Education', projects: 7, budget: 10500000 },
            { ministry: 'Ministry of Labor', projects: 9, budget: 13000000 },
          ],
          keyInitiatives: [
            {
              name: 'Poverty Reduction Program',
              sdg: 'SDG 1',
              status: 'critical',
              progress: 35,
              budget: 68000000,
              partners: ['Ministry of Labor', 'Ministry of Finance'],
            },
            {
              name: 'Food Security Initiative',
              sdg: 'SDG 2',
              status: 'on-track',
              progress: 58,
              budget: 28000000,
              partners: ['Ministry of Agriculture'],
            },
          ],
          strengths: ['Community programs', 'Social safety nets', 'Outreach'],
          challenges: ['Resource allocation', 'Program reach', 'Impact measurement'],
        },
      ],

      collaborationMatrix: [
        {
          ministry1: 'Ministry of Education',
          ministry2: 'Ministry of Health',
          projects: 8,
          budget: 12000000,
          sdgs: ['SDG 3', 'SDG 4'],
          status: 'active',
          effectiveness: 82,
        },
        {
          ministry1: 'Ministry of Education',
          ministry2: 'Ministry of Technology',
          projects: 5,
          budget: 8500000,
          sdgs: ['SDG 4', 'SDG 9'],
          status: 'active',
          effectiveness: 88,
        },
        {
          ministry1: 'Ministry of Environment',
          ministry2: 'Ministry of Energy',
          projects: 12,
          budget: 18000000,
          sdgs: ['SDG 7', 'SDG 13'],
          status: 'active',
          effectiveness: 75,
        },
        {
          ministry1: 'Ministry of Health',
          ministry2: 'Ministry of Social Welfare',
          projects: 10,
          budget: 15000000,
          sdgs: ['SDG 1', 'SDG 3'],
          status: 'active',
          effectiveness: 78,
        },
      ],

      performanceMetrics: {
        averageScore: 76.5,
        topPerformer: 'Ministry of Technology',
        mostCollaborative: 'Ministry of Education',
        budgetLeader: 'Ministry of Health',
        innovationLeader: 'Ministry of Technology',
      },

      insights: [
        {
          type: 'opportunity',
          title: 'Cross-Ministry Synergy Gap',
          description:
            'Ministry of Environment and Ministry of Transport have no active collaborations despite shared SDG 13 goals. Joint initiative could improve carbon reduction by 25%.',
          priority: 'high',
          affectedMinistries: ['Ministry of Environment', 'Ministry of Transport'],
          potentialImpact: '+25% carbon reduction',
        },
        {
          type: 'success',
          title: 'Education-Technology Partnership Excellence',
          description:
            'MOE-MOT collaboration on Digital Learning Platform shows 88% effectiveness. Model for other ministries.',
          priority: 'medium',
          affectedMinistries: ['Ministry of Education', 'Ministry of Technology'],
          potentialImpact: 'Best practice model',
        },
        {
          type: 'warning',
          title: 'Social Welfare Budget Utilization',
          description:
            'Ministry of Social Welfare at 80% budget utilization but only 35% progress on poverty reduction. Requires intervention.',
          priority: 'critical',
          affectedMinistries: ['Ministry of Social Welfare'],
          potentialImpact: 'Risk of program failure',
        },
        {
          type: 'opportunity',
          title: 'Health-Education Expansion',
          description:
            'Successful health education programs could expand to include mental health curriculum. Estimated reach: 500,000 students.',
          priority: 'high',
          affectedMinistries: ['Ministry of Health', 'Ministry of Education'],
          potentialImpact: '+500K beneficiaries',
        },
      ],

      recommendations: [
        {
          title: 'Establish Environment-Transport Task Force',
          description:
            'Create joint working group for carbon reduction with shared KPIs and budget allocation.',
          ministries: ['Ministry of Environment', 'Ministry of Transport'],
          estimatedCost: 5000000,
          timeline: '18 months',
          expectedImpact: '+25% carbon reduction',
          priority: 'high',
        },
        {
          title: 'Replicate Digital Learning Model',
          description:
            'Apply successful MOE-MOT digital platform approach to health education and vocational training.',
          ministries: ['Ministry of Health', 'Ministry of Labor'],
          estimatedCost: 12000000,
          timeline: '24 months',
          expectedImpact: '+300K beneficiaries',
          priority: 'high',
        },
        {
          title: 'Social Welfare Program Audit',
          description:
            'Conduct comprehensive review of poverty reduction program with external consultants.',
          ministries: ['Ministry of Social Welfare', 'Ministry of Finance'],
          estimatedCost: 500000,
          timeline: '6 months',
          expectedImpact: 'Program optimization',
          priority: 'critical',
        },
        {
          title: 'Innovation Sharing Platform',
          description:
            'Create cross-ministry platform for sharing best practices and innovation led by MOT.',
          ministries: ['All Ministries'],
          estimatedCost: 3000000,
          timeline: '12 months',
          expectedImpact: '+15% avg efficiency',
          priority: 'medium',
        },
      ],
    };

    return res.status(200).json({
      success: true,
      data: crossMinistryData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cross-ministry data error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: String(error),
    });
  }
}
