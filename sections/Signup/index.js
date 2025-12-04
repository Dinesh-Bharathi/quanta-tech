"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Clock,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  RefreshCcw,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { API_ENDPOINTS } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import AuthApi from "@/services/auth/api";
import { useRouter } from "next/navigation";
import { errorResponse, successResponse } from "@/lib/response";
import { encryption } from "@/lib/encryption";

//  Validation
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  //  Signup handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const body = {
        user_name: data.username,
        user_email: data.email,
        password: data.password,
      };

      const encryptData = encryption(body);

      const res = await AuthApi.signupUser({ data: encryptData });

      const resData = successResponse(res, true);

      if (resData.success) {
        toast.success(
          resData?.message || "Signup successful! Please verify your email."
        );
        setEmailSent(true);
        setEmail(data.email);
        if (resData?.data?.redirect) router.push(resData?.data?.redirect);
      } else {
        toast.error(response?.message || "Signup failed");
      }
    } catch (err) {
      const error = errorResponse(err, true);
      console.error(error);
      toast.error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  //  Resend verification email
  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await AuthApi.resendVerificationEmail({ user_email: email });
      if (res.status === 200) toast.success(res.data?.message);
      if (res?.data?.data?.redirect) router.push(res?.data?.data?.redirect);
      setTimer(120); //timer
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsResending(false);
    }
  };

  // timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  return (
    <div className="space-y-4">
      {!emailSent ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 max-w-sm mx-auto p-1 rounded-lg"
        >
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Enter your username"
                className="pl-10"
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary-foreground" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <div className="grid grid-cols-1 gap-4 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                const APIURL = process.env.NEXT_PUBLIC_API_URL;
                const signupUrl = APIURL.concat(API_ENDPOINTS.GOOGLE_SIGNUP);
                window.open(signupUrl.toString(), "_self");
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Signup with Google
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      ) : (
        //  Email Verification Section with animation
        // <div className="text-center max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-sm animate-fadeIn">
        //   <MailCheck className="mx-auto mb-3 h-10 w-10 text-primary animate-bounce" />
        //   <p className="text-sm mb-3 text-gray-400">
        //     We’ve sent a verification link to{" "}
        //     <span className="font-medium text-gray-300">{email}</span>.
        //   </p>
        //   <p className="text-sm mb-6 text-gray-400">
        //     Please verify your email to continue.
        //   </p>

        //   <Button
        //     onClick={handleResend}
        //     variant="outline"
        //     className={`flex items-center justify-center mx-auto transition-all duration-200 ${
        //       timer > 0 || isResending
        //         ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
        //         : ""
        //     }`}
        //     disabled={isResending || timer > 0}
        //   >
        //     <RefreshCcw className="h-4 w-4 mr-2" />
        //     {isResending ? "Resending..." : "Resend Email"}
        //   </Button>

        //   {/* Timer Display Below Button */}
        //   {timer > 0 && (
        //     <div className="flex items-center justify-center mt-3 text-sm text-gray-400">
        //       <Clock className="h-4 w-4 mr-1 text-primary animate-pulse" />
        //       <span>Resend available in {timer}s</span>
        //     </div>
        //   )}

        //   {/* Smooth pulsing loader animation */}
        //   <div className="flex justify-center mt-4 text-gray-500 text-xs">
        //  <Loader2 className="h-4 w-4 animate-spin mr-1 text-primary" />
        //      Hang tight-Waiting for verification...
        //    </div>

        // </div> // for light color
        <div className="text-center max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-md bg-gray-900 animate-fadeIn">
          <MailCheck className="mx-auto mb-4 h-10 w-10 text-primary animate-bounce" />

          <p className="text-sm mb-2 text-gray-300">
            Verification link sent to{" "}
            <span className="font-medium text-white">{email}</span>.
          </p>
          <p className="text-sm mb-6 text-gray-400">
            Please check your inbox to activate your account.
          </p>

          <Button
            onClick={handleResend}
            variant="outline"
            className={`flex items-center justify-center mx-auto transition-all duration-200 ${
              timer > 0 || isResending
                ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
                : ""
            }`}
            disabled={isResending || timer > 0}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            {isResending ? "Resending..." : "Resend Email"}
          </Button>

          {timer > 0 && (
            <div className="flex items-center justify-center mt-3 text-sm text-gray-400">
              <Clock className="h-4 w-4 mr-1 text-primary animate-pulse" />
              <span>You can resend in {timer}s</span>
            </div>
          )}

          <div className="flex justify-center mt-5 text-gray-500 text-xs">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary ml-2" />
            <span>Hang tight — we’re waiting for your verification...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
