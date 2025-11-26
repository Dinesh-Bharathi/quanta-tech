"use client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, ArrowLeft, LogIn, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push(isAuthenticated ? "/accesscheck" : "/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 403 Large Text */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20">
            403
          </div>
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-lg">
            You don&apos;t have permission to access this resource. Please check
            your credentials or contact an administrator.
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-border text-left">
          <CardHeader>
            <CardTitle className="text-lg">Why am I seeing this?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>You may not be logged in with the correct account</span>
            </CardDescription>
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>Your account may not have sufficient permissions</span>
            </CardDescription>
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>The resource may have been moved or restricted</span>
            </CardDescription>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          {!isAuthenticated ? (
            <Link href="/login">
              <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          ) : (
            <Link href={"/accesscheck"}>
              <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          )}
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need access? Contact your{" "}
            <Link href="/support" className="text-primary hover:underline">
              administrator
            </Link>{" "}
            or{" "}
            <Link href="/support" className="text-primary hover:underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
