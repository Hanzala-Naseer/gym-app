import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login - replace with actual API call
      // const response = await authService.login(email, password);
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        fullName: 'John Doe',
        email: email,
        role: email.includes('admin') ? 'admin' as const : 'owner' as const,
      };
      
      login('mock-jwt-token', mockUser);
      
      toast({
        title: 'Welcome back!',
        description: 'Login successful.',
      });
      
      navigate(mockUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/owner');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">GymKey</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
            Welcome Back
          </h1>
          <p className="text-sidebar-foreground/70 text-lg">
            Sign in to manage your gym, track members, and view analytics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sidebar-foreground font-bold">500+</span>
          </div>
          <span className="text-sidebar-foreground/70">Gym owners trust GymKey</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GymKey</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
