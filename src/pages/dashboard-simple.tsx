import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Target,
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Download,
} from 'lucide-react';

export default function DashboardSimplePage() {
  const sdgGoals = [
    { id: 1, name: 'No Poverty', progress: 68, status: 'on-track', color: 'bg-red-500' },
    { id: 2, name: 'Zero Hunger', progress: 54, status: 'needs-attention', color: 'bg-yellow-500' },
    { id: 3, name: 'Good Health', progress: 72, status: 'on-track', color: 'bg-green-500' },
    { id: 4, name: 'Quality Education', progress: 81, status: 'on-track', color: 'bg-blue-500' },
    { id: 5, name: 'Gender Equality', progress: 63, status: 'needs-attention', color: 'bg-orange-500' },
    { id: 6, name: 'Clean Water', progress: 76, status: 'on-track', color: 'bg-cyan-500' },
    { id: 7, name: 'Clean Energy', progress: 58, status: 'needs-attention', color: 'bg-amber-500' },
    { id: 8, name: 'Economic Growth', progress: 69, status: 'on-track', color: 'bg-purple-500' },
  ];

  const stats = [
    {
      title: 'Total SDG Goals',
      value: '17',
      change: '+2 this quarter',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Initiatives',
      value: '156',
      change: '+12 this month',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Stakeholders',
      value: '2,847',
      change: '+234 this month',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Reports Generated',
      value: '89',
      change: '+8 this week',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const recentActivities = [
    {
      title: 'New policy initiative approved',
      description: 'SDG 4: Quality Education - National Literacy Program',
      time: '2 hours ago',
      status: 'success',
    },
    {
      title: 'Quarterly report submitted',
      description: 'SDG 13: Climate Action - Progress Report Q4 2024',
      time: '5 hours ago',
      status: 'info',
    },
    {
      title: 'Stakeholder meeting scheduled',
      description: 'Multi-ministry coordination for SDG 17',
      time: '1 day ago',
      status: 'warning',
    },
    {
      title: 'Budget allocation updated',
      description: 'SDG 1: No Poverty - Additional funding approved',
      time: '2 days ago',
      status: 'success',
    },
  ];

  const upcomingTasks = [
    { title: 'Submit Q1 2025 Progress Report', due: 'Due in 3 days', priority: 'high' },
    { title: 'Review SDG 7 Implementation Plan', due: 'Due in 5 days', priority: 'medium' },
    { title: 'Stakeholder Consultation Meeting', due: 'Due in 1 week', priority: 'medium' },
    { title: 'Update SDG Indicators Database', due: 'Due in 2 weeks', priority: 'low' },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SDG Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and track Sustainable Development Goals progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View Full Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* SDG Progress */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>SDG Progress Overview</CardTitle>
            <CardDescription>Track progress across all Sustainable Development Goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Goals</TabsTrigger>
                <TabsTrigger value="on-track">On Track</TabsTrigger>
                <TabsTrigger value="attention">Needs Attention</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {sdgGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${goal.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                          {goal.id}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{goal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {goal.status === 'on-track' ? 'On Track' : 'Needs Attention'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{goal.progress}%</span>
                        {goal.status === 'on-track' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="on-track" className="space-y-4 mt-4">
                {sdgGoals
                  .filter((goal) => goal.status === 'on-track')
                  .map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${goal.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {goal.id}
                          </div>
                          <p className="text-sm font-medium">{goal.name}</p>
                        </div>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="attention" className="space-y-4 mt-4">
                {sdgGoals
                  .filter((goal) => goal.status === 'needs-attention')
                  .map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${goal.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {goal.id}
                          </div>
                          <p className="text-sm font-medium">{goal.name}</p>
                        </div>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="mt-1">
                    {activity.status === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {activity.status === 'info' && (
                      <FileText className="h-4 w-4 text-blue-500" />
                    )}
                    {activity.status === 'warning' && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Your pending action items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.due}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
