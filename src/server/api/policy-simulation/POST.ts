Index: src/server/api/policy-simulation/POST.ts
===================================================================
--- src/server/api/policy-simulation/POST.ts	non-existent
+++ src/server/api/policy-simulation/POST.ts	new file
@@ -0,0 +1,330 @@
+import type { Request, Response } from 'express';
+
+export default async function handler(req: Request, res: Response) {
+  try {
+    const { sector, sdgGoal, budgetAllocation, timeframe, interventionType } = req.body;
+
+    // Validation
+    if (!sector || !sdgGoal || !budgetAllocation || !timeframe) {
+      return res.status(400).json({
+        success: false,
+        error: 'Missing required parameters: sector, sdgGoal, budgetAllocation, timeframe',
+      });
+    }
+
+    // Sector-specific simulation data
+    const sectorData: Record<string, any> = {
+      health: {
+        name: 'Ministry of Health',
+        currentBudget: 245000000,
+        currentPerformance: 78,
+        baseImpact: 65,
+        multiplier: 1.2,
+        riskFactors: ['Staff shortages', 'Equipment costs', 'Rural access'],
+        opportunities: ['Telemedicine', 'Preventive care', 'Digital health records'],
+      },
+      education: {
+        name: 'Ministry of Education',
+        currentBudget: 185000000,
+        currentPerformance: 82,
+        baseImpact: 70,
+        multiplier: 1.3,
+        riskFactors: ['Teacher retention', 'Infrastructure gaps', 'Digital divide'],
+        opportunities: ['Online learning', 'Teacher training', 'STEM programs'],
+      },
+      energy: {
+        name: 'Ministry of Energy',
+        currentBudget: 195000000,
+        currentPerformance: 72,
+        baseImpact: 60,
+        multiplier: 1.1,
+        riskFactors: ['High initial costs', 'Technology adoption', 'Grid infrastructure'],
+        opportunities: ['Renewable energy', 'Smart grids', 'Energy efficiency'],
+      },
+      technology: {
+        name: 'Ministry of Technology',
+        currentBudget: 165000000,
+        currentPerformance: 85,
+        baseImpact: 75,
+        multiplier: 1.4,
+        riskFactors: ['Cybersecurity', 'Talent shortage', 'Rapid change'],
+        opportunities: ['AI innovation', 'Digital infrastructure', 'Tech startups'],
+      },
+      social_welfare: {
+        name: 'Ministry of Social Welfare',
+        currentBudget: 135000000,
+        currentPerformance: 75,
+        baseImpact: 68,
+        multiplier: 1.15,
+        riskFactors: ['Program reach', 'Funding gaps', 'Coordination'],
+        opportunities: ['Targeted programs', 'Community engagement', 'Data-driven approach'],
+      },
+      environment: {
+        name: 'Ministry of Environment',
+        currentBudget: 125000000,
+        currentPerformance: 68,
+        baseImpact: 55,
+        multiplier: 1.05,
+        riskFactors: ['Policy enforcement', 'Public awareness', 'Long-term impact'],
+        opportunities: ['Conservation programs', 'Green technology', 'Carbon credits'],
+      },
+      infrastructure: {
+        name: 'Ministry of Infrastructure',
+        currentBudget: 285000000,
+        currentPerformance: 70,
+        baseImpact: 62,
+        multiplier: 1.08,
+        riskFactors: ['Project delays', 'Cost overruns', 'Maintenance'],
+        opportunities: ['Smart cities', 'Public transport', 'Sustainable design'],
+      },
+      agriculture: {
+        name: 'Ministry of Agriculture',
+        currentBudget: 145000000,
+        currentPerformance: 73,
+        baseImpact: 64,
+        multiplier: 1.12,
+        riskFactors: ['Climate change', 'Market volatility', 'Water scarcity'],
+        opportunities: ['Precision farming', 'Crop diversification', 'Export markets'],
+      },
+      labor: {
+        name: 'Ministry of Labor',
+        currentBudget: 115000000,
+        currentPerformance: 76,
+        baseImpact: 66,
+        multiplier: 1.18,
+        riskFactors: ['Skills gap', 'Automation', 'Informal sector'],
+        opportunities: ['Vocational training', 'Job matching', 'Worker protections'],
+      },
+      finance: {
+        name: 'Ministry of Finance',
+        currentBudget: 95000000,
+        currentPerformance: 80,
+        baseImpact: 72,
+        multiplier: 1.25,
+        riskFactors: ['Economic volatility', 'Debt levels', 'Revenue collection'],
+        opportunities: ['Digital payments', 'Tax reform', 'Financial inclusion'],
+      },
+    };
+
+    const selectedSector = sectorData[sector];
+
+    if (!selectedSector) {
+      return res.status(400).json({
+        success: false,
+        error: 'Invalid sector',
+      });
+    }
+
+    // Calculate simulation results
+    const budgetNum = parseInt(budgetAllocation);
+    const timeframeNum = parseInt(timeframe);
+
+    // Impact calculation
+    const budgetFactor = (budgetNum / selectedSector.currentBudget) * 100;
+    const timeFactor = timeframeNum * 5;
+    const baseImpact = selectedSector.baseImpact;
+    const multiplier = selectedSector.multiplier;
+
+    const predictedImpact = Math.min(
+      95,
+      baseImpact + budgetFactor * multiplier + timeFactor
+    );
+
+    // Beneficiaries calculation
+    const beneficiaries = Math.floor(budgetNum * 150 * multiplier);
+
+    // Risk assessment
+    const budgetRatio = budgetNum / selectedSector.currentBudget;
+    let riskLevel = 'Low';
+    let riskScore = 25;
+
+    if (budgetRatio < 0.1) {
+      riskLevel = 'High';
+      riskScore = 75;
+    } else if (budgetRatio < 0.3) {
+      riskLevel = 'Medium';
+      riskScore = 50;
+    }
+
+    // Timeline milestones
+    const milestones = [
+      {
+        month: 3,
+        title: 'Planning & Design Phase',
+        completion: 100,
+        status: 'completed',
+      },
+      {
+        month: 6,
+        title: 'Stakeholder Consultation',
+        completion: 85,
+        status: 'in-progress',
+      },
+      {
+        month: 12,
+        title: 'Implementation Phase 1',
+        completion: 60,
+        status: 'in-progress',
+      },
+      {
+        month: 18,
+        title: 'Mid-term Review',
+        completion: 30,
+        status: 'pending',
+      },
+      {
+        month: 24,
+        title: 'Full Implementation',
+        completion: 0,
+        status: 'pending',
+      },
+    ];
+
+    // SDG impact breakdown
+    const sdgImpacts = [
+      { sdg: sdgGoal, impact: predictedImpact, primary: true },
+      { sdg: '8', impact: predictedImpact * 0.6, primary: false },
+      { sdg: '10', impact: predictedImpact * 0.5, primary: false },
+      { sdg: '17', impact: predictedImpact * 0.4, primary: false },
+    ];
+
+    // Cost breakdown
+    const costBreakdown = [
+      { category: 'Personnel', amount: budgetNum * 0.35, percentage: 35 },
+      { category: 'Infrastructure', amount: budgetNum * 0.25, percentage: 25 },
+      { category: 'Operations', amount: budgetNum * 0.20, percentage: 20 },
+      { category: 'Technology', amount: budgetNum * 0.12, percentage: 12 },
+      { category: 'Contingency', amount: budgetNum * 0.08, percentage: 8 },
+    ];
+
+    // Key performance indicators
+    const kpis = [
+      {
+        name: 'Service Coverage',
+        current: selectedSector.currentPerformance,
+        projected: Math.min(95, selectedSector.currentPerformance + predictedImpact * 0.3),
+        unit: '%',
+      },
+      {
+        name: 'Beneficiary Reach',
+        current: Math.floor(beneficiaries * 0.5),
+        projected: beneficiaries,
+        unit: 'people',
+      },
+      {
+        name: 'Budget Efficiency',
+        current: 71,
+        projected: Math.min(90, 71 + predictedImpact * 0.2),
+        unit: '%',
+      },
+      {
+        name: 'Stakeholder Satisfaction',
+        current: 68,
+        projected: Math.min(92, 68 + predictedImpact * 0.25),
+        unit: '%',
+      },
+    ];
+
+    // Recommendations
+    const recommendations = [
+      {
+        priority: 'high',
+        title: 'Increase Stakeholder Engagement',
+        description: `Engage ${Math.floor(beneficiaries * 0.1)} stakeholders early in the process to ensure buy-in and reduce implementation risks.`,
+        impact: '+15% success rate',
+      },
+      {
+        priority: 'medium',
+        title: 'Phased Implementation Approach',
+        description: `Break down the ${timeframeNum}-year timeline into ${timeframeNum * 2} phases to allow for adjustments and learning.`,
+        impact: '+10% efficiency',
+      },
+      {
+        priority: 'high',
+        title: 'Risk Mitigation Strategy',
+        description: `Address ${selectedSector.riskFactors.length} key risk factors: ${selectedSector.riskFactors.join(', ')}.`,
+        impact: '-20% risk',
+      },
+      {
+        priority: 'medium',
+        title: 'Leverage Opportunities',
+        description: `Capitalize on ${selectedSector.opportunities.length} opportunities: ${selectedSector.opportunities.join(', ')}.`,
+        impact: '+25% impact',
+      },
+    ];
+
+    // Comparison with similar policies
+    const comparisons = [
+      {
+        country: 'Singapore',
+        policy: 'Similar initiative in 2020',
+        budget: budgetNum * 1.2,
+        impact: predictedImpact + 8,
+        timeframe: timeframeNum - 0.5,
+        outcome: 'Successful',
+      },
+      {
+        country: 'Denmark',
+        policy: 'Comparable program in 2019',
+        budget: budgetNum * 0.9,
+        impact: predictedImpact + 5,
+        timeframe: timeframeNum,
+        outcome: 'Successful',
+      },
+      {
+        country: 'Finland',
+        policy: 'Related project in 2021',
+        budget: budgetNum * 1.1,
+        impact: predictedImpact + 3,
+        timeframe: timeframeNum + 0.5,
+        outcome: 'Ongoing',
+      },
+    ];
+
+    const simulationResults = {
+      sector: selectedSector.name,
+      sdgGoal,
+      budgetAllocation: budgetNum,
+      timeframe: timeframeNum,
+      interventionType: interventionType || 'Standard',
+
+      overview: {
+        predictedImpact: Math.round(predictedImpact),
+        beneficiaries,
+        riskLevel,
+        riskScore,
+        confidenceLevel: 85,
+        successProbability: Math.round(100 - riskScore),
+      },
+
+      milestones,
+      sdgImpacts,
+      costBreakdown,
+      kpis,
+      recommendations,
+      comparisons,
+
+      riskFactors: selectedSector.riskFactors,
+      opportunities: selectedSector.opportunities,
+
+      metadata: {
+        simulationDate: new Date().toISOString(),
+        modelVersion: '2.1.0',
+        dataQuality: 'High',
+      },
+    };
+
+    return res.status(200).json({
+      success: true,
+      data: simulationResults,
+      message: 'Simulation completed successfully',
+    });
+  } catch (error) {
+    console.error('Policy simulation error:', error);
+    return res.status(500).json({
+      success: false,
+      error: 'Internal server error',
+      message: String(error),
+    });
+  }
+}
