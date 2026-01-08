// import { useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Dumbbell, ArrowRight, RefreshCw } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';

// export default function VerifyOtp() {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const inputRefs = useRef([]);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const email = localStorage.getItem('gymkey_pending_email') || '';

//   const handleChange = (index, value) => {
//     if (value.length > 1) {
//       value = value[0];
//     }

//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').slice(0, 6);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = [...otp];
//     pastedData.split('').forEach((char, i) => {
//       if (i < 6) newOtp[i] = char;
//     });
//     setOtp(newOtp);
//     inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const otpString = otp.join('');
//     if (otpString.length !== 6) {
//       toast({
//         title: 'Invalid OTP',
//         description: 'Please enter all 6 digits.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // API call (commented)
//       // const response = await authService.verifyOtp(email, otpString);

//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const mockUser = {
//         id: '1',
//         fullName: 'John Doe',
//         email: email,
//         role: 'owner',
//       };

//       login('mock-jwt-token', mockUser);
//       localStorage.removeItem('gymkey_pending_email');

//       toast({
//         title: 'Email verified!',
//         description: 'Welcome to GymKey.',
//       });

//       navigate('/dashboard/owner');
//     } catch (error) {
//       toast({
//         title: 'Verification failed',
//         description: 'Invalid OTP. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setIsResending(true);
//     try {
//       // API call (commented)
//       // await authService.resendOtp(email);

//       await new Promise(resolve => setTimeout(resolve, 1000));

//       toast({
//         title: 'OTP resent!',
//         description: 'Please check your email.',
//       });
//     } catch (error) {
//       toast({
//         title: 'Failed to resend',
//         description: 'Please try again later.',
//         variant: 'destructive',
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
//           <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
//           <p className="text-muted-foreground">
//             We sent a 6-digit code to{' '}
//             <span className="font-medium text-foreground">{email}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           <div className="flex justify-center gap-3" onPaste={handlePaste}>
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//               />
//             ))}
//           </div>

//           <Button
//             type="submit"
//             className="w-full gradient-hero text-primary-foreground shadow-primary hover:opacity-90 transition-opacity"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
//             ) : (
//               <>
//                 Verify & Continue
//                 <ArrowRight className="ml-2 w-5 h-5" />
//               </>
//             )}
//           </Button>
//         </form>

//         <div className="text-center mt-8">
//           <p className="text-muted-foreground mb-4">Didn't receive the code?</p>
//           <Button
//             variant="ghost"
//             onClick={handleResend}
//             disabled={isResending}
//             className="text-primary"
//           >
//             {isResending ? (
//               <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
//             ) : (
//               <RefreshCw className="mr-2 w-4 h-4" />
//             )}
//             Resend Code
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const email = localStorage.getItem("gymkey_pending_email");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

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
    const pasted = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    const updatedOtp = [...otp];
    pasted.split("").forEach((d, i) => (updatedOtp[i] = d));
    setOtp(updatedOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/owners/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      login(data.token, data.user);
      localStorage.removeItem("gymkey_pending_email");

      toast({
        title: "Email verified",
        description: "Welcome to GymKey 🎉",
      });

      navigate("/dashboard/owner");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast({
        title: "OTP resent",
        description: "Please check your email",
      });
    } catch (error) {
      toast({
        title: "Resend failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">GymKey</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full gradient-hero"
            disabled={isLoading}
          >
            {isLoading ? (
              "Verifying..."
            ) : (
              <>
                Verify & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">Didn’t receive the code?</p>
          <Button
            variant="ghost"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary"
          >
            <RefreshCw
              className={`mr-2 w-4 h-4 ${isResending && "animate-spin"}`}
            />
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  );
}
