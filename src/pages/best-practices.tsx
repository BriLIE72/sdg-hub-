import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Filter,
  Download,
  BookOpen,
  Award,
  TrendingUp,
  Users,
  Globe,
  FileText,
  ExternalLink,
  Star,
} from 'lucide-react';

export default function BestPracticesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const bestPractices = [
    {
      id: 1,
      title: 'National Literacy Campaign - Rwanda',
      sdg: 'SDG 4: Quality Education',
      country: 'Rwanda',
      region: 'Africa',
      description:
        'Comprehensive adult literacy program that increased literacy rates from 58% to 73% in 5 years through community-based learning centers and mobile education units.',
      impact: 'Reached 2.5 million adults, 73% literacy rate achieved',
      budget: '$45M over 5 years',
      rating: 4.8,
      category: 'Education',
      tags: ['Literacy', 'Community Engagement', 'Mobile Learning'],
      year: '2019-2024',
      status: 'Completed',
    },
    {
      id: 2,
      title: 'Universal Healthcare Coverage - Thailand',
      sdg: 'SDG 3: Good Health',
      country: 'Thailand',
      region: 'Asia',
      description:
        'Universal healthcare scheme providing comprehensive medical coverage to all citizens through a network of public hospitals and primary care centers.',
      impact: '99.5% population coverage, reduced out-of-pocket expenses by 60%',
      budget: '$8B annually',
      rating: 4.9,
      category: 'Health',
      tags: ['Healthcare', 'Universal Coverage', 'Public Health'],
      year: '2002-Present',
      status: 'Ongoing',
    },
    {
      id: 3,
      title: 'Renewable Energy Transition - Costa Rica',
      sdg: 'SDG 7: Clean Energy',
      country: 'Costa Rica',
      region: 'Latin America',
      description:
        'Ambitious renewable energy program achieving 99% renewable electricity generation through hydroelectric, wind, solar, and geothermal sources.',
      impact: '99% renewable electricity, carbon neutral by 2021',
      budget: '$2.3B over 10 years',
      rating: 5.0,
      category: 'Energy',
      tags: ['Renewable Energy', 'Climate Action', 'Sustainability'],
      year: '2014-2024',
      status: 'Completed',
    },
    {
      id: 4,
      title: 'Conditional Cash Transfer - Brazil',
      sdg: 'SDG 1: No Poverty',
      country: 'Brazil',
      region: 'Latin America',
      description:
        'Bolsa Família program providing cash transfers to low-income families conditional on children attending school and receiving vaccinations.',
      impact: 'Lifted 36 million people out of poverty, reduced inequality by 15%',
      budget: '$30B over 15 years',
      rating: 4.7,
      category: 'Social Protection',
      tags: ['Poverty Reduction', 'Cash Transfers', 'Education'],
      year: '2003-2018',
      status: 'Completed',
    },
    {
      id: 5,
      title: 'Gender Equality in Parliament - Rwanda',
      sdg: 'SDG 5: Gender Equality',
      country: 'Rwanda',
      region: 'Africa',
      description:
        'Constitutional reforms and quota systems ensuring women hold 61% of parliamentary seats, the highest globally.',
      impact: '61% women in parliament, improved gender policies',
      budget: '$12M for capacity building',
      rating: 4.9,
      category: 'Governance',
      tags: ['Gender Equality', 'Political Participation', 'Governance'],
      year: '2003-Present',
      status: 'Ongoing',
    },
    {
      id: 6,
      title: 'Clean Water Access - Singapore',
      sdg: 'SDG 6: Clean Water',
      country: 'Singapore',
      region: 'Asia',
      description:
        'Integrated water management system including rainwater harvesting, desalination, and wastewater recycling achieving water self-sufficiency.',
      impact: '100% population access to clean water, 40% water self-sufficiency',
      budget: '$5B over 20 years',
      rating: 4.8,
      category: 'Water Management',
      tags: ['Water Security', 'Desalination', 'Recycling'],
      year: '2000-2020',
      status: 'Completed',
    },
    {
      id: 7,
      title: 'Digital Education Platform - Estonia',
      sdg: 'SDG 4: Quality Education',
      country: 'Estonia',
      region: 'Europe',
      description:
        'Nationwide digital learning platform providing free online education to all students with personalized learning paths and real-time progress tracking.',
      impact: '98% student digital literacy, improved learning outcomes by 25%',
      budget: '$120M over 8 years',
      rating: 4.7,
      category: 'Education',
      tags: ['Digital Learning', 'Technology', 'Innovation'],
      year: '2015-2023',
      status: 'Completed',
    },
    {
      id: 8,
      title: 'Urban Green Spaces - Singapore',
      sdg: 'SDG 11: Sustainable Cities',
      country: 'Singapore',
      region: 'Asia',
      description:
        'Comprehensive urban greening program transforming the city into a "Garden City" with vertical gardens, rooftop parks, and green corridors.',
      impact: '47% green coverage, reduced urban heat by 2°C',
      budget: '$3.5B over 15 years',
      rating: 4.9,
      category: 'Urban Development',
      tags: ['Green Infrastructure', 'Urban Planning', 'Sustainability'],
      year: '2008-2023',
      status: 'Ongoing',
    },
    {
      id: 9,
      title: 'Microfinance for Women - Bangladesh',
      sdg: 'SDG 5: Gender Equality',
      country: 'Bangladesh',
      region: 'Asia',
      description:
        'Grameen Bank microfinance model providing small loans to women entrepreneurs, enabling economic independence and poverty reduction.',
      impact: '9 million women borrowers, 98% repayment rate',
      budget: '$15B in loans disbursed',
      rating: 4.8,
      category: 'Economic Empowerment',
      tags: ['Microfinance', 'Women Empowerment', 'Entrepreneurship'],
      year: '1983-Present',
      status: 'Ongoing',
    },
  ];

  const filteredPractices = bestPractices.filter(
    (practice) =>
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.sdg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Best Practices Library</h1>
          <p className="text-muted-foreground">
            Learn from successful SDG implementations worldwide
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Collection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practices</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestPractices.length}</div>
            <p className="text-xs text-muted-foreground">Across 17 SDGs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45+</div>
            <p className="text-xs text-muted-foreground">Global coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Achieved targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250M+</div>
            <p className="text-xs text-muted-foreground">People reached</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search best practices by title, country, or SDG..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Practices</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPractices.map((practice) => (
              <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{practice.sdg}</Badge>
                        <Badge variant="outline">{practice.country}</Badge>
                      </div>
                      <CardTitle className="text-xl">{practice.title}</CardTitle>
                      <CardDescription className="mt-2">{practice.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Impact:</span>
                      <span className="text-muted-foreground">{practice.impact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Budget:</span>
                      <span className="text-muted-foreground">{practice.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Period:</span>
                      <span className="text-muted-foreground">{practice.year}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    {practice.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium">{practice.rating}</span>
                      <span className="text-sm text-muted-foreground">/5.0</span>
                    </div>
                    <Badge
                      variant={practice.status === 'Completed' ? 'default' : 'secondary'}
                    >
                      {practice.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPractices
              .filter((p) => p.category === 'Education')
              .map((practice) => (
                <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{practice.sdg}</Badge>
                      <Badge variant="outline">{practice.country}</Badge>
                    </div>
                    <CardTitle className="text-xl">{practice.title}</CardTitle>
                    <CardDescription className="mt-2">{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPractices
              .filter((p) => p.category === 'Health')
              .map((practice) => (
                <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{practice.sdg}</Badge>
                      <Badge variant="outline">{practice.country}</Badge>
                    </div>
                    <CardTitle className="text-xl">{practice.title}</CardTitle>
                    <CardDescription className="mt-2">{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="energy" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPractices
              .filter((p) => p.category === 'Energy')
              .map((practice) => (
                <Card key={practice.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{practice.sdg}</Badge>
                      <Badge variant="outline">{practice.country}</Badge>
                    </div>
                    <CardTitle className="text-xl">{practice.title}</CardTitle>
                    <CardDescription className="mt-2">{practice.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
