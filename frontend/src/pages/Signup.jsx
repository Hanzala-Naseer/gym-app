// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Dumbbell, Mail, Lock, User, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";

// export default function Signup() {
//   const [name, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       // API call (commented)
//       // await authService.register(name, email, password);

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       localStorage.setItem("gymkey_pending_email", email);

//       toast({
//         title: "Registration successful!",
//         description: "Please check your email for the OTP code.",
//       });

//       navigate("/verify-otp");
//     } catch (error) {
//       toast({
//         title: "Registration failed",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
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
//           <span className="text-xl font-bold text-sidebar-foreground">
//             GymKey
//           </span>
//         </Link>
//         <div>
//           <h1 className="text-4xl font-bold text-sidebar-foreground mb-4">
//             Start Your Journey
//           </h1>
//           <p className="text-sidebar-foreground/70 text-lg">
//             Create an account to register your gym and start managing members
//             with ease.
//           </p>
//         </div>
//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
//               <span className="text-primary-foreground text-sm">1</span>
//             </div>
//             <span className="text-sidebar-foreground/70">
//               Create your account
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
//               <span className="text-sidebar-foreground/70 text-sm">2</span>
//             </div>
//             <span className="text-sidebar-foreground/70">
//               Verify your email
//             </span>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
//               <span className="text-sidebar-foreground/70 text-sm">3</span>
//             </div>
//             <span className="text-sidebar-foreground/70">
//               Register your gym
//             </span>
//           </div>
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

//           <h2 className="text-2xl font-bold text-foreground mb-2">
//             Create Account
//           </h2>
//           <p className="text-muted-foreground mb-8">
//             Enter your details to get started
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full name</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   id="name"
//                   type="text"
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

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
//                   minLength={8}
//                   required
//                 />
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Minimum 8 characters
//               </p>
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
//                   Create Account
//                   <ArrowRight className="ml-2 w-5 h-5" />
//                 </>
//               )}
//             </Button>
//           </form>

//           <p className="text-center text-muted-foreground mt-8">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="text-primary font-medium hover:underline"
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Missing fields",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/owners/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save email for OTP screen
      localStorage.setItem("gymkey_pending_email", email);

      toast({
        title: "Account created",
        description: "OTP sent to your email",
      });

      navigate("/verify-otp");
    } catch (error) {
      toast({
        title: "Registration failed",
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
            Start Your Journey
          </h1>
          <p className="text-sidebar-foreground/70 text-lg">
            Create an account to register your gym and manage members.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
                  minLength={8}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full gradient-hero"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
