// import { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Dumbbell, ArrowRight, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";

// export default function VerifyOtp() {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);

//   const inputRefs = useRef([]);
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { toast } = useToast();

//   const email = localStorage.getItem("gymkey_pending_email");

//   useEffect(() => {
//     if (!email) {
//       navigate("/signup");
//     }
//   }, [email, navigate]);

//   const handleChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;

//     const updatedOtp = [...otp];
//     updatedOtp[index] = value;
//     setOtp(updatedOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").slice(0, 6);

//     if (!/^\d+$/.test(pasted)) return;

//     const updatedOtp = [...otp];
//     pasted.split("").forEach((d, i) => (updatedOtp[i] = d));
//     setOtp(updatedOtp);
//     inputRefs.current[Math.min(pasted.length, 5)]?.focus();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       toast({
//         title: "Invalid OTP",
//         description: "Please enter all 6 digits",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/owners/verify-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, otp: otpCode }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       login(data.token, data.user);
//       localStorage.removeItem("gymkey_pending_email");

//       toast({
//         title: "Email verified",
//         description: "Welcome to GymKey 🎉",
//       });

//       navigate("/dashboard/owner");
//     } catch (error) {
//       toast({
//         title: "Verification failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setIsResending(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to resend OTP");
//       }

//       toast({
//         title: "OTP resent",
//         description: "Please check your email",
//       });
//     } catch (error) {
//       toast({
//         title: "Resend failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsResending(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-8">
//       <div className="w-full max-w-md">
//         <Link to="/" className="flex items-center gap-2 justify-center mb-8">
//           <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
//             <Dumbbell className="w-6 h-6 text-primary-foreground" />
//           </div>
//           <span className="text-xl font-bold text-foreground">GymKey</span>
//         </Link>

//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
//           <p className="text-muted-foreground">
//             Enter the 6-digit code sent to <br />
//             <span className="font-medium text-foreground">{email}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="flex justify-center gap-3" onPaste={handlePaste}>
//             {otp.map((digit, i) => (
//               <input
//                 key={i}
//                 ref={(el) => (inputRefs.current[i] = el)}
//                 value={digit}
//                 maxLength={1}
//                 inputMode="numeric"
//                 onChange={(e) => handleChange(i, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(i, e)}
//                 className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
//               />
//             ))}
//           </div>

//           <Button
//             type="submit"
//             className="w-full gradient-hero"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               "Verifying..."
//             ) : (
//               <>
//                 Verify & Continue <ArrowRight className="ml-2 w-5 h-5" />
//               </>
//             )}
//           </Button>
//         </form>

//         <div className="text-center mt-8">
//           <p className="text-muted-foreground mb-4">Didn’t receive the code?</p>
//           <Button
//             variant="ghost"
//             onClick={handleResend}
//             disabled={isResending}
//             className="text-primary"
//           >
//             <RefreshCw
//               className={`mr-2 w-4 h-4 ${isResending && "animate-spin"}`}
//             />
//             Resend Code
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";

import {
  Dumbbell,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useToast();
  const { login } = useAuth();

  const email =
    location.state?.email || localStorage.getItem("gymkey_pending_email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // ───────────────── OTP INPUT ─────────────────

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;

    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updated = [...otp];

    pasted.split("").forEach((digit, i) => {
      updated[i] = digit;
    });

    setOtp(updated);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // ───────────────── VERIFY ─────────────────

  // ───────────────── VERIFY ─────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // use service instead of raw fetch
      const data = await authService.verifyOtp(email, code);

      // login user
      login(data.token, data.user);

      // cleanup
      localStorage.removeItem("gymkey_pending_email");
      localStorage.removeItem("gymkey_signup_flow");

      toast({
        title: "Email verified",
        description: "Welcome to GymKey 🎉",
      });

      navigate("/dashboard/owner", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────── RESEND ─────────────────

  const handleResend = async () => {
    try {
      setResending(true);

      // use service
      await authService.resendOtp(email);

      toast({
        title: "OTP sent",
        description: "Please check your email inbox",
      });
    } catch (err) {
      toast({
        title: "Resend failed",
        description: err.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   setError("");

  //   const code = otp.join("");

  //   if (code.length !== 6) {
  //     setError("Please enter complete 6-digit OTP");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/owners/verify-otp`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           email,
  //           otp: code,
  //         }),
  //       },
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "OTP verification failed");
  //     }

  //     // login user
  //     login(data.token, data.user);

  //     localStorage.removeItem("gymkey_pending_email");
  //     localStorage.removeItem("gymkey_signup_flow");

  //     toast({
  //       title: "Email verified",
  //       description: "Welcome to GymKey 🎉",
  //     });

  //     navigate("/dashboard/owner", {
  //       replace: true,
  //     });
  //   } catch (err) {
  //     setError(err.message || "Verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // ───────────────── RESEND ─────────────────

  // const handleResend = async () => {
  //   try {
  //     setResending(true);

  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email }),
  //       },
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to resend OTP");
  //     }

  //     toast({
  //       title: "OTP sent",
  //       description: "Please check your email inbox",
  //     });
  //   } catch (err) {
  //     toast({
  //       title: "Resend failed",
  //       description: err.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setResending(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#fff8f0] flex flex-col overflow-hidden">
      {/* ───────────────── Hero ───────────────── */}
      <div className="relative h-56 bg-[#2c1a0e] overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#885210]/20 blur-3xl" />
        <div className="absolute -bottom-10 left-8 w-40 h-40 rounded-full bg-[#fdb56c]/10 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

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
            Verify your email
          </h1>

          <p className="text-sm sm:text-base text-[#faf3e9]/70 mt-2 max-w-xs">
            Enter the secure 6-digit code sent to your email
          </p>
        </div>
      </div>

      {/* ───────────────── Card ───────────────── */}
      <div className="flex-1 px-5 pb-8 relative">
        <div className="max-w-md mx-auto bg-white rounded-[32px] shadow-2xl border border-[#f4ede3] px-6 py-7 -mt-8 relative z-20">
          {/* Email Display */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#fff8f0] border border-[#f0e4d4] mb-6">
            <div className="w-11 h-11 rounded-2xl bg-[#fdf0dd] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#885210]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#8b7b70] font-medium">
                Verification code sent to
              </p>

              <p className="text-sm font-semibold text-[#2c1a0e] truncate">
                {email}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#fecaca] bg-[#ffdad6] px-4 py-3 text-sm text-[#93000a]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP FORM */}
          <form onSubmit={handleSubmit}>
            {/* OTP BOXES */}
            <div
              className="flex items-center justify-between gap-2 mb-6"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 rounded-2xl border border-[#eadfce] text-center text-xl font-black text-[#2c1a0e] focus:outline-none focus:ring-2 focus:ring-[#885210]/30 focus:border-[#885210]"
                />
              ))}
            </div>

            {/* Verify */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#885210] hover:bg-[#6f420d] text-white font-bold text-base shadow-lg transition-all"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-sm text-[#81756e] mb-3">
              Didn’t receive the code?
            </p>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resending}
              className="text-[#885210] hover:bg-[#fff3e4]"
            >
              <RefreshCw
                className={`mr-2 w-4 h-4 ${resending ? "animate-spin" : ""}`}
              />
              Resend Code
            </Button>
          </div>

          {/* Back */}
          <button
            onClick={() => navigate("/signup")}
            className="w-full mt-5 flex items-center justify-center gap-2 text-sm text-[#81756e] hover:text-[#2c1a0e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to signup
          </button>
        </div>
      </div>
    </div>
  );
}
