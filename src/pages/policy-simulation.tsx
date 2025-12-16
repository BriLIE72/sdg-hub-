import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Download,
  Save,
  Play,
  RotateCcw,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SimulationResult {
  simulationId: string;
  policyId: string;
  timestamp: string;
  economicImpact: {
    gdpGrowth: number;
    jobsCreated: number;
    costBenefit: number;
    fiscalImpact: number;
    economicMultiplier: number;
  };
  socialImpact: {
    beneficiaries: number;
    povertyReduction: number;
    qualityOfLife: number;
    educationImprovement: number;
    healthImprovement: number;
    genderEquality: number;
  };
  environmentalImpact: {
    carbonReduction: number;
    resourceEfficiency: number;
    sustainability: number;
    renewableEnergy: number;
    wasteReduction: number;
  };
  timeline: {
    phases: Array<{
      phase: number;
      name: string;
      duration: number;
      progress: number;
      status: string;
    }>;
    totalDuration: number;
    estimatedCompletion: string;
  };
  risks: Array<{
    id: number;
    name: string;
    probability: string;
    severity: string;
    impact: string;
    mitigation: string;
    status: string;
  }>;
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
  }>;
  confidence: {
    overall: number;
    economic: number;
    social: number;
    environmental: number;
  };
}

export default function PolicySimulationPage() {
  const [selectedPolicy, setSelectedPolicy] = useState('education-subsidy');
  const [budget, setBudget] = useState('10000000');
  const [duration, setDuration] = useState('5');
  const [targetPopulation, setTargetPopulation] = useState('1000000');
  const [implementationSpeed, setImplementationSpeed] = useState('normal');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  const [error, setError] = useState('');

  const policies = [
    {
      id: 'education-subsidy',
      name: 'Education Subsidy Program',
      sdg: 'SDG 4',
      description: 'Financial assistance for low-income families',
    },
    {
      id: 'renewable-energy',
      name: 'Renewable Energy Transition',
      sdg: 'SDG 7',
      description: 'Solar and wind energy incentives',
    },
    {
      id: 'healthcare-access',
      name: 'Universal Healthcare Access',
      sdg: 'SDG 3',
      description: 'Expand healthcare to rural areas',
    },
    {
      id: 'poverty-reduction',
      name: 'Conditional Cash Transfer',
      sdg: 'SDG 1',
      description: 'Direct payments with conditions',
    },
    {
      id: 'water-infrastructure',
      name: 'Clean Water Infrastructure',
      sdg: 'SDG 6',
      description: 'Water treatment and distribution',
    },
    {
      id: 'gender-equality',
      name: 'Women Economic Empowerment',
      sdg: 'SDG 5',
      description: 'Microfinance and skills training',
    },
  ];

  const runSimulation = async () => {
    setError('');
    setSimulationRunning(true);

    try {
      const response = await fetch('/api/policy-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policyId: selectedPolicy,
          parameters: {
            budget,
            duration,
            targetPopulation,
            implementationSpeed,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSimulationResults(data.data);
      } else {
        setError(data.error || 'Simulation failed');
      }
    } catch (err) {
      setError('Failed to run simulation. Please try again.');
      console.error('Simulation error:', err);
    } finally {
      setSimulationRunning(false);
    }
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setError('');
    setBudget('10000000');
    setDuration('5');
    setTargetPopulation('1000000');
    setImplementationSpeed('normal');
  };

  const saveScenario = () => {
    if (!simulationResults) return;
    
    const scenario = {
      ...simulationResults,
      savedAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    const savedScenarios = JSON.parse(localStorage.getItem('savedScenarios') || '[]');
    savedScenarios.push(scenario);
    localStorage.setItem('savedScenarios', JSON.stringify(savedScenarios));
    
    alert('Scenario saved successfully!');
  };

  const exportReport = () => {
    if (!simulationResults) return;
    
    const report = JSON.stringify(simulationResults, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulation-report-${simulationResults.simulationId}.json`;
    a.click();
  };

  const getProbabilityColor = (probability: string) => {
    if (probability === 'High') return 'destructive';
    if (probability === 'Medium') return 'default';
    return 'secondary';
  };

  const getRecommendationIcon = (type: string) => {
    if (type === 'success') return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getRecommendationBg = (type: string) => {
    if (type === 'success') return 'bg-green-50 dark:bg-green-950';
    if (type === 'warning') return 'bg-yellow-50 dark:bg-yellow-950';
    return 'bg-blue-50 dark:bg-blue-950';
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Simulation Engine</h1>
          <p className="text-muted-foreground">
            Advanced modeling and scenario analysis for policy interventions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSimulation}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={saveScenario} disabled={!simulationResults}>
            <Save className="mr-2 h-4 w-4" />
            Save Scenario
          </Button>
          <Button onClick={exportReport} disabled={!simulationResults}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulations Run</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+89 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {simulationResults ? `${simulationResults.confidence.overall}%` : '75%'}
            </div>
            <p className="text-xs text-muted-foreground">Model accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Scenarios</CardTitle>
            <Save className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {JSON.parse(localStorage.getItem('savedScenarios') || '[]').length}
            </div>
            <p className="text-xs text-muted-foreground">Your library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5s</div>
            <p className="text-xs text-muted-foreground">Average runtime</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Configure your policy scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="policy">Policy Template</Label>
              <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                <SelectTrigger id="policy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {policies.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{policy.name}</span>
                        <span className="text-xs text-muted-foreground">{policy.sdg}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Allocation ($)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000000"
              />
              <p className="text-xs text-muted-foreground">
                ${Number(budget).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Implementation Duration (years)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="population">Target Population</Label>
              <Input
                id="population"
                type="number"
                value={targetPopulation}
                onChange={(e) => setTargetPopulation(e.target.value)}
                placeholder="1000000"
              />
              <p className="text-xs text-muted-foreground">
                {Number(targetPopulation).toLocaleString()} people
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Implementation Speed</Label>
              <Select value={implementationSpeed} onValueChange={setImplementationSpeed}>
                <SelectTrigger id="speed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow (Conservative)</SelectItem>
                  <SelectItem value="normal">Normal (Balanced)</SelectItem>
                  <SelectItem value="fast">Fast (Aggressive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              onClick={runSimulation}
              disabled={simulationRunning}
              size="lg"
            >
              {simulationRunning ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {simulationResults
                ? `Simulation ID: ${simulationResults.simulationId}`
                : 'Configure parameters and run simulation'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!simulationResults ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <LineChart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Simulation Results</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Configure your policy parameters and click "Run Simulation" to see projected
                  impacts and analysis
                </p>
              </div>
            ) : (
              <Tabs defaultValue="impact" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="recommendations">Insights</TabsTrigger>
                </TabsList>

                {/* Impact Tab */}
                <TabsContent value="impact" className="space-y-6 mt-6">
                  {/* Confidence Score */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Confidence</span>
                      <span className="text-2xl font-bold">
                        {simulationResults.confidence.overall}%
                      </span>
                    </div>
                    <Progress value={simulationResults.confidence.overall} className="h-2" />
                  </div>

                  {/* Economic Impact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Economic Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">GDP Growth</p>
                        <p className="text-2xl font-bold">
                          +{simulationResults.economicImpact.gdpGrowth}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Jobs Created</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.economicImpact.jobsCreated.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cost-Benefit Ratio</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.economicImpact.costBenefit}x
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Economic Multiplier</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.economicImpact.economicMultiplier}x
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence Level</span>
                        <span className="font-medium">
                          {simulationResults.confidence.economic}%
                        </span>
                      </div>
                      <Progress value={simulationResults.confidence.economic} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  {/* Social Impact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Social Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Beneficiaries</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.socialImpact.beneficiaries.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Poverty Reduction</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.socialImpact.povertyReduction}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Quality of Life</p>
                        <p className="text-2xl font-bold">
                          +{simulationResults.socialImpact.qualityOfLife}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Education</p>
                        <p className="text-2xl font-bold">
                          +{simulationResults.socialImpact.educationImprovement}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence Level</span>
                        <span className="font-medium">
                          {simulationResults.confidence.social}%
                        </span>
                      </div>
                      <Progress value={simulationResults.confidence.social} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  {/* Environmental Impact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      Environmental Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Carbon Reduction</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.environmentalImpact.carbonReduction}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Resource Efficiency</p>
                        <p className="text-2xl font-bold">
                          +{simulationResults.environmentalImpact.resourceEfficiency}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Sustainability Score</p>
                        <p className="text-2xl font-bold">
                          {simulationResults.environmentalImpact.sustainability}/100
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Renewable Energy</p>
                        <p className="text-2xl font-bold">
                          +{simulationResults.environmentalImpact.renewableEnergy}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence Level</span>
                        <span className="font-medium">
                          {simulationResults.confidence.environmental}%
                        </span>
                      </div>
                      <Progress
                        value={simulationResults.confidence.environmental}
                        className="h-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Implementation Phases</h4>
                      <Badge variant="outline">
                        <Calendar className="mr-1 h-3 w-3" />
                        {simulationResults.timeline.totalDuration} years
                      </Badge>
                    </div>

                    {simulationResults.timeline.phases.map((phase) => (
                      <div key={phase.phase} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                              {phase.phase}
                            </div>
                            <div>
                              <p className="font-medium">{phase.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {phase.duration} {phase.duration === 1 ? 'year' : 'years'}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              phase.status === 'completed'
                                ? 'default'
                                : phase.status === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {phase.status}
                          </Badge>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>
                    ))}

                    <Separator />

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estimated Completion</span>
                        <span className="text-lg font-bold">
                          {simulationResults.timeline.estimatedCompletion}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Risks Tab */}
                <TabsContent value="risks" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Risk Factor</TableHead>
                        <TableHead>Probability</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Mitigation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulationResults.risks.map((risk) => (
                        <TableRow key={risk.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{risk.name}</p>
                              <p className="text-sm text-muted-foreground">{risk.impact}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getProbabilityColor(risk.probability)}>
                              {risk.probability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getProbabilityColor(risk.severity)}>
                              {risk.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm">{risk.mitigation}</p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-4 mt-6">
                  {simulationResults.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 p-4 rounded-lg ${getRecommendationBg(rec.type)}`}
                    >
                      {getRecommendationIcon(rec.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{rec.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
