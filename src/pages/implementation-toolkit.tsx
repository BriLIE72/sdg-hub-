Index: src/pages/implementation-toolkit.tsx
===================================================================
--- src/pages/implementation-toolkit.tsx	original
+++ src/pages/implementation-toolkit.tsx	modified
@@ -1,1097 +1,707 @@
-import { useState } from 'react';
-import { Button } from '@/components/ui/button';
+import { useState, useEffect } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
-import { Badge } from '@/components/ui/badge';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
-import { Progress } from '@/components/ui/progress';
+import { Badge } from '@/components/ui/badge';
+import { Button } from '@/components/ui/button';
+import { Input } from '@/components/ui/input';
+import { Separator } from '@/components/ui/separator';
 import {
-  Wrench,
-  ClipboardCheck,
-  Rocket,
-  BarChart3,
-  Shield,
-  Download,
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
   FileText,
-  CheckCircle2,
-  AlertCircle,
+  Download,
+  RefreshCw,
+  Search,
+  Star,
+  TrendingUp,
+  TrendingDown,
+  Minus,
+  BookOpen,
+  Calendar,
+  BarChart,
   Users,
   DollarSign,
-  Calendar,
-  Target,
-  TrendingUp,
-  FileSpreadsheet,
-  ChevronRight,
-  Play,
-  Pause,
-  CheckCheck,
-  XCircle,
+  Lightbulb,
+  CheckCircle,
   Clock,
-  MapPin,
-  Building2,
-  Scale,
-  Globe,
-  Leaf,
-  BookOpen
+  Award,
+  ExternalLink,
+  Filter,
+  AlertCircle,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-interface AssessmentTemplate {
-  id: string;
-  title: string;
-  description: string;
-  category: string;
-  sections: number;
-  estimatedTime: string;
-  icon: any;
-  color: string;
+interface ToolkitData {
+  overview: {
+    totalResources: number;
+    templates: number;
+    guides: number;
+    tools: number;
+    caseStudies: number;
+    lastUpdated: string;
+  };
+  categories: Array<{
+    id: number;
+    name: string;
+    icon: string;
+    description: string;
+    resourceCount: number;
+    color: string;
+    resources: Array<{
+      id: number;
+      title: string;
+      type: string;
+      format: string;
+      size: string;
+      downloads: number;
+      rating: number;
+      description: string;
+      sdgs: string[];
+      lastUpdated: string;
+      author: string;
+    }>;
+  }>;
+  guides: Array<{
+    id: number;
+    title: string;
+    description: string;
+    chapters: number;
+    pages: number;
+    duration: string;
+    difficulty: string;
+    rating: number;
+    downloads: number;
+  }>;
+  tools: Array<{
+    id: number;
+    name: string;
+    description: string;
+    type: string;
+    platform: string;
+    status: string;
+    users: number;
+  }>;
+  recentDownloads: Array<{
+    id: number;
+    resource: string;
+    user: string;
+    timestamp: string;
+    category: string;
+  }>;
+  popularResources: Array<{
+    name: string;
+    downloads: number;
+    trend: string;
+  }>;
+  recommendations: Array<{
+    title: string;
+    description: string;
+    resourceId: number;
+    category: string;
+    priority: string;
+  }>;
 }
 
-interface PilotStep {
-  id: number;
-  title: string;
-  description: string;
-  status: 'completed' | 'in-progress' | 'pending';
-  tasks: string[];
-}
+export default function ImplementationToolkitPage() {
+  const [toolkitData, setToolkitData] = useState<ToolkitData | null>(null);
+  const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
+  const [searchQuery, setSearchQuery] = useState('');
+  const [selectedCategory, setSelectedCategory] = useState<string>('all');
+  const [selectedType, setSelectedType] = useState<string>('all');
 
-interface MonitoringMetric {
-  id: string;
-  name: string;
-  current: number;
-  target: number;
-  unit: string;
-  trend: 'up' | 'down' | 'stable';
-  status: 'on-track' | 'at-risk' | 'needs-attention';
-}
+  useEffect(() => {
+    fetchToolkitData();
+  }, []);
 
-interface ComplianceItem {
-  id: string;
-  category: string;
-  requirement: string;
-  status: 'compliant' | 'partial' | 'non-compliant';
-  details: string;
-}
+  const fetchToolkitData = async () => {
+    setLoading(true);
+    setError('');
 
-export default function ImplementationToolkitPage() {
-  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
-  const [pilotProgress, setPilotProgress] = useState(35);
-  const [activeStep, setActiveStep] = useState(2);
+    try {
+      const response = await fetch('/api/implementation-toolkit');
+      const data = await response.json();
 
-  // Assessment Templates
-  const assessmentTemplates: AssessmentTemplate[] = [
-    {
-      id: 'stakeholder',
-      title: 'Stakeholder Mapping',
-      description: 'Identify and analyze all stakeholders involved in policy implementation',
-      category: 'Assessment',
-      sections: 5,
-      estimatedTime: '2-3 hours',
-      icon: Users,
-      color: 'blue'
-    },
-    {
-      id: 'cost-benefit',
-      title: 'Cost-Benefit Analysis',
-      description: 'Evaluate financial viability and expected returns of policy implementation',
-      category: 'Financial',
-      sections: 7,
-      estimatedTime: '4-5 hours',
-      icon: DollarSign,
-      color: 'green'
-    },
-    {
-      id: 'risk-matrix',
-      title: 'Risk Assessment Matrix',
-      description: 'Identify potential risks and develop mitigation strategies',
-      category: 'Risk Management',
-      sections: 4,
-      estimatedTime: '2-3 hours',
-      icon: AlertCircle,
-      color: 'red'
-    },
-    {
-      id: 'readiness',
-      title: 'Implementation Readiness',
-      description: 'Assess organizational capacity and infrastructure readiness',
-      category: 'Assessment',
-      sections: 6,
-      estimatedTime: '3-4 hours',
-      icon: CheckCircle2,
-      color: 'purple'
-    },
-    {
-      id: 'timeline',
-      title: 'Project Timeline Planner',
-      description: 'Create detailed implementation timeline with milestones',
-      category: 'Planning',
-      sections: 5,
-      estimatedTime: '2-3 hours',
-      icon: Calendar,
-      color: 'orange'
-    },
-    {
-      id: 'kpi',
-      title: 'KPI Framework',
-      description: 'Define key performance indicators and success metrics',
-      category: 'Monitoring',
-      sections: 4,
-      estimatedTime: '2-3 hours',
-      icon: Target,
-      color: 'teal'
+      if (data.success) {
+        setToolkitData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch toolkit data');
+      }
+    } catch (err) {
+      setError('Failed to load toolkit data. Please try again.');
+      console.error('Toolkit data error:', err);
+    } finally {
+      setLoading(false);
     }
-  ];
+  };
 
-  // Pilot Project Steps
-  const pilotSteps: PilotStep[] = [
-    {
-      id: 1,
-      title: 'Define Pilot Scope',
-      description: 'Identify pilot region, target population, and objectives',
-      status: 'completed',
-      tasks: [
-        'Select 3-5 pilot districts based on readiness assessment',
-        'Define target population size and demographics',
-        'Set clear pilot objectives and success criteria',
-        'Establish pilot duration (6-12 months recommended)'
-      ]
-    },
-    {
-      id: 2,
-      title: 'Stakeholder Engagement',
-      description: 'Engage with local governments, NGOs, and community leaders',
-      status: 'in-progress',
-      tasks: [
-        'Conduct stakeholder mapping workshop',
-        'Organize consultation meetings with local officials',
-        'Partner with 2-3 NGOs for ground-level support',
-        'Establish community feedback mechanisms'
-      ]
-    },
-    {
-      id: 3,
-      title: 'Resource Allocation',
-      description: 'Allocate budget, personnel, and infrastructure for pilot',
-      status: 'pending',
-      tasks: [
-        'Finalize pilot budget allocation',
-        'Assign dedicated project team (5-7 members)',
-        'Procure necessary equipment and technology',
-        'Set up monitoring and evaluation systems'
-      ]
-    },
-    {
-      id: 4,
-      title: 'Implementation & Monitoring',
-      description: 'Execute pilot program with continuous monitoring',
-      status: 'pending',
-      tasks: [
-        'Launch pilot program in selected districts',
-        'Conduct weekly progress reviews',
-        'Collect real-time data on key metrics',
-        'Address challenges and adapt as needed'
-      ]
-    },
-    {
-      id: 5,
-      title: 'Evaluation & Scale-Up',
-      description: 'Analyze results and plan for full-scale implementation',
-      status: 'pending',
-      tasks: [
-        'Conduct comprehensive impact evaluation',
-        'Document lessons learned and best practices',
-        'Prepare scale-up strategy based on pilot outcomes',
-        'Present findings to decision-makers'
-      ]
-    }
-  ];
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchToolkitData();
+    setRefreshing(false);
+  };
 
-  // Monitoring Metrics
-  const monitoringMetrics: MonitoringMetric[] = [
-    {
-      id: 'beneficiaries',
-      name: 'Beneficiaries Reached',
-      current: 45000,
-      target: 50000,
-      unit: 'people',
-      trend: 'up',
-      status: 'on-track'
-    },
-    {
-      id: 'budget',
-      name: 'Budget Utilization',
-      current: 72,
-      target: 80,
-      unit: '%',
-      trend: 'up',
-      status: 'on-track'
-    },
-    {
-      id: 'satisfaction',
-      name: 'Stakeholder Satisfaction',
-      current: 78,
-      target: 85,
-      unit: '%',
-      trend: 'stable',
-      status: 'needs-attention'
-    },
-    {
-      id: 'timeline',
-      name: 'Timeline Adherence',
-      current: 65,
-      target: 90,
-      unit: '%',
-      trend: 'down',
-      status: 'at-risk'
-    },
-    {
-      id: 'quality',
-      name: 'Quality Standards Met',
-      current: 88,
-      target: 95,
-      unit: '%',
-      trend: 'up',
-      status: 'on-track'
-    },
-    {
-      id: 'impact',
-      name: 'Impact Score',
-      current: 7.8,
-      target: 8.5,
-      unit: '/10',
-      trend: 'up',
-      status: 'on-track'
-    }
-  ];
+  const downloadResource = async (resourceId: number, resourceTitle: string) => {
+    try {
+      const response = await fetch('/api/implementation-toolkit/download', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify({
+          resourceId,
+          resourceTitle,
+          userId: 'Current User',
+        }),
+      });
 
-  // Compliance Checklist
-  const complianceItems: ComplianceItem[] = [
-    {
-      id: 'constitution',
-      category: 'Legal Framework',
-      requirement: 'Alignment with Indian Constitution',
-      status: 'compliant',
-      details: 'Policy aligns with Articles 21, 39, and 47 of the Constitution'
-    },
-    {
-      id: 'sdg',
-      category: 'International Commitments',
-      requirement: 'SDG Alignment (Goals 1, 2, 3)',
-      status: 'compliant',
-      details: 'Directly contributes to SDG 1 (No Poverty), SDG 2 (Zero Hunger), SDG 3 (Good Health)'
-    },
-    {
-      id: 'paris',
-      category: 'International Commitments',
-      requirement: 'Paris Agreement Compliance',
-      status: 'partial',
-      details: 'Carbon footprint assessment needed for supply chain operations'
-    },
-    {
-      id: 'nfsa',
-      category: 'National Laws',
-      requirement: 'National Food Security Act 2013',
-      status: 'compliant',
-      details: 'Policy complements existing NFSA provisions and PM-POSHAN scheme'
-    },
-    {
-      id: 'rte',
-      category: 'National Laws',
-      requirement: 'Right to Education Act 2009',
-      status: 'compliant',
-      details: 'Supports RTE objectives for universal access to quality education'
-    },
-    {
-      id: 'environment',
-      category: 'Environmental Regulations',
-      requirement: 'Environmental Impact Assessment',
-      status: 'partial',
-      details: 'EIA required for large-scale infrastructure development'
-    },
-    {
-      id: 'data',
-      category: 'Data Protection',
-      requirement: 'Digital Personal Data Protection Act 2023',
-      status: 'compliant',
-      details: 'Data collection and storage mechanisms comply with DPDP Act'
-    },
-    {
-      id: 'procurement',
-      category: 'Procurement',
-      requirement: 'General Financial Rules 2017',
-      status: 'compliant',
-      details: 'Procurement processes follow GFR 2017 guidelines'
-    }
-  ];
+      const data = await response.json();
 
-  const getStatusColor = (status: string) => {
-    switch (status) {
-      case 'completed':
-      case 'compliant':
-      case 'on-track':
-        return 'text-green-600 bg-green-50 border-green-200';
-      case 'in-progress':
-      case 'partial':
-      case 'needs-attention':
-        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
-      case 'pending':
-      case 'non-compliant':
-      case 'at-risk':
-        return 'text-red-600 bg-red-50 border-red-200';
-      default:
-        return 'text-gray-600 bg-gray-50 border-gray-200';
+      if (data.success) {
+        alert(`Download started: ${resourceTitle}`);
+        console.log('Download logged:', data.data);
+      } else {
+        alert(data.error || 'Download failed');
+      }
+    } catch (err) {
+      alert('Failed to download resource');
+      console.error('Download error:', err);
     }
   };
 
-  const getStatusIcon = (status: string) => {
-    switch (status) {
-      case 'completed':
-      case 'compliant':
-        return <CheckCheck className="h-5 w-5" />;
-      case 'in-progress':
-      case 'partial':
-        return <Clock className="h-5 w-5" />;
-      case 'pending':
-        return <Pause className="h-5 w-5" />;
-      case 'non-compliant':
-      case 'at-risk':
-        return <XCircle className="h-5 w-5" />;
-      default:
-        return <AlertCircle className="h-5 w-5" />;
-    }
+  const exportToolkit = () => {
+    if (!toolkitData) return;
+
+    const report = JSON.stringify(toolkitData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `implementation-toolkit-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
   };
 
+  const getIconComponent = (iconName: string) => {
+    const icons: Record<string, any> = {
+      FileText,
+      Calendar,
+      BarChart,
+      Users,
+      DollarSign,
+      BookOpen,
+    };
+    const Icon = icons[iconName] || FileText;
+    return <Icon className="h-5 w-5" />;
+  };
+
+  const getTypeBadge = (type: string) => {
+    if (type === 'template') return <Badge variant="default">Template</Badge>;
+    if (type === 'guide') return <Badge className="bg-purple-500">Guide</Badge>;
+    if (type === 'tool') return <Badge className="bg-blue-500">Tool</Badge>;
+    if (type === 'case-study') return <Badge className="bg-green-500">Case Study</Badge>;
+    return <Badge variant="secondary">{type}</Badge>;
+  };
+
   const getTrendIcon = (trend: string) => {
-    switch (trend) {
-      case 'up':
-        return <TrendingUp className="h-4 w-4 text-green-600" />;
-      case 'down':
-        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
-      default:
-        return <div className="h-4 w-4 border-t-2 border-gray-400" />;
-    }
+    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
+    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
+    return <Minus className="h-4 w-4 text-gray-500" />;
   };
 
+  const getPriorityBadge = (priority: string) => {
+    if (priority === 'high') return <Badge className="bg-orange-500">High Priority</Badge>;
+    if (priority === 'medium') return <Badge variant="default">Medium Priority</Badge>;
+    return <Badge variant="secondary">Low Priority</Badge>;
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
+  const getTimeAgo = (timestamp: string) => {
+    const now = new Date();
+    const past = new Date(timestamp);
+    const diffMs = now.getTime() - past.getTime();
+    const diffMins = Math.floor(diffMs / 60000);
+    const diffHours = Math.floor(diffMs / 3600000);
+    const diffDays = Math.floor(diffMs / 86400000);
+
+    if (diffMins < 60) return `${diffMins} minutes ago`;
+    if (diffHours < 24) return `${diffHours} hours ago`;
+    return `${diffDays} days ago`;
+  };
+
+  const filteredCategories = toolkitData?.categories.filter((category) => {
+    if (selectedCategory !== 'all' && category.name !== selectedCategory) return false;
+    return true;
+  });
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading implementation toolkit...</p>
+        </div>
+      </div>
+    );
+  }
+
+  if (error || !toolkitData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchToolkitData} className="mt-4">
+            Try Again
+          </Button>
+        </Alert>
+      </div>
+    );
+  }
+
   return (
-    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
-      {/* Hero Section */}
-      <section className="relative py-20 px-4 overflow-hidden">
-        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
-        <div
-          className="absolute inset-0 opacity-20"
-          style={{
-            backgroundImage: `url('https://media.gettyimages.com/id/2203914027/photo/business-professional-leading-team-presentation-in-modern-office-setting.jpg?b=1&s=2048x2048&w=0&k=20&c=IPUH77dKpwI5vFGmoxiMQHjvW9-3aPWwLydqku3DGv8=')`,
-            backgroundSize: 'cover',
-            backgroundPosition: 'center'
-          }}
-        />
-        <div className="relative max-w-7xl mx-auto text-center text-white">
-          <div className="flex items-center justify-center gap-2 mb-4">
-            <Wrench className="h-8 w-8" />
-            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
-              Practical Tools
-            </Badge>
-          </div>
-          <h1 className="text-5xl font-bold mb-6">Implementation Toolkit</h1>
-          <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-50">
-            Comprehensive tools and templates to guide policymakers through every stage of policy implementation—from assessment to scale-up
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">Implementation Toolkit</h1>
+          <p className="text-muted-foreground">
+            Resources, templates, and tools for successful policy implementation
           </p>
-          <div className="flex flex-wrap gap-4 justify-center">
-            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
-              <Download className="mr-2 h-5 w-5" />
-              Download All Templates
-            </Button>
-            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
-              <BookOpen className="mr-2 h-5 w-5" />
-              View User Guide
-            </Button>
-          </div>
         </div>
-      </section>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
+            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
+            Refresh
+          </Button>
+          <Button onClick={exportToolkit}>
+            <Download className="mr-2 h-4 w-4" />
+            Export All
+          </Button>
+        </div>
+      </div>
 
-      {/* Main Content */}
-      <section className="py-16 px-4">
-        <div className="max-w-7xl mx-auto">
-          <Tabs defaultValue="assessment" className="space-y-8">
-            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-2 bg-white shadow-md">
-              <TabsTrigger value="assessment" className="flex items-center gap-2 py-3">
-                <ClipboardCheck className="h-4 w-4" />
-                <span className="hidden sm:inline">Assessment</span>
-              </TabsTrigger>
-              <TabsTrigger value="pilot" className="flex items-center gap-2 py-3">
-                <Rocket className="h-4 w-4" />
-                <span className="hidden sm:inline">Pilot Wizard</span>
-              </TabsTrigger>
-              <TabsTrigger value="monitoring" className="flex items-center gap-2 py-3">
-                <BarChart3 className="h-4 w-4" />
-                <span className="hidden sm:inline">Monitoring</span>
-              </TabsTrigger>
-              <TabsTrigger value="compliance" className="flex items-center gap-2 py-3">
-                <Shield className="h-4 w-4" />
-                <span className="hidden sm:inline">Compliance</span>
-              </TabsTrigger>
-              <TabsTrigger value="templates" className="flex items-center gap-2 py-3">
-                <FileText className="h-4 w-4" />
-                <span className="hidden sm:inline">Templates</span>
-              </TabsTrigger>
-            </TabsList>
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-5">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
+            <FileText className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{toolkitData.overview.totalResources}</div>
+            <p className="text-xs text-muted-foreground">Available resources</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Templates</CardTitle>
+            <FileText className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{toolkitData.overview.templates}</div>
+            <p className="text-xs text-muted-foreground">Ready to use</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Guides</CardTitle>
+            <BookOpen className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{toolkitData.overview.guides}</div>
+            <p className="text-xs text-muted-foreground">Step-by-step</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Tools</CardTitle>
+            <BarChart className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{toolkitData.overview.tools}</div>
+            <p className="text-xs text-muted-foreground">Interactive</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Case Studies</CardTitle>
+            <Award className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{toolkitData.overview.caseStudies}</div>
+            <p className="text-xs text-muted-foreground">Success stories</p>
+          </CardContent>
+        </Card>
+      </div>
 
-            {/* Assessment Templates Tab */}
-            <TabsContent value="assessment" className="space-y-6">
-              <div className="text-center mb-8">
-                <h2 className="text-3xl font-bold mb-3">Readiness Assessment Templates</h2>
-                <p className="text-muted-foreground max-w-2xl mx-auto">
-                  Comprehensive templates to evaluate your organization's readiness for policy implementation
-                </p>
-              </div>
+      {/* Search and Filters */}
+      <Card>
+        <CardContent className="pt-6">
+          <div className="flex flex-col md:flex-row gap-4">
+            <div className="flex-1 relative">
+              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
+              <Input
+                placeholder="Search resources..."
+                value={searchQuery}
+                onChange={(e) => setSearchQuery(e.target.value)}
+                className="pl-10"
+              />
+            </div>
+            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
+              <SelectTrigger className="w-full md:w-[200px]">
+                <SelectValue placeholder="Category" />
+              </SelectTrigger>
+              <SelectContent>
+                <SelectItem value="all">All Categories</SelectItem>
+                {toolkitData.categories.map((category) => (
+                  <SelectItem key={category.id} value={category.name}>
+                    {category.name}
+                  </SelectItem>
+                ))}
+              </SelectContent>
+            </Select>
+            <Select value={selectedType} onValueChange={setSelectedType}>
+              <SelectTrigger className="w-full md:w-[200px]">
+                <SelectValue placeholder="Type" />
+              </SelectTrigger>
+              <SelectContent>
+                <SelectItem value="all">All Types</SelectItem>
+                <SelectItem value="template">Templates</SelectItem>
+                <SelectItem value="guide">Guides</SelectItem>
+                <SelectItem value="tool">Tools</SelectItem>
+                <SelectItem value="case-study">Case Studies</SelectItem>
+              </SelectContent>
+            </Select>
+          </div>
+        </CardContent>
+      </Card>
 
-              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
-                {assessmentTemplates.map((template) => {
-                  const IconComponent = template.icon;
-                  return (
-                    <Card
-                      key={template.id}
-                      className="hover:shadow-lg transition-shadow cursor-pointer"
-                      onClick={() => setSelectedTemplate(template.id)}
-                    >
-                      <CardHeader>
-                        <div className="flex items-start justify-between mb-3">
-                          <div
-                            className={`p-3 rounded-lg bg-${template.color}-100 text-${template.color}-600`}
-                          >
-                            <IconComponent className="h-6 w-6" />
-                          </div>
-                          <Badge variant="outline">{template.category}</Badge>
-                        </div>
-                        <CardTitle className="text-xl">{template.title}</CardTitle>
-                        <CardDescription>{template.description}</CardDescription>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-3">
-                          <div className="flex items-center justify-between text-sm">
-                            <span className="text-muted-foreground">Sections:</span>
-                            <span className="font-medium">{template.sections}</span>
-                          </div>
-                          <div className="flex items-center justify-between text-sm">
-                            <span className="text-muted-foreground">Est. Time:</span>
-                            <span className="font-medium">{template.estimatedTime}</span>
-                          </div>
-                          <Button className="w-full mt-4">
-                            <Download className="mr-2 h-4 w-4" />
-                            Download Template
-                          </Button>
-                        </div>
-                      </CardContent>
-                    </Card>
-                  );
-                })}
+      {/* Recommendations */}
+      <Card>
+        <CardHeader>
+          <CardTitle className="flex items-center gap-2">
+            <Lightbulb className="h-5 w-5" />
+            Recommended for You
+          </CardTitle>
+          <CardDescription>Start with these resources based on your needs</CardDescription>
+        </CardHeader>
+        <CardContent>
+          <div className="space-y-3">
+            {toolkitData.recommendations.map((rec, index) => (
+              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
+                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
+                <div className="flex-1">
+                  <div className="flex items-center justify-between mb-1">
+                    <p className="font-medium">{rec.title}</p>
+                    {getPriorityBadge(rec.priority)}
+                  </div>
+                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
+                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
+                    <Badge variant="outline">{rec.category}</Badge>
+                  </div>
+                </div>
+                <Button size="sm" variant="outline">
+                  <ExternalLink className="h-4 w-4" />
+                </Button>
               </div>
+            ))}
+          </div>
+        </CardContent>
+      </Card>
 
-              {/* Sample Assessment Preview */}
-              <Card className="mt-8 border-2 border-blue-200 bg-blue-50/50">
+      {/* Main Content */}
+      <Tabs defaultValue="resources" className="w-full">
+        <TabsList>
+          <TabsTrigger value="resources">Resources</TabsTrigger>
+          <TabsTrigger value="guides">Guides</TabsTrigger>
+          <TabsTrigger value="tools">Tools</TabsTrigger>
+          <TabsTrigger value="popular">Popular</TabsTrigger>
+        </TabsList>
+
+        {/* Resources Tab */}
+        <TabsContent value="resources" className="mt-6">
+          <div className="space-y-6">
+            {filteredCategories?.map((category) => (
+              <Card key={category.id}>
                 <CardHeader>
-                  <CardTitle className="flex items-center gap-2">
-                    <FileText className="h-5 w-5 text-blue-600" />
-                    Sample: Stakeholder Mapping Template
-                  </CardTitle>
-                  <CardDescription>
-                    Preview of the stakeholder mapping assessment template
-                  </CardDescription>
-                </CardHeader>
-                <CardContent>
-                  <div className="space-y-4">
-                    <div className="grid md:grid-cols-2 gap-4">
-                      <div className="space-y-2">
-                        <h4 className="font-semibold">Section 1: Stakeholder Identification</h4>
-                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
-                          <li>• List all government ministries involved</li>
-                          <li>• Identify NGO partners and civil society organizations</li>
-                          <li>• Map private sector stakeholders</li>
-                          <li>• Document community representatives</li>
-                        </ul>
+                  <div className="flex items-center justify-between">
+                    <div className="flex items-center gap-3">
+                      {getIconComponent(category.icon)}
+                      <div>
+                        <CardTitle>{category.name}</CardTitle>
+                        <CardDescription>{category.description}</CardDescription>
                       </div>
-                      <div className="space-y-2">
-                        <h4 className="font-semibold">Section 2: Influence & Interest Matrix</h4>
-                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
-                          <li>• Rate stakeholder influence (High/Medium/Low)</li>
-                          <li>• Assess stakeholder interest level</li>
-                          <li>• Categorize by engagement strategy</li>
-                          <li>• Identify key decision-makers</li>
-                        </ul>
-                      </div>
                     </div>
-                    <Button variant="outline" className="w-full">
-                      <Download className="mr-2 h-4 w-4" />
-                      Download Full Template (Excel)
-                    </Button>
+                    <Badge variant="secondary">{category.resourceCount} resources</Badge>
                   </div>
-                </CardContent>
-              </Card>
-            </TabsContent>
-
-            {/* Pilot Project Wizard Tab */}
-            <TabsContent value="pilot" className="space-y-6">
-              <div className="text-center mb-8">
-                <h2 className="text-3xl font-bold mb-3">Pilot Project Wizard</h2>
-                <p className="text-muted-foreground max-w-2xl mx-auto">
-                  Step-by-step guide to plan, execute, and evaluate pilot programs before full-scale implementation
-                </p>
-              </div>
-
-              {/* Progress Overview */}
-              <Card className="border-2 border-purple-200 bg-purple-50/50">
-                <CardHeader>
-                  <CardTitle className="flex items-center justify-between">
-                    <span>Pilot Progress Overview</span>
-                    <Badge variant="outline" className="text-lg px-4 py-1">
-                      {pilotProgress}% Complete
-                    </Badge>
-                  </CardTitle>
                 </CardHeader>
                 <CardContent>
-                  <Progress value={pilotProgress} className="h-3 mb-4" />
-                  <div className="grid md:grid-cols-3 gap-4 mt-6">
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <CheckCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">1</div>
-                      <div className="text-sm text-muted-foreground">Completed</div>
-                    </div>
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">1</div>
-                      <div className="text-sm text-muted-foreground">In Progress</div>
-                    </div>
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <Pause className="h-8 w-8 text-gray-400 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">3</div>
-                      <div className="text-sm text-muted-foreground">Pending</div>
-                    </div>
-                  </div>
-                </CardContent>
-              </Card>
-
-              {/* Pilot Steps */}
-              <div className="space-y-4">
-                {pilotSteps.map((step, index) => (
-                  <Card
-                    key={step.id}
-                    className={`${
-                      step.status === 'in-progress'
-                        ? 'border-2 border-yellow-400 shadow-lg'
-                        : ''
-                    }`}
-                  >
-                    <CardHeader>
-                      <div className="flex items-start gap-4">
+                  <div className="space-y-3">
+                    {category.resources
+                      .filter((resource) => {
+                        if (selectedType !== 'all' && resource.type !== selectedType) return false;
+                        if (
+                          searchQuery &&
+                          !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
+                          !resource.description.toLowerCase().includes(searchQuery.toLowerCase())
+                        )
+                          return false;
+                        return true;
+                      })
+                      .map((resource) => (
                         <div
-                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getStatusColor(
-                            step.status
-                          )}`}
+                          key={resource.id}
+                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted transition-colors"
                         >
-                          {step.id}
-                        </div>
-                        <div className="flex-1">
-                          <div className="flex items-center justify-between mb-2">
-                            <CardTitle className="text-xl">{step.title}</CardTitle>
-                            <Badge className={getStatusColor(step.status)}>
-                              {getStatusIcon(step.status)}
-                              <span className="ml-2 capitalize">{step.status.replace('-', ' ')}</span>
-                            </Badge>
+                          <FileText className="h-8 w-8 text-muted-foreground mt-1" />
+                          <div className="flex-1">
+                            <div className="flex items-start justify-between mb-2">
+                              <div>
+                                <h4 className="font-medium mb-1">{resource.title}</h4>
+                                <p className="text-sm text-muted-foreground mb-2">
+                                  {resource.description}
+                                </p>
+                              </div>
+                              {getTypeBadge(resource.type)}
+                            </div>
+                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
+                              <span className="flex items-center gap-1">
+                                <FileText className="h-3 w-3" />
+                                {resource.format}
+                              </span>
+                              <span>{resource.size}</span>
+                              <span className="flex items-center gap-1">
+                                <Download className="h-3 w-3" />
+                                {resource.downloads.toLocaleString()} downloads
+                              </span>
+                              <span className="flex items-center gap-1">
+                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
+                                {resource.rating}
+                              </span>
+                              <span className="flex items-center gap-1">
+                                <Clock className="h-3 w-3" />
+                                Updated {formatDate(resource.lastUpdated)}
+                              </span>
+                            </div>
+                            <div className="flex flex-wrap gap-1 mt-2">
+                              {resource.sdgs.map((sdg, i) => (
+                                <Badge key={i} variant="outline" className="text-xs">
+                                  {sdg}
+                                </Badge>
+                              ))}
+                            </div>
                           </div>
-                          <CardDescription className="text-base">{step.description}</CardDescription>
+                          <div className="flex flex-col gap-2">
+                            <Button
+                              size="sm"
+                              onClick={() => downloadResource(resource.id, resource.title)}
+                            >
+                              <Download className="mr-2 h-4 w-4" />
+                              Download
+                            </Button>
+                            <Button size="sm" variant="outline">
+                              <ExternalLink className="mr-2 h-4 w-4" />
+                              Preview
+                            </Button>
+                          </div>
                         </div>
-                      </div>
-                    </CardHeader>
-                    <CardContent>
-                      <div className="ml-16">
-                        <h4 className="font-semibold mb-3">Key Tasks:</h4>
-                        <ul className="space-y-2">
-                          {step.tasks.map((task, taskIndex) => (
-                            <li key={taskIndex} className="flex items-start gap-2">
-                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
-                              <span className="text-sm text-muted-foreground">{task}</span>
-                            </li>
-                          ))}
-                        </ul>
-                        {step.status === 'in-progress' && (
-                          <Button className="mt-4">
-                            <Play className="mr-2 h-4 w-4" />
-                            Continue This Step
-                          </Button>
-                        )}
-                        {step.status === 'pending' && (
-                          <Button variant="outline" className="mt-4" disabled>
-                            <Pause className="mr-2 h-4 w-4" />
-                            Not Started
-                          </Button>
-                        )}
-                      </div>
-                    </CardContent>
-                  </Card>
-                ))}
-              </div>
-            </TabsContent>
-
-            {/* Monitoring Dashboard Tab */}
-            <TabsContent value="monitoring" className="space-y-6">
-              <div className="text-center mb-8">
-                <h2 className="text-3xl font-bold mb-3">Progress Monitoring Dashboard</h2>
-                <p className="text-muted-foreground max-w-2xl mx-auto">
-                  Track key performance indicators and pilot outcomes in real-time
-                </p>
-              </div>
-
-              {/* KPI Cards */}
-              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
-                {monitoringMetrics.map((metric) => (
-                  <Card key={metric.id} className="hover:shadow-lg transition-shadow">
-                    <CardHeader>
-                      <div className="flex items-center justify-between mb-2">
-                        <CardTitle className="text-lg">{metric.name}</CardTitle>
-                        {getTrendIcon(metric.trend)}
-                      </div>
-                      <div className="flex items-baseline gap-2">
-                        <span className="text-3xl font-bold">
-                          {metric.current.toLocaleString()}
-                        </span>
-                        <span className="text-muted-foreground">
-                          / {metric.target.toLocaleString()} {metric.unit}
-                        </span>
-                      </div>
-                    </CardHeader>
-                    <CardContent>
-                      <Progress
-                        value={(metric.current / metric.target) * 100}
-                        className="h-2 mb-3"
-                      />
-                      <Badge className={getStatusColor(metric.status)}>
-                        {metric.status.replace('-', ' ').toUpperCase()}
-                      </Badge>
-                    </CardContent>
-                  </Card>
-                ))}
-              </div>
-
-              {/* Detailed Monitoring Table */}
-              <Card>
-                <CardHeader>
-                  <CardTitle>Pilot Site Performance</CardTitle>
-                  <CardDescription>
-                    Comparative performance across pilot districts
-                  </CardDescription>
-                </CardHeader>
-                <CardContent>
-                  <div className="overflow-x-auto">
-                    <table className="w-full">
-                      <thead>
-                        <tr className="border-b">
-                          <th className="text-left py-3 px-4">District</th>
-                          <th className="text-left py-3 px-4">Beneficiaries</th>
-                          <th className="text-left py-3 px-4">Budget Used</th>
-                          <th className="text-left py-3 px-4">Satisfaction</th>
-                          <th className="text-left py-3 px-4">Status</th>
-                        </tr>
-                      </thead>
-                      <tbody>
-                        <tr className="border-b hover:bg-gray-50">
-                          <td className="py-3 px-4 font-medium">Mumbai Suburban</td>
-                          <td className="py-3 px-4">12,500</td>
-                          <td className="py-3 px-4">₹850 Cr (85%)</td>
-                          <td className="py-3 px-4">82%</td>
-                          <td className="py-3 px-4">
-                            <Badge className="bg-green-100 text-green-700">On Track</Badge>
-                          </td>
-                        </tr>
-                        <tr className="border-b hover:bg-gray-50">
-                          <td className="py-3 px-4 font-medium">Lucknow</td>
-                          <td className="py-3 px-4">10,200</td>
-                          <td className="py-3 px-4">₹680 Cr (68%)</td>
-                          <td className="py-3 px-4">76%</td>
-                          <td className="py-3 px-4">
-                            <Badge className="bg-yellow-100 text-yellow-700">Needs Attention</Badge>
-                          </td>
-                        </tr>
-                        <tr className="border-b hover:bg-gray-50">
-                          <td className="py-3 px-4 font-medium">Chennai</td>
-                          <td className="py-3 px-4">11,800</td>
-                          <td className="py-3 px-4">₹920 Cr (92%)</td>
-                          <td className="py-3 px-4">88%</td>
-                          <td className="py-3 px-4">
-                            <Badge className="bg-green-100 text-green-700">On Track</Badge>
-                          </td>
-                        </tr>
-                        <tr className="border-b hover:bg-gray-50">
-                          <td className="py-3 px-4 font-medium">Patna</td>
-                          <td className="py-3 px-4">6,500</td>
-                          <td className="py-3 px-4">₹420 Cr (42%)</td>
-                          <td className="py-3 px-4">65%</td>
-                          <td className="py-3 px-4">
-                            <Badge className="bg-red-100 text-red-700">At Risk</Badge>
-                          </td>
-                        </tr>
-                        <tr className="hover:bg-gray-50">
-                          <td className="py-3 px-4 font-medium">Bangalore Urban</td>
-                          <td className="py-3 px-4">14,000</td>
-                          <td className="py-3 px-4">₹1,050 Cr (88%)</td>
-                          <td className="py-3 px-4">85%</td>
-                          <td className="py-3 px-4">
-                            <Badge className="bg-green-100 text-green-700">On Track</Badge>
-                          </td>
-                        </tr>
-                      </tbody>
-                    </table>
+                      ))}
                   </div>
-                  <Button variant="outline" className="w-full mt-4">
-                    <Download className="mr-2 h-4 w-4" />
-                    Export Performance Report
-                  </Button>
                 </CardContent>
               </Card>
-            </TabsContent>
+            ))}
+          </div>
+        </TabsContent>
 
-            {/* Compliance Checker Tab */}
-            <TabsContent value="compliance" className="space-y-6">
-              <div className="text-center mb-8">
-                <h2 className="text-3xl font-bold mb-3">Compliance Checker</h2>
-                <p className="text-muted-foreground max-w-2xl mx-auto">
-                  Verify policy alignment with Indian laws, international commitments, and SDG goals
-                </p>
-              </div>
-
-              {/* Compliance Summary */}
-              <Card className="border-2 border-green-200 bg-green-50/50">
+        {/* Guides Tab */}
+        <TabsContent value="guides" className="mt-6">
+          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
+            {toolkitData.guides.map((guide) => (
+              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                 <CardHeader>
-                  <CardTitle className="flex items-center justify-between">
-                    <span>Overall Compliance Status</span>
-                    <Badge className="bg-green-600 text-white text-lg px-4 py-1">
-                      75% Compliant
-                    </Badge>
-                  </CardTitle>
+                  <div className="flex items-start justify-between mb-2">
+                    <BookOpen className="h-8 w-8 text-primary" />
+                    <Badge variant="secondary">{guide.difficulty}</Badge>
+                  </div>
+                  <CardTitle className="text-lg">{guide.title}</CardTitle>
+                  <CardDescription>{guide.description}</CardDescription>
                 </CardHeader>
-                <CardContent>
-                  <div className="grid md:grid-cols-3 gap-4">
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <CheckCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">6</div>
-                      <div className="text-sm text-muted-foreground">Fully Compliant</div>
+                <CardContent className="space-y-4">
+                  <div className="grid grid-cols-2 gap-3 text-sm">
+                    <div>
+                      <p className="text-muted-foreground">Chapters</p>
+                      <p className="font-medium">{guide.chapters}</p>
                     </div>
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">2</div>
-                      <div className="text-sm text-muted-foreground">Partial Compliance</div>
+                    <div>
+                      <p className="text-muted-foreground">Pages</p>
+                      <p className="font-medium">{guide.pages}</p>
                     </div>
-                    <div className="text-center p-4 bg-white rounded-lg">
-                      <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
-                      <div className="text-2xl font-bold">0</div>
-                      <div className="text-sm text-muted-foreground">Non-Compliant</div>
+                    <div>
+                      <p className="text-muted-foreground">Duration</p>
+                      <p className="font-medium">{guide.duration}</p>
                     </div>
+                    <div>
+                      <p className="text-muted-foreground">Rating</p>
+                      <p className="font-medium flex items-center gap-1">
+                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
+                        {guide.rating}
+                      </p>
+                    </div>
                   </div>
+                  <Separator />
+                  <div className="flex items-center justify-between text-sm text-muted-foreground">
+                    <span className="flex items-center gap-1">
+                      <Download className="h-3 w-3" />
+                      {guide.downloads.toLocaleString()}
+                    </span>
+                  </div>
+                  <div className="flex gap-2">
+                    <Button size="sm" className="flex-1">
+                      <Download className="mr-2 h-4 w-4" />
+                      Download
+                    </Button>
+                    <Button size="sm" variant="outline">
+                      <ExternalLink className="h-4 w-4" />
+                    </Button>
+                  </div>
                 </CardContent>
               </Card>
+            ))}
+          </div>
+        </TabsContent>
 
-              {/* Compliance Items by Category */}
-              <div className="space-y-4">
-                {['Legal Framework', 'International Commitments', 'National Laws', 'Environmental Regulations', 'Data Protection', 'Procurement'].map((category) => {
-                  const categoryItems = complianceItems.filter(item => item.category === category);
-                  if (categoryItems.length === 0) return null;
-
-                  const getCategoryIcon = (cat: string) => {
-                    switch (cat) {
-                      case 'Legal Framework':
-                        return <Scale className="h-5 w-5" />;
-                      case 'International Commitments':
-                        return <Globe className="h-5 w-5" />;
-                      case 'National Laws':
-                        return <Building2 className="h-5 w-5" />;
-                      case 'Environmental Regulations':
-                        return <Leaf className="h-5 w-5" />;
-                      default:
-                        return <Shield className="h-5 w-5" />;
-                    }
-                  };
-
-                  return (
-                    <Card key={category}>
-                      <CardHeader>
-                        <CardTitle className="flex items-center gap-2">
-                          {getCategoryIcon(category)}
-                          {category}
-                        </CardTitle>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-3">
-                          {categoryItems.map((item) => (
-                            <div
-                              key={item.id}
-                              className="flex items-start gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
-                            >
-                              <div className="flex-shrink-0">
-                                {getStatusIcon(item.status)}
-                              </div>
-                              <div className="flex-1">
-                                <div className="flex items-center justify-between mb-2">
-                                  <h4 className="font-semibold">{item.requirement}</h4>
-                                  <Badge className={getStatusColor(item.status)}>
-                                    {item.status === 'compliant' && 'Compliant'}
-                                    {item.status === 'partial' && 'Partial'}
-                                    {item.status === 'non-compliant' && 'Non-Compliant'}
-                                  </Badge>
-                                </div>
-                                <p className="text-sm text-muted-foreground">{item.details}</p>
-                              </div>
-                            </div>
-                          ))}
-                        </div>
-                      </CardContent>
-                    </Card>
-                  );
-                })}
-              </div>
-
-              <Card className="border-2 border-yellow-200 bg-yellow-50/50">
+        {/* Tools Tab */}
+        <TabsContent value="tools" className="mt-6">
+          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
+            {toolkitData.tools.map((tool) => (
+              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                 <CardHeader>
-                  <CardTitle className="flex items-center gap-2">
-                    <AlertCircle className="h-5 w-5 text-yellow-600" />
-                    Action Required
-                  </CardTitle>
+                  <div className="flex items-start justify-between mb-2">
+                    <BarChart className="h-8 w-8 text-primary" />
+                    <Badge className="bg-green-500">{tool.status}</Badge>
+                  </div>
+                  <CardTitle className="text-lg">{tool.name}</CardTitle>
+                  <CardDescription>{tool.description}</CardDescription>
                 </CardHeader>
-                <CardContent>
-                  <p className="text-sm text-muted-foreground mb-4">
-                    2 items require attention to achieve full compliance:
-                  </p>
-                  <ul className="space-y-2">
-                    <li className="flex items-start gap-2">
-                      <ChevronRight className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
-                      <span className="text-sm">
-                        <strong>Paris Agreement:</strong> Conduct carbon footprint assessment for supply chain operations
-                      </span>
-                    </li>
-                    <li className="flex items-start gap-2">
-                      <ChevronRight className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
-                      <span className="text-sm">
-                        <strong>Environmental Regulations:</strong> Complete EIA for large-scale infrastructure development
-                      </span>
-                    </li>
-                  </ul>
-                  <Button className="w-full mt-4">
-                    <Download className="mr-2 h-4 w-4" />
-                    Download Compliance Report
-                  </Button>
+                <CardContent className="space-y-4">
+                  <div className="grid grid-cols-2 gap-3 text-sm">
+                    <div>
+                      <p className="text-muted-foreground">Type</p>
+                      <p className="font-medium">{tool.type}</p>
+                    </div>
+                    <div>
+                      <p className="text-muted-foreground">Platform</p>
+                      <p className="font-medium">{tool.platform}</p>
+                    </div>
+                  </div>
+                  <Separator />
+                  <div className="flex items-center gap-2 text-sm">
+                    <Users className="h-4 w-4 text-muted-foreground" />
+                    <span className="text-muted-foreground">
+                      {tool.users.toLocaleString()} active users
+                    </span>
+                  </div>
+                  <div className="flex gap-2">
+                    <Button size="sm" className="flex-1">
+                      <ExternalLink className="mr-2 h-4 w-4" />
+                      Launch Tool
+                    </Button>
+                    <Button size="sm" variant="outline">
+                      <FileText className="h-4 w-4" />
+                    </Button>
+                  </div>
                 </CardContent>
               </Card>
-            </TabsContent>
+            ))}
+          </div>
+        </TabsContent>
 
-            {/* Templates Library Tab */}
-            <TabsContent value="templates" className="space-y-6">
-              <div className="text-center mb-8">
-                <h2 className="text-3xl font-bold mb-3">Downloadable Templates Library</h2>
-                <p className="text-muted-foreground max-w-2xl mx-auto">
-                  Ready-to-use templates in Excel and PDF formats for all implementation stages
-                </p>
-              </div>
-
-              {/* Template Categories */}
-              <div className="grid md:grid-cols-2 gap-6">
-                {/* Assessment Templates */}
-                <Card>
-                  <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <ClipboardCheck className="h-5 w-5 text-blue-600" />
-                      Assessment Templates
-                    </CardTitle>
-                    <CardDescription>6 templates available</CardDescription>
-                  </CardHeader>
-                  <CardContent>
-                    <div className="space-y-3">
-                      {assessmentTemplates.map((template) => (
-                        <div
-                          key={template.id}
-                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
-                        >
-                          <div className="flex items-center gap-3">
-                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                            <span className="text-sm font-medium">{template.title}</span>
-                          </div>
-                          <Button size="sm" variant="outline">
-                            <Download className="h-4 w-4" />
-                          </Button>
+        {/* Popular Tab */}
+        <TabsContent value="popular" className="mt-6">
+          <div className="grid gap-6 md:grid-cols-2">
+            <Card>
+              <CardHeader>
+                <CardTitle>Most Downloaded</CardTitle>
+                <CardDescription>Top resources by download count</CardDescription>
+              </CardHeader>
+              <CardContent>
+                <div className="space-y-3">
+                  {toolkitData.popularResources.map((resource, index) => (
+                    <div
+                      key={index}
+                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
+                    >
+                      <div className="flex items-center gap-3">
+                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
+                          {index + 1}
                         </div>
-                      ))}
-                    </div>
-                  </CardContent>
-                </Card>
-
-                {/* Planning Templates */}
-                <Card>
-                  <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <Calendar className="h-5 w-5 text-purple-600" />
-                      Planning Templates
-                    </CardTitle>
-                    <CardDescription>4 templates available</CardDescription>
-                  </CardHeader>
-                  <CardContent>
-                    <div className="space-y-3">
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Implementation Timeline</span>
+                        <div>
+                          <p className="font-medium">{resource.name}</p>
+                          <p className="text-sm text-muted-foreground">
+                            {resource.downloads.toLocaleString()} downloads
+                          </p>
                         </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
                       </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Budget Allocation Worksheet</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Resource Allocation Matrix</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileText className="h-5 w-5 text-red-600" />
-                          <span className="text-sm font-medium">Pilot Project Proposal Template</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
+                      {getTrendIcon(resource.trend)}
                     </div>
-                  </CardContent>
-                </Card>
+                  ))}
+                </div>
+              </CardContent>
+            </Card>
 
-                {/* Monitoring Templates */}
-                <Card>
-                  <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <BarChart3 className="h-5 w-5 text-green-600" />
-                      Monitoring Templates
-                    </CardTitle>
-                    <CardDescription>5 templates available</CardDescription>
-                  </CardHeader>
-                  <CardContent>
-                    <div className="space-y-3">
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">KPI Tracking Dashboard</span>
+            <Card>
+              <CardHeader>
+                <CardTitle>Recent Downloads</CardTitle>
+                <CardDescription>Latest resource downloads</CardDescription>
+              </CardHeader>
+              <CardContent>
+                <div className="space-y-3">
+                  {toolkitData.recentDownloads.map((download) => (
+                    <div key={download.id} className="flex gap-3 pb-3 border-b last:border-0">
+                      <Download className="h-5 w-5 text-muted-foreground mt-0.5" />
+                      <div className="flex-1">
+                        <p className="font-medium">{download.resource}</p>
+                        <p className="text-sm text-muted-foreground">{download.user}</p>
+                        <div className="flex items-center gap-2 mt-1">
+                          <Badge variant="outline" className="text-xs">
+                            {download.category}
+                          </Badge>
+                          <span className="text-xs text-muted-foreground">
+                            <Clock className="inline h-3 w-3 mr-1" />
+                            {getTimeAgo(download.timestamp)}
+                          </span>
                         </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
                       </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Progress Report Template</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Impact Evaluation Framework</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileText className="h-5 w-5 text-red-600" />
-                          <span className="text-sm font-medium">Quarterly Review Report</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Lessons Learned Log</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
                     </div>
-                  </CardContent>
-                </Card>
-
-                {/* Compliance Templates */}
-                <Card>
-                  <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <Shield className="h-5 w-5 text-orange-600" />
-                      Compliance Templates
-                    </CardTitle>
-                    <CardDescription>3 templates available</CardDescription>
-                  </CardHeader>
-                  <CardContent>
-                    <div className="space-y-3">
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">Legal Compliance Checklist</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
-                          <span className="text-sm font-medium">SDG Alignment Matrix</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
-                        <div className="flex items-center gap-3">
-                          <FileText className="h-5 w-5 text-red-600" />
-                          <span className="text-sm font-medium">Compliance Audit Report</span>
-                        </div>
-                        <Button size="sm" variant="outline">
-                          <Download className="h-4 w-4" />
-                        </Button>
-                      </div>
-                    </div>
-                  </CardContent>
-                </Card>
-              </div>
-
-              {/* Bulk Download */}
-              <Card className="border-2 border-blue-200 bg-blue-50/50">
-                <CardHeader>
-                  <CardTitle>Download Complete Toolkit</CardTitle>
-                  <CardDescription>
-                    Get all 18 templates in a single ZIP file (25.4 MB)
-                  </CardDescription>
-                </CardHeader>
-                <CardContent>
-                  <Button size="lg" className="w-full">
-                    <Download className="mr-2 h-5 w-5" />
-                    Download All Templates (ZIP)
-                  </Button>
-                </CardContent>
-              </Card>
-            </TabsContent>
-          </Tabs>
-        </div>
-      </section>
+                  ))}
+                </div>
+              </CardContent>
+            </Card>
+          </div>
+        </TabsContent>
+      </Tabs>
     </div>
   );
 }
