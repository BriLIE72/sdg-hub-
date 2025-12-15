import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, Users, TrendingUp, Globe, BookOpen, Lightbulb } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: 'SDG Progress Tracking',
      description: 'Monitor and track progress across all 17 Sustainable Development Goals with real-time data and analytics.',
      link: '/sdg-progress',
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder Collaboration',
      description: 'Connect ministries, NGOs, and international partners for effective SDG implementation.',
      link: '/multi-stakeholder',
    },
    {
      icon: TrendingUp,
      title: 'Policy Lab & Simulation',
      description: 'Test and simulate policy impacts before implementation with advanced modeling tools.',
      link: '/policy-lab',
    },
    {
      icon: Globe,
      title: 'International Cooperation',
      description: 'Access global best practices, funding opportunities, and expert networks.',
      link: '/international',
    },
    {
      icon: BookOpen,
      title: 'Knowledge Center',
      description: 'Comprehensive library of SDG resources, research, and implementation guides.',
      link: '/knowledge-center',
    },
    {
      icon: Lightbulb,
      title: 'Best Practices',
      description: 'Learn from successful SDG implementations and proven strategies worldwide.',
      link: '/best-practices',
    },
  ];

  const stats = [
    { label: 'SDG Goals Tracked', value: '17', color: 'bg-blue-500' },
    { label: 'Active Ministries', value: '25+', color: 'bg-green-500' },
    { label: 'Policy Initiatives', value: '150+', color: 'bg-purple-500' },
    { label: 'International Partners', value: '40+', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge className="mb-4" variant="secondary">
              SDG Committee Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Accelerating Progress Towards{' '}
              <span className="text-primary">Sustainable Development Goals</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A comprehensive platform for tracking, collaborating, and implementing SDG initiatives across
              ministries and stakeholders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sdg-progress">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore SDG Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className={`w-12 h-12 ${stat.color} rounded-full mx-auto mb-4`} />
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive SDG Management</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to track, implement, and accelerate SDG progress in one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary font-medium">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform SDG Implementation?</h2>
            <p className="text-lg opacity-90">
              Join ministries and organizations already using our platform to accelerate SDG progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
