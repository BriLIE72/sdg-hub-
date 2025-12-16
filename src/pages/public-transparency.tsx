-import { useState } from 'react';
+import { useState, useEffect } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
-import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
+import { Progress } from '@/components/ui/progress';
 import { Input } from '@/components/ui/input';
+import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
-import { Progress } from '@/components/ui/progress';
-import { 
-  MessageSquare, 
-  ThumbsUp, 
-  ThumbsDown, 
-  Smile, 
-  Frown, 
-  Meh,
-  TrendingUp,
-  TrendingDown,
-  BarChart3,
-  PieChart,
-  Twitter,
-  Facebook,
-  Instagram,
-  Youtube,
-  Send,
-  Filter,
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
+  AlertCircle,
   Download,
-  Calendar,
-  MapPin,
+  RefreshCw,
+  Database,
+  DollarSign,
+  FileText,
   Users,
-  Target,
-  AlertCircle,
-  CheckCircle2,
-  Clock,
+  TrendingUp,
+  Calendar,
+  Eye,
   Star,
-  Activity
+  MessageSquare,
+  ThumbsUp,
+  CheckCircle,
+  Clock,
+  AlertTriangle,
+  Plus,
+  Search,
+  Filter,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-// Sentiment data
-const sentimentOverview = {
-  total: 45280,
-  positive: 28650,
-  neutral: 12420,
-  negative: 4210,
-  positivePercent: 63,
-  neutralPercent: 27,
-  negativePercent: 10
-};
+interface TransparencyData {
+  overview: {
+    totalPolicies: number;
+    publicDocuments: number;
+    budgetDisclosed: number;
+    citizenReports: number;
+    lastUpdated: string;
+  };
+  openData: Array<{
+    id: number;
+    category: string;
+    title: string;
+    description: string;
+    format: string;
+    size: string;
+    downloads: number;
+    lastUpdated: string;
+    url: string;
+    views: number;
+    rating: number;
+  }>;
+  budgetTransparency: {
+    totalBudget: number;
+    allocated: number;
+    spent: number;
+    remaining: number;
+    utilizationRate: number;
+    byMinistry: Array<{
+      ministry: string;
+      budget: number;
+      spent: number;
+      percentage: number;
+    }>;
+    bySDG: Array<{
+      sdg: string;
+      budget: number;
+      spent: number;
+    }>;
+  };
+  citizenFeedback: Array<{
+    id: number;
+    category: string;
+    title: string;
+    description: string;
+    status: string;
+    priority: string;
+    submittedBy: string;
+    submittedDate: string;
+    votes: number;
+    responses: number;
+    ministry: string;
+    resolution?: string;
+  }>;
+  performanceMetrics: Array<{
+    ministry: string;
+    kpis: Array<{
+      name: string;
+      target: number;
+      current: number;
+      unit: string;
+    }>;
+    overallProgress: number;
+  }>;
+  publicReports: Array<{
+    id: number;
+    title: string;
+    description: string;
+    category: string;
+    publishDate: string;
+    pages: number;
+    downloads: number;
+    url: string;
+  }>;
+  upcomingEvents: Array<{
+    id: number;
+    title: string;
+    description: string;
+    date: string;
+    time: string;
+    location: string;
+    registrations: number;
+    capacity: number;
+  }>;
+  insights: Array<{
+    type: string;
+    title: string;
+    description: string;
+    priority: string;
+  }>;
+}
 
-// Social media sentiment
-const socialMediaSentiment = [
-  { platform: 'Twitter', icon: Twitter, total: 18500, positive: 11200, neutral: 5800, negative: 1500, sentiment: 'Positive', color: 'text-blue-500' },
-  { platform: 'Facebook', icon: Facebook, total: 15200, positive: 9800, neutral: 4200, negative: 1200, sentiment: 'Positive', color: 'text-blue-600' },
-  { platform: 'Instagram', icon: Instagram, total: 8400, positive: 5900, neutral: 1900, negative: 600, sentiment: 'Very Positive', color: 'text-pink-500' },
-  { platform: 'YouTube', icon: Youtube, total: 3180, positive: 1750, neutral: 1520, negative: 910, sentiment: 'Neutral', color: 'text-red-600' }
-];
+export default function CitizenFeedbackPage() {
+  const [transparencyData, setTransparencyData] = useState<TransparencyData | null>(null);
+  const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
+  const [searchQuery, setSearchQuery] = useState('');
+  const [selectedCategory, setSelectedCategory] = useState('all');
+  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
+  const [feedbackForm, setFeedbackForm] = useState({
+    category: '',
+    title: '',
+    description: '',
+    priority: 'medium',
+    submittedBy: '',
+  });
 
-// Trending topics
-const trendingTopics = [
-  { topic: 'Clean Water Access', mentions: 8420, sentiment: 'positive', change: '+12%', sdg: 'SDG 6' },
-  { topic: 'Quality Education', mentions: 7250, sentiment: 'positive', change: '+8%', sdg: 'SDG 4' },
-  { topic: 'Healthcare Services', mentions: 6890, sentiment: 'neutral', change: '+5%', sdg: 'SDG 3' },
-  { topic: 'Employment Opportunities', mentions: 5640, sentiment: 'negative', change: '-3%', sdg: 'SDG 8' },
-  { topic: 'Climate Action', mentions: 4920, sentiment: 'positive', change: '+15%', sdg: 'SDG 13' }
-];
+  useEffect(() => {
+    fetchTransparencyData();
+  }, []);
 
-// Recent feedback
-const recentFeedback = [
-  {
-    id: 1,
-    author: 'Rajesh Kumar',
-    location: 'Mumbai, Maharashtra',
-    sdg: 'SDG 6',
-    sentiment: 'positive',
-    rating: 5,
-    comment: 'The new water supply project in our area has been excellent. Clean water 24/7 now!',
-    time: '2 hours ago',
-    source: 'Survey'
-  },
-  {
-    id: 2,
-    author: 'Priya Sharma',
-    location: 'Bangalore, Karnataka',
-    sdg: 'SDG 4',
-    sentiment: 'positive',
-    rating: 4,
-    comment: 'Digital education initiative is helping my children learn better. Great progress!',
-    time: '5 hours ago',
-    source: 'Twitter'
-  },
-  {
-    id: 3,
-    author: 'Amit Patel',
-    location: 'Ahmedabad, Gujarat',
-    sdg: 'SDG 8',
-    sentiment: 'negative',
-    rating: 2,
-    comment: 'Still waiting for promised job training programs. Need more focus on employment.',
-    time: '1 day ago',
-    source: 'Facebook'
-  },
-  {
-    id: 4,
-    author: 'Lakshmi Iyer',
-    location: 'Chennai, Tamil Nadu',
-    sdg: 'SDG 3',
-    sentiment: 'neutral',
-    rating: 3,
-    comment: 'Healthcare facilities improved but waiting times are still long. More staff needed.',
-    time: '1 day ago',
-    source: 'Survey'
-  },
-  {
-    id: 5,
-    author: 'Mohammed Ali',
-    location: 'Hyderabad, Telangana',
-    sdg: 'SDG 13',
-    sentiment: 'positive',
-    rating: 5,
-    comment: 'Solar panel installation program is fantastic. Reduced electricity bills significantly!',
-    time: '2 days ago',
-    source: 'Instagram'
-  }
-];
+  const fetchTransparencyData = async () => {
+    setLoading(true);
+    setError('');
 
-// SDG feedback summary
-const sdgFeedback = [
-  { sdg: 'SDG 1', name: 'No Poverty', feedback: 4250, positive: 68, neutral: 24, negative: 8 },
-  { sdg: 'SDG 2', name: 'Zero Hunger', feedback: 3890, positive: 62, neutral: 28, negative: 10 },
-  { sdg: 'SDG 3', name: 'Good Health', feedback: 6890, positive: 58, neutral: 32, negative: 10 },
-  { sdg: 'SDG 4', name: 'Quality Education', feedback: 7250, positive: 72, neutral: 20, negative: 8 },
-  { sdg: 'SDG 5', name: 'Gender Equality', feedback: 3420, positive: 65, neutral: 25, negative: 10 },
-  { sdg: 'SDG 6', name: 'Clean Water', feedback: 8420, positive: 78, neutral: 18, negative: 4 },
-  { sdg: 'SDG 7', name: 'Clean Energy', feedback: 4920, positive: 75, neutral: 20, negative: 5 },
-  { sdg: 'SDG 8', name: 'Economic Growth', feedback: 5640, positive: 45, neutral: 35, negative: 20 }
-];
+    try {
+      const response = await fetch('/api/public-transparency');
+      const data = await response.json();
 
-export default function CitizenFeedbackPage() {
-  const [feedbackText, setFeedbackText] = useState('');
-  const [selectedSDG, setSelectedSDG] = useState('');
-
-  const getSentimentIcon = (sentiment: string) => {
-    switch (sentiment) {
-      case 'positive':
-        return <Smile className="h-5 w-5 text-green-600" />;
-      case 'negative':
-        return <Frown className="h-5 w-5 text-red-600" />;
-      default:
-        return <Meh className="h-5 w-5 text-yellow-600" />;
+      if (data.success) {
+        setTransparencyData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch transparency data');
+      }
+    } catch (err) {
+      setError('Failed to load transparency data. Please try again.');
+      console.error('Transparency data error:', err);
+    } finally {
+      setLoading(false);
     }
   };
 
-  const getSentimentBadge = (sentiment: string) => {
-    switch (sentiment) {
-      case 'positive':
-        return <Badge className="bg-green-100 text-green-800">Positive</Badge>;
-      case 'negative':
-        return <Badge className="bg-red-100 text-red-800">Negative</Badge>;
-      default:
-        return <Badge className="bg-yellow-100 text-yellow-800">Neutral</Badge>;
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchTransparencyData();
+    setRefreshing(false);
+  };
+
+  const submitFeedback = async () => {
+    if (!feedbackForm.category || !feedbackForm.title || !feedbackForm.description) {
+      alert('Please fill in all required fields');
+      return;
     }
+
+    try {
+      const response = await fetch('/api/public-transparency/feedback', {
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
+          category: '',
+          title: '',
+          description: '',
+          priority: 'medium',
+          submittedBy: '',
+        });
+        refreshData();
+      } else {
+        alert(data.error || 'Failed to submit feedback');
+      }
+    } catch (err) {
+      alert('Failed to submit feedback');
+      console.error('Feedback error:', err);
+    }
   };
 
+  const downloadData = (url: string, title: string) => {
+    alert(`Downloading: ${title}\nURL: ${url}`);
+    // In production, trigger actual download
+  };
+
+  const exportReport = () => {
+    if (!transparencyData) return;
+
+    const report = JSON.stringify(transparencyData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `transparency-report-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
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
+  const getStatusBadge = (status: string) => {
+    if (status === 'resolved') return <Badge className="bg-green-500">Resolved</Badge>;
+    if (status === 'in-progress') return <Badge className="bg-blue-500">In Progress</Badge>;
+    if (status === 'under-review') return <Badge className="bg-yellow-500">Under Review</Badge>;
+    return <Badge variant="secondary">{status}</Badge>;
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
+    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
+    if (type === 'opportunity') return <TrendingUp className="h-5 w-5 text-blue-600" />;
+    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
+    return <AlertCircle className="h-5 w-5 text-red-600" />;
+  };
+
+  const getInsightBg = (type: string) => {
+    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
+    if (type === 'opportunity') return 'bg-blue-50 dark:bg-blue-950';
+    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
+    return 'bg-red-50 dark:bg-red-950';
+  };
+
+  const filteredOpenData = transparencyData?.openData.filter((item) => {
+    const matchesSearch =
+      searchQuery === '' ||
+      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
+      item.description.toLowerCase().includes(searchQuery.toLowerCase());
+    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
+    return matchesSearch && matchesCategory;
+  });
+
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading transparency data...</p>
+        </div>
+      </div>
+    );
+  }
+
+  if (error || !transparencyData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchTransparencyData} className="mt-4">
+            Try Again
+          </Button>
+        </Alert>
+      </div>
+    );
+  }
+
   return (
-    <div className="min-h-screen bg-background">
-      {/* Hero Section */}
-      <section className="relative bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-900 text-white py-20">
-        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80" />
-        <img 
-          src="https://media.gettyimages.com/id/2216097217/photo/crowd-of-diverse-individuals-gathered-in-a-creative-arrangement-during-a-public-event-in-an.jpg?b=1&s=2048x2048&w=0&k=20&c=cFq6Vv-yEh_fwCu3s9R8X8f_rYosedVimPFNhJ8Knk4=" 
-          alt="Citizen feedback" 
-          className="absolute inset-0 w-full h-full object-cover opacity-20"
-        />
-        <div className="container mx-auto px-4 relative z-10">
-          <div className="max-w-4xl">
-            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
-              AI-Powered Sentiment Analysis
-            </Badge>
-            <h1 className="text-5xl font-bold mb-6">
-              Citizen Feedback & Sentiment Analysis
-            </h1>
-            <p className="text-xl text-cyan-100 mb-8 max-w-2xl">
-              Real-time sentiment analysis from surveys and social media. Your voice matters in shaping India's SDG progress. Share feedback and see how citizens feel about development initiatives.
-            </p>
-            <div className="flex gap-4">
-              <Button size="lg" className="bg-white text-cyan-900 hover:bg-cyan-50">
-                <MessageSquare className="mr-2 h-5 w-5" />
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">Public Transparency Portal</h1>
+          <p className="text-muted-foreground">
+            Open government data, budget transparency, and citizen engagement
+          </p>
+        </div>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
+            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
+            Refresh
+          </Button>
+          <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
+            <DialogTrigger asChild>
+              <Button variant="outline">
+                <Plus className="mr-2 h-4 w-4" />
                 Submit Feedback
               </Button>
-              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
-                <BarChart3 className="mr-2 h-5 w-5" />
-                View Analytics
-              </Button>
+            </DialogTrigger>
+            <DialogContent className="max-w-2xl">
+              <DialogHeader>
+                <DialogTitle>Submit Citizen Feedback</DialogTitle>
+                <DialogDescription>
+                  Report issues, suggest improvements, or share your concerns
+                </DialogDescription>
+              </DialogHeader>
+              <div className="space-y-4 py-4">
+                <div className="space-y-2">
+                  <Label htmlFor="category">Category</Label>
+                  <Select
+                    value={feedbackForm.category}
+                    onValueChange={(value) =>
+                      setFeedbackForm({ ...feedbackForm, category: value })
+                    }
+                  >
+                    <SelectTrigger id="category">
+                      <SelectValue placeholder="Select category" />
+                    </SelectTrigger>
+                    <SelectContent>
+                      <SelectItem value="Healthcare">Healthcare</SelectItem>
+                      <SelectItem value="Education">Education</SelectItem>
+                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
+                      <SelectItem value="Environment">Environment</SelectItem>
+                      <SelectItem value="Social Welfare">Social Welfare</SelectItem>
+                      <SelectItem value="Other">Other</SelectItem>
+                    </SelectContent>
+                  </Select>
+                </div>
+                <div className="space-y-2">
+                  <Label htmlFor="title">Title</Label>
+                  <Input
+                    id="title"
+                    value={feedbackForm.title}
+                    onChange={(e) =>
+                      setFeedbackForm({ ...feedbackForm, title: e.target.value })
+                    }
+                    placeholder="Brief description of the issue"
+                  />
+                </div>
+                <div className="space-y-2">
+                  <Label htmlFor="description">Description</Label>
+                  <Textarea
+                    id="description"
+                    value={feedbackForm.description}
+                    onChange={(e) =>
+                      setFeedbackForm({ ...feedbackForm, description: e.target.value })
+                    }
+                    placeholder="Provide detailed information about your feedback"
+                    rows={4}
+                  />
+                </div>
+                <div className="space-y-2">
+                  <Label htmlFor="priority">Priority</Label>
+                  <Select
+                    value={feedbackForm.priority}
+                    onValueChange={(value) =>
+                      setFeedbackForm({ ...feedbackForm, priority: value })
+                    }
+                  >
+                    <SelectTrigger id="priority">
+                      <SelectValue />
+                    </SelectTrigger>
+                    <SelectContent>
+                      <SelectItem value="low">Low</SelectItem>
+                      <SelectItem value="medium">Medium</SelectItem>
+                      <SelectItem value="high">High</SelectItem>
+                      <SelectItem value="critical">Critical</SelectItem>
+                    </SelectContent>
+                  </Select>
+                </div>
+                <div className="space-y-2">
+                  <Label htmlFor="submittedBy">Your Name (Optional)</Label>
+                  <Input
+                    id="submittedBy"
+                    value={feedbackForm.submittedBy}
+                    onChange={(e) =>
+                      setFeedbackForm({ ...feedbackForm, submittedBy: e.target.value })
+                    }
+                    placeholder="Leave blank to submit anonymously"
+                  />
+                </div>
+              </div>
+              <DialogFooter>
+                <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
+                  Cancel
+                </Button>
+                <Button onClick={submitFeedback}>Submit Feedback</Button>
+              </DialogFooter>
+            </DialogContent>
+          </Dialog>
+          <Button onClick={exportReport}>
+            <Download className="mr-2 h-4 w-4" />
+            Export
+          </Button>
+        </div>
+      </div>
+
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-4">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Public Documents</CardTitle>
+            <FileText className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{transparencyData.overview.publicDocuments.toLocaleString()}</div>
+            <p className="text-xs text-muted-foreground">Available for download</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Budget Disclosed</CardTitle>
+            <DollarSign className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{transparencyData.overview.budgetDisclosed}%</div>
+            <p className="text-xs text-muted-foreground">Full transparency</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Citizen Reports</CardTitle>
+            <Users className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{transparencyData.overview.citizenReports.toLocaleString()}</div>
+            <p className="text-xs text-muted-foreground">This year</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
+            <Database className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{transparencyData.overview.totalPolicies}</div>
+            <p className="text-xs text-muted-foreground">Being monitored</p>
+          </CardContent>
+        </Card>
+      </div>
+
+      {/* Budget Transparency */}
+      <Card>
+        <CardHeader>
+          <CardTitle>Budget Transparency</CardTitle>
+          <CardDescription>
+            Real-time budget allocation and utilization across ministries
+          </CardDescription>
+        </CardHeader>
+        <CardContent className="space-y-6">
+          <div className="grid gap-4 md:grid-cols-4">
+            <div>
+              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
+              <p className="text-2xl font-bold">
+                {formatCurrency(transparencyData.budgetTransparency.totalBudget)}
+              </p>
             </div>
+            <div>
+              <p className="text-sm text-muted-foreground mb-1">Allocated</p>
+              <p className="text-2xl font-bold">
+                {formatCurrency(transparencyData.budgetTransparency.allocated)}
+              </p>
+            </div>
+            <div>
+              <p className="text-sm text-muted-foreground mb-1">Spent</p>
+              <p className="text-2xl font-bold">
+                {formatCurrency(transparencyData.budgetTransparency.spent)}
+              </p>
+            </div>
+            <div>
+              <p className="text-sm text-muted-foreground mb-1">Utilization Rate</p>
+              <p className="text-2xl font-bold">
+                {transparencyData.budgetTransparency.utilizationRate}%
+              </p>
+            </div>
           </div>
-        </div>
-      </section>
 
-      {/* Sentiment Overview */}
-      <section className="container mx-auto px-4 -mt-12 relative z-20">
-        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
-          <Card className="border-t-4 border-t-blue-600">
-            <CardHeader className="pb-3">
-              <CardDescription>Total Feedback</CardDescription>
-              <CardTitle className="text-4xl">{sentimentOverview.total.toLocaleString()}</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                <Activity className="h-4 w-4" />
-                <span>Last 30 days</span>
+          <div className="space-y-4">
+            <h4 className="font-semibold">Budget by Ministry</h4>
+            {transparencyData.budgetTransparency.byMinistry.map((item, index) => (
+              <div key={index} className="space-y-2">
+                <div className="flex items-center justify-between text-sm">
+                  <span className="font-medium">{item.ministry}</span>
+                  <div className="flex items-center gap-4">
+                    <span className="text-muted-foreground">
+                      {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
+                    </span>
+                    <Badge variant="secondary">{item.percentage}%</Badge>
+                  </div>
+                </div>
+                <Progress value={item.percentage} className="h-2" />
               </div>
-            </CardContent>
-          </Card>
+            ))}
+          </div>
+        </CardContent>
+      </Card>
 
-          <Card className="border-t-4 border-t-green-600">
-            <CardHeader className="pb-3">
-              <CardDescription>Positive Sentiment</CardDescription>
-              <CardTitle className="text-4xl">{sentimentOverview.positivePercent}%</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-green-600">
-                <TrendingUp className="h-4 w-4" />
-                <span>{sentimentOverview.positive.toLocaleString()} responses</span>
-              </div>
-            </CardContent>
-          </Card>
+      {/* Main Content */}
+      <Tabs defaultValue="open-data" className="w-full">
+        <TabsList>
+          <TabsTrigger value="open-data">Open Data</TabsTrigger>
+          <TabsTrigger value="feedback">Citizen Feedback</TabsTrigger>
+          <TabsTrigger value="performance">Performance</TabsTrigger>
+          <TabsTrigger value="reports">Reports</TabsTrigger>
+          <TabsTrigger value="events">Events</TabsTrigger>
+        </TabsList>
 
-          <Card className="border-t-4 border-t-yellow-600">
-            <CardHeader className="pb-3">
-              <CardDescription>Neutral Sentiment</CardDescription>
-              <CardTitle className="text-4xl">{sentimentOverview.neutralPercent}%</CardTitle>
+        {/* Open Data Tab */}
+        <TabsContent value="open-data" className="mt-6">
+          <Card>
+            <CardHeader>
+              <div className="flex items-center justify-between">
+                <div>
+                  <CardTitle>Open Government Data</CardTitle>
+                  <CardDescription>Download datasets and access public information</CardDescription>
+                </div>
+                <div className="flex gap-2">
+                  <div className="relative w-64">
+                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
+                    <Input
+                      placeholder="Search datasets..."
+                      value={searchQuery}
+                      onChange={(e) => setSearchQuery(e.target.value)}
+                      className="pl-8"
+                    />
+                  </div>
+                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
+                    <SelectTrigger className="w-48">
+                      <SelectValue />
+                    </SelectTrigger>
+                    <SelectContent>
+                      <SelectItem value="all">All Categories</SelectItem>
+                      <SelectItem value="Budget & Finance">Budget & Finance</SelectItem>
+                      <SelectItem value="SDG Progress">SDG Progress</SelectItem>
+                      <SelectItem value="Policy Documents">Policy Documents</SelectItem>
+                      <SelectItem value="Procurement">Procurement</SelectItem>
+                      <SelectItem value="Healthcare">Healthcare</SelectItem>
+                      <SelectItem value="Environment">Environment</SelectItem>
+                    </SelectContent>
+                  </Select>
+                </div>
+              </div>
             </CardHeader>
             <CardContent>
-              <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                <Meh className="h-4 w-4" />
-                <span>{sentimentOverview.neutral.toLocaleString()} responses</span>
+              <div className="space-y-4">
+                {filteredOpenData?.map((dataset) => (
+                  <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
+                    <CardHeader>
+                      <div className="flex items-start justify-between">
+                        <div className="flex-1">
+                          <div className="flex items-center gap-2 mb-2">
+                            <Badge variant="secondary">{dataset.category}</Badge>
+                            <div className="flex items-center gap-1">
+                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
+                              <span className="text-sm">{dataset.rating}</span>
+                            </div>
+                          </div>
+                          <CardTitle className="text-lg">{dataset.title}</CardTitle>
+                          <CardDescription className="mt-2">{dataset.description}</CardDescription>
+                        </div>
+                      </div>
+                    </CardHeader>
+                    <CardContent>
+                      <div className="flex items-center justify-between">
+                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
+                          <div className="flex items-center gap-1">
+                            <Download className="h-4 w-4" />
+                            <span>{dataset.downloads.toLocaleString()} downloads</span>
+                          </div>
+                          <div className="flex items-center gap-1">
+                            <Eye className="h-4 w-4" />
+                            <span>{dataset.views.toLocaleString()} views</span>
+                          </div>
+                          <span>Format: {dataset.format}</span>
+                          <span>Size: {dataset.size}</span>
+                          <span>Updated: {formatDate(dataset.lastUpdated)}</span>
+                        </div>
+                        <Button
+                          size="sm"
+                          onClick={() => downloadData(dataset.url, dataset.title)}
+                        >
+                          <Download className="mr-2 h-4 w-4" />
+                          Download
+                        </Button>
+                      </div>
+                    </CardContent>
+                  </Card>
+                ))}
               </div>
             </CardContent>
           </Card>
+        </TabsContent>
 
-          <Card className="border-t-4 border-t-red-600">
-            <CardHeader className="pb-3">
-              <CardDescription>Negative Sentiment</CardDescription>
-              <CardTitle className="text-4xl">{sentimentOverview.negativePercent}%</CardTitle>
+        {/* Citizen Feedback Tab */}
+        <TabsContent value="feedback" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Citizen Feedback & Reports</CardTitle>
+              <CardDescription>Community-submitted issues and suggestions</CardDescription>
             </CardHeader>
             <CardContent>
-              <div className="flex items-center gap-2 text-sm text-red-600">
-                <TrendingDown className="h-4 w-4" />
-                <span>{sentimentOverview.negative.toLocaleString()} responses</span>
-              </div>
-            </CardContent>
-          </Card>
-        </div>
-      </section>
-
-      {/* Main Content */}
-      <section className="container mx-auto px-4 py-16">
-        <Tabs defaultValue="overview" className="space-y-6">
-          <TabsList className="grid w-full grid-cols-5">
-            <TabsTrigger value="overview">Overview</TabsTrigger>
-            <TabsTrigger value="social">Social Media</TabsTrigger>
-            <TabsTrigger value="topics">Trending Topics</TabsTrigger>
-            <TabsTrigger value="sdg">SDG Feedback</TabsTrigger>
-            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
-          </TabsList>
-
-          {/* Overview Tab */}
-          <TabsContent value="overview" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <MessageSquare className="h-5 w-5" />
-                  Recent Citizen Feedback
-                </CardTitle>
-                <CardDescription>Latest feedback from surveys and social media platforms</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-4">
-                  {recentFeedback.map((feedback) => (
-                    <Card key={feedback.id}>
-                      <CardHeader>
-                        <div className="flex items-start justify-between">
-                          <div className="flex-1">
-                            <div className="flex items-center gap-3 mb-2">
-                              <div className="font-semibold">{feedback.author}</div>
-                              {getSentimentBadge(feedback.sentiment)}
-                              <Badge variant="outline">{feedback.sdg}</Badge>
-                              <Badge variant="secondary">{feedback.source}</Badge>
+              <div className="space-y-4">
+                {transparencyData.citizenFeedback.map((feedback) => (
+                  <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
+                    <CardHeader>
+                      <div className="flex items-start justify-between">
+                        <div className="flex-1">
+                          <div className="flex items-center gap-2 mb-2">
+                            <Badge variant="secondary">{feedback.category}</Badge>
+                            {getStatusBadge(feedback.status)}
+                            {getPriorityBadge(feedback.priority)}
+                          </div>
+                          <CardTitle className="text-lg">{feedback.title}</CardTitle>
+                          <CardDescription className="mt-2">{feedback.description}</CardDescription>
+                        </div>
+                      </div>
+                    </CardHeader>
+                    <CardContent>
+                      <div className="space-y-3">
+                        <div className="flex items-center justify-between text-sm">
+                          <div className="flex items-center gap-4 text-muted-foreground">
+                            <span>Submitted by: {feedback.submittedBy}</span>
+                            <span>Date: {formatDate(feedback.submittedDate)}</span>
+                            <span>Ministry: {feedback.ministry}</span>
+                          </div>
+                          <div className="flex items-center gap-4">
+                            <div className="flex items-center gap-1">
+                              <ThumbsUp className="h-4 w-4" />
+                              <span>{feedback.votes}</span>
                             </div>
-                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
-                              <MapPin className="h-4 w-4" />
-                              {feedback.location}
-                              <Clock className="h-4 w-4 ml-2" />
-                              {feedback.time}
+                            <div className="flex items-center gap-1">
+                              <MessageSquare className="h-4 w-4" />
+                              <span>{feedback.responses}</span>
                             </div>
-                            <div className="flex items-center gap-1 mb-2">
-                              {[...Array(5)].map((_, i) => (
-                                <Star 
-                                  key={i} 
-                                  className={`h-4 w-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
-                                />
-                              ))}
-                            </div>
                           </div>
-                          {getSentimentIcon(feedback.sentiment)}
                         </div>
-                      </CardHeader>
-                      <CardContent>
-                        <p className="text-sm">{feedback.comment}</p>
-                      </CardContent>
-                    </Card>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Social Media Tab */}
-          <TabsContent value="social" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Activity className="h-5 w-5" />
-                  Social Media Sentiment Analysis
-                </CardTitle>
-                <CardDescription>Real-time sentiment tracking across social platforms</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-6">
-                  {socialMediaSentiment.map((platform) => (
-                    <div key={platform.platform} className="space-y-3">
-                      <div className="flex items-center justify-between">
-                        <div className="flex items-center gap-3">
-                          <platform.icon className={`h-6 w-6 ${platform.color}`} />
-                          <div>
-                            <div className="font-semibold">{platform.platform}</div>
-                            <div className="text-sm text-muted-foreground">{platform.total.toLocaleString()} mentions</div>
-                          </div>
+                        {feedback.resolution && (
+                          <Alert className="bg-green-50 dark:bg-green-950">
+                            <CheckCircle className="h-4 w-4" />
+                            <AlertDescription>
+                              <strong>Resolution:</strong> {feedback.resolution}
+                            </AlertDescription>
+                          </Alert>
+                        )}
+                        <div className="flex gap-2">
+                          <Button variant="outline" size="sm">
+                            <ThumbsUp className="mr-2 h-4 w-4" />
+                            Vote
+                          </Button>
+                          <Button variant="outline" size="sm">
+                            <MessageSquare className="mr-2 h-4 w-4" />
+                            Comment
+                          </Button>
                         </div>
-                        <Badge className={
-                          platform.sentiment === 'Very Positive' ? 'bg-green-100 text-green-800' :
-                          platform.sentiment === 'Positive' ? 'bg-blue-100 text-blue-800' :
-                          'bg-yellow-100 text-yellow-800'
-                        }>
-                          {platform.sentiment}
-                        </Badge>
                       </div>
-                      <div className="grid grid-cols-3 gap-4">
-                        <div>
-                          <div className="text-sm text-muted-foreground mb-1">Positive</div>
-                          <Progress value={(platform.positive / platform.total) * 100} className="h-2 bg-muted [&>div]:bg-green-600" />
-                          <div className="text-sm font-medium mt-1">{platform.positive.toLocaleString()}</div>
-                        </div>
-                        <div>
-                          <div className="text-sm text-muted-foreground mb-1">Neutral</div>
-                          <Progress value={(platform.neutral / platform.total) * 100} className="h-2 bg-muted [&>div]:bg-yellow-600" />
-                          <div className="text-sm font-medium mt-1">{platform.neutral.toLocaleString()}</div>
-                        </div>
-                        <div>
-                          <div className="text-sm text-muted-foreground mb-1">Negative</div>
-                          <Progress value={(platform.negative / platform.total) * 100} className="h-2 bg-muted [&>div]:bg-red-600" />
-                          <div className="text-sm font-medium mt-1">{platform.negative.toLocaleString()}</div>
-                        </div>
-                      </div>
-                    </div>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+                    </CardContent>
+                  </Card>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-          {/* Trending Topics Tab */}
-          <TabsContent value="topics" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <div className="flex items-center justify-between">
-                  <div>
-                    <CardTitle className="flex items-center gap-2">
-                      <TrendingUp className="h-5 w-5" />
-                      Trending Topics
-                    </CardTitle>
-                    <CardDescription>Most discussed SDG topics in citizen feedback</CardDescription>
+        {/* Performance Tab */}
+        <TabsContent value="performance" className="mt-6">
+          <div className="space-y-4">
+            {transparencyData.performanceMetrics.map((metric, index) => (
+              <Card key={index}>
+                <CardHeader>
+                  <div className="flex items-center justify-between">
+                    <CardTitle>{metric.ministry}</CardTitle>
+                    <Badge className="bg-blue-500">
+                      Overall Progress: {metric.overallProgress}%
+                    </Badge>
                   </div>
-                  <Button variant="outline">
-                    <Download className="mr-2 h-4 w-4" />
-                    Export Report
-                  </Button>
-                </div>
-              </CardHeader>
-              <CardContent>
-                <div className="space-y-4">
-                  {trendingTopics.map((topic, index) => (
-                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
-                      <div className="flex items-center gap-4 flex-1">
-                        <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
+                </CardHeader>
+                <CardContent>
+                  <Table>
+                    <TableHeader>
+                      <TableRow>
+                        <TableHead>KPI</TableHead>
+                        <TableHead>Current</TableHead>
+                        <TableHead>Target</TableHead>
+                        <TableHead>Progress</TableHead>
+                      </TableRow>
+                    </TableHeader>
+                    <TableBody>
+                      {metric.kpis.map((kpi, kpiIndex) => {
+                        const progress = Math.round((kpi.current / kpi.target) * 100);
+                        return (
+                          <TableRow key={kpiIndex}>
+                            <TableCell className="font-medium">{kpi.name}</TableCell>
+                            <TableCell>
+                              {kpi.current.toLocaleString()} {kpi.unit}
+                            </TableCell>
+                            <TableCell>
+                              {kpi.target.toLocaleString()} {kpi.unit}
+                            </TableCell>
+                            <TableCell>
+                              <div className="flex items-center gap-2">
+                                <Progress value={progress} className="h-2 w-24" />
+                                <span className="text-sm font-medium">{progress}%</span>
+                              </div>
+                            </TableCell>
+                          </TableRow>
+                        );
+                      })}
+                    </TableBody>
+                  </Table>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Reports Tab */}
+        <TabsContent value="reports" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Public Reports</CardTitle>
+              <CardDescription>Official government reports and publications</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {transparencyData.publicReports.map((report) => (
+                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
+                    <CardHeader>
+                      <div className="flex items-start justify-between">
                         <div className="flex-1">
-                          <div className="font-semibold mb-1">{topic.topic}</div>
-                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
-                            <span>{topic.mentions.toLocaleString()} mentions</span>
-                            <Badge variant="outline">{topic.sdg}</Badge>
+                          <div className="flex items-center gap-2 mb-2">
+                            <Badge variant="secondary">{report.category}</Badge>
                           </div>
+                          <CardTitle className="text-lg">{report.title}</CardTitle>
+                          <CardDescription className="mt-2">{report.description}</CardDescription>
                         </div>
                       </div>
-                      <div className="flex items-center gap-4">
-                        {getSentimentBadge(topic.sentiment)}
-                        <div className={`flex items-center gap-1 font-medium ${
-                          topic.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
-                        }`}>
-                          {topic.change.startsWith('+') ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
-                          {topic.change}
+                    </CardHeader>
+                    <CardContent>
+                      <div className="flex items-center justify-between">
+                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
+                          <span>Published: {formatDate(report.publishDate)}</span>
+                          <span>{report.pages} pages</span>
+                          <div className="flex items-center gap-1">
+                            <Download className="h-4 w-4" />
+                            <span>{report.downloads.toLocaleString()} downloads</span>
+                          </div>
                         </div>
+                        <Button size="sm" onClick={() => downloadData(report.url, report.title)}>
+                          <Download className="mr-2 h-4 w-4" />
+                          Download PDF
+                        </Button>
                       </div>
-                    </div>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+                    </CardContent>
+                  </Card>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-          {/* SDG Feedback Tab */}
-          <TabsContent value="sdg" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Target className="h-5 w-5" />
-                  SDG-wise Feedback Summary
-                </CardTitle>
-                <CardDescription>Sentiment breakdown for each SDG goal</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
-                  {sdgFeedback.map((sdg) => (
-                    <Card key={sdg.sdg}>
-                      <CardHeader>
-                        <div className="flex items-center justify-between">
-                          <div>
-                            <Badge variant="outline" className="mb-2">{sdg.sdg}</Badge>
-                            <CardTitle className="text-lg">{sdg.name}</CardTitle>
-                            <CardDescription>{sdg.feedback.toLocaleString()} responses</CardDescription>
-                          </div>
+        {/* Events Tab */}
+        <TabsContent value="events" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Upcoming Public Events</CardTitle>
+              <CardDescription>Town halls, consultations, and community meetings</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {transparencyData.upcomingEvents.map((event) => (
+                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
+                    <CardHeader>
+                      <div className="flex items-start justify-between">
+                        <div className="flex-1">
+                          <CardTitle className="text-lg">{event.title}</CardTitle>
+                          <CardDescription className="mt-2">{event.description}</CardDescription>
                         </div>
-                      </CardHeader>
-                      <CardContent>
-                        <div className="space-y-3">
-                          <div>
-                            <div className="flex items-center justify-between text-sm mb-1">
-                              <span className="text-green-600">Positive</span>
-                              <span className="font-medium">{sdg.positive}%</span>
-                            </div>
-                            <Progress value={sdg.positive} className="h-2 bg-muted [&>div]:bg-green-600" />
+                      </div>
+                    </CardHeader>
+                    <CardContent>
+                      <div className="flex items-center justify-between">
+                        <div className="flex items-center gap-6 text-sm">
+                          <div className="flex items-center gap-1">
+                            <Calendar className="h-4 w-4 text-muted-foreground" />
+                            <span>{formatDate(event.date)} at {event.time}</span>
                           </div>
-                          <div>
-                            <div className="flex items-center justify-between text-sm mb-1">
-                              <span className="text-yellow-600">Neutral</span>
-                              <span className="font-medium">{sdg.neutral}%</span>
-                            </div>
-                            <Progress value={sdg.neutral} className="h-2 bg-muted [&>div]:bg-yellow-600" />
+                          <span className="text-muted-foreground">{event.location}</span>
+                          <div className="flex items-center gap-1">
+                            <Users className="h-4 w-4 text-muted-foreground" />
+                            <span>
+                              {event.registrations} / {event.capacity} registered
+                            </span>
                           </div>
-                          <div>
-                            <div className="flex items-center justify-between text-sm mb-1">
-                              <span className="text-red-600">Negative</span>
-                              <span className="font-medium">{sdg.negative}%</span>
-                            </div>
-                            <Progress value={sdg.negative} className="h-2 bg-muted [&>div]:bg-red-600" />
-                          </div>
                         </div>
-                      </CardContent>
-                    </Card>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+                        <Button size="sm">
+                          <Calendar className="mr-2 h-4 w-4" />
+                          Register
+                        </Button>
+                      </div>
+                    </CardContent>
+                  </Card>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
+      </Tabs>
 
-          {/* Submit Feedback Tab */}
-          <TabsContent value="submit" className="space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Send className="h-5 w-5" />
-                  Submit Your Feedback
-                </CardTitle>
-                <CardDescription>Share your thoughts on SDG initiatives in your area</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <form className="space-y-4">
-                  <div>
-                    <label className="text-sm font-medium mb-2 block">Select SDG Goal</label>
-                    <select 
-                      className="w-full p-2 border rounded-md"
-                      value={selectedSDG}
-                      onChange={(e) => setSelectedSDG(e.target.value)}
-                    >
-                      <option value="">Choose an SDG...</option>
-                      {sdgFeedback.map((sdg) => (
-                        <option key={sdg.sdg} value={sdg.sdg}>{sdg.sdg} - {sdg.name}</option>
-                      ))}
-                    </select>
-                  </div>
-                  <div>
-                    <label className="text-sm font-medium mb-2 block">Your Location</label>
-                    <Input placeholder="City, State" />
-                  </div>
-                  <div>
-                    <label className="text-sm font-medium mb-2 block">Your Feedback</label>
-                    <Textarea 
-                      placeholder="Share your experience with SDG initiatives in your area..."
-                      rows={6}
-                      value={feedbackText}
-                      onChange={(e) => setFeedbackText(e.target.value)}
-                    />
-                  </div>
-                  <div>
-                    <label className="text-sm font-medium mb-2 block">Rate Your Experience</label>
-                    <div className="flex gap-2">
-                      {[1, 2, 3, 4, 5].map((rating) => (
-                        <button
-                          key={rating}
-                          type="button"
-                          className="p-2 border rounded-md hover:bg-muted transition-colors"
-                        >
-                          <Star className="h-6 w-6 text-yellow-400" />
-                        </button>
-                      ))}
-                    </div>
-                  </div>
-                  <Button className="w-full" size="lg">
-                    <Send className="mr-2 h-5 w-5" />
-                    Submit Feedback
-                  </Button>
-                </form>
-              </CardContent>
-            </Card>
-          </TabsContent>
-        </Tabs>
-      </section>
+      {/* Insights */}
+      <Card>
+        <CardHeader>
+          <CardTitle>Transparency Insights</CardTitle>
+          <CardDescription>Key findings and recommendations</CardDescription>
+        </CardHeader>
+        <CardContent>
+          <div className="space-y-3">
+            {transparencyData.insights.map((insight, index) => (
+              <div key={index} className={`flex gap-3 p-4 rounded-lg ${getInsightBg(insight.type)}`}>
+                {getInsightIcon(insight.type)}
+                <div className="flex-1">
+                  <p className="font-medium mb-1">{insight.title}</p>
+                  <p className="text-sm">{insight.description}</p>
+                </div>
+              </div>
+            ))}
+          </div>
+        </CardContent>
+      </Card>
     </div>
   );
 }
