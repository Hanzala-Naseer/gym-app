// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Dumbbell, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import api from "@/services/api";

// /** Decode JWT payload — same helper as AuthContext, no library needed */
// function decodeJwt(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
//     return JSON.parse(window.atob(padded));
//   } catch {
//     return {};
//   }
// }

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
//       const { data } = await api.post("/auth/login", { email, password });

//       if (!data.success) throw new Error(data.message || "Login failed");

//       // Backend user object does NOT include role — it lives only in the JWT.
//       // Decode the token to get role for redirect, then pass both to AuthContext.
//       const payload = decodeJwt(data.token);
//       const role = payload.role; // "admin" | "owner" | "user"

//       // Merge role into user so AuthContext stores it correctly
//       login(data.token, { ...data.user, role });

//       toast({
//         title: "Welcome back!",
//         description: `Signed in as ${data.user.name}`,
//       });

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
//                   Sign In <ArrowRight className="w-4 h-4" />
//                 </span>
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Dumbbell, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

/* Decode JWT */
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
  const navigate = useNavigate();

  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const payload = decodeJwt(data.token);
      const role = payload.role;

      login(data.token, {
        ...data.user,
        role,
      });

      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.user.name}`,
      });

      if (role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      } else {
        navigate("/dashboard/owner", { replace: true });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";

      setError(message);

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col overflow-hidden">
      {/* ───────────────── Hero Section ───────────────── */}
      <div className="relative h-56 bg-[#2c1a0e] overflow-hidden flex-shrink-0">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#885210]/20 blur-3xl" />
        <div className="absolute -bottom-10 left-8 w-40 h-40 rounded-full bg-[#fdb56c]/10 blur-3xl" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <Link
            to="/"
            className="flex items-center gap-3 mb-4 transition-opacity hover:opacity-90"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#fdb56c] flex items-center justify-center shadow-lg">
              <Dumbbell className="w-5 h-5 text-[#2c1a0e]" />
            </div>

            <span className="text-[#fdf6ec] text-xl font-black tracking-wide">
              GymKey
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Welcome back
          </h1>

          <p className="text-sm sm:text-base text-[#faf3e9]/70 mt-2 max-w-xs">
            Sign in to manage your gym and track your members
          </p>
        </div>
      </div>

      {/* ───────────────── Login Card ───────────────── */}
      <div className="flex-1 px-5 pb-8 relative">
        <div className="max-w-md mx-auto bg-white rounded-[32px] shadow-2xl border border-[#f4ede3] px-6 py-7 -mt-8 relative z-20">
          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-2xl border border-[#fecaca] bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2c1a0e]">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#885210]" />

                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2c1a0e]">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#885210]" />

                <Input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#885210] hover:opacity-70 transition"
                >
                  {showPw ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-[#885210] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white font-bold text-base shadow-lg transition-all mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#ece3d7]" />
            <span className="text-xs text-[#9b8f86] font-medium">OR</span>
            <div className="h-px flex-1 bg-[#ece3d7]" />
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-[#4f453f]">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#885210] hover:underline"
            >
              Create account
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs leading-relaxed text-[#81756e] mt-4 px-2">
            By continuing you agree to our{" "}
            <span className="text-[#885210] font-semibold cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#885210] font-semibold cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
