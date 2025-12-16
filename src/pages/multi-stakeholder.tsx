Index: src/pages/multi-stakeholder.tsx
===================================================================
--- src/pages/multi-stakeholder.tsx	original
+++ src/pages/multi-stakeholder.tsx	modified
@@ -1,1107 +1,907 @@
-import { useState } from 'react';
+import { useState, useEffect } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
-import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
+import { Progress } from '@/components/ui/progress';
+import { Separator } from '@/components/ui/separator';
 import { Input } from '@/components/ui/input';
+import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
-import { 
-  Building2, 
-  Users, 
-  Briefcase, 
-  GraduationCap, 
+import {
+  Select,
+  SelectContent,
+  SelectItem,
+  SelectTrigger,
+  SelectValue,
+} from '@/components/ui/select';
+import {
+  Table,
+  TableBody,
+  TableCell,
+  TableHead,
+  TableHeader,
+  TableRow,
+} from '@/components/ui/table';
+import {
+  Dialog,
+  DialogContent,
+  DialogDescription,
+  DialogFooter,
+  DialogHeader,
+  DialogTitle,
+  DialogTrigger,
+} from '@/components/ui/dialog';
+import {
+  Users,
+  Building2,
+  GraduationCap,
+  Globe,
   Heart,
-  Search,
-  Filter,
-  MessageSquare,
-  FileText,
-  Calendar,
-  TrendingUp,
-  Target,
-  CheckCircle2,
-  Clock,
+  Briefcase,
   AlertCircle,
   Download,
-  Upload,
-  Share2,
+  RefreshCw,
+  Calendar,
   Mail,
   Phone,
-  MapPin,
-  Globe,
-  Award,
-  Activity,
-  Vote,
-  ThumbsUp,
-  ThumbsDown,
-  BarChart3,
-  PieChart,
+  Target,
+  TrendingUp,
+  MessageSquare,
+  Plus,
+  CheckCircle,
+  Clock,
+  Star,
   Send,
-  Eye,
-  MessageCircle,
-  TrendingDown
+  FileText,
+  BarChart3,
+  Lightbulb,
+  AlertTriangle,
+  MapPin,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-// Stakeholder categories
-const stakeholderCategories = [
-  {
-    id: 'government',
-    name: 'Government Agencies',
-    icon: Building2,
-    color: 'text-blue-600',
-    bgColor: 'bg-blue-100',
-    count: 45,
-    description: 'Central and state government ministries and departments'
-  },
-  {
-    id: 'ngo',
-    name: 'NGOs & Civil Society',
-    icon: Heart,
-    color: 'text-pink-600',
-    bgColor: 'bg-pink-100',
-    count: 128,
-    description: 'Non-governmental organizations and community groups'
-  },
-  {
-    id: 'private',
-    name: 'Private Sector',
-    icon: Briefcase,
-    color: 'text-green-600',
-    bgColor: 'bg-green-100',
-    count: 87,
-    description: 'Corporations, businesses, and industry associations'
-  },
-  {
-    id: 'academia',
-    name: 'Academia & Research',
-    icon: GraduationCap,
-    color: 'text-purple-600',
-    bgColor: 'bg-purple-100',
-    count: 56,
-    description: 'Universities, research institutions, and think tanks'
-  },
-  {
-    id: 'citizens',
-    name: 'Citizens & Communities',
-    icon: Users,
-    color: 'text-orange-600',
-    bgColor: 'bg-orange-100',
-    count: 12450,
-    description: 'Individual citizens and local community representatives'
-  }
-];
+interface StakeholderData {
+  overview: {
+    totalStakeholders: number;
+    activeEngagements: number;
+    pendingRequests: number;
+    satisfactionScore: number;
+    lastUpdated: string;
+  };
+  stakeholderGroups: Array<{
+    id: number;
+    name: string;
+    count: number;
+    engagementLevel: number;
+    priority: string;
+    color: string;
+  }>;
+  stakeholders: Array<{
+    id: number;
+    name: string;
+    abbreviation: string;
+    type: string;
+    contactPerson: string;
+    email: string;
+    phone: string;
+    engagementLevel: number;
+    priority: string;
+    sdgFocus: string[];
+    activeProjects: number;
+    totalContribution: number;
+    lastEngagement: string;
+    status: string;
+    interests: string[];
+    expertise: string[];
+    collaborations: Array<{
+      project: string;
+      role: string;
+      budget: number;
+      status: string;
+    }>;
+    feedback: Array<{
+      date: string;
+      rating: number;
+      comment: string;
+      category: string;
+    }>;
+  }>;
+  engagementActivities: Array<{
+    id: number;
+    type: string;
+    title: string;
+    date: string;
+    time: string;
+    location: string;
+    attendees: number;
+    status: string;
+    agenda: string[];
+  }>;
+  feedbackRequests: Array<{
+    id: number;
+    title: string;
+    description: string;
+    deadline: string;
+    status: string;
+    responses: number;
+    targetAudience: string[];
+    priority: string;
+  }>;
+  insights: Array<{
+    type: string;
+    title: string;
+    description: string;
+    priority: string;
+    impact: string;
+  }>;
+  recommendations: Array<{
+    title: string;
+    description: string;
+    targetGroups: string[];
+    estimatedCost: number;
+    timeline: string;
+    expectedImpact: string;
+    priority: string;
+  }>;
+}
 
-// Active partnerships
-const activePartnerships = [
-  {
-    id: 1,
-    name: 'Clean Energy Initiative',
-    lead: 'Ministry of New & Renewable Energy',
-    partners: ['Tata Power', 'IIT Delhi', 'TERI', 'Greenpeace India'],
-    sdg: 'SDG 7',
-    status: 'Active',
-    progress: 78,
-    startDate: 'Jan 2024',
-    budget: '₹450 Cr',
-    beneficiaries: '2.4M households'
-  },
-  {
-    id: 2,
-    name: 'Quality Education for All',
-    lead: 'Ministry of Education',
-    partners: ['Teach For India', 'Microsoft India', 'JNU', 'Pratham'],
-    sdg: 'SDG 4',
-    status: 'Active',
-    progress: 65,
-    startDate: 'Mar 2024',
-    budget: '₹680 Cr',
-    beneficiaries: '5.2M students'
-  },
-  {
-    id: 3,
-    name: 'Rural Health Access',
-    lead: 'Ministry of Health & Family Welfare',
-    partners: ['Apollo Hospitals', 'AIIMS', 'PATH India', 'Red Cross'],
-    sdg: 'SDG 3',
-    status: 'Active',
-    progress: 82,
-    startDate: 'Nov 2023',
-    budget: '₹920 Cr',
-    beneficiaries: '8.5M people'
-  },
-  {
-    id: 4,
-    name: 'Sustainable Agriculture',
-    lead: 'Ministry of Agriculture',
-    partners: ['ITC Limited', 'ICRISAT', 'NABARD', 'Farmers\' Collective'],
-    sdg: 'SDG 2',
-    status: 'Planning',
-    progress: 35,
-    startDate: 'May 2024',
-    budget: '₹540 Cr',
-    beneficiaries: '3.8M farmers'
-  }
-];
+export default function MultiStakeholderPage() {
+  const [stakeholderData, setStakeholderData] = useState<StakeholderData | null>(null);
+  const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
+  const [selectedStakeholder, setSelectedStakeholder] = useState<number | null>(null);
+  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
+  const [showEngagementDialog, setShowEngagementDialog] = useState(false);
+  const [feedbackForm, setFeedbackForm] = useState({
+    stakeholderId: '',
+    feedbackType: '',
+    rating: '',
+    comment: '',
+    category: '',
+  });
+  const [engagementForm, setEngagementForm] = useState({
+    type: '',
+    title: '',
+    date: '',
+    time: '',
+    location: '',
+    attendees: '',
+    description: '',
+  });
 
-// Collaboration opportunities
-const opportunities = [
-  {
-    id: 1,
-    title: 'Technical Expertise Needed: Climate Data Analysis',
-    category: 'Academia & Research',
-    sdg: 'SDG 13',
-    postedBy: 'Ministry of Environment',
-    deadline: '15 days left',
-    applicants: 12,
-    description: 'Seeking research institutions for climate change impact modeling and data analysis'
-  },
-  {
-    id: 2,
-    title: 'Funding Opportunity: Women Entrepreneurship Program',
-    category: 'Private Sector',
-    sdg: 'SDG 5',
-    postedBy: 'NITI Aayog',
-    deadline: '28 days left',
-    applicants: 24,
-    description: 'Corporate partners needed for skill development and funding support'
-  },
-  {
-    id: 3,
-    title: 'Implementation Partner: Rural Sanitation Project',
-    category: 'NGOs & Civil Society',
-    sdg: 'SDG 6',
-    postedBy: 'Ministry of Jal Shakti',
-    deadline: '7 days left',
-    applicants: 18,
-    description: 'NGOs with ground presence in rural areas for sanitation awareness campaigns'
-  },
-  {
-    id: 4,
-    title: 'Policy Input: Digital Education Framework',
-    category: 'All Stakeholders',
-    sdg: 'SDG 4',
-    postedBy: 'Ministry of Education',
-    deadline: '21 days left',
-    applicants: 45,
-    description: 'Seeking inputs from all stakeholders for national digital education policy'
-  }
-];
+  useEffect(() => {
+    fetchStakeholderData();
+  }, []);
 
-// Recent activities
-const recentActivities = [
-  { stakeholder: 'Tata Consultancy Services', action: 'Joined Clean Energy Initiative', time: '2 hours ago', type: 'join' },
-  { stakeholder: 'Ashoka University', action: 'Submitted research proposal for SDG 13', time: '5 hours ago', type: 'proposal' },
-  { stakeholder: 'Oxfam India', action: 'Completed milestone: 50K beneficiaries reached', time: '1 day ago', type: 'milestone' },
-  { stakeholder: 'Infosys Foundation', action: 'Pledged ₹25 Cr for education programs', time: '2 days ago', type: 'funding' },
-  { stakeholder: 'Citizens Forum Delhi', action: 'Organized community consultation meeting', time: '3 days ago', type: 'event' }
-];
+  const fetchStakeholderData = async () => {
+    setLoading(true);
+    setError('');
 
-// Policy voting data
-const policyVotingItems = [
-  {
-    id: 1,
-    title: 'Adopt Brazil\'s National School Feeding Programme',
-    description: 'Implement a comprehensive school feeding program based on Brazil\'s successful model, targeting 50 million students in Phase 1',
-    category: 'Education',
-    sdg: 'SDG 4',
-    postedDate: '5 days ago',
-    votingDeadline: '10 days left',
-    supportVotes: 1248,
-    opposeVotes: 156,
-    totalVotes: 1404,
-    status: 'Active'
-  },
-  {
-    id: 2,
-    title: 'Implement Universal Basic Income Pilot (Finland Model)',
-    description: 'Launch a pilot program for Universal Basic Income in 5 states, based on Finland\'s successful implementation',
-    category: 'Social Protection',
-    sdg: 'SDG 1',
-    postedDate: '3 days ago',
-    votingDeadline: '17 days left',
-    supportVotes: 892,
-    opposeVotes: 412,
-    totalVotes: 1304,
-    status: 'Active'
-  },
-  {
-    id: 3,
-    title: 'Renewable Energy Transition Act (Germany Model)',
-    description: 'Adopt Germany\'s Renewable Energy Sources Act to accelerate clean energy transition with feed-in tariffs and grid priority',
-    category: 'Energy',
-    sdg: 'SDG 7',
-    postedDate: '1 week ago',
-    votingDeadline: '3 days left',
-    supportVotes: 2156,
-    opposeVotes: 284,
-    totalVotes: 2440,
-    status: 'Active'
-  },
-  {
-    id: 4,
-    title: 'Universal Healthcare Coverage (Thailand Model)',
-    description: 'Implement universal healthcare coverage inspired by Thailand\'s successful 30-Baht scheme, ensuring healthcare access for all',
-    category: 'Healthcare',
-    sdg: 'SDG 3',
-    postedDate: '2 weeks ago',
-    votingDeadline: 'Closed',
-    supportVotes: 3421,
-    opposeVotes: 567,
-    totalVotes: 3988,
-    status: 'Closed'
-  }
-];
+    try {
+      const response = await fetch('/api/stakeholders');
+      const data = await response.json();
 
-// Consultation topics
-const consultationTopics = [
-  {
-    id: 1,
-    title: 'National Digital Education Framework',
-    description: 'Seeking inputs from educators, students, parents, and technology experts on the proposed digital education framework',
-    postedBy: 'Ministry of Education',
-    deadline: '15 days left',
-    responses: 342,
-    sdg: 'SDG 4',
-    status: 'Open'
-  },
-  {
-    id: 2,
-    title: 'Climate Action Plan 2030',
-    description: 'Public consultation on India\'s updated climate action plan and carbon neutrality roadmap',
-    postedBy: 'Ministry of Environment',
-    deadline: '21 days left',
-    responses: 567,
-    sdg: 'SDG 13',
-    status: 'Open'
-  },
-  {
-    id: 3,
-    title: 'Rural Healthcare Access Strategy',
-    description: 'Feedback needed on strategies to improve healthcare access in rural and remote areas',
-    postedBy: 'Ministry of Health',
-    deadline: '8 days left',
-    responses: 289,
-    sdg: 'SDG 3',
-    status: 'Open'
-  }
-];
+      if (data.success) {
+        setStakeholderData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch stakeholder data');
+      }
+    } catch (err) {
+      setError('Failed to load stakeholder data. Please try again.');
+      console.error('Stakeholder data error:', err);
+    } finally {
+      setLoading(false);
+    }
+  };
 
-// Feedback refinement examples
-const feedbackRefinements = [
-  {
-    id: 1,
-    originalPolicy: 'Digital India Initiative - Phase 2',
-    feedbackReceived: 'Citizens requested offline access to government services for areas with poor connectivity',
-    policyChange: 'Added Common Service Centers (CSCs) with offline service capabilities in 50,000 villages',
-    impact: 'Increased service accessibility by 45% in rural areas',
-    date: '2 months ago'
-  },
-  {
-    id: 2,
-    originalPolicy: 'PM-POSHAN School Feeding Scheme',
-    feedbackReceived: 'NGOs highlighted need for regional menu customization and dietary preference options',
-    policyChange: 'Implemented state-level menu committees with vegetarian/non-vegetarian options',
-    impact: 'Improved student participation by 28% and reduced food waste by 35%',
-    date: '4 months ago'
-  },
-  {
-    id: 3,
-    originalPolicy: 'National Clean Energy Mission',
-    feedbackReceived: 'Private sector suggested incentives for rooftop solar installations in urban areas',
-    policyChange: 'Introduced 30% subsidy for residential rooftop solar and net metering policy',
-    impact: 'Rooftop solar installations increased by 120% in 6 months',
-    date: '6 months ago'
-  }
-];
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchStakeholderData();
+    setRefreshing(false);
+  };
 
-// Engagement analytics
-const engagementMetrics = {
-  totalParticipants: 12450,
-  activeThisMonth: 3842,
-  votingParticipation: 68,
-  consultationResponses: 1198,
-  feedbackImplemented: 42,
-  averageSentiment: 78
-};
+  const exportReport = () => {
+    if (!stakeholderData) return;
 
-export default function MultiStakeholderPortal() {
-  const [selectedCategory, setSelectedCategory] = useState<string>('all');
-  const [searchQuery, setSearchQuery] = useState('');
-  const [votedPolicies, setVotedPolicies] = useState<Record<number, 'support' | 'oppose' | null>>({});
-  const [consultationFeedback, setConsultationFeedback] = useState('');
-  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
+    const report = JSON.stringify(stakeholderData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `stakeholder-report-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
+  };
 
-  return (
-    <div className="min-h-screen bg-background">
-      {/* Hero Section */}
-      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white py-20">
-        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80" />
-        <img 
-          src="https://media.gettyimages.com/id/145905511/photo/networking-people.jpg?b=1&s=2048x2048&w=0&k=20&c=GLE7JaDg9tlfHPCG0u_yDRkG8NdDyEF6Rm5g2Zo-xmA=" 
-          alt="Multi-stakeholder collaboration" 
-          className="absolute inset-0 w-full h-full object-cover opacity-20"
-        />
-        <div className="container mx-auto px-4 relative z-10">
-          <div className="max-w-4xl">
-            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
-              Collaborative Platform
-            </Badge>
-            <h1 className="text-5xl font-bold mb-6">
-              Multi-Stakeholder Portal
-            </h1>
-            <p className="text-xl text-indigo-100 mb-8 max-w-2xl">
-              Bringing together government, NGOs, private sector, academia, and citizens to collaborate on India's SDG goals. Join partnerships, share resources, and drive collective impact.
-            </p>
-            <div className="flex gap-4">
-              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50">
-                <Users className="mr-2 h-5 w-5" />
-                Register Your Organization
-              </Button>
-              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
-                <Search className="mr-2 h-5 w-5" />
-                Find Partners
-              </Button>
-            </div>
-          </div>
-        </div>
-      </section>
+  const submitFeedback = async () => {
+    if (!feedbackForm.stakeholderId || !feedbackForm.feedbackType || !feedbackForm.rating) {
+      alert('Please fill in all required fields');
+      return;
+    }
 
-      {/* Stakeholder Categories */}
-      <section className="container mx-auto px-4 -mt-12 relative z-20">
-        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
-          {stakeholderCategories.map((category) => (
-            <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
-              <CardHeader className="pb-3">
-                <div className={`${category.bgColor} p-3 rounded-lg w-fit mb-2`}>
-                  <category.icon className={`h-6 w-6 ${category.color}`} />
-                </div>
-                <CardTitle className="text-lg">{category.name}</CardTitle>
-                <CardDescription className="text-sm">{category.description}</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="flex items-center justify-between">
-                  <span className="text-2xl font-bold">{category.count.toLocaleString()}</span>
-                  <Badge variant="secondary">Registered</Badge>
-                </div>
-              </CardContent>
-            </Card>
-          ))}
+    try {
+      const response = await fetch('/api/stakeholders/feedback', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify(feedbackForm),
+      });
+
+      const data = await response.json();
+
+      if (data.success) {
+        alert('Feedback submitted successfully!');
+        setShowFeedbackDialog(false);
+        setFeedbackForm({
+          stakeholderId: '',
+          feedbackType: '',
+          rating: '',
+          comment: '',
+          category: '',
+        });
+      } else {
+        alert(data.error || 'Failed to submit feedback');
+      }
+    } catch (err) {
+      alert('Failed to submit feedback');
+      console.error('Feedback error:', err);
+    }
+  };
+
+  const createEngagement = async () => {
+    if (!engagementForm.type || !engagementForm.title || !engagementForm.date) {
+      alert('Please fill in all required fields');
+      return;
+    }
+
+    try {
+      const response = await fetch('/api/stakeholders/engagement', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify(engagementForm),
+      });
+
+      const data = await response.json();
+
+      if (data.success) {
+        alert('Engagement activity created successfully!');
+        setShowEngagementDialog(false);
+        setEngagementForm({
+          type: '',
+          title: '',
+          date: '',
+          time: '',
+          location: '',
+          attendees: '',
+          description: '',
+        });
+        refreshData();
+      } else {
+        alert(data.error || 'Failed to create engagement');
+      }
+    } catch (err) {
+      alert('Failed to create engagement activity');
+      console.error('Engagement error:', err);
+    }
+  };
+
+  const formatCurrency = (amount: number) => {
+    return new Intl.NumberFormat('en-US', {
+      style: 'currency',
+      currency: 'USD',
+      minimumFractionDigits: 0,
+      maximumFractionDigits: 0,
+    }).format(amount);
+  };
+
+  const formatDate = (dateString: string) => {
+    return new Date(dateString).toLocaleDateString('en-US', {
+      year: 'numeric',
+      month: 'short',
+      day: 'numeric',
+    });
+  };
+
+  const getScoreColor = (score: number) => {
+    if (score >= 80) return 'text-green-600';
+    if (score >= 70) return 'text-blue-600';
+    if (score >= 60) return 'text-yellow-600';
+    return 'text-red-600';
+  };
+
+  const getGroupIcon = (groupName: string) => {
+    if (groupName.includes('Government')) return <Building2 className="h-5 w-5" />;
+    if (groupName.includes('Civil Society')) return <Heart className="h-5 w-5" />;
+    if (groupName.includes('Private')) return <Briefcase className="h-5 w-5" />;
+    if (groupName.includes('Academic')) return <GraduationCap className="h-5 w-5" />;
+    if (groupName.includes('International')) return <Globe className="h-5 w-5" />;
+    return <Users className="h-5 w-5" />;
+  };
+
+  const getPriorityBadge = (priority: string) => {
+    if (priority === 'critical') return <Badge variant="destructive">Critical</Badge>;
+    if (priority === 'high') return <Badge className="bg-orange-500">High</Badge>;
+    if (priority === 'medium') return <Badge variant="default">Medium</Badge>;
+    return <Badge variant="secondary">Low</Badge>;
+  };
+
+  const getInsightIcon = (type: string) => {
+    if (type === 'opportunity') return <Lightbulb className="h-5 w-5 text-blue-600" />;
+    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
+    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
+    return <AlertCircle className="h-5 w-5 text-red-600" />;
+  };
+
+  const getInsightBg = (type: string) => {
+    if (type === 'opportunity') return 'bg-blue-50 dark:bg-blue-950';
+    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
+    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
+    return 'bg-red-50 dark:bg-red-950';
+  };
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading stakeholder data...</p>
         </div>
-      </section>
+      </div>
+    );
+  }
 
-      {/* Main Content */}
-      <section className="container mx-auto px-4 py-16">
-        <Tabs defaultValue="partnerships" className="space-y-6">
-          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
-            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
-            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
-            <TabsTrigger value="voting">Policy Voting</TabsTrigger>
-            <TabsTrigger value="consultation">Consultations</TabsTrigger>
-            <TabsTrigger value="feedback">Feedback Loop</TabsTrigger>
-            <TabsTrigger value="analytics">Analytics</TabsTrigger>
-            <TabsTrigger value="directory">Directory</TabsTrigger>
-            <TabsTrigger value="activity">Activity</TabsTrigger>
-          </TabsList>
+  if (error || !stakeholderData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchStakeholderData} className="mt-4">
+            Try Again
+          </Button>
+        </Alert>
+      </div>
+    );
+  }
 
-          {/* Active Partnerships Tab */}
-          <TabsContent value="partnerships" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <Target className="h-5 w-5" />
-                      Active Multi-Stakeholder Partnerships
-                    </CardTitle>
-                    <CardDescription>Collaborative initiatives across sectors for SDG achievement</CardDescription>
+  return (
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">Multi-Stakeholder Portal</h1>
+          <p className="text-muted-foreground">
+            Engage, collaborate, and communicate with all stakeholder groups
+          </p>
+        </div>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
+            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
+            Refresh
+          </Button>
+          <Dialog open={showEngagementDialog} onOpenChange={setShowEngagementDialog}>
+            <DialogTrigger asChild>
+              <Button variant="outline">
+                <Plus className="mr-2 h-4 w-4" />
+                New Activity
+              </Button>
+            </DialogTrigger>
+            <DialogContent className="max-w-2xl">
+              <DialogHeader>
+                <DialogTitle>Create Engagement Activity</DialogTitle>
+                <DialogDescription>Schedule a new stakeholder engagement event</DialogDescription>
+              </DialogHeader>
+              <div className="space-y-4 py-4">
+                <div className="grid grid-cols-2 gap-4">
+                  <div className="space-y-2">
+                    <Label htmlFor="type">Activity Type</Label>
+                    <Select
+                      value={engagementForm.type}
+                      onValueChange={(value) =>
+                        setEngagementForm({ ...engagementForm, type: value })
+                      }
+                    >
+                      <SelectTrigger id="type">
+                        <SelectValue placeholder="Select type" />
+                      </SelectTrigger>
+                      <SelectContent>
+                        <SelectItem value="Meeting">Meeting</SelectItem>
+                        <SelectItem value="Workshop">Workshop</SelectItem>
+                        <SelectItem value="Consultation">Consultation</SelectItem>
+                        <SelectItem value="Forum">Forum</SelectItem>
+                        <SelectItem value="Webinar">Webinar</SelectItem>
+                      </SelectContent>
+                    </Select>
                   </div>
-                  <Button>
-                    <Upload className="mr-2 h-4 w-4" />
-                    Propose Partnership
-                  </Button>
+                  <div className="space-y-2">
+                    <Label htmlFor="date">Date</Label>
+                    <Input
+                      id="date"
+                      type="date"
+                      value={engagementForm.date}
+                      onChange={(e) =>
+                        setEngagementForm({ ...engagementForm, date: e.target.value })
+                      }
+                    />
+                  </div>
                 </div>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-4">
-                  {activePartnerships.map((partnership) => (
-                    <Card key={partnership.id}>
-                      <CardHeader>
-                        <div className="flex items-start justify-between">
-                          <div className="flex-1">
-                            <div className="flex items-center gap-3 mb-2">
-                              <CardTitle className="text-lg">{partnership.name}</CardTitle>
-                              <Badge className="bg-green-100 text-green-800">{partnership.status}</Badge>
-                              <Badge variant="outline">{partnership.sdg}</Badge>
-                            </div>
-                            <CardDescription>
-                              <div className="flex items-center gap-2 mb-2">
-                                <Building2 className="h-4 w-4" />
-                                <span className="font-medium">Lead:</span> {partnership.lead}
-                              </div>
-                              <div className="flex items-center gap-2">
-                                <Users className="h-4 w-4" />
-                                <span className="font-medium">Partners:</span> {partnership.partners.join(', ')}
-                              </div>
-                            </CardDescription>
-                          </div>
-                        </div>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-4">
-                          <div>
-                            <div className="flex items-center justify-between mb-2">
-                              <span className="text-sm font-medium">Progress</span>
-                              <span className="text-sm text-muted-foreground">{partnership.progress}%</span>
-                            </div>
-                            <div className="w-full bg-muted rounded-full h-2">
-                              <div 
-                                className="bg-green-600 h-2 rounded-full transition-all" 
-                                style={{ width: `${partnership.progress}%` }}
-                              />
-                            </div>
-                          </div>
-                          <div className="grid grid-cols-4 gap-4 text-sm">
-                            <div>
-                              <div className="text-muted-foreground">Start Date</div>
-                              <div className="font-medium">{partnership.startDate}</div>
-                            </div>
-                            <div>
-                              <div className="text-muted-foreground">Budget</div>
-                              <div className="font-medium">{partnership.budget}</div>
-                            </div>
-                            <div>
-                              <div className="text-muted-foreground">Beneficiaries</div>
-                              <div className="font-medium">{partnership.beneficiaries}</div>
-                            </div>
-                            <div className="flex gap-2">
-                              <Button variant="outline" size="sm">
-                                <FileText className="h-4 w-4" />
-                              </Button>
-                              <Button variant="outline" size="sm">
-                                <MessageSquare className="h-4 w-4" />
-                              </Button>
-                              <Button variant="outline" size="sm">
-                                <Share2 className="h-4 w-4" />
-                              </Button>
-                            </div>
-                          </div>
-                        </div>
-                      </CardContent>
-                    </Card>
-                  ))}
+                <div className="space-y-2">
+                  <Label htmlFor="title">Title</Label>
+                  <Input
+                    id="title"
+                    value={engagementForm.title}
+                    onChange={(e) =>
+                      setEngagementForm({ ...engagementForm, title: e.target.value })
+                    }
+                    placeholder="Enter activity title"
+                  />
                 </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Opportunities Tab */}
-          <TabsContent value="opportunities" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <Award className="h-5 w-5" />
-                      Collaboration Opportunities
-                    </CardTitle>
-                    <CardDescription>Open calls for partnerships, funding, and technical expertise</CardDescription>
+                <div className="grid grid-cols-2 gap-4">
+                  <div className="space-y-2">
+                    <Label htmlFor="time">Time</Label>
+                    <Input
+                      id="time"
+                      type="time"
+                      value={engagementForm.time}
+                      onChange={(e) =>
+                        setEngagementForm({ ...engagementForm, time: e.target.value })
+                      }
+                    />
                   </div>
-                  <div className="flex gap-2">
-                    <Input placeholder="Search opportunities..." className="w-64" />
-                    <Button variant="outline">
-                      <Filter className="h-4 w-4" />
-                    </Button>
+                  <div className="space-y-2">
+                    <Label htmlFor="location">Location</Label>
+                    <Input
+                      id="location"
+                      value={engagementForm.location}
+                      onChange={(e) =>
+                        setEngagementForm({ ...engagementForm, location: e.target.value })
+                      }
+                      placeholder="Virtual or physical location"
+                    />
                   </div>
                 </div>
-              </CardHeader>
-              <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
-                  {opportunities.map((opp) => (
-                    <Card key={opp.id} className="hover:shadow-lg transition-shadow">
-                      <CardHeader>
-                        <div className="flex items-start justify-between mb-2">
-                          <Badge variant="secondary">{opp.category}</Badge>
-                          <Badge variant="outline">{opp.sdg}</Badge>
-                        </div>
-                        <CardTitle className="text-lg">{opp.title}</CardTitle>
-                        <CardDescription>{opp.description}</CardDescription>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-3">
-                          <div className="flex items-center justify-between text-sm">
-                            <div className="flex items-center gap-2 text-muted-foreground">
-                              <Building2 className="h-4 w-4" />
-                              {opp.postedBy}
-                            </div>
-                            <div className="flex items-center gap-2 text-orange-600">
-                              <Clock className="h-4 w-4" />
-                              {opp.deadline}
-                            </div>
-                          </div>
-                          <div className="flex items-center justify-between">
-                            <span className="text-sm text-muted-foreground">{opp.applicants} applicants</span>
-                            <Button size="sm">
-                              Apply Now
-                            </Button>
-                          </div>
-                        </div>
-                      </CardContent>
-                    </Card>
-                  ))}
+                <div className="space-y-2">
+                  <Label htmlFor="attendees">Expected Attendees</Label>
+                  <Input
+                    id="attendees"
+                    type="number"
+                    value={engagementForm.attendees}
+                    onChange={(e) =>
+                      setEngagementForm({ ...engagementForm, attendees: e.target.value })
+                    }
+                    placeholder="0"
+                  />
                 </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Policy Voting Tab */}
-          <TabsContent value="voting" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <Vote className="h-5 w-5" />
-                      Policy Voting System
-                    </CardTitle>
-                    <CardDescription>Vote on proposed policy adaptations and help shape India's SDG implementation</CardDescription>
-                  </div>
-                  <Badge className="bg-purple-100 text-purple-800">Citizen Participation</Badge>
+                <div className="space-y-2">
+                  <Label htmlFor="description">Description</Label>
+                  <Textarea
+                    id="description"
+                    value={engagementForm.description}
+                    onChange={(e) =>
+                      setEngagementForm({ ...engagementForm, description: e.target.value })
+                    }
+                    placeholder="Describe the activity objectives and agenda"
+                    rows={4}
+                  />
                 </div>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-4">
-                  {policyVotingItems.map((policy) => {
-                    const supportPercentage = Math.round((policy.supportVotes / policy.totalVotes) * 100);
-                    const opposePercentage = Math.round((policy.opposeVotes / policy.totalVotes) * 100);
-                    const userVote = votedPolicies[policy.id];
+              </div>
+              <DialogFooter>
+                <Button variant="outline" onClick={() => setShowEngagementDialog(false)}>
+                  Cancel
+                </Button>
+                <Button onClick={createEngagement}>Create Activity</Button>
+              </DialogFooter>
+            </DialogContent>
+          </Dialog>
+          <Button onClick={exportReport}>
+            <Download className="mr-2 h-4 w-4" />
+            Export
+          </Button>
+        </div>
+      </div>
 
-                    return (
-                      <Card key={policy.id} className="border-l-4 border-l-purple-600">
-                        <CardHeader>
-                          <div className="flex items-start justify-between mb-2">
-                            <div className="flex-1">
-                              <div className="flex items-center gap-2 mb-2">
-                                <Badge variant="secondary">{policy.category}</Badge>
-                                <Badge variant="outline">{policy.sdg}</Badge>
-                                <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
-                                  {policy.status}
-                                </Badge>
-                              </div>
-                              <CardTitle className="text-lg mb-2">{policy.title}</CardTitle>
-                              <CardDescription>{policy.description}</CardDescription>
-                            </div>
-                          </div>
-                        </CardHeader>
-                        <CardContent>
-                          <div className="space-y-4">
-                            {/* Voting Results */}
-                            <div>
-                              <div className="flex items-center justify-between mb-2">
-                                <span className="text-sm font-medium">Voting Results</span>
-                                <span className="text-sm text-muted-foreground">{policy.totalVotes.toLocaleString()} votes</span>
-                              </div>
-                              <div className="flex gap-2 mb-2">
-                                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
-                                  <div 
-                                    className="bg-green-600 h-3 transition-all" 
-                                    style={{ width: `${supportPercentage}%` }}
-                                  />
-                                </div>
-                                <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
-                                  <div 
-                                    className="bg-red-600 h-3 transition-all" 
-                                    style={{ width: `${opposePercentage}%` }}
-                                  />
-                                </div>
-                              </div>
-                              <div className="flex items-center justify-between text-sm">
-                                <div className="flex items-center gap-2 text-green-600">
-                                  <ThumbsUp className="h-4 w-4" />
-                                  <span className="font-medium">{supportPercentage}% Support</span>
-                                  <span className="text-muted-foreground">({policy.supportVotes.toLocaleString()})</span>
-                                </div>
-                                <div className="flex items-center gap-2 text-red-600">
-                                  <ThumbsDown className="h-4 w-4" />
-                                  <span className="font-medium">{opposePercentage}% Oppose</span>
-                                  <span className="text-muted-foreground">({policy.opposeVotes.toLocaleString()})</span>
-                                </div>
-                              </div>
-                            </div>
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-4">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Total Stakeholders</CardTitle>
+            <Users className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{stakeholderData.overview.totalStakeholders}</div>
+            <p className="text-xs text-muted-foreground">Across 6 groups</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Active Engagements</CardTitle>
+            <Calendar className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">
+              {stakeholderData.overview.activeEngagements}
+            </div>
+            <p className="text-xs text-muted-foreground">Ongoing activities</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
+            <Clock className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold text-yellow-600">
+              {stakeholderData.overview.pendingRequests}
+            </div>
+            <p className="text-xs text-muted-foreground">Awaiting response</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
+            <Star className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className={`text-2xl font-bold ${getScoreColor(stakeholderData.overview.satisfactionScore)}`}>
+              {stakeholderData.overview.satisfactionScore}%
+            </div>
+            <p className="text-xs text-muted-foreground">Average rating</p>
+          </CardContent>
+        </Card>
+      </div>
 
-                            {/* Voting Buttons */}
-                            {policy.status === 'Active' && (
-                              <div className="flex items-center justify-between pt-3 border-t">
-                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                                  <Clock className="h-4 w-4" />
-                                  <span>Posted {policy.postedDate} • {policy.votingDeadline}</span>
-                                </div>
-                                <div className="flex gap-2">
-                                  <Button 
-                                    size="sm" 
-                                    variant={userVote === 'support' ? 'default' : 'outline'}
-                                    className={userVote === 'support' ? 'bg-green-600 hover:bg-green-700' : ''}
-                                    onClick={() => setVotedPolicies({...votedPolicies, [policy.id]: 'support'})}
-                                  >
-                                    <ThumbsUp className="h-4 w-4 mr-1" />
-                                    Support
-                                  </Button>
-                                  <Button 
-                                    size="sm" 
-                                    variant={userVote === 'oppose' ? 'default' : 'outline'}
-                                    className={userVote === 'oppose' ? 'bg-red-600 hover:bg-red-700' : ''}
-                                    onClick={() => setVotedPolicies({...votedPolicies, [policy.id]: 'oppose'})}
-                                  >
-                                    <ThumbsDown className="h-4 w-4 mr-1" />
-                                    Oppose
-                                  </Button>
-                                  <Button size="sm" variant="outline">
-                                    <Eye className="h-4 w-4 mr-1" />
-                                    Details
-                                  </Button>
-                                </div>
-                              </div>
-                            )}
-
-                            {policy.status === 'Closed' && (
-                              <div className="flex items-center justify-between pt-3 border-t">
-                                <div className="text-sm text-muted-foreground">
-                                  Voting closed • Final result: {supportPercentage}% support
-                                </div>
-                                <Button size="sm" variant="outline">
-                                  <Eye className="h-4 w-4 mr-1" />
-                                  View Results
-                                </Button>
-                              </div>
-                            )}
-                          </div>
-                        </CardContent>
-                      </Card>
-                    );
-                  })}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Consultation Tools Tab */}
-          <TabsContent value="consultation" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <MessageCircle className="h-5 w-5" />
-                      Public Consultations
-                    </CardTitle>
-                    <CardDescription>Provide structured feedback on policy proposals and government initiatives</CardDescription>
+      {/* Stakeholder Groups */}
+      <Card>
+        <CardHeader>
+          <CardTitle>Stakeholder Groups</CardTitle>
+          <CardDescription>Overview of engagement by stakeholder category</CardDescription>
+        </CardHeader>
+        <CardContent>
+          <div className="grid gap-4 md:grid-cols-3">
+            {stakeholderData.stakeholderGroups.map((group) => (
+              <div key={group.id} className="p-4 border rounded-lg">
+                <div className="flex items-center justify-between mb-3">
+                  <div className="flex items-center gap-2">
+                    {getGroupIcon(group.name)}
+                    <span className="font-medium">{group.name}</span>
                   </div>
-                  <Button>
-                    <Send className="mr-2 h-4 w-4" />
-                    Submit Feedback
-                  </Button>
+                  {getPriorityBadge(group.priority)}
                 </div>
-              </CardHeader>
-              <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                  {/* Consultation Topics */}
-                  <div className="space-y-4">
-                    <h3 className="font-semibold text-lg">Active Consultations</h3>
-                    {consultationTopics.map((topic) => (
-                      <Card key={topic.id} className="hover:shadow-lg transition-shadow">
-                        <CardHeader>
-                          <div className="flex items-start justify-between mb-2">
-                            <Badge variant="secondary">{topic.sdg}</Badge>
-                            <Badge className="bg-green-100 text-green-800">{topic.status}</Badge>
-                          </div>
-                          <CardTitle className="text-base">{topic.title}</CardTitle>
-                          <CardDescription className="text-sm">{topic.description}</CardDescription>
-                        </CardHeader>
-                        <CardContent>
-                          <div className="space-y-3">
-                            <div className="flex items-center justify-between text-sm">
-                              <div className="flex items-center gap-2 text-muted-foreground">
-                                <Building2 className="h-4 w-4" />
-                                {topic.postedBy}
-                              </div>
-                              <div className="flex items-center gap-2 text-orange-600">
-                                <Clock className="h-4 w-4" />
-                                {topic.deadline}
-                              </div>
-                            </div>
-                            <div className="flex items-center justify-between pt-2 border-t">
-                              <span className="text-sm text-muted-foreground">{topic.responses} responses</span>
-                              <Button size="sm">
-                                Participate
-                              </Button>
-                            </div>
-                          </div>
-                        </CardContent>
-                      </Card>
-                    ))}
+                <div className="space-y-2">
+                  <div className="flex items-center justify-between text-sm">
+                    <span className="text-muted-foreground">Members</span>
+                    <span className="font-medium">{group.count}</span>
                   </div>
-
-                  {/* Feedback Form */}
-                  <div>
-                    <h3 className="font-semibold text-lg mb-4">Submit Your Feedback</h3>
-                    {!feedbackSubmitted ? (
-                      <Card>
-                        <CardHeader>
-                          <CardTitle className="text-base">National Digital Education Framework</CardTitle>
-                          <CardDescription>Share your thoughts and suggestions</CardDescription>
-                        </CardHeader>
-                        <CardContent>
-                          <div className="space-y-4">
-                            <div>
-                              <label className="text-sm font-medium mb-2 block">Your Role</label>
-                              <Input placeholder="e.g., Teacher, Parent, Student, NGO Worker" />
-                            </div>
-                            <div>
-                              <label className="text-sm font-medium mb-2 block">Your Feedback</label>
-                              <Textarea 
-                                placeholder="Share your detailed feedback, suggestions, or concerns about the proposed framework..."
-                                rows={6}
-                                value={consultationFeedback}
-                                onChange={(e) => setConsultationFeedback(e.target.value)}
-                              />
-                            </div>
-                            <div>
-                              <label className="text-sm font-medium mb-2 block">Supporting Documents (Optional)</label>
-                              <Button variant="outline" className="w-full">
-                                <Upload className="mr-2 h-4 w-4" />
-                                Upload Files
-                              </Button>
-                            </div>
-                            <Button 
-                              className="w-full"
-                              onClick={() => {
-                                if (consultationFeedback.trim()) {
-                                  setFeedbackSubmitted(true);
-                                  setTimeout(() => {
-                                    setFeedbackSubmitted(false);
-                                    setConsultationFeedback('');
-                                  }, 3000);
-                                }
-                              }}
-                            >
-                              <Send className="mr-2 h-4 w-4" />
-                              Submit Feedback
-                            </Button>
-                          </div>
-                        </CardContent>
-                      </Card>
-                    ) : (
-                      <Card className="border-green-600">
-                        <CardContent className="pt-6">
-                          <div className="text-center py-8">
-                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
-                              <CheckCircle2 className="h-8 w-8 text-green-600" />
-                            </div>
-                            <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
-                            <p className="text-muted-foreground">
-                              Your feedback has been submitted successfully. We value your input in shaping India's policies.
-                            </p>
-                          </div>
-                        </CardContent>
-                      </Card>
-                    )}
+                  <div className="space-y-1">
+                    <div className="flex items-center justify-between text-sm">
+                      <span className="text-muted-foreground">Engagement</span>
+                      <span className={`font-medium ${getScoreColor(group.engagementLevel)}`}>
+                        {group.engagementLevel}%
+                      </span>
+                    </div>
+                    <Progress value={group.engagementLevel} className="h-2" />
                   </div>
                 </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+              </div>
+            ))}
+          </div>
+        </CardContent>
+      </Card>
 
-          {/* Feedback Refinement Loop Tab */}
-          <TabsContent value="feedback" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <TrendingUp className="h-5 w-5" />
-                  Feedback Refinement Loop
-                </CardTitle>
-                <CardDescription>See how stakeholder feedback has influenced policy changes and improvements</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-6">
-                  {feedbackRefinements.map((refinement) => (
-                    <Card key={refinement.id} className="border-l-4 border-l-blue-600">
-                      <CardHeader>
-                        <div className="flex items-start justify-between">
-                          <div className="flex-1">
-                            <CardTitle className="text-lg mb-2">{refinement.originalPolicy}</CardTitle>
-                            <Badge variant="secondary">{refinement.date}</Badge>
-                          </div>
-                        </div>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-4">
-                          {/* Feedback Received */}
-                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
-                            <div className="flex items-start gap-3">
-                              <div className="bg-orange-100 rounded-full p-2">
-                                <MessageSquare className="h-4 w-4 text-orange-600" />
-                              </div>
-                              <div className="flex-1">
-                                <div className="font-medium text-sm mb-1">Feedback Received</div>
-                                <p className="text-sm text-muted-foreground">{refinement.feedbackReceived}</p>
-                              </div>
-                            </div>
-                          </div>
+      {/* Main Content - Continuing in next message due to length */}
+      <Tabs defaultValue="stakeholders" className="w-full">
+        <TabsList>
+          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
+          <TabsTrigger value="activities">Activities</TabsTrigger>
+          <TabsTrigger value="feedback">Feedback Requests</TabsTrigger>
+          <TabsTrigger value="insights">Insights</TabsTrigger>
+        </TabsList>
 
-                          {/* Policy Change */}
-                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
-                            <div className="flex items-start gap-3">
-                              <div className="bg-blue-100 rounded-full p-2">
-                                <FileText className="h-4 w-4 text-blue-600" />
-                              </div>
-                              <div className="flex-1">
-                                <div className="font-medium text-sm mb-1">Policy Change Implemented</div>
-                                <p className="text-sm text-muted-foreground">{refinement.policyChange}</p>
-                              </div>
-                            </div>
+        {/* Stakeholders Tab */}
+        <TabsContent value="stakeholders" className="mt-6">
+          <div className="space-y-4">
+            {stakeholderData.stakeholders.slice(0, 4).map((stakeholder) => (
+              <Card
+                key={stakeholder.id}
+                className={`hover:shadow-lg transition-shadow ${
+                  selectedStakeholder === stakeholder.id ? 'ring-2 ring-primary' : ''
+                }`}
+              >
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-3 mb-2">
+                        {getGroupIcon(stakeholder.type)}
+                        <CardTitle className="text-xl">{stakeholder.name}</CardTitle>
+                        <Badge variant="secondary">{stakeholder.abbreviation}</Badge>
+                        {getPriorityBadge(stakeholder.priority)}
+                      </div>
+                      <CardDescription>
+                        <div className="flex flex-col gap-1 mt-2">
+                          <div className="flex items-center gap-2">
+                            <Users className="h-3 w-3" />
+                            <span>{stakeholder.contactPerson}</span>
                           </div>
-
-                          {/* Impact */}
-                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
-                            <div className="flex items-start gap-3">
-                              <div className="bg-green-100 rounded-full p-2">
-                                <TrendingUp className="h-4 w-4 text-green-600" />
-                              </div>
-                              <div className="flex-1">
-                                <div className="font-medium text-sm mb-1">Measured Impact</div>
-                                <p className="text-sm text-muted-foreground">{refinement.impact}</p>
-                              </div>
-                            </div>
+                          <div className="flex items-center gap-2">
+                            <Mail className="h-3 w-3" />
+                            <span>{stakeholder.email}</span>
                           </div>
                         </div>
-                      </CardContent>
-                    </Card>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Engagement Analytics Tab */}
-          <TabsContent value="analytics" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <BarChart3 className="h-5 w-5" />
-                  Stakeholder Engagement Analytics
-                </CardTitle>
-                <CardDescription>Track participation rates, sentiment analysis, and engagement metrics</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-6">
-                  {/* Key Metrics */}
-                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
-                    <Card className="border-t-4 border-t-blue-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Total Participants</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.totalParticipants.toLocaleString()}</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-green-600">
-                          <TrendingUp className="h-4 w-4" />
-                          <span>+12% from last month</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-
-                    <Card className="border-t-4 border-t-green-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Active This Month</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.activeThisMonth.toLocaleString()}</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-green-600">
-                          <TrendingUp className="h-4 w-4" />
-                          <span>+8% from last month</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-
-                    <Card className="border-t-4 border-t-purple-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Voting Participation</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.votingParticipation}%</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-green-600">
-                          <TrendingUp className="h-4 w-4" />
-                          <span>+5% from last month</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-
-                    <Card className="border-t-4 border-t-orange-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Consultation Responses</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.consultationResponses.toLocaleString()}</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-green-600">
-                          <TrendingUp className="h-4 w-4" />
-                          <span>+15% from last month</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-
-                    <Card className="border-t-4 border-t-cyan-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Feedback Implemented</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.feedbackImplemented}%</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                          <CheckCircle2 className="h-4 w-4" />
-                          <span>42 of 100 suggestions</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-
-                    <Card className="border-t-4 border-t-pink-600">
-                      <CardHeader className="pb-3">
-                        <CardDescription>Average Sentiment</CardDescription>
-                        <CardTitle className="text-3xl">{engagementMetrics.averageSentiment}%</CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="flex items-center gap-2 text-sm text-green-600">
-                          <TrendingUp className="h-4 w-4" />
-                          <span>Positive sentiment</span>
-                        </div>
-                      </CardContent>
-                    </Card>
+                      </CardDescription>
+                    </div>
+                    <Button
+                      variant="outline"
+                      size="sm"
+                      onClick={() =>
+                        setSelectedStakeholder(
+                          selectedStakeholder === stakeholder.id ? null : stakeholder.id
+                        )
+                      }
+                    >
+                      {selectedStakeholder === stakeholder.id ? 'Hide' : 'View Details'}
+                    </Button>
                   </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="grid grid-cols-4 gap-4">
+                    <div className="text-center">
+                      <p className="text-xs text-muted-foreground mb-1">Engagement</p>
+                      <p className={`text-2xl font-bold ${getScoreColor(stakeholder.engagementLevel)}`}>
+                        {stakeholder.engagementLevel}%
+                      </p>
+                    </div>
+                    <div className="text-center">
+                      <p className="text-xs text-muted-foreground mb-1">Projects</p>
+                      <p className="text-2xl font-bold">{stakeholder.activeProjects}</p>
+                    </div>
+                    <div className="text-center">
+                      <p className="text-xs text-muted-foreground mb-1">Contribution</p>
+                      <p className="text-lg font-bold">
+                        {formatCurrency(stakeholder.totalContribution)}
+                      </p>
+                    </div>
+                    <div className="text-center">
+                      <p className="text-xs text-muted-foreground mb-1">Last Contact</p>
+                      <p className="text-sm font-medium">{formatDate(stakeholder.lastEngagement)}</p>
+                    </div>
+                  </div>
 
-                  {/* Participation by Stakeholder Category */}
-                  <Card>
-                    <CardHeader>
-                      <CardTitle className="text-lg">Participation by Stakeholder Category</CardTitle>
-                      <CardDescription>Breakdown of engagement across different stakeholder groups</CardDescription>
-                    </CardHeader>
-                    <CardContent>
-                      <div className="space-y-4">
-                        {stakeholderCategories.map((category) => {
-                          const participationRate = Math.floor(Math.random() * 30) + 50; // Mock data
-                          return (
-                            <div key={category.id}>
-                              <div className="flex items-center justify-between mb-2">
-                                <div className="flex items-center gap-2">
-                                  <category.icon className={`h-4 w-4 ${category.color}`} />
-                                  <span className="text-sm font-medium">{category.name}</span>
-                                </div>
-                                <span className="text-sm text-muted-foreground">{participationRate}%</span>
-                              </div>
-                              <div className="w-full bg-muted rounded-full h-2">
-                                <div 
-                                  className={`h-2 rounded-full transition-all ${category.bgColor.replace('bg-', 'bg-').replace('-100', '-600')}`}
-                                  style={{ width: `${participationRate}%` }}
-                                />
-                              </div>
-                            </div>
-                          );
-                        })}
-                      </div>
-                    </CardContent>
-                  </Card>
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Stakeholder Directory Tab */}
-          <TabsContent value="directory" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <Users className="h-5 w-5" />
-                      Stakeholder Directory
-                    </CardTitle>
-                    <CardDescription>Browse and connect with registered stakeholders</CardDescription>
+                  <div className="flex flex-wrap gap-2">
+                    {stakeholder.sdgFocus.map((sdg, index) => (
+                      <Badge key={index} variant="outline">
+                        {sdg}
+                      </Badge>
+                    ))}
                   </div>
+
                   <div className="flex gap-2">
-                    <Input 
-                      placeholder="Search organizations..." 
-                      className="w-64"
-                      value={searchQuery}
-                      onChange={(e) => setSearchQuery(e.target.value)}
-                    />
-                    <Button variant="outline">
-                      <Search className="h-4 w-4" />
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <Mail className="mr-2 h-4 w-4" />
+                      Contact
                     </Button>
-                  </div>
-                </div>
-              </CardHeader>
-              <CardContent>
-                <div className="flex gap-2 mb-6">
-                  <Button 
-                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
-                    size="sm"
-                    onClick={() => setSelectedCategory('all')}
-                  >
-                    All
-                  </Button>
-                  {stakeholderCategories.map((cat) => (
-                    <Button 
-                      key={cat.id}
-                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <MessageSquare className="mr-2 h-4 w-4" />
+                      Message
+                    </Button>
+                    <Button
+                      variant="outline"
                       size="sm"
-                      onClick={() => setSelectedCategory(cat.id)}
+                      className="flex-1"
+                      onClick={() => {
+                        setFeedbackForm({ ...feedbackForm, stakeholderId: stakeholder.id.toString() });
+                        setShowFeedbackDialog(true);
+                      }}
                     >
-                      {cat.name}
+                      <Star className="mr-2 h-4 w-4" />
+                      Feedback
                     </Button>
+                  </div>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Activities Tab */}
+        <TabsContent value="activities" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Engagement Activities</CardTitle>
+              <CardDescription>Scheduled and completed stakeholder engagements</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <Table>
+                <TableHeader>
+                  <TableRow>
+                    <TableHead>Type</TableHead>
+                    <TableHead>Title</TableHead>
+                    <TableHead>Date & Time</TableHead>
+                    <TableHead>Location</TableHead>
+                    <TableHead>Attendees</TableHead>
+                    <TableHead>Status</TableHead>
+                  </TableRow>
+                </TableHeader>
+                <TableBody>
+                  {stakeholderData.engagementActivities.map((activity) => (
+                    <TableRow key={activity.id}>
+                      <TableCell>
+                        <Badge variant="outline">{activity.type}</Badge>
+                      </TableCell>
+                      <TableCell className="font-medium">{activity.title}</TableCell>
+                      <TableCell>
+                        <div className="flex flex-col">
+                          <span>{formatDate(activity.date)}</span>
+                          <span className="text-xs text-muted-foreground">{activity.time}</span>
+                        </div>
+                      </TableCell>
+                      <TableCell>
+                        <div className="flex items-center gap-1">
+                          <MapPin className="h-3 w-3" />
+                          <span className="text-sm">{activity.location}</span>
+                        </div>
+                      </TableCell>
+                      <TableCell>{activity.attendees}</TableCell>
+                      <TableCell>
+                        <Badge
+                          variant={
+                            activity.status === 'completed'
+                              ? 'default'
+                              : 'secondary'
+                          }
+                        >
+                          {activity.status}
+                        </Badge>
+                      </TableCell>
+                    </TableRow>
                   ))}
-                </div>
-                <div className="text-center py-12 text-muted-foreground">
-                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
-                  <p>Directory feature coming soon. Use search to find specific organizations.</p>
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+                </TableBody>
+              </Table>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-          {/* Recent Activity Tab */}
-          <TabsContent value="activity" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Activity className="h-5 w-5" />
-                  Recent Activity
-                </CardTitle>
-                <CardDescription>Latest updates from stakeholder community</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-4">
-                  {recentActivities.map((activity, index) => (
-                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
-                      <div className={`p-2 rounded-lg ${
-                        activity.type === 'join' ? 'bg-blue-100' :
-                        activity.type === 'proposal' ? 'bg-purple-100' :
-                        activity.type === 'milestone' ? 'bg-green-100' :
-                        activity.type === 'funding' ? 'bg-amber-100' :
-                        'bg-cyan-100'
-                      }`}>
-                        {activity.type === 'join' && <Users className="h-4 w-4 text-blue-600" />}
-                        {activity.type === 'proposal' && <FileText className="h-4 w-4 text-purple-600" />}
-                        {activity.type === 'milestone' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
-                        {activity.type === 'funding' && <TrendingUp className="h-4 w-4 text-amber-600" />}
-                        {activity.type === 'event' && <Calendar className="h-4 w-4 text-cyan-600" />}
+        {/* Feedback Requests Tab */}
+        <TabsContent value="feedback" className="mt-6">
+          <div className="space-y-4">
+            {stakeholderData.feedbackRequests.map((request) => (
+              <Card key={request.id}>
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-2 mb-2">
+                        <CardTitle className="text-lg">{request.title}</CardTitle>
+                        {getPriorityBadge(request.priority)}
                       </div>
-                      <div className="flex-1">
-                        <div className="font-medium">{activity.stakeholder}</div>
-                        <div className="text-sm text-muted-foreground">{activity.action}</div>
+                      <CardDescription>{request.description}</CardDescription>
+                    </div>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="grid md:grid-cols-3 gap-4">
+                    <div>
+                      <p className="text-sm text-muted-foreground mb-1">Deadline</p>
+                      <p className="font-medium">{formatDate(request.deadline)}</p>
+                    </div>
+                    <div>
+                      <p className="text-sm text-muted-foreground mb-1">Responses</p>
+                      <p className="font-medium">{request.responses}</p>
+                    </div>
+                    <div>
+                      <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
+                      <div className="flex flex-wrap gap-1">
+                        {request.targetAudience.slice(0, 2).map((audience, index) => (
+                          <Badge key={index} variant="outline" className="text-xs">
+                            {audience}
+                          </Badge>
+                        ))}
                       </div>
-                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                     </div>
-                  ))}
+                  </div>
+                  <div className="flex gap-2">
+                    <Button size="sm" className="flex-1">
+                      <Send className="mr-2 h-4 w-4" />
+                      Respond
+                    </Button>
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <FileText className="mr-2 h-4 w-4" />
+                      View Details
+                    </Button>
+                  </div>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Insights Tab */}
+        <TabsContent value="insights" className="mt-6">
+          <div className="space-y-4">
+            {stakeholderData.insights.map((insight, index) => (
+              <div key={index} className={`flex gap-3 p-4 rounded-lg ${getInsightBg(insight.type)}`}>
+                {getInsightIcon(insight.type)}
+                <div className="flex-1">
+                  <div className="flex items-center justify-between mb-2">
+                    <p className="font-medium">{insight.title}</p>
+                    {getPriorityBadge(insight.priority)}
+                  </div>
+                  <p className="text-sm mb-2">{insight.description}</p>
+                  <div className="flex items-center gap-2 text-sm">
+                    <Target className="h-4 w-4" />
+                    <span className="font-medium">Impact: {insight.impact}</span>
+                  </div>
                 </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-        </Tabs>
-      </section>
+              </div>
+            ))}
+          </div>
+        </TabsContent>
+      </Tabs>
+
+      {/* Feedback Dialog */}
+      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
+        <DialogContent>
+          <DialogHeader>
+            <DialogTitle>Submit Feedback</DialogTitle>
+            <DialogDescription>Share your feedback about this stakeholder</DialogDescription>
+          </DialogHeader>
+          <div className="space-y-4 py-4">
+            <div className="space-y-2">
+              <Label htmlFor="feedbackType">Feedback Type</Label>
+              <Select
+                value={feedbackForm.feedbackType}
+                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, feedbackType: value })}
+              >
+                <SelectTrigger id="feedbackType">
+                  <SelectValue placeholder="Select type" />
+                </SelectTrigger>
+                <SelectContent>
+                  <SelectItem value="Partnership">Partnership</SelectItem>
+                  <SelectItem value="Communication">Communication</SelectItem>
+                  <SelectItem value="Collaboration">Collaboration</SelectItem>
+                </SelectContent>
+              </Select>
+            </div>
+            <div className="space-y-2">
+              <Label htmlFor="rating">Rating</Label>
+              <Select
+                value={feedbackForm.rating}
+                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, rating: value })}
+              >
+                <SelectTrigger id="rating">
+                  <SelectValue placeholder="Select rating" />
+                </SelectTrigger>
+                <SelectContent>
+                  <SelectItem value="5">5 - Excellent</SelectItem>
+                  <SelectItem value="4">4 - Good</SelectItem>
+                  <SelectItem value="3">3 - Average</SelectItem>
+                  <SelectItem value="2">2 - Poor</SelectItem>
+                  <SelectItem value="1">1 - Very Poor</SelectItem>
+                </SelectContent>
+              </Select>
+            </div>
+            <div className="space-y-2">
+              <Label htmlFor="comment">Comment</Label>
+              <Textarea
+                id="comment"
+                value={feedbackForm.comment}
+                onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
+                placeholder="Share your detailed feedback"
+                rows={4}
+              />
+            </div>
+          </div>
+          <DialogFooter>
+            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
+              Cancel
+            </Button>
+            <Button onClick={submitFeedback}>Submit Feedback</Button>
+          </DialogFooter>
+        </DialogContent>
+      </Dialog>
     </div>
   );
 }
