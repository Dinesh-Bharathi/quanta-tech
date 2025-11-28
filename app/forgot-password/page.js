"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthApi from "@/services/auth/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Loader2,
  Building2,
  Users2,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // email | tenants | sent
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState(null);
  const [resetAll, setResetAll] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const submitEmail = async (data) => {
    setError("");
    setLoading(true);
    setEmail(data.email.trim().toLowerCase());

    try {
      const res = await AuthApi.getTenantsForEmail({ email: data.email });
      const list = res?.data?.data || [];
      setTenants(list);
      if (list.length === 1) setSelected(list[0].tenant_user_uuid);
      setStep("tenants");
    } catch {
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const sendReset = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = { email };

      if (resetAll) payload.resetAll = true;
      else if (selected) payload.tenant_user_uuid = selected;

      await AuthApi.sendPasswordResetForTenant(payload);
      setStep("sent");
    } catch {
      setError("Unable to send reset email(s). Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-lg border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {step === "email" && "Forgot Your Password?"}
            {step === "tenants" && "Choose an Account to Reset"}
            {step === "sent" && "Check Your Inbox"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* ---------------- EMAIL STEP ---------------- */}
          {step === "email" && (
            <form
              onSubmit={form.handleSubmit(submitEmail)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="your@email.com"
                    className="pl-10"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.email.message}
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
                  "Continue"
                )}
              </Button>
            </form>
          )}

          {/* ---------------- TENANT SELECTION ---------------- */}
          {step === "tenants" && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setStep("email")}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>

              <p className="text-sm text-muted-foreground">
                We found {tenants.length} account
                {tenants.length !== 1 ? "s" : ""} linked to{" "}
                <strong>{email}</strong>.
              </p>

              <div className="space-y-3">
                {/* Tenant Cards */}
                {tenants.map((t) => (
                  <div
                    key={t.tenant_user_uuid}
                    className={`border rounded-lg p-4 cursor-pointer transition hover:bg-blend-lighten ${
                      selected === t.tenant_user_uuid && !resetAll
                        ? "border-primary bg-muted"
                        : "border-border"
                    }`}
                    onClick={() => {
                      setSelected(t.tenant_user_uuid);
                      setResetAll(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {t.tenant_name ?? "Personal Account"}
                          </p>
                          {/* <p className="text-xs text-muted-foreground">
                            Tenant UUID: {t.tenant_uuid ?? "N/A"}
                          </p> */}
                        </div>
                      </div>

                      <Badge variant={t.is_owner ? "default" : "outline"}>
                        {t.is_owner ? "Owner" : "Member"}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Reset ALL */}
                {tenants.length > 1 && (
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition hover:bg-muted ${
                      resetAll ? "border-primary bg-muted" : "border-border"
                    }`}
                    onClick={() => {
                      setResetAll(true);
                      setSelected(null);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Reset All Accounts</p>
                          <p className="text-xs text-muted-foreground">
                            Sends a separate reset link for each tenant.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button className="w-full" disabled={loading} onClick={sendReset}>
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </div>
          )}

          {/* ---------------- SUCCESS ---------------- */}
          {step === "sent" && (
            <div className="space-y-5 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-green-600" />

              <p className="text-sm text-muted-foreground">
                If an account exists for <strong>{email}</strong>, password
                reset instructions have been sent.
              </p>

              <Separator />

              <Button className="w-full" onClick={() => setStep("email")}>
                Send Another Link
              </Button>

              <Link
                href="/login"
                className="text-sm text-primary underline block mt-2"
              >
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
