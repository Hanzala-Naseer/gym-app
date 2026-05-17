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

//     if (!name || !email || !password) {
//       toast({
//         title: "Missing fields",
//         description: "All fields are required",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (password.length < 8) {
//       toast({
//         title: "Weak password",
//         description: "Password must be at least 8 characters",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/owners/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       // Save email for OTP screen
//       localStorage.setItem("gymkey_pending_email", email);

//       toast({
//         title: "Account created",
//         description: "OTP sent to your email",
//       });

//       navigate("/verify-otp");
//     } catch (error) {
//       toast({
//         title: "Registration failed",
//         description: error.message,
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
//             Create an account to register your gym and manage members.
//           </p>
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <h2 className="text-2xl font-bold text-foreground mb-2">
//             Create Account
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <Label>Full name</Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   value={name}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Email</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                 <Input
//                   type="password"
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
//               className="w-full gradient-hero"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 "Creating account..."
//               ) : (
//                 <>
//                   Create Account <ArrowRight className="ml-2 w-5 h-5" />
//                 </>
//               )}
//             </Button>
//           </form>

//           <p className="text-center text-muted-foreground mt-8">
//             Already have an account?{" "}
//             <Link to="/login" className="text-primary hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/pages/Signup.jsx
// src/pages/Signup.jsx
// src/pages/Signup.jsx

// src/pages/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Dumbbell, Mail, Lock, User, AlertCircle } from "lucide-react";

import { authService } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // const onSubmit = async ({ name, email, password }) => {
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const response = await authService.register(
  //       name.trim(),
  //       email.trim().toLowerCase(),
  //       password,
  //     );

  //     if (!response?.success) {
  //       throw new Error(response?.message || "Registration failed");
  //     }

  //     navigate("/verify-otp", {
  //       state: {
  //         email,
  //         name,
  //         flow: "signup",
  //       },
  //     });
  //   } catch (err) {
  //     setError(err?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ─────────────────────────────────────────────────────────────
  // ONLY FLOW UPDATED — DESIGN KEPT EXACTLY SAME
  // ADD THIS INSIDE onSubmit SUCCESS
  // ─────────────────────────────────────────────────────────────

  const onSubmit = async ({ name, email, password }) => {
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await authService.register(
        name.trim(),
        normalizedEmail,
        password,
      );

      if (!response?.success) {
        throw new Error(response?.message || "Registration failed");
      }

      // Store pending verification data
      localStorage.setItem("gymkey_pending_email", normalizedEmail);
      localStorage.setItem("gymkey_signup_flow", "signup");

      // Navigate to OTP screen
      navigate("/verify-otp", {
        replace: true,
        state: {
          email: normalizedEmail,
          name,
          flow: "signup",
        },
      });
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
            Create your account
          </h1>

          <p className="text-sm sm:text-base text-[#faf3e9]/70 mt-2 max-w-xs">
            Join thousands of gym members and manage your fitness journey
          </p>
        </div>
      </div>

      {/* ───────────────── Form Section ───────────────── */}
      <div className="flex-1 px-5 pb-8 relative">
        <div className="max-w-md mx-auto bg-white rounded-[32px] shadow-2xl border border-[#f4ede3] px-6 py-7 -mt-8 relative z-20">
          {/* Error Alert */}
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2c1a0e]">
                Full name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#885210]" />

                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="pl-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
              </div>

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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
                  className="pl-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2c1a0e]">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#885210]" />

                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create password"
                  className="pl-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2c1a0e]">
                Confirm password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#885210]" />

                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  className="pl-12 h-14 rounded-2xl border-[#eadfce] focus-visible:ring-[#885210]"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white font-bold text-base shadow-lg transition-all mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[#ece3d7]" />
            <span className="text-xs text-[#9b8f86] font-medium">OR</span>
            <div className="h-px flex-1 bg-[#ece3d7]" />
          </div>

          {/* Login */}
          <p className="text-center text-sm text-[#4f453f]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#885210] hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs leading-relaxed text-[#81756e] mt-4 px-2">
            By creating an account you agree to our{" "}
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
