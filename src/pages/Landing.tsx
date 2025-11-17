import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Bell, 
  Activity, 
  BarChart3, 
  CheckCircle, 
  Crown,
  Heart,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import logoImage from '@/assets/farmsync-logo-horizontal.png';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: 'Cow Tracking',
      description: 'Track each cow\'s health, breeding, and production history in one place.'
    },
    {
      icon: Heart,
      title: 'Health Events',
      description: 'Log vaccinations, treatments, and medical records with ease.'
    },
    {
      icon: Calendar,
      title: 'Breeding Calendar',
      description: 'Monitor insemination dates and predict calving cycles accurately.'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Never miss important events with automated notifications.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your herd\'s performance and productivity.'
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description: 'Add events, update records, and manage tasks instantly.'
    }
  ];

  const problems = [
    'Forgetting vaccination schedules',
    'Losing track of breeding cycles',
    'Missing critical health checkups',
    'Poor record keeping across cattle',
    'Difficulty planning for calving seasons'
  ];

  const solutions = [
    { icon: Bell, text: 'Automated reminders keep you on schedule' },
    { icon: Calendar, text: 'Visual calendars for all events' },
    { icon: BarChart3, text: 'Real-time dashboards track herd health' },
    { icon: Clock, text: 'Historical records at your fingertips' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="FarmSync" className="h-8" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Modern Farm Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Simplify Your Farm
              <span className="block text-primary mt-2">Manage Your Herd</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track cattle health, breeding cycles, and farm events in one powerful platform. 
              Built for modern farmers who care about productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg h-14 px-8" onClick={() => navigate('/auth')}>
                Start Free Today
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8" onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Learn More
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free plan available • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              The Challenges Farmers Face
            </h2>
            <p className="text-lg text-muted-foreground">
              Managing a cattle farm shouldn't be this complicated
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => (
              <Card key={index} className="border-destructive/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive mt-1">
                      <Shield className="w-5 h-5" />
                    </div>
                    <p className="text-foreground font-medium">{problem}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Meet Your Farm Assistant
            </h2>
            <p className="text-lg text-muted-foreground">
              FarmSync automates the tedious parts so you can focus on what matters
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <solution.icon className="w-6 h-6" />
                  </div>
                  <p className="text-foreground font-medium">{solution.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed specifically for cattle farmers
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary w-fit mb-2">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you grow
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <Badge variant="secondary">Perfect to Start</Badge>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">KES 0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    'Track up to 5 cows',
                    'Basic health records',
                    'Event reminders',
                    'Calendar view',
                    'Mobile access'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => navigate('/auth')}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-primary shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Crown className="w-6 h-6 text-primary" />
                    Premium
                  </CardTitle>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">KES 200</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    'Unlimited cows',
                    'Advanced analytics',
                    'Priority support',
                    'Export reports',
                    'Custom notifications',
                    'Breeding predictions',
                    'Everything in Free'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate('/auth')}>
                  Start Premium Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial / Impact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Making an Impact
            </h2>
            <p className="text-lg text-muted-foreground">
              Helping farmers improve productivity and livestock health
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Cows Tracked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Farmers Helped</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About / Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe technology should empower farmers, not complicate their lives. 
              FarmSync was built to help livestock farmers increase productivity, reduce losses, 
              and spend more time doing what they love—caring for their animals.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By providing simple, powerful tools for tracking and managing cattle, 
              we're helping build a more sustainable and productive future for farming communities.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of farmers already using FarmSync
          </p>
          <Button size="lg" className="text-lg h-14 px-8" onClick={() => navigate('/auth')}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <img src={logoImage} alt="FarmSync" className="h-8 mb-4" />
              <p className="text-sm text-muted-foreground">
                Modern farm management for the digital age
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-foreground transition-colors">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">About</button></li>
                <li><button className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Privacy</button></li>
                <li><button className="hover:text-foreground transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FarmSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
