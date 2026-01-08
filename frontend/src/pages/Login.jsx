// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// // Hardcoded credentials for testing
// const CREDENTIALS = {
//   admin: { email: 'admin@gymkey.com', password: 'admin123' },
//   owner: { email: 'owner@gymkey.com', password: 'owner123' }
// };

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // Hardcoded login check
//       let userRole = null;
//       let userName = '';

//       if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
//         userRole = 'admin';
//         userName = 'Admin User';
//       } else if (email === CREDENTIALS.owner.email && password === CREDENTIALS.owner.password) {
//         userRole = 'owner';
//         userName = 'Gym Owner';
//       }

//       if (!userRole) {
//         throw new Error('Invalid credentials');
//       }

//       // API call (commented)
//       // const response = await authService.login(email, password);

//       await new Promise(resolve => setTimeout(resolve, 500));

//       const mockUser = {
//         id: '1',
//         fullName: userName,
//         email: email,
//         role: userRole,
//       };

//       login('mock-jwt-token', mockUser);

//       toast({
//         title: 'Welcome back!',
//         description: 'Login successful.',
//       });

//       navigate(userRole === 'admin' ? '/dashboard/admin' : '/dashboard/owner');
//     } catch (error) {
//       toast({
//         title: 'Login failed',
//         description: 'Invalid credentials. Use admin@gymkey.com/admin123 or owner@gymkey.com/owner123',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Left Panel */}
//       <div className="hidden lg:flex lg:w-1/2 gradient-dark p-12 flex-col justify-between">
//         <Link to="/" className="flex items-center gap-2">
//           <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//             <Dumbbell className="w-6 h-6 text-primary-foreground" />
//           </div>
//           <span className="text-xl font-bold text-sidebar-foreground">GymKey</span>
//         </Link>
//         <div>
//           <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
//             Welcome Back
//           </h1>
//           <p className="text-sidebar-foreground/70 text-lg">
//             Sign in to manage your gym, track members, and view analytics.
//           </p>
//           <div className="mt-8 p-4 rounded-xl bg-sidebar-accent/50">
//             <p className="text-sidebar-foreground/80 text-sm font-medium mb-2">Test Credentials:</p>
//             <p className="text-sidebar-foreground/60 text-sm">Admin: admin@gymkey.com / admin123</p>
//             <p className="text-sidebar-foreground/60 text-sm">Owner: owner@gymkey.com / owner123</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 rounded-full bg-sidebar-accent flex items-center justify-center">
//             <span className="text-sidebar-foreground font-bold">500+</span>
//           </div>
//           <span className="text-sidebar-foreground/70">Gym owners trust GymKey</span>
//         </div>
//       </div>

//       {/* Right Panel - Form */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//                 <Dumbbell className="w-6 h-6 text-primary-foreground" />
//               </div>
//               <span className="text-xl font-bold text-foreground">GymKey</span>
//             </Link>
//           </div>

//           <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
//           <p className="text-muted-foreground mb-8">
//             Enter your credentials to access your dashboard
//           </p>

//           {/* Mobile credentials hint */}
//           <div className="lg:hidden mb-6 p-4 rounded-xl bg-muted">
//             <p className="text-foreground text-sm font-medium mb-2">Test Credentials:</p>
//             <p className="text-muted-foreground text-sm">Admin: admin@gymkey.com / admin123</p>
//             <p className="text-muted-foreground text-sm">Owner: owner@gymkey.com / owner123</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-opacity"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
//               ) : (
//                 <>
//                   Sign In
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </>
//               )}
//             </Button>
//           </form>

//           <p className="text-center text-muted-foreground mt-8">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-primary font-medium hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/owners/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save token + user
      login(data.token, data.user);

      toast({
        title: "Welcome back!",
        description: "Login successful",
      });
      console.log("USER AFTER LOGIN:", data.user);
      console.log("TOKEN:", data.token);

      // Role based redirect
      if (data.user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/owner", { replace: true });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
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
          <span className="text-xl font-bold text-sidebar-foreground">
            GymKey
          </span>
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
            Welcome Back
          </h1>
          <p className="text-sidebar-foreground/70 text-lg">
            Sign in to manage your gym and members.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-hero"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
