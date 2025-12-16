 import { useState } from 'react';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
+import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
-import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
+import { Progress } from '@/components/ui/progress';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
-import { Badge } from '@/components/ui/badge';
-import { Progress } from '@/components/ui/progress';
-import { 
-  TrendingUp, 
-  AlertTriangle, 
-  Target, 
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
+  TrendingUp,
+  TrendingDown,
+  Target,
+  AlertCircle,
+  Download,
+  RefreshCw,
+  BarChart3,
   DollarSign,
   Users,
   Calendar,
-  BarChart3,
-  Download,
-  RefreshCw
+  Zap,
+  CheckCircle,
+  AlertTriangle,
+  ArrowRight,
+  Lightbulb,
+  Award,
 } from 'lucide-react';
+import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
 
-export default function PolicySimulation() {
-  const [selectedGoal, setSelectedGoal] = useState('4');
-  const [selectedSector, setSelectedSector] = useState('education');
-  const [budgetAllocation, setBudgetAllocation] = useState('5000');
-  const [timeframe, setTimeframe] = useState('2');
-  const [showResults, setShowResults] = useState(false);
+interface SimulationResults {
+  sector: string;
+  sdgGoal: string;
+  budgetAllocation: number;
+  timeframe: number;
+  interventionType: string;
+  overview: {
+    predictedImpact: number;
+    beneficiaries: number;
+    riskLevel: string;
+    riskScore: number;
+    confidenceLevel: number;
+    successProbability: number;
+  };
+  milestones: Array<{
+    month: number;
+    title: string;
+    completion: number;
+    status: string;
+  }>;
+  sdgImpacts: Array<{
+    sdg: string;
+    impact: number;
+    primary: boolean;
+  }>;
+  costBreakdown: Array<{
+    category: string;
+    amount: number;
+    percentage: number;
+  }>;
+  kpis: Array<{
+    name: string;
+    current: number;
+    projected: number;
+    unit: string;
+  }>;
+  recommendations: Array<{
+    priority: string;
+    title: string;
+    description: string;
+    impact: string;
+  }>;
+  comparisons: Array<{
+    country: string;
+    policy: string;
+    budget: number;
+    impact: number;
+    timeframe: number;
+    outcome: string;
+  }>;
+  riskFactors: string[];
+  opportunities: string[];
+  metadata: {
+    simulationDate: string;
+    modelVersion: string;
+    dataQuality: string;
+  };
+}
 
+export default function PolicySimulationPage() {
+  const [loading, setLoading] = useState(false);
+  const [error, setError] = useState('');
+  const [results, setResults] = useState<SimulationResults | null>(null);
+
+  // Form state
+  const [sector, setSector] = useState('health');
+  const [sdgGoal, setSdgGoal] = useState('3');
+  const [budgetAllocation, setBudgetAllocation] = useState('50000000');
+  const [timeframe, setTimeframe] = useState('3');
+  const [interventionType, setInterventionType] = useState('standard');
+
+  const sectors = [
+    { value: 'health', label: 'Ministry of Health', budget: 245000000 },
+    { value: 'education', label: 'Ministry of Education', budget: 185000000 },
+    { value: 'energy', label: 'Ministry of Energy', budget: 195000000 },
+    { value: 'technology', label: 'Ministry of Technology', budget: 165000000 },
+    { value: 'social_welfare', label: 'Ministry of Social Welfare', budget: 135000000 },
+    { value: 'environment', label: 'Ministry of Environment', budget: 125000000 },
+    { value: 'infrastructure', label: 'Ministry of Infrastructure', budget: 285000000 },
+    { value: 'agriculture', label: 'Ministry of Agriculture', budget: 145000000 },
+    { value: 'labor', label: 'Ministry of Labor', budget: 115000000 },
+    { value: 'finance', label: 'Ministry of Finance', budget: 95000000 },
+  ];
+
   const sdgGoals = [
-    { id: '1', name: 'No Poverty', color: 'bg-red-500' },
-    { id: '2', name: 'Zero Hunger', color: 'bg-yellow-500' },
-    { id: '3', name: 'Good Health', color: 'bg-green-500' },
-    { id: '4', name: 'Quality Education', color: 'bg-red-600' },
-    { id: '5', name: 'Gender Equality', color: 'bg-orange-500' },
-    { id: '6', name: 'Clean Water', color: 'bg-blue-400' },
-    { id: '7', name: 'Clean Energy', color: 'bg-yellow-600' },
-    { id: '8', name: 'Decent Work', color: 'bg-red-700' },
-    { id: '9', name: 'Industry Innovation', color: 'bg-orange-600' },
-    { id: '10', name: 'Reduced Inequalities', color: 'bg-pink-500' },
-    { id: '11', name: 'Sustainable Cities', color: 'bg-yellow-700' },
-    { id: '12', name: 'Responsible Consumption', color: 'bg-yellow-800' },
-    { id: '13', name: 'Climate Action', color: 'bg-green-600' },
-    { id: '14', name: 'Life Below Water', color: 'bg-blue-500' },
-    { id: '15', name: 'Life on Land', color: 'bg-green-700' },
-    { id: '16', name: 'Peace and Justice', color: 'bg-blue-600' },
-    { id: '17', name: 'Partnerships', color: 'bg-blue-700' },
+    { id: '1', name: 'No Poverty' },
+    { id: '2', name: 'Zero Hunger' },
+    { id: '3', name: 'Good Health' },
+    { id: '4', name: 'Quality Education' },
+    { id: '5', name: 'Gender Equality' },
+    { id: '6', name: 'Clean Water' },
+    { id: '7', name: 'Clean Energy' },
+    { id: '8', name: 'Decent Work' },
+    { id: '9', name: 'Industry Innovation' },
+    { id: '10', name: 'Reduced Inequalities' },
+    { id: '11', name: 'Sustainable Cities' },
+    { id: '12', name: 'Responsible Consumption' },
+    { id: '13', name: 'Climate Action' },
+    { id: '14', name: 'Life Below Water' },
+    { id: '15', name: 'Life on Land' },
+    { id: '16', name: 'Peace and Justice' },
+    { id: '17', name: 'Partnerships' },
   ];
 
-  const sectors = [
-    { value: 'education', label: 'Education' },
-    { value: 'healthcare', label: 'Healthcare' },
-    { value: 'infrastructure', label: 'Infrastructure' },
-    { value: 'agriculture', label: 'Agriculture' },
-    { value: 'employment', label: 'Employment' },
-    { value: 'environment', label: 'Environment' },
+  const interventionTypes = [
+    { value: 'standard', label: 'Standard Implementation' },
+    { value: 'accelerated', label: 'Accelerated Rollout' },
+    { value: 'pilot', label: 'Pilot Program' },
+    { value: 'comprehensive', label: 'Comprehensive Reform' },
   ];
 
-  const handleRunSimulation = () => {
-    setShowResults(true);
+  const runSimulation = async () => {
+    setLoading(true);
+    setError('');
+
+    try {
+      const response = await fetch('/api/policy-simulation', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify({
+          sector,
+          sdgGoal,
+          budgetAllocation,
+          timeframe,
+          interventionType,
+        }),
+      });
+
+      const data = await response.json();
+
+      if (data.success) {
+        setResults(data.data);
+      } else {
+        setError(data.error || 'Simulation failed');
+      }
+    } catch (err) {
+      setError('Failed to run simulation. Please try again.');
+      console.error('Simulation error:', err);
+    } finally {
+      setLoading(false);
+    }
   };
 
-  const handleReset = () => {
-    setSelectedGoal('4');
-    setSelectedSector('education');
-    setBudgetAllocation('5000');
-    setTimeframe('2');
-    setShowResults(false);
+  const resetSimulation = () => {
+    setSector('health');
+    setSdgGoal('3');
+    setBudgetAllocation('50000000');
+    setTimeframe('3');
+    setInterventionType('standard');
+    setResults(null);
+    setError('');
   };
 
-  // Simulated results based on inputs
-  const predictedImpact = Math.min(95, 65 + (parseInt(budgetAllocation) / 100) + (parseInt(timeframe) * 5));
-  const beneficiaries = Math.floor((parseInt(budgetAllocation) * 200));
-  const riskLevel = parseInt(budgetAllocation) < 3000 ? 'High' : parseInt(budgetAllocation) < 7000 ? 'Medium' : 'Low';
-  const riskColor = riskLevel === 'High' ? 'destructive' : riskLevel === 'Medium' ? 'default' : 'secondary';
+  const exportResults = () => {
+    if (!results) return;
 
+    const report = JSON.stringify(results, null, 2);
+    const blob = new Blob([report], { type: 'application/json' });
+    const url = URL.createObjectURL(blob);
+    const a = document.createElement('a');
+    a.href = url;
+    a.download = `simulation-${sector}-${new Date().toISOString().split('T')[0]}.json`;
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
+  const getScoreColor = (score: number) => {
+    if (score >= 80) return 'text-green-600';
+    if (score >= 60) return 'text-blue-600';
+    if (score >= 40) return 'text-yellow-600';
+    return 'text-red-600';
+  };
+
+  const getRiskBadge = (level: string) => {
+    if (level === 'Low') return <Badge className="bg-green-500">Low Risk</Badge>;
+    if (level === 'Medium') return <Badge className="bg-yellow-500">Medium Risk</Badge>;
+    return <Badge variant="destructive">High Risk</Badge>;
+  };
+
+  const getStatusBadge = (status: string) => {
+    if (status === 'completed') return <Badge className="bg-green-500">Completed</Badge>;
+    if (status === 'in-progress') return <Badge className="bg-blue-500">In Progress</Badge>;
+    return <Badge variant="secondary">Pending</Badge>;
+  };
+
+  const getPriorityBadge = (priority: string) => {
+    if (priority === 'high') return <Badge variant="destructive">High Priority</Badge>;
+    if (priority === 'medium') return <Badge variant="default">Medium Priority</Badge>;
+    return <Badge variant="secondary">Low Priority</Badge>;
+  };
+
+  const selectedSectorData = sectors.find((s) => s.value === sector);
+
   return (
-    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
+    <div className="flex flex-col gap-6 p-6">
       {/* Header */}
-      <div className="bg-white border-b">
-        <div className="container mx-auto px-4 py-8">
-          <div className="flex items-center gap-3 mb-2">
-            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
-              <BarChart3 className="h-6 w-6 text-white" />
-            </div>
-            <div>
-              <h1 className="text-3xl font-bold text-gray-900">Policy Simulation & Impact Analysis</h1>
-              <p className="text-gray-600 mt-1">Model policy interventions and predict outcomes using AI-powered analytics</p>
-            </div>
-          </div>
+      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
+        <div>
+          <h1 className="text-3xl font-bold tracking-tight">Policy Simulation & Impact Analysis</h1>
+          <p className="text-muted-foreground">
+            Model policy interventions and predict outcomes using AI-powered analytics
+          </p>
         </div>
+        <div className="flex gap-2">
+          <Button variant="outline" onClick={resetSimulation}>
+            <RefreshCw className="mr-2 h-4 w-4" />
+            Reset
+          </Button>
+          {results && (
+            <Button onClick={exportResults}>
+              <Download className="mr-2 h-4 w-4" />
+              Export
+            </Button>
+          )}
+        </div>
       </div>
 
-      <div className="container mx-auto px-4 py-8">
-        <div className="grid lg:grid-cols-3 gap-6">
-          {/* Left Column - Simulation Controls */}
-          <div className="lg:col-span-1 space-y-6">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center gap-2">
-                  <Target className="h-5 w-5 text-blue-600" />
-                  Simulation Parameters
-                </CardTitle>
-                <CardDescription>Configure your policy intervention model</CardDescription>
-              </CardHeader>
-              <CardContent className="space-y-6">
-                {/* SDG Goal Selection */}
-                <div className="space-y-2">
-                  <Label htmlFor="goal">Target SDG Goal</Label>
-                  <Select value={selectedGoal} onValueChange={setSelectedGoal}>
-                    <SelectTrigger id="goal">
-                      <SelectValue placeholder="Select SDG Goal" />
-                    </SelectTrigger>
-                    <SelectContent>
-                      {sdgGoals.map((goal) => (
-                        <SelectItem key={goal.id} value={goal.id}>
-                          <div className="flex items-center gap-2">
-                            <div className={`w-3 h-3 rounded-full ${goal.color}`} />
-                            <span>Goal {goal.id}: {goal.name}</span>
-                          </div>
-                        </SelectItem>
-                      ))}
-                    </SelectContent>
-                  </Select>
-                </div>
-
-                {/* Sector Selection */}
-                <div className="space-y-2">
-                  <Label htmlFor="sector">Primary Sector</Label>
-                  <Select value={selectedSector} onValueChange={setSelectedSector}>
-                    <SelectTrigger id="sector">
-                      <SelectValue placeholder="Select Sector" />
-                    </SelectTrigger>
-                    <SelectContent>
-                      {sectors.map((sector) => (
-                        <SelectItem key={sector.value} value={sector.value}>
-                          {sector.label}
-                        </SelectItem>
-                      ))}
-                    </SelectContent>
-                  </Select>
-                </div>
-
-                {/* Budget Allocation */}
-                <div className="space-y-2">
-                  <Label htmlFor="budget">Budget Allocation (₹ Crores)</Label>
-                  <Input
-                    id="budget"
-                    type="number"
-                    value={budgetAllocation}
-                    onChange={(e) => setBudgetAllocation(e.target.value)}
-                    min="1000"
-                    max="50000"
-                    step="500"
-                  />
+      <div className="grid lg:grid-cols-3 gap-6">
+        {/* Left Column - Simulation Parameters */}
+        <div className="lg:col-span-1 space-y-6">
+          <Card>
+            <CardHeader>
+              <CardTitle className="flex items-center gap-2">
+                <Target className="h-5 w-5 text-primary" />
+                Simulation Parameters
+              </CardTitle>
+              <CardDescription>Configure your policy intervention scenario</CardDescription>
+            </CardHeader>
+            <CardContent className="space-y-4">
+              {/* Sector Selection */}
+              <div className="space-y-2">
+                <Label htmlFor="sector">Ministry/Sector</Label>
+                <Select value={sector} onValueChange={setSector}>
+                  <SelectTrigger id="sector">
+                    <SelectValue placeholder="Select sector" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    {sectors.map((s) => (
+                      <SelectItem key={s.value} value={s.value}>
+                        {s.label}
+                      </SelectItem>
+                    ))}
+                  </SelectContent>
+                </Select>
+                {selectedSectorData && (
                   <p className="text-xs text-muted-foreground">
-                    Range: ₹1,000 Cr - ₹50,000 Cr
+                    Current budget: {formatCurrency(selectedSectorData.budget)}
                   </p>
-                </div>
+                )}
+              </div>
 
-                {/* Timeframe */}
-                <div className="space-y-2">
-                  <Label htmlFor="timeframe">Implementation Timeframe</Label>
-                  <Select value={timeframe} onValueChange={setTimeframe}>
-                    <SelectTrigger id="timeframe">
-                      <SelectValue placeholder="Select Timeframe" />
-                    </SelectTrigger>
-                    <SelectContent>
-                      <SelectItem value="1">1 Year (Short-term)</SelectItem>
-                      <SelectItem value="2">2 Years (Medium-term)</SelectItem>
-                      <SelectItem value="3">3 Years (Long-term)</SelectItem>
-                      <SelectItem value="5">5 Years (Strategic)</SelectItem>
-                    </SelectContent>
-                  </Select>
-                </div>
+              {/* SDG Goal */}
+              <div className="space-y-2">
+                <Label htmlFor="sdg">Target SDG Goal</Label>
+                <Select value={sdgGoal} onValueChange={setSdgGoal}>
+                  <SelectTrigger id="sdg">
+                    <SelectValue placeholder="Select SDG" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    {sdgGoals.map((goal) => (
+                      <SelectItem key={goal.id} value={goal.id}>
+                        SDG {goal.id}: {goal.name}
+                      </SelectItem>
+                    ))}
+                  </SelectContent>
+                </Select>
+              </div>
 
-                {/* Action Buttons */}
-                <div className="flex gap-3 pt-4">
-                  <Button onClick={handleRunSimulation} className="flex-1">
-                    <TrendingUp className="h-4 w-4 mr-2" />
+              {/* Budget Allocation */}
+              <div className="space-y-2">
+                <Label htmlFor="budget">Budget Allocation ($)</Label>
+                <Input
+                  id="budget"
+                  type="number"
+                  value={budgetAllocation}
+                  onChange={(e) => setBudgetAllocation(e.target.value)}
+                  placeholder="Enter budget amount"
+                />
+                <p className="text-xs text-muted-foreground">
+                  {formatCurrency(parseInt(budgetAllocation) || 0)}
+                </p>
+              </div>
+
+              {/* Timeframe */}
+              <div className="space-y-2">
+                <Label htmlFor="timeframe">Implementation Timeframe (years)</Label>
+                <Select value={timeframe} onValueChange={setTimeframe}>
+                  <SelectTrigger id="timeframe">
+                    <SelectValue placeholder="Select timeframe" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    <SelectItem value="1">1 year</SelectItem>
+                    <SelectItem value="2">2 years</SelectItem>
+                    <SelectItem value="3">3 years</SelectItem>
+                    <SelectItem value="4">4 years</SelectItem>
+                    <SelectItem value="5">5 years</SelectItem>
+                  </SelectContent>
+                </Select>
+              </div>
+
+              {/* Intervention Type */}
+              <div className="space-y-2">
+                <Label htmlFor="intervention">Intervention Type</Label>
+                <Select value={interventionType} onValueChange={setInterventionType}>
+                  <SelectTrigger id="intervention">
+                    <SelectValue placeholder="Select type" />
+                  </SelectTrigger>
+                  <SelectContent>
+                    {interventionTypes.map((type) => (
+                      <SelectItem key={type.value} value={type.value}>
+                        {type.label}
+                      </SelectItem>
+                    ))}
+                  </SelectContent>
+                </Select>
+              </div>
+
+              <Button onClick={runSimulation} disabled={loading} className="w-full">
+                {loading ? (
+                  <>
+                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
+                    Running Simulation...
+                  </>
+                ) : (
+                  <>
+                    <BarChart3 className="mr-2 h-4 w-4" />
                     Run Simulation
-                  </Button>
-                  <Button variant="outline" onClick={handleReset}>
-                    <RefreshCw className="h-4 w-4" />
-                  </Button>
-                </div>
-              </CardContent>
-            </Card>
+                  </>
+                )}
+              </Button>
+            </CardContent>
+          </Card>
 
-            {/* Quick Stats */}
+          {/* Quick Stats */}
+          {results && (
             <Card>
               <CardHeader>
-                <CardTitle className="text-lg">Current Selection</CardTitle>
+                <CardTitle className="text-lg">Quick Overview</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
-                <div className="flex justify-between items-center">
-                  <span className="text-sm text-muted-foreground">SDG Goal</span>
-                  <Badge variant="secondary">Goal {selectedGoal}</Badge>
+                <div className="flex items-center justify-between">
+                  <span className="text-sm text-muted-foreground">Predicted Impact</span>
+                  <span className={`text-2xl font-bold ${getScoreColor(results.overview.predictedImpact)}`}>
+                    {results.overview.predictedImpact}%
+                  </span>
                 </div>
-                <div className="flex justify-between items-center">
-                  <span className="text-sm text-muted-foreground">Sector</span>
-                  <Badge variant="outline">{sectors.find(s => s.value === selectedSector)?.label}</Badge>
+                <div className="flex items-center justify-between">
+                  <span className="text-sm text-muted-foreground">Beneficiaries</span>
+                  <span className="text-lg font-bold">
+                    {results.overview.beneficiaries.toLocaleString()}
+                  </span>
                 </div>
-                <div className="flex justify-between items-center">
-                  <span className="text-sm text-muted-foreground">Budget</span>
-                  <span className="font-semibold">₹{parseInt(budgetAllocation).toLocaleString('en-IN')} Cr</span>
+                <div className="flex items-center justify-between">
+                  <span className="text-sm text-muted-foreground">Risk Level</span>
+                  {getRiskBadge(results.overview.riskLevel)}
                 </div>
-                <div className="flex justify-between items-center">
-                  <span className="text-sm text-muted-foreground">Duration</span>
-                  <span className="font-semibold">{timeframe} Years</span>
+                <div className="flex items-center justify-between">
+                  <span className="text-sm text-muted-foreground">Success Probability</span>
+                  <span className="text-lg font-bold text-green-600">
+                    {results.overview.successProbability}%
+                  </span>
                 </div>
               </CardContent>
             </Card>
-          </div>
+          )}
+        </div>
 
-          {/* Right Column - Results */}
-          <div className="lg:col-span-2 space-y-6">
-            {!showResults ? (
-              <Card className="h-full flex items-center justify-center min-h-[600px]">
-                <CardContent className="text-center py-12">
-                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
-                    <BarChart3 className="h-10 w-10 text-blue-600" />
-                  </div>
-                  <h3 className="text-xl font-semibold mb-2">Ready to Simulate</h3>
-                  <p className="text-muted-foreground max-w-md mx-auto">
-                    Configure your simulation parameters on the left and click "Run Simulation" to see predicted outcomes and impact analysis.
-                  </p>
-                </CardContent>
-              </Card>
-            ) : (
-              <>
-                {/* Predicted Impact */}
+        {/* Right Column - Results */}
+        <div className="lg:col-span-2">
+          {error && (
+            <Alert variant="destructive" className="mb-6">
+              <AlertCircle className="h-4 w-4" />
+              <AlertTitle>Error</AlertTitle>
+              <AlertDescription>{error}</AlertDescription>
+            </Alert>
+          )}
+
+          {!results && !error && (
+            <Card className="h-full flex items-center justify-center">
+              <CardContent className="text-center py-12">
+                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
+                <h3 className="text-xl font-semibold mb-2">No Simulation Results</h3>
+                <p className="text-muted-foreground mb-4">
+                  Configure parameters and run simulation to see results
+                </p>
+              </CardContent>
+            </Card>
+          )}
+
+          {results && (
+            <Tabs defaultValue="overview" className="w-full">
+              <TabsList className="grid w-full grid-cols-5">
+                <TabsTrigger value="overview">Overview</TabsTrigger>
+                <TabsTrigger value="impact">Impact</TabsTrigger>
+                <TabsTrigger value="timeline">Timeline</TabsTrigger>
+                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
+                <TabsTrigger value="comparison">Comparison</TabsTrigger>
+              </TabsList>
+
+              {/* Overview Tab */}
+              <TabsContent value="overview" className="mt-6 space-y-6">
+                {/* Impact Score */}
                 <Card>
                   <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <TrendingUp className="h-5 w-5 text-green-600" />
-                      Predicted Impact Analysis
-                    </CardTitle>
-                    <CardDescription>AI-powered outcome predictions based on your parameters</CardDescription>
+                    <CardTitle>Predicted Impact Score</CardTitle>
+                    <CardDescription>Overall effectiveness of the policy intervention</CardDescription>
                   </CardHeader>
-                  <CardContent className="space-y-6">
-                    {/* Overall Impact Score */}
-                    <div>
-                      <div className="flex justify-between items-center mb-2">
-                        <span className="text-sm font-medium">Overall Impact Score</span>
-                        <span className="text-2xl font-bold text-green-600">{predictedImpact.toFixed(1)}%</span>
-                      </div>
-                      <Progress value={predictedImpact} className="h-3" />
-                      <p className="text-xs text-muted-foreground mt-2">
-                        Based on budget allocation, timeframe, and historical data analysis
-                      </p>
-                    </div>
-
-                    {/* Key Metrics Grid */}
-                    <div className="grid md:grid-cols-3 gap-4">
-                      <div className="p-4 bg-blue-50 rounded-lg">
-                        <div className="flex items-center gap-2 mb-2">
-                          <Users className="h-4 w-4 text-blue-600" />
-                          <span className="text-xs font-medium text-blue-900">Beneficiaries</span>
+                  <CardContent>
+                    <div className="flex items-center justify-between mb-4">
+                      <div className="flex items-center gap-3">
+                        <div className={`text-5xl font-bold ${getScoreColor(results.overview.predictedImpact)}`}>
+                          {results.overview.predictedImpact}%
                         </div>
-                        <p className="text-2xl font-bold text-blue-900">{beneficiaries.toLocaleString('en-IN')}</p>
-                        <p className="text-xs text-blue-700 mt-1">Direct impact</p>
+                        <TrendingUp className="h-8 w-8 text-green-500" />
                       </div>
-
-                      <div className="p-4 bg-green-50 rounded-lg">
-                        <div className="flex items-center gap-2 mb-2">
-                          <DollarSign className="h-4 w-4 text-green-600" />
-                          <span className="text-xs font-medium text-green-900">Cost per Beneficiary</span>
-                        </div>
-                        <p className="text-2xl font-bold text-green-900">
-                          ₹{Math.floor((parseInt(budgetAllocation) * 10000000) / beneficiaries).toLocaleString('en-IN')}
-                        </p>
-                        <p className="text-xs text-green-700 mt-1">Efficiency metric</p>
+                      <div className="text-right">
+                        <p className="text-sm text-muted-foreground">Confidence Level</p>
+                        <p className="text-2xl font-bold">{results.overview.confidenceLevel}%</p>
                       </div>
-
-                      <div className="p-4 bg-purple-50 rounded-lg">
-                        <div className="flex items-center gap-2 mb-2">
-                          <Calendar className="h-4 w-4 text-purple-600" />
-                          <span className="text-xs font-medium text-purple-900">ROI Timeline</span>
-                        </div>
-                        <p className="text-2xl font-bold text-purple-900">{parseInt(timeframe) + 1} Years</p>
-                        <p className="text-xs text-purple-700 mt-1">Expected return</p>
-                      </div>
                     </div>
+                    <Progress value={results.overview.predictedImpact} className="h-3" />
+                  </CardContent>
+                </Card>
 
-                    {/* Impact Breakdown */}
-                    <div className="space-y-3">
-                      <h4 className="font-semibold text-sm">Impact Breakdown by Category</h4>
-                      
-                      <div>
-                        <div className="flex justify-between text-sm mb-1">
-                          <span>Infrastructure Development</span>
-                          <span className="font-medium">85%</span>
-                        </div>
-                        <Progress value={85} className="h-2" />
+                {/* Key Metrics */}
+                <div className="grid md:grid-cols-2 gap-4">
+                  <Card>
+                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+                      <CardTitle className="text-sm font-medium">Total Beneficiaries</CardTitle>
+                      <Users className="h-4 w-4 text-muted-foreground" />
+                    </CardHeader>
+                    <CardContent>
+                      <div className="text-2xl font-bold">
+                        {results.overview.beneficiaries.toLocaleString()}
                       </div>
-
-                      <div>
-                        <div className="flex justify-between text-sm mb-1">
-                          <span>Human Resource Capacity</span>
-                          <span className="font-medium">72%</span>
-                        </div>
-                        <Progress value={72} className="h-2" />
+                      <p className="text-xs text-muted-foreground">People directly impacted</p>
+                    </CardContent>
+                  </Card>
+                  <Card>
+                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+                      <CardTitle className="text-sm font-medium">Budget Allocation</CardTitle>
+                      <DollarSign className="h-4 w-4 text-muted-foreground" />
+                    </CardHeader>
+                    <CardContent>
+                      <div className="text-2xl font-bold">
+                        {formatCurrency(results.budgetAllocation)}
                       </div>
-
-                      <div>
-                        <div className="flex justify-between text-sm mb-1">
-                          <span>Technology Integration</span>
-                          <span className="font-medium">68%</span>
-                        </div>
-                        <Progress value={68} className="h-2" />
+                      <p className="text-xs text-muted-foreground">Total investment required</p>
+                    </CardContent>
+                  </Card>
+                  <Card>
+                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+                      <CardTitle className="text-sm font-medium">Implementation Time</CardTitle>
+                      <Calendar className="h-4 w-4 text-muted-foreground" />
+                    </CardHeader>
+                    <CardContent>
+                      <div className="text-2xl font-bold">{results.timeframe} years</div>
+                      <p className="text-xs text-muted-foreground">Estimated completion</p>
+                    </CardContent>
+                  </Card>
+                  <Card>
+                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
+                      <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
+                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
+                    </CardHeader>
+                    <CardContent>
+                      <div className="flex items-center gap-2">
+                        {getRiskBadge(results.overview.riskLevel)}
+                        <span className="text-lg font-bold">{results.overview.riskScore}%</span>
                       </div>
+                      <p className="text-xs text-muted-foreground">Risk probability</p>
+                    </CardContent>
+                  </Card>
+                </div>
 
-                      <div>
-                        <div className="flex justify-between text-sm mb-1">
-                          <span>Community Engagement</span>
-                          <span className="font-medium">91%</span>
+                {/* Cost Breakdown */}
+                <Card>
+                  <CardHeader>
+                    <CardTitle>Budget Breakdown</CardTitle>
+                    <CardDescription>Allocation across categories</CardDescription>
+                  </CardHeader>
+                  <CardContent>
+                    <div className="space-y-4">
+                      {results.costBreakdown.map((item, index) => (
+                        <div key={index} className="space-y-2">
+                          <div className="flex items-center justify-between text-sm">
+                            <span className="font-medium">{item.category}</span>
+                            <div className="flex items-center gap-2">
+                              <span className="text-muted-foreground">
+                                {formatCurrency(item.amount)}
+                              </span>
+                              <Badge variant="secondary">{item.percentage}%</Badge>
+                            </div>
+                          </div>
+                          <Progress value={item.percentage} className="h-2" />
                         </div>
-                        <Progress value={91} className="h-2" />
-                      </div>
+                      ))}
                     </div>
                   </CardContent>
                 </Card>
 
-                {/* Risk Assessment */}
+                {/* Risk Factors & Opportunities */}
+                <div className="grid md:grid-cols-2 gap-4">
+                  <Card>
+                    <CardHeader>
+                      <CardTitle className="flex items-center gap-2">
+                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
+                        Risk Factors
+                      </CardTitle>
+                    </CardHeader>
+                    <CardContent>
+                      <ul className="space-y-2">
+                        {results.riskFactors.map((risk, index) => (
+                          <li key={index} className="flex items-start gap-2 text-sm">
+                            <span className="text-yellow-500 mt-0.5">•</span>
+                            <span>{risk}</span>
+                          </li>
+                        ))}
+                      </ul>
+                    </CardContent>
+                  </Card>
+                  <Card>
+                    <CardHeader>
+                      <CardTitle className="flex items-center gap-2">
+                        <Lightbulb className="h-5 w-5 text-blue-500" />
+                        Opportunities
+                      </CardTitle>
+                    </CardHeader>
+                    <CardContent>
+                      <ul className="space-y-2">
+                        {results.opportunities.map((opp, index) => (
+                          <li key={index} className="flex items-start gap-2 text-sm">
+                            <span className="text-blue-500 mt-0.5">•</span>
+                            <span>{opp}</span>
+                          </li>
+                        ))}
+                      </ul>
+                    </CardContent>
+                  </Card>
+                </div>
+              </TabsContent>
+
+              {/* Impact Tab */}
+              <TabsContent value="impact" className="mt-6 space-y-6">
+                {/* SDG Impact */}
                 <Card>
                   <CardHeader>
-                    <CardTitle className="flex items-center gap-2">
-                      <AlertTriangle className="h-5 w-5 text-orange-600" />
-                      Risk Assessment & Mitigation
-                    </CardTitle>
+                    <CardTitle>SDG Impact Analysis</CardTitle>
+                    <CardDescription>Expected impact across SDG goals</CardDescription>
                   </CardHeader>
-                  <CardContent className="space-y-4">
-                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
-                      <span className="font-medium">Overall Risk Level</span>
-                      <Badge variant={riskColor as any} className="text-sm">
-                        {riskLevel} Risk
-                      </Badge>
-                    </div>
-
-                    <div className="space-y-3">
-                      <div className="p-3 border rounded-lg">
-                        <div className="flex items-start gap-3">
-                          <Badge variant="destructive" className="mt-0.5">High</Badge>
-                          <div className="flex-1">
-                            <h5 className="font-medium text-sm mb-1">Budget Constraints</h5>
-                            <p className="text-xs text-muted-foreground">
-                              Limited funding may impact infrastructure development timeline
-                            </p>
-                            <p className="text-xs text-blue-600 mt-2">
-                              <strong>Mitigation:</strong> Phased implementation with priority-based allocation
-                            </p>
+                  <CardContent>
+                    <div className="space-y-4">
+                      {results.sdgImpacts.map((sdg, index) => (
+                        <div key={index} className="space-y-2">
+                          <div className="flex items-center justify-between">
+                            <div className="flex items-center gap-2">
+                              <span className="font-medium">SDG {sdg.sdg}</span>
+                              {sdg.primary && <Badge className="bg-blue-500">Primary</Badge>}
+                            </div>
+                            <span className={`text-lg font-bold ${getScoreColor(sdg.impact)}`}>
+                              {Math.round(sdg.impact)}%
+                            </span>
                           </div>
+                          <Progress value={sdg.impact} className="h-2" />
                         </div>
-                      </div>
-
-                      <div className="p-3 border rounded-lg">
-                        <div className="flex items-start gap-3">
-                          <Badge variant="default" className="mt-0.5">Medium</Badge>
-                          <div className="flex-1">
-                            <h5 className="font-medium text-sm mb-1">Stakeholder Coordination</h5>
-                            <p className="text-xs text-muted-foreground">
-                              Multiple ministries involved requiring close coordination
-                            </p>
-                            <p className="text-xs text-blue-600 mt-2">
-                              <strong>Mitigation:</strong> Establish inter-ministerial task force with clear KPIs
-                            </p>
-                          </div>
-                        </div>
-                      </div>
-
-                      <div className="p-3 border rounded-lg">
-                        <div className="flex items-start gap-3">
-                          <Badge variant="secondary" className="mt-0.5">Low</Badge>
-                          <div className="flex-1">
-                            <h5 className="font-medium text-sm mb-1">Technology Adoption</h5>
-                            <p className="text-xs text-muted-foreground">
-                              Digital infrastructure in place for smooth implementation
-                            </p>
-                            <p className="text-xs text-blue-600 mt-2">
-                              <strong>Mitigation:</strong> Continuous training and support programs
-                            </p>
-                          </div>
-                        </div>
-                      </div>
+                      ))}
                     </div>
                   </CardContent>
                 </Card>
 
-                {/* Recommendations */}
+                {/* KPIs */}
                 <Card>
                   <CardHeader>
-                    <CardTitle>AI-Powered Recommendations</CardTitle>
+                    <CardTitle>Key Performance Indicators</CardTitle>
+                    <CardDescription>Current vs. projected performance</CardDescription>
                   </CardHeader>
                   <CardContent>
-                    <div className="space-y-3">
-                      <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
-                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
-                          <span className="text-white text-xs font-bold">1</span>
-                        </div>
-                        <div>
-                          <h5 className="font-medium text-sm text-green-900 mb-1">Increase Community Engagement</h5>
-                          <p className="text-xs text-green-800">
-                            Allocate 15% of budget to grassroots awareness programs for 25% better adoption rates
-                          </p>
-                        </div>
-                      </div>
+                    <Table>
+                      <TableHeader>
+                        <TableRow>
+                          <TableHead>Indicator</TableHead>
+                          <TableHead>Current</TableHead>
+                          <TableHead>Projected</TableHead>
+                          <TableHead>Change</TableHead>
+                        </TableRow>
+                      </TableHeader>
+                      <TableBody>
+                        {results.kpis.map((kpi, index) => {
+                          const change = kpi.projected - kpi.current;
+                          const changePercent = ((change / kpi.current) * 100).toFixed(1);
+                          return (
+                            <TableRow key={index}>
+                              <TableCell className="font-medium">{kpi.name}</TableCell>
+                              <TableCell>
+                                {kpi.unit === 'people'
+                                  ? kpi.current.toLocaleString()
+                                  : kpi.current}
+                                {kpi.unit === '%' ? '%' : ''}
+                              </TableCell>
+                              <TableCell>
+                                {kpi.unit === 'people'
+                                  ? kpi.projected.toLocaleString()
+                                  : kpi.projected}
+                                {kpi.unit === '%' ? '%' : ''}
+                              </TableCell>
+                              <TableCell>
+                                <div className="flex items-center gap-1">
+                                  {change > 0 ? (
+                                    <TrendingUp className="h-4 w-4 text-green-500" />
+                                  ) : (
+                                    <TrendingDown className="h-4 w-4 text-red-500" />
+                                  )}
+                                  <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
+                                    {change > 0 ? '+' : ''}
+                                    {changePercent}%
+                                  </span>
+                                </div>
+                              </TableCell>
+                            </TableRow>
+                          );
+                        })}
+                      </TableBody>
+                    </Table>
+                  </CardContent>
+                </Card>
+              </TabsContent>
 
-                      <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
-                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
-                          <span className="text-white text-xs font-bold">2</span>
+              {/* Timeline Tab */}
+              <TabsContent value="timeline" className="mt-6">
+                <Card>
+                  <CardHeader>
+                    <CardTitle>Implementation Timeline</CardTitle>
+                    <CardDescription>Key milestones and progress tracking</CardDescription>
+                  </CardHeader>
+                  <CardContent>
+                    <div className="space-y-6">
+                      {results.milestones.map((milestone, index) => (
+                        <div key={index} className="flex gap-4">
+                          <div className="flex flex-col items-center">
+                            <div
+                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
+                                milestone.status === 'completed'
+                                  ? 'bg-green-500'
+                                  : milestone.status === 'in-progress'
+                                  ? 'bg-blue-500'
+                                  : 'bg-gray-300'
+                              }`}
+                            >
+                              {milestone.status === 'completed' ? (
+                                <CheckCircle className="h-5 w-5 text-white" />
+                              ) : (
+                                <span className="text-white font-bold text-sm">
+                                  {milestone.month}
+                                </span>
+                              )}
+                            </div>
+                            {index < results.milestones.length - 1 && (
+                              <div className="w-0.5 h-16 bg-gray-300" />
+                            )}
+                          </div>
+                          <div className="flex-1 pb-8">
+                            <div className="flex items-center justify-between mb-2">
+                              <div>
+                                <p className="font-medium">{milestone.title}</p>
+                                <p className="text-sm text-muted-foreground">
+                                  Month {milestone.month}
+                                </p>
+                              </div>
+                              {getStatusBadge(milestone.status)}
+                            </div>
+                            <Progress value={milestone.completion} className="h-2" />
+                            <p className="text-xs text-muted-foreground mt-1">
+                              {milestone.completion}% complete
+                            </p>
+                          </div>
                         </div>
-                        <div>
-                          <h5 className="font-medium text-sm text-blue-900 mb-1">Leverage Technology Partnerships</h5>
-                          <p className="text-xs text-blue-800">
-                            Partner with tech companies for infrastructure at 30% cost reduction
-                          </p>
-                        </div>
-                      </div>
-
-                      <div className="flex gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
-                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
-                          <span className="text-white text-xs font-bold">3</span>
-                        </div>
-                        <div>
-                          <h5 className="font-medium text-sm text-purple-900 mb-1">Phased Implementation Strategy</h5>
-                          <p className="text-xs text-purple-800">
-                            Start with 3 pilot districts to validate approach before full-scale rollout
-                          </p>
-                        </div>
-                      </div>
+                      ))}
                     </div>
                   </CardContent>
                 </Card>
+              </TabsContent>
 
-                {/* Export Actions */}
+              {/* Recommendations Tab */}
+              <TabsContent value="recommendations" className="mt-6">
+                <div className="space-y-4">
+                  {results.recommendations.map((rec, index) => (
+                    <Card key={index}>
+                      <CardHeader>
+                        <div className="flex items-start justify-between">
+                          <div className="flex-1">
+                            <div className="flex items-center gap-2 mb-2">
+                              <CardTitle className="text-lg">{rec.title}</CardTitle>
+                              {getPriorityBadge(rec.priority)}
+                            </div>
+                            <CardDescription>{rec.description}</CardDescription>
+                          </div>
+                        </div>
+                      </CardHeader>
+                      <CardContent>
+                        <div className="flex items-center justify-between">
+                          <div className="flex items-center gap-2">
+                            <Zap className="h-4 w-4 text-yellow-500" />
+                            <span className="text-sm font-medium">Expected Impact:</span>
+                            <Badge className="bg-green-500">{rec.impact}</Badge>
+                          </div>
+                          <Button variant="outline" size="sm">
+                            <ArrowRight className="mr-2 h-4 w-4" />
+                            Implement
+                          </Button>
+                        </div>
+                      </CardContent>
+                    </Card>
+                  ))}
+                </div>
+              </TabsContent>
+
+              {/* Comparison Tab */}
+              <TabsContent value="comparison" className="mt-6">
                 <Card>
-                  <CardContent className="pt-6">
-                    <div className="flex gap-3">
-                      <Button className="flex-1">
-                        <Download className="h-4 w-4 mr-2" />
-                        Export Full Report (PDF)
-                      </Button>
-                      <Button variant="outline" className="flex-1">
-                        <Download className="h-4 w-4 mr-2" />
-                        Export Data (Excel)
-                      </Button>
-                    </div>
+                  <CardHeader>
+                    <CardTitle>International Benchmarks</CardTitle>
+                    <CardDescription>
+                      Similar policies implemented in other countries
+                    </CardDescription>
+                  </CardHeader>
+                  <CardContent>
+                    <Table>
+                      <TableHeader>
+                        <TableRow>
+                          <TableHead>Country</TableHead>
+                          <TableHead>Policy</TableHead>
+                          <TableHead>Budget</TableHead>
+                          <TableHead>Impact</TableHead>
+                          <TableHead>Timeframe</TableHead>
+                          <TableHead>Outcome</TableHead>
+                        </TableRow>
+                      </TableHeader>
+                      <TableBody>
+                        {results.comparisons.map((comp, index) => (
+                          <TableRow key={index}>
+                            <TableCell className="font-medium">{comp.country}</TableCell>
+                            <TableCell>{comp.policy}</TableCell>
+                            <TableCell>{formatCurrency(comp.budget)}</TableCell>
+                            <TableCell>
+                              <span className={getScoreColor(comp.impact)}>
+                                {Math.round(comp.impact)}%
+                              </span>
+                            </TableCell>
+                            <TableCell>{comp.timeframe} years</TableCell>
+                            <TableCell>
+                              <Badge
+                                variant={
+                                  comp.outcome === 'Successful' ? 'default' : 'secondary'
+                                }
+                              >
+                                {comp.outcome}
+                              </Badge>
+                            </TableCell>
+                          </TableRow>
+                        ))}
+                      </TableBody>
+                    </Table>
                   </CardContent>
                 </Card>
-              </>
-            )}
-          </div>
+              </TabsContent>
+            </Tabs>
+          )}
         </div>
       </div>
     </div>
   );
