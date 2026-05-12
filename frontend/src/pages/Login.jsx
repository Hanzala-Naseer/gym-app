// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Dumbbell, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import api from "@/services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast({
//         title: "Missing fields",
//         description: "Please enter email and password",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // POST /api/owners/login
//       // Returns: { success, token, user: { id, name, email, role, gymId } }
//       const { data } = await api.post("/owners/login", { email, password });

//       if (!data.success) throw new Error(data.message || "Login failed");

//       login(data.token, data.user);

//       toast({
//         title: "Welcome back!",
//         description: `Signed in as ${data.user.name}`,
//       });

//       // Determine role for redirect — comes from user object or JWT payload
//       let role = data.user?.role;
//       if (!role) {
//         try {
//           role = JSON.parse(atob(data.token.split(".")[1])).role;
//         } catch {
//           role = "owner";
//         }
//       }

//       if (role === "admin") navigate("/dashboard/admin", { replace: true });
//       else navigate("/dashboard/owner", { replace: true });
//     } catch (err) {
//       toast({
//         title: "Login failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Left panel */}
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
//             Welcome Back
//           </h1>
//           <p className="text-sidebar-foreground/70 text-lg">
//             Sign in to manage your gym, track members, and view analytics.
//           </p>
//         </div>

//         <p className="text-xs text-sidebar-foreground/40">
//           © {new Date().getFullYear()} GymKey
//         </p>
//       </div>

//       {/* Right panel */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-6">
//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center gap-2 mb-2">
//             <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
//               <Dumbbell className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-lg font-bold">GymKey</span>
//           </div>

//           <div>
//             <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
//             <p className="text-muted-foreground text-sm mt-1">
//               Don&apos;t have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-primary hover:underline font-medium"
//               >
//                 Sign up
//               </Link>
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div className="space-y-1.5">
//               <Label htmlFor="email">Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10"
//                   placeholder="you@example.com"
//                   required
//                   autoComplete="email"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="space-y-1.5">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="password"
//                   type={showPw ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-10 pr-10"
//                   placeholder="••••••••"
//                   required
//                   autoComplete="current-password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPw((v) => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                   tabIndex={-1}
//                 >
//                   {showPw ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full gradient-hero text-primary-foreground"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center gap-2">
//                   <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                   Signing in…
//                 </span>
//               ) : (
//                 <span className="flex items-center gap-2">
//                   Sign In
//                   <ArrowRight className="w-4 h-4" />
//                 </span>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

/** Decode JWT payload — same helper as AuthContext, no library needed */
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(window.atob(padded));
  } catch {
    return {};
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
      const { data } = await api.post("/auth/login", { email, password });

      if (!data.success) throw new Error(data.message || "Login failed");

      // Backend user object does NOT include role — it lives only in the JWT.
      // Decode the token to get role for redirect, then pass both to AuthContext.
      const payload = decodeJwt(data.token);
      const role = payload.role; // "admin" | "owner" | "user"

      // Merge role into user so AuthContext stores it correctly
      login(data.token, { ...data.user, role });

      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.user.name}`,
      });

      if (role === "admin") navigate("/dashboard/admin", { replace: true });
      else navigate("/dashboard/owner", { replace: true });
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
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
            Sign in to manage your gym, track members, and view analytics.
          </p>
        </div>
        <p className="text-xs text-sidebar-foreground/40">
          © {new Date().getFullYear()} GymKey
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">GymKey</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign In</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-hero text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
