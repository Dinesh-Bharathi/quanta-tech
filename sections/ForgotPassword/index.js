"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Loader2,
  CheckCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import AuthApi from "@/services/auth/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await AuthApi.forgotPassword(data);

      const result = res?.data;
      console.log("result", result);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSuccess(false);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              {success
                ? "Check your email for reset instructions"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    If an account exists with, you&apos;ll receive a password
                    reset link shortly. Please check your inbox and spam folder.
                  </AlertDescription>
                </Alert>

                <div className="py-4">
                  <h3 className="text-sm font-semibold mb-2">
                    What&apos;s next?
                  </h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the reset link (valid for 1 hour)</li>
                    <li>Create a new password</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSuccess(false);
                    }}
                  >
                    Send Another Link
                  </Button>
                  <div className="text-center text-sm">
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter email..."
                        className="pl-10"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* {status === "success" && (
                    <p className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" /> {message}
                    </p>
                  )}

                  {status === "error" && (
                    <p className="flex items-center text-sm text-red-600">
                      <XCircle className="w-4 h-4 mr-2" /> {message}
                    </p>
                  )} */}

                  <Button className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <Link href="/login" className="text-primary hover:underline">
                    Back to login
                  </Link>
                </div>
              </div>
            )}

            {!success && (
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-foreground hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
