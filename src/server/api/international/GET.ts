Index: src/server/api/international/GET.ts
===================================================================
--- src/server/api/international/GET.ts	original
+++ src/server/api/international/GET.ts	modified
@@ -1,376 +1,63 @@
 import type { Request, Response } from 'express';
+import { db } from '../../../db/client.js';
+import { internationalPartners, internationalProjects, fundingOpportunities, experts } from '../../../db/schema.js';
+import { desc, eq } from 'drizzle-orm';
 
 export default async function handler(req: Request, res: Response) {
   try {
-    // In production, fetch from database
-    // For now, return comprehensive international cooperation data
-    const internationalData = {
-      overview: {
-        totalPartners: 45,
-        activeProjects: 128,
-        fundingCommitted: 2450000000,
-        fundingDisbursed: 1820000000,
-        countriesCollaborating: 32,
-        lastUpdated: new Date().toISOString(),
-      },
+    // Fetch all international cooperation data from database
+    const [
+      partnersData,
+      projectsData,
+      fundingData,
+      expertsData
+    ] = await Promise.all([
+      db.select().from(internationalPartners).where(eq(internationalPartners.status, 'active')).orderBy(desc(internationalPartners.createdAt)),
+      db.select().from(internationalProjects).where(eq(internationalProjects.status, 'active')).orderBy(desc(internationalProjects.startDate)),
+      db.select().from(fundingOpportunities).where(eq(fundingOpportunities.status, 'open')).orderBy(desc(fundingOpportunities.deadline)),
+      db.select().from(experts).where(eq(experts.availability, 'available')).orderBy(desc(experts.createdAt))
+    ]);
 
-      partners: [
-        {
-          id: 1,
-          name: 'United Nations Development Programme (UNDP)',
-          type: 'UN Agency',
-          country: 'Global',
-          logo: '/images/partners/undp.png',
-          since: '2018',
-          activeProjects: 24,
-          totalFunding: 450000000,
-          sdgs: ['SDG 1', 'SDG 2', 'SDG 3', 'SDG 8', 'SDG 10'],
-          focusAreas: ['Poverty Reduction', 'Sustainable Development', 'Governance'],
-          contactPerson: 'Dr. Sarah Johnson',
-          contactEmail: 'sarah.johnson@undp.org',
-          website: 'https://www.undp.org',
-          description:
-            'UNDP works in nearly 170 countries and territories, helping to eradicate poverty, reduce inequalities and build resilience.',
-        },
-        {
-          id: 2,
-          name: 'World Bank',
-          type: 'International Financial Institution',
-          country: 'Global',
-          logo: '/images/partners/worldbank.png',
-          since: '2015',
-          activeProjects: 18,
-          totalFunding: 850000000,
-          sdgs: ['SDG 1', 'SDG 4', 'SDG 7', 'SDG 9', 'SDG 11'],
-          focusAreas: ['Infrastructure', 'Education', 'Energy', 'Urban Development'],
-          contactPerson: 'Mr. Michael Chen',
-          contactEmail: 'mchen@worldbank.org',
-          website: 'https://www.worldbank.org',
-          description:
-            'The World Bank provides financial and technical assistance to developing countries for development programs.',
-        },
-        {
-          id: 3,
-          name: 'European Union',
-          type: 'Regional Organization',
-          country: 'Europe',
-          logo: '/images/partners/eu.png',
-          since: '2019',
-          activeProjects: 15,
-          totalFunding: 320000000,
-          sdgs: ['SDG 5', 'SDG 7', 'SDG 13', 'SDG 17'],
-          focusAreas: ['Gender Equality', 'Climate Action', 'Renewable Energy'],
-          contactPerson: 'Ms. Emily Rodriguez',
-          contactEmail: 'emily.rodriguez@eeas.europa.eu',
-          website: 'https://ec.europa.eu',
-          description:
-            'The EU supports sustainable development through partnerships, funding, and technical cooperation.',
-        },
-        {
-          id: 4,
-          name: 'Bill & Melinda Gates Foundation',
-          type: 'Private Foundation',
-          country: 'United States',
-          logo: '/images/partners/gates.png',
-          since: '2020',
-          activeProjects: 12,
-          totalFunding: 280000000,
-          sdgs: ['SDG 2', 'SDG 3', 'SDG 4', 'SDG 6'],
-          focusAreas: ['Health', 'Agriculture', 'Education', 'Water & Sanitation'],
-          contactPerson: 'Dr. Lisa Wang',
-          contactEmail: 'lisa.wang@gatesfoundation.org',
-          website: 'https://www.gatesfoundation.org',
-          description:
-            'The foundation works to help all people lead healthy, productive lives through strategic partnerships.',
-        },
-        {
-          id: 5,
-          name: 'Asian Development Bank (ADB)',
-          type: 'Regional Development Bank',
-          country: 'Asia-Pacific',
-          logo: '/images/partners/adb.png',
-          since: '2017',
-          activeProjects: 20,
-          totalFunding: 550000000,
-          sdgs: ['SDG 7', 'SDG 9', 'SDG 11', 'SDG 13'],
-          focusAreas: ['Infrastructure', 'Energy', 'Transport', 'Climate Resilience'],
-          contactPerson: 'Mr. David Thompson',
-          contactEmail: 'dthompson@adb.org',
-          website: 'https://www.adb.org',
-          description:
-            'ADB is committed to achieving a prosperous, inclusive, resilient, and sustainable Asia and the Pacific.',
-        },
-      ],
+    // Calculate statistics
+    const stats = {
+      totalPartners: partnersData.length,
+      totalProjects: projectsData.length,
+      totalFunding: fundingData.reduce((sum, f) => sum + (f.amount || 0), 0),
+      totalExperts: expertsData.length,
+      activeProjects: projectsData.filter(p => p.status === 'active').length,
+      completedProjects: projectsData.filter(p => p.status === 'completed').length
+    };
 
-      projects: [
-        {
-          id: 1,
-          title: 'National Digital Infrastructure Program',
-          partner: 'World Bank',
-          sdg: 'SDG 9',
-          status: 'active',
-          startDate: '2023-01-15',
-          endDate: '2026-12-31',
-          budget: 125000000,
-          disbursed: 78000000,
-          progress: 62,
-          beneficiaries: 45000000,
-          description:
-            'Building nationwide digital infrastructure to bridge the digital divide and enable access to government services.',
-          milestones: [
-            { name: 'Infrastructure Planning', status: 'completed', date: '2023-06-30' },
-            { name: 'Phase 1 Deployment', status: 'completed', date: '2024-03-31' },
-            { name: 'Phase 2 Deployment', status: 'in-progress', date: '2025-06-30' },
-            { name: 'Final Rollout', status: 'pending', date: '2026-12-31' },
-          ],
-          outcomes: [
-            '25 million people connected to high-speed internet',
-            '5,000 digital service centers established',
-            '10,000 government officials trained',
-          ],
-        },
-        {
-          id: 2,
-          title: 'Renewable Energy Transition Initiative',
-          partner: 'Asian Development Bank',
-          sdg: 'SDG 7',
-          status: 'active',
-          startDate: '2022-06-01',
-          endDate: '2027-05-31',
-          budget: 450000000,
-          disbursed: 285000000,
-          progress: 63,
-          beneficiaries: 12000000,
-          description:
-            'Large-scale renewable energy deployment including solar, wind, and hydroelectric projects.',
-          milestones: [
-            { name: 'Feasibility Studies', status: 'completed', date: '2022-12-31' },
-            { name: 'Solar Farm Construction', status: 'completed', date: '2024-06-30' },
-            { name: 'Wind Energy Deployment', status: 'in-progress', date: '2025-12-31' },
-            { name: 'Grid Integration', status: 'pending', date: '2027-05-31' },
-          ],
-          outcomes: [
-            '2,500 MW renewable energy capacity added',
-            '8 million tons CO2 emissions reduced annually',
-            '15,000 green jobs created',
-          ],
-        },
-        {
-          id: 3,
-          title: 'Universal Healthcare Access Program',
-          partner: 'UNDP',
-          sdg: 'SDG 3',
-          status: 'active',
-          startDate: '2021-09-01',
-          endDate: '2026-08-31',
-          budget: 380000000,
-          disbursed: 298000000,
-          progress: 78,
-          beneficiaries: 85000000,
-          description:
-            'Expanding healthcare coverage to underserved populations through mobile clinics and telemedicine.',
-          milestones: [
-            { name: 'Baseline Assessment', status: 'completed', date: '2021-12-31' },
-            { name: 'Mobile Clinic Deployment', status: 'completed', date: '2023-06-30' },
-            { name: 'Telemedicine Platform', status: 'completed', date: '2024-03-31' },
-            { name: 'Scale-up Phase', status: 'in-progress', date: '2026-08-31' },
-          ],
-          outcomes: [
-            '65 million people gained healthcare access',
-            '2,500 mobile health units deployed',
-            '50,000 healthcare workers trained',
-          ],
-        },
-        {
-          id: 4,
-          title: 'Climate-Smart Agriculture Initiative',
-          partner: 'Bill & Melinda Gates Foundation',
-          sdg: 'SDG 2',
-          status: 'active',
-          startDate: '2023-03-01',
-          endDate: '2028-02-29',
-          budget: 180000000,
-          disbursed: 72000000,
-          progress: 40,
-          beneficiaries: 5000000,
-          description:
-            'Promoting sustainable farming practices and climate-resilient crops to improve food security.',
-          milestones: [
-            { name: 'Research & Development', status: 'completed', date: '2023-12-31' },
-            { name: 'Pilot Programs', status: 'in-progress', date: '2024-12-31' },
-            { name: 'Farmer Training', status: 'in-progress', date: '2026-06-30' },
-            { name: 'National Rollout', status: 'pending', date: '2028-02-29' },
-          ],
-          outcomes: [
-            '2 million farmers trained in sustainable practices',
-            '30% increase in crop yields',
-            '1.5 million hectares under climate-smart agriculture',
-          ],
-        },
-      ],
+    // Get featured content
+    const featuredPartners = partnersData
+      .filter(p => p.type === 'UN Agency' || p.type === 'International Organization')
+      .slice(0, 5);
 
-      fundingOpportunities: [
-        {
-          id: 1,
-          title: 'Green Climate Fund - Adaptation Projects',
-          organization: 'Green Climate Fund',
-          amount: 50000000,
-          deadline: '2025-03-31',
-          sdgs: ['SDG 13', 'SDG 11', 'SDG 15'],
-          eligibility: 'Government agencies, NGOs, research institutions',
-          description:
-            'Funding for climate adaptation projects including infrastructure resilience, ecosystem restoration, and community preparedness.',
-          applicationLink: 'https://www.greenclimate.fund/apply',
-          status: 'open',
-        },
-        {
-          id: 2,
-          title: 'Global Partnership for Education',
-          organization: 'World Bank',
-          amount: 75000000,
-          deadline: '2025-06-30',
-          sdgs: ['SDG 4'],
-          eligibility: 'Ministries of Education, educational institutions',
-          description:
-            'Support for education system strengthening, teacher training, and infrastructure development.',
-          applicationLink: 'https://www.globalpartnership.org/funding',
-          status: 'open',
-        },
-        {
-          id: 3,
-          title: 'Digital Development Partnership',
-          organization: 'UNDP',
-          amount: 30000000,
-          deadline: '2025-04-15',
-          sdgs: ['SDG 9', 'SDG 17'],
-          eligibility: 'Government agencies, tech companies, startups',
-          description:
-            'Funding for digital transformation initiatives including e-governance, digital literacy, and innovation hubs.',
-          applicationLink: 'https://www.undp.org/digital-development',
-          status: 'open',
-        },
-      ],
+    const upcomingDeadlines = fundingData
+      .filter(f => f.deadline && new Date(f.deadline) > new Date())
+      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
+      .slice(0, 5);
 
-      expertNetwork: [
-        {
-          id: 1,
-          name: 'Dr. Sarah Johnson',
-          title: 'Senior Policy Advisor',
-          organization: 'UNDP',
-          expertise: ['Poverty Reduction', 'Social Protection', 'SDG Implementation'],
-          country: 'United States',
-          email: 'sarah.johnson@undp.org',
-          linkedin: 'https://linkedin.com/in/sarahjohnson',
-          available: true,
-          languages: ['English', 'Spanish', 'French'],
-          bio: '15+ years experience in international development and SDG implementation across 30 countries.',
-        },
-        {
-          id: 2,
-          name: 'Prof. Michael Chen',
-          title: 'Climate Finance Specialist',
-          organization: 'World Bank',
-          expertise: ['Climate Finance', 'Green Bonds', 'Carbon Markets'],
-          country: 'Singapore',
-          email: 'mchen@worldbank.org',
-          linkedin: 'https://linkedin.com/in/michaelchen',
-          available: true,
-          languages: ['English', 'Mandarin'],
-          bio: 'Leading expert in climate finance with $2B+ in green financing mobilized.',
-        },
-        {
-          id: 3,
-          name: 'Dr. Emily Rodriguez',
-          title: 'Gender Equality Advisor',
-          organization: 'European Union',
-          expertise: ['Gender Mainstreaming', 'Women Empowerment', 'Policy Design'],
-          country: 'Spain',
-          email: 'emily.rodriguez@eeas.europa.eu',
-          linkedin: 'https://linkedin.com/in/emilyrodriguez',
-          available: false,
-          languages: ['English', 'Spanish', 'French'],
-          bio: 'Championing gender equality in development programs across Europe and Asia.',
-        },
-      ],
-
-      knowledgeExchange: [
-        {
-          id: 1,
-          title: 'South-South Cooperation: Best Practices in Healthcare',
-          type: 'Case Study',
-          country: 'Brazil',
-          sdg: 'SDG 3',
-          publishedDate: '2024-11-15',
-          downloads: 2450,
-          description:
-            'How Brazil achieved universal healthcare coverage through innovative financing and community health workers.',
-          downloadLink: '/resources/brazil-healthcare.pdf',
-        },
-        {
-          id: 2,
-          title: 'Digital Governance Transformation in Estonia',
-          type: 'Success Story',
-          country: 'Estonia',
-          sdg: 'SDG 16',
-          publishedDate: '2024-10-20',
-          downloads: 3120,
-          description:
-            'Estonia\'s journey to becoming a digital society with 99% of government services online.',
-          downloadLink: '/resources/estonia-digital.pdf',
-        },
-        {
-          id: 3,
-          title: 'Renewable Energy Policy Framework - Denmark',
-          type: 'Policy Document',
-          country: 'Denmark',
-          sdg: 'SDG 7',
-          publishedDate: '2024-09-10',
-          downloads: 1890,
-          description:
-            'Comprehensive policy framework that enabled Denmark to achieve 80% renewable energy.',
-          downloadLink: '/resources/denmark-energy.pdf',
-        },
-      ],
-
-      insights: [
-        {
-          type: 'opportunity',
-          title: 'New Funding Window Opening',
-          description:
-            'Green Climate Fund announces $500M adaptation funding for Asia-Pacific. Application deadline: March 31, 2025.',
-          priority: 'high',
-          date: '2024-12-10',
-        },
-        {
-          type: 'success',
-          title: 'Project Milestone Achieved',
-          description:
-            'Universal Healthcare Access Program reached 65 million beneficiaries, exceeding target by 15%.',
-          priority: 'medium',
-          date: '2024-12-08',
-        },
-        {
-          type: 'alert',
-          title: 'Expert Visit Scheduled',
-          description:
-            'Dr. Sarah Johnson (UNDP) visiting next month for policy consultation. Schedule meetings now.',
-          priority: 'high',
-          date: '2024-12-05',
-        },
-      ],
-    };
-
-    return res.status(200).json({
+    res.json({
       success: true,
-      data: internationalData,
-      timestamp: new Date().toISOString(),
+      data: {
+        stats,
+        partners: partnersData,
+        projects: projectsData,
+        funding: fundingData,
+        experts: expertsData,
+        featured: {
+          partners: featuredPartners,
+          upcomingDeadlines
+        }
+      }
     });
   } catch (error) {
-    console.error('International cooperation data error:', error);
-    return res.status(500).json({
+    console.error('International API Error:', error);
+    res.status(500).json({
       success: false,
-      error: 'Internal server error',
-      message: String(error),
+      error: 'Failed to fetch international cooperation data',
+      message: error instanceof Error ? error.message : 'Unknown error'
     });
   }
 }
