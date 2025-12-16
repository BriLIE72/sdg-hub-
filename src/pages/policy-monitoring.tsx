import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Bell,
  Activity,
  BarChart3,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Zap,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MonitoringData {
  overview: {
    totalPolicies: number;
    activePolicies: number;
    completedPolicies: number;
    atRiskPolicies: number;
    totalBudget: number;
    budgetUtilized: number;
    overallProgress: number;
  };
  activePolicies: Array<{
    id: number;
    name: string;
    sdg: string;
    status: string;
    progress: number;
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    milestones: {
      completed: number;
      total: number;
    };
    kpis: Array<{
      name: string;
      target: number;
      current: number;
      unit: string;
    }>;
    alerts: Array<{
      type: string;
      message: string;
      date: string;
    }>;
    lastUpdate: string;
  }>;
  performanceMetrics: {
    budgetEfficiency: number;
    timelineAdherence: number;
    kpiAchievement: number;
    stakeholderSatisfaction: number;
  };
  recentActivities: Array<{
    id: number;
    policy: string;
    activity: string;
    timestamp: string;
    type: string;
  }>;
  upcomingMilestones: Array<{
    id: number;
    policy: string;
    milestone: string;
    dueDate: string;
    daysRemaining: number;
    status: string;
  }>;
}

export default function PolicyMonitoringPage() {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/policy-monitoring');
      const data = await response.json();

      if (data.success) {
        setMonitoringData(data.data);
      } else {
        setError(data.error || 'Failed to fetch monitoring data');
      }
    } catch (err) {
      setError('Failed to load monitoring data. Please try again.');
      console.error('Monitoring data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMonitoringData();
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!monitoringData) return;

    const report = JSON.stringify(monitoringData, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-monitoring-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'on-track') return <Badge className="bg-green-500">On Track</Badge>;
    if (status === 'at-risk') return <Badge className="bg-yellow-500">At Risk</Badge>;
    if (status === 'critical') return <Badge variant="destructive">Critical</Badge>;
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const getActivityIcon = (type: string) => {
    if (type === 'milestone') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (type === 'alert') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (type === 'kpi') return <TrendingUp className="h-4 w-4 text-blue-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error || !monitoringData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
          <Button onClick={fetchMonitoringData} className="mt-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Policy Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time tracking and performance analysis of active policies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Alerts ({monitoringData.overview.atRiskPolicies})
          </Button>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoringData.overview.activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              {monitoringData.overview.totalPolicies} total policies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilized</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (monitoringData.overview.budgetUtilized / monitoringData.overview.totalBudget) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(monitoringData.overview.budgetUtilized)} of{' '}
              {formatCurrency(monitoringData.overview.totalBudget)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoringData.overview.overallProgress}%</div>
            <Progress value={monitoringData.overview.overallProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {monitoringData.overview.atRiskPolicies}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators across all policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget Efficiency</span>
                <span className="font-medium">
                  {monitoringData.performanceMetrics.budgetEfficiency}%
                </span>
              </div>
              <Progress value={monitoringData.performanceMetrics.budgetEfficiency} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Timeline Adherence</span>
                <span className="font-medium">
                  {monitoringData.performanceMetrics.timelineAdherence}%
                </span>
              </div>
              <Progress
                value={monitoringData.performanceMetrics.timelineAdherence}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">KPI Achievement</span>
                <span className="font-medium">
                  {monitoringData.performanceMetrics.kpiAchievement}%
                </span>
              </div>
              <Progress value={monitoringData.performanceMetrics.kpiAchievement} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stakeholder Satisfaction</span>
                <span className="font-medium">
                  {monitoringData.performanceMetrics.stakeholderSatisfaction}%
                </span>
              </div>
              <Progress
                value={monitoringData.performanceMetrics.stakeholderSatisfaction}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="policies" className="w-full">
        <TabsList>
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="milestones">Upcoming Milestones</TabsTrigger>
        </TabsList>

        {/* Active Policies Tab */}
        <TabsContent value="policies" className="mt-6">
          <div className="space-y-4">
            {monitoringData.activePolicies.map((policy) => (
              <Card
                key={policy.id}
                className={`hover:shadow-lg transition-shadow ${
                  selectedPolicy === policy.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{policy.sdg}</Badge>
                        {getStatusBadge(policy.status)}
                        {policy.alerts.length > 0 && (
                          <Badge variant="outline" className="text-red-600">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {policy.alerts.length} Alert{policy.alerts.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{policy.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedPolicy(selectedPolicy === policy.id ? null : policy.id)
                      }
                    >
                      {selectedPolicy === policy.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-muted-foreground">{policy.progress}%</span>
                    </div>
                    <Progress value={policy.progress} className="h-2" />
                  </div>

                  {/* Budget */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Budget</p>
                      <p className="font-medium">{formatCurrency(policy.budget)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Spent</p>
                      <p className="font-medium">
                        {formatCurrency(policy.spent)} (
                        {Math.round((policy.spent / policy.budget) * 100)}%)
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>
                      {policy.milestones.completed} of {policy.milestones.total} milestones
                      completed
                    </span>
                  </div>

                  {/* Alerts */}
                  {policy.alerts.length > 0 && (
                    <div className="space-y-2">
                      {policy.alerts.map((alert, index) => (
                        <Alert
                          key={index}
                          variant={alert.type === 'critical' ? 'destructive' : 'default'}
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {alert.message}
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDate(alert.date)}
                            </span>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {/* Detailed KPIs */}
                  {selectedPolicy === policy.id && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="font-semibold">Key Performance Indicators</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>KPI</TableHead>
                              <TableHead>Current</TableHead>
                              <TableHead>Target</TableHead>
                              <TableHead>Progress</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {policy.kpis.map((kpi, index) => {
                              const progress = Math.round((kpi.current / kpi.target) * 100);
                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{kpi.name}</TableCell>
                                  <TableCell>
                                    {kpi.current.toLocaleString()} {kpi.unit}
                                  </TableCell>
                                  <TableCell>
                                    {kpi.target.toLocaleString()} {kpi.unit}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Progress value={progress} className="h-2 w-20" />
                                      <span className="text-sm font-medium">{progress}%</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="mr-2 h-4 w-4" />
                      Stakeholders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Activities Tab */}
        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates across all policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.policy}</p>
                      <p className="text-sm text-muted-foreground mt-1">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {getTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Milestones Tab */}
        <TabsContent value="milestones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Key deliverables and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monitoringData.upcomingMilestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell className="font-medium">{milestone.policy}</TableCell>
                      <TableCell className="max-w-xs">{milestone.milestone}</TableCell>
                      <TableCell>{formatDate(milestone.dueDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            milestone.daysRemaining < 15
                              ? 'destructive'
                              : milestone.daysRemaining < 30
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {milestone.daysRemaining} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{milestone.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
