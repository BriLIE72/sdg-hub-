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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Play,
  Save,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
} from 'lucide-react';

export default function PolicyLabPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [budget, setBudget] = useState('10000000');
  const [duration, setDuration] = useState('5');
  const [targetPopulation, setTargetPopulation] = useState('1000000');

  const policyTemplates = [
    {
      id: 'education-subsidy',
      name: 'Education Subsidy Program',
      sdg: 'SDG 4: Quality Education',
      description: 'Provide financial assistance to low-income families for education expenses',
      estimatedCost: '$50M over 5 years',
      expectedImpact: 'Increase school enrollment by 25%',
      complexity: 'Medium',
      timeframe: '3-5 years',
      category: 'Education',
    },
    {
      id: 'renewable-energy',
      name: 'Renewable Energy Transition',
      sdg: 'SDG 7: Clean Energy',
      description: 'Incentivize solar panel installation and wind energy projects',
      estimatedCost: '$200M over 10 years',
      expectedImpact: 'Reduce carbon emissions by 40%',
      complexity: 'High',
      timeframe: '7-10 years',
      category: 'Energy',
    },
    {
      id: 'healthcare-access',
      name: 'Universal Healthcare Access',
      sdg: 'SDG 3: Good Health',
      description: 'Expand healthcare coverage to underserved rural areas',
      estimatedCost: '$150M over 7 years',
      expectedImpact: 'Increase healthcare coverage by 35%',
      complexity: 'High',
      timeframe: '5-7 years',
      category: 'Health',
    },
    {
      id: 'poverty-reduction',
      name: 'Conditional Cash Transfer',
      sdg: 'SDG 1: No Poverty',
      description: 'Direct cash payments to families meeting education and health conditions',
      estimatedCost: '$80M over 5 years',
      expectedImpact: 'Lift 500,000 people out of poverty',
      complexity: 'Medium',
      timeframe: '3-5 years',
      category: 'Social Protection',
    },
    {
      id: 'water-infrastructure',
      name: 'Clean Water Infrastructure',
      sdg: 'SDG 6: Clean Water',
      description: 'Build water treatment plants and distribution networks',
      estimatedCost: '$120M over 8 years',
      expectedImpact: 'Provide clean water to 2 million people',
      complexity: 'High',
      timeframe: '5-8 years',
      category: 'Infrastructure',
    },
    {
      id: 'gender-equality',
      name: 'Women Economic Empowerment',
      sdg: 'SDG 5: Gender Equality',
      description: 'Microfinance and skills training programs for women entrepreneurs',
      estimatedCost: '$30M over 4 years',
      expectedImpact: 'Support 100,000 women-owned businesses',
      complexity: 'Low',
      timeframe: '2-4 years',
      category: 'Economic Development',
    },
  ];

  const simulationResults = {
    economicImpact: {
      gdpGrowth: 2.3,
      jobsCreated: 45000,
      costBenefit: 1.8,
    },
    socialImpact: {
      beneficiaries: 1200000,
      povertyReduction: 18,
      qualityOfLife: 25,
    },
    environmentalImpact: {
      carbonReduction: 15,
      resourceEfficiency: 30,
      sustainability: 85,
    },
    risks: [
      { name: 'Budget Overrun', probability: 'Medium', severity: 'High', mitigation: 'Phased implementation' },
      { name: 'Political Opposition', probability: 'Low', severity: 'Medium', mitigation: 'Stakeholder engagement' },
      { name: 'Implementation Delays', probability: 'High', severity: 'Medium', mitigation: 'Project management' },
    ],
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
    }, 2000);
  };

  const getComplexityBadge = (complexity: string) => {
    if (complexity === 'Low') return <Badge className="bg-green-500">Low</Badge>;
    if (complexity === 'Medium') return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge variant="destructive">High</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Adaptation Lab</h1>
          <p className="text-muted-foreground">
            Design, simulate, and test policy interventions before implementation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Scenario
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Templates</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policyTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Ready to simulate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulations Run</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Positive outcomes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4x</div>
            <p className="text-xs text-muted-foreground">Cost-benefit ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Policy Templates</TabsTrigger>
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="results">Results & Analysis</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {policyTemplates.map((policy) => (
              <Card
                key={policy.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedPolicy === policy.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPolicy(policy.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{policy.sdg}</Badge>
                        {getComplexityBadge(policy.complexity)}
                      </div>
                      <CardTitle className="text-xl">{policy.name}</CardTitle>
                      <CardDescription className="mt-2">{policy.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Estimated Cost</span>
                      </div>
                      <p className="font-medium">{policy.estimatedCost}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Timeframe</span>
                      </div>
                      <p className="font-medium">{policy.timeframe}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Expected Impact</span>
                    </div>
                    <p className="text-sm font-medium">{policy.expectedImpact}</p>
                  </div>

                  <Button
                    className="w-full"
                    variant={selectedPolicy === policy.id ? 'default' : 'outline'}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {selectedPolicy === policy.id ? 'Selected - Run Simulation' : 'Select Policy'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Configuration Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Simulation Parameters</CardTitle>
                <CardDescription>Configure your policy simulation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="policy-select">Selected Policy</Label>
                  <Input
                    id="policy-select"
                    value={selectedPolicy || 'None selected'}
                    disabled
                  />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Implementation Duration (years)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="5"
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
                </div>

                <Separator />

                <Button
                  className="w-full"
                  onClick={runSimulation}
                  disabled={!selectedPolicy || simulationRunning}
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
                <CardTitle>Simulation Preview</CardTitle>
                <CardDescription>Real-time impact modeling and projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedPolicy ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Policy Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a policy template from the Templates tab to begin simulation
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Economic Impact */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Economic Impact
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>GDP Growth</span>
                          <span className="font-medium">+{simulationResults.economicImpact.gdpGrowth}%</span>
                        </div>
                        <Progress value={simulationResults.economicImpact.gdpGrowth * 10} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Jobs Created</span>
                          <span className="font-medium">{simulationResults.economicImpact.jobsCreated.toLocaleString()}</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Cost-Benefit Ratio</span>
                          <span className="font-medium">{simulationResults.economicImpact.costBenefit}x</span>
                        </div>
                        <Progress value={simulationResults.economicImpact.costBenefit * 30} className="h-2" />
                      </div>
                    </div>

                    <Separator />

                    {/* Social Impact */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        Social Impact
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Beneficiaries</span>
                          <span className="font-medium">{simulationResults.socialImpact.beneficiaries.toLocaleString()}</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Poverty Reduction</span>
                          <span className="font-medium">{simulationResults.socialImpact.povertyReduction}%</span>
                        </div>
                        <Progress value={simulationResults.socialImpact.povertyReduction * 5} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Quality of Life Improvement</span>
                          <span className="font-medium">+{simulationResults.socialImpact.qualityOfLife}%</span>
                        </div>
                        <Progress value={simulationResults.socialImpact.qualityOfLife * 4} className="h-2" />
                      </div>
                    </div>

                    <Separator />

                    {/* Environmental Impact */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600" />
                        Environmental Impact
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Carbon Reduction</span>
                          <span className="font-medium">{simulationResults.environmentalImpact.carbonReduction}%</span>
                        </div>
                        <Progress value={simulationResults.environmentalImpact.carbonReduction * 6} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Resource Efficiency</span>
                          <span className="font-medium">+{simulationResults.environmentalImpact.resourceEfficiency}%</span>
                        </div>
                        <Progress value={simulationResults.environmentalImpact.resourceEfficiency * 3} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Sustainability Score</span>
                          <span className="font-medium">{simulationResults.environmentalImpact.sustainability}/100</span>
                        </div>
                        <Progress value={simulationResults.environmentalImpact.sustainability} className="h-2" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="mt-6">
          <div className="space-y-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Potential challenges and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risk Factor</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Mitigation Strategy</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationResults.risks.map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{risk.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              risk.probability === 'High'
                                ? 'destructive'
                                : risk.probability === 'Medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {risk.probability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              risk.severity === 'High'
                                ? 'destructive'
                                : risk.severity === 'Medium'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {risk.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{risk.mitigation}</TableCell>
                        <TableCell>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>Optimization suggestions based on simulation results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Strong Economic Viability
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      The cost-benefit ratio of 1.8x indicates strong economic returns. Consider increasing budget allocation by 15% for maximum impact.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Phased Implementation Recommended
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Break down the 5-year program into 3 phases to reduce implementation risks and allow for mid-course corrections.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">
                      Stakeholder Engagement Critical
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Early engagement with affected communities and political stakeholders will increase success probability by 30%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
