"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  Building2,
  ShieldCheck,
  Mail,
  AlertCircle,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import AuthApi from "@/services/auth/api";
import Loading from "@/app/loading";

export function TenantSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const globalSessionUuid = searchParams.get("global_session_uuid");
  const srcFrom = searchParams.get("src");
  const isFromGoogle = _.isEqual(srcFrom, "google");

  const { loginToTenant, tenantSelectionList } = useAuth();
  const [tenants, setTenants] = useState(tenantSelectionList || []);

  const [fetchingTenantList, setFetchingTenantList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (_.isEmpty(globalSessionUuid)) {
      router.replace("/login");
      return;
    }

    const fetchTenantSelection = async () => {
      try {
        const response = await AuthApi.getTenantSelectionList(
          globalSessionUuid
        );
        let data = response?.data?.data?.tenants || [];

        if (_.isEmpty(data)) {
          router.replace("/login");
          return;
        }

        // Normalize for Google
        if (isFromGoogle) {
          data = data.map((t) => ({ ...t, passwordMatched: true }));
        }

        // ✅ AUTO LOGIN when only 1 tenant
        if (data.length === 1) {
          await loginToTenant({
            global_session_uuid: globalSessionUuid,
            tenant_user_uuid: data[0].tenant_user_uuid,
          });

          router.replace("/dashboard"); // or wherever you want to redirect
          return; // 🚫 Do NOT close loader
        }

        // Show tenant list when > 1
        setTenants(data);
        setFetchingTenantList(false);
      } catch (err) {
        console.error("Failed to fetch tenant list", err);
        router.replace("/login");
      }
    };

    if (_.isEmpty(tenantSelectionList)) {
      fetchTenantSelection();
    } else {
      setFetchingTenantList(false);
    }
  }, [globalSessionUuid, tenantSelectionList]);

  const isTenantSelectable = (tenant) => isFromGoogle || tenant.passwordMatched;

  const handleTenantSelection = async (tenant) => {
    if (!isTenantSelectable(tenant)) return;

    setError("");
    setIsLoading(true);

    try {
      const success = await loginToTenant({
        global_session_uuid: globalSessionUuid,
        tenant_user_uuid: tenant.tenant_user_uuid,
      });

      if (!success) {
        setError("Failed to login to selected account. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Tenant login error", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    router.replace("/login");
    setTenants([]);
    setError("");
  };

  // Fullscreen Loader
  if (fetchingTenantList || isLoading) {
    return <Loading />;
  }

  // ✨ NEW UI Tenant Selection View
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg">
        <CardHeader className="md:col-span-2 text-center border-b p-6">
          <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl">Choose Your Workspace</CardTitle>
          <CardDescription>
            You&apos;re part of multiple accounts
          </CardDescription>

          {error && (
            <Alert variant="destructive" className="max-w-md mx-auto mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent className="p-6 md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {tenants.map((tenant) => (
              <button
                key={tenant.tenant_user_uuid}
                onClick={() => handleTenantSelection(tenant)}
                disabled={!isTenantSelectable(tenant)}
                className={`
                  group w-full p-4 rounded-xl border bg-card 
                  hover:border-primary hover:shadow-md 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  text-left transition-all
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold">{tenant.tenant_name}</h4>
                      {tenant.is_owner && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                          Owner
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {tenant.roles.join(" • ")}
                    </p>

                    {!tenant.is_email_verified && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" /> Not verified
                      </p>
                    )}
                  </div>

                  <CheckCircle2
                    className={`w-5 h-5 mt-1 ml-auto transition ${
                      isTenantSelectable(tenant)
                        ? "text-muted-foreground group-hover:text-primary"
                        : "opacity-0"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="md:col-span-2 p-6">
          <Button variant="outline" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 w-4 h-4" />
            Logout Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
