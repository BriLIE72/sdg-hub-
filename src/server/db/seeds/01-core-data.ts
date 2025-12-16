Index: src/server/db/seeds/01-core-data.ts
===================================================================
--- src/server/db/seeds/01-core-data.ts	non-existent
+++ src/server/db/seeds/01-core-data.ts	new file
@@ -0,0 +1,415 @@
+import { db } from '../client.js';
+import { ministries, sdgGoals, sdgTargets, sdgIndicators, stakeholderGroups } from '../schema.js';
+
+export async function seedCoreData() {
+  console.log('🌱 Seeding core data...');
+
+  // 1. Seed Ministries (10 ministries)
+  console.log('📊 Seeding ministries...');
+  await db.insert(ministries).values([
+    {
+      name: 'Ministry of Health',
+      code: 'MOH',
+      description: 'Responsible for public health, healthcare services, and medical infrastructure',
+      budget: 5000000000,
+      budgetUtilized: 3750000000,
+      projectCount: 45,
+      sdgFocus: JSON.stringify([3, 5, 10]),
+      performanceScore: 87,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Education',
+      code: 'MOE',
+      description: 'Oversees education policy, schools, universities, and educational programs',
+      budget: 4500000000,
+      budgetUtilized: 3600000000,
+      projectCount: 38,
+      sdgFocus: JSON.stringify([4, 5, 8]),
+      performanceScore: 92,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Energy',
+      code: 'MOEN',
+      description: 'Manages energy policy, renewable energy, and power infrastructure',
+      budget: 6000000000,
+      budgetUtilized: 4800000000,
+      projectCount: 28,
+      sdgFocus: JSON.stringify([7, 9, 13]),
+      performanceScore: 85,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Technology',
+      code: 'MOT',
+      description: 'Drives digital transformation, innovation, and technology infrastructure',
+      budget: 3500000000,
+      budgetUtilized: 2800000000,
+      projectCount: 32,
+      sdgFocus: JSON.stringify([9, 11, 17]),
+      performanceScore: 90,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Social Welfare',
+      code: 'MOSW',
+      description: 'Provides social services, poverty alleviation, and community support',
+      budget: 4000000000,
+      budgetUtilized: 3200000000,
+      projectCount: 52,
+      sdgFocus: JSON.stringify([1, 2, 10]),
+      performanceScore: 88,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Environment',
+      code: 'MOENV',
+      description: 'Protects environment, manages natural resources, and climate action',
+      budget: 3800000000,
+      budgetUtilized: 3040000000,
+      projectCount: 35,
+      sdgFocus: JSON.stringify([13, 14, 15]),
+      performanceScore: 86,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Infrastructure',
+      code: 'MOI',
+      description: 'Develops transportation, housing, and urban infrastructure',
+      budget: 7000000000,
+      budgetUtilized: 5600000000,
+      projectCount: 42,
+      sdgFocus: JSON.stringify([9, 11, 6]),
+      performanceScore: 84,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Agriculture',
+      code: 'MOA',
+      description: 'Supports agriculture, food security, and rural development',
+      budget: 4200000000,
+      budgetUtilized: 3360000000,
+      projectCount: 48,
+      sdgFocus: JSON.stringify([2, 12, 15]),
+      performanceScore: 89,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Labor',
+      code: 'MOL',
+      description: 'Manages employment, labor rights, and workforce development',
+      budget: 3200000000,
+      budgetUtilized: 2560000000,
+      projectCount: 36,
+      sdgFocus: JSON.stringify([8, 10, 5]),
+      performanceScore: 87,
+      status: 'active',
+    },
+    {
+      name: 'Ministry of Finance',
+      code: 'MOF',
+      description: 'Oversees national budget, economic policy, and financial management',
+      budget: 5500000000,
+      budgetUtilized: 4400000000,
+      projectCount: 30,
+      sdgFocus: JSON.stringify([8, 9, 17]),
+      performanceScore: 91,
+      status: 'active',
+    },
+  ]);
+  console.log('✅ Ministries seeded (10 ministries)');
+
+  // 2. Seed SDG Goals (17 goals)
+  console.log('🎯 Seeding SDG goals...');
+  await db.insert(sdgGoals).values([
+    {
+      goalNumber: 1,
+      title: 'No Poverty',
+      description: 'End poverty in all its forms everywhere',
+      progress: 68,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 2,
+      title: 'Zero Hunger',
+      description: 'End hunger, achieve food security and improved nutrition',
+      progress: 72,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 3,
+      title: 'Good Health and Well-being',
+      description: 'Ensure healthy lives and promote well-being for all',
+      progress: 75,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 4,
+      title: 'Quality Education',
+      description: 'Ensure inclusive and equitable quality education',
+      progress: 78,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 5,
+      title: 'Gender Equality',
+      description: 'Achieve gender equality and empower all women and girls',
+      progress: 65,
+      status: 'needs_attention',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 6,
+      title: 'Clean Water and Sanitation',
+      description: 'Ensure availability and sustainable management of water',
+      progress: 70,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 7,
+      title: 'Affordable and Clean Energy',
+      description: 'Ensure access to affordable, reliable, sustainable energy',
+      progress: 73,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 8,
+      title: 'Decent Work and Economic Growth',
+      description: 'Promote sustained, inclusive economic growth and employment',
+      progress: 71,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 9,
+      title: 'Industry, Innovation and Infrastructure',
+      description: 'Build resilient infrastructure, promote innovation',
+      progress: 69,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 10,
+      title: 'Reduced Inequalities',
+      description: 'Reduce inequality within and among countries',
+      progress: 62,
+      status: 'needs_attention',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 11,
+      title: 'Sustainable Cities and Communities',
+      description: 'Make cities inclusive, safe, resilient and sustainable',
+      progress: 67,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 12,
+      title: 'Responsible Consumption and Production',
+      description: 'Ensure sustainable consumption and production patterns',
+      progress: 64,
+      status: 'needs_attention',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 13,
+      title: 'Climate Action',
+      description: 'Take urgent action to combat climate change',
+      progress: 58,
+      status: 'at_risk',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 14,
+      title: 'Life Below Water',
+      description: 'Conserve and sustainably use oceans, seas and marine resources',
+      progress: 61,
+      status: 'needs_attention',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 15,
+      title: 'Life on Land',
+      description: 'Protect, restore and promote sustainable use of ecosystems',
+      progress: 66,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 16,
+      title: 'Peace, Justice and Strong Institutions',
+      description: 'Promote peaceful and inclusive societies',
+      progress: 70,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+    {
+      goalNumber: 17,
+      title: 'Partnerships for the Goals',
+      description: 'Strengthen means of implementation and global partnership',
+      progress: 74,
+      status: 'on_track',
+      targetYear: 2030,
+      lastUpdated: new Date(),
+    },
+  ]);
+  console.log('✅ SDG Goals seeded (17 goals)');
+
+  // 3. Seed SDG Targets (sample targets for first 3 goals)
+  console.log('🎯 Seeding SDG targets...');
+  await db.insert(sdgTargets).values([
+    {
+      goalId: 1,
+      targetNumber: '1.1',
+      description: 'Eradicate extreme poverty for all people everywhere',
+      progress: 70,
+      status: 'on_track',
+    },
+    {
+      goalId: 1,
+      targetNumber: '1.2',
+      description: 'Reduce at least by half the proportion of people living in poverty',
+      progress: 65,
+      status: 'on_track',
+    },
+    {
+      goalId: 2,
+      targetNumber: '2.1',
+      description: 'End hunger and ensure access to safe, nutritious food',
+      progress: 72,
+      status: 'on_track',
+    },
+    {
+      goalId: 2,
+      targetNumber: '2.2',
+      description: 'End all forms of malnutrition',
+      progress: 68,
+      status: 'on_track',
+    },
+    {
+      goalId: 3,
+      targetNumber: '3.1',
+      description: 'Reduce global maternal mortality ratio',
+      progress: 75,
+      status: 'on_track',
+    },
+    {
+      goalId: 3,
+      targetNumber: '3.2',
+      description: 'End preventable deaths of newborns and children',
+      progress: 78,
+      status: 'on_track',
+    },
+  ]);
+  console.log('✅ SDG Targets seeded (6 sample targets)');
+
+  // 4. Seed SDG Indicators (sample indicators)
+  console.log('📊 Seeding SDG indicators...');
+  await db.insert(sdgIndicators).values([
+    {
+      targetId: 1,
+      indicatorNumber: '1.1.1',
+      description: 'Proportion of population below international poverty line',
+      value: 8.5,
+      unit: 'percentage',
+      baseline: 12.0,
+      target: 0,
+      status: 'on_track',
+    },
+    {
+      targetId: 2,
+      indicatorNumber: '1.2.1',
+      description: 'Proportion of population living below national poverty line',
+      value: 15.2,
+      unit: 'percentage',
+      baseline: 22.0,
+      target: 11.0,
+      status: 'on_track',
+    },
+    {
+      targetId: 3,
+      indicatorNumber: '2.1.1',
+      description: 'Prevalence of undernourishment',
+      value: 9.8,
+      unit: 'percentage',
+      baseline: 14.5,
+      target: 5.0,
+      status: 'on_track',
+    },
+  ]);
+  console.log('✅ SDG Indicators seeded (3 sample indicators)');
+
+  // 5. Seed Stakeholder Groups
+  console.log('👥 Seeding stakeholder groups...');
+  await db.insert(stakeholderGroups).values([
+    {
+      name: 'Government Agencies',
+      description: 'Federal and local government departments and agencies',
+      category: 'government',
+      memberCount: 45,
+      status: 'active',
+    },
+    {
+      name: 'Civil Society Organizations',
+      description: 'NGOs, community groups, and advocacy organizations',
+      category: 'civil_society',
+      memberCount: 128,
+      status: 'active',
+    },
+    {
+      name: 'Private Sector',
+      description: 'Businesses, corporations, and industry associations',
+      category: 'private_sector',
+      memberCount: 87,
+      status: 'active',
+    },
+    {
+      name: 'Academic Institutions',
+      description: 'Universities, research centers, and educational institutions',
+      category: 'academia',
+      memberCount: 34,
+      status: 'active',
+    },
+    {
+      name: 'International Organizations',
+      description: 'UN agencies, multilateral organizations, and international NGOs',
+      category: 'international',
+      memberCount: 23,
+      status: 'active',
+    },
+    {
+      name: 'Media Organizations',
+      description: 'News outlets, journalists, and media platforms',
+      category: 'media',
+      memberCount: 19,
+      status: 'active',
+    },
+  ]);
+  console.log('✅ Stakeholder Groups seeded (6 groups)');
+
+  console.log('✅ Core data seeding completed!');
+}
