-import { useState } from 'react';
-import { Link } from 'react-router-dom';
-import { Button } from '@/components/ui/button';
+import { useState, useEffect } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
+import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
-import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
+import { Separator } from '@/components/ui/separator';
 import {
+  Select,
+  SelectContent,
+  SelectItem,
+  SelectTrigger,
+  SelectValue,
+} from '@/components/ui/select';
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
   BookOpen,
-  Calendar,
-  Users,
   Video,
   FileText,
+  Users,
   Download,
-  ExternalLink,
+  RefreshCw,
   Search,
-  MessageCircle,
-  Send,
-  X,
-  HelpCircle,
-  ChevronDown,
-  ChevronUp,
-  Sparkles,
-  Bot
+  Star,
+  Clock,
+  Eye,
+  ThumbsUp,
+  Calendar,
+  Award,
+  TrendingUp,
+  Play,
+  ExternalLink,
+  Filter,
+  CheckCircle,
+  AlertCircle,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-// FAQ Categories and Questions
-const faqCategories = [
-  {
-    id: 'general',
-    name: 'General',
-    icon: HelpCircle,
-    color: 'text-blue-600',
-    faqs: [
-      {
-        question: 'What is the SDG Committee Platform?',
-        answer: 'The SDG Committee Platform is a comprehensive digital solution designed to help government officials, NGOs, and citizens track, monitor, and collaborate on Sustainable Development Goals (SDGs) implementation in India. It provides tools for progress tracking, transparency, stakeholder engagement, and knowledge sharing.'
-      },
-      {
-        question: 'Who can access the platform?',
-        answer: 'The platform is accessible to multiple stakeholders: Government officials (with authentication), NGOs and civil society organizations, researchers and academics, citizens (public transparency features), and international partners. Different features are available based on user roles.'
-      },
-      {
-        question: 'Is the platform free to use?',
-        answer: 'Yes, the SDG Committee Platform is completely free for all users. It is funded by the government and international development partners to ensure maximum accessibility and transparency in SDG implementation.'
-      },
-      {
-        question: 'How often is the data updated?',
-        answer: 'Data is updated in real-time for most features. SDG progress indicators are updated quarterly, funding and budget data is updated monthly, and transparency reports are published quarterly. The platform displays the last updated date for each section.'
-      }
-    ]
-  },
-  {
-    id: 'government',
-    name: 'Government Officials',
-    icon: Users,
-    color: 'text-green-600',
-    faqs: [
-      {
-        question: 'How do I register as a government official?',
-        answer: 'Click on "Login / Sign Up" in the header, then select the "Sign Up" tab. Fill in your official details including your government email, ministry/department, employee ID, and sector. Your account will be verified within 24-48 hours.'
-      },
-      {
-        question: 'What tools are available for government officials?',
-        answer: 'Government officials have access to: SDG Progress Dashboard with AI insights, Workday Management for task coordination, Collaboration Tools for real-time document editing, Multi-Stakeholder Portal for engagement, Transparency Dashboard for budget tracking, and International Cooperation tools for global partnerships.'
-      },
-      {
-        question: 'How do I submit SDG progress reports?',
-        answer: 'Navigate to the SDG Progress page, select your goal, and click "Submit Report". Fill in the required indicators, upload supporting documents, and submit. Reports are reviewed by the NITI Aayog team before being published.'
-      },
-      {
-        question: 'Can I collaborate with other ministries?',
-        answer: 'Yes! Use the Collaboration page to create shared workspaces, co-edit documents in real-time, schedule meetings, and track inter-ministerial projects. You can invite colleagues from other ministries to join your workspace.'
-      }
-    ]
-  },
-  {
-    id: 'ngos',
-    name: 'NGOs & Civil Society',
-    icon: Users,
-    color: 'text-purple-600',
-    faqs: [
-      {
-        question: 'How can NGOs participate in the platform?',
-        answer: 'NGOs can register for an account, participate in multi-stakeholder forums, provide feedback on policies, access best practices and case studies, download transparency reports, and collaborate with government officials on SDG projects.'
-      },
-      {
-        question: 'Can NGOs submit project proposals?',
-        answer: 'Yes, registered NGOs can submit project proposals through the Multi-Stakeholder Portal. Proposals are reviewed by relevant ministries and NITI Aayog. You will receive feedback and updates on your submission status.'
-      },
-      {
-        question: 'How do I access funding information?',
-        answer: 'Visit the Public Transparency Dashboard to view detailed funding allocation by SDG, state, and ministry. You can also download quarterly reports and see recent transactions. All funding data is publicly accessible.'
-      },
-      {
-        question: 'Can NGOs share success stories?',
-        answer: 'Absolutely! Navigate to the Best Practices page and click "Submit Success Story". Share your project details, outcomes, and lessons learned. Approved stories are featured on the platform to inspire others.'
-      }
-    ]
-  },
-  {
-    id: 'citizens',
-    name: 'Citizens',
-    icon: Users,
-    color: 'text-orange-600',
-    faqs: [
-      {
-        question: 'How can citizens track government SDG progress?',
-        answer: 'Citizens can access the SDG Progress page to view real-time progress on all 17 SDGs, see district-level data, and track quarterly trends. The Public Transparency Dashboard shows detailed funding allocation and utilization.'
-      },
-      {
-        question: 'Can I provide feedback as a citizen?',
-        answer: 'Yes! Visit the Citizen Feedback page to submit your feedback, suggestions, or concerns. You can also participate in polls on the Multi-Stakeholder Portal. All feedback is analyzed using AI sentiment analysis and shared with relevant authorities.'
-      },
-      {
-        question: 'How do I download transparency reports?',
-        answer: 'Go to the Public Transparency Dashboard, click on the "Downloadable Reports" tab, and select the report you want to download. Reports include annual budgets, quarterly transparency reports, and SDG progress summaries.'
-      },
-      {
-        question: 'Are there educational resources for citizens?',
-        answer: 'Yes! The Knowledge Center provides webinars, guides, infographics, and videos explaining SDGs, government initiatives, and how citizens can contribute. All resources are available in multiple languages.'
-      }
-    ]
-  },
-  {
-    id: 'technical',
-    name: 'Technical Support',
-    icon: FileText,
-    color: 'text-red-600',
-    faqs: [
-      {
-        question: 'What browsers are supported?',
-        answer: 'The platform works best on modern browsers: Google Chrome (latest 2 versions), Mozilla Firefox (latest 2 versions), Safari (latest 2 versions), and Microsoft Edge (latest 2 versions). Mobile browsers are also fully supported.'
-      },
-      {
-        question: 'Is there a mobile app?',
-        answer: 'Currently, the platform is web-based and fully responsive on mobile devices. A dedicated mobile app for iOS and Android is planned for Q2 2026. You can add the website to your home screen for app-like experience.'
-      },
-      {
-        question: 'How do I report a technical issue?',
-        answer: 'Click on the chatbot icon in the bottom-right corner and describe your issue, or email support@sdgcommittee.gov.in. Include your browser version, device type, and screenshots if possible. Our team responds within 24 hours.'
-      },
-      {
-        question: 'Is my data secure on the platform?',
-        answer: 'Yes, we use industry-standard security measures including SSL encryption, secure authentication, regular security audits, and data backup. Personal information is protected according to India\'s data protection laws.'
-      }
-    ]
-  },
-  {
-    id: 'policy',
-    name: 'Policy Implementation',
-    icon: BookOpen,
-    color: 'text-teal-600',
-    faqs: [
-      {
-        question: 'How does the Policy Adaptation Lab work?',
-        answer: 'The Policy Adaptation Lab uses AI to analyze global policies and adapt them for Indian context. It provides impact forecasting, risk assessment, feasibility scoring, and localization recommendations. You can search policies from 194 countries and get AI-powered insights.'
-      },
-      {
-        question: 'Can I compare policies from different countries?',
-        answer: 'Yes! Use the Comparative Policy Analysis tool on the International Cooperation page to compare policies side-by-side. You can highlight similarities, gaps, and innovative elements between global and Indian policies.'
-      },
-      {
-        question: 'What is the Implementation Toolkit?',
-        answer: 'The Implementation Toolkit provides practical templates and tools for policymakers: readiness assessment templates, pilot project planners, progress monitoring dashboards, and compliance checkers. All tools are downloadable and customizable.'
-      },
-      {
-        question: 'How do I access best practices from other countries?',
-        answer: 'Visit the Best Practices page to browse global case studies filtered by sector, country, and SDG. Each case study includes detailed outcomes, lessons learned, and adaptation recommendations for Indian states.'
-      }
-    ]
-  }
-];
+interface KnowledgeData {
+  overview: {
+    totalResources: number;
+    courses: number;
+    articles: number;
+    videos: number;
+    webinars: number;
+    researchPapers: number;
+    activeUsers: number;
+    completionRate: number;
+    lastUpdated: string;
+  };
+  featuredCourses: Array<{
+    id: number;
+    title: string;
+    description: string;
+    instructor: string;
+    duration: string;
+    level: string;
+    enrolled: number;
+    rating: number;
+    reviews: number;
+    modules: number;
+    hours: number;
+    certificate: boolean;
+    sdgs: string[];
+    thumbnail: string;
+    price: string;
+    startDate: string;
+    language: string;
+    subtitles: string[];
+  }>;
+  articles: Array<{
+    id: number;
+    title: string;
+    author: string;
+    category: string;
+    readTime: number;
+    views: number;
+    likes: number;
+    publishedDate: string;
+    sdgs: string[];
+    excerpt: string;
+    featured: boolean;
+  }>;
+  videos: Array<{
+    id: number;
+    title: string;
+    presenter: string;
+    duration: string;
+    views: number;
+    likes: number;
+    category: string;
+    publishedDate: string;
+    sdgs: string[];
+    thumbnail: string;
+    description: string;
+  }>;
+  webinars: Array<{
+    id: number;
+    title: string;
+    host: string;
+    date: string;
+    time: string;
+    duration: string;
+    registered: number;
+    capacity: number;
+    status: string;
+    speakers: string[];
+    sdgs: string[];
+    description: string;
+    registrationLink?: string;
+    recordingLink?: string;
+  }>;
+  researchPapers: Array<{
+    id: number;
+    title: string;
+    authors: string[];
+    institution: string;
+    publishedDate: string;
+    pages: number;
+    citations: number;
+    sdgs: string[];
+    abstract: string;
+    downloadLink: string;
+    category: string;
+  }>;
+  learningPaths: Array<{
+    id: number;
+    title: string;
+    description: string;
+    courses: number;
+    duration: string;
+    level: string;
+    enrolled: number;
+    completion: number;
+    certificate: boolean;
+  }>;
+  categories: Array<{
+    name: string;
+    count: number;
+    icon: string;
+  }>;
+  insights: Array<{
+    type: string;
+    title: string;
+    description: string;
+    priority: string;
+  }>;
+}
 
-// Predefined chatbot questions
-const predefinedQuestions = [
-  'How do I track SDG progress?',
-  'What is the Public Transparency Dashboard?',
-  'How can I provide citizen feedback?',
-  'How do I register as a government official?',
-  'What tools are available for NGOs?',
-  'How do I download reports?'
-];
-
-// AI Chatbot responses (simulated)
-const chatbotResponses: { [key: string]: string } = {
-  'How do I track SDG progress?': 'You can track SDG progress by visiting the SDG Progress page from the homepage. There you\'ll find real-time data on all 17 SDGs, district-level breakdowns, quarterly trends, and AI-powered insights. The dashboard shows progress percentages, completed indicators, and areas needing attention.',
-  'What is the Public Transparency Dashboard?': 'The Public Transparency Dashboard is a citizen-friendly tool that shows how government funds are allocated and utilized for SDG implementation. It includes SDG-wise funding breakdown, state-wise distribution, ministry budgets, recent transactions, and downloadable reports. No login required!',
-  'How can I provide citizen feedback?': 'Visit the Citizen Feedback page to submit your feedback, suggestions, or concerns about SDG implementation. Your feedback is analyzed using AI sentiment analysis and shared with relevant government authorities. You can also participate in polls on the Multi-Stakeholder Portal.',
-  'How do I register as a government official?': 'Click "Login / Sign Up" in the header, select the "Sign Up" tab, and fill in your official details including government email, ministry/department, employee ID, and sector. Your account will be verified within 24-48 hours by our team.',
-  'What tools are available for NGOs?': 'NGOs can access: Multi-Stakeholder Forums for engagement, Best Practices library for case studies, Public Transparency Dashboard for funding data, Collaboration Tools for working with government, and the ability to submit project proposals and success stories.',
-  'How do I download reports?': 'Go to the Public Transparency Dashboard, click on the "Downloadable Reports" tab, and select the report you want. Available reports include annual budgets, quarterly transparency reports, SDG progress summaries, and state-wise funding distributions.'
-};
-
 export default function KnowledgeCenterPage() {
+  const [knowledgeData, setKnowledgeData] = useState<KnowledgeData | null>(null);
+  const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
   const [searchQuery, setSearchQuery] = useState('');
-  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
-  const [chatOpen, setChatOpen] = useState(false);
-  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([
-    { type: 'bot', text: 'Hello! I\'m your SDG Platform AI Assistant. How can I help you today?' }
-  ]);
-  const [chatInput, setChatInput] = useState('');
+  const [selectedCategory, setSelectedCategory] = useState('all');
+  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
+  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
 
-  // Filter FAQs based on search query
-  const filteredCategories = faqCategories.map(category => ({
-    ...category,
-    faqs: category.faqs.filter(faq =>
-      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
-      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
-    )
-  })).filter(category => category.faqs.length > 0);
+  useEffect(() => {
+    fetchKnowledgeData();
+  }, []);
 
-  const toggleFaq = (categoryId: string, faqIndex: number) => {
-    const faqId = `${categoryId}-${faqIndex}`;
-    setExpandedFaq(expandedFaq === faqId ? null : faqId);
+  const fetchKnowledgeData = async () => {
+    setLoading(true);
+    setError('');
+
+    try {
+      const response = await fetch('/api/knowledge-center');
+      const data = await response.json();
+
+      if (data.success) {
+        setKnowledgeData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch knowledge center data');
+      }
+    } catch (err) {
+      setError('Failed to load knowledge center data. Please try again.');
+      console.error('Knowledge center data error:', err);
+    } finally {
+      setLoading(false);
+    }
   };
 
-  const handleSendMessage = () => {
-    if (!chatInput.trim()) return;
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchKnowledgeData();
+    setRefreshing(false);
+  };
 
-    // Add user message
-    const userMessage = { type: 'user' as const, text: chatInput };
-    setChatMessages(prev => [...prev, userMessage]);
+  const enrollInCourse = async (courseId: number) => {
+    try {
+      const response = await fetch('/api/knowledge-center/enroll', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify({
+          courseId,
+          userId: 'current-user-id',
+          userName: 'Current User',
+          userEmail: 'user@example.com',
+        }),
+      });
 
-    // Get bot response
-    const response = chatbotResponses[chatInput] || 
-      'Thank you for your question! For detailed assistance, please check our FAQ section or contact support@sdgcommittee.gov.in. I\'m continuously learning to provide better answers!';
-    
-    setTimeout(() => {
-      setChatMessages(prev => [...prev, { type: 'bot', text: response }]);
-    }, 500);
+      const data = await response.json();
 
-    setChatInput('');
+      if (data.success) {
+        alert('Successfully enrolled in course!');
+        setShowEnrollDialog(false);
+      } else {
+        alert(data.error || 'Failed to enroll');
+      }
+    } catch (err) {
+      alert('Failed to enroll in course');
+      console.error('Enrollment error:', err);
+    }
   };
 
-  const handlePredefinedQuestion = (question: string) => {
-    setChatInput(question);
-    handleSendMessage();
+  const exportData = () => {
+    if (!knowledgeData) return;
+
+    const report = JSON.stringify(knowledgeData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `knowledge-center-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
   };
 
+  const formatDate = (dateString: string) => {
+    return new Date(dateString).toLocaleDateString('en-US', {
+      year: 'numeric',
+      month: 'short',
+      day: 'numeric',
+    });
+  };
+
+  const getLevelBadge = (level: string) => {
+    if (level === 'Beginner') return <Badge variant="secondary">Beginner</Badge>;
+    if (level === 'Intermediate') return <Badge variant="default">Intermediate</Badge>;
+    if (level === 'Advanced') return <Badge className="bg-purple-500">Advanced</Badge>;
+    return <Badge variant="outline">{level}</Badge>;
+  };
+
+  const getStatusBadge = (status: string) => {
+    if (status === 'upcoming') return <Badge className="bg-blue-500">Upcoming</Badge>;
+    if (status === 'completed') return <Badge variant="secondary">Completed</Badge>;
+    if (status === 'live') return <Badge className="bg-red-500">Live</Badge>;
+    return <Badge variant="outline">{status}</Badge>;
+  };
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading knowledge center...</p>
+        </div>
+      </div>
+    );
+  }
+
+  if (error || !knowledgeData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchKnowledgeData} className="mt-4">
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
-      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
-        <div className="absolute inset-0 bg-black/10"></div>
-        <div className="container mx-auto px-4 relative z-10">
-          <div className="max-w-3xl">
-            <div className="flex items-center gap-2 mb-4">
-              <BookOpen className="h-8 w-8" />
-              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
-                Learning Hub
-              </Badge>
-            </div>
-            <h1 className="text-4xl md:text-5xl font-bold mb-4">
-              Knowledge & Learning Center
-            </h1>
-            <p className="text-xl text-blue-100 mb-6">
-              Access comprehensive resources, training materials, and expert guidance for SDG implementation. Get answers to your questions with our AI-powered chatbot.
-            </p>
-            <div className="flex flex-wrap gap-3">
-              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
-                <Video className="mr-2 h-5 w-5" />
-                Watch Tutorials
-              </Button>
-              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
-                <Download className="mr-2 h-5 w-5" />
-                Download Resources
-              </Button>
-            </div>
-          </div>
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">Knowledge & Learning Center</h1>
+          <p className="text-muted-foreground">
+            Comprehensive resources for SDG policy implementation
+          </p>
         </div>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
+            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
+            Refresh
+          </Button>
+          <Button onClick={exportData}>
+            <Download className="mr-2 h-4 w-4" />
+            Export
+          </Button>
+        </div>
       </div>
 
-      {/* Main Content */}
-      <div className="container mx-auto px-4 py-12">
-        {/* FAQ Section */}
-        <div className="mb-16">
-          <div className="text-center mb-8">
-            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
-            <p className="text-muted-foreground text-lg">
-              Find answers to common questions about the SDG Committee Platform
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-4">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
+            <BookOpen className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{knowledgeData.overview.totalResources.toLocaleString()}</div>
+            <p className="text-xs text-muted-foreground">
+              {knowledgeData.overview.courses} courses • {knowledgeData.overview.articles} articles
             </p>
-          </div>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
+            <Users className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{knowledgeData.overview.activeUsers.toLocaleString()}</div>
+            <p className="text-xs text-muted-foreground">
+              {knowledgeData.overview.completionRate}% completion rate
+            </p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Video Library</CardTitle>
+            <Video className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{knowledgeData.overview.videos}</div>
+            <p className="text-xs text-muted-foreground">
+              {knowledgeData.overview.webinars} webinars available
+            </p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
+            <FileText className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{knowledgeData.overview.researchPapers}</div>
+            <p className="text-xs text-muted-foreground">Peer-reviewed publications</p>
+          </CardContent>
+        </Card>
+      </div>
 
-          {/* Search Bar */}
-          <div className="max-w-2xl mx-auto mb-8">
-            <div className="relative">
-              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
+      {/* Search and Filter */}
+      <Card>
+        <CardContent className="pt-6">
+          <div className="flex flex-col md:flex-row gap-4">
+            <div className="flex-1 relative">
+              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
-                type="text"
-                placeholder="Search FAQs..."
+                placeholder="Search courses, articles, videos..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
-                className="pl-10 h-12 text-lg"
+                className="pl-10"
               />
             </div>
+            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
+              <SelectTrigger className="w-full md:w-[250px]">
+                <Filter className="mr-2 h-4 w-4" />
+                <SelectValue placeholder="All Categories" />
+              </SelectTrigger>
+              <SelectContent>
+                <SelectItem value="all">All Categories</SelectItem>
+                {knowledgeData.categories.map((category, index) => (
+                  <SelectItem key={index} value={category.name.toLowerCase()}>
+                    {category.name} ({category.count})
+                  </SelectItem>
+                ))}
+              </SelectContent>
+            </Select>
           </div>
+        </CardContent>
+      </Card>
 
-          {/* FAQ Categories */}
-          <Tabs defaultValue="general" className="w-full">
-            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
-              {faqCategories.map((category) => {
-                const Icon = category.icon;
-                return (
-                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
-                    <Icon className={`h-4 w-4 ${category.color}`} />
-                    <span className="hidden sm:inline">{category.name}</span>
-                  </TabsTrigger>
-                );
-              })}
-            </TabsList>
+      {/* Main Content */}
+      <Tabs defaultValue="courses" className="w-full">
+        <TabsList>
+          <TabsTrigger value="courses">Courses</TabsTrigger>
+          <TabsTrigger value="articles">Articles</TabsTrigger>
+          <TabsTrigger value="videos">Videos</TabsTrigger>
+          <TabsTrigger value="webinars">Webinars</TabsTrigger>
+          <TabsTrigger value="research">Research</TabsTrigger>
+        </TabsList>
 
-            {faqCategories.map((category) => (
-              <TabsContent key={category.id} value={category.id}>
-                <div className="space-y-3">
-                  {(searchQuery ? filteredCategories.find(c => c.id === category.id)?.faqs : category.faqs)?.map((faq, index) => {
-                    const faqId = `${category.id}-${index}`;
-                    const isExpanded = expandedFaq === faqId;
-                    
-                    return (
-                      <Card key={index} className="hover:shadow-md transition-shadow">
-                        <CardHeader 
-                          className="cursor-pointer"
-                          onClick={() => toggleFaq(category.id, index)}
-                        >
-                          <div className="flex items-start justify-between">
-                            <CardTitle className="text-lg flex items-start gap-3">
-                              <HelpCircle className={`h-5 w-5 mt-1 ${category.color} flex-shrink-0`} />
-                              <span>{faq.question}</span>
-                            </CardTitle>
-                            {isExpanded ? (
-                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
-                            ) : (
-                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
-                            )}
+        {/* Courses Tab */}
+        <TabsContent value="courses" className="mt-6">
+          <div className="grid gap-6 md:grid-cols-2">
+            {knowledgeData.featuredCourses.map((course) => (
+              <Card key={course.id} className="hover:shadow-lg transition-shadow">
+                <CardHeader>
+                  <div className="flex items-start justify-between mb-2">
+                    <div className="flex-1">
+                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
+                      <div className="flex items-center gap-2 mb-2">
+                        {getLevelBadge(course.level)}
+                        {course.certificate && (
+                          <Badge variant="outline" className="text-xs">
+                            <Award className="mr-1 h-3 w-3" />
+                            Certificate
+                          </Badge>
+                        )}
+                      </div>
+                    </div>
+                  </div>
+                  <CardDescription>{course.description}</CardDescription>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  {/* Instructor & Duration */}
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-2">
+                      <Users className="h-4 w-4 text-muted-foreground" />
+                      <span>{course.instructor}</span>
+                    </div>
+                    <div className="flex items-center gap-2">
+                      <Clock className="h-4 w-4 text-muted-foreground" />
+                      <span>{course.duration}</span>
+                    </div>
+                  </div>
+
+                  {/* Rating & Enrollment */}
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-2">
+                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
+                      <span className="font-medium">{course.rating}</span>
+                      <span className="text-muted-foreground">({course.reviews} reviews)</span>
+                    </div>
+                    <div className="flex items-center gap-2">
+                      <Users className="h-4 w-4 text-muted-foreground" />
+                      <span>{course.enrolled.toLocaleString()} enrolled</span>
+                    </div>
+                  </div>
+
+                  {/* Course Details */}
+                  <div className="grid grid-cols-2 gap-2 text-sm">
+                    <div>
+                      <span className="text-muted-foreground">Modules:</span>{' '}
+                      <span className="font-medium">{course.modules}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Hours:</span>{' '}
+                      <span className="font-medium">{course.hours}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Start:</span>{' '}
+                      <span className="font-medium">{formatDate(course.startDate)}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Price:</span>{' '}
+                      <span className="font-medium text-green-600">{course.price}</span>
+                    </div>
+                  </div>
+
+                  {/* SDGs */}
+                  <div className="flex flex-wrap gap-1">
+                    {course.sdgs.map((sdg, index) => (
+                      <Badge key={index} variant="secondary" className="text-xs">
+                        {sdg}
+                      </Badge>
+                    ))}
+                  </div>
+
+                  <Separator />
+
+                  {/* Actions */}
+                  <div className="flex gap-2">
+                    <Dialog>
+                      <DialogTrigger asChild>
+                        <Button className="flex-1" onClick={() => setSelectedCourse(course.id)}>
+                          <CheckCircle className="mr-2 h-4 w-4" />
+                          Enroll Now
+                        </Button>
+                      </DialogTrigger>
+                      <DialogContent>
+                        <DialogHeader>
+                          <DialogTitle>Enroll in {course.title}</DialogTitle>
+                          <DialogDescription>
+                            You're about to enroll in this course. You'll get access to all {course.modules} modules and earn a certificate upon completion.
+                          </DialogDescription>
+                        </DialogHeader>
+                        <div className="space-y-4 py-4">
+                          <div className="space-y-2">
+                            <p className="text-sm"><strong>Instructor:</strong> {course.instructor}</p>
+                            <p className="text-sm"><strong>Duration:</strong> {course.duration}</p>
+                            <p className="text-sm"><strong>Level:</strong> {course.level}</p>
+                            <p className="text-sm"><strong>Start Date:</strong> {formatDate(course.startDate)}</p>
                           </div>
-                        </CardHeader>
-                        {isExpanded && (
-                          <CardContent>
-                            <p className="text-muted-foreground leading-relaxed pl-8">
-                              {faq.answer}
-                            </p>
-                          </CardContent>
+                        </div>
+                        <DialogFooter>
+                          <Button variant="outline" onClick={() => setShowEnrollDialog(false)}>
+                            Cancel
+                          </Button>
+                          <Button onClick={() => enrollInCourse(course.id)}>
+                            Confirm Enrollment
+                          </Button>
+                        </DialogFooter>
+                      </DialogContent>
+                    </Dialog>
+                    <Button variant="outline" size="sm">
+                      <ExternalLink className="h-4 w-4" />
+                    </Button>
+                  </div>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Articles Tab */}
+        <TabsContent value="articles" className="mt-6">
+          <div className="space-y-4">
+            {knowledgeData.articles.map((article) => (
+              <Card key={article.id} className="hover:shadow-lg transition-shadow">
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-2 mb-2">
+                        <CardTitle className="text-lg">{article.title}</CardTitle>
+                        {article.featured && (
+                          <Badge className="bg-yellow-500">Featured</Badge>
                         )}
-                      </Card>
-                    );
-                  })}
-                </div>
-              </TabsContent>
+                      </div>
+                      <CardDescription>{article.excerpt}</CardDescription>
+                    </div>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-4">
+                      <span className="font-medium">{article.author}</span>
+                      <Badge variant="outline">{article.category}</Badge>
+                      <div className="flex items-center gap-1 text-muted-foreground">
+                        <Clock className="h-4 w-4" />
+                        <span>{article.readTime} min read</span>
+                      </div>
+                    </div>
+                    <span className="text-muted-foreground">{formatDate(article.publishedDate)}</span>
+                  </div>
+
+                  <div className="flex items-center justify-between">
+                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
+                      <div className="flex items-center gap-1">
+                        <Eye className="h-4 w-4" />
+                        <span>{article.views.toLocaleString()}</span>
+                      </div>
+                      <div className="flex items-center gap-1">
+                        <ThumbsUp className="h-4 w-4" />
+                        <span>{article.likes}</span>
+                      </div>
+                    </div>
+                    <div className="flex flex-wrap gap-1">
+                      {article.sdgs.map((sdg, index) => (
+                        <Badge key={index} variant="secondary" className="text-xs">
+                          {sdg}
+                        </Badge>
+                      ))}
+                    </div>
+                  </div>
+
+                  <Button variant="outline" className="w-full">
+                    <BookOpen className="mr-2 h-4 w-4" />
+                    Read Article
+                  </Button>
+                </CardContent>
+              </Card>
             ))}
-          </Tabs>
+          </div>
+        </TabsContent>
 
-          {searchQuery && filteredCategories.length === 0 && (
-            <div className="text-center py-12">
-              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
-              <h3 className="text-xl font-semibold mb-2">No results found</h3>
-              <p className="text-muted-foreground">
-                Try different keywords or ask our AI chatbot for help
-              </p>
-            </div>
-          )}
-        </div>
+        {/* Videos Tab */}
+        <TabsContent value="videos" className="mt-6">
+          <div className="grid gap-6 md:grid-cols-2">
+            {knowledgeData.videos.map((video) => (
+              <Card key={video.id} className="hover:shadow-lg transition-shadow">
+                <CardHeader>
+                  <div className="flex items-start justify-between mb-2">
+                    <CardTitle className="text-lg">{video.title}</CardTitle>
+                    <Badge variant="outline">{video.category}</Badge>
+                  </div>
+                  <CardDescription>{video.description}</CardDescription>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-2">
+                      <Users className="h-4 w-4 text-muted-foreground" />
+                      <span>{video.presenter}</span>
+                    </div>
+                    <div className="flex items-center gap-2">
+                      <Clock className="h-4 w-4 text-muted-foreground" />
+                      <span>{video.duration}</span>
+                    </div>
+                  </div>
 
-        {/* Existing Resources Section */}
-        <div className="grid md:grid-cols-2 gap-6 mb-12">
-          <Card className="hover:shadow-lg transition-shadow">
-            <CardHeader>
-              <div className="flex items-center gap-3 mb-2">
-                <div className="p-2 bg-blue-100 rounded-lg">
-                  <Calendar className="h-6 w-6 text-blue-600" />
-                </div>
-                <CardTitle>Upcoming Events & Webinars</CardTitle>
-              </div>
-              <CardDescription>
-                Join live sessions with experts and policymakers
-              </CardDescription>
-            </CardHeader>
-            <CardContent>
-              <div className="space-y-4">
-                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
-                  <Calendar className="h-5 w-5 text-blue-600 mt-1" />
-                  <div className="flex-1">
-                    <h4 className="font-semibold mb-1">SDG Implementation Workshop</h4>
-                    <p className="text-sm text-muted-foreground mb-2">December 15, 2025 • 2:00 PM IST</p>
-                    <Badge variant="secondary">Register Now</Badge>
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-4 text-muted-foreground">
+                      <div className="flex items-center gap-1">
+                        <Eye className="h-4 w-4" />
+                        <span>{video.views.toLocaleString()}</span>
+                      </div>
+                      <div className="flex items-center gap-1">
+                        <ThumbsUp className="h-4 w-4" />
+                        <span>{video.likes.toLocaleString()}</span>
+                      </div>
+                    </div>
+                    <span className="text-muted-foreground">{formatDate(video.publishedDate)}</span>
                   </div>
-                </div>
-                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
-                  <Video className="h-5 w-5 text-purple-600 mt-1" />
-                  <div className="flex-1">
-                    <h4 className="font-semibold mb-1">AI Tools for Policy Analysis</h4>
-                    <p className="text-sm text-muted-foreground mb-2">December 20, 2025 • 3:00 PM IST</p>
-                    <Badge variant="secondary">Register Now</Badge>
+
+                  <div className="flex flex-wrap gap-1">
+                    {video.sdgs.map((sdg, index) => (
+                      <Badge key={index} variant="secondary" className="text-xs">
+                        {sdg}
+                      </Badge>
+                    ))}
                   </div>
-                </div>
-              </div>
-              <Button variant="outline" className="w-full mt-4">
-                View All Events
-              </Button>
-            </CardContent>
-          </Card>
 
-          <Card className="hover:shadow-lg transition-shadow">
-            <CardHeader>
-              <div className="flex items-center gap-3 mb-2">
-                <div className="p-2 bg-green-100 rounded-lg">
-                  <FileText className="h-6 w-6 text-green-600" />
-                </div>
-                <CardTitle>Resource Library</CardTitle>
-              </div>
-              <CardDescription>
-                Download guides, templates, and reports
-              </CardDescription>
-            </CardHeader>
-            <CardContent>
-              <div className="space-y-3">
-                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer">
-                  <div className="flex items-center gap-3">
-                    <FileText className="h-5 w-5 text-green-600" />
-                    <div>
-                      <p className="font-medium">SDG Implementation Guide</p>
-                      <p className="text-sm text-muted-foreground">PDF • 2.5 MB</p>
+                  <Button className="w-full">
+                    <Play className="mr-2 h-4 w-4" />
+                    Watch Video
+                  </Button>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Webinars Tab */}
+        <TabsContent value="webinars" className="mt-6">
+          <div className="space-y-4">
+            {knowledgeData.webinars.map((webinar) => (
+              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-2 mb-2">
+                        <CardTitle className="text-lg">{webinar.title}</CardTitle>
+                        {getStatusBadge(webinar.status)}
+                      </div>
+                      <CardDescription>{webinar.description}</CardDescription>
                     </div>
                   </div>
-                  <Download className="h-5 w-5 text-muted-foreground" />
-                </div>
-                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer">
-                  <div className="flex items-center gap-3">
-                    <FileText className="h-5 w-5 text-blue-600" />
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
-                      <p className="font-medium">Policy Analysis Templates</p>
-                      <p className="text-sm text-muted-foreground">Excel • 1.8 MB</p>
+                      <span className="text-muted-foreground">Host:</span>{' '}
+                      <span className="font-medium">{webinar.host}</span>
                     </div>
-                  </div>
-                  <Download className="h-5 w-5 text-muted-foreground" />
-                </div>
-                <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer">
-                  <div className="flex items-center gap-3">
-                    <FileText className="h-5 w-5 text-purple-600" />
                     <div>
-                      <p className="font-medium">Best Practices Handbook</p>
-                      <p className="text-sm text-muted-foreground">PDF • 3.2 MB</p>
+                      <span className="text-muted-foreground">Duration:</span>{' '}
+                      <span className="font-medium">{webinar.duration}</span>
                     </div>
+                    <div>
+                      <span className="text-muted-foreground">Date:</span>{' '}
+                      <span className="font-medium">{formatDate(webinar.date)}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Time:</span>{' '}
+                      <span className="font-medium">{webinar.time}</span>
+                    </div>
                   </div>
-                  <Download className="h-5 w-5 text-muted-foreground" />
-                </div>
-              </div>
-              <Button variant="outline" className="w-full mt-4">
-                Browse All Resources
-              </Button>
-            </CardContent>
-          </Card>
-        </div>
 
-        {/* Quick Links */}
-        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
-          <CardHeader>
-            <CardTitle className="flex items-center gap-2">
-              <Sparkles className="h-5 w-5 text-blue-600" />
-              Need More Help?
-            </CardTitle>
-            <CardDescription>
-              Explore additional resources and support options
-            </CardDescription>
-          </CardHeader>
-          <CardContent>
-            <div className="grid md:grid-cols-3 gap-4">
-              <Link to="/best-practices">
-                <Button variant="outline" className="w-full justify-start">
-                  <BookOpen className="mr-2 h-4 w-4" />
-                  Best Practices
-                </Button>
-              </Link>
-              <Link to="/international">
-                <Button variant="outline" className="w-full justify-start">
-                  <ExternalLink className="mr-2 h-4 w-4" />
-                  International Cooperation
-                </Button>
-              </Link>
-              <Link to="/multi-stakeholder">
-                <Button variant="outline" className="w-full justify-start">
-                  <Users className="mr-2 h-4 w-4" />
-                  Multi-Stakeholder Portal
-                </Button>
-              </Link>
-            </div>
-          </CardContent>
-        </Card>
-      </div>
+                  <div>
+                    <p className="text-sm text-muted-foreground mb-2">Speakers:</p>
+                    <div className="flex flex-wrap gap-2">
+                      {webinar.speakers.map((speaker, index) => (
+                        <Badge key={index} variant="outline">
+                          {speaker}
+                        </Badge>
+                      ))}
+                    </div>
+                  </div>
 
-      {/* AI Chatbot Widget */}
-      {!chatOpen && (
-        <button
-          onClick={() => setChatOpen(true)}
-          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
-        >
-          <MessageCircle className="h-6 w-6" />
-        </button>
-      )}
+                  <div className="flex items-center justify-between text-sm">
+                    <div className="flex items-center gap-2">
+                      <Users className="h-4 w-4 text-muted-foreground" />
+                      <span>{webinar.registered.toLocaleString()} / {webinar.capacity.toLocaleString()} registered</span>
+                    </div>
+                    <div className="flex flex-wrap gap-1">
+                      {webinar.sdgs.map((sdg, index) => (
+                        <Badge key={index} variant="secondary" className="text-xs">
+                          {sdg}
+                        </Badge>
+                      ))}
+                    </div>
+                  </div>
 
-      {chatOpen && (
-        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
-          {/* Chat Header */}
-          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
-            <div className="flex items-center gap-3">
-              <div className="p-2 bg-white/20 rounded-full">
-                <Bot className="h-5 w-5" />
-              </div>
-              <div>
-                <h3 className="font-semibold">AI Assistant</h3>
-                <p className="text-xs text-blue-100">Always here to help</p>
-              </div>
-            </div>
-            <button
-              onClick={() => setChatOpen(false)}
-              className="p-1 hover:bg-white/20 rounded-full transition-colors"
-            >
-              <X className="h-5 w-5" />
-            </button>
-          </div>
-
-          {/* Chat Messages */}
-          <div className="flex-1 overflow-y-auto p-4 space-y-4">
-            {chatMessages.map((message, index) => (
-              <div
-                key={index}
-                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
-              >
-                <div
-                  className={`max-w-[80%] p-3 rounded-lg ${
-                    message.type === 'user'
-                      ? 'bg-blue-600 text-white'
-                      : 'bg-gray-100 text-gray-900'
-                  }`}
-                >
-                  <p className="text-sm">{message.text}</p>
-                </div>
-              </div>
+                  {webinar.status === 'upcoming' && (
+                    <Button className="w-full">
+                      <Calendar className="mr-2 h-4 w-4" />
+                      Register Now
+                    </Button>
+                  )}
+                  {webinar.status === 'completed' && (
+                    <Button variant="outline" className="w-full">
+                      <Play className="mr-2 h-4 w-4" />
+                      Watch Recording
+                    </Button>
+                  )}
+                </CardContent>
+              </Card>
             ))}
           </div>
+        </TabsContent>
 
-          {/* Predefined Questions */}
-          {chatMessages.length === 1 && (
-            <div className="p-4 border-t border-gray-200 bg-gray-50">
-              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
-              <div className="space-y-2">
-                {predefinedQuestions.slice(0, 3).map((question, index) => (
-                  <button
-                    key={index}
-                    onClick={() => handlePredefinedQuestion(question)}
-                    className="w-full text-left text-sm p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
-                  >
-                    {question}
-                  </button>
-                ))}
-              </div>
-            </div>
-          )}
+        {/* Research Tab */}
+        <TabsContent value="research" className="mt-6">
+          <div className="space-y-4">
+            {knowledgeData.researchPapers.map((paper) => (
+              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <CardTitle className="text-lg mb-2">{paper.title}</CardTitle>
+                      <CardDescription>{paper.abstract}</CardDescription>
+                    </div>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  <div className="grid grid-cols-2 gap-4 text-sm">
+                    <div>
+                      <span className="text-muted-foreground">Authors:</span>{' '}
+                      <span className="font-medium">{paper.authors.join(', ')}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Institution:</span>{' '}
+                      <span className="font-medium">{paper.institution}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Published:</span>{' '}
+                      <span className="font-medium">{formatDate(paper.publishedDate)}</span>
+                    </div>
+                    <div>
+                      <span className="text-muted-foreground">Pages:</span>{' '}
+                      <span className="font-medium">{paper.pages}</span>
+                    </div>
+                  </div>
 
-          {/* Chat Input */}
-          <div className="p-4 border-t border-gray-200">
-            <div className="flex gap-2">
-              <Input
-                type="text"
-                placeholder="Type your question..."
-                value={chatInput}
-                onChange={(e) => setChatInput(e.target.value)}
-                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
-                className="flex-1"
-              />
-              <Button
-                onClick={handleSendMessage}
-                size="icon"
-                className="bg-gradient-to-r from-blue-600 to-purple-600"
-              >
-                <Send className="h-4 w-4" />
-              </Button>
-            </div>
+                  <div className="flex items-center justify-between">
+                    <div className="flex items-center gap-4">
+                      <Badge variant="outline">{paper.category}</Badge>
+                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
+                        <TrendingUp className="h-4 w-4" />
+                        <span>{paper.citations} citations</span>
+                      </div>
+                    </div>
+                    <div className="flex flex-wrap gap-1">
+                      {paper.sdgs.map((sdg, index) => (
+                        <Badge key={index} variant="secondary" className="text-xs">
+                          {sdg}
+                        </Badge>
+                      ))}
+                    </div>
+                  </div>
+
+                  <Button variant="outline" className="w-full">
+                    <Download className="mr-2 h-4 w-4" />
+                    Download PDF
+                  </Button>
+                </CardContent>
+              </Card>
+            ))}
           </div>
-        </div>
-      )}
+        </TabsContent>
+      </Tabs>
     </div>
   );
 }
