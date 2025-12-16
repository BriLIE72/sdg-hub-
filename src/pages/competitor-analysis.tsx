import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertCircle,
  Download,
  RefreshCw,
  BarChart3,
  Globe,
  DollarSign,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Users,
  Zap,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CompetitorData {
  overview: {
    totalCompetitors: number;
    countriesAnalyzed: number;
    sdgsCovered: number;
    lastUpdated: string;
  };
  competitors: Array<{
    id: number;
    country: string;
    region: string;
    gdp: number;
    population: number;
    sdgRanking: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    topPolicies: Array<{
      name: string;
      sdg: string;
      impact: string;
      budget: number;
    }>;
    sdgScores: Record<string, number>;
  }>;
  yourCountry: {
    country: string;
    sdgRanking: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    sdgScores: Record<string, number>;
  };
  benchmarks: {
    averageScore: number;
    topPerformer: string;
    fastestImprover: string;
    budgetLeader: string;
    innovationLeader: string;
  };
  insights: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    potentialImpact: string;
  }>;
  recommendations: Array<{
    sdg: string;
    action: string;
    benchmark: string;
    estimatedCost: number;
    timeline: string;
    expectedImpact: string;
  }>;
}

export default function CompetitorAnalysisPage() {
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(null);
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);

  useEffect(() => {
    fetchCompetitorData();
  }, []);

  const fetchCompetitorData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/competitor-analysis');
      const data = await response.json();

      if (data.success) {
        setCompetitorData(data.data);
      } else {
        setError(data.error || 'Failed to fetch competitor data');
      }
    } catch (err) {
      setError('Failed to load competitor data. Please try again.');
      console.error('Competitor data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchCompetitorData();
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!competitorData) return;

    const report = JSON.stringify(competitorData, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const compareCountries = async () => {
    if (comparisonCountries.length < 2) {
      alert('Please select at least 2 countries to compare');
      return;
    }

    try {
      const response = await fetch('/api/competitor-analysis/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countries: comparisonCountries,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Comparison completed! Check console for results.');
        console.log('Comparison Results:', data.data);
      } else {
        alert(data.error || 'Comparison failed');
      }
    } catch (err) {
      alert('Failed to compare countries');
      console.error('Comparison error:', err);
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
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInsightIcon = (type: string) => {
    if (type === 'opportunity') return <Lightbulb className="h-5 w-5 text-blue-600" />;
    if (type === 'strength') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getInsightBg = (type: string) => {
    if (type === 'opportunity') return 'bg-blue-50 dark:bg-blue-950';
    if (type === 'strength') return 'bg-green-50 dark:bg-green-950';
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
          <p className="text-muted-foreground">Loading competitor analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !competitorData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Failed to load data'}</AlertDescription>
          <Button onClick={fetchCompetitorData} className="mt-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Competitor Analysis</h1>
          <p className="text-muted-foreground">
            Benchmark your SDG performance against global leaders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={compareCountries}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Compare
          </Button>
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
            <CardTitle className="text-sm font-medium">Your Ranking</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{competitorData.yourCountry.sdgRanking}</div>
            <p className="text-xs text-muted-foreground">
              Out of {competitorData.overview.countriesAnalyzed + 1} countries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(competitorData.yourCountry.overallScore)}`}>
              {competitorData.yourCountry.overallScore}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {competitorData.benchmarks.averageScore}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitorData.benchmarks.topPerformer}</div>
            <p className="text-xs text-muted-foreground">
              Score: {competitorData.competitors[0].overallScore}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gap to Leader</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(competitorData.competitors[0].overallScore - competitorData.yourCountry.overallScore).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Points behind</p>
          </CardContent>
        </Card>
      </div>

      {/* Your Performance vs Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Your Performance vs Top Performers</CardTitle>
          <CardDescription>SDG-by-SDG comparison with global leaders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(competitorData.yourCountry.sdgScores).map(([sdg, score]) => {
              const sdgNumber = sdg.replace('sdg', '');
              const topScore = Math.max(
                ...competitorData.competitors.map((c) => c.sdgScores[sdg] || 0)
              );
              const gap = topScore - score;

              return (
                <div key={sdg} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">SDG {sdgNumber}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">You: {score}</span>
                      <span className="text-muted-foreground">Leader: {topScore}</span>
                      <Badge variant={gap > 20 ? 'destructive' : gap > 10 ? 'default' : 'secondary'}>
                        Gap: {gap}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Progress value={(score / 100) * 100} className="h-2 flex-1" />
                    <Progress value={(topScore / 100) * 100} className="h-2 flex-1 opacity-50" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="competitors" className="w-full">
        <TabsList>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="mt-6">
          <div className="space-y-4">
            {competitorData.competitors.map((competitor) => (
              <Card
                key={competitor.id}
                className={`hover:shadow-lg transition-shadow ${
                  selectedCompetitor === competitor.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-xl">{competitor.country}</CardTitle>
                        <Badge variant="secondary">#{competitor.sdgRanking}</Badge>
                        <Badge className="bg-green-500">Score: {competitor.overallScore}</Badge>
                      </div>
                      <CardDescription>
                        {competitor.region} • Population: {(competitor.population / 1000000).toFixed(1)}M • GDP: {formatCurrency(competitor.gdp)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedCompetitor(
                          selectedCompetitor === competitor.id ? null : competitor.id
                        )
                      }
                    >
                      {selectedCompetitor === competitor.id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Top Policies */}
                  {selectedCompetitor === competitor.id && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold">Top Policies</h4>
                        {competitor.topPolicies.map((policy, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{policy.name}</p>
                              <p className="text-sm text-muted-foreground">{policy.sdg}</p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  policy.impact === 'High'
                                    ? 'default'
                                    : policy.impact === 'Medium'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {policy.impact} Impact
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatCurrency(policy.budget)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* SDG Scores */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">SDG Performance</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(competitor.sdgScores).map(([sdg, score]) => (
                            <div key={sdg} className="text-center p-2 bg-muted rounded">
                              <p className="text-xs text-muted-foreground mb-1">
                                {sdg.toUpperCase().replace('SDG', 'SDG ')}
                              </p>
                              <p className={`text-lg font-bold ${getScoreColor(score)}`}>
                                {score}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Compare
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Zap className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-6">
          <div className="space-y-4">
            {competitorData.insights.map((insight, index) => (
              <div
                key={index}
                className={`flex gap-3 p-4 rounded-lg ${getInsightBg(insight.type)}`}
              >
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{insight.title}</p>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-sm mb-2">{insight.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Potential Impact: {insight.potentialImpact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>
                Evidence-based actions to improve your SDG performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SDG</TableHead>
                    <TableHead>Recommended Action</TableHead>
                    <TableHead>Benchmark</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorData.recommendations.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="secondary">{rec.sdg}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{rec.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rec.benchmark}
                      </TableCell>
                      <TableCell>{formatCurrency(rec.estimatedCost)}</TableCell>
                      <TableCell>{rec.timeline}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{rec.expectedImpact}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
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
