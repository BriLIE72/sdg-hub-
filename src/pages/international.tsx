 import { useState, useEffect } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
-import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
-import { Input } from '@/components/ui/input';
-import { Textarea } from '@/components/ui/textarea';
-import { Label } from '@/components/ui/label';
-import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Progress } from '@/components/ui/progress';
+import { Separator } from '@/components/ui/separator';
+import { Input } from '@/components/ui/input';
 import {
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
   Globe,
-  Building2,
-  Send,
-  CheckCircle2,
-  Clock,
-  AlertCircle,
-  FileText,
-  Phone,
-  Mail,
-  MapPin,
-  Calendar,
   Users,
   DollarSign,
-  TrendingUp,
-  Search,
-  Download,
-  Eye,
-  PieChart,
-  BarChart3,
-  ArrowUpRight,
-  ArrowDownRight,
   Target,
-  Star,
-  GraduationCap,
+  TrendingUp,
   Award,
-  Languages,
-  Video,
-  Image as ImageIcon,
-  Play,
+  AlertCircle,
+  Download,
+  RefreshCw,
+  Search,
+  Mail,
+  Phone,
   ExternalLink,
-  Filter,
+  Calendar,
+  FileText,
+  Lightbulb,
+  CheckCircle,
+  Clock,
+  MapPin,
+  Building,
+  Briefcase,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-// Type definitions
-type Partner = {
-  id: number;
-  name: string;
-  logo: string;
-  type: string;
-  focus: string[];
-  activeProjects: number;
-  funding: string;
-  contact: string;
-};
+interface InternationalData {
+  overview: {
+    totalPartners: number;
+    activeProjects: number;
+    fundingCommitted: number;
+    countriesReached: number;
+    lastUpdated: string;
+  };
+  partners: Array<{
+    id: number;
+    name: string;
+    type: string;
+    country: string;
+    region: string;
+    logo: string;
+    website: string;
+    contact: {
+      name: string;
+      email: string;
+      phone: string;
+    };
+    partnership: {
+      since: string;
+      status: string;
+      projects: number;
+      funding: number;
+    };
+    focusAreas: string[];
+    activeProjects: Array<{
+      name: string;
+      sdg: string;
+      budget: number;
+      status: string;
+    }>;
+    expertise: string[];
+  }>;
+  projects: Array<{
+    id: number;
+    name: string;
+    description: string;
+    partners: string[];
+    sdgs: string[];
+    budget: number;
+    spent: number;
+    startDate: string;
+    endDate: string;
+    status: string;
+    progress: number;
+    countries: string[];
+    beneficiaries: number;
+  }>;
+  fundingOpportunities: Array<{
+    id: number;
+    title: string;
+    organization: string;
+    amount: number;
+    deadline: string;
+    eligibility: string[];
+    focusAreas: string[];
+    applicationUrl: string;
+    status: string;
+  }>;
+  experts: Array<{
+    id: number;
+    name: string;
+    title: string;
+    organization: string;
+    country: string;
+    expertise: string[];
+    sdgs: string[];
+    email: string;
+    linkedin: string;
+    publications: number;
+    projects: number;
+  }>;
+  knowledgeExchange: Array<{
+    id: number;
+    title: string;
+    type: string;
+    date: string;
+    participants: number;
+    countries: string[];
+    topics: string[];
+    outcomes: string;
+    resources: string[];
+  }>;
+  insights: Array<{
+    type: string;
+    title: string;
+    description: string;
+    priority: string;
+    impact: string;
+  }>;
+}
 
-type Request = {
-  id: number;
-  country: string;
-  organization: string;
-  type: string;
-  focus: string;
-  status: string;
-  date: string;
-  priority: string;
-};
-
-type FundingStream = {
-  id: number;
-  name: string;
-  provider: string;
-  amount: string;
-  focus: string[];
-  deadline: string;
-  eligibility: string[];
-  status: string;
-};
-
-type Expert = {
-  id: number;
-  name: string;
-  country: string;
-  expertise: string[];
-  organization: string;
-  experience: string;
-  languages: string[];
-  availability: string;
-};
-
-type CaseStudy = {
-  id: number;
-  title: string;
-  country: string;
-  sdg: number[];
-  sector: string;
-  year: string;
-  impact: string;
-  partners: string[];
-  budget: string;
-  status: string;
-};
-
 export default function InternationalCooperationPage() {
-  // State for dynamic data loading
-  const [partners, setPartners] = useState<Partner[]>([]);
-  const [requests, setRequests] = useState<Request[]>([]);
-  const [fundingStreams, setFundingStreams] = useState<FundingStream[]>([]);
-  const [experts, setExperts] = useState<Expert[]>([]);
-  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
+  const [internationalData, setInternationalData] = useState<InternationalData | null>(null);
   const [loading, setLoading] = useState(true);
+  const [refreshing, setRefreshing] = useState(false);
+  const [error, setError] = useState('');
+  const [searchTerm, setSearchTerm] = useState('');
+  const [filterRegion, setFilterRegion] = useState('all');
+  const [filterType, setFilterType] = useState('all');
+  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
 
-  // Load data on mount
   useEffect(() => {
-    const loadData = async () => {
-      try {
-        const [partnersRes, requestsRes, fundingRes, expertsRes, caseStudiesRes] = await Promise.all([
-          fetch('/data/international-partners.json'),
-          fetch('/data/international-requests.json'),
-          fetch('/data/international-funding.json'),
-          fetch('/data/international-experts.json'),
-          fetch('/data/international-case-studies.json'),
-        ]);
+    fetchInternationalData();
+  }, []);
 
-        const [partnersData, requestsData, fundingData, expertsData, caseStudiesData] = await Promise.all([
-          partnersRes.json(),
-          requestsRes.json(),
-          fundingRes.json(),
-          expertsRes.json(),
-          caseStudiesRes.json(),
-        ]);
+  const fetchInternationalData = async () => {
+    setLoading(true);
+    setError('');
 
-        setPartners(partnersData);
-        setRequests(requestsData);
-        setFundingStreams(fundingData);
-        setExperts(expertsData);
-        setCaseStudies(caseStudiesData);
-      } catch (error) {
-        console.error('Failed to load international data:', error);
-      } finally {
-        setLoading(false);
+    try {
+      const response = await fetch('/api/international');
+      const data = await response.json();
+
+      if (data.success) {
+        setInternationalData(data.data);
+      } else {
+        setError(data.error || 'Failed to fetch international data');
       }
-    };
+    } catch (err) {
+      setError('Failed to load international data. Please try again.');
+      console.error('International data error:', err);
+    } finally {
+      setLoading(false);
+    }
+  };
 
-    loadData();
-  }, []);
+  const refreshData = async () => {
+    setRefreshing(true);
+    await fetchInternationalData();
+    setRefreshing(false);
+  };
 
-  return (
-    <div className="min-h-screen bg-muted/30">
-      {/* Header */}
-      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
-        <div className="container mx-auto px-4">
-          <div className="flex items-center justify-between">
-            <div>
-              <h1 className="text-4xl font-bold mb-2">International Cooperation & Funding Hub</h1>
-              <p className="text-green-100 text-lg">
-                Partnership management, request tracking, and financial transparency
-              </p>
-            </div>
-            <div className="flex gap-3">
-              <Button variant="secondary" size="lg">
-                <Send className="mr-2 h-5 w-5" />
-                New Request
-              </Button>
-              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
-                <Download className="mr-2 h-5 w-5" />
-                Export Report
-              </Button>
-            </div>
-          </div>
-        </div>
-      </section>
+  const exportReport = () => {
+    if (!internationalData) return;
 
-      {/* Quick Stats */}
-      <section className="container mx-auto px-4 -mt-8 relative z-10">
-        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
-          <Card>
-            <CardHeader className="pb-3">
-              <CardDescription>Active Partners</CardDescription>
-              <CardTitle className="text-3xl">12</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                <Globe className="h-4 w-4" />
-                <span>UN, World Bank, IMF</span>
-              </div>
-            </CardContent>
-          </Card>
+    const report = JSON.stringify(internationalData, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `international-cooperation-${new Date().toISOString().split('T')[0]}.json`;
+    a.click();
+  };
 
-          <Card>
-            <CardHeader className="pb-3">
-              <CardDescription>Total Funding</CardDescription>
-              <CardTitle className="text-3xl">$575M</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-green-600">
-                <ArrowUpRight className="h-4 w-4" />
-                <span>76% utilized</span>
-              </div>
-            </CardContent>
-          </Card>
+  const formatCurrency = (amount: number) => {
+    return new Intl.NumberFormat('en-US', {
+      style: 'currency',
+      currency: 'USD',
+      minimumFractionDigits: 0,
+      maximumFractionDigits: 0,
+    }).format(amount);
+  };
 
-          <Card>
-            <CardHeader className="pb-3">
-              <CardDescription>Active Projects</CardDescription>
-              <CardTitle className="text-3xl">38</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                <BarChart3 className="h-4 w-4" />
-                <span>Across all SDGs</span>
-              </div>
-            </CardContent>
-          </Card>
+  const formatDate = (dateString: string) => {
+    return new Date(dateString).toLocaleDateString('en-US', {
+      year: 'numeric',
+      month: 'short',
+      day: 'numeric',
+    });
+  };
 
-          <Card>
-            <CardHeader className="pb-3">
-              <CardDescription>Pending Requests</CardDescription>
-              <CardTitle className="text-3xl">6</CardTitle>
-            </CardHeader>
-            <CardContent>
-              <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                <Clock className="h-4 w-4" />
-                <span>Awaiting response</span>
-              </div>
-            </CardContent>
-          </Card>
-        </div>
-      </section>
+  const getStatusBadge = (status: string) => {
+    if (status === 'active') return <Badge className="bg-green-500">Active</Badge>;
+    if (status === 'pending') return <Badge className="bg-yellow-500">Pending</Badge>;
+    if (status === 'completed') return <Badge variant="secondary">Completed</Badge>;
+    if (status === 'on-hold') return <Badge variant="outline">On Hold</Badge>;
+    return <Badge variant="default">{status}</Badge>;
+  };
 
-      {/* Main Content */}
-      <section className="container mx-auto px-4 py-8">
-        <Tabs defaultValue="partners" className="space-y-6">
-          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 lg:w-auto lg:inline-grid">
-            <TabsTrigger value="partners">Partner Directory</TabsTrigger>
-            <TabsTrigger value="experts">Expert Network</TabsTrigger>
-            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
-            <TabsTrigger value="policy-map">Policy Map</TabsTrigger>
-            <TabsTrigger value="requests">Support Requests</TabsTrigger>
-            <TabsTrigger value="funding">Funding Tracker</TabsTrigger>
-            <TabsTrigger value="new-request">Submit Request</TabsTrigger>
-          </TabsList>
+  const getInsightIcon = (type: string) => {
+    if (type === 'opportunity') return <Lightbulb className="h-5 w-5 text-blue-600" />;
+    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
+    if (type === 'warning') return <AlertCircle className="h-5 w-5 text-yellow-600" />;
+    return <AlertCircle className="h-5 w-5 text-red-600" />;
+  };
 
-          {/* Partner Directory Tab */}
-          <TabsContent value="partners" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">International Partner Organizations</h2>
-              <p className="text-muted-foreground">
-                Contact information and expertise areas of global development partners
-              </p>
-            </div>
+  const getInsightBg = (type: string) => {
+    if (type === 'opportunity') return 'bg-blue-50 dark:bg-blue-950';
+    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
+    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
+    return 'bg-red-50 dark:bg-red-950';
+  };
 
-            <div className="grid grid-cols-1 gap-6">
-              {partners.map((partner) => (
-                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
-                  <CardHeader>
-                    <div className="flex items-start justify-between">
-                      <div className="flex items-start gap-4">
-                        <div className="bg-primary/10 p-4 rounded-lg">
-                          <Globe className="h-8 w-8 text-primary" />
-                        </div>
-                        <div>
-                          <CardTitle className="text-xl mb-1">{partner.name}</CardTitle>
-                          <CardDescription>{partner.type}</CardDescription>
-                          <div className="flex flex-wrap gap-2 mt-3">
-                            {partner.focus.map((area, index) => (
-                              <Badge key={index} variant="secondary">{area}</Badge>
-                            ))}
-                          </div>
-                        </div>
-                      </div>
-                      <Badge className="bg-green-100 text-green-800">Active</Badge>
-                    </div>
-                  </CardHeader>
-                  <CardContent className="space-y-4">
-                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                      <div className="space-y-3">
-                        <h4 className="font-semibold text-sm">Contact Person</h4>
-                        <div className="space-y-2">
-                          <div className="flex items-center gap-2 text-sm">
-                            <Users className="h-4 w-4 text-muted-foreground" />
-                            <span>{partner.contact.name}</span>
-                          </div>
-                          <div className="flex items-center gap-2 text-sm">
-                            <Building2 className="h-4 w-4 text-muted-foreground" />
-                            <span className="text-muted-foreground">{partner.contact.role}</span>
-                          </div>
-                          <div className="flex items-center gap-2 text-sm">
-                            <Mail className="h-4 w-4 text-muted-foreground" />
-                            <a href={`mailto:${partner.contact.email}`} className="text-primary hover:underline">
-                              {partner.contact.email}
-                            </a>
-                          </div>
-                          <div className="flex items-center gap-2 text-sm">
-                            <Phone className="h-4 w-4 text-muted-foreground" />
-                            <span className="text-muted-foreground">{partner.contact.phone}</span>
-                          </div>
-                        </div>
-                      </div>
+  const filteredPartners = internationalData?.partners.filter((partner) => {
+    const matchesSearch =
+      searchTerm === '' ||
+      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
+      partner.country.toLowerCase().includes(searchTerm.toLowerCase());
+    const matchesRegion = filterRegion === 'all' || partner.region === filterRegion;
+    const matchesType = filterType === 'all' || partner.type === filterType;
+    return matchesSearch && matchesRegion && matchesType;
+  });
 
-                      <div className="space-y-3">
-                        <h4 className="font-semibold text-sm">Partnership Overview</h4>
-                        <div className="grid grid-cols-2 gap-4">
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Active Projects</p>
-                            <p className="text-2xl font-bold">{partner.activeProjects}</p>
-                          </div>
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Total Funding</p>
-                            <p className="text-2xl font-bold">{partner.totalFunding}</p>
-                          </div>
-                        </div>
-                      </div>
-                    </div>
+  if (loading) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <div className="text-center">
+          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
+          <p className="text-muted-foreground">Loading international cooperation data...</p>
+        </div>
+      </div>
+    );
+  }
 
-                    <div className="flex gap-2 pt-2">
-                      <Button variant="outline" size="sm" className="flex-1">
-                        View Projects
-                      </Button>
-                      <Button variant="outline" size="sm" className="flex-1">
-                        <Send className="mr-2 h-4 w-4" />
-                        Submit Request
-                      </Button>
-                    </div>
-                  </CardContent>
-                </Card>
-              ))}
-            </div>
-          </TabsContent>
+  if (error || !internationalData) {
+    return (
+      <div className="flex items-center justify-center h-screen">
+        <Alert variant="destructive" className="max-w-md">
+          <AlertCircle className="h-4 w-4" />
+          <AlertTitle>Error</AlertTitle>
+          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
+          <Button onClick={fetchInternationalData} className="mt-4">
+            Try Again
+          </Button>
+        </Alert>
+      </div>
+    );
+  }
 
-          {/* Expert Network Tab */}
-          <TabsContent value="experts" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Global Expert Network</h2>
-              <p className="text-muted-foreground">
-                Connect with international experts and Indian advisors for policy guidance and technical assistance
-              </p>
+  return (
+    <div className="flex flex-col gap-6 p-6">
+      {/* Header */}
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">International Cooperation Hub</h1>
+          <p className="text-muted-foreground">
+            Global partnerships and collaborative initiatives for SDG achievement
+          </p>
+        </div>
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
+      </div>
+
+      {/* Overview Stats */}
+      <div className="grid gap-4 md:grid-cols-4">
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">International Partners</CardTitle>
+            <Globe className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{internationalData.overview.totalPartners}</div>
+            <p className="text-xs text-muted-foreground">
+              Across {internationalData.overview.countriesReached} countries
+            </p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
+            <Briefcase className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{internationalData.overview.activeProjects}</div>
+            <p className="text-xs text-muted-foreground">Collaborative initiatives</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Funding Committed</CardTitle>
+            <DollarSign className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">
+              {formatCurrency(internationalData.overview.fundingCommitted)}
             </div>
+            <p className="text-xs text-muted-foreground">Total investment</p>
+          </CardContent>
+        </Card>
+        <Card>
+          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+            <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
+            <MapPin className="h-4 w-4 text-muted-foreground" />
+          </CardHeader>
+          <CardContent>
+            <div className="text-2xl font-bold">{internationalData.overview.countriesReached}</div>
+            <p className="text-xs text-muted-foreground">Countries impacted</p>
+          </CardContent>
+        </Card>
+      </div>
 
-            {/* Search and Filters */}
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Search className="h-5 w-5 text-primary" />
-                  Search Experts
-                </CardTitle>
-              </CardHeader>
-              <CardContent className="space-y-4">
-                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
-                  <div className="md:col-span-3">
-                    <Input
-                      placeholder="Search by name, expertise, or country..."
-                      value={expertSearch}
-                      onChange={(e) => setExpertSearch(e.target.value)}
-                      className="w-full"
-                    />
-                  </div>
-                  <div>
-                    <Select value={expertCountryFilter} onValueChange={setExpertCountryFilter}>
-                      <SelectTrigger>
-                        <SelectValue placeholder="Filter by country" />
-                      </SelectTrigger>
-                      <SelectContent>
-                        <SelectItem value="all">All Countries</SelectItem>
-                        <SelectItem value="Brazil">Brazil</SelectItem>
-                        <SelectItem value="Japan">Japan</SelectItem>
-                        <SelectItem value="Kenya">Kenya</SelectItem>
-                        <SelectItem value="Denmark">Denmark</SelectItem>
-                        <SelectItem value="India">India</SelectItem>
-                        <SelectItem value="Germany">Germany</SelectItem>
-                      </SelectContent>
-                    </Select>
-                  </div>
-                  <div>
-                    <Select value={expertExpertiseFilter} onValueChange={setExpertExpertiseFilter}>
-                      <SelectTrigger>
-                        <SelectValue placeholder="Filter by expertise" />
-                      </SelectTrigger>
-                      <SelectContent>
-                        <SelectItem value="all">All Expertise</SelectItem>
-                        <SelectItem value="Social Protection">Social Protection</SelectItem>
-                        <SelectItem value="Digital Infrastructure">Digital Infrastructure</SelectItem>
-                        <SelectItem value="Healthcare Systems">Healthcare Systems</SelectItem>
-                        <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
-                        <SelectItem value="Education Policy">Education Policy</SelectItem>
-                      </SelectContent>
-                    </Select>
-                  </div>
-                  <div>
+      {/* Main Content */}
+      <Tabs defaultValue="partners" className="w-full">
+        <TabsList>
+          <TabsTrigger value="partners">Partners</TabsTrigger>
+          <TabsTrigger value="projects">Projects</TabsTrigger>
+          <TabsTrigger value="funding">Funding</TabsTrigger>
+          <TabsTrigger value="experts">Experts</TabsTrigger>
+          <TabsTrigger value="knowledge">Knowledge Exchange</TabsTrigger>
+          <TabsTrigger value="insights">Insights</TabsTrigger>
+        </TabsList>
+
+        {/* Partners Tab */}
+        <TabsContent value="partners" className="mt-6">
+          {/* Search and Filters */}
+          <Card className="mb-6">
+            <CardContent className="pt-6">
+              <div className="flex flex-col md:flex-row gap-4">
+                <div className="flex-1 relative">
+                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
+                  <Input
+                    placeholder="Search partners by name or country..."
+                    value={searchTerm}
+                    onChange={(e) => setSearchTerm(e.target.value)}
+                    className="pl-10"
+                  />
+                </div>
+                <Select value={filterRegion} onValueChange={setFilterRegion}>
+                  <SelectTrigger className="w-full md:w-48">
+                    <SelectValue placeholder="Filter by region" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    <SelectItem value="all">All Regions</SelectItem>
+                    <SelectItem value="Europe">Europe</SelectItem>
+                    <SelectItem value="Asia">Asia</SelectItem>
+                    <SelectItem value="North America">North America</SelectItem>
+                    <SelectItem value="Africa">Africa</SelectItem>
+                  </SelectContent>
+                </Select>
+                <Select value={filterType} onValueChange={setFilterType}>
+                  <SelectTrigger className="w-full md:w-48">
+                    <SelectValue placeholder="Filter by type" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    <SelectItem value="all">All Types</SelectItem>
+                    <SelectItem value="UN Agency">UN Agency</SelectItem>
+                    <SelectItem value="Development Bank">Development Bank</SelectItem>
+                    <SelectItem value="NGO">NGO</SelectItem>
+                    <SelectItem value="Government">Government</SelectItem>
+                  </SelectContent>
+                </Select>
+              </div>
+            </CardContent>
+          </Card>
+
+          {/* Partners List */}
+          <div className="space-y-4">
+            {filteredPartners?.map((partner) => (
+              <Card
+                key={partner.id}
+                className={`hover:shadow-lg transition-shadow ${
+                  selectedPartner === partner.id ? 'ring-2 ring-primary' : ''
+                }`}
+              >
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-3 mb-2">
+                        <Building className="h-5 w-5 text-muted-foreground" />
+                        <CardTitle className="text-xl">{partner.name}</CardTitle>
+                        <Badge variant="secondary">{partner.type}</Badge>
+                        {getStatusBadge(partner.partnership.status)}
+                      </div>
+                      <CardDescription>
+                        <MapPin className="inline h-3 w-3 mr-1" />
+                        {partner.country}, {partner.region} • Partner since {partner.partnership.since}
+                      </CardDescription>
+                    </div>
                     <Button
                       variant="outline"
-                      onClick={() => {
-                        setExpertSearch('');
-                        setExpertCountryFilter('all');
-                        setExpertExpertiseFilter('all');
-                      }}
-                      className="w-full"
+                      size="sm"
+                      onClick={() =>
+                        setSelectedPartner(selectedPartner === partner.id ? null : partner.id)
+                      }
                     >
-                      <Filter className="mr-2 h-4 w-4" />
-                      Clear Filters
+                      {selectedPartner === partner.id ? 'Hide Details' : 'View Details'}
                     </Button>
                   </div>
-                </div>
-                <p className="text-sm text-muted-foreground">
-                  Showing {filteredExperts.length} of {experts.length} experts
-                </p>
-              </CardContent>
-            </Card>
-
-            {/* Expert Cards */}
-            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-              {filteredExperts.map((expert) => (
-                <Card key={expert.id} className="hover:shadow-lg transition-shadow">
-                  <CardHeader>
-                    <div className="flex items-start justify-between">
-                      <div className="flex items-start gap-4">
-                        <div className="bg-primary/10 p-4 rounded-full">
-                          <GraduationCap className="h-8 w-8 text-primary" />
-                        </div>
-                        <div>
-                          <CardTitle className="text-xl mb-1">{expert.name}</CardTitle>
-                          <CardDescription className="flex items-center gap-2">
-                            <MapPin className="h-4 w-4" />
-                            {expert.country}
-                          </CardDescription>
-                          <div className="flex items-center gap-2 mt-2">
-                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
-                            <span className="text-sm font-semibold">{expert.rating.toFixed(1)}</span>
-                            <span className="text-xs text-muted-foreground">({expert.projects} projects)</span>
-                          </div>
-                        </div>
-                      </div>
-                      <Badge
-                        className={
-                          expert.availability === 'Available'
-                            ? 'bg-green-100 text-green-800'
-                            : 'bg-yellow-100 text-yellow-800'
-                        }
-                      >
-                        {expert.availability}
-                      </Badge>
-                    </div>
-                  </CardHeader>
-                  <CardContent className="space-y-4">
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  {/* Partnership Stats */}
+                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
-                      <h4 className="text-sm font-semibold mb-2">Expertise</h4>
-                      <div className="flex flex-wrap gap-2">
-                        {expert.expertise.map((area, index) => (
-                          <Badge key={index} variant="secondary">
-                            {area}
-                          </Badge>
-                        ))}
-                      </div>
+                      <p className="text-muted-foreground mb-1">Active Projects</p>
+                      <p className="text-2xl font-bold">{partner.partnership.projects}</p>
                     </div>
-
                     <div>
-                      <h4 className="text-sm font-semibold mb-2">Languages</h4>
-                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
-                        <Languages className="h-4 w-4" />
-                        <span>{expert.languages.join(', ')}</span>
-                      </div>
+                      <p className="text-muted-foreground mb-1">Total Funding</p>
+                      <p className="text-2xl font-bold">
+                        {formatCurrency(partner.partnership.funding)}
+                      </p>
                     </div>
+                  </div>
 
-                    <div>
-                      <h4 className="text-sm font-semibold mb-2">Credentials</h4>
-                      <p className="text-sm text-muted-foreground">{expert.credentials}</p>
+                  {/* Focus Areas */}
+                  <div>
+                    <p className="text-sm font-medium mb-2">Focus Areas</p>
+                    <div className="flex flex-wrap gap-2">
+                      {partner.focusAreas.map((area, index) => (
+                        <Badge key={index} variant="outline">
+                          {area}
+                        </Badge>
+                      ))}
                     </div>
+                  </div>
 
-                    <div>
-                      <p className="text-sm text-muted-foreground italic">{expert.bio}</p>
-                    </div>
+                  {/* Detailed View */}
+                  {selectedPartner === partner.id && (
+                    <>
+                      <Separator />
 
-                    <div className="border-t pt-4 space-y-2">
-                      <div className="flex items-center gap-2 text-sm">
-                        <Mail className="h-4 w-4 text-muted-foreground" />
-                        <a href={`mailto:${expert.email}`} className="text-primary hover:underline">
-                          {expert.email}
-                        </a>
+                      {/* Contact Information */}
+                      <div className="space-y-2">
+                        <h4 className="font-semibold">Contact Information</h4>
+                        <div className="space-y-1 text-sm">
+                          <p>
+                            <Users className="inline h-3 w-3 mr-2" />
+                            {partner.contact.name}
+                          </p>
+                          <p>
+                            <Mail className="inline h-3 w-3 mr-2" />
+                            <a
+                              href={`mailto:${partner.contact.email}`}
+                              className="text-primary hover:underline"
+                            >
+                              {partner.contact.email}
+                            </a>
+                          </p>
+                          <p>
+                            <Phone className="inline h-3 w-3 mr-2" />
+                            {partner.contact.phone}
+                          </p>
+                          <p>
+                            <ExternalLink className="inline h-3 w-3 mr-2" />
+                            <a
+                              href={partner.website}
+                              target="_blank"
+                              rel="noopener noreferrer"
+                              className="text-primary hover:underline"
+                            >
+                              {partner.website}
+                            </a>
+                          </p>
+                        </div>
                       </div>
-                      <div className="flex items-center gap-2 text-sm">
-                        <Phone className="h-4 w-4 text-muted-foreground" />
-                        <span className="text-muted-foreground">{expert.phone}</span>
-                      </div>
-                    </div>
 
-                    <div className="flex gap-2 pt-2">
-                      <Button variant="outline" size="sm" className="flex-1">
-                        View Profile
-                      </Button>
-                      <Button size="sm" className="flex-1">
-                        <Send className="mr-2 h-4 w-4" />
-                        Contact Expert
-                      </Button>
-                    </div>
-                  </CardContent>
-                </Card>
-              ))}
-            </div>
+                      <Separator />
 
-            {filteredExperts.length === 0 && (
-              <Card>
-                <CardContent className="py-12 text-center">
-                  <p className="text-muted-foreground">No experts found matching your criteria.</p>
-                  <Button
-                    variant="outline"
-                    onClick={() => {
-                      setExpertSearch('');
-                      setExpertCountryFilter('all');
-                      setExpertExpertiseFilter('all');
-                    }}
-                    className="mt-4"
-                  >
-                    Clear Filters
-                  </Button>
-                </CardContent>
-              </Card>
-            )}
-          </TabsContent>
+                      {/* Active Projects */}
+                      <div className="space-y-3">
+                        <h4 className="font-semibold">Active Projects</h4>
+                        {partner.activeProjects.map((project, index) => (
+                          <div key={index} className="p-3 bg-muted rounded-lg">
+                            <div className="flex items-center justify-between mb-2">
+                              <p className="font-medium">{project.name}</p>
+                              <div className="flex items-center gap-2">
+                                <Badge variant="outline">{project.sdg}</Badge>
+                                {getStatusBadge(project.status)}
+                              </div>
+                            </div>
+                            <p className="text-sm text-muted-foreground">
+                              Budget: {formatCurrency(project.budget)}
+                            </p>
+                          </div>
+                        ))}
+                      </div>
 
-          {/* Enhanced Case Studies Tab */}
-          <TabsContent value="case-studies" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Global Success Stories</h2>
-              <p className="text-muted-foreground">
-                Detailed case studies with multimedia resources and key lessons learned
-              </p>
-            </div>
+                      <Separator />
 
-            <div className="grid grid-cols-1 gap-6">
-              {enhancedCaseStudies.map((study) => (
-                <Card key={study.id} className="hover:shadow-lg transition-shadow">
-                  <CardHeader>
-                    <div className="flex items-start justify-between">
+                      {/* Expertise */}
                       <div>
-                        <CardTitle className="text-xl mb-2">{study.title}</CardTitle>
-                        <CardDescription>{study.description}</CardDescription>
-                        <div className="flex flex-wrap gap-2 mt-3">
-                          <Badge variant="outline">
-                            <MapPin className="mr-1 h-3 w-3" />
-                            {study.country}
-                          </Badge>
-                          <Badge variant="secondary">{study.sector}</Badge>
-                          <Badge variant="outline">
-                            <Calendar className="mr-1 h-3 w-3" />
-                            {study.year}
-                          </Badge>
+                        <h4 className="font-semibold mb-2">Areas of Expertise</h4>
+                        <div className="flex flex-wrap gap-2">
+                          {partner.expertise.map((exp, index) => (
+                            <Badge key={index} variant="secondary">
+                              {exp}
+                            </Badge>
+                          ))}
                         </div>
                       </div>
-                      <div className="flex flex-col gap-2">
-                        <Badge className="bg-green-100 text-green-800">
-                          {study.successRate}% Success Rate
-                        </Badge>
-                        <Badge className="bg-blue-100 text-blue-800">
-                          {study.adaptability}% Adaptable to India
-                        </Badge>
+                    </>
+                  )}
+
+                  <div className="flex gap-2 pt-2">
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <Mail className="mr-2 h-4 w-4" />
+                      Contact
+                    </Button>
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <FileText className="mr-2 h-4 w-4" />
+                      View Projects
+                    </Button>
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <ExternalLink className="mr-2 h-4 w-4" />
+                      Website
+                    </Button>
+                  </div>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
+
+        {/* Projects Tab */}
+        <TabsContent value="projects" className="mt-6">
+          <div className="space-y-4">
+            {internationalData.projects.map((project) => (
+              <Card key={project.id}>
+                <CardHeader>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-2 mb-2">
+                        <CardTitle className="text-xl">{project.name}</CardTitle>
+                        {getStatusBadge(project.status)}
                       </div>
+                      <CardDescription>{project.description}</CardDescription>
                     </div>
-                  </CardHeader>
-                  <CardContent className="space-y-6">
-                    {/* Key Outcomes */}
-                    <div>
-                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
-                        <Target className="h-4 w-4 text-green-600" />
-                        Key Outcomes
-                      </h4>
-                      <ul className="space-y-2">
-                        {study.outcomes.map((outcome, index) => (
-                          <li key={index} className="flex items-start gap-2 text-sm">
-                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
-                            <span>{outcome}</span>
-                          </li>
-                        ))}
-                      </ul>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  {/* Progress */}
+                  <div className="space-y-2">
+                    <div className="flex items-center justify-between text-sm">
+                      <span className="font-medium">Progress</span>
+                      <span className="text-muted-foreground">{project.progress}%</span>
                     </div>
+                    <Progress value={project.progress} className="h-2" />
+                  </div>
 
-                    {/* Budget and Beneficiaries */}
-                    <div className="grid grid-cols-2 gap-4">
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
-                        <p className="text-lg font-bold">{study.budget}</p>
-                      </div>
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
-                        <p className="text-lg font-bold">{study.beneficiaries}</p>
-                      </div>
+                  {/* Project Details */}
+                  <div className="grid md:grid-cols-4 gap-4 text-sm">
+                    <div>
+                      <p className="text-muted-foreground mb-1">Budget</p>
+                      <p className="font-medium">{formatCurrency(project.budget)}</p>
                     </div>
-
-                    {/* Multimedia Resources */}
                     <div>
-                      <h4 className="text-sm font-semibold mb-3">Multimedia Resources</h4>
-                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
-                        <Button variant="outline" size="sm" className="w-full">
-                          <Play className="mr-2 h-4 w-4" />
-                          Watch Video
-                        </Button>
-                        <Button variant="outline" size="sm" className="w-full">
-                          <ImageIcon className="mr-2 h-4 w-4" />
-                          View Infographic
-                        </Button>
-                        <Button variant="outline" size="sm" className="w-full">
-                          <FileText className="mr-2 h-4 w-4" />
-                          Download Report
-                        </Button>
-                      </div>
+                      <p className="text-muted-foreground mb-1">Spent</p>
+                      <p className="font-medium">
+                        {formatCurrency(project.spent)} (
+                        {Math.round((project.spent / project.budget) * 100)}%)
+                      </p>
                     </div>
-
-                    {/* Key Lessons */}
                     <div>
-                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
-                        <Award className="h-4 w-4 text-purple-600" />
-                        Key Lessons for India
-                      </h4>
-                      <ul className="space-y-2">
-                        {study.keyLessons.map((lesson, index) => (
-                          <li key={index} className="flex items-start gap-2 text-sm">
-                            <span className="text-primary font-semibold mt-0.5">{index + 1}.</span>
-                            <span>{lesson}</span>
-                          </li>
-                        ))}
-                      </ul>
+                      <p className="text-muted-foreground mb-1">Timeline</p>
+                      <p className="font-medium">
+                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
+                      </p>
                     </div>
-
-                    <div className="flex gap-2 pt-2 border-t">
-                      <Button variant="outline" size="sm" className="flex-1">
-                        View Full Case Study
-                      </Button>
-                      <Button size="sm" className="flex-1">
-                        <ExternalLink className="mr-2 h-4 w-4" />
-                        Adapt to India
-                      </Button>
+                    <div>
+                      <p className="text-muted-foreground mb-1">Beneficiaries</p>
+                      <p className="font-medium">{project.beneficiaries.toLocaleString()}</p>
                     </div>
-                  </CardContent>
-                </Card>
-              ))}
-            </div>
-          </TabsContent>
+                  </div>
 
-          {/* Interactive Policy Map Tab */}
-          <TabsContent value="policy-map" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Global Policy Adoption Map</h2>
-              <p className="text-muted-foreground">
-                Visualize policy adoption and success rates across countries and regions
-              </p>
-            </div>
-
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Globe className="h-5 w-5 text-primary" />
-                  Interactive World Map
-                </CardTitle>
-                <CardDescription>
-                  Click on countries to view detailed policy information
-                </CardDescription>
-              </CardHeader>
-              <CardContent>
-                {/* Placeholder for interactive map - would integrate with mapping library */}
-                <div className="bg-muted/30 rounded-lg p-12 text-center">
-                  <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
-                  <p className="text-muted-foreground mb-2">
-                    Interactive map visualization would be displayed here
-                  </p>
-                  <p className="text-sm text-muted-foreground">
-                    Integration with mapping library (e.g., Leaflet, Mapbox) for interactive policy exploration
-                  </p>
-                </div>
-              </CardContent>
-            </Card>
-
-            {/* Policy Adoption Statistics by Region */}
-            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
-              {policyAdoptionData.map((data, index) => (
-                <Card key={index}>
-                  <CardHeader>
-                    <div className="flex items-center justify-between">
-                      <CardTitle className="text-base">{data.country}</CardTitle>
-                      <Badge variant="secondary">{data.region}</Badge>
+                  {/* Partners & SDGs */}
+                  <div className="grid md:grid-cols-2 gap-4">
+                    <div>
+                      <p className="text-sm font-medium mb-2">Partners</p>
+                      <div className="flex flex-wrap gap-1">
+                        {project.partners.map((partner, index) => (
+                          <Badge key={index} variant="secondary" className="text-xs">
+                            {partner}
+                          </Badge>
+                        ))}
+                      </div>
                     </div>
-                  </CardHeader>
-                  <CardContent>
-                    <div className="space-y-2">
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Policies Adopted</p>
-                        <p className="text-3xl font-bold">{data.policies}</p>
+                    <div>
+                      <p className="text-sm font-medium mb-2">SDGs</p>
+                      <div className="flex flex-wrap gap-1">
+                        {project.sdgs.map((sdg, index) => (
+                          <Badge key={index} variant="outline" className="text-xs">
+                            {sdg}
+                          </Badge>
+                        ))}
                       </div>
-                      <Button variant="outline" size="sm" className="w-full mt-4">
-                        <Eye className="mr-2 h-4 w-4" />
-                        View Policies
-                      </Button>
                     </div>
-                  </CardContent>
-                </Card>
-              ))}
-            </div>
+                  </div>
 
-            {/* Regional Summary */}
-            <Card>
-              <CardHeader>
-                <CardTitle>Regional Policy Adoption Summary</CardTitle>
-              </CardHeader>
-              <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
+                  {/* Countries */}
                   <div>
-                    <p className="text-sm text-muted-foreground mb-2">Asia</p>
-                    <p className="text-2xl font-bold">32 policies</p>
-                    <p className="text-xs text-muted-foreground mt-1">2 countries</p>
+                    <p className="text-sm font-medium mb-2">Countries</p>
+                    <p className="text-sm text-muted-foreground">{project.countries.join(', ')}</p>
                   </div>
-                  <div>
-                    <p className="text-sm text-muted-foreground mb-2">Europe</p>
-                    <p className="text-2xl font-bold">39 policies</p>
-                    <p className="text-xs text-muted-foreground mt-1">3 countries</p>
+
+                  <div className="flex gap-2 pt-2">
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <FileText className="mr-2 h-4 w-4" />
+                      View Report
+                    </Button>
+                    <Button variant="outline" size="sm" className="flex-1">
+                      <Download className="mr-2 h-4 w-4" />
+                      Download Data
+                    </Button>
                   </div>
-                  <div>
-                    <p className="text-sm text-muted-foreground mb-2">Africa</p>
-                    <p className="text-2xl font-bold">17 policies</p>
-                    <p className="text-xs text-muted-foreground mt-1">2 countries</p>
-                  </div>
-                  <div>
-                    <p className="text-sm text-muted-foreground mb-2">South America</p>
-                    <p className="text-2xl font-bold">12 policies</p>
-                    <p className="text-xs text-muted-foreground mt-1">1 country</p>
-                  </div>
-                </div>
-              </CardContent>
-            </Card>
-          </TabsContent>
+                </CardContent>
+              </Card>
+            ))}
+          </div>
+        </TabsContent>
 
-          {/* Support Requests Tab */}
-          <TabsContent value="requests" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Support Request Tracking</h2>
-              <p className="text-muted-foreground">
-                Monitor status of technical assistance and funding requests
-              </p>
-            </div>
-
-            <div className="grid grid-cols-1 gap-4">
-              {requests.map((request) => (
-                <Card key={request.id} className="hover:shadow-lg transition-shadow">
-                  <CardHeader>
-                    <div className="flex items-start justify-between">
-                      <div className="flex items-start gap-3">
-                        {getStatusIcon(request.status)}
-                        <div className="flex-1">
-                          <CardTitle className="text-lg mb-1">{request.title}</CardTitle>
-                          <CardDescription>{request.description}</CardDescription>
-                        </div>
-                      </div>
-                      {getStatusBadge(request.status)}
-                    </div>
-                  </CardHeader>
-                  <CardContent className="space-y-4">
-                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Organization</p>
+        {/* Funding Tab */}
+        <TabsContent value="funding" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Funding Opportunities</CardTitle>
+              <CardDescription>Available grants and funding programs</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <Table>
+                <TableHeader>
+                  <TableRow>
+                    <TableHead>Title</TableHead>
+                    <TableHead>Organization</TableHead>
+                    <TableHead>Amount</TableHead>
+                    <TableHead>Deadline</TableHead>
+                    <TableHead>Focus Areas</TableHead>
+                    <TableHead>Status</TableHead>
+                    <TableHead></TableHead>
+                  </TableRow>
+                </TableHeader>
+                <TableBody>
+                  {internationalData.fundingOpportunities.map((funding) => (
+                    <TableRow key={funding.id}>
+                      <TableCell className="font-medium">{funding.title}</TableCell>
+                      <TableCell>{funding.organization}</TableCell>
+                      <TableCell>{formatCurrency(funding.amount)}</TableCell>
+                      <TableCell>
                         <div className="flex items-center gap-2">
-                          <Globe className="h-4 w-4 text-primary" />
-                          <p className="text-sm font-medium">{request.organization}</p>
+                          <Calendar className="h-3 w-3" />
+                          {formatDate(funding.deadline)}
                         </div>
-                      </div>
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Requested By</p>
-                        <div className="flex items-center gap-2">
-                          <Building2 className="h-4 w-4 text-primary" />
-                          <p className="text-sm font-medium">{request.requestedBy}</p>
+                      </TableCell>
+                      <TableCell>
+                        <div className="flex flex-wrap gap-1">
+                          {funding.focusAreas.slice(0, 2).map((area, index) => (
+                            <Badge key={index} variant="outline" className="text-xs">
+                              {area}
+                            </Badge>
+                          ))}
+                          {funding.focusAreas.length > 2 && (
+                            <Badge variant="outline" className="text-xs">
+                              +{funding.focusAreas.length - 2}
+                            </Badge>
+                          )}
                         </div>
-                      </div>
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Submission Date</p>
-                        <div className="flex items-center gap-2">
-                          <Calendar className="h-4 w-4 text-primary" />
-                          <p className="text-sm font-medium">{request.date}</p>
-                        </div>
-                      </div>
-                    </div>
+                      </TableCell>
+                      <TableCell>
+                        <Badge
+                          variant={funding.status === 'open' ? 'default' : 'secondary'}
+                          className={funding.status === 'open' ? 'bg-green-500' : ''}
+                        >
+                          {funding.status}
+                        </Badge>
+                      </TableCell>
+                      <TableCell>
+                        <Button variant="outline" size="sm" asChild>
+                          <a
+                            href={funding.applicationUrl}
+                            target="_blank"
+                            rel="noopener noreferrer"
+                          >
+                            Apply
+                          </a>
+                        </Button>
+                      </TableCell>
+                    </TableRow>
+                  ))}
+                </TableBody>
+              </Table>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-                    {/* Timeline Tracking */}
-                    {request.timeline && (
-                      <div className="space-y-3">
-                        <p className="text-xs font-semibold text-muted-foreground uppercase">Progress Timeline</p>
-                        <div className="relative">
-                          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
-                          <div className="space-y-3">
-                            {request.timeline.map((stage: any, idx: number) => (
-                              <div key={idx} className="flex items-start gap-3 relative">
-                                <div className={`w-4 h-4 rounded-full border-2 z-10 ${
-                                  stage.status === 'completed' ? 'bg-green-500 border-green-500' :
-                                  stage.status === 'current' ? 'bg-blue-500 border-blue-500 animate-pulse' :
-                                  'bg-muted border-border'
-                                }`} />
-                                <div className="flex-1 pb-3">
-                                  <p className={`text-sm font-medium ${
-                                    stage.status === 'current' ? 'text-primary' : 'text-foreground'
-                                  }`}>{stage.stage}</p>
-                                  <p className="text-xs text-muted-foreground">{stage.date}</p>
-                                </div>
-                              </div>
-                            ))}
-                          </div>
+        {/* Experts Tab */}
+        <TabsContent value="experts" className="mt-6">
+          <Card>
+            <CardHeader>
+              <CardTitle>Expert Network</CardTitle>
+              <CardDescription>Connect with international SDG experts</CardDescription>
+            </CardHeader>
+            <CardContent>
+              <div className="space-y-4">
+                {internationalData.experts.map((expert) => (
+                  <div
+                    key={expert.id}
+                    className="flex items-start justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
+                  >
+                    <div className="flex-1">
+                      <div className="flex items-center gap-3 mb-2">
+                        <Users className="h-5 w-5 text-muted-foreground" />
+                        <div>
+                          <p className="font-semibold">{expert.name}</p>
+                          <p className="text-sm text-muted-foreground">
+                            {expert.title} at {expert.organization}
+                          </p>
                         </div>
                       </div>
-                    )}
-
-                    {/* Additional Tracking Info */}
-                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Assigned Officer</p>
-                        <p className="text-sm font-medium">{request.assignedOfficer}</p>
+                      <p className="text-sm text-muted-foreground mb-2">
+                        <MapPin className="inline h-3 w-3 mr-1" />
+                        {expert.country}
+                      </p>
+                      <div className="flex flex-wrap gap-2 mb-2">
+                        {expert.expertise.map((exp, index) => (
+                          <Badge key={index} variant="secondary" className="text-xs">
+                            {exp}
+                          </Badge>
+                        ))}
                       </div>
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Next Follow-up</p>
-                        <div className="flex items-center gap-1">
-                          <Clock className="h-3 w-3 text-orange-500" />
-                          <p className="text-sm font-medium">{request.nextFollowUp}</p>
-                        </div>
+                      <div className="flex flex-wrap gap-2 mb-2">
+                        {expert.sdgs.map((sdg, index) => (
+                          <Badge key={index} variant="outline" className="text-xs">
+                            {sdg}
+                          </Badge>
+                        ))}
                       </div>
-                      <div>
-                        <p className="text-xs text-muted-foreground mb-1">Est. Completion</p>
-                        <p className="text-sm font-medium">{request.estimatedCompletion}</p>
+                      <div className="flex gap-4 text-sm text-muted-foreground">
+                        <span>{expert.publications} publications</span>
+                        <span>{expert.projects} projects</span>
                       </div>
                     </div>
-
-                    <div className="flex gap-2">
-                      <Button variant="outline" size="sm" className="flex-1">
-                        View Details
+                    <div className="flex flex-col gap-2">
+                      <Button variant="outline" size="sm" asChild>
+                        <a href={`mailto:${expert.email}`}>
+                          <Mail className="mr-2 h-4 w-4" />
+                          Email
+                        </a>
                       </Button>
-                      <Button variant="outline" size="sm" className="flex-1">
-                        <FileText className="mr-2 h-4 w-4" />
-                        Download Documents
+                      <Button variant="outline" size="sm" asChild>
+                        <a href={expert.linkedin} target="_blank" rel="noopener noreferrer">
+                          <ExternalLink className="mr-2 h-4 w-4" />
+                          LinkedIn
+                        </a>
                       </Button>
-                      <Button variant="outline" size="sm" className="flex-1">
-                        <Calendar className="mr-2 h-4 w-4" />
-                        Schedule Meeting
-                      </Button>
                     </div>
-                  </CardContent>
-                </Card>
-              ))}
-            </div>
-          </TabsContent>
+                  </div>
+                ))}
+              </div>
+            </CardContent>
+          </Card>
+        </TabsContent>
 
-          {/* Funding Tracker Tab */}
-          <TabsContent value="funding" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Funding & Resource Transparency</h2>
-              <p className="text-muted-foreground">
-                Track allocation and utilization of international aid, loans, and grants
-              </p>
-            </div>
-
-            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
-              <Card className="lg:col-span-2">
+        {/* Knowledge Exchange Tab */}
+        <TabsContent value="knowledge" className="mt-6">
+          <div className="space-y-4">
+            {internationalData.knowledgeExchange.map((event) => (
+              <Card key={event.id}>
                 <CardHeader>
-                  <CardTitle className="flex items-center gap-2">
-                    <DollarSign className="h-5 w-5 text-green-600" />
-                    Funding Streams
-                  </CardTitle>
-                  <CardDescription>Detailed breakdown of all funding sources</CardDescription>
+                  <div className="flex items-start justify-between">
+                    <div className="flex-1">
+                      <div className="flex items-center gap-2 mb-2">
+                        <CardTitle className="text-lg">{event.title}</CardTitle>
+                        <Badge variant="secondary">{event.type}</Badge>
+                      </div>
+                      <CardDescription>
+                        <Calendar className="inline h-3 w-3 mr-1" />
+                        {formatDate(event.date)} • {event.participants} participants •{' '}
+                        {event.countries.length} countries
+                      </CardDescription>
+                    </div>
+                  </div>
                 </CardHeader>
                 <CardContent className="space-y-4">
-                  {fundingStreams.map((fund) => (
-                    <Card key={fund.id}>
-                      <CardHeader>
-                        <div className="flex items-start justify-between">
-                          <div>
-                            <CardTitle className="text-base mb-1">{fund.source}</CardTitle>
-                            <CardDescription>{fund.purpose}</CardDescription>
-                          </div>
-                          <Badge variant="secondary">{fund.type}</Badge>
-                        </div>
-                      </CardHeader>
-                      <CardContent className="space-y-4">
-                        <div className="grid grid-cols-3 gap-4">
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
-                            <p className="text-lg font-bold">{fund.amount}</p>
-                          </div>
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Utilized</p>
-                            <p className="text-lg font-bold">${fund.utilized}M</p>
-                          </div>
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Utilization Rate</p>
-                            <p className="text-lg font-bold">{Math.round((fund.utilized / fund.allocated) * 100)}%</p>
-                          </div>
-                        </div>
-
-                        <div>
-                          <div className="flex items-center justify-between mb-2">
-                            <span className="text-xs text-muted-foreground">Progress</span>
-                            <span className="text-xs font-medium">${fund.utilized}M / ${fund.allocated}M</span>
-                          </div>
-                          <Progress value={(fund.utilized / fund.allocated) * 100} className="h-2" />
-                        </div>
-
-                        <div className="flex items-center justify-between text-sm">
-                          <div className="flex items-center gap-2">
-                            <Calendar className="h-4 w-4 text-muted-foreground" />
-                            <span className="text-muted-foreground">{fund.startDate} - {fund.endDate}</span>
-                          </div>
-                          <div className="flex gap-1">
-                            {fund.sdgs.map((sdg) => (
-                              <Badge key={sdg} variant="outline" className="text-xs">SDG {sdg}</Badge>
-                            ))}
-                          </div>
-                        </div>
-
-                        {/* Impact Metrics */}
-                        {fund.impact && (
-                          <div className="border-t pt-4 space-y-3">
-                            <div className="flex items-center justify-between">
-                              <h4 className="text-sm font-semibold flex items-center gap-2">
-                                <Target className="h-4 w-4 text-green-600" />
-                                Impact & Outcomes
-                              </h4>
-                              <div className="flex items-center gap-2">
-                                <Users className="h-4 w-4 text-blue-600" />
-                                <span className="text-sm font-medium">{fund.impact.beneficiaries}</span>
-                              </div>
-                            </div>
-
-                            <div className="space-y-2">
-                              {fund.impact.outcomes.map((outcome, idx) => (
-                                <div key={idx} className="space-y-1">
-                                  <div className="flex items-center justify-between text-xs">
-                                    <span className="text-muted-foreground">{outcome.metric}</span>
-                                    <span className="font-medium">{outcome.value} / {outcome.target}</span>
-                                  </div>
-                                  <Progress value={outcome.progress} className="h-1.5" />
-                                </div>
-                              ))}
-                            </div>
-
-                            <div className="flex items-center justify-between pt-2 border-t">
-                              <span className="text-xs text-muted-foreground">Accountability Score</span>
-                              <div className="flex items-center gap-1">
-                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
-                                <span className="text-sm font-bold">{fund.impact.accountability.toFixed(1)}/5.0</span>
-                              </div>
-                            </div>
-                          </div>
-                        )}
-                      </CardContent>
-                    </Card>
-                  ))}
-                </CardContent>
-              </Card>
-
-              <Card>
-                <CardHeader>
-                  <CardTitle className="flex items-center gap-2">
-                    <PieChart className="h-5 w-5 text-blue-600" />
-                    Funding Summary
-                  </CardTitle>
-                  <CardDescription>Overall financial overview</CardDescription>
-                </CardHeader>
-                <CardContent className="space-y-6">
+                  {/* Topics */}
                   <div>
-                    <p className="text-sm text-muted-foreground mb-2">Total Allocated</p>
-                    <p className="text-3xl font-bold">$575.5M</p>
+                    <p className="text-sm font-medium mb-2">Topics Covered</p>
+                    <div className="flex flex-wrap gap-2">
+                      {event.topics.map((topic, index) => (
+                        <Badge key={index} variant="outline">
+                          {topic}
+                        </Badge>
+                      ))}
+                    </div>
                   </div>
 
+                  {/* Outcomes */}
                   <div>
-                    <p className="text-sm text-muted-foreground mb-2">Total Utilized</p>
-                    <p className="text-3xl font-bold text-green-600">$444.3M</p>
-                    <p className="text-xs text-muted-foreground mt-1">77.2% utilization rate</p>
+                    <p className="text-sm font-medium mb-2">Key Outcomes</p>
+                    <p className="text-sm text-muted-foreground">{event.outcomes}</p>
                   </div>
 
+                  {/* Resources */}
                   <div>
-                    <p className="text-sm text-muted-foreground mb-2">Remaining Balance</p>
-                    <p className="text-3xl font-bold text-blue-600">$131.2M</p>
+                    <p className="text-sm font-medium mb-2">Available Resources</p>
+                    <div className="flex flex-wrap gap-2">
+                      {event.resources.map((resource, index) => (
+                        <Button key={index} variant="outline" size="sm">
+                          <Download className="mr-2 h-3 w-3" />
+                          {resource}
+                        </Button>
+                      ))}
+                    </div>
                   </div>
 
-                  <div className="pt-4 border-t">
-                    <h4 className="text-sm font-semibold mb-3">By Type</h4>
-                    <div className="space-y-3">
-                      <div>
-                        <div className="flex items-center justify-between mb-1">
-                          <span className="text-sm">Loans</span>
-                          <span className="text-sm font-semibold">$450M</span>
-                        </div>
-                        <Progress value={78} className="h-1.5" />
-                      </div>
-                      <div>
-                        <div className="flex items-center justify-between mb-1">
-                          <span className="text-sm">Grants</span>
-                          <span className="text-sm font-semibold">$40.5M</span>
-                        </div>
-                        <Progress value={85} className="h-1.5" />
-                      </div>
-                      <div>
-                        <div className="flex items-center justify-between mb-1">
-                          <span className="text-sm">Technical Assistance</span>
-                          <span className="text-sm font-semibold">$85M</span>
-                        </div>
-                        <Progress value={80} className="h-1.5" />
-                      </div>
-                    </div>
+                  {/* Countries */}
+                  <div>
+                    <p className="text-sm font-medium mb-2">Participating Countries</p>
+                    <p className="text-sm text-muted-foreground">{event.countries.join(', ')}</p>
                   </div>
                 </CardContent>
               </Card>
-            </div>
+            ))}
+          </div>
+        </TabsContent>
 
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <MapPin className="h-5 w-5 text-orange-600" />
-                  District-Level Funding Allocation
-                </CardTitle>
-                <CardDescription>Geographic distribution of international funding</CardDescription>
-              </CardHeader>
-              <CardContent>
-                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
-                  {districtFunding.map((district, index) => (
-                    <Card key={index}>
-                      <CardHeader>
-                        <div className="flex items-center justify-between">
-                          <CardTitle className="text-base">{district.name}</CardTitle>
-                          <Badge className={getStatusColor(district.status)}>
-                            {district.status.replace('-', ' ')}
-                          </Badge>
-                        </div>
-                      </CardHeader>
-                      <CardContent className="space-y-3">
-                        <div className="grid grid-cols-2 gap-3">
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Allocated</p>
-                            <p className="text-lg font-bold">${district.allocated}M</p>
-                          </div>
-                          <div>
-                            <p className="text-xs text-muted-foreground mb-1">Utilized</p>
-                            <p className="text-lg font-bold">${district.utilized}M</p>
-                          </div>
-                        </div>
-                        <div>
-                          <div className="flex items-center justify-between mb-1">
-                            <span className="text-xs text-muted-foreground">Utilization</span>
-                            <span className="text-xs font-medium">{Math.round((district.utilized / district.allocated) * 100)}%</span>
-                          </div>
-                          <Progress value={(district.utilized / district.allocated) * 100} className="h-1.5" />
-                        </div>
-                        <div className="flex items-center justify-between text-sm">
-                          <span className="text-muted-foreground">Active Projects</span>
-                          <span className="font-semibold">{district.projects}</span>
-                        </div>
-                      </CardContent>
-                    </Card>
-                  ))}
-                </div>
-              </CardContent>
-            </Card>
-
-            <Card className="bg-blue-50 border-blue-200">
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Eye className="h-5 w-5 text-blue-600" />
-                  Public Transparency Dashboard
-                </CardTitle>
-                <CardDescription>
-                  View citizen-facing dashboard with simplified funding information
-                </CardDescription>
-              </CardHeader>
-              <CardContent>
-                <Button size="lg">
-                  <Eye className="mr-2 h-5 w-5" />
-                  View Public Dashboard
-                </Button>
-              </CardContent>
-            </Card>
-          </TabsContent>
-
-          {/* Submit Request Tab */}
-          <TabsContent value="new-request" className="space-y-6">
-            <div>
-              <h2 className="text-2xl font-bold mb-2">Submit Support Request</h2>
-              <p className="text-muted-foreground">
-                Request technical assistance, funding, or capacity building support
-              </p>
-            </div>
-
-            <Card>
-              <CardHeader>
-                <CardTitle>Request Form</CardTitle>
-                <CardDescription>
-                  Fill out the form below to submit a request to international partners
-                </CardDescription>
-              </CardHeader>
-              <CardContent className="space-y-6">
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                  <div className="space-y-2">
-                    <Label htmlFor="organization">Partner Organization *</Label>
-                    <Select>
-                      <SelectTrigger id="organization">
-                        <SelectValue placeholder="Select organization" />
-                      </SelectTrigger>
-                      <SelectContent>
-                        <SelectItem value="undp">UNDP</SelectItem>
-                        <SelectItem value="worldbank">World Bank</SelectItem>
-                        <SelectItem value="imf">IMF</SelectItem>
-                        <SelectItem value="unicef">UNICEF</SelectItem>
-                      </SelectContent>
-                    </Select>
+        {/* Insights Tab */}
+        <TabsContent value="insights" className="mt-6">
+          <div className="space-y-4">
+            {internationalData.insights.map((insight, index) => (
+              <div key={index} className={`flex gap-3 p-4 rounded-lg ${getInsightBg(insight.type)}`}>
+                {getInsightIcon(insight.type)}
+                <div className="flex-1">
+                  <div className="flex items-center justify-between mb-2">
+                    <p className="font-medium">{insight.title}</p>
+                    <Badge
+                      variant={
+                        insight.priority === 'high'
+                          ? 'destructive'
+                          : insight.priority === 'medium'
+                          ? 'default'
+                          : 'secondary'
+                      }
+                    >
+                      {insight.priority}
+                    </Badge>
                   </div>
-
-                  <div className="space-y-2">
-                    <Label htmlFor="department">Requesting Department *</Label>
-                    <Input id="department" placeholder="e.g., Health & Family Welfare" />
+                  <p className="text-sm mb-2">{insight.description}</p>
+                  <div className="flex items-center gap-2 text-sm">
+                    <Target className="h-4 w-4" />
+                    <span className="font-medium">Impact: {insight.impact}</span>
                   </div>
                 </div>
-
-                <div className="space-y-2">
-                  <Label htmlFor="title">Request Title *</Label>
-                  <Input id="title" placeholder="Brief title of your request" />
-                </div>
-
-                <div className="space-y-2">
-                  <Label htmlFor="type">Request Type *</Label>
-                  <Select>
-                    <SelectTrigger id="type">
-                      <SelectValue placeholder="Select request type" />
-                    </SelectTrigger>
-                    <SelectContent>
-                      <SelectItem value="technical">Technical Assistance</SelectItem>
-                      <SelectItem value="funding">Funding Request</SelectItem>
-                      <SelectItem value="capacity">Capacity Building</SelectItem>
-                      <SelectItem value="consultation">Policy Consultation</SelectItem>
-                    </SelectContent>
-                  </Select>
-                </div>
-
-                <div className="space-y-2">
-                  <Label htmlFor="sdg">Related SDG(s) *</Label>
-                  <Select>
-                    <SelectTrigger id="sdg">
-                      <SelectValue placeholder="Select SDG" />
-                    </SelectTrigger>
-                    <SelectContent>
-                      <SelectItem value="1">SDG 1: No Poverty</SelectItem>
-                      <SelectItem value="2">SDG 2: Zero Hunger</SelectItem>
-                      <SelectItem value="3">SDG 3: Good Health</SelectItem>
-                      <SelectItem value="4">SDG 4: Quality Education</SelectItem>
-                      <SelectItem value="6">SDG 6: Clean Water</SelectItem>
-                    </SelectContent>
-                  </Select>
-                </div>
-
-                <div className="space-y-2">
-                  <Label htmlFor="description">Detailed Description *</Label>
-                  <Textarea
-                    id="description"
-                    placeholder="Provide a detailed description of your request, including objectives, expected outcomes, and timeline"
-                    rows={6}
-                  />
-                </div>
-
-                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
-                  <div className="space-y-2">
-                    <Label htmlFor="priority">Priority Level *</Label>
-                    <Select>
-                      <SelectTrigger id="priority">
-                        <SelectValue placeholder="Select priority" />
-                      </SelectTrigger>
-                      <SelectContent>
-                        <SelectItem value="high">High</SelectItem>
-                        <SelectItem value="medium">Medium</SelectItem>
-                        <SelectItem value="low">Low</SelectItem>
-                      </SelectContent>
-                    </Select>
-                  </div>
-
-                  <div className="space-y-2">
-                    <Label htmlFor="timeline">Expected Timeline</Label>
-                    <Input id="timeline" placeholder="e.g., 6 months" />
-                  </div>
-                </div>
-
-                <div className="space-y-2">
-                  <Label htmlFor="contact">Contact Person *</Label>
-                  <Input id="contact" placeholder="Name and email of contact person" />
-                </div>
-
-                <div className="flex gap-3 pt-4">
-                  <Button size="lg" className="flex-1">
-                    <Send className="mr-2 h-5 w-5" />
-                    Submit Request
-                  </Button>
-                  <Button variant="outline" size="lg">
-                    Save as Draft
-                  </Button>
-                </div>
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
     </div>
   );
  }
