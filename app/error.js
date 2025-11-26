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
import { AlertCircle, ArrowLeft, RefreshCw, Home, Bug } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push(isAuthenticated ? "/accesscheck" : "/");
    }
  };

  const handleRefresh = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* 500 Large Text */}
        <div className="space-y-4">
          <div className="text-8xl md:text-9xl font-bold text-muted-foreground/20">
            500
          </div>
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Something Went Wrong!
          </h1>
          <p className="text-muted-foreground text-lg">
            We&apos;re experiencing some technical difficulties. Our team has
            been notified and is working to fix this issue.
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="border-destructive/20 bg-destructive/5 text-left">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <Bug className="h-5 w-5" />
              Error Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="font-mono text-sm bg-muted p-3 rounded border">
              {error.message || "An unexpected error occurred"}
            </CardDescription>
            {error.digest && (
              <CardDescription className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </CardDescription>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting Tips */}
        <Card className="border-border text-left">
          <CardHeader>
            <CardTitle className="text-lg">What can you do?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>Try refreshing the page</span>
            </CardDescription>
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>Check your internet connection</span>
            </CardDescription>
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>Clear your browser cache and cookies</span>
            </CardDescription>
            <CardDescription className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0">
                •
              </span>
              <span>Try again in a few minutes</span>
            </CardDescription>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Additional Navigation */}
        <div className="flex justify-center">
          <Link href={isAuthenticated ? "/accesscheck" : "/"}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Problem persists? Contact our{" "}
            <Link href="/support" className="text-primary hover:underline">
              support team
            </Link>{" "}
            with the error ID above
          </p>
        </div>
      </div>
    </div>
  );
}
