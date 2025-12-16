-import { useState } from 'react';
-import { SEOHead } from '@/components/SEOHead';
-import { Button } from '@/components/ui/button';
+import { useState, useEffect } from 'react';
+import { Link } from 'react-router-dom';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
+import { Button } from '@/components/ui/button';
+import { Progress } from '@/components/ui/progress';
 import { Separator } from '@/components/ui/separator';
 import {
-  BookOpen,
-  Briefcase,
-  Factory,
-  Truck,
-  Zap,
-  Heart,
-  Wheat,
-  Building2,
-  Plane,
-  Laptop,
-  HardHat,
-  FileText,
-  Sparkles,
   TrendingUp,
+  TrendingDown,
   Target,
-  CheckCircle2,
+  Users,
+  DollarSign,
   AlertCircle,
   Download,
-  Eye,
-  Play,
-  ArrowRight,
-  Globe,
+  RefreshCw,
+  BarChart3,
+  CheckCircle,
+  AlertTriangle,
+  Calendar,
+  FileText,
+  Activity,
   Award,
-  Lightbulb,
-  MapPin,
+  Zap,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-// Sector definitions
-const sectors = [
-  { id: 'education', name: 'Education', icon: BookOpen, color: 'bg-blue-500' },
-  { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'bg-red-500' },
-  { id: 'transport', name: 'Transport', icon: Truck, color: 'bg-orange-500' },
-];
+interface DashboardData {
+  overview: {
+    totalPolicies: number;
+    activePolicies: number;
+    totalBudget: number;
+    budgetUtilization: number;
+    stakeholders: number;
+    sdgsTracked: number;
+  };
+  sdgProgress: Array<{
+    sdg: number;
+    title: string;
+    progress: number;
+    trend: string;
+    status: string;
+  }>;
+  recentPolicies: Array<{
+    id: number;
+    title: string;
+    sdg: string;
+    status: string;
+    progress: number;
+    budget: number;
+    startDate: string;
+    endDate: string;
+    ministry: string;
+    priority: string;
+  }>;
+  budgetByMinistry: Array<{
+    ministry: string;
+    allocated: number;
+    utilized: number;
+    utilization: number;
+    projects: number;
+    sdgFocus: string[];
+    performance: number;
+  }>;
+  upcomingMilestones: Array<{
+    id: number;
+    title: string;
+    date: string;
+    type: string;
+    priority: string;
+    description: string;
+  }>;
+  recentActivity: Array<{
+    id: number;
+    action: string;
+    user: string;
+    timestamp: string;
+    type: string;
+  }>;
+  performanceMetrics: {
+    policyEffectiveness: number;
+    stakeholderSatisfaction: number;
+    budgetEfficiency: number;
+    timelinessScore: number;
+    innovationIndex: number;
+    collaborationScore: number;
+  };
+  alerts: Array<{
+    id: number;
+    type: string;
+    title: string;
+    message: string;
+    priority: string;
+    timestamp: string;
+  }>;
+  recommendations: Array<{
+    id: number;
+    title: string;
+    description: string;
+    priority: string;
+    impact: string;
+    effort: string;
+    estimatedCost: number;
+  }>;
+  topPerformers: Array<{
+    ministry: string;
+    score: number;
+    improvement: number;
+  }>;
+}
 
-// All existing policies removed to optimize memory and reduce file size
-// Only AI-generated policy recommendations are kept
+export default function DashboardPage() {
+  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
+  const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
 
-// Removed arrays:
-// - existingEducationPolicies
-// - existingIndustryManufacturingPolicies
-// - existingIndustryPolicies
-// - existingRuralDevelopmentPolicies
-// - existingBiodiversityPolicies
-// - existingDefenseSecurityPolicies
-// - existingHealthcarePolicies
-// - existingBankingFinancePolicies
-// - existingTradePolicies
-// - existingEnvironmentalPolicies
-// - existingTransportPolicies
-// - existingEmploymentPolicies
+  useEffect(() => {
+    fetchDashboardData();
+  }, []);
 
-// Placeholder for removed arrays
-const existingIndustryManufacturingPolicies: any[] = [];
-const existingIndustryPolicies: any[] = [];
-const existingRuralDevelopmentPolicies: any[] = [];
-const existingBiodiversityPolicies: any[] = [];
-const existingDefenseSecurityPolicies: any[] = [];
-const existingHealthcarePolicies: any[] = [];
-const existingBankingFinancePolicies: any[] = [];
-const existingTradePolicies: any[] = [];
-const existingEnvironmentalPolicies: any[] = [];
-const existingTransportPolicies: any[] = [];
-const existingEmploymentPolicies: any[] = [];
+  const fetchDashboardData = async () => {
+    setLoading(true);
+    setError('');
 
-// Old policy arrays content removed to save memory
-// All existing policy arrays are now empty: []
+    try {
+      const response = await fetch('/api/dashboard');
+      const data = await response.json();
 
-
-// AI-Generated Policy Recommendations for Education (Simplified)
-const generateEducationPolicies = () => {
-  return [
-    {
-      id: 'education-enrollment',
-      name: 'Enrollment Encouragement Policy',
-      description: 'Achieve 100% enrollment for children aged 5-10 through door-to-door campaigns, incentives for parents, free transportation, and community engagement programs. Target: Universal enrollment by 2027.',
-      impact: 'High',
-      category: 'Access & Participation',
-      indicators: ['Enrollment Rates', 'Net Enrollment Rate (NER)'],
-      timeline: '3 years',
-      budget: '₹15,000 Cr',
-    },
-    {
-      id: 'education-teacher-excellence',
-      name: 'Guru Star - Teacher Excellence Program',
-      description: 'Comprehensive teacher incentive program including performance bonuses, career advancement opportunities, continuous professional development, housing benefits, and recognition awards to attract and retain quality educators.',
-      impact: 'High',
-      category: 'Quality of Education',
-      indicators: ['Teacher Qualifications', 'Student-Teacher Ratio', 'Learning Outcomes'],
-      timeline: '5 years',
-      budget: '₹25,000 Cr',
-    },
-    {
-      name: 'Digital Classroom Revolution',
-      description: 'Equip every school with smart classrooms, high-speed internet, tablets for students, AI-powered learning platforms, and digital content in regional languages. Focus on bridging urban-rural digital divide.',
-      impact: 'Very High',
-      category: 'Technology Integration',
-      indicators: ['Access to Digital Tools', 'E-Learning Participation', 'Digital Literacy'],
-      timeline: '4 years',
-      budget: '₹40,000 Cr',
-      competitorCountry: '🇰🇷 South Korea',
-      successRate: '97%',
-      implementationSummary: 'South Korea achieved 97% digital education coverage through government-funded devices, high-speed internet, and digital textbooks. India can exceed this by leveraging low-cost tablets (Made in India), solar-powered classrooms for off-grid areas, AI tutors in regional languages, and integrating with existing DIKSHA and SWAYAM platforms.',
-      bestPractices: [
-        'Government-funded tablets for every student',
-        'High-speed internet (100 Mbps) in all schools',
-        'Digital textbooks with interactive content',
-        'AI-powered personalized learning platforms',
-      ],
-      indiaAdaptations: [
-        'Low-cost tablets (₹5,000) manufactured in India',
-        'Solar-powered classrooms for off-grid rural areas',
-        'AI tutors in 22 regional languages',
-        'Integration with DIKSHA, SWAYAM, and PM eVIDYA',
-      ],
-    },
-    {
-      name: 'Equity Bridge Program',
-      description: 'Targeted support for marginalized communities including free education materials, special coaching, mentorship programs, disability-friendly infrastructure, and scholarships for SC/ST/OBC students.',
-      impact: 'High',
-      category: 'Equity & Inclusion',
-      indicators: ['Gender Parity Index', 'Inclusion of Marginalized Groups', 'Dropout Rates'],
-      timeline: '5 years',
-      budget: '₹18,000 Cr',
-      competitorCountry: '🇨🇦 Canada',
-      successRate: '95%',
-      implementationSummary: 'Canada achieved 95% inclusion through targeted funding for indigenous communities, special education support, and anti-discrimination policies. India can improve by adding caste-based affirmative action, disability-friendly infrastructure in all schools, mentorship by successful professionals from marginalized communities, and scholarships linked to performance.',
-      bestPractices: [
-        'Targeted funding for marginalized communities (2x regular budget)',
-        'Special education teachers in every school',
-        'Anti-discrimination policies with strict enforcement',
-        'Community-led education programs',
-      ],
-      indiaAdaptations: [
-        'SC/ST/OBC scholarships with mentorship by IAS/IPS officers',
-        'Disability-friendly infrastructure (ramps, braille, sign language)',
-        'Free coaching for competitive exams (JEE, NEET, UPSC)',
-        'Reservation in elite institutions with bridge courses',
-      ],
-    },
-    {
-      name: 'Zero Dropout Mission',
-      description: 'Comprehensive intervention to reduce dropout rates to below 2% through early warning systems, counseling services, financial support, flexible learning options, and community monitoring.',
-      impact: 'High',
-      category: 'Access & Participation',
-      indicators: ['Dropout Rates', 'Completion Rates'],
-      timeline: '3 years',
-      budget: '₹12,000 Cr',
-      competitorCountry: '🇯🇵 Japan',
-      successRate: '99%',
-      implementationSummary: 'Japan achieved 99% retention through strong teacher-student relationships, counseling services, and social stigma against dropping out. India can match this by adding financial incentives (conditional cash transfers), flexible schooling options (evening classes, distance learning), community monitoring committees, and addressing child labor through enforcement.',
-      bestPractices: [
-        'Early warning system tracking attendance and performance',
-        'School counselors for every 500 students',
-        'Strong social expectation of completing education',
-        'Home visits by teachers for absent students',
-      ],
-      indiaAdaptations: [
-        'Conditional cash transfers (₹500/month) for 90%+ attendance',
-        'Flexible schooling: Evening classes, weekend batches, distance learning',
-        'Community monitoring committees with monthly reviews',
-        'Strict child labor enforcement with rehabilitation programs',
-      ],
-    },
-    {
-      name: 'Learning Outcome Excellence Initiative',
-      description: 'Implement standardized assessment frameworks, competency-based curriculum, remedial teaching programs, and continuous evaluation systems to improve student performance and learning outcomes.',
-      impact: 'Very High',
-      category: 'Quality of Education',
-      indicators: ['Learning Outcomes', 'Completion Rates'],
-      timeline: '4 years',
-      budget: '₹20,000 Cr',
-      competitorCountry: '🇪🇪 Estonia',
-      successRate: '94%',
-      implementationSummary: 'Estonia achieved 94% learning excellence through competency-based curriculum, digital assessments, and teacher autonomy. India can exceed this by adding AI-powered adaptive learning, remedial teaching for struggling students, continuous evaluation (no high-stakes exams), and outcome-based teacher incentives.',
-      bestPractices: [
-        'Competency-based curriculum focused on skills, not rote learning',
-        'Digital assessments with instant feedback',
-        'Teacher autonomy in curriculum delivery',
-        'Focus on critical thinking and problem-solving',
-      ],
-      indiaAdaptations: [
-        'AI-powered adaptive learning platforms (personalized difficulty)',
-        'Remedial teaching programs for bottom 20% students',
-        'Continuous evaluation (CCE) with no board exams until Class 10',
-        'Teacher bonuses linked to student learning gains',
-      ],
-    },
-    {
-      name: 'Infrastructure Modernization Drive',
-      description: 'Upgrade school buildings, construct modern classrooms, establish science labs, libraries, sports facilities, and ensure basic amenities like clean water, electricity, and sanitation in every school.',
-      impact: 'High',
-      category: 'Infrastructure & Resources',
-      indicators: ['School Infrastructure', 'Learning Materials'],
-      timeline: '5 years',
-      budget: '₹50,000 Cr',
-      competitorCountry: '🇩🇪 Germany',
-      successRate: '96%',
-      implementationSummary: 'Germany achieved 96% infrastructure excellence through federal funding, strict quality standards, and regular maintenance. India can improve by adding solar-powered schools, rainwater harvesting, green buildings, and leveraging CSR funds for adoption of schools by corporates.',
-      bestPractices: [
-        'Federal funding with strict quality standards',
-        'Regular maintenance budgets (10% of construction cost annually)',
-        'Science labs and libraries in every school',
-        'Sports facilities and playgrounds',
-      ],
-      indiaAdaptations: [
-        'Solar-powered schools with battery backup',
-        'Rainwater harvesting and water purification systems',
-        'Green buildings with natural ventilation',
-        'CSR-funded school adoption by corporates',
-      ],
-    },
-    {
-      name: 'Higher Education Innovation Hub',
-      description: 'Transform higher education through research grants, industry partnerships, innovation labs, startup incubators, international collaborations, and outcome-based curriculum to enhance employability.',
-      impact: 'Very High',
-      category: 'Higher Education',
-      indicators: ['Graduation Rates', 'Research Output', 'Employment Outcomes'],
-      timeline: '5 years',
-      budget: '₹35,000 Cr',
-      competitorCountry: '🇦🇺 Australia',
-      successRate: '93%',
-      implementationSummary: 'Australia achieved 93% higher education excellence through research funding, industry partnerships, and international student attraction. India can exceed this by leveraging its IT industry for internships, creating innovation hubs in every university, offering industry-relevant courses, and establishing global partnerships for student exchange.',
-      bestPractices: [
-        'Research grants (3% of university budget)',
-        'Industry partnerships with mandatory internships',
-        'Innovation labs and startup incubators',
-        'International student attraction (20% of enrollment)',
-      ],
-      indiaAdaptations: [
-        'Mandatory 6-month internships with IT/manufacturing companies',
-        'Innovation hubs in all central universities',
-        'Industry-relevant courses (AI, data science, renewable energy)',
-        'Global partnerships with top 100 universities',
-      ],
-    },
-    {
-      name: 'Education Finance Reform',
-      description: 'Increase public expenditure on education to 6% of GDP, establish education fund, provide interest-free loans, expand scholarship programs, and ensure transparent allocation of resources.',
-      impact: 'Very High',
-      category: 'Financing',
-      indicators: ['Public Expenditure on Education', 'Scholarships and Financial Aid'],
-      timeline: '3 years',
-      budget: '₹100,000 Cr',
-      competitorCountry: '🇳🇴 Norway',
-      successRate: '98%',
-      implementationSummary: 'Norway achieved 98% education financing excellence by spending 7.6% of GDP on education with free higher education. India can match this by increasing spending to 6% of GDP (from current 4.6%), establishing National Education Fund, offering interest-free loans, and ensuring transparent allocation through digital platforms.',
-      bestPractices: [
-        'Public spending at 7.6% of GDP',
-        'Free higher education for all citizens',
-        'Generous scholarships for low-income students',
-        'Transparent budget allocation',
-      ],
-      indiaAdaptations: [
-        'Increase spending to 6% of GDP (₹10 lakh crore annually)',
-        'National Education Fund with CSR and philanthropic contributions',
-        'Interest-free loans up to ₹10 lakh for higher education',
-        'Digital platform for transparent fund allocation and tracking',
-      ],
-    },
-    {
-      name: 'Gender Parity Acceleration Program',
-      description: 'Achieve 1:1 gender ratio in all education levels through girls-only schools, safety measures, sanitation facilities, female teachers recruitment, and awareness campaigns against gender discrimination.',
-      impact: 'High',
-      category: 'Equity & Inclusion',
-      indicators: ['Gender Parity Index', 'Enrollment Rates'],
-      timeline: '4 years',
-      budget: '₹16,000 Cr',
-      competitorCountry: '🇸🇪 Sweden',
-      successRate: '99%',
-      implementationSummary: 'Sweden achieved 99% gender parity through gender-neutral policies, equal opportunities, and strong anti-discrimination laws. India can improve by adding girls-only schools in conservative areas, female teachers (50% quota), sanitation facilities, safety measures (CCTV, female security), and awareness campaigns against child marriage.',
-      bestPractices: [
-        'Gender-neutral curriculum and teaching methods',
-        'Equal opportunities in STEM subjects',
-        'Strong anti-discrimination laws',
-        'Female role models in leadership positions',
-      ],
-      indiaAdaptations: [
-        'Girls-only schools in conservative rural areas',
-        '50% female teacher quota with rural incentives',
-        'Sanitation facilities (separate toilets) in all schools',
-        'Safety measures: CCTV, female security guards, safe transport',
-      ],
-    },
-    {
-      name: 'Teacher-Student Ratio Optimization',
-      description: 'Recruit 2 million additional teachers to achieve optimal 1:20 teacher-student ratio, with focus on rural and underserved areas, ensuring quality education delivery.',
-      impact: 'High',
-      category: 'Quality of Education',
-      indicators: ['Student-Teacher Ratio', 'Teacher Qualifications'],
-      timeline: '4 years',
-      budget: '₹30,000 Cr',
-      competitorCountry: '🇳🇱 Netherlands',
-      successRate: '95%',
-      implementationSummary: 'Netherlands achieved 95% optimal ratio (1:16) through aggressive teacher recruitment, competitive salaries, and teacher training programs. India can match this by recruiting 2 million teachers, offering rural incentives, fast-track B.Ed programs, and leveraging retired teachers as mentors.',
-      bestPractices: [
-        'Optimal ratio of 1:16 students per teacher',
-        'Competitive salaries attracting top talent',
-        'Comprehensive teacher training programs',
-        'Support staff (teaching assistants) in every school',
-      ],
-      indiaAdaptations: [
-        'Recruit 2 million teachers over 4 years',
-        'Rural incentives: 30% salary premium, housing, faster promotions',
-        'Fast-track B.Ed programs (1 year instead of 2)',
-        'Retired teachers as mentors and substitute teachers',
-      ],
-    },
-    {
-      name: 'Literacy Mission 2030',
-      description: 'Achieve 100% literacy rate through adult education programs, community learning centers, mobile literacy vans, and digital literacy campaigns targeting rural and tribal populations.',
-      impact: 'Very High',
-      category: 'Access & Participation',
-      indicators: ['Literacy Rates', 'Digital Literacy'],
-      timeline: '5 years',
-      budget: '₹22,000 Cr',
-      competitorCountry: '🇳🇿 New Zealand',
-      successRate: '99%',
-      implementationSummary: 'New Zealand achieved 99% literacy through adult education programs, community learning centers, and indigenous language preservation. India can exceed this by adding mobile literacy vans for remote areas, digital literacy campaigns, community volunteers, and integrating with skill development programs for immediate employment.',
-      bestPractices: [
-        'Adult education programs with flexible timings',
-        'Community learning centers in every locality',
-        'Indigenous language preservation',
-        'Free learning materials and incentives',
-      ],
-      indiaAdaptations: [
-        'Mobile literacy vans for remote tribal and rural areas',
-        'Digital literacy campaigns using smartphones',
-        'Community volunteers (Literacy Mitras) with incentives',
-        'Integration with skill development for immediate employment',
-      ],
-    },
-  ];
-};
-
-// AI-Generated Policy Recommendations for Employment (with Competitor Analysis)
-export default function DashboardPage() {
-  const [selectedSector, setSelectedSector] = useState<string | null>(null);
-  const [showExistingPolicies, setShowExistingPolicies] = useState(false);
-  const [simulationRunning, setSimulationRunning] = useState(false);
-  const [simulationResults, setSimulationResults] = useState<any>(null);
-
-  const handleSectorSelect = (sectorId: string) => {
-    setSelectedSector(sectorId);
-    setShowExistingPolicies(false);
-    setSimulationResults(null);
+      if (data.success) {
+        setDashboardData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch dashboard data');
+      }
+    } catch (err) {
+      setError('Failed to load dashboard data. Please try again.');
+      console.error('Dashboard data error:', err);
+    } finally {
+      setLoading(false);
+    }
   };
 
-  const handleViewExistingPolicies = () => {
-    setShowExistingPolicies(true);
-    setSimulationResults(null);
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchDashboardData();
+    setRefreshing(false);
   };
 
-  const handleRunSimulation = () => {
-    setSimulationRunning(true);
-    setShowExistingPolicies(false);
+  const exportReport = () => {
+    if (!dashboardData) return;
 
-    // Simulate AI processing time
-    setTimeout(() => {
-      let newPolicies, existingPoliciesCount, sectorName, goalAlignment;
-      
-      if (selectedSector === 'education') {
-        newPolicies = generateEducationPolicies();
-        existingPoliciesCount = 0;
-        sectorName = 'Education';
-        goalAlignment = {
-          economic: 95,
-          social: 98,
-          political: 85,
-          environmental: 75,
-        };
-      } else if (selectedSector === 'healthcare') {
-        newPolicies = generateHealthcarePolicies();
-        existingPoliciesCount = 0;
-        sectorName = 'Healthcare';
-        goalAlignment = {
-          economic: 90,
-          social: 96,
-          political: 91,
-          environmental: 86,
-        };
-      } else if (selectedSector === 'transport') {
-        newPolicies = generateTransportPolicies();
-        existingPoliciesCount = 0;
-        sectorName = 'Transport';
-        goalAlignment = {
-          economic: 96,
-          social: 88,
-          political: 85,
-          environmental: 90,
-        };
-      }
-      
-      setSimulationResults({
-        sector: sectorName,
-        existingPoliciesCount: existingPoliciesCount,
-        newPoliciesCount: newPolicies.length,
-        newPolicies: newPolicies,
-        totalBudget: newPolicies.reduce((sum, policy) => {
-          const budget = parseInt(policy.budget.replace(/[₹,Cr\s]/g, ''));
-          return sum + budget;
-        }, 0),
-        averageTimeline: '4.5 years',
-        overallImpact: 'Very High',
-        goalAlignment: goalAlignment,
-      });
-      setSimulationRunning(false);
-    }, 3000);
+    const report = JSON.stringify(dashboardData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
   };
 
-  // AI-Generated Policy Recommendations for Industry & Manufacturing
-  const generateIndustryManufacturingPolicies = (): Policy[] => {
-    return [
-      {
-        id: 'industry-smart-manufacturing',
-        name: 'National Smart Manufacturing Mission',
-        description: 'Comprehensive initiative to transform Indian manufacturing through Industry 4.0 technologies including IoT, AI, robotics, and automation. Establishes smart factories, technology adoption centers, and skill development programs.',
-        impact: 'Very High',
-        category: 'Technology and Innovation',
-        indicators: ['Automation Levels', 'Adoption of Advanced Manufacturing Technologies'],
-        timeline: '7 years',
-        budget: '₹150,000 Cr',
-        competitorCountry: 'Germany',
-        competitorFlag: '🇩🇪',
-        successRate: 98
-      },
-      {
-        id: 'industry-green-manufacturing',
-        name: 'Green Manufacturing & Circular Economy Initiative',
-        description: 'Promotes sustainable manufacturing practices, renewable energy adoption, waste reduction, and circular economy principles. Includes carbon emission reduction targets, clean technology adoption, and green certification programs.',
-        impact: 'Very High',
-        category: 'Environmental',
-        indicators: ['Energy Consumption', 'Carbon Emissions', 'Waste Production'],
-        timeline: '10 years',
-        budget: '₹200,000 Cr',
-        competitorCountry: 'Denmark',
-        competitorFlag: '🇩🇰',
-        successRate: 97
-      },
-      {
-        id: 'industry-supply-chain',
-        name: 'Integrated Supply Chain & Logistics Optimization',
-        description: 'Develops world-class supply chain infrastructure with digital tracking, automated warehousing, just-in-time inventory management, and AI-powered logistics optimization. Reduces supply chain disruptions and costs.',
-        impact: 'High',
-        category: 'Supply Chain',
-        indicators: ['Inventory Levels', 'Order Backlogs', 'Supply Chain Disruptions'],
-        timeline: '6 years',
-        budget: '₹120,000 Cr',
-        competitorCountry: 'Singapore',
-        competitorFlag: '🇸🇬',
-        successRate: 98
-      },
-      {
-        id: 'industry-export-competitiveness',
-        name: 'Manufacturing Export Competitiveness Program',
-        description: 'Enhances export capabilities through quality certification, international standards compliance, trade facilitation, and market access support. Targets high-value manufacturing exports and global value chain integration.',
-        impact: 'Very High',
-        category: 'Trade',
-        indicators: ['Export Volume', 'Import Volume', 'Trade Balance'],
-        timeline: '5 years',
-        budget: '₹80,000 Cr',
-        competitorCountry: 'South Korea',
-        competitorFlag: '🇰🇷',
-        successRate: 97
-      },
-      {
-        id: 'industry-msme-modernization',
-        name: 'MSME Manufacturing Modernization & Scale-up',
-        description: 'Comprehensive support for MSME sector including technology upgrades, access to finance, market linkages, and capacity building. Enables MSMEs to adopt advanced manufacturing technologies and scale operations.',
-        impact: 'Very High',
-        category: 'Investment',
-        indicators: ['Capital Expenditure', 'Research and Development (R&D) Spending'],
-        timeline: '8 years',
-        budget: '₹180,000 Cr',
-        competitorCountry: 'Japan',
-        competitorFlag: '🇯🇵',
-        successRate: 96
-      },
-      {
-        id: 'industry-skill-development',
-        name: 'Advanced Manufacturing Skill Development Mission',
-        description: 'Large-scale skill development program for manufacturing workforce covering Industry 4.0 skills, robotics, automation, quality control, and advanced manufacturing techniques. Partnerships with industry and international institutions.',
-        impact: 'High',
-        category: 'Employment',
-        indicators: ['Employment in Industry', 'Labor Productivity', 'Average Weekly Hours'],
-        timeline: '6 years',
-        budget: '₹100,000 Cr',
-        competitorCountry: 'Germany',
-        competitorFlag: '🇩🇪',
-        successRate: 97
-      },
-      {
-        id: 'industry-innovation-hubs',
-        name: 'National Manufacturing Innovation Hubs Network',
-        description: 'Establishes network of manufacturing innovation centers focusing on R&D, prototyping, testing, and commercialization. Collaboration between industry, academia, and research institutions for breakthrough technologies.',
-        impact: 'High',
-        category: 'Technology and Innovation',
-        indicators: ['Research and Development (R&D) Spending', 'Adoption of Advanced Manufacturing Technologies'],
-        timeline: '7 years',
-        budget: '₹90,000 Cr',
-        competitorCountry: 'United States',
-        competitorFlag: '🇺🇸',
-        successRate: 96
-      },
-      {
-        id: 'industry-quality-standards',
-        name: 'Zero Defect Zero Effect (ZED) Manufacturing Excellence',
-        description: 'National quality certification and excellence program promoting zero-defect manufacturing, lean production, total quality management, and international quality standards. Enhances global competitiveness.',
-        impact: 'High',
-        category: 'Economic',
-        indicators: ['Industrial Value Added', 'Business Confidence Index', 'Labor Productivity'],
-        timeline: '5 years',
-        budget: '₹60,000 Cr',
-        competitorCountry: 'Japan',
-        competitorFlag: '🇯🇵',
-        successRate: 98
-      },
-      {
-        id: 'industry-infrastructure',
-        name: 'Industrial Corridor & Manufacturing Zone Development',
-        description: 'Develops dedicated industrial corridors with world-class infrastructure including power, water, transport connectivity, and digital infrastructure. Creates plug-and-play manufacturing zones with single-window clearance.',
-        impact: 'Very High',
-        category: 'Economic',
-        indicators: ['GDP Contribution', 'Industrial Value Added', 'Capital Expenditure'],
-        timeline: '10 years',
-        budget: '₹300,000 Cr',
-        competitorCountry: 'China',
-        competitorFlag: '🇨🇳',
-        successRate: 97
-      },
-      {
-        id: 'industry-digital-twin',
-        name: 'Digital Twin & Predictive Manufacturing Platform',
-        description: 'Implements digital twin technology for manufacturing processes enabling real-time monitoring, predictive maintenance, process optimization, and virtual prototyping. Reduces downtime and improves efficiency.',
-        impact: 'High',
-        category: 'Technology and Innovation',
-        indicators: ['Automation Levels', 'Labor Productivity', 'Supply Chain Disruptions'],
-        timeline: '6 years',
-        budget: '₹70,000 Cr',
-        competitorCountry: 'Germany',
-        competitorFlag: '🇩🇪',
-        successRate: 96
-      },
-      {
-        id: 'industry-semiconductor',
-        name: 'Semiconductor & Electronics Manufacturing Ecosystem',
-        description: 'Comprehensive program to build domestic semiconductor and electronics manufacturing capabilities including fab facilities, design centers, testing infrastructure, and supply chain development. Reduces import dependence.',
-        impact: 'Very High',
-        category: 'Economic',
-        indicators: ['GDP Contribution', 'Export Volume', 'Capital Expenditure'],
-        timeline: '10 years',
-        budget: '₹250,000 Cr',
-        competitorCountry: 'Taiwan',
-        competitorFlag: '🇹🇼',
-        successRate: 98
-      },
-      {
-        id: 'industry-energy-efficiency',
-        name: 'Industrial Energy Efficiency & Renewable Integration',
-        description: 'Promotes energy-efficient manufacturing processes, renewable energy adoption in industries, waste heat recovery, and energy management systems. Reduces energy costs and carbon footprint.',
-        impact: 'High',
-        category: 'Environmental',
-        indicators: ['Energy Consumption', 'Carbon Emissions', 'Industrial Value Added'],
-        timeline: '8 years',
-        budget: '₹110,000 Cr',
-        competitorCountry: 'Sweden',
-        competitorFlag: '🇸🇪',
-        successRate: 97
-      }
-    ];
+  const formatCurrency = (amount: number) => {
+    return new Intl.NumberFormat('en-US', {
+      style: 'currency',
+      currency: 'USD',
+      minimumFractionDigits: 0,
+      maximumFractionDigits: 0,
+    }).format(amount);
   };
 
-  // AI-Generated Policy Recommendations for Rural Development (with Competitor Analysis)
-  // AI-Generated Policy Recommendations for Biodiversity (with Competitor Analysis)
-  // AI-Generated Policy Recommendations for Defense & Security (with Competitor Analysis)
-  // AI-Generated Policy Recommendations for Healthcare (with Competitor Analysis)
-  const generateHealthcarePolicies = (): Policy[] => {
-    return [
-      {
-        id: 'healthcare-1',
-        name: 'Universal Health Coverage & Ayushman Bharat Expansion',
-        description: 'Expand Ayushman Bharat to cover entire population (140 crore) with comprehensive health insurance including primary, secondary, tertiary care, mental health, and preventive services. Increase coverage from ₹5 lakh to ₹10 lakh per family annually.',
-        category: 'Healthcare Access & Coverage',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 500000,
-        indicators: ['Health Insurance Coverage', 'Healthcare Access', 'Utilization Rate', 'Patient Satisfaction'],
-        competitorAnalysis: {
-          country: '🇹🇭 Thailand',
-          successRate: 98,
-          implementationSummary: 'Thailand achieved 98% success in universal health coverage (UHC), covering 99.9% of population (70 million) through Universal Coverage Scheme (UCS) launched in 2002. Government spending increased from 1.8% to 3.8% of GDP, providing comprehensive benefits including primary care, hospitalization, high-cost treatments, and traditional medicine. Out-of-pocket expenses reduced from 34% to 11% of total health expenditure. India can exceed this by leveraging Ayushman Bharat infrastructure (23,000+ empaneled hospitals), digital health stack (ABDM), telemedicine expansion, and integrating AYUSH systems.',
-          bestPractices: [
-            'Universal Coverage Scheme (UCS) provides free healthcare at point of service with zero co-payment',
-            'Capitation-based payment system for primary care incentivizes preventive care and reduces costs',
-            'Comprehensive benefit package includes 12,000+ procedures, medicines, and traditional medicine',
-            'Strong primary healthcare network (10,000+ health centers) serves as gatekeepers, reducing hospital burden'
-          ],
-          indiaAdaptations: [
-            'Leverage Ayushman Bharat infrastructure: 23,000+ empaneled hospitals, 1.5 lakh Health & Wellness Centers',
-            'Digital health stack (ABDM): 50 crore health IDs, interoperable health records, telemedicine integration',
-            'AYUSH integration: Include Ayurveda, Yoga, Unani, Siddha, Homeopathy in benefit package',
-            'Public-private partnership: Engage 70,000+ private hospitals, 1.3 million private doctors in UHC delivery'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 92,
-          social: 99,
-          political: 95,
-          environmental: 85
-        }
-      },
-      {
-        id: 'healthcare-2',
-        name: 'Maternal & Child Health Mission (Zero Mortality Goal)',
-        description: 'Reduce Maternal Mortality Ratio (MMR) from 97 to 30 per 100,000 live births and Infant Mortality Rate (IMR) from 28 to 10 per 1,000 live births through skilled birth attendance, emergency obstetric care, neonatal intensive care units (NICUs), nutrition programs, and immunization.',
-        category: 'Health Outcomes',
-        impact: 'Very High',
-        timeline: '8 years',
-        budget: 300000,
-        indicators: ['Maternal Mortality Rate', 'Infant Mortality Rate', 'Child Mortality Rate', 'Life Expectancy'],
-        competitorAnalysis: {
-          country: '🇷🇼 Rwanda',
-          successRate: 97,
-          implementationSummary: 'Rwanda achieved 97% success in reducing maternal mortality from 1,071 (1990) to 248 per 100,000 (2017) and infant mortality from 107 to 27 per 1,000 through community health worker program (45,000 workers), performance-based financing, mandatory health insurance (91% coverage), and skilled birth attendance (91%). India can exceed this by leveraging ASHA worker network (1 million), Janani Suraksha Yojana, and technology-enabled tracking.',
-          bestPractices: [
-            'Community health worker program: 45,000 workers provide prenatal care, family planning, and referrals',
-            'Performance-based financing: Incentivizes quality maternal care, institutional deliveries (91% rate)',
-            'Mandatory health insurance (Mutuelle de Santé): 91% coverage ensures financial access to care',
-            'Skilled birth attendance: 91% of deliveries attended by trained professionals, reducing complications'
-          ],
-          indiaAdaptations: [
-            'Leverage ASHA network: 1 million workers with smartphone apps for real-time tracking, telemedicine support',
-            'Janani Suraksha Yojana expansion: Increase cash incentives, cover transportation, postnatal care (6 visits)',
-            'LaQshya program scale-up: Quality certification for 30,000+ labor rooms, 24x7 delivery services',
-            'Nutrition mission: Poshan Abhiyaan targets 10 crore pregnant women, lactating mothers with supplementation'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 88,
-          social: 99,
-          political: 95,
-          environmental: 82
-        }
-      },
-      {
-        id: 'healthcare-3',
-        name: 'National Disease Prevention & Control Program',
-        description: 'Comprehensive program to reduce prevalence of non-communicable diseases (NCDs: diabetes, hypertension, cancer, cardiovascular diseases) and communicable diseases (TB, malaria, dengue) through screening, early detection, treatment, lifestyle modification, and vaccination.',
-        category: 'Health Outcomes',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: 400000,
-        indicators: ['Prevalence of Diseases', 'Incidence of Diseases', 'Mortality Rate', 'Vaccination Rates'],
-        competitorAnalysis: {
-          country: '🇫🇮 Finland',
-          successRate: 96,
-          implementationSummary: 'Finland achieved 96% success in reducing cardiovascular disease mortality by 85% (1970-2015) through North Karelia Project: population-wide risk factor reduction (smoking from 52% to 15%, cholesterol levels down 20%), dietary changes (salt reduction, vegetable oil substitution), physical activity promotion, and primary care strengthening. India can exceed this by leveraging digital health platforms, AYUSH integration, and community-based screening.',
-          bestPractices: [
-            'Population-wide risk factor reduction: Smoking rates dropped from 52% to 15%, cholesterol levels reduced 20%',
-            'Dietary interventions: Salt reduction, vegetable oil substitution, increased fruit/vegetable consumption',
-            'Community engagement: Local health workers, peer educators, mass media campaigns for behavior change',
-            'Primary care integration: Screening, counseling, and treatment integrated into routine primary care visits'
-          ],
-          indiaAdaptations: [
-            'Digital health platforms: AI-powered risk assessment, telemedicine consultations, mobile health apps for 80 crore users',
-            'AYUSH integration: Yoga, Ayurveda for diabetes/hypertension management, traditional medicine for chronic diseases',
-            'Community screening: 1.5 lakh Health & Wellness Centers screen 50 crore adults annually for NCDs',
-            'Tobacco control: Increase taxes to 85% of retail price, pictorial warnings, ban on e-cigarettes (COTPA enforcement)'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 90,
-          social: 96,
-          political: 88,
-          environmental: 85
-        }
-      },
-      {
-        id: 'healthcare-4',
-        name: 'Healthcare Workforce Expansion & Skill Development',
-        description: 'Increase physician density from 0.7 to 1.5 per 1,000 population and nurse density from 1.7 to 3.0 per 1,000 through medical college expansion (from 706 to 1,000 colleges), nursing school scale-up, mid-level healthcare provider training, and retention incentives for rural postings.',
-        category: 'Healthcare Workforce',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: 250000,
-        indicators: ['Physician Density', 'Nurse Density', 'Healthcare Workforce Distribution'],
-        competitorAnalysis: {
-          country: '🇨🇺 Cuba',
-          successRate: 98,
-          implementationSummary: 'Cuba achieved 98% success in healthcare workforce development, reaching 8.4 physicians per 1,000 population (world\'s highest) and 7.5 nurses per 1,000 through free medical education (Latin American School of Medicine trains 30,000+ students from 100+ countries), mandatory rural service (3 years), community-based training, and international medical missions (50,000+ doctors deployed globally). India can exceed this by leveraging existing infrastructure, public-private partnerships, and technology-enabled training.',
-          bestPractices: [
-            'Free medical education: Latin American School of Medicine trains 30,000+ students from 100+ countries annually',
-            'Mandatory rural service: 3-year requirement for all medical graduates ensures equitable workforce distribution',
-            'Community-based training: Medical students train in community clinics, family medicine emphasis',
-            'International medical missions: 50,000+ doctors deployed globally, generating revenue and expertise exchange'
-          ],
-          indiaAdaptations: [
-            'Medical college expansion: Increase from 706 to 1,000 colleges (1 per district), add 1 lakh MBBS seats annually',
-            'Public-private partnerships: Engage private medical colleges (50% of total) with rural service mandates',
-            'Mid-level healthcare providers: Train 5 lakh nurse practitioners, physician assistants for primary care',
-            'Technology-enabled training: AI-powered simulation, telemedicine preceptorships, online CME for 1.3 million doctors'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 88,
-          social: 95,
-          political: 90,
-          environmental: 80
-        }
-      },
-      {
-        id: 'healthcare-5',
-        name: 'Digital Health & Telemedicine Revolution',
-        description: 'Scale digital health infrastructure through Ayushman Bharat Digital Mission (ABDM): 140 crore health IDs, interoperable electronic health records, telemedicine platform (1 crore consultations/month), AI-powered diagnostics, and health data analytics for policy-making.',
-        category: 'Healthcare Access & Coverage',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 150000,
-        indicators: ['Healthcare Access', 'Utilization Rate', 'Patient Satisfaction', 'Healthcare Outcomes'],
-        competitorAnalysis: {
-          country: '🇪🇪 Estonia',
-          successRate: 99,
-          implementationSummary: 'Estonia achieved 99% success in digital health, with 99% of health data digitized, 99% of prescriptions electronic, and 95% of citizens using e-health services. X-Road platform enables secure data exchange across 1,000+ healthcare providers, e-prescription system processes 20 million prescriptions annually, and patient portal provides access to health records, appointment booking, and telemedicine. India can exceed this by leveraging ABDM scale (140 crore population), mobile-first approach, and AI integration.',
-          bestPractices: [
-            'X-Road platform: Secure data exchange across 1,000+ healthcare providers, 99% of health data digitized',
-            'E-prescription system: 99% of prescriptions electronic, reducing errors, enabling drug interaction checks',
-            'Patient portal: 95% of citizens access health records, book appointments, receive telemedicine consultations',
-            'Blockchain-based health records: Immutable, patient-controlled data with granular consent management'
-          ],
-          indiaAdaptations: [
-            'ABDM scale-up: 140 crore health IDs (50 crore created), interoperable health records across 1 lakh facilities',
-            'Mobile-first approach: 80 crore smartphone users access telemedicine, health records, appointment booking via apps',
-            'AI-powered diagnostics: Radiology, pathology, retinopathy screening using AI (70% accuracy improvement)',
-            'Vernacular language support: Health information, telemedicine in 22 official languages for 130 crore non-English speakers'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 92,
-          social: 96,
-          political: 90,
-          environmental: 88
-        }
-      },
-      {
-        id: 'healthcare-6',
-        name: 'Hospital Infrastructure & Bed Capacity Expansion',
-        description: 'Increase hospital bed density from 0.5 to 3.0 per 1,000 population through construction of 5,000 new hospitals (district hospitals, medical colleges, specialty hospitals), upgrading 50,000 primary health centers, and incentivizing private sector expansion in underserved areas.',
-        category: 'Healthcare Infrastructure',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: 600000,
-        indicators: ['Hospital Beds per Capita', 'Healthcare Facilities', 'Hospital Admission Rates', 'Average Length of Stay'],
-        competitorAnalysis: {
-          country: '🇰🇷 South Korea',
-          successRate: 97,
-          implementationSummary: 'South Korea achieved 97% success in healthcare infrastructure, increasing hospital bed density from 2.0 (1980) to 12.4 per 1,000 (2020, world\'s highest) through public hospital construction, private sector incentives, medical tourism promotion (600,000 foreign patients annually generating $2 billion), and advanced medical equipment deployment. Average length of stay reduced from 16 to 10 days. India can exceed this by leveraging PPP models, medical tourism potential, and technology integration.',
-          bestPractices: [
-            'Rapid hospital construction: 4,000+ hospitals built in 40 years, achieving 12.4 beds per 1,000 population',
-            'Private sector incentives: Tax breaks, land subsidies for hospital construction in underserved areas',
-            'Medical tourism promotion: 600,000 foreign patients annually, generating $2 billion revenue',
-            'Advanced medical equipment: MRI density of 29.1 per million (vs global average of 10.5), enabling early diagnosis'
-          ],
-          indiaAdaptations: [
-            'PPP model: Government provides land, private sector builds/operates hospitals (50-50 revenue sharing)',
-            'District hospital upgrades: 750 district hospitals upgraded to 500-bed facilities with specialty departments',
-            'Medical tourism hub: Target 3 million foreign patients annually ($9 billion revenue) through visa facilitation, accreditation',
-            'Modular hospital design: Prefabricated, scalable hospitals reduce construction time from 5 years to 18 months'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 90,
-          social: 95,
-          political: 92,
-          environmental: 82
-        }
-      },
-      {
-        id: 'healthcare-7',
-        name: 'Healthcare Quality & Patient Safety Initiative',
-        description: 'Implement national quality standards (NQAS) across 1 lakh healthcare facilities, reduce medical error rates by 50%, decrease hospital readmission rates from 15% to 8%, and improve patient satisfaction scores from 60% to 85% through accreditation, clinical audits, and patient feedback systems.',
-        category: 'Healthcare Quality & Safety',
-        impact: 'High',
-        timeline: '7 years',
-        budget: 100000,
-        indicators: ['Healthcare Outcomes', 'Hospital Readmission Rates', 'Error Rates', 'Patient Satisfaction'],
-        competitorAnalysis: {
-          country: '🇸🇪 Sweden',
-          successRate: 98,
-          implementationSummary: 'Sweden achieved 98% success in healthcare quality, with hospital readmission rates at 7% (vs OECD average of 15%), medical error rates at 2% (vs global average of 10%), and patient satisfaction at 88%. National quality registries track 100+ conditions, enabling continuous improvement. Mandatory incident reporting system captures 100,000+ events annually. India can exceed this by leveraging digital health infrastructure, AI-powered quality monitoring, and patient engagement platforms.',
-          bestPractices: [
-            'National quality registries: 100+ disease-specific registries track outcomes, enabling benchmarking and improvement',
-            'Mandatory incident reporting: 100,000+ adverse events reported annually, analyzed for systemic improvements',
-            'Clinical audits: Regular audits of 1,000+ hospitals ensure adherence to evidence-based protocols',
-            'Patient engagement: Patient portals, shared decision-making, patient-reported outcome measures (PROMs)'
-          ],
-          indiaAdaptations: [
-            'NQAS scale-up: Certify 1 lakh healthcare facilities (currently 20,000) with digital monitoring, real-time dashboards',
-            'AI-powered quality monitoring: Automated chart review, predictive analytics for readmission risk, sepsis detection',
-            'Patient feedback systems: SMS-based surveys, mobile apps for real-time feedback from 10 crore patients annually',
-            'Clinical decision support: AI-powered treatment recommendations, drug interaction alerts for 1.3 million doctors'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 88,
-          social: 95,
-          political: 90,
-          environmental: 85
-        }
-      },
-      {
-        id: 'healthcare-8',
-        name: 'Public Health Expenditure Enhancement',
-        description: 'Increase public health expenditure from 1.3% to 2.5% of GDP (₹6.5 lakh crore annually) to fund universal health coverage, infrastructure expansion, workforce development, and preventive healthcare programs. Reduce out-of-pocket expenses from 48% to 30% of total health expenditure.',
-        category: 'Healthcare Expenditure',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 800000,
-        indicators: ['Total Health Expenditure', 'Per Capita Health Expenditure', 'Health Expenditure as % of GDP'],
-        competitorAnalysis: {
-          country: '🇬🇧 United Kingdom',
-          successRate: 96,
-          implementationSummary: 'United Kingdom achieved 96% success in public health financing through NHS (National Health Service), with government spending at 9.9% of GDP (£280 billion annually), providing free healthcare at point of service to 68 million citizens. Out-of-pocket expenses at 9% (vs global average of 18%). Life expectancy increased from 69 (1948) to 81 years (2020). India can exceed this by leveraging tax revenue growth, sin taxes, and efficiency improvements.',
-          bestPractices: [
-            'NHS model: Free healthcare at point of service, funded through general taxation (no insurance premiums)',
-            'Centralized procurement: Bulk purchasing of medicines, equipment reduces costs by 30-40%',
-            'Primary care gatekeeping: 90% of patient contacts in primary care, reducing hospital burden and costs',
-            'NICE (National Institute for Health and Care Excellence): Evidence-based guidelines ensure cost-effective treatments'
-          ],
-          indiaAdaptations: [
-            'Progressive taxation: Increase health cess from 4% to 6%, introduce wealth tax (1% on assets >₹10 crore)',
-            'Sin taxes: Increase tobacco tax to 85% of retail price, alcohol tax to 50% (₹1 lakh crore annual revenue)',
-            'Centralized procurement: Jan Aushadhi Kendras scale-up to 25,000 stores, generic medicines at 50-90% discount',
-            'Efficiency improvements: Reduce administrative costs from 8% to 5% through digitization, AI-powered claims processing'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 92,
-          social: 98,
-          political: 95,
-          environmental: 85
-        }
-      },
-      {
-        id: 'healthcare-9',
-        name: 'Preventive Healthcare & Wellness Program',
-        description: 'Shift focus from curative to preventive healthcare through population-wide screening (diabetes, hypertension, cancer), vaccination programs (95% coverage for all age groups), health promotion campaigns (nutrition, physical activity, mental health), and workplace wellness initiatives.',
-        category: 'Preventive Healthcare',
-        impact: 'Very High',
-        timeline: '8 years',
-        budget: 200000,
-        indicators: ['Vaccination Rates', 'Screening Rates', 'Health Promotion Programs', 'Prevalence of Diseases'],
-        competitorAnalysis: {
-          country: '🇯🇵 Japan',
-          successRate: 98,
-          implementationSummary: 'Japan achieved 98% success in preventive healthcare, with life expectancy at 84.6 years (world\'s highest), cancer screening rates at 40-50%, and vaccination coverage at 95%+. Annual health checkups mandatory for 74 million workers, identifying risk factors early. Health promotion law (2003) requires employers to provide health guidance. Longevity attributed to diet (low fat, high fish), physical activity, and preventive care. India can exceed this by leveraging digital health platforms, AYUSH integration, and community engagement.',
-          bestPractices: [
-            'Mandatory annual health checkups: 74 million workers screened for metabolic syndrome, diabetes, hypertension',
-            'Cancer screening programs: 40-50% participation rates for gastric, colorectal, breast, cervical cancers',
-            'Health promotion law: Employers provide health guidance to at-risk employees, reducing disease incidence by 20%',
-            'Longevity diet: Traditional Japanese diet (low fat, high fish, vegetables) promoted through national campaigns'
-          ],
-          indiaAdaptations: [
-            'Population-wide screening: 1.5 lakh Health & Wellness Centers screen 50 crore adults annually for NCDs',
-            'Vaccination expansion: Universal immunization program covers 2.6 crore children, add HPV, pneumococcal vaccines',
-            'AYUSH integration: Yoga, Ayurveda for disease prevention, stress management (10 crore practitioners)',
-            'Workplace wellness: Mandatory health checkups for 50 crore workers, fitness incentives, mental health support'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 90,
-          social: 97,
-          political: 88,
-          environmental: 92
-        }
-      },
-      {
-        id: 'healthcare-10',
-        name: 'Medical Equipment & Technology Modernization',
-        description: 'Upgrade medical equipment across 1 lakh healthcare facilities with advanced diagnostics (MRI, CT, PET scans), surgical equipment (robotic surgery, minimally invasive tools), laboratory equipment (automated analyzers), and emergency equipment (ventilators, defibrillators) through domestic manufacturing and imports.',
-        category: 'Healthcare Infrastructure',
-        impact: 'High',
-        timeline: '8 years',
-        budget: 350000,
-        indicators: ['Medical Equipment Availability', 'Healthcare Facilities', 'Healthcare Outcomes', 'Patient Satisfaction'],
-        competitorAnalysis: {
-          country: '🇩🇪 Germany',
-          successRate: 97,
-          implementationSummary: 'Germany achieved 97% success in medical equipment deployment, with MRI density of 35.9 per million (vs global average of 10.5), CT density of 35.1 per million, and robotic surgery systems in 200+ hospitals. Medical technology industry generates €35 billion annually, employing 235,000 workers. Equipment quality and availability contribute to 5-year cancer survival rates of 65% (vs global average of 50%). India can exceed this by leveraging domestic manufacturing (PLI scheme), import substitution, and technology transfer.',
-          bestPractices: [
-            'High equipment density: MRI at 35.9 per million, CT at 35.1 per million enables early diagnosis, better outcomes',
-            'Robotic surgery: 200+ hospitals with da Vinci systems, performing 50,000+ procedures annually',
-            'Medical technology industry: €35 billion revenue, 235,000 employees, exporting to 150+ countries',
-            'Quality standards: CE marking, ISO certification ensure equipment safety, reliability, and interoperability'
-          ],
-          indiaAdaptations: [
-            'Domestic manufacturing: PLI scheme for medical devices (₹3,420 crore), target $50 billion production by 2030',
-            'Import substitution: Reduce import dependence from 80% to 30%, manufacture MRI, CT, ventilators domestically',
-            'Technology transfer: Partner with global manufacturers (Siemens, GE, Philips) for local production, R&D',
-            'Equipment leasing: Government-backed leasing program enables 50,000 small hospitals to access advanced equipment'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 92,
-          social: 93,
-          political: 88,
-          environmental: 85
-        }
-      },
-      {
-        id: 'healthcare-11',
-        name: 'Mental Health & Wellness Initiative',
-        description: 'Establish comprehensive mental health services through 1,000 District Mental Health Programs, 10,000 mental health professionals training, telemedicine-based counseling (1 crore consultations annually), workplace mental health programs, and anti-stigma campaigns. Reduce suicide rate from 10.5 to 5 per 100,000.',
-        category: 'Health Outcomes',
-        impact: 'High',
-        timeline: '7 years',
-        budget: 80000,
-        indicators: ['Prevalence of Diseases', 'Healthcare Access', 'Utilization Rate', 'Patient Satisfaction'],
-        competitorAnalysis: {
-          country: '🇦🇺 Australia',
-          successRate: 96,
-          implementationSummary: 'Australia achieved 96% success in mental health services, with 46% of population accessing mental health care in their lifetime, suicide rate reduced from 14.7 (1997) to 12.1 per 100,000 (2020), and mental health expenditure at 7.4% of total health budget. Medicare covers 10 psychology sessions annually, telehealth mental health consultations increased 10x during COVID. India can exceed this by leveraging telemedicine scale, AYUSH integration, and community-based care.',
-          bestPractices: [
-            'Medicare coverage: 10 psychology sessions annually covered, reducing financial barriers to care',
-            'Telehealth mental health: 10x increase during COVID, enabling access in remote areas',
-            'Workplace mental health: Mandatory mental health training for managers, employee assistance programs (EAPs)',
-            'Anti-stigma campaigns: Beyond Blue, R U OK? campaigns reach 25 million Australians, normalizing mental health discussions'
-          ],
-          indiaAdaptations: [
-            'Telemedicine-based counseling: 1 crore consultations annually via ABDM, reducing access barriers for 130 crore population',
-            'AYUSH integration: Yoga, meditation, Ayurveda for stress management, depression, anxiety (evidence-based protocols)',
-            'Community-based care: Train 1 million ASHA workers in mental health first aid, suicide prevention',
-            'Workplace programs: Mandatory mental health policies for 50 crore workers, EAPs, stress management workshops'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 85,
-          social: 96,
-          political: 88,
-          environmental: 90
-        }
-      },
-      {
-        id: 'healthcare-12',
-        name: 'Emergency Medical Services & Trauma Care Network',
-        description: 'Establish nationwide emergency medical services (EMS) with 108 ambulance network expansion (50,000 ambulances), trauma care centers (1,000 facilities), air ambulance services (100 helicopters), and integrated emergency response system (golden hour protocol). Reduce trauma mortality from 20% to 10%.',
-        category: 'Healthcare Infrastructure',
-        impact: 'High',
-        timeline: '6 years',
-        budget: 180000,
-        indicators: ['Healthcare Access', 'Healthcare Outcomes', 'Hospital Admission Rates', 'Mortality Rate'],
-        competitorAnalysis: {
-          country: '🇮🇱 Israel',
-          successRate: 98,
-          implementationSummary: 'Israel achieved 98% success in emergency medical services, with Magen David Adom (MDA) providing 90-second average response time in urban areas, 1,200 ambulances, 15,000 volunteers, and 100% population coverage. Trauma mortality rate at 8% (vs global average of 15%). Integrated emergency response system coordinates ambulances, hospitals, air evacuation. India can exceed this by leveraging 108 ambulance network, technology integration, and volunteer mobilization.',
-          bestPractices: [
-            'Rapid response time: 90-second average in urban areas, 15-minute in rural areas through strategic ambulance placement',
-            'Volunteer network: 15,000 trained volunteers provide first response, CPR, trauma care before ambulance arrival',
-            'Integrated emergency system: Real-time coordination between ambulances, hospitals, air evacuation, blood banks',
-            'Trauma care centers: 20 Level-1 trauma centers provide 24x7 specialized care, reducing mortality by 40%'
-          ],
-          indiaAdaptations: [
-            '108 ambulance expansion: Increase from 20,000 to 50,000 ambulances, reduce response time to 15 minutes nationwide',
-            'Trauma care network: Establish 1,000 trauma centers (1 per district), train 50,000 trauma specialists',
-            'Air ambulance services: 100 helicopters for remote areas, hill stations, islands (Andaman, Lakshadweep)',
-            'Technology integration: GPS tracking, AI-powered dispatch, telemedicine support for paramedics, real-time hospital bed availability'
-          ]
-        },
-        indiaOneAlignment: {
-          economic: 88,
-          social: 94,
-          political: 90,
-          environmental: 82
-        }
-      }
-    ];
+  const getScoreColor = (score: number) => {
+    if (score >= 80) return 'text-green-600';
+    if (score >= 70) return 'text-blue-600';
+    if (score >= 60) return 'text-yellow-600';
+    return 'text-red-600';
   };
 
-  // AI-Generated Policy Recommendations for Banking & Finance (with Competitor Analysis)
-  const generateBankingFinancePolicies = (): Policy[] => {
-    return [
-      {
-        name: 'National Financial Inclusion & Digital Banking Mission',
-        description: 'Expand financial inclusion from 80% to 100% adult population through digital banking infrastructure, mobile banking penetration, doorstep banking services, and financial literacy programs targeting rural and underserved communities.',
-        category: 'Access to Finance',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 150000,
-        indicators: ['Financial Inclusion', 'Bank Branch Density', 'Digital Payments'],
-        competitorCountry: '🇰🇪 Kenya',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Kenya achieved 98% success in financial inclusion, increasing from 27% (2006) to 83% (2021) through M-Pesa mobile money (32 million users, 70% of GDP transacted), agent banking network (250,000 agents), digital credit (KES 1.2 trillion disbursed), and regulatory innovation (sandbox for fintech). India can exceed this by leveraging UPI infrastructure (11.4 billion transactions/month), Jan Dhan accounts (502 million), Aadhaar-based authentication, and expanding banking correspondent network to 2 million agents.',
-        bestPractices: [
-          'M-Pesa mobile money platform processes 70% of GDP, enabling instant peer-to-peer transfers and bill payments',
-          'Agent banking network of 250,000 agents provides last-mile financial services in remote areas',
-          'Digital credit platforms (M-Shwari, KCB M-Pesa) disbursed KES 1.2 trillion to 5 million borrowers',
-          'Regulatory sandbox enabled fintech innovation with 40+ pilots approved since 2019',
-        ],
-        indiaAdaptations: [
-          'Leverage UPI infrastructure: Scale to 20 billion transactions/month, integrate with global payment systems',
-          'Expand banking correspondent network: 2 million agents with biometric authentication and real-time connectivity',
-          'Aadhaar-based instant account opening: Reduce KYC time from days to minutes, enable video-KYC',
-          'Financial literacy campaigns: Target 50 crore rural population with vernacular content and gamification',
-        ],
-      },
-      {
-        name: 'Banking Sector Consolidation & NPA Resolution Framework',
-        description: 'Strengthen banking sector through strategic mergers, asset quality improvement, recapitalization (₹3 lakh crore), and comprehensive NPA resolution mechanism to reduce gross NPA ratio from 3.9% to below 2% by 2028.',
-        category: 'Banking Sector',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 300000,
-        indicators: ['Non-Performing Loans (NPL) Ratio', 'Banking Sector Assets', 'Credit to GDP Ratio'],
-        competitorCountry: '🇸🇪 Sweden',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Sweden achieved 97% success in banking crisis resolution (1990s), reducing NPL ratio from 11% to 1% through government-backed bad bank (Securum), bank recapitalization (4% of GDP), strict asset quality reviews, and regulatory reforms. Banking sector emerged stronger with ROE of 12-15%. India can exceed this by leveraging IBC framework, National Asset Reconstruction Company (NARCL), and technology-driven credit monitoring.',
-        bestPractices: [
-          'Government-backed bad bank (Securum) acquired €67 billion NPAs at market value, recovered 96% over 10 years',
-          'Bank recapitalization of 4% of GDP restored capital adequacy ratios above Basel norms',
-          'Strict asset quality reviews and provisioning norms prevented evergreening of loans',
-          'Regulatory reforms strengthened supervision, risk management, and corporate governance',
-        ],
-        indiaAdaptations: [
-          'Accelerate NARCL operations: Transfer ₹2 lakh crore stressed assets, achieve 60% recovery rate',
-          'IBC framework enhancement: Reduce resolution time from 400 days to 180 days, improve recovery rates to 50%',
-          'Technology-driven credit monitoring: AI/ML for early warning systems, real-time asset quality tracking',
-          'Public sector bank reforms: Professional management, performance-linked compensation, governance overhaul',
-        ],
-      },
-      {
-        name: 'Capital Markets Deepening & Bond Market Development',
-        description: 'Develop deep and liquid capital markets by increasing stock market capitalization to 150% of GDP, expanding corporate bond market to ₹100 lakh crore, and enhancing retail investor participation from 4% to 15% of population.',
-        category: 'Capital Markets',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 80000,
-        indicators: ['Stock Market Capitalization', 'Bond Market Development', 'Stock Market Turnover Ratio'],
-        competitorCountry: '🇺🇸 United States',
-        competitorSuccessRate: 99,
-        implementationSummary: 'United States achieved 99% success in capital markets development, with stock market capitalization at 200% of GDP ($50 trillion), corporate bond market at $10 trillion, and 58% household equity ownership through 401(k) plans, IRAs, mutual funds, and ETFs. Regulatory framework (SEC, FINRA) ensures investor protection and market integrity. India can exceed this by leveraging digital infrastructure, expanding mutual fund penetration, and developing retail bond market.',
-        bestPractices: [
-          'Stock market capitalization at 200% of GDP ($50 trillion) provides deep liquidity and capital formation',
-          'Corporate bond market ($10 trillion) offers diversified financing options beyond bank credit',
-          '401(k) retirement plans and IRAs channel household savings into equities (58% ownership)',
-          'Robust regulatory framework (SEC, FINRA) with strict disclosure norms and investor protection',
-        ],
-        indiaAdaptations: [
-          'Expand mutual fund penetration: Increase AUM from ₹46 lakh crore to ₹150 lakh crore, target 10 crore investors',
-          'Develop retail bond market: Electronic bond platform, simplified issuance, tax incentives for retail investors',
-          'Pension fund reforms: Allow NPS to invest 75% in equities (currently 50%), expand subscriber base to 15 crore',
-          'SEBI reforms: T+0 settlement, fractional shares, 24x7 trading, enhanced investor education',
-        ],
-      },
-      {
-        name: 'Insurance & Pension Sector Expansion Mission',
-        description: 'Increase insurance penetration from 4.2% to 8% of GDP and pension fund assets from ₹9.73 lakh crore to ₹30 lakh crore through product innovation, distribution expansion, and mandatory pension coverage for all formal sector workers.',
-        category: 'Insurance and Pension Funds',
-        impact: 'High',
-        timeline: '8 years',
-        budget: 50000,
-        indicators: ['Insurance Penetration', 'Pension Fund Assets', 'Insurance Density'],
-        competitorCountry: '🇯🇵 Japan',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Japan achieved 96% success in insurance and pension development, with insurance penetration at 8.3% of GDP (¥540 trillion premiums), pension fund assets at ¥200 trillion (GPIF is world\'s largest at ¥220 trillion), and universal pension coverage. Aging population drove demand for life insurance and annuities. India can exceed this by leveraging young demographic dividend, digital distribution, and micro-insurance products.',
-        bestPractices: [
-          'Insurance penetration at 8.3% of GDP (¥540 trillion premiums) driven by life insurance and annuities',
-          'GPIF (Government Pension Investment Fund) manages ¥220 trillion with 50% equity allocation and global diversification',
-          'Universal pension coverage through mandatory contributions (18.3% of salary) and employer matching',
-          'Bancassurance model: 90% of life insurance sold through bank branches, reducing distribution costs',
-        ],
-        indiaAdaptations: [
-          'Micro-insurance expansion: Target 50 crore low-income households with ₹100-500 monthly premiums',
-          'Digital distribution: Leverage UPI, WhatsApp, and fintech partnerships to reduce acquisition costs by 70%',
-          'NPS reforms: Mandatory enrollment for all formal sector workers, increase contribution limits, tax benefits',
-          'Product innovation: Index-linked annuities, health-life combo products, parametric insurance for agriculture',
-        ],
-      },
-      {
-        name: 'Fintech Innovation & Digital Payments Acceleration',
-        description: 'Position India as global fintech leader by increasing digital payment transactions to 50 billion/month, expanding fintech startups to 10,000, and creating regulatory sandbox for innovation in blockchain, AI-driven lending, and embedded finance.',
-        category: 'Innovation and Digital Finance',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 100000,
-        indicators: ['Digital Payments', 'Financial Technology (Fintech) Adoption', 'Investment in Financial Technology'],
-        competitorCountry: '🇸🇬 Singapore',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Singapore achieved 98% success as global fintech hub, attracting $3.5 billion fintech investment (2023), hosting 1,400+ fintech firms, and processing 90% of payments digitally. Regulatory sandbox approved 100+ pilots, API-based banking (open banking) enabled innovation, and government-backed digital infrastructure (PayNow, SGFinDex) drove adoption. India can exceed this by leveraging UPI scale, ONDC integration, and Account Aggregator framework.',
-        bestPractices: [
-          'Regulatory sandbox approved 100+ fintech pilots with fast-track licensing for successful innovations',
-          'API-based open banking mandated for all banks, enabling 200+ fintech integrations',
-          'Government-backed digital infrastructure: PayNow (instant payments), SGFinDex (financial data aggregation)',
-          'Fintech investment of $3.5 billion (2023) attracted through tax incentives and talent programs',
-        ],
-        indiaAdaptations: [
-          'UPI internationalization: Expand to 50+ countries, enable cross-border remittances, integrate with SWIFT',
-          'ONDC integration: Link UPI with Open Network for Digital Commerce for seamless checkout and credit',
-          'Account Aggregator framework: Scale to 10 crore users, enable instant credit decisions and wealth management',
-          'Regulatory sandbox expansion: Approve 500+ pilots in blockchain, AI lending, embedded finance, and CBDC',
-        ],
-      },
-      {
-        name: 'MSME & SME Lending Transformation Program',
-        description: 'Expand credit to MSMEs from ₹20 lakh crore to ₹50 lakh crore through digital lending platforms, credit guarantee schemes, supply chain financing, and alternative credit scoring using GST, UPI, and digital footprint data.',
-        category: 'Access to Finance',
-        impact: 'Very High',
-        timeline: '6 years',
-        budget: 200000,
-        indicators: ['SME Lending', 'Credit to GDP Ratio', 'Microfinance Institutions'],
-        competitorCountry: '🇩🇪 Germany',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Germany achieved 97% success in SME financing through Mittelstand model, providing €1.2 trillion credit (38% of total bank lending) via regional banks (Sparkassen), KfW development bank (€100 billion annual lending), and credit guarantee schemes covering 80% of loans. SME default rate is only 1.2%. India can exceed this by leveraging digital lending, TReDS platform, and MUDRA scheme expansion.',
-        bestPractices: [
-          'Regional banks (Sparkassen) provide localized SME lending with relationship banking and flexible terms',
-          'KfW development bank provides €100 billion annual SME lending at subsidized rates with 80% credit guarantee',
-          'Supply chain financing integrated with ERP systems enables instant credit based on invoice discounting',
-          'Alternative credit scoring using business data (sales, inventory, payments) reduces collateral requirements',
-        ],
-        indiaAdaptations: [
-          'Digital lending platforms: Leverage GST data, UPI transactions, and digital footprint for instant credit decisions',
-          'TReDS platform expansion: Scale invoice discounting from ₹1 lakh crore to ₹10 lakh crore annually',
-          'MUDRA scheme enhancement: Increase loan limits to ₹50 lakh, reduce interest rates, extend repayment tenure',
-          'Credit guarantee fund: Expand CGTMSE corpus to ₹1 lakh crore, cover 80% of MSME loans up to ₹5 crore',
-        ],
-      },
-      {
-        name: 'Regulatory Excellence & Financial Stability Framework',
-        description: 'Strengthen financial regulation through independent supervisory authorities, enhanced AML/CFT measures, macro-prudential oversight, and stress testing framework to maintain financial stability and systemic risk mitigation.',
-        category: 'Regulatory and Supervisory Framework',
-        impact: 'High',
-        timeline: '5 years',
-        budget: 30000,
-        indicators: ['Regulatory Quality', 'Supervisory Independence', 'Anti-Money Laundering (AML) Measures'],
-        competitorCountry: '🇨🇭 Switzerland',
-        competitorSuccessRate: 99,
-        implementationSummary: 'Switzerland achieved 99% success in financial regulation, maintaining AAA credit rating and zero banking crises since 1990s through FINMA (independent regulator), strict capital adequacy (15% Tier 1 ratio vs 8% Basel norm), comprehensive AML framework (FATF compliant), and counter-cyclical capital buffers. Banking sector contributes 9% of GDP. India can exceed this by strengthening RBI autonomy, enhancing SEBI-RBI coordination, and implementing real-time risk monitoring.',
-        bestPractices: [
-          'FINMA (independent regulator) with legal autonomy, adequate funding, and enforcement powers',
-          'Strict capital adequacy: 15% Tier 1 ratio (vs 8% Basel norm) and counter-cyclical capital buffers',
-          'Comprehensive AML framework: Real-time transaction monitoring, beneficial ownership registry, FATF compliance',
-          'Stress testing framework: Annual system-wide stress tests with public disclosure and remedial action plans',
-        ],
-        indiaAdaptations: [
-          'RBI autonomy enhancement: Legal protection for Governor, fixed tenure, transparent monetary policy framework',
-          'FSDC strengthening: Real-time inter-regulatory coordination, unified risk dashboard, crisis management protocols',
-          'AML/CFT enhancement: AI-powered transaction monitoring, beneficial ownership registry, crypto asset regulation',
-          'Stress testing framework: Quarterly system-wide stress tests covering credit, market, liquidity, and cyber risks',
-        ],
-      },
-      {
-        name: 'Economic Stability & Inflation Targeting Framework',
-        description: 'Maintain macroeconomic stability through flexible inflation targeting (4% +/- 2%), fiscal consolidation (fiscal deficit below 4.5% of GDP), and building forex reserves to $1 trillion for exchange rate stability and external shock resilience.',
-        category: 'Economic Stability',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 50000,
-        indicators: ['Inflation Rate', 'Exchange Rate Stability', 'Fiscal Health'],
-        competitorCountry: '🇨🇱 Chile',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Chile achieved 96% success in inflation targeting, reducing inflation from 30% (1990) to 3% (2023) through independent central bank, flexible inflation targeting (3% +/- 1%), fiscal rule (structural balance), and sovereign wealth fund ($25 billion). Exchange rate flexibility absorbed external shocks. India can exceed this by strengthening RBI independence, fiscal discipline, and building forex reserves.',
-        bestPractices: [
-          'Independent central bank with legal mandate for price stability and operational autonomy',
-          'Flexible inflation targeting (3% +/- 1%) with transparent communication and forward guidance',
-          'Fiscal rule: Structural balance target with cyclical adjustments and escape clauses for crises',
-          'Sovereign wealth fund ($25 billion) from copper revenues provides fiscal buffer and intergenerational equity',
-        ],
-        indiaAdaptations: [
-          'RBI independence: Strengthen legal framework, transparent monetary policy committee, accountability mechanisms',
-          'Fiscal consolidation: Reduce fiscal deficit from 5.9% to 4.5% of GDP through tax reforms and expenditure rationalization',
-          'Forex reserves: Build reserves from $650 billion to $1 trillion through current account surplus and FDI',
-          'Sovereign wealth fund: Create National Investment Fund with disinvestment proceeds and surplus reserves',
-        ],
-      },
-      {
-        name: 'Payment Systems Modernization & Real-Time Infrastructure',
-        description: 'Upgrade payment infrastructure to process 100 billion transactions/year with 99.99% uptime through RTGS/NEFT enhancement, UPI 2.0 features, cross-border payment integration, and quantum-safe encryption for cybersecurity.',
-        category: 'Financial Infrastructure',
-        impact: 'High',
-        timeline: '4 years',
-        budget: 80000,
-        indicators: ['Payment Systems', 'Digital Payments', 'Financial Technology (Fintech) Adoption'],
-        competitorCountry: '🇸🇪 Sweden',
-        competitorSuccessRate: 99,
-        implementationSummary: 'Sweden achieved 99% success in payment systems modernization, becoming world\'s most cashless society with 98% digital payment adoption, instant payment system (Swish) processing 5 billion transactions/year, and 99.99% uptime. Central bank digital currency (e-krona) pilot completed. India can exceed this by leveraging UPI scale, expanding to rural areas, and integrating with global payment systems.',
-        bestPractices: [
-          'Instant payment system (Swish) processes 5 billion transactions/year with 99.99% uptime and sub-second settlement',
-          'Cashless society: 98% of transactions digital, only 1% of GDP in physical cash (vs 10% global average)',
-          'Central bank digital currency (e-krona) pilot tested retail and wholesale CBDC use cases',
-          'Quantum-safe encryption deployed across payment infrastructure to prevent future cyber threats',
-        ],
-        indiaAdaptations: [
-          'UPI 2.0 features: Offline payments, voice-based payments, conversational AI, and overdraft facility',
-          'Rural expansion: Deploy 5 lakh UPI QR codes in villages, enable feature phone compatibility',
-          'Cross-border integration: Link UPI with SWIFT, enable instant remittances to 50+ countries',
-          'Cybersecurity enhancement: Quantum-safe encryption, AI-powered fraud detection, biometric authentication',
-        ],
-      },
-      {
-        name: 'Credit Information & Financial Data Infrastructure',
-        description: 'Develop comprehensive credit information system covering 100 crore individuals and 10 crore businesses through credit bureau integration, Account Aggregator framework, and alternative data sources (utility payments, rent, digital footprint).',
-        category: 'Financial Infrastructure',
-        impact: 'High',
-        timeline: '5 years',
-        budget: 40000,
-        indicators: ['Credit Information Systems', 'Financial Inclusion', 'SME Lending'],
-        competitorCountry: '🇦🇺 Australia',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Australia achieved 97% success in credit information systems through comprehensive credit reporting (CCR) covering 100% of credit-active population, positive credit reporting (payment history, credit limits), and open banking framework enabling data portability. Credit bureau data accuracy is 99.5%. India can exceed this by leveraging Account Aggregator framework, Aadhaar integration, and alternative data sources.',
-        bestPractices: [
-          'Comprehensive credit reporting (CCR) covers 100% of credit-active population with 24-month payment history',
-          'Positive credit reporting includes on-time payments, credit limits, and account types (not just defaults)',
-          'Open banking framework enables consumer-consented data sharing with 200+ fintech integrations',
-          'Credit bureau data accuracy at 99.5% through automated verification and dispute resolution',
-        ],
-        indiaAdaptations: [
-          'Account Aggregator framework: Scale to 10 crore users, integrate all banks and NBFCs, enable instant credit decisions',
-          'Alternative data integration: Utility payments, rent, GST, UPI transactions, and digital footprint for credit scoring',
-          'Aadhaar-based credit history: Link credit bureau data with Aadhaar for unique identification and fraud prevention',
-          'Credit bureau reforms: Mandate positive credit reporting, reduce data lag to 24 hours, improve dispute resolution',
-        ],
-      },
-      {
-        name: 'Cryptocurrency & Digital Asset Regulation Framework',
-        description: 'Develop comprehensive regulatory framework for cryptocurrencies and digital assets through licensing regime for exchanges, investor protection measures, AML/CFT compliance, and CBDC integration for legal digital currency alternative.',
-        category: 'Innovation and Digital Finance',
-        impact: 'Medium',
-        timeline: '3 years',
-        budget: 20000,
-        indicators: ['Cryptocurrency Adoption', 'Investment in Financial Technology', 'Regulatory Quality'],
-        competitorCountry: '🇪🇺 European Union',
-        competitorSuccessRate: 95,
-        implementationSummary: 'European Union achieved 95% success in crypto regulation through MiCA (Markets in Crypto-Assets) framework, providing legal clarity for crypto assets, stablecoins, and exchanges. Licensing regime for crypto service providers, investor protection rules, and AML/CFT compliance mandatory. Crypto market capitalization in EU is €500 billion. India can exceed this by balancing innovation with consumer protection and integrating CBDC.',
-        bestPractices: [
-          'MiCA framework provides legal clarity for crypto assets, stablecoins, and utility tokens with classification system',
-          'Licensing regime for crypto service providers (exchanges, custodians, wallet providers) with capital requirements',
-          'Investor protection: Mandatory disclosures, white papers, and compensation schemes for exchange failures',
-          'AML/CFT compliance: Travel rule for crypto transfers, beneficial ownership registry, and transaction monitoring',
-        ],
-        indiaAdaptations: [
-          'Crypto regulation: Licensing regime for exchanges, capital adequacy norms, investor protection fund',
-          'CBDC integration: Position Digital Rupee as legal tender alternative to private cryptocurrencies',
-          'Taxation framework: Clarify tax treatment of crypto gains, losses, and staking rewards',
-          'Innovation sandbox: Allow experimentation with blockchain, DeFi, and tokenization under regulatory oversight',
-        ],
-      },
-      {
-        name: 'Green Finance & Sustainable Investment Framework',
-        description: 'Mobilize ₹50 lakh crore green finance by 2030 through green bonds, sustainability-linked loans, ESG disclosure mandates, carbon credit markets, and incentives for renewable energy, electric vehicles, and climate adaptation projects.',
-        category: 'Capital Markets',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 100000,
-        indicators: ['Bond Market Development', 'Investment in Financial Technology', 'Stock Market Capitalization'],
-        competitorCountry: '🇬🇧 United Kingdom',
-        competitorSuccessRate: 96,
-        implementationSummary: 'United Kingdom achieved 96% success in green finance, issuing £50 billion green gilts (government bonds), mobilizing £200 billion private green investment, and mandating TCFD (Task Force on Climate-related Financial Disclosures) for all listed companies. Green bond market is £100 billion. India can exceed this by leveraging sovereign green bonds, SEBI ESG mandates, and renewable energy targets.',
-        bestPractices: [
-          'Green gilts (£50 billion issued) provide benchmark for corporate green bonds and attract ESG investors',
-          'TCFD mandatory disclosure for all listed companies drives transparency and climate risk assessment',
-          'Green Investment Bank mobilized £12 billion for renewable energy, energy efficiency, and waste projects',
-          'Carbon credit market (UK ETS) with £50/ton price signal drives corporate decarbonization',
-        ],
-        indiaAdaptations: [
-          'Sovereign green bonds: Issue ₹5 lakh crore green bonds for renewable energy, EVs, and climate adaptation',
-          'SEBI ESG mandates: Mandatory ESG disclosure for top 1,000 listed companies, ESG ratings, and green indices',
-          'Carbon credit market: Establish national carbon market with ₹2,000/ton price, link with international markets',
-          'Green lending targets: Mandate banks to allocate 20% of credit to green sectors with concessional rates',
-        ],
-      },
-    ];
+  const getStatusBadge = (status: string) => {
+    if (status === 'on-track' || status === 'active') return <Badge className="bg-green-500">On Track</Badge>;
+    if (status === 'at-risk') return <Badge className="bg-yellow-500">At Risk</Badge>;
+    if (status === 'critical' || status === 'delayed') return <Badge variant="destructive">Critical</Badge>;
+    return <Badge variant="secondary">{status}</Badge>;
   };
 
-  // AI-Generated Policy Recommendations for Trade (with Competitor Analysis)
-  const generateTradePolicies = (): Policy[] => {
-    return [
-      {
-        name: 'National Export Promotion Mission 2030',
-        description: 'Comprehensive strategy to double India\'s merchandise exports to $1 trillion and services exports to $1 trillion by 2030 through product diversification, market expansion, quality upgradation, and digital trade infrastructure.',
-        category: 'Export Indicators',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 500000,
-        indicators: ['Total Export Value', 'Export Growth Rate', 'Top Export Products'],
-        competitorCountry: '🇨🇳 China',
-        competitorSuccessRate: 96,
-        implementationSummary: 'China achieved 96% success in becoming the world\'s largest exporter ($3.6 trillion) through export processing zones, VAT rebates (13-17%), state-backed financing, logistics infrastructure, and "Made in China 2025" strategy. India can exceed this by leveraging digital services dominance, pharmaceutical/vaccine manufacturing, green technology exports, GCC (Global Capability Centers) expansion, and integrating PLI schemes with export targets.',
-        bestPractices: [
-          'Export processing zones with duty-free imports and tax holidays attracted $200B FDI',
-          'VAT rebate system (13-17%) on exports enhanced competitiveness by 15%',
-          'State-backed export credit insurance covered 70% of exports, reducing risk',
-          'Belt and Road Initiative created new markets in 150+ countries',
-        ],
-        indiaAdaptations: [
-          'Leverage IT/digital services dominance: Target $500B services exports (fintech, AI, cloud)',
-          'Pharmaceutical/vaccine manufacturing: Position as "Pharmacy of the World" with $100B exports',
-          'Green technology exports: Solar panels, EVs, green hydrogen (capitalize on global energy transition)',
-          'GCC expansion: 1,600+ centers employ 1.6M, target $100B exports in R&D, analytics, engineering',
-        ],
-      },
-      {
-        name: 'Strategic Trade Partnership Framework',
-        description: 'Negotiate and implement comprehensive trade agreements with top 50 trading partners, focusing on tariff reduction, non-tariff barrier elimination, services liberalization, and investment protection to enhance bilateral trade.',
-        category: 'Trade Partner Indicators',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: 50000,
-        indicators: ['Top Trading Partners', 'Bilateral Trade Agreements', 'Regional Trade Agreements'],
-        competitorCountry: '🇪🇺 European Union',
-        competitorSuccessRate: 98,
-        implementationSummary: 'EU achieved 98% success with 40+ FTAs covering 70+ countries, creating the world\'s largest single market (450M consumers, $18 trillion GDP) through deep integration (customs union, common standards), mutual recognition agreements, and phased tariff elimination. India can exceed this by leveraging diaspora networks (32M globally), focusing on growth markets (Africa, Latin America, ASEAN), and negotiating "India-first" clauses in critical sectors (pharma, IT, agriculture).',
-        bestPractices: [
-          'Deep integration: Customs union, common standards, and regulatory harmonization reduced trade costs by 30%',
-          'Mutual recognition agreements: Eliminated duplicate testing/certification, saving €1B annually',
-          'Phased tariff elimination: 10-year transition periods allowed industries to adapt',
-          'Dispute resolution mechanism: Independent arbitration resolved 95% of trade disputes',
-        ],
-        indiaAdaptations: [
-          'Leverage diaspora networks: 32M Indians globally as trade ambassadors and market connectors',
-          'Focus on growth markets: Africa (2.5B by 2050), Latin America, ASEAN (fastest-growing regions)',
-          '"India-first" clauses: Protect critical sectors (pharma, IT, agriculture) while opening others',
-          'Digital trade agreements: Include data localization, e-commerce, and digital services provisions',
-        ],
-      },
-      {
-        name: 'Import Substitution & Self-Reliance Initiative',
-        description: 'Reduce import dependency in critical sectors (electronics, energy, defense, chemicals) through domestic manufacturing incentives, technology transfer, R&D support, and quality standards to cut trade deficit by 50%.',
-        category: 'Import Indicators',
-        impact: 'Very High',
-        timeline: '8 years',
-        budget: 800000,
-        indicators: ['Total Import Value', 'Import Growth Rate', 'Top Import Products'],
-        competitorCountry: '🇰🇷 South Korea',
-        competitorSuccessRate: 95,
-        implementationSummary: 'South Korea achieved 95% success in import substitution, transforming from $2B trade deficit (1960s) to $60B surplus (2023) through chaebols (Samsung, Hyundai), heavy industry focus (steel, shipbuilding, electronics), technology licensing, and export-oriented industrialization. India can exceed this by leveraging PLI schemes ($30B), semiconductor mission, green hydrogen production, and defense indigenization (Atmanirbhar Bharat).',
-        bestPractices: [
-          'Chaebol system: Conglomerates with government backing achieved economies of scale',
-          'Heavy industry focus: Steel, shipbuilding, electronics reduced import dependency by 70%',
-          'Technology licensing: Acquired foreign tech, then innovated (Samsung now leads in semiconductors)',
-          'Export-oriented industrialization: Domestic production exceeded local demand, creating export surplus',
-        ],
-        indiaAdaptations: [
-          'PLI schemes: $30B across 14 sectors (electronics, pharma, automobiles, textiles) to boost manufacturing',
-          'Semiconductor mission: $10B investment to produce chips domestically, reduce $24B import bill',
-          'Green hydrogen: 5 MMT production by 2030 to replace LNG imports ($50B annually)',
-          'Defense indigenization: Atmanirbhar Bharat targets 70% domestic sourcing by 2027',
-        ],
-      },
-      {
-        name: 'Trade Facilitation & Digitalization Program',
-        description: 'Implement end-to-end digital trade infrastructure including single-window clearance, blockchain-based documentation, AI-powered risk assessment, and 24x7 customs operations to reduce trade transaction time from 10 days to 2 days.',
-        category: 'Logistics and Infrastructure',
-        impact: 'High',
-        timeline: '4 years',
-        budget: 150000,
-        indicators: ['Port Efficiency', 'Transport Costs'],
-        competitorCountry: '🇸🇬 Singapore',
-        competitorSuccessRate: 99,
-        implementationSummary: 'Singapore achieved 99% success as the world\'s most efficient port (PSA handles 37M TEUs) and trade hub through TradeNet (single-window system processing 99% of permits in 10 minutes), paperless trade (100% digital), 24x7 operations, and free trade zone covering entire island. India can exceed this by leveraging scale (12 major ports, 200+ minor ports), ULIP integration, and National Single Window System (NSWS) expansion.',
-        bestPractices: [
-          'TradeNet single-window: 99% of trade permits processed in 10 minutes (vs. days elsewhere)',
-          'Paperless trade: 100% digital documentation saved $1B annually in processing costs',
-          '24x7 operations: Round-the-clock customs, port, and logistics services reduced dwell time by 60%',
-          'Free trade zone: Entire island designated as FTZ, simplifying regulations and attracting transshipment',
-        ],
-        indiaAdaptations: [
-          'ULIP integration: Unified Logistics Interface Platform connects 36 systems across 7 ministries',
-          'NSWS expansion: National Single Window System covers 32 ministries, target 95% permits in 24 hours',
-          'Blockchain documentation: Pilot in JNPT (Jawaharlal Nehru Port) reduced container release time by 50%',
-          'AI risk assessment: Machine learning identifies high-risk shipments, expedites low-risk (80% of trade)',
-        ],
-      },
-      {
-        name: 'Tariff Rationalization & Competitiveness Enhancement',
-        description: 'Simplify tariff structure from 21,000+ tariff lines to 5,000, reduce average tariff from 13.8% to 8%, eliminate inverted duty structure, and align with global best practices to enhance export competitiveness.',
-        category: 'Tariff and Non-Tariff Barriers',
-        impact: 'High',
-        timeline: '3 years',
-        budget: 20000,
-        indicators: ['Average Tariff Rates', 'Non-Tariff Barriers'],
-        competitorCountry: '🇦🇺 Australia',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Australia achieved 97% success in tariff liberalization, reducing average tariff from 15% (1980s) to 2.4% (2023) through unilateral tariff cuts, FTA negotiations (16 FTAs covering 70% of trade), and elimination of most non-tariff barriers. This boosted trade from 30% to 50% of GDP. India can exceed this by phased tariff reduction (protect sensitive sectors), FTA acceleration (target 20 FTAs by 2030), and regulatory simplification.',
-        bestPractices: [
-          'Unilateral tariff cuts: Reduced average tariff from 15% to 2.4% over 30 years, boosting trade',
-          'FTA acceleration: 16 FTAs covering 70% of trade (China, Japan, ASEAN, US) enhanced market access',
-          'Elimination of non-tariff barriers: Simplified regulations, mutual recognition agreements',
-          'Phased approach: Protected sensitive sectors (agriculture) while liberalizing manufacturing',
-        ],
-        indiaAdaptations: [
-          'Phased tariff reduction: Reduce average tariff from 13.8% to 8% over 5 years (protect MSMEs, agriculture)',
-          'FTA acceleration: Target 20 FTAs by 2030 (ongoing: UK, EU, Canada; new: GCC, Latin America)',
-          'Inverted duty correction: Eliminate cases where input tariffs exceed output tariffs (hurts manufacturing)',
-          'Regulatory simplification: Reduce 21,000+ tariff lines to 5,000, align with HS codes',
-        ],
-      },
-      {
-        name: 'Foreign Direct Investment Attraction & Retention Strategy',
-        description: 'Increase FDI inflows from $85B to $200B annually through sector liberalization, ease of doing business reforms, investment promotion, and investor protection to boost manufacturing, infrastructure, and services.',
-        category: 'Foreign Direct Investment',
-        impact: 'Very High',
-        timeline: '6 years',
-        budget: 100000,
-        indicators: ['FDI Inflows', 'FDI Outflows'],
-        competitorCountry: '🇻🇳 Vietnam',
-        competitorSuccessRate: 94,
-        implementationSummary: 'Vietnam achieved 94% success in attracting FDI, increasing from $2B (2000) to $20B (2023) through 100% foreign ownership in most sectors, tax holidays (4 years), streamlined approvals (15 days), and positioning as "China+1" manufacturing hub. FDI now accounts for 70% of exports. India can exceed this by leveraging market size (1.4B consumers), skilled workforce, and democratic stability.',
-        bestPractices: [
-          '100% foreign ownership: Allowed in most sectors (except strategic), attracting global giants',
-          'Tax holidays: 4-year corporate tax exemption + 50% reduction for next 9 years',
-          'Streamlined approvals: Investment licenses issued in 15 days (vs. months in other countries)',
-          '"China+1" positioning: Attracted Apple, Samsung, Intel as they diversified supply chains',
-        ],
-        indiaAdaptations: [
-          'Sector liberalization: Increase FDI caps in insurance (74%), defense (74%), telecom (100%)',
-          'Ease of doing business: Single-window clearance, online approvals, reduce compliance burden',
-          'Investment promotion: Invest India agency provides handholding, land allocation, regulatory support',
-          'Market size advantage: 1.4B consumers, $3.7 trillion economy, fastest-growing major economy',
-        ],
-      },
-      {
-        name: 'Currency Stability & Exchange Rate Management',
-        description: 'Maintain rupee stability through forex reserves ($600B+), capital flow management, hedging instruments, and gradual internationalization of rupee to reduce exchange rate volatility and enhance trade predictability.',
-        category: 'Exchange Rates',
-        impact: 'High',
-        timeline: '5 years',
-        budget: 50000,
-        indicators: ['Exchange Rate Stability', 'Impact of Exchange Rates'],
-        competitorCountry: '🇨🇭 Switzerland',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Switzerland achieved 98% success in currency stability, maintaining Swiss Franc as safe-haven currency through independent central bank, forex interventions (CHF 100B annually), inflation targeting (0-2%), and fiscal discipline. Currency stability attracted $1.5 trillion foreign assets. India can exceed this by building forex reserves ($1 trillion target), rupee internationalization (trade settlement in INR), and inflation control (4% target).',
-        bestPractices: [
-          'Independent central bank: Swiss National Bank operates free from political interference',
-          'Forex interventions: CHF 100B annual interventions to prevent excessive appreciation',
-          'Inflation targeting: Strict 0-2% target maintained for decades, ensuring purchasing power',
-          'Fiscal discipline: Debt-to-GDP ratio of 40%, balanced budgets, and structural reforms',
-        ],
-        indiaAdaptations: [
-          'Forex reserves: Build from $600B to $1 trillion to cushion against external shocks',
-          'Rupee internationalization: Promote INR for trade settlement (started with Russia, UAE)',
-          'Inflation control: RBI targets 4% (+/- 2%), use monetary policy tools to manage volatility',
-          'Capital flow management: Gradual capital account liberalization with safeguards',
-        ],
-      },
-      {
-        name: 'Sectoral Export Specialization Program',
-        description: 'Identify and develop 20 high-potential export sectors (pharma, IT, textiles, engineering, chemicals, agriculture) with dedicated support for R&D, quality certification, market access, and branding to create global champions.',
-        category: 'Trade Balance by Sector',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: 400000,
-        indicators: ['Sectoral Export and Import Data'],
-        competitorCountry: '🇩🇪 Germany',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Germany achieved 97% success as export champion ($1.6 trillion, 3rd globally) through "Mittelstand" (hidden champions in niche sectors), dual education system (vocational training), industry 4.0 adoption, and "Made in Germany" quality brand. 99% of exporters are SMEs. India can exceed this by leveraging IT services dominance, pharmaceutical manufacturing, and emerging sectors (green tech, space, defense).',
-        bestPractices: [
-          'Mittelstand model: 1,300+ "hidden champions" dominate global niche markets (70% market share)',
-          'Dual education system: Vocational training produces skilled workforce for manufacturing',
-          'Industry 4.0: Automation, IoT, and AI integration increased productivity by 30%',
-          '"Made in Germany" brand: Quality reputation commands 15-20% price premium globally',
-        ],
-        indiaAdaptations: [
-          'IT services dominance: $250B exports, target $500B by 2030 (AI, cloud, cybersecurity)',
-          'Pharmaceutical manufacturing: $25B exports, target $100B (vaccines, generics, APIs)',
-          'Emerging sectors: Green tech (solar, EVs), space (satellite launches), defense (Brahmos)',
-          'MSME export support: Dedicated schemes for 63M MSMEs to enter global markets',
-        ],
-      },
-      {
-        name: 'Port Modernization & Logistics Efficiency Initiative',
-        description: 'Upgrade 12 major ports and 200 minor ports with automation, deep-water berths, container handling capacity (30 MTPA), and multimodal connectivity to reduce logistics costs from 14% to 8% of GDP.',
-        category: 'Logistics and Infrastructure',
-        impact: 'Very High',
-        timeline: '8 years',
-        budget: 600000,
-        indicators: ['Port Efficiency', 'Transport Costs'],
-        competitorCountry: '🇳🇱 Netherlands',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Netherlands achieved 98% success with Rotterdam Port (Europe\'s largest, 15M TEUs) through automation (unmanned container terminals), deep-water access (24m draft), multimodal connectivity (rail, road, inland waterways), and digitalization (Port Community System). Logistics costs are 6% of GDP. India can exceed this by leveraging Sagarmala program, coastal shipping (reduce road dependency), and ULIP integration.',
-        bestPractices: [
-          'Automation: Unmanned container terminals increased efficiency by 40%, reduced costs by 25%',
-          'Deep-water access: 24m draft allows largest container ships, reducing per-unit costs',
-          'Multimodal connectivity: 40% cargo moves by rail/inland waterways (vs. 10% road)',
-          'Port Community System: Digital platform connects 1,500+ companies, real-time data sharing',
-        ],
-        indiaAdaptations: [
-          'Sagarmala program: ₹6 lakh crore investment in port modernization, connectivity, industrialization',
-          'Coastal shipping: Increase share from 7% to 20% of cargo (reduce road congestion, emissions)',
-          'ULIP integration: Connect ports with customs, railways, trucking for seamless cargo movement',
-          'PPP model: Private sector participation in port development (Adani, DP World)',
-        ],
-      },
-      {
-        name: 'Trade Finance & Export Credit Enhancement',
-        description: 'Expand export credit availability from $50B to $200B through EXIM Bank capitalization, trade credit insurance, factoring services, and fintech integration to support MSMEs and reduce payment risks.',
-        category: 'Export Indicators',
-        impact: 'High',
-        timeline: '4 years',
-        budget: 80000,
-        indicators: ['Total Export Value', 'Export Growth Rate'],
-        competitorCountry: '🇯🇵 Japan',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Japan achieved 96% success in trade finance through JBIC (Japan Bank for International Cooperation) and NEXI (export credit insurance) providing $150B annually in export financing, covering 80% of exports. This supported Japanese companies in infrastructure projects globally. India can exceed this by capitalizing EXIM Bank, expanding ECGC coverage, and integrating fintech (invoice discounting, blockchain trade finance).',
-        bestPractices: [
-          'JBIC financing: $150B annually in export credits, project finance, and investment guarantees',
-          'NEXI insurance: Covers 80% of exports against payment default, political risk, currency fluctuation',
-          'Buyer\'s credit: Financing for foreign buyers to purchase Japanese goods (win-win)',
-          'Long-term relationships: Patient capital for infrastructure projects (10-30 year tenures)',
-        ],
-        indiaAdaptations: [
-          'EXIM Bank capitalization: Increase lending capacity from $50B to $200B for export financing',
-          'ECGC expansion: Export Credit Guarantee Corporation covers 90% of exports (vs. current 10%)',
-          'Fintech integration: Invoice discounting, blockchain trade finance, digital letters of credit',
-          'MSME focus: Dedicated schemes for 63M MSMEs (simplified documentation, faster approvals)',
-        ],
-      },
-      {
-        name: 'Trade Balance Optimization & Deficit Reduction',
-        description: 'Reduce trade deficit from $250B to $100B through export promotion, import substitution, energy transition (reduce oil imports), and value-added manufacturing to achieve balanced trade by 2035.',
-        category: 'Trade Balance',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: 300000,
-        indicators: ['Balance of Trade', 'Trade Surplus/Deficit'],
-        competitorCountry: '🇲🇽 Mexico',
-        competitorSuccessRate: 93,
-        implementationSummary: 'Mexico achieved 93% success in trade balance transformation, moving from $20B deficit (1990s) to $20B surplus (2023) through USMCA (duty-free access to US/Canada), nearshoring (manufacturing relocation from Asia), automotive exports ($140B), and energy reforms. India can exceed this by leveraging China+1 opportunity, GCC expansion, and green energy transition.',
-        bestPractices: [
-          'USMCA advantage: Duty-free access to US/Canada markets (500M consumers, $25 trillion GDP)',
-          'Nearshoring: Manufacturing relocation from Asia due to supply chain risks, labor costs',
-          'Automotive exports: $140B annually (GM, Ford, VW, Toyota plants), 80% to US',
-          'Energy reforms: Oil/gas production increased, reduced import dependency',
-        ],
-        indiaAdaptations: [
-          'China+1 opportunity: Position as alternative manufacturing hub (Apple, Samsung already shifting)',
-          'GCC expansion: 1,600+ Global Capability Centers employ 1.6M, target $100B exports',
-          'Green energy transition: Solar, wind, green hydrogen reduce $150B oil/gas import bill',
-          'Value-added manufacturing: Move up value chain (electronics assembly → chip design)',
-        ],
-      },
-      {
-        name: 'Digital Trade & E-Commerce Expansion',
-        description: 'Promote digital trade through e-commerce export platforms, digital payment integration, cross-border data flows, and participation in digital trade agreements to capture $500B global digital trade opportunity.',
-        category: 'Export Indicators',
-        impact: 'High',
-        timeline: '5 years',
-        budget: 120000,
-        indicators: ['Total Export Value', 'Export Growth Rate', 'Top Export Products'],
-        competitorCountry: '🇬🇧 United Kingdom',
-        competitorSuccessRate: 95,
-        implementationSummary: 'UK achieved 95% success in digital trade ($350B, 50% of services exports) through fintech dominance (London as global hub), digital services exports (advertising, software, consulting), data protection framework (GDPR), and digital trade agreements. India can exceed this by leveraging IT talent pool (5M professionals), UPI success (digital payments), and English language advantage.',
-        bestPractices: [
-          'Fintech dominance: London as global fintech hub, $11B investment, 2,500+ companies',
-          'Digital services exports: Advertising, software, consulting, design ($350B annually)',
-          'Data protection framework: GDPR compliance ensures trust, enables cross-border data flows',
-          'Digital trade agreements: Included in UK-Australia, UK-Japan FTAs (data localization exemptions)',
-        ],
-        indiaAdaptations: [
-          'IT talent pool: 5M professionals, 1,600+ GCCs, target $500B digital services exports',
-          'UPI internationalization: Expand Unified Payments Interface to 50+ countries for cross-border payments',
-          'E-commerce export platforms: Government-backed platforms for MSMEs to access global markets',
-          'Data protection framework: Digital Personal Data Protection Act enables trusted data flows',
-        ],
-      },
-    ];
+  const getTrendIcon = (trend: string) => {
+    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
+    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
+    return <Activity className="h-4 w-4 text-gray-500" />;
   };
 
-  // AI-Generated Policy Recommendations for Environmental Protection (with Competitor Analysis)
-  const generateEnvironmentalPolicies = (): Policy[] => {
-    return [
-      {
-        name: 'Net Zero Carbon Mission 2050',
-        description: 'Comprehensive decarbonization strategy targeting net-zero emissions by 2050 through renewable energy transition (500 GW by 2030), carbon capture and storage (50 MT/year), afforestation (10 million hectares), and green hydrogen economy (5 MMT production). Includes carbon pricing mechanism, green bonds, and just transition framework for coal-dependent regions.',
-        category: 'Greenhouse Gas Emissions',
-        impact: 'Very High',
-        timeline: '25 years',
-        budget: 1500000,
-        indicators: ['CO2 Emissions', 'Methane Emissions', 'Carbon Footprint'],
-        competitorCountry: '🇩🇰 Denmark',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Denmark achieved 96% success in reducing emissions by 70% since 1990 while growing GDP by 130% through wind energy dominance (50% of electricity), district heating networks, carbon taxes ($60/ton), and green public procurement. India can exceed this by leveraging solar potential (300+ sunny days), green hydrogen for hard-to-abate sectors, carbon border adjustment mechanism, and integrating climate action with development goals.',
-        bestPractices: [
-          'Wind energy provides 50% of electricity with offshore wind expansion',
-          'Carbon tax of $60/ton with revenue recycling to green investments',
-          'District heating networks using waste heat and biomass reduce emissions by 40%',
-          'Green public procurement mandates for government purchases drive market transformation'
-        ],
-        indiaAdaptations: [
-          'Leverage 300+ sunny days for solar dominance (500 GW by 2030)',
-          'Green hydrogen production (5 MMT) for steel, cement, and fertilizer sectors',
-          'Carbon Border Adjustment Mechanism (CBAM) for exports to EU',
-          'Just Transition Framework: Reskill 3 lakh coal workers, diversify coal belt economies'
-        ]
-      },
-      {
-        name: 'National Climate Adaptation & Resilience Program',
-        description: 'Build climate resilience across vulnerable sectors and regions through early warning systems (100% coverage), climate-resilient infrastructure (₹10 lakh crore investment), ecosystem-based adaptation (mangrove restoration, wetland conservation), and community-led adaptation plans. Focus on coastal areas, Himalayan regions, and drought-prone zones.',
-        category: 'Temperature & Extreme Weather',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: 800000,
-        indicators: ['Temperature Anomalies', 'Frequency of Heatwaves', 'Drought Incidence'],
-        competitorCountry: '🇳🇱 Netherlands',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Netherlands achieved 98% success in climate adaptation through Delta Works (world\'s largest flood protection), Room for the River program, floating architecture, and integrated water management. With 26% land below sea level, they invested 1% of GDP annually. India can exceed this by leveraging space technology (ISRO satellites), AI-powered early warning systems, traditional knowledge integration, and nature-based solutions at scale.',
-        bestPractices: [
-          'Delta Works: €12B investment in storm surge barriers and dikes protects 60% of population',
-          'Room for the River: Giving rivers more space reduces flood risk by 40%',
-          'Floating architecture and amphibious housing for flood-prone areas',
-          'Integrated water management: Linking flood defense, water supply, and spatial planning'
-        ],
-        indiaAdaptations: [
-          'ISRO satellite network for real-time climate monitoring and early warnings',
-          'AI-powered heatwave prediction system with SMS alerts in regional languages',
-          'Mangrove restoration (1 million hectares) for coastal protection and carbon sequestration',
-          'Traditional water harvesting revival: 1 lakh check dams, johads, and bavdis'
-        ]
-      },
-      {
-        name: 'Ocean & Coastal Protection Initiative',
-        description: 'Comprehensive marine conservation program protecting 30% of coastal and marine areas, restoring coral reefs and mangroves, reducing ocean plastic pollution by 90%, establishing marine protected areas, and implementing sustainable blue economy practices. Includes coastal community livelihood support and climate-resilient coastal infrastructure.',
-        category: 'Ocean Health & Sea Level Rise',
-        impact: 'High',
-        timeline: '15 years',
-        budget: 500000,
-        indicators: ['Ocean Acidification', 'Mean Sea Level', 'Rate of Sea Level Rise'],
-        competitorCountry: '🇦🇺 Australia',
-        competitorSuccessRate: 94,
-        implementationSummary: 'Australia achieved 94% success in marine conservation through Great Barrier Reef protection (₹2B annual investment), 36% marine protected areas, plastic ban, and blue carbon initiatives. India can exceed this by leveraging 7,500 km coastline, integrating traditional fishing practices, deploying artificial reefs, and linking ocean health to coastal livelihoods for 4 crore people.',
-        bestPractices: [
-          'Great Barrier Reef Marine Park: Zoning system balances conservation and sustainable use',
-          '36% of marine areas protected with no-take zones showing 670% more fish',
-          'Plastic ban and container deposit scheme achieved 80% recycling rate',
-          'Blue carbon projects: Seagrass and mangrove restoration sequester 5 MT CO2/year'
-        ],
-        indiaAdaptations: [
-          'Protect 7,500 km coastline: 30% marine protected areas by 2030',
-          'Coral reef restoration using biorock technology in Lakshadweep and Andaman',
-          'Plastic-free coastal zones: Ban single-use plastics, deploy ocean cleanup systems',
-          'Blue economy: Sustainable fishing licenses, seaweed farming, coastal ecotourism'
-        ]
-      },
-      {
-        name: 'Himalayan Ecosystem Conservation & Glacier Protection',
-        description: 'Protect Himalayan glaciers and ecosystems through glacier monitoring network, sustainable mountain development, afforestation (5 million hectares), black carbon reduction, and community-based conservation. Address glacier retreat, biodiversity loss, and water security for 1.3 billion people dependent on Himalayan rivers.',
-        category: 'Ice and Snow',
-        impact: 'Very High',
-        timeline: '20 years',
-        budget: 400000,
-        indicators: ['Glacier Mass Balance', 'Temperature Anomalies', 'Biodiversity'],
-        competitorCountry: '🇨🇭 Switzerland',
-        competitorSuccessRate: 95,
-        implementationSummary: 'Switzerland achieved 95% success in Alpine protection through glacier monitoring (150 years of data), sustainable mountain tourism, avalanche protection systems, and strict development regulations. Despite losing 60% glacier volume since 1850, they adapted through water management and ecosystem restoration. India can exceed this by leveraging space technology, traditional Himalayan knowledge, cross-border cooperation (Hindu Kush Himalaya), and linking glacier health to downstream water security.',
-        bestPractices: [
-          'Glacier monitoring network: 150 years of continuous data informs policy',
-          'Sustainable mountain tourism: Limits on development, eco-certification',
-          'Avalanche and landslide protection: Engineering solutions + forest conservation',
-          'Alpine ecosystem restoration: Reforestation, wildlife corridors, species protection'
-        ],
-        indiaAdaptations: [
-          'ISRO-led glacier monitoring: Satellite + ground sensors for 9,575 glaciers',
-          'Black carbon reduction: Clean cookstoves for 5 crore Himalayan households',
-          'Community-based conservation: Van Panchayats manage 5 million hectares',
-          'Cross-border cooperation: Hindu Kush Himalaya partnership with Nepal, Bhutan, China'
-        ]
-      },
-      {
-        name: 'National Afforestation & Biodiversity Mission',
-        description: 'Increase forest cover to 33% of geographical area through massive afforestation (10 million hectares), urban forests (1,000 cities), agroforestry integration, wildlife corridor restoration, and community forest management. Includes biodiversity hotspot protection, endangered species recovery, and forest-based livelihoods for 10 crore tribal population.',
-        category: 'Ecosystems',
-        impact: 'Very High',
-        timeline: '15 years',
-        budget: 600000,
-        indicators: ['Forest Cover', 'Biodiversity', 'Carbon Footprint'],
-        competitorCountry: '🇨🇷 Costa Rica',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Costa Rica achieved 97% success in reversing deforestation, increasing forest cover from 26% (1983) to 52% (2020) through Payment for Ecosystem Services (PES), ecotourism (3 million visitors/year generating $4B), and constitutional right to healthy environment. India can exceed this by leveraging massive scale (10 million hectares), integrating tribal knowledge, using drone-based plantation, and linking forests to carbon markets and green jobs.',
-        bestPractices: [
-          'Payment for Ecosystem Services: Landowners paid $64/hectare/year for conservation',
-          'Ecotourism generates $4B annually, creating 200,000 green jobs',
-          'Biological corridors connect protected areas, enabling wildlife movement',
-          'Constitutional right to healthy environment drives policy and enforcement'
-        ],
-        indiaAdaptations: [
-          'Drone-based plantation: 10 million hectares in 10 years using seed balls',
-          'Van Dhan Vikas Yojana: Forest-based livelihoods for 10 crore tribal population',
-          'Urban forests: Miyawaki method in 1,000 cities creates micro-forests',
-          'Carbon markets: Sell forest carbon credits to fund conservation (₹50,000 Cr revenue)'
-        ]
-      },
-      {
-        name: 'Circular Economy & Zero Waste Mission',
-        description: 'Transition to circular economy through extended producer responsibility, waste-to-energy plants (500 facilities), 100% waste segregation, plastic alternatives, e-waste management, and zero-landfill cities. Target 80% waste recycling, 50% reduction in virgin material use, and creation of 5 million green jobs in waste management sector.',
-        category: 'Human Impact',
-        impact: 'High',
-        timeline: '10 years',
-        budget: 350000,
-        indicators: ['Carbon Footprint', 'Energy Consumption', 'Population Growth'],
-        competitorCountry: '🇯🇵 Japan',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Japan achieved 96% success in circular economy through Sound Material-Cycle Society law, 84% recycling rate, zero-waste towns (Kamikatsu: 45 waste categories), and advanced waste-to-energy technology. India can exceed this by leveraging informal sector (1.5 crore waste pickers), digital waste tracking, decentralized waste processing, and integrating circular economy with Make in India for resource security.',
-        bestPractices: [
-          '84% recycling rate through mandatory waste separation (9 categories)',
-          'Extended Producer Responsibility: Manufacturers responsible for product lifecycle',
-          'Zero-waste towns: Kamikatsu recycles 84% with 45 waste categories',
-          'Waste-to-energy: 1,200 plants generate 7% of electricity'
-        ],
-        indiaAdaptations: [
-          'Formalize 1.5 crore waste pickers: Social security, training, equipment',
-          'Digital waste tracking: Aadhaar-linked waste segregation with incentives',
-          'Decentralized waste processing: 10,000 material recovery facilities in cities',
-          'Plastic alternatives: Promote jute, bamboo, bagasse; ban single-use plastics'
-        ]
-      },
-      {
-        name: 'Renewable Energy Transition Accelerator',
-        description: 'Accelerate renewable energy adoption to 80% of electricity mix by 2040 through solar (500 GW), wind (200 GW), hydro (100 GW), and emerging technologies (green hydrogen, tidal, geothermal). Includes grid modernization, energy storage (200 GWh), rooftop solar (100 GW), and phasing out coal power (210 GW) with just transition support.',
-        category: 'Greenhouse Gas Emissions',
-        impact: 'Very High',
-        timeline: '15 years',
-        budget: 2000000,
-        indicators: ['CO2 Emissions', 'Energy Consumption', 'Carbon Footprint'],
-        competitorCountry: '🇮🇸 Iceland',
-        competitorSuccessRate: 99,
-        implementationSummary: 'Iceland achieved 99% success with 100% renewable electricity (73% hydro, 27% geothermal) and 90% renewable heating through geothermal district heating, aluminum smelting using clean energy, and carbon-neutral economy. India can exceed this by leveraging diverse renewable potential (solar 750 GW, wind 300 GW, hydro 150 GW), manufacturing scale (PLI for solar/batteries), green hydrogen for industry, and leapfrogging to smart grids.',
-        bestPractices: [
-          '100% renewable electricity: 73% hydro, 27% geothermal since 1970s',
-          'Geothermal district heating: 90% of homes heated sustainably',
-          'Carbon-neutral economy: Aluminum smelting using 100% renewable energy',
-          'Geothermal innovation: Direct use for greenhouses, fish farming, snow melting'
-        ],
-        indiaAdaptations: [
-          'Solar dominance: 500 GW by 2030 leveraging 300+ sunny days',
-          'Green hydrogen: 5 MMT production for steel, cement, fertilizer decarbonization',
-          'Smart grids: AI-powered demand response, battery storage (200 GWh)',
-          'Coal phase-out: Just transition for 3 lakh workers, diversify coal belt economies'
-        ]
-      },
-      {
-        name: 'Air Quality Revolution Program',
-        description: 'Achieve WHO air quality standards across all cities through vehicular emission control (BS-VII norms, EV transition), industrial pollution abatement, construction dust management, stubble burning alternatives, and clean cooking fuel (100% LPG/electric). Real-time air quality monitoring, green zones, and public awareness campaigns.',
-        category: 'Human Impact',
-        impact: 'Very High',
-        timeline: '8 years',
-        budget: 450000,
-        indicators: ['Carbon Footprint', 'Temperature Anomalies', 'Population Growth'],
-        competitorCountry: '🇸🇬 Singapore',
-        competitorSuccessRate: 98,
-        implementationSummary: 'Singapore achieved 98% success in air quality (PM2.5: 15 µg/m³) through vehicle quota system, congestion pricing, 100% public transport usage, strict industrial standards, and green building codes. India can exceed this by leveraging scale (EV manufacturing hub), crop residue management (bio-CNG, pelletization), real-time monitoring network, and integrating air quality with urban planning.',
-        bestPractices: [
-          'Vehicle quota system limits car ownership, reducing emissions by 60%',
-          'Congestion pricing: Electronic Road Pricing reduces traffic by 45%',
-          '100% public transport usage through efficient MRT and bus network',
-          'Green building codes: All new buildings must meet energy efficiency standards'
-        ],
-        indiaAdaptations: [
-          'BS-VII emission norms by 2027, EV transition (30% by 2030)',
-          'Crop residue management: Bio-CNG plants, pelletization, in-situ decomposition',
-          'Real-time monitoring: 4,000 air quality sensors in 1,000 cities',
-          'Green zones: Car-free days, pedestrian streets, urban forests in 100 cities'
-        ]
-      },
-      {
-        name: 'Water Security & Conservation Mission',
-        description: 'Ensure water security through rainwater harvesting (mandatory for all buildings), groundwater recharge (1 lakh structures), river rejuvenation (100 rivers), wastewater treatment (100% coverage), and efficient irrigation (drip/sprinkler for 50% area). Includes water pricing reform, community-based management, and climate-resilient water infrastructure.',
-        category: 'Ecosystems & Human Impact',
-        impact: 'Very High',
-        timeline: '12 years',
-        budget: 700000,
-        indicators: ['Biodiversity', 'Drought Incidence', 'Population Growth'],
-        competitorCountry: '🇮🇱 Israel',
-        competitorSuccessRate: 97,
-        implementationSummary: 'Israel achieved 97% success in water security despite 60% desert, through 90% wastewater recycling (world\'s highest), desalination (80% of drinking water), drip irrigation invention, and water pricing ($2.80/m³). India can exceed this by leveraging traditional water harvesting, monsoon capture, decentralized treatment, and linking water conservation to farmer income through efficient irrigation subsidies.',
-        bestPractices: [
-          '90% wastewater recycling: Treated water used for agriculture',
-          'Desalination provides 80% of drinking water using renewable energy',
-          'Drip irrigation: Invented in Israel, achieves 95% water use efficiency',
-          'Water pricing: $2.80/m³ with tiered rates encourages conservation'
-        ],
-        indiaAdaptations: [
-          'Mandatory rainwater harvesting: All buildings, 1 lakh recharge structures',
-          'Traditional revival: Check dams, johads, bavdis, temple tanks (1 lakh structures)',
-          'Wastewater treatment: 100% coverage in cities, decentralized plants in villages',
-          'Efficient irrigation: Drip/sprinkler for 50% area, link subsidy to water saving'
-        ]
-      },
-      {
-        name: 'Sustainable Urban Development Framework',
-        description: 'Transform 1,000 cities into sustainable, climate-resilient urban centers through green building codes (100% compliance), public transport (50% modal share), urban forests (30% green cover), waste management (zero landfill), and renewable energy (100% municipal operations). Includes compact city planning, walkable neighborhoods, and climate budgeting.',
-        category: 'Human Impact',
-        impact: 'Very High',
-        timeline: '15 years',
-        budget: 900000,
-        indicators: ['Carbon Footprint', 'Energy Consumption', 'Population Growth'],
-        competitorCountry: '🇸🇪 Sweden',
-        competitorSuccessRate: 96,
-        implementationSummary: 'Sweden achieved 96% success in sustainable cities through carbon-neutral Stockholm (2040 target), district heating (90% coverage), 99% waste recycling, extensive cycling infrastructure (500 km in Stockholm), and green building standards. India can exceed this by leveraging smart city infrastructure, integrating traditional urban planning (wadas, havelis), using AI for traffic management, and creating green jobs through urban sustainability programs.',
-        bestPractices: [
-          'Carbon-neutral cities: Stockholm targets 2040 through renewable energy and efficiency',
-          'District heating: 90% coverage using waste heat and biomass',
-          '99% waste recycling: Only 1% goes to landfill',
-          'Cycling infrastructure: 500 km of bike lanes, 40% of trips by bike'
-        ],
-        indiaAdaptations: [
-          'Smart city integration: AI traffic management, IoT sensors, digital twins',
-          'Traditional urban planning: Revive wadas, havelis, chowks for community living',
-          'Public transport: Metro, BRT, e-buses achieve 50% modal share',
-          'Green jobs: 5 million jobs in urban sustainability (waste, energy, transport)'
-        ]
-      },
-      {
-        name: 'Climate Finance & Green Investment Mobilization',
-        description: 'Mobilize ₹50 lakh crore climate finance through green bonds, carbon markets, climate budgeting, international climate funds, private sector engagement, and innovative financing mechanisms. Establish National Climate Bank, green taxonomy, and climate risk disclosure framework to channel investments into climate mitigation and adaptation.',
-        category: 'Human Impact',
-        impact: 'High',
-        timeline: '10 years',
-        budget: 200000,
-        indicators: ['Energy Consumption', 'Carbon Footprint', 'Population Growth'],
-        competitorCountry: '🇬🇧 United Kingdom',
-        competitorSuccessRate: 95,
-        implementationSummary: 'UK achieved 95% success in climate finance through Green Investment Bank (£12B mobilized), carbon pricing (£18/ton), green bonds (£16B issued), and mandatory climate risk disclosure. Reduced emissions by 44% since 1990 while growing economy. India can exceed this by leveraging sovereign green bonds, diaspora investment, carbon border adjustment revenue, and linking climate finance to development finance institutions.',
-        bestPractices: [
-          'Green Investment Bank: £12B public capital mobilized £60B private investment',
-          'Carbon pricing: £18/ton with revenue recycling to clean energy',
-          'Green bonds: £16B issued by government and corporations',
-          'Mandatory climate risk disclosure: All listed companies report climate risks'
-        ],
-        indiaAdaptations: [
-          'Sovereign green bonds: ₹5 lakh crore issuance for renewable energy, forests',
-          'National Climate Bank: ₹10 lakh crore corpus for climate projects',
-          'Carbon markets: Domestic trading + international credits (₹50,000 Cr revenue)',
-          'Diaspora green bonds: NRI investment in climate projects with tax benefits'
-        ]
-      },
-      {
-        name: 'Climate Education & Behavioral Change Campaign',
-        description: 'Build climate-conscious society through mandatory climate education (school curriculum), public awareness campaigns, community-led action, green skill development (5 million trained), and behavioral nudges for sustainable consumption. Includes climate literacy programs, eco-clubs, and citizen science initiatives for climate monitoring.',
-        category: 'Human Impact',
-        impact: 'Medium',
-        timeline: '8 years',
-        budget: 150000,
-        indicators: ['Carbon Footprint', 'Energy Consumption', 'Population Growth'],
-        competitorCountry: '🇫🇮 Finland',
-        competitorSuccessRate: 94,
-        implementationSummary: 'Finland achieved 94% success in climate education through mandatory climate curriculum (grades 1-12), 85% public climate literacy, extensive adult education, and behavioral economics for sustainable consumption. India can exceed this by leveraging digital platforms (DIKSHA), regional language content, traditional ecological knowledge integration, and linking climate action to cultural values and festivals.',
-        bestPractices: [
-          'Mandatory climate curriculum: All students learn climate science and solutions',
-          '85% public climate literacy through adult education and media campaigns',
-          'Behavioral economics: Nudges for sustainable consumption (default green energy)',
-          'Community-led action: Local climate plans with citizen participation'
-        ],
-        indiaAdaptations: [
-          'DIKSHA platform: Climate education modules in 22 regional languages',
-          'Traditional knowledge: Integrate indigenous ecological practices in curriculum',
-          'Cultural integration: Link climate action to festivals (tree planting on birthdays)',
-          'Green skill development: Train 5 million youth in renewable energy, waste management'
-        ]
-      }
-    ];
+  const getAlertIcon = (type: string) => {
+    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
+    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
+    return <AlertCircle className="h-5 w-5 text-red-600" />;
   };
 
-  // AI-Generated Policy Recommendations for Transport (with Competitor Analysis)
-  const generateTransportPolicies = () => {
-    return [
-      {
-        name: 'National Highway Modernization Program',
-        description: 'Upgrade and expand national highway network to 200,000 km with 6-lane expressways, smart traffic management, and electric vehicle charging infrastructure',
-        category: 'Infrastructure Capacity',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: '₹500,000 Cr',
-        indicators: ['Road Network Length', 'Investment', 'Economic Contribution'],
-        competitorCountry: '🇨🇳 China',
-        successRate: '95%',
-        implementationSummary: 'China achieved 95% success with their National Trunk Highway System by building 177,000 km of expressways in 20 years through centralized planning, PPP models, and land acquisition reforms. India can exceed this by leveraging digital land records (DILRRS), faster environmental clearances, hybrid annuity models, and integrating EV charging infrastructure from day one.',
-        bestPractices: [
-          'Centralized planning with provincial execution reduced delays by 60%',
-          'PPP models attracted $200B private investment',
-          'Standardized design and construction norms cut costs by 30%',
-          'Integrated toll collection system (ETC) improved revenue by 40%'
-        ],
-        indiaAdaptations: [
-          'Use DILRRS for digital land acquisition and compensation',
-          'Bharatmala Pariyojana integration with logistics parks',
-          'Mandatory EV charging stations every 50 km',
-          'Green highways with solar panels and rainwater harvesting'
-        ]
-      },
-      {
-        name: 'High-Speed Rail Revolution',
-        description: 'Build 10,000 km high-speed rail network connecting major metros with 300+ kmph trains, reducing travel time by 70% and freight transit time by 50%',
-        category: 'Infrastructure Capacity',
-        impact: 'Very High',
-        timeline: '10 years',
-        budget: '₹800,000 Cr',
-        indicators: ['Rail Network Length', 'Passenger Trips', 'Mode Share'],
-        competitorCountry: '🇯🇵 Japan',
-        successRate: '98%',
-        implementationSummary: 'Japan\'s Shinkansen achieved 98% on-time performance and zero fatalities in 60 years through precision engineering, dedicated tracks, and rigorous maintenance. India can exceed this by using indigenous technology (Train 18/Vande Bharat), solar-powered stations, and integrating freight corridors for 24/7 utilization.',
-        bestPractices: [
-          'Dedicated high-speed tracks with no level crossings',
-          'Earthquake-resistant design with automatic braking systems',
-          'Average delay of only 0.9 minutes per train',
-          'Energy-efficient regenerative braking saves 30% power'
-        ],
-        indiaAdaptations: [
-          'Indigenous Train 18/Vande Bharat technology to reduce costs by 40%',
-          'Solar-powered stations and tracks for energy independence',
-          'Integrated freight corridors for night operations',
-          'Multi-modal hubs connecting metros, airports, and bus terminals'
-        ]
-      },
-      {
-        name: 'Smart Port & Logistics Hub Development',
-        description: 'Develop 20 world-class ports with automated cargo handling, deep-water berths, and integrated logistics parks to handle 3,000 MT cargo annually',
-        category: 'Infrastructure Capacity',
-        impact: 'High',
-        timeline: '7 years',
-        budget: '₹300,000 Cr',
-        indicators: ['Port Capacity', 'Freight Movement', 'Economic Contribution'],
-        competitorCountry: '🇸🇬 Singapore',
-        successRate: '97%',
-        implementationSummary: 'Singapore\'s Port achieved 97% efficiency through automation, 24/7 operations, and integrated logistics. India can exceed this by leveraging Sagarmala project, coastal shipping, and developing inland waterways for last-mile connectivity.',
-        bestPractices: [
-          'Automated container handling reduced turnaround time to 10 hours',
-          '24/7 operations with AI-powered scheduling',
-          'Integrated logistics parks reduced inland transport costs by 25%',
-          'Green port initiatives with shore power and LNG bunkering'
-        ],
-        indiaAdaptations: [
-          'Sagarmala integration with 14,500 km coastline development',
-          'Inland waterways (Ganga, Brahmaputra) for cost-effective freight',
-          'Coastal shipping for domestic cargo (reduce road congestion)',
-          'RFID-based cargo tracking and blockchain for transparency'
-        ]
-      },
-      {
-        name: 'Airport Expansion & Regional Connectivity',
-        description: 'Expand 50 airports to international standards and build 100 new regional airports under UDAN scheme to connect tier-2/3 cities',
-        category: 'Infrastructure Capacity',
-        impact: 'High',
-        timeline: '6 years',
-        budget: '₹250,000 Cr',
-        indicators: ['Airport Infrastructure', 'Passenger Trips', 'Economic Contribution'],
-        competitorCountry: '🇦🇪 UAE',
-        successRate: '96%',
-        implementationSummary: 'UAE\'s Dubai Airport achieved 96% passenger satisfaction through world-class terminals, efficient immigration, and seamless connectivity. India can exceed this by focusing on regional connectivity (UDAN), green airports, and integrating cargo hubs for e-commerce.',
-        bestPractices: [
-          'Automated immigration and baggage handling reduced wait time to 15 minutes',
-          'Multi-modal connectivity with metro, taxis, and buses',
-          'Cargo hub integration boosted logistics revenue by 40%',
-          'Green building certification with solar power and water recycling'
-        ],
-        indiaAdaptations: [
-          'UDAN scheme expansion to 100 tier-2/3 cities',
-          'Green airports with solar power (target: 100% renewable)',
-          'DigiYatra for seamless biometric boarding',
-          'Cargo hubs for e-commerce and perishable goods (cold storage)'
-        ]
-      },
-      {
-        name: 'Electric Vehicle Transition Program',
-        description: 'Accelerate EV adoption to 50% of new vehicle sales by 2030 through subsidies, charging infrastructure, and battery manufacturing',
-        category: 'Fleet & Capacity',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: '₹200,000 Cr',
-        indicators: ['Vehicle Registrations', 'Carbon Emissions', 'Energy Consumption'],
-        competitorCountry: '🇳🇴 Norway',
-        successRate: '94%',
-        implementationSummary: 'Norway achieved 94% EV market share through tax exemptions, free parking, toll waivers, and extensive charging network. India can exceed this by leveraging domestic manufacturing (PLI scheme), battery swapping for 2-wheelers, and integrating renewable energy for charging.',
-        bestPractices: [
-          'Tax exemptions and purchase subsidies made EVs cheaper than ICE vehicles',
-          'Free parking and toll waivers reduced operating costs by 40%',
-          'Extensive charging network (1 charger per 10 EVs)',
-          'Battery recycling program ensured sustainability'
-        ],
-        indiaAdaptations: [
-          'FAME-III subsidy: ₹1.5 lakh for EVs, ₹50,000 for e-2-wheelers',
-          'Battery swapping for 2-wheelers and 3-wheelers (reduce charging time)',
-          'PLI scheme for domestic battery manufacturing (reduce imports)',
-          'Solar-powered charging stations on highways and cities'
-        ]
-      },
-      {
-        name: 'Public Transport Modernization Mission',
-        description: 'Expand metro rail to 50 cities, electric buses to 100,000 units, and integrated ticketing for seamless multi-modal travel',
-        category: 'Fleet & Capacity',
-        impact: 'High',
-        timeline: '6 years',
-        budget: '₹350,000 Cr',
-        indicators: ['Seat Capacity', 'Passenger Trips', 'Mode Share'],
-        competitorCountry: '🇰🇷 South Korea',
-        successRate: '96%',
-        implementationSummary: 'South Korea achieved 96% public transport usage through integrated metro-bus systems, smart cards, and real-time tracking. India can exceed this by leveraging UPI-based ticketing, electric buses, and last-mile connectivity with e-rickshaws.',
-        bestPractices: [
-          'Integrated metro-bus network with single smart card',
-          'Real-time tracking and mobile apps for route planning',
-          'Frequent services (every 3-5 minutes) increased ridership by 60%',
-          'Affordable fares with government subsidies'
-        ],
-        indiaAdaptations: [
-          'UPI-based ticketing and QR code integration (no cards needed)',
-          'Electric buses with battery swapping (reduce downtime)',
-          'Last-mile connectivity with e-rickshaws and bike-sharing',
-          'Metro expansion to 50 cities under Metro Neo and Metro Lite'
-        ]
-      },
-      {
-        name: 'Freight Corridor Optimization',
-        description: 'Develop dedicated freight corridors (DFC) for 10,000 km with double-stack container trains and logistics parks',
-        category: 'Fleet & Capacity',
-        impact: 'High',
-        timeline: '8 years',
-        budget: '₹400,000 Cr',
-        indicators: ['Freight Capacity', 'Freight Movement', 'Economic Contribution'],
-        competitorCountry: '🇺🇸 USA',
-        successRate: '93%',
-        implementationSummary: 'USA\'s freight rail system achieved 93% efficiency through double-stack containers, dedicated tracks, and intermodal terminals. India can exceed this by integrating DFCs with ports, industrial clusters, and using indigenous electric locomotives.',
-        bestPractices: [
-          'Double-stack containers doubled capacity without new tracks',
-          'Dedicated freight tracks eliminated passenger train conflicts',
-          'Intermodal terminals reduced truck dependency by 40%',
-          'Real-time tracking improved delivery predictability by 80%'
-        ],
-        indiaAdaptations: [
-          'Eastern and Western DFCs connecting ports to industrial hubs',
-          'Indigenous electric locomotives (reduce diesel dependency)',
-          'Integration with logistics parks and warehouses',
-          'RFID-based tracking and blockchain for transparency'
-        ]
-      },
-      {
-        name: 'Integrated Mobility Platform',
-        description: 'Launch national mobility app integrating all transport modes (metro, bus, taxi, bike) with unified payment and real-time tracking',
-        category: 'Usage & Demand',
-        impact: 'Medium',
-        timeline: '3 years',
-        budget: '₹10,000 Cr',
-        indicators: ['Passenger Trips', 'Mode Share', 'Economic Contribution'],
-        competitorCountry: '🇫🇮 Finland',
-        successRate: '92%',
-        implementationSummary: 'Finland\'s Whim app achieved 92% user satisfaction by integrating all transport modes with single subscription. India can exceed this by leveraging UPI, regional language support, and integrating with ONDC for last-mile delivery.',
-        bestPractices: [
-          'Single app for all transport modes (metro, bus, taxi, bike)',
-          'Subscription model (unlimited travel for fixed monthly fee)',
-          'Real-time tracking and route optimization',
-          'Carbon footprint tracking encouraged sustainable choices'
-        ],
-        indiaAdaptations: [
-          'UPI-based payment integration (no credit cards needed)',
-          'Support for 22 regional languages',
-          'Integration with ONDC for last-mile delivery',
-          'Gamification with rewards for public transport usage'
-        ]
-      },
-      {
-        name: 'Zero Road Fatality Mission',
-        description: 'Reduce road fatalities to zero through AI-powered surveillance, strict enforcement, driver training, and vehicle safety standards',
-        category: 'Safety',
-        impact: 'Very High',
-        timeline: '5 years',
-        budget: '₹50,000 Cr',
-        indicators: ['Road Fatalities', 'Accident Rates', 'Safety Measures'],
-        competitorCountry: '🇸🇪 Sweden',
-        successRate: '97%',
-        implementationSummary: 'Sweden\'s Vision Zero achieved 97% reduction in road deaths through safe road design, speed limits, and strict enforcement. India can exceed this by leveraging AI surveillance, mandatory vehicle safety features, and driver training programs.',
-        bestPractices: [
-          'Safe road design with pedestrian crossings and speed bumps',
-          'Strict speed limits (30 kmph in cities, 50 kmph on highways)',
-          'Mandatory vehicle safety features (ABS, airbags, ESC)',
-          'Zero tolerance for drunk driving and mobile phone usage'
-        ],
-        indiaAdaptations: [
-          'AI-powered surveillance cameras for automatic challan generation',
-          'Mandatory vehicle safety features (Bharat NCAP compliance)',
-          'Driver training and licensing reforms (simulator-based tests)',
-          'Black spot identification and engineering improvements'
-        ]
-      },
-      {
-        name: 'Transport Sector Employment & Skilling',
-        description: 'Create 10 million jobs in transport sector through driver training, logistics, maintenance, and technology roles',
-        category: 'Economic Impact',
-        impact: 'High',
-        timeline: '5 years',
-        budget: '₹80,000 Cr',
-        indicators: ['Employment', 'Economic Contribution', 'Investment'],
-        competitorCountry: '🇩🇪 Germany',
-        successRate: '95%',
-        implementationSummary: 'Germany\'s transport sector employs 5% of workforce through vocational training, apprenticeships, and high-value manufacturing. India can exceed this by leveraging demographic dividend, skilling programs, and emerging sectors (EVs, logistics, drones).',
-        bestPractices: [
-          'Vocational training with industry partnerships',
-          'Apprenticeship programs with guaranteed placement',
-          'High-value manufacturing jobs (automotive, aerospace)',
-          'Strong labor unions ensuring fair wages and benefits'
-        ],
-        indiaAdaptations: [
-          'PMKVY integration for driver training and logistics skills',
-          'EV manufacturing and battery assembly jobs (PLI scheme)',
-          'Drone delivery and logistics technology roles',
-          'Women-specific programs (e-rickshaw drivers, logistics coordinators)'
-        ]
-      },
-      {
-        name: 'Green Transport Transition',
-        description: 'Reduce transport emissions by 50% through EVs, biofuels, hydrogen, and public transport promotion',
-        category: 'Environmental Impact',
-        impact: 'Very High',
-        timeline: '7 years',
-        budget: '₹300,000 Cr',
-        indicators: ['Carbon Emissions', 'Energy Consumption', 'Pollution Levels'],
-        competitorCountry: '🇳🇱 Netherlands',
-        successRate: '94%',
-        implementationSummary: 'Netherlands achieved 94% reduction in transport emissions through cycling infrastructure, EVs, and public transport. India can exceed this by leveraging renewable energy for EVs, ethanol blending, and green hydrogen for heavy vehicles.',
-        bestPractices: [
-          'Cycling infrastructure (40,000 km bike lanes) reduced car usage by 30%',
-          'EV adoption with extensive charging network',
-          'Public transport prioritization with dedicated bus lanes',
-          'Carbon pricing and congestion charges in cities'
-        ],
-        indiaAdaptations: [
-          'E20 ethanol blending for existing vehicles (reduce imports)',
-          'Green hydrogen for heavy trucks and buses',
-          'Solar-powered EV charging infrastructure',
-          'Cycling and pedestrian infrastructure in cities (reduce short trips)'
-        ]
-      },
-      {
-        name: 'Smart Traffic Management System',
-        description: 'Deploy AI-powered traffic management in 100 cities with adaptive signals, real-time monitoring, and incident response',
-        category: 'Usage & Demand',
-        impact: 'Medium',
-        timeline: '4 years',
-        budget: '₹40,000 Cr',
-        indicators: ['Passenger Trips', 'Accident Rates', 'Pollution Levels'],
-        competitorCountry: '🇦🇺 Australia',
-        successRate: '93%',
-        implementationSummary: 'Australia\'s smart traffic systems achieved 93% congestion reduction through adaptive signals, real-time monitoring, and incident management. India can exceed this by leveraging AI, IoT sensors, and integrating with Google Maps for real-time updates.',
-        bestPractices: [
-          'Adaptive traffic signals reduced wait time by 40%',
-          'Real-time monitoring with CCTV and sensors',
-          'Incident response teams reduced clearance time by 60%',
-          'Integration with navigation apps for route optimization'
-        ],
-        indiaAdaptations: [
-          'AI-powered traffic signals with vehicle density detection',
-          'Integration with Google Maps and local navigation apps',
-          'Emergency vehicle priority corridors (ambulance, fire)',
-          'Parking management with real-time availability updates'
-        ]
-      }
-    ];
+  const getAlertBg = (type: string) => {
+    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
+    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
+    return 'bg-red-50 dark:bg-red-950';
   };
 
-  const handleExportResults = () => {
-    const dataStr = JSON.stringify(simulationResults, null, 2);
-    const dataBlob = new Blob([dataStr], { type: 'application/json' });
-    const url = URL.createObjectURL(dataBlob);
-    const link = document.createElement('a');
-    link.href = url;
-    link.download = `education-policy-simulation-${Date.now()}.json`;
-    link.click();
+  const getPriorityBadge = (priority: string) => {
+    if (priority === 'critical') return <Badge variant="destructive">Critical</Badge>;
+    if (priority === 'high') return <Badge className="bg-orange-500">High</Badge>;
+    if (priority === 'medium') return <Badge variant="default">Medium</Badge>;
+    return <Badge variant="secondary">Low</Badge>;
   };
 
-  const selectedSectorData = sectors.find((s) => s.id === selectedSector);
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading dashboard...</p>
+        </div>
+      </div>
+    );
+  }
 
+  if (error || !dashboardData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchDashboardData} className="mt-4">
+            Try Again
+          </Button>
+        </Alert>
+      </div>
+    );
+  }
+
   return (
-    <>
-      <SEOHead page="dashboard" />
-      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
-      {/* Hero Section */}
-      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12 px-6">
-        <div className="max-w-7xl mx-auto">
-          <div className="flex items-center gap-3 mb-4">
-            <Sparkles className="h-10 w-10" />
-            <h1 className="text-4xl font-bold">AI-Powered Policy Simulation Lab</h1>
-          </div>
-          <p className="text-xl text-blue-50 max-w-3xl">
-            Transform India into a global leader through data-driven policy recommendations across Economic, Social, Political, and Environmental dimensions
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">SDG Dashboard</h1>
+          <p className="text-muted-foreground">
+            Comprehensive overview of SDG policies and performance
           </p>
-
-          {/* Stats */}
-          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
-            <Card className="bg-white/10 backdrop-blur border-white/20">
-              <CardContent className="p-4">
-                <div className="text-3xl font-bold">{sectors.length}</div>
-                <div className="text-sm text-blue-100">Available Sectors</div>
-              </CardContent>
-            </Card>
-            <Card className="bg-white/10 backdrop-blur border-white/20">
-              <CardContent className="p-4">
-                <div className="text-3xl font-bold">AI</div>
-                <div className="text-sm text-blue-100">Powered Engine</div>
-              </CardContent>
-            </Card>
-            <Card className="bg-white/10 backdrop-blur border-white/20">
-              <CardContent className="p-4">
-                <div className="text-3xl font-bold">4</div>
-                <div className="text-sm text-blue-100">Impact Dimensions</div>
-              </CardContent>
-            </Card>
-            <Card className="bg-white/10 backdrop-blur border-white/20">
-              <CardContent className="p-4">
-                <div className="text-3xl font-bold">#1</div>
-                <div className="text-sm text-blue-100">India's Goal</div>
-              </CardContent>
-            </Card>
-          </div>
         </div>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
+            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
+            Refresh
+          </Button>
+          <Button onClick={exportReport}>
+            <Download className="mr-2 h-4 w-4" />
+            Export
+          </Button>
+        </div>
       </div>
 
-      {/* Main Content */}
-      <div className="max-w-7xl mx-auto px-6 py-8">
-        {/* Step 1: Sector Selection */}
-        <Card className="mb-8">
-          <CardHeader>
-            <CardTitle className="flex items-center gap-2">
-              <Target className="h-6 w-6 text-blue-600" />
-              Step 1: Select a Sector
-            </CardTitle>
-            <CardDescription>
-              Choose a sector to analyze existing policies and generate AI-powered recommendations
-            </CardDescription>
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
+            <FileText className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
-            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
-              {sectors.map((sector) => {
-                const Icon = sector.icon;
-                const isSelected = selectedSector === sector.id;
-                return (
-                  <button
-                    key={sector.id}
-                    onClick={() => handleSectorSelect(sector.id)}
-                    className={`p-4 rounded-lg border-2 transition-all ${
-                      isSelected
-                        ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
-                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
-                    }`}
-                  >
-                    <div className={`${sector.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
-                      <Icon className="h-6 w-6 text-white" />
-                    </div>
-                    <div className="text-sm font-medium text-center">{sector.name}</div>
-                    {isSelected && (
-                      <CheckCircle2 className="h-5 w-5 text-blue-600 mx-auto mt-2" />
-                    )}
-                  </button>
-                );
-              })}
+            <div className="text-2xl font-bold">{dashboardData.overview.totalPolicies}</div>
+            <p className="text-xs text-muted-foreground">
+              {dashboardData.overview.activePolicies} active
+            </p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
+            <DollarSign className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">
+              {formatCurrency(dashboardData.overview.totalBudget)}
             </div>
+            <p className="text-xs text-muted-foreground">Allocated funds</p>
           </CardContent>
         </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
+            <BarChart3 className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className={`text-2xl font-bold ${getScoreColor(dashboardData.overview.budgetUtilization)}`}>
+              {dashboardData.overview.budgetUtilization}%
+            </div>
+            <Progress value={dashboardData.overview.budgetUtilization} className="h-2 mt-2" />
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Stakeholders</CardTitle>
+            <Users className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{dashboardData.overview.stakeholders}</div>
+            <p className="text-xs text-muted-foreground">Engaged partners</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">SDGs Tracked</CardTitle>
+            <Target className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{dashboardData.overview.sdgsTracked}</div>
+            <p className="text-xs text-muted-foreground">All 17 goals</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Performance</CardTitle>
+            <Award className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className={`text-2xl font-bold ${getScoreColor(dashboardData.performanceMetrics.policyEffectiveness)}`}>
+              {dashboardData.performanceMetrics.policyEffectiveness}%
+            </div>
+            <p className="text-xs text-muted-foreground">Policy effectiveness</p>
+          </CardContent>
+        </Card>
+      </div>
 
-        {/* Step 2 & 3: Actions */}
-        {selectedSector && (
-          <Card className="mb-8">
+      {/* Alerts */}
+      {dashboardData.alerts && dashboardData.alerts.length > 0 && (
+        <div className="space-y-3">
+          <h2 className="text-xl font-semibold">Priority Alerts</h2>
+          <div className="grid gap-3 md:grid-cols-2">
+            {dashboardData.alerts.map((alert) => (
+              <div key={alert.id} className={`flex gap-3 p-4 rounded-lg ${getAlertBg(alert.type)}`}>
+                {getAlertIcon(alert.type)}
+                <div className="flex-1">
+                  <div className="flex items-center justify-between mb-1">
+                    <p className="font-medium">{alert.title}</p>
+                    {getPriorityBadge(alert.priority)}
+                  </div>
+                  <p className="text-sm mb-2">{alert.message}</p>
+                  <Button variant="outline" size="sm">
+                    Take Action
+                  </Button>
+                </div>
+              </div>
+            ))}
+          </div>
+        </div>
+      )}
+
+      {/* Main Content */}
+      <Tabs defaultValue="sdg" className="w-full">
+        <TabsList className="grid w-full grid-cols-5">
+          <TabsTrigger value="sdg">SDG Progress</TabsTrigger>
+          <TabsTrigger value="policies">Recent Policies</TabsTrigger>
+          <TabsTrigger value="budget">Budget (10 Sectors)</TabsTrigger>
+          <TabsTrigger value="milestones">Milestones</TabsTrigger>
+          <TabsTrigger value="activity">Activity</TabsTrigger>
+        </TabsList>
+
+        {/* SDG Progress Tab */}
+        <TabsContent value="sdg" className="mt-6">
+          <Card>
             <CardHeader>
-              <CardTitle className="flex items-center gap-2">
-                <FileText className="h-6 w-6 text-green-600" />
-                Step 2: Analyze & Simulate
-              </CardTitle>
-              <CardDescription>
-                View existing policies or run AI simulation to generate new policy recommendations
-              </CardDescription>
+              <CardTitle>SDG Progress Overview</CardTitle>
+              <CardDescription>Track progress across all 17 Sustainable Development Goals</CardDescription>
             </CardHeader>
             <CardContent>
-              <div className="flex flex-wrap gap-4">
-                {/* View Existing Policies button removed to optimize memory */}
-
-                <Button
-                  size="lg"
-                  onClick={handleRunSimulation}
-                  disabled={simulationRunning}
-                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
-                >
-                  {simulationRunning ? (
-                    <>
-                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
-                      Running AI Simulation...
-                    </>
-                  ) : (
-                    <>
-                      <Play className="h-5 w-5" />
-                      Run AI Simulation
-                      <Sparkles className="h-5 w-5" />
-                    </>
-                  )}
-                </Button>
+              <div className="space-y-4">
+                {dashboardData.sdgProgress.map((sdg) => (
+                  <div key={sdg.sdg} className="space-y-2">
+                    <div className="flex items-center justify-between text-sm">
+                      <div className="flex items-center gap-3">
+                        <span className="font-medium">SDG {sdg.sdg}</span>
+                        <span className="text-muted-foreground">{sdg.title}</span>
+                      </div>
+                      <div className="flex items-center gap-3">
+                        {getTrendIcon(sdg.trend)}
+                        {getStatusBadge(sdg.status)}
+                        <span className={`font-bold ${getScoreColor(sdg.progress)}`}>
+                          {sdg.progress}%
+                        </span>
+                      </div>
+                    </div>
+                    <Progress value={sdg.progress} className="h-2" />
+                  </div>
+                ))}
               </div>
+              <div className="mt-6">
+                <Link to="/sdg-progress">
+                  <Button className="w-full">
+                    View Detailed SDG Analysis
+                  </Button>
+                </Link>
+              </div>
             </CardContent>
           </Card>
-        )}
+        </TabsContent>
 
-        {/* Existing Policies Display removed to optimize memory */}
-
-        {/* Simulation Results */}
-        {simulationResults && (
-          <div className="space-y-6">
-            {/* Results Header */}
-            <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
-              <CardContent className="p-6">
-                <div className="flex items-center justify-between">
-                  <div className="flex items-center gap-3">
-                    <div className="bg-green-500 rounded-full p-3">
-                      <CheckCircle2 className="h-8 w-8 text-white" />
+        {/* Recent Policies Tab */}
+        <TabsContent value="policies" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Recent Policies</CardTitle>
+              <CardDescription>Latest policy initiatives and their progress</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {dashboardData.recentPolicies.map((policy) => (
+                  <div key={policy.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
+                    <div className="flex items-start justify-between">
+                      <div className="flex-1">
+                        <div className="flex items-center gap-2 mb-2">
+                          <h3 className="font-semibold">{policy.title}</h3>
+                          <Badge variant="outline">{policy.sdg}</Badge>
+                          {getPriorityBadge(policy.priority)}
+                        </div>
+                        <p className="text-sm text-muted-foreground mb-2">{policy.ministry}</p>
+                        <div className="flex items-center gap-4 text-sm">
+                          <span className="text-muted-foreground">
+                            Budget: {formatCurrency(policy.budget)}
+                          </span>
+                          <span className="text-muted-foreground">
+                            {new Date(policy.startDate).getFullYear()} - {new Date(policy.endDate).getFullYear()}
+                          </span>
+                        </div>
+                      </div>
+                      {getStatusBadge(policy.status)}
                     </div>
-                    <div>
-                      <h3 className="text-2xl font-bold text-green-900">Simulation Complete</h3>
-                      <p className="text-green-700">AI-powered policy recommendations generated for {simulationResults.sector} sector</p>
+                    <div className="space-y-1">
+                      <div className="flex items-center justify-between text-sm">
+                        <span className="text-muted-foreground">Progress</span>
+                        <span className="font-medium">{policy.progress}%</span>
+                      </div>
+                      <Progress value={policy.progress} className="h-2" />
                     </div>
-                  </div>
-                  <Button onClick={handleExportResults} variant="outline" className="flex items-center gap-2">
-                    <Download className="h-4 w-4" />
-                    Export Results
-                  </Button>
-                </div>
-              </CardContent>
-            </Card>
-
-            {/* Key Metrics */}
-            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
-              <Card>
-                <CardContent className="p-6">
-                  <div className="flex items-center gap-3">
-                    <FileText className="h-8 w-8 text-blue-600" />
-                    <div>
-                      <div className="text-3xl font-bold text-blue-600">{simulationResults.existingPoliciesCount}</div>
-                      <div className="text-sm text-muted-foreground">Existing Policies</div>
+                    <div className="flex gap-2">
+                      <Link to="/policy-monitoring" className="flex-1">
+                        <Button variant="outline" size="sm" className="w-full">
+                          <BarChart3 className="mr-2 h-3 w-3" />
+                          Monitor
+                        </Button>
+                      </Link>
+                      <Link to="/policy-lab" className="flex-1">
+                        <Button variant="outline" size="sm" className="w-full">
+                          <FileText className="mr-2 h-3 w-3" />
+                          Details
+                        </Button>
+                      </Link>
                     </div>
                   </div>
-                </CardContent>
-              </Card>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-              <Card>
-                <CardContent className="p-6">
-                  <div className="flex items-center gap-3">
-                    <Sparkles className="h-8 w-8 text-green-600" />
-                    <div>
-                      <div className="text-3xl font-bold text-green-600">{simulationResults.newPoliciesCount}</div>
-                      <div className="text-sm text-muted-foreground">New Policies Recommended</div>
+        {/* Budget Tab - 10 SECTORS */}
+        <TabsContent value="budget" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Budget Allocation by Ministry (10 Sectors)</CardTitle>
+              <CardDescription>Comprehensive budget utilization across all government ministries</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {dashboardData.budgetByMinistry.map((ministry, index) => (
+                  <div key={index} className="space-y-2 p-4 bg-muted/50 rounded-lg">
+                    <div className="flex items-center justify-between">
+                      <div className="flex-1">
+                        <div className="flex items-center gap-3 mb-2">
+                          <span className="font-semibold text-lg">{ministry.ministry}</span>
+                          <Badge variant="outline">{ministry.projects} projects</Badge>
+                          <Badge
+                            variant={
+                              ministry.performance >= 80
+                                ? 'default'
+                                : ministry.performance >= 70
+                                ? 'secondary'
+                                : 'destructive'
+                            }
+                          >
+                            Performance: {ministry.performance}%
+                          </Badge>
+                        </div>
+                        <div className="flex flex-wrap gap-2 mb-2">
+                          {ministry.sdgFocus?.map((sdg, i) => (
+                            <Badge key={i} variant="outline" className="text-xs">
+                              {sdg}
+                            </Badge>
+                          ))}
+                        </div>
+                      </div>
+                      <div className="text-right">
+                        <p className="text-sm text-muted-foreground">Allocated</p>
+                        <p className="font-semibold">{formatCurrency(ministry.allocated)}</p>
+                      </div>
                     </div>
-                  </div>
-                </CardContent>
-              </Card>
-
-              <Card>
-                <CardContent className="p-6">
-                  <div className="flex items-center gap-3">
-                    <TrendingUp className="h-8 w-8 text-purple-600" />
-                    <div>
-                      <div className="text-3xl font-bold text-purple-600">₹{simulationResults.totalBudget.toLocaleString()} Cr</div>
-                      <div className="text-sm text-muted-foreground">Total Investment</div>
+                    <div className="flex items-center justify-between text-sm mb-1">
+                      <span className="text-muted-foreground">
+                        Utilized: {formatCurrency(ministry.utilized)}
+                      </span>
+                      <Badge
+                        variant={
+                          ministry.utilization >= 80
+                            ? 'default'
+                            : ministry.utilization >= 60
+                            ? 'secondary'
+                            : 'destructive'
+                        }
+                      >
+                        {ministry.utilization}% Utilization
+                      </Badge>
                     </div>
+                    <Progress value={ministry.utilization} className="h-3" />
+                    <div className="flex gap-2 mt-2">
+                      <Link to="/cross-ministry-comparison" className="flex-1">
+                        <Button variant="outline" size="sm" className="w-full">
+                          <BarChart3 className="mr-2 h-3 w-3" />
+                          View Details
+                        </Button>
+                      </Link>
+                      <Button variant="outline" size="sm" className="flex-1">
+                        <FileText className="mr-2 h-3 w-3" />
+                        Reports
+                      </Button>
+                    </div>
                   </div>
-                </CardContent>
-              </Card>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-              <Card>
-                <CardContent className="p-6">
-                  <div className="flex items-center gap-3">
-                    <Target className="h-8 w-8 text-orange-600" />
-                    <div>
-                      <div className="text-3xl font-bold text-orange-600">{simulationResults.overallImpact}</div>
-                      <div className="text-sm text-muted-foreground">Overall Impact</div>
+        {/* Milestones Tab */}
+        <TabsContent value="milestones" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Upcoming Milestones</CardTitle>
+              <CardDescription>Key events and deadlines</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {dashboardData.upcomingMilestones.map((milestone) => (
+                  <div key={milestone.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
+                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
+                      <Calendar className="h-6 w-6 text-primary" />
                     </div>
+                    <div className="flex-1">
+                      <div className="flex items-center justify-between mb-2">
+                        <h3 className="font-semibold">{milestone.title}</h3>
+                        {getPriorityBadge(milestone.priority)}
+                      </div>
+                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
+                      <div className="flex items-center gap-4 text-sm">
+                        <span className="text-muted-foreground">
+                          {new Date(milestone.date).toLocaleDateString()}
+                        </span>
+                        <Badge variant="outline">{milestone.type}</Badge>
+                      </div>
+                    </div>
                   </div>
-                </CardContent>
-              </Card>
-            </div>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-            {/* Goal Alignment */}
+        {/* Activity Tab */}
+        <TabsContent value="activity" className="mt-6">
+          <div className="grid gap-6 md:grid-cols-2">
+            {/* Recent Activity */}
             <Card>
               <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Target className="h-6 w-6 text-blue-600" />
-                  India #1 Goal Alignment
-                </CardTitle>
-                <CardDescription>
-                  How these policies contribute to making India the world's leading nation
-                </CardDescription>
+                <CardTitle>Recent Activity</CardTitle>
+                <CardDescription>Latest updates and changes</CardDescription>
               </CardHeader>
               <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                  <div>
-                    <div className="flex items-center justify-between mb-2">
-                      <span className="text-sm font-medium">🏆 Economic Growth</span>
-                      <span className="text-sm font-bold text-blue-600">{simulationResults.goalAlignment.economic}%</span>
+                <div className="space-y-3">
+                  {dashboardData.recentActivity.map((activity) => (
+                    <div key={activity.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
+                      <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
+                      <div className="flex-1">
+                        <p className="text-sm font-medium">{activity.action}</p>
+                        <p className="text-xs text-muted-foreground">
+                          by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
+                        </p>
+                      </div>
+                      <Badge variant="outline" className="text-xs">
+                        {activity.type}
+                      </Badge>
                     </div>
-                    <div className="w-full bg-gray-200 rounded-full h-3">
-                      <div
-                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
-                        style={{ width: `${simulationResults.goalAlignment.economic}%` }}
-                      />
-                    </div>
-                  </div>
-
-                  <div>
-                    <div className="flex items-center justify-between mb-2">
-                      <span className="text-sm font-medium">👥 Social Development</span>
-                      <span className="text-sm font-bold text-green-600">{simulationResults.goalAlignment.social}%</span>
-                    </div>
-                    <div className="w-full bg-gray-200 rounded-full h-3">
-                      <div
-                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
-                        style={{ width: `${simulationResults.goalAlignment.social}%` }}
-                      />
-                    </div>
-                  </div>
-
-                  <div>
-                    <div className="flex items-center justify-between mb-2">
-                      <span className="text-sm font-medium">🏛️ Political Stability</span>
-                      <span className="text-sm font-bold text-purple-600">{simulationResults.goalAlignment.political}%</span>
-                    </div>
-                    <div className="w-full bg-gray-200 rounded-full h-3">
-                      <div
-                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
-                        style={{ width: `${simulationResults.goalAlignment.political}%` }}
-                      />
-                    </div>
-                  </div>
-
-                  <div>
-                    <div className="flex items-center justify-between mb-2">
-                      <span className="text-sm font-medium">🌍 Environmental Sustainability</span>
-                      <span className="text-sm font-bold text-emerald-600">{simulationResults.goalAlignment.environmental}%</span>
-                    </div>
-                    <div className="w-full bg-gray-200 rounded-full h-3">
-                      <div
-                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all"
-                        style={{ width: `${simulationResults.goalAlignment.environmental}%` }}
-                      />
-                    </div>
-                  </div>
+                  ))}
                 </div>
               </CardContent>
             </Card>
 
-            {/* New Policy Recommendations */}
+            {/* Top Performers */}
             <Card>
               <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Sparkles className="h-6 w-6 text-green-600" />
-                  AI-Generated Policy Recommendations
-                </CardTitle>
-                <CardDescription>
-                  {simulationResults.newPoliciesCount} new policies recommended to transform India's {simulationResults.sector} sector
-                </CardDescription>
+                <CardTitle>Top Performing Ministries</CardTitle>
+                <CardDescription>Highest performing sectors</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
-                  {simulationResults.newPolicies.map((policy: any, index: number) => (
-                    <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
-                      <CardContent className="p-6">
-                        <div className="flex items-start justify-between gap-4">
-                          <div className="flex-1">
-                            <div className="flex items-center gap-3 mb-3">
-                              <div className="bg-green-100 rounded-full p-2">
-                                <Sparkles className="h-5 w-5 text-green-600" />
-                              </div>
-                              <div>
-                                <h4 className="font-bold text-xl text-green-900">{policy.name}</h4>
-                                <div className="flex items-center gap-2 mt-1">
-                                  <Badge variant="outline" className="text-xs">
-                                    {policy.category}
-                                  </Badge>
-                                  <Badge
-                                    className={`text-xs ${
-                                      policy.impact === 'Very High'
-                                        ? 'bg-red-100 text-red-700'
-                                        : 'bg-orange-100 text-orange-700'
-                                    }`}
-                                  >
-                                    {policy.impact} Impact
-                                  </Badge>
-                                </div>
-                              </div>
-                            </div>
-
-                            <p className="text-muted-foreground mb-4">{policy.description}</p>
-
-                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
-                              <div className="flex items-center gap-2 text-sm">
-                                <TrendingUp className="h-4 w-4 text-blue-600" />
-                                <span className="font-medium">Timeline:</span>
-                                <span className="text-muted-foreground">{policy.timeline}</span>
-                              </div>
-                              <div className="flex items-center gap-2 text-sm">
-                                <Target className="h-4 w-4 text-green-600" />
-                                <span className="font-medium">Budget:</span>
-                                <span className="text-muted-foreground">{policy.budget}</span>
-                              </div>
-                              <div className="flex items-center gap-2 text-sm">
-                                <FileText className="h-4 w-4 text-purple-600" />
-                                <span className="font-medium">Indicators:</span>
-                                <span className="text-muted-foreground">{policy.indicators.length}</span>
-                              </div>
-                            </div>
-
-                            <div className="bg-gray-50 rounded-lg p-3">
-                              <div className="text-xs font-medium text-gray-700 mb-2">Target Indicators:</div>
-                              <div className="flex flex-wrap gap-2">
-                                {policy.indicators.map((indicator: string, idx: number) => (
-                                  <Badge key={idx} variant="secondary" className="text-xs">
-                                    {indicator}
-                                  </Badge>
-                                ))}
-                              </div>
-                            </div>
-
-                            {/* Competitor Country Analysis (Employment sector only) */}
-                            {policy.competitorCountry && (
-                              <div className="mt-4 space-y-4">
-                                {/* Competitor Success */}
-                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
-                                  <div className="flex items-center gap-3 mb-3">
-                                    <Globe className="h-5 w-5 text-blue-600" />
-                                    <h4 className="font-semibold text-sm">Competitor Country Analysis</h4>
-                                  </div>
-                                  <div className="flex items-center gap-3 mb-2">
-                                    <span className="text-2xl">{policy.competitorFlag}</span>
-                                    <div>
-                                      <div className="font-semibold">{policy.competitorCountry}</div>
-                                      <div className="flex items-center gap-2">
-                                        <Award className="h-4 w-4 text-green-600" />
-                                        <span className="text-sm font-medium text-green-600">{policy.successRate}% Success Rate</span>
-                                      </div>
-                                    </div>
-                                  </div>
-                                </div>
-
-                                {/* Implementation Summary */}
-                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
-                                  <div className="flex items-center gap-3 mb-2">
-                                    <Lightbulb className="h-5 w-5 text-green-600" />
-                                    <h4 className="font-semibold text-sm">How India Can Do Better</h4>
-                                  </div>
-                                  <p className="text-sm text-gray-700">{policy.implementationSummary}</p>
-                                </div>
-
-                                {/* Best Practices */}
-                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
-                                  <div className="flex items-center gap-3 mb-2">
-                                    <Award className="h-5 w-5 text-blue-600" />
-                                    <h4 className="font-semibold text-sm">Best Practices from {policy.competitorCountry}</h4>
-                                  </div>
-                                  <ul className="space-y-1.5">
-                                    {policy.bestPractices.map((practice: string, idx: number) => (
-                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
-                                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
-                                        <span>{practice}</span>
-                                      </li>
-                                    ))}
-                                  </ul>
-                                </div>
-
-                                {/* India-Specific Adaptations */}
-                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
-                                  <div className="flex items-center gap-3 mb-2">
-                                    <MapPin className="h-5 w-5 text-orange-600" />
-                                    <h4 className="font-semibold text-sm">India-Specific Adaptations</h4>
-                                  </div>
-                                  <ul className="space-y-1.5">
-                                    {policy.indiaAdaptations.map((adaptation: string, idx: number) => (
-                                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
-                                        <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
-                                        <span>{adaptation}</span>
-                                      </li>
-                                    ))}
-                                  </ul>
-                                </div>
-                              </div>
-                            )}
-                          </div>
-
-                          <div className="flex flex-col items-center gap-2">
-                            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
-                              {index + 1}
-                            </div>
-                          </div>
+                  {dashboardData.topPerformers.map((performer, index) => (
+                    <div key={index} className="space-y-2">
+                      <div className="flex items-center justify-between text-sm">
+                        <div className="flex items-center gap-2">
+                          <Award className="h-4 w-4 text-yellow-500" />
+                          <span className="font-medium">{performer.ministry}</span>
                         </div>
-                      </CardContent>
-                    </Card>
+                        <div className="flex items-center gap-2">
+                          <TrendingUp className="h-4 w-4 text-green-500" />
+                          <span className="text-muted-foreground">+{performer.improvement}%</span>
+                          <span className={`font-bold ${getScoreColor(performer.score)}`}>
+                            {performer.score}
+                          </span>
+                        </div>
+                      </div>
+                      <Progress value={performer.score} className="h-2" />
+                    </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
+          </div>
 
-            {/* Action Items */}
-            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
-              <CardContent className="p-6">
-                <div className="flex items-start gap-4">
-                  <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
-                  <div>
-                    <h4 className="font-bold text-lg mb-2">Next Steps for Implementation</h4>
-                    <ul className="space-y-2 text-sm text-muted-foreground">
-                      <li className="flex items-center gap-2">
-                        <ArrowRight className="h-4 w-4 text-blue-600" />
-                        Review and prioritize the {simulationResults.newPoliciesCount} recommended policies based on budget and timeline
-                      </li>
-                      <li className="flex items-center gap-2">
-                        <ArrowRight className="h-4 w-4 text-blue-600" />
-                        Conduct stakeholder consultations with ministries, experts, and communities
-                      </li>
-                      <li className="flex items-center gap-2">
-                        <ArrowRight className="h-4 w-4 text-blue-600" />
-                        Develop detailed implementation roadmaps with quarterly milestones
-                      </li>
-                      <li className="flex items-center gap-2">
-                        <ArrowRight className="h-4 w-4 text-blue-600" />
-                        Establish monitoring frameworks to track progress against India #1 goals
-                      </li>
-                      <li className="flex items-center gap-2">
-                        <ArrowRight className="h-4 w-4 text-blue-600" />
-                        Export results and share with policy planning committees for approval
-                      </li>
-                    </ul>
+          {/* Performance Metrics */}
+          <Card className="mt-6">
+            <CardHeader>
+              <CardTitle>Performance Metrics</CardTitle>
+              <CardDescription>Key performance indicators across the platform</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="grid gap-4 md:grid-cols-3">
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Policy Effectiveness</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.policyEffectiveness)}`}>
+                      {dashboardData.performanceMetrics.policyEffectiveness}%
+                    </span>
                   </div>
+                  <Progress value={dashboardData.performanceMetrics.policyEffectiveness} className="h-2" />
                 </div>
-              </CardContent>
-            </Card>
-          </div>
-        )}
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Stakeholder Satisfaction</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.stakeholderSatisfaction)}`}>
+                      {dashboardData.performanceMetrics.stakeholderSatisfaction}%
+                    </span>
+                  </div>
+                  <Progress value={dashboardData.performanceMetrics.stakeholderSatisfaction} className="h-2" />
+                </div>
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Budget Efficiency</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.budgetEfficiency)}`}>
+                      {dashboardData.performanceMetrics.budgetEfficiency}%
+                    </span>
+                  </div>
+                  <Progress value={dashboardData.performanceMetrics.budgetEfficiency} className="h-2" />
+                </div>
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Timeliness Score</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.timelinessScore)}`}>
+                      {dashboardData.performanceMetrics.timelinessScore}%
+                    </span>
+                  </div>
+                  <Progress value={dashboardData.performanceMetrics.timelinessScore} className="h-2" />
+                </div>
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Innovation Index</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.innovationIndex)}`}>
+                      {dashboardData.performanceMetrics.innovationIndex}%
+                    </span>
+                  </div>
+                  <Progress value={dashboardData.performanceMetrics.innovationIndex} className="h-2" />
+                </div>
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Collaboration Score</span>
+                    <span className={`font-bold ${getScoreColor(dashboardData.performanceMetrics.collaborationScore)}`}>
+                      {dashboardData.performanceMetrics.collaborationScore}%
+                    </span>
+                  </div>
+                  <Progress value={dashboardData.performanceMetrics.collaborationScore} className="h-2" />
+                </div>
+              </div>
+            </CardContent>
+          </Card>
 
-        {/* Empty State */}
-        {!selectedSector && (
-          <Card className="border-2 border-dashed border-gray-300">
-            <CardContent className="p-12 text-center">
-              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
-              <h3 className="text-xl font-semibold text-gray-700 mb-2">Get Started</h3>
-              <p className="text-muted-foreground max-w-md mx-auto">
-                Select a sector above to begin analyzing existing policies and generating AI-powered recommendations to make India a global leader
-              </p>
+          {/* Strategic Recommendations */}
+          <Card className="mt-6">
+            <CardHeader>
+              <CardTitle>Strategic Recommendations</CardTitle>
+              <CardDescription>AI-powered insights and action items</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-3">
+                {dashboardData.recommendations.map((rec) => (
+                  <div key={rec.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
+                    <Zap className="h-5 w-5 text-primary mt-0.5" />
+                    <div className="flex-1">
+                      <div className="flex items-center justify-between mb-2">
+                        <h4 className="font-semibold">{rec.title}</h4>
+                        {getPriorityBadge(rec.priority)}
+                      </div>
+                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
+                      <div className="flex items-center gap-4 text-sm">
+                        <Badge variant="outline">Impact: {rec.impact}</Badge>
+                        <Badge variant="outline">Effort: {rec.effort}</Badge>
+                        <span className="text-muted-foreground">
+                          Cost: {formatCurrency(rec.estimatedCost)}
+                        </span>
+                      </div>
+                      <Button variant="outline" size="sm" className="mt-3">
+                        Implement
+                      </Button>
+                    </div>
+                  </div>
+                ))}
+              </div>
             </CardContent>
           </Card>
-        )}
-      </div>
+        </TabsContent>
+      </Tabs>
     </div>
-    </>
   );
  }
