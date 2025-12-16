Index: src/server/db/seeds/02-stakeholders-resources.ts
===================================================================
--- src/server/db/seeds/02-stakeholders-resources.ts	non-existent
+++ src/server/db/seeds/02-stakeholders-resources.ts	new file
@@ -0,0 +1,331 @@
+import { db } from '../client.js';
+import { stakeholders, resources, courses, articles, videos, internationalPartners, publicDocuments } from '../schema.js';
+
+export async function seedStakeholdersAndResources() {
+  console.log('🌱 Seeding stakeholders and resources...');
+
+  // 1. Seed Stakeholders
+  console.log('👥 Seeding stakeholders...');
+  await db.insert(stakeholders).values([
+    {
+      name: 'United Nations Development Programme',
+      type: 'international',
+      groupId: 5,
+      email: 'info@undp.org',
+      phone: '+1-212-906-5000',
+      organization: 'UNDP',
+      country: 'United States',
+      expertise: JSON.stringify(['Sustainable Development', 'Poverty Reduction', 'Governance']),
+      engagementLevel: 'high',
+      status: 'active',
+    },
+    {
+      name: 'World Health Organization',
+      type: 'international',
+      groupId: 5,
+      email: 'info@who.int',
+      phone: '+41-22-791-2111',
+      organization: 'WHO',
+      country: 'Switzerland',
+      expertise: JSON.stringify(['Public Health', 'Disease Prevention', 'Healthcare Systems']),
+      engagementLevel: 'high',
+      status: 'active',
+    },
+    {
+      name: 'Green Earth Foundation',
+      type: 'civil_society',
+      groupId: 2,
+      email: 'contact@greenearth.org',
+      phone: '+1-555-123-4567',
+      organization: 'Green Earth Foundation',
+      country: 'United States',
+      expertise: JSON.stringify(['Climate Action', 'Environmental Protection', 'Sustainability']),
+      engagementLevel: 'high',
+      status: 'active',
+    },
+    {
+      name: 'Tech for Good Initiative',
+      type: 'private_sector',
+      groupId: 3,
+      email: 'info@techforgood.com',
+      phone: '+1-555-987-6543',
+      organization: 'Tech for Good Inc.',
+      country: 'United States',
+      expertise: JSON.stringify(['Digital Innovation', 'Technology Access', 'Smart Cities']),
+      engagementLevel: 'medium',
+      status: 'active',
+    },
+    {
+      name: 'Global Education Alliance',
+      type: 'civil_society',
+      groupId: 2,
+      email: 'contact@globaledu.org',
+      phone: '+44-20-7946-0958',
+      organization: 'Global Education Alliance',
+      country: 'United Kingdom',
+      expertise: JSON.stringify(['Quality Education', 'Teacher Training', 'Educational Technology']),
+      engagementLevel: 'high',
+      status: 'active',
+    },
+    {
+      name: 'Sustainable Agriculture Network',
+      type: 'civil_society',
+      groupId: 2,
+      email: 'info@sustainableag.org',
+      phone: '+1-555-246-8135',
+      organization: 'SAN',
+      country: 'United States',
+      expertise: JSON.stringify(['Food Security', 'Sustainable Farming', 'Rural Development']),
+      engagementLevel: 'medium',
+      status: 'active',
+    },
+  ]);
+  console.log('✅ Stakeholders seeded (6 stakeholders)');
+
+  // 2. Seed Resources
+  console.log('📚 Seeding resources...');
+  await db.insert(resources).values([
+    {
+      title: 'SDG Implementation Toolkit',
+      description: 'Comprehensive guide for implementing SDG policies at national and local levels',
+      type: 'toolkit',
+      category: 'implementation',
+      fileUrl: '/assets/resources/sdg-implementation-toolkit.pdf',
+      fileSize: 5242880,
+      format: 'PDF',
+      language: 'English',
+      downloads: 1247,
+      rating: 4.8,
+      status: 'published',
+    },
+    {
+      title: 'Policy Monitoring Framework',
+      description: 'Framework for tracking and evaluating policy implementation progress',
+      type: 'guide',
+      category: 'monitoring',
+      fileUrl: '/assets/resources/policy-monitoring-framework.pdf',
+      fileSize: 3145728,
+      format: 'PDF',
+      language: 'English',
+      downloads: 892,
+      rating: 4.6,
+      status: 'published',
+    },
+    {
+      title: 'Stakeholder Engagement Best Practices',
+      description: 'Guide to effective stakeholder consultation and engagement strategies',
+      type: 'guide',
+      category: 'engagement',
+      fileUrl: '/assets/resources/stakeholder-engagement.pdf',
+      fileSize: 2097152,
+      format: 'PDF',
+      language: 'English',
+      downloads: 1056,
+      rating: 4.7,
+      status: 'published',
+    },
+    {
+      title: 'Data Collection Templates',
+      description: 'Standardized templates for SDG indicator data collection and reporting',
+      type: 'template',
+      category: 'data',
+      fileUrl: '/assets/resources/data-collection-templates.xlsx',
+      fileSize: 1048576,
+      format: 'Excel',
+      language: 'English',
+      downloads: 2134,
+      rating: 4.9,
+      status: 'published',
+    },
+  ]);
+  console.log('✅ Resources seeded (4 resources)');
+
+  // 3. Seed Courses
+  console.log('📖 Seeding courses...');
+  await db.insert(courses).values([
+    {
+      title: 'Introduction to Sustainable Development Goals',
+      description: 'Comprehensive overview of all 17 SDGs and their interconnections',
+      instructor: 'Dr. Sarah Johnson',
+      duration: 240,
+      level: 'beginner',
+      category: 'fundamentals',
+      enrollmentCount: 3456,
+      rating: 4.8,
+      status: 'published',
+    },
+    {
+      title: 'Policy Design for SDG Implementation',
+      description: 'Advanced course on designing effective policies aligned with SDG targets',
+      instructor: 'Prof. Michael Chen',
+      duration: 360,
+      level: 'advanced',
+      category: 'policy',
+      enrollmentCount: 1892,
+      rating: 4.9,
+      status: 'published',
+    },
+    {
+      title: 'Data-Driven Decision Making for SDGs',
+      description: 'Learn to use data analytics for SDG monitoring and evaluation',
+      instructor: 'Dr. Emily Rodriguez',
+      duration: 300,
+      level: 'intermediate',
+      category: 'data',
+      enrollmentCount: 2145,
+      rating: 4.7,
+      status: 'published',
+    },
+  ]);
+  console.log('✅ Courses seeded (3 courses)');
+
+  // 4. Seed Articles
+  console.log('📰 Seeding articles...');
+  await db.insert(articles).values([
+    {
+      title: 'Accelerating Progress on SDG 13: Climate Action Strategies',
+      content: 'Comprehensive analysis of effective climate action policies and their impact on SDG 13 targets...',
+      author: 'Dr. James Wilson',
+      category: 'climate',
+      tags: JSON.stringify(['Climate Action', 'SDG 13', 'Policy', 'Environment']),
+      views: 5678,
+      likes: 234,
+      status: 'published',
+    },
+    {
+      title: 'Gender Equality in Education: Bridging the Gap',
+      content: 'Exploring successful interventions for achieving gender parity in education systems...',
+      author: 'Prof. Maria Santos',
+      category: 'education',
+      tags: JSON.stringify(['Gender Equality', 'SDG 4', 'SDG 5', 'Education']),
+      views: 4321,
+      likes: 189,
+      status: 'published',
+    },
+    {
+      title: 'Sustainable Cities: Urban Planning for SDG 11',
+      content: 'Best practices in sustainable urban development and infrastructure planning...',
+      author: 'Dr. Robert Kim',
+      category: 'urban',
+      tags: JSON.stringify(['Sustainable Cities', 'SDG 11', 'Urban Planning', 'Infrastructure']),
+      views: 3892,
+      likes: 156,
+      status: 'published',
+    },
+  ]);
+  console.log('✅ Articles seeded (3 articles)');
+
+  // 5. Seed Videos
+  console.log('🎥 Seeding videos...');
+  await db.insert(videos).values([
+    {
+      title: 'Understanding the 2030 Agenda',
+      description: 'Introduction to the UN 2030 Agenda and the 17 Sustainable Development Goals',
+      url: 'https://www.youtube.com/watch?v=example1',
+      thumbnail: '/assets/videos/thumbnails/2030-agenda.jpg',
+      duration: 900,
+      category: 'fundamentals',
+      views: 12456,
+      likes: 892,
+      status: 'published',
+    },
+    {
+      title: 'Policy Simulation Workshop',
+      description: 'Step-by-step guide to using the SDG Hub policy simulation tool',
+      url: 'https://www.youtube.com/watch?v=example2',
+      thumbnail: '/assets/videos/thumbnails/policy-simulation.jpg',
+      duration: 1200,
+      category: 'tutorial',
+      views: 8234,
+      likes: 567,
+      status: 'published',
+    },
+  ]);
+  console.log('✅ Videos seeded (2 videos)');
+
+  // 6. Seed International Partners
+  console.log('🌍 Seeding international partners...');
+  await db.insert(internationalPartners).values([
+    {
+      name: 'United Nations Development Programme',
+      country: 'United States',
+      region: 'Global',
+      type: 'un_agency',
+      focusAreas: JSON.stringify(['Poverty Reduction', 'Governance', 'Climate Action']),
+      contactEmail: 'partnerships@undp.org',
+      contactPhone: '+1-212-906-5000',
+      website: 'https://www.undp.org',
+      partnershipLevel: 'strategic',
+      status: 'active',
+    },
+    {
+      name: 'World Bank',
+      country: 'United States',
+      region: 'Global',
+      type: 'multilateral',
+      focusAreas: JSON.stringify(['Economic Development', 'Infrastructure', 'Education']),
+      contactEmail: 'partnerships@worldbank.org',
+      contactPhone: '+1-202-473-1000',
+      website: 'https://www.worldbank.org',
+      partnershipLevel: 'strategic',
+      status: 'active',
+    },
+    {
+      name: 'European Union Development Cooperation',
+      country: 'Belgium',
+      region: 'Europe',
+      type: 'bilateral',
+      focusAreas: JSON.stringify(['Democracy', 'Human Rights', 'Sustainable Development']),
+      contactEmail: 'devco@ec.europa.eu',
+      contactPhone: '+32-2-299-1111',
+      website: 'https://ec.europa.eu/international-partnerships',
+      partnershipLevel: 'operational',
+      status: 'active',
+    },
+  ]);
+  console.log('✅ International Partners seeded (3 partners)');
+
+  // 7. Seed Public Documents
+  console.log('📄 Seeding public documents...');
+  await db.insert(publicDocuments).values([
+    {
+      title: 'National SDG Progress Report 2024',
+      description: 'Comprehensive report on national progress towards achieving the SDGs',
+      category: 'report',
+      fileUrl: '/assets/documents/sdg-progress-report-2024.pdf',
+      fileSize: 8388608,
+      format: 'PDF',
+      language: 'English',
+      ministry: 'Ministry of Finance',
+      downloads: 3456,
+      status: 'published',
+    },
+    {
+      title: 'Climate Action Policy Framework',
+      description: 'National framework for climate change mitigation and adaptation',
+      category: 'policy',
+      fileUrl: '/assets/documents/climate-action-framework.pdf',
+      fileSize: 4194304,
+      format: 'PDF',
+      language: 'English',
+      ministry: 'Ministry of Environment',
+      downloads: 2134,
+      status: 'published',
+    },
+    {
+      title: 'Education Sector Strategic Plan 2024-2030',
+      description: 'Strategic plan for education sector development aligned with SDG 4',
+      category: 'plan',
+      fileUrl: '/assets/documents/education-strategic-plan.pdf',
+      fileSize: 5242880,
+      format: 'PDF',
+      language: 'English',
+      ministry: 'Ministry of Education',
+      downloads: 1892,
+      status: 'published',
+    },
+  ]);
+  console.log('✅ Public Documents seeded (3 documents)');
+
+  console.log('✅ Stakeholders and resources seeding completed!');
+}
