"use client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const redirectPath = isAuthenticated ? "/dashboard" : "/";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, redirectPath]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Large Text */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20">
            404
          </div>
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! Page Not Found!
          </h1>
          <p className="text-muted-foreground text-lg">
            It seems like the page you&apos;re looking for does not exist or
            might have been removed.
          </p>
        </div>

        {/* Countdown Card */}
        <Card className="border-border bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Redirecting to {isAuthenticated ? "dashboard" : "home"} in:
            </p>
            <div className="text-3xl font-bold text-primary mb-2">
              {countdown}
            </div>
            <p className="text-xs text-muted-foreground">seconds</p>
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
          <Link href={redirectPath}>
            <Button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="h-4 w-4" />
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our{" "}
            <Link href="/support" className="text-primary hover:underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
