import { Link } from 'react-router-dom';
import { Dumbbell, Shield, QrCode, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: QrCode,
    title: 'QR Check-ins',
    description: 'Members scan a QR code to check in instantly. No more manual tracking.',
  },
  {
    icon: Users,
    title: 'Member Management',
    description: 'Track all your members, their check-ins, and activity in one place.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security to protect your gym and member data.',
  },
];

const benefits = [
  'Instant QR code check-ins',
  'Real-time analytics dashboard',
  'Member management tools',
  'Multi-gym support',
  'Mobile-friendly interface',
  'Admin approval system',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GymKey</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-opacity">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium">Now accepting gym registrations</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Unlock Your Gym's
            <span className="block text-primary">Full Potential</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            GymKey is the modern gym management platform. QR check-ins, member tracking, 
            and powerful analytics—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button size="lg" className="gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-all text-lg px-8 py-6">
                Register Your Gym
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful tools designed specifically for gym owners and administrators.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built for Modern Gyms
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you run a small boutique studio or a large fitness center, 
                GymKey scales with your needs.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl gradient-hero p-8 flex items-center justify-center">
                <Dumbbell className="w-32 h-32 text-primary-foreground/20 animate-float" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-card">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Gyms Trust Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-sidebar-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-sidebar-foreground/70 text-lg max-w-xl mx-auto mb-10">
            Join hundreds of gym owners who are already using GymKey to manage their facilities.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-accent text-accent-foreground shadow-accent hover:opacity-90 transition-all text-lg px-8 py-6">
              Register Your Gym Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar py-12 border-t border-sidebar-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">GymKey</span>
            </div>
            <p className="text-sidebar-foreground/60 text-sm">
              © 2024 GymKey. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
