"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import AuthApi from "@/services/auth/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Loading from "../loading";

const schema = z
  .object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Token is missing.");
      setIsVerifying(false);
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await AuthApi.verifyRestPassToken({ token });
      const data = response.data;
      if (data.success) {
        setTokenValid(true);
        setUserEmail(data.data.email || "");
      } else {
        setError(data.message || "Invalid or expired reset link");
        setTokenValid(false);
      }
    } catch (error) {
      console.error("Token verification error:", error);
      setError("Failed to verify reset link. Please try again.");
      setTokenValid(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (formData) => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token");
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await AuthApi.resetPassword({ ...formData, token });
      const data = response?.data;

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return <Loading />;
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-center text-destructive">
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="border border-border rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">This could happen because:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>The link has expired (links are valid for 1 hour)</li>
                    <li>The link has already been used</li>
                    <li>The link is invalid or corrupted</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  onClick={() => router.push("/forgot-password")}
                >
                  Request New Reset Link
                </Button>
                <div className="text-center text-sm">
                  <Link href="/login" className="text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {success ? "Password Reset Successful!" : "Create New Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {success
                ? "Your password has been updated successfully"
                : userEmail
                ? `Resetting password for ${userEmail}`
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    Your password has been successfully reset. You can now log
                    in with your new password.
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg py-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Security Tip</p>
                    <p>
                      All your existing sessions remain active. If you suspect
                      unauthorized access, consider logging out from all
                      devices.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Go to Login
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Redirecting in 3 seconds...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Enter new password..."
                        className="pl-10"
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm password..."
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {status === "success" && (
                    <p className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> {message}
                    </p>
                  )}

                  {status === "error" && (
                    <p className="flex items-center text-sm text-red-600">
                      <XCircle className="w-4 h-4 mr-2" /> {message}
                    </p>
                  )}

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
