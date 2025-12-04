"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthApi from "@/services/auth/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import {
  Loader2,
  AlertCircle,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Building2,
} from "lucide-react";
import Loading from "../loading";

const schema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Page() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line
  }, []);

  const verifyToken = async () => {
    if (!token) {
      setError("Missing reset token");
      setLoading(false);
      return;
    }

    try {
      const res = await AuthApi.verifyResetPassToken({ token });
      if (res.data.success) {
        setMeta(res.data.data);
        setTokenValid(true);
      } else {
        setError(res.data.message);
        setTokenValid(false);
      }
    } catch {
      setError("Unable to verify reset link.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const res = await AuthApi.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => router.replace("/login"), 2500);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOADING -------------------
  if (loading) return <Loading />;

  // ---------------- INVALID TOKEN SCREEN -------------------
  if (!tokenValid)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="w-5 h-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <Separator />

            <Button
              className="w-full"
              onClick={() => router.push("/forgot-password")}
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  // ---------------- SUCCESS SCREEN -------------------
  if (success)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-center">
              Password Reset Successful
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 text-center">
            <CheckCircle2 className="mx-auto w-16 h-16" />

            <p className="text-sm text-muted-foreground">
              You can now sign in using your new password.
            </p>

            <Separator />

            <Button className="w-full" onClick={() => router.replace("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  // ---------------- RESET FORM -------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-center">Create New Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <Building2 className="w-5 h-5" />
            <div>
              <p className="font-medium">{meta.tenant_name}</p>
              <p className="text-xs">{meta.email}</p>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10"
                  {...form.register("password")}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className="rounded-lg bg-muted px-4 py-3 flex gap-3 text-sm">
            <ShieldCheck className="w-4 h-4 mt-0.5" />
            <p className="text-muted-foreground">
              For security reasons, this password applies only to this account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
