import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertCircle,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  DollarSign,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Network,
  Zap,
  Plus,
  Link as LinkIcon,
  FileText,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CrossMinistryData {
  overview: {
    totalMinistries: number;
    activeCollaborations: number;
    sharedInitiatives: number;
    totalBudget: number;
    lastUpdated: string;
  };
  ministries: Array<{
    id: number;
    name: string;
    abbreviation: string;
    minister: string;
    budget: number;
    staff: number;
    sdgFocus: string[];
    performance: {
      overall: number;
      budgetUtilization: number;
      projectCompletion: number;
      stakeholderSatisfaction: number;
      innovation: number;
    };
    activeProjects: number;
    completedProjects: number;
    collaborations: Array<{
      ministry: string;
      projects: number;
      budget: number;
    }>;
    keyInitiatives: Array<{
      name: string;
      sdg: string;
      status: string;
      progress: number;
      budget: number;
      partners: string[];
    }>;
    strengths: string[];
    challenges: string[];
  }>;
  collaborationMatrix: Array<{
    ministry1: string;
    ministry2: string;
    projects: number;
    budget: number;
    sdgs: string[];
    status: string;
    effectiveness: number;
  }>;
  performanceMetrics: {
    averageScore: number;
    topPerformer: string;
    mostCollaborative: string;
    budgetLeader: string;
    innovationLeader: string;
  };
  insights: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    affectedMinistries: string[];
    potentialImpact: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    ministries: string[];
    estimatedCost: number;
    timeline: string;
    expectedImpact: string;
    priority: string;
  }>;
}

export default function CrossMinistryComparisonPage() {
  const [ministryData, setMinistryData] = useState<CrossMinistryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState<number | null>(null);
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);
  const [collaborationForm, setCollaborationForm] = useState({
    ministry1: '',
    ministry2: '',
    projectName: '',
    sdgs: '',
    budget: '',
    description: '',
  });

  useEffect(() => {
    fetchMinistryData();
  }, []);

  const fetchMinistryData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cross-ministry');
      const data = await response.json();

      if (data.success) {
        setMinistryData(data.data);
      } else {
        setError(data.error || 'Failed to fetch ministry data');
      }
    } catch (err) {
      setError('Failed to load ministry data. Please try again.');
      console.error('Ministry data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMinistryData();
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!ministryData) return;

    const report = JSON.stringify(ministryData, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cross-ministry-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const proposeCollaboration = async () => {
    if (!collaborationForm.ministry1 || !collaborationForm.ministry2 || !collaborationForm.projectName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/cross-ministry/collaborate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collaborationForm),
      });

      const data = await response.json();

      if (data.success) {
        alert('Collaboration proposal submitted successfully!');
        setShowCollaborationDialog(false);
        setCollaborationForm({
          ministry1: '',
          ministry2: '',
          projectName: '',
          sdgs: '',
          budget: '',
          description: '',
        });
      } else {
        alert(data.error || 'Failed to submit proposal');
      }
    } catch (err) {
      alert('Failed to submit collaboration proposal');
      console.error('Collaboration error:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'on-track') return <Badge className="bg-green-500">On Track</Badge>;
    if (status === 'at-risk') return <Badge className="bg-yellow-500">At Risk</Badge>;
    if (status === 'critical') return <Badge variant="destructive">Critical</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getInsightIcon = (type: string) => {
    if (type === 'opportunity') return <Lightbulb className="h-5 w-5 text-blue-600" />;
    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getInsightBg = (type: string) => {
    if (type === 'opportunity') return 'bg-blue-50 dark:bg-blue-950';
    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
    return 'bg-red-50 dark:bg-red-950';
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'critical') return <Badge variant="destructive">Critical</Badge>;
    if (priority === 'high') return <Badge className="bg-orange-500">High</Badge>;
    if (priority === 'medium') return <Badge variant="default">Medium</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading ministry data...</p>
        </div>
      </div>
    );
  }

  if (error || !ministryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
          <Button onClick={fetchMinistryData} className="mt-4">
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cross-Ministry Comparison</h1>
          <p className="text-muted-foreground">
            Analyze performance and collaboration across government ministries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showCollaborationDialog} onOpenChange={setShowCollaborationDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Propose Collaboration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Propose New Collaboration</DialogTitle>
                <DialogDescription>
                  Create a proposal for cross-ministry collaboration
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ministry1">Ministry 1</Label>
                    <Select
                      value={collaborationForm.ministry1}
                      onValueChange={(value) =>
                        setCollaborationForm({ ...collaborationForm, ministry1: value })
                      }
                    >
                      <SelectTrigger id="ministry1">
                        <SelectValue placeholder="Select ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        {ministryData.ministries.map((ministry) => (
                          <SelectItem key={ministry.id} value={ministry.name}>
                            {ministry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ministry2">Ministry 2</Label>
                    <Select
                      value={collaborationForm.ministry2}
                      onValueChange={(value) =>
                        setCollaborationForm({ ...collaborationForm, ministry2: value })
                      }
                    >
                      <SelectTrigger id="ministry2">
                        <SelectValue placeholder="Select ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        {ministryData.ministries.map((ministry) => (
                          <SelectItem key={ministry.id} value={ministry.name}>
                            {ministry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={collaborationForm.projectName}
                    onChange={(e) =>
                      setCollaborationForm({ ...collaborationForm, projectName: e.target.value })
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sdgs">Related SDGs</Label>
                  <Input
                    id="sdgs"
                    value={collaborationForm.sdgs}
                    onChange={(e) =>
                      setCollaborationForm({ ...collaborationForm, sdgs: e.target.value })
                    }
                    placeholder="e.g., SDG 4, SDG 8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={collaborationForm.budget}
                    onChange={(e) =>
                      setCollaborationForm({ ...collaborationForm, budget: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={collaborationForm.description}
                    onChange={(e) =>
                      setCollaborationForm({ ...collaborationForm, description: e.target.value })
                    }
                    placeholder="Describe the collaboration objectives and expected outcomes"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCollaborationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={proposeCollaboration}>Submit Proposal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ministries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministryData.overview.totalMinistries}</div>
            <p className="text-xs text-muted-foreground">Government departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministryData.overview.activeCollaborations}</div>
            <p className="text-xs text-muted-foreground">
              {ministryData.overview.sharedInitiatives} shared initiatives
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(ministryData.overview.totalBudget)}
            </div>
            <p className="text-xs text-muted-foreground">Combined allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(ministryData.performanceMetrics.averageScore)}`}>
              {ministryData.performanceMetrics.averageScore}
            </div>
            <p className="text-xs text-muted-foreground">Overall score</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Leaders */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Leaders</CardTitle>
          <CardDescription>Top performing ministries across key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Top Performer</span>
              </div>
              <p className="text-lg font-bold">{ministryData.performanceMetrics.topPerformer}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Most Collaborative</span>
              </div>
              <p className="text-lg font-bold">
                {ministryData.performanceMetrics.mostCollaborative}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Budget Leader</span>
              </div>
              <p className="text-lg font-bold">{ministryData.performanceMetrics.budgetLeader}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Innovation Leader</span>
              </div>
              <p className="text-lg font-bold">
                {ministryData.performanceMetrics.innovationLeader}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="ministries" className="w-full">
        <TabsList>
          <TabsTrigger value="ministries">Ministries</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Ministries Tab */}
        <TabsContent value="ministries" className="mt-6">
          <div className="space-y-4">
            {ministryData.ministries.map((ministry) => (
              <Card
                key={ministry.id}
                className={`hover:shadow-lg transition-shadow ${
                  selectedMinistry === ministry.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-xl">{ministry.name}</CardTitle>
                        <Badge variant="secondary">{ministry.abbreviation}</Badge>
                      </div>
                      <CardDescription>
                        Minister: {ministry.minister} • Budget: {formatCurrency(ministry.budget)} •
                        Staff: {ministry.staff.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedMinistry(selectedMinistry === ministry.id ? null : ministry.id)
                      }
                    >
                      {selectedMinistry === ministry.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SDG Focus */}
                  <div className="flex flex-wrap gap-2">
                    {ministry.sdgFocus.map((sdg, index) => (
                      <Badge key={index} variant="outline">
                        {sdg}
                      </Badge>
                    ))}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Overall</p>
                      <p className={`text-2xl font-bold ${getScoreColor(ministry.performance.overall)}`}>
                        {ministry.performance.overall}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className={`text-2xl font-bold ${getScoreColor(ministry.performance.budgetUtilization)}`}>
                        {ministry.performance.budgetUtilization}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Projects</p>
                      <p className={`text-2xl font-bold ${getScoreColor(ministry.performance.projectCompletion)}`}>
                        {ministry.performance.projectCompletion}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Satisfaction</p>
                      <p className={`text-2xl font-bold ${getScoreColor(ministry.performance.stakeholderSatisfaction)}`}>
                        {ministry.performance.stakeholderSatisfaction}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Innovation</p>
                      <p className={`text-2xl font-bold ${getScoreColor(ministry.performance.innovation)}`}>
                        {ministry.performance.innovation}
                      </p>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{ministry.activeProjects} active projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>{ministry.completedProjects} completed</span>
                    </div>
                  </div>

                  {/* Detailed View */}
                  {selectedMinistry === ministry.id && (
                    <>
                      <Separator />

                      {/* Collaborations */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          Active Collaborations
                        </h4>
                        {ministry.collaborations.map((collab, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{collab.ministry}</p>
                              <p className="text-sm text-muted-foreground">
                                {collab.projects} projects
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(collab.budget)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Key Initiatives */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Key Initiatives</h4>
                        {ministry.keyInitiatives.map((initiative, index) => (
                          <div key={index} className="space-y-2 p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{initiative.name}</p>
                                <Badge variant="outline">{initiative.sdg}</Badge>
                              </div>
                              {getStatusBadge(initiative.status)}
                            </div>
                            <Progress value={initiative.progress} className="h-2" />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Budget: {formatCurrency(initiative.budget)}
                              </span>
                              <span className="text-muted-foreground">
                                Progress: {initiative.progress}%
                              </span>
                            </div>
                            {initiative.partners.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <LinkIcon className="h-3 w-3" />
                                <span className="text-muted-foreground">
                                  Partners: {initiative.partners.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Strengths & Challenges */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {ministry.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            Challenges
                          </h4>
                          <ul className="space-y-1">
                            {ministry.challenges.map((challenge, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Reports
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Collaborate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Collaborations Tab */}
        <TabsContent value="collaborations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Matrix</CardTitle>
              <CardDescription>Active cross-ministry partnerships and initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ministry 1</TableHead>
                    <TableHead>Ministry 2</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>SDGs</TableHead>
                    <TableHead>Effectiveness</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ministryData.collaborationMatrix.map((collab, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{collab.ministry1}</TableCell>
                      <TableCell className="font-medium">{collab.ministry2}</TableCell>
                      <TableCell>{collab.projects}</TableCell>
                      <TableCell>{formatCurrency(collab.budget)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {collab.sdgs.map((sdg, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {sdg}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={collab.effectiveness} className="h-2 w-16" />
                          <span className={`text-sm font-medium ${getScoreColor(collab.effectiveness)}`}>
                            {collab.effectiveness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{collab.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-6">
          <div className="space-y-4">
            {ministryData.insights.map((insight, index) => (
              <div key={index} className={`flex gap-3 p-4 rounded-lg ${getInsightBg(insight.type)}`}>
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{insight.title}</p>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-sm mb-3">{insight.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-muted-foreground">
                        {insight.affectedMinistries.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{insight.potentialImpact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <div className="space-y-4">
            {ministryData.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        {getPriorityBadge(rec.priority)}
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ministries</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.ministries.map((ministry, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ministry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Estimated Cost</p>
                      <p className="font-medium">{formatCurrency(rec.estimatedCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                      <p className="font-medium">{rec.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Expected Impact</p>
                      <Badge className="bg-green-500">{rec.expectedImpact}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Initiate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
