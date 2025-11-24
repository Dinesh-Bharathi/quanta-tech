"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  X,
  AlertTriangle,
  Ban,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SubscriptionBanner({ subscriptionData }) {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [status, setStatus] = useState("active");
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!subscriptionData) return;

    const calculateDaysRemaining = () => {
      const now = new Date();
      const endDate = new Date(subscriptionData.end_date);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDaysRemaining(diffDays);

      // Determine status based on days remaining
      if (diffDays <= -3) {
        // Day 4 onwards after expiry - Account Suspended
        setStatus("suspended");
      } else if (diffDays < 0) {
        // Days 1-3 after expiry - Grace Period
        setStatus("grace_period");
      } else if (diffDays <= 3) {
        // 3 days or less before expiry - Critical
        setStatus("critical");
      } else if (diffDays <= 14) {
        // 14 days or less before expiry - Warning
        setStatus("warning");
      } else {
        // More than 14 days - Active (don't show banner)
        setStatus("active");
      }
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [subscriptionData]);

  useEffect(() => {
    if (!subscriptionData) return;

    // Show dialog for expired states
    if (status === "grace_period" || status === "suspended") {
      setShowDialog(true);
      return;
    }

    // Don't show banner if more than 14 days remaining
    if (status === "active") {
      setIsMounted(false);
      return;
    }

    // Check localStorage for banner dismissal (only for warning/critical states)
    const dismissed = localStorage.getItem("subscription-banner-dismissed");
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const now = new Date();

    // Show banner again after 24 hours of dismissal
    const shouldShow =
      !dismissed ||
      (dismissedDate &&
        now.getTime() - dismissedDate.getTime() > 24 * 60 * 60 * 1000);

    if (shouldShow) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [subscriptionData, status]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
      localStorage.setItem(
        "subscription-banner-dismissed",
        new Date().toISOString()
      );
    }, 300);
  };

  const handleAction = () => {
    window.location.href = "/subscription";
  };

  const handleDialogClose = () => {
    // Prevent closing dialog for suspended accounts
    if (status === "suspended") {
      return;
    }
    setShowDialog(false);
  };

  if (!subscriptionData) return null;

  const { plan_details, is_auto_renew, end_date } = subscriptionData;
  const isTrial = plan_details?.is_trial;

  // Dialog content for expired states
  const getDialogContent = () => {
    if (status === "suspended") {
      return {
        icon: Ban,
        iconColor: "text-destructive",
        title: "Account Suspended",
        description: `Your ${
          plan_details?.plan_name || "subscription"
        } has been suspended due to non-payment. Please renew your subscription immediately to restore access.`,
        actionText: "Renew Subscription",
        cancelText: null, // No cancel button for suspended
        variant: "destructive",
      };
    }

    if (status === "grace_period") {
      const graceDaysLeft = 3 + daysRemaining; // daysRemaining is negative
      return {
        icon: AlertTriangle,
        iconColor: "text-orange-600 dark:text-orange-500",
        title: isTrial
          ? "Trial Expired - Grace Period"
          : "Subscription Expired - Grace Period",
        description: `Your ${
          plan_details?.plan_name || "subscription"
        } has expired. You have ${graceDaysLeft} ${
          graceDaysLeft === 1 ? "day" : "days"
        } of grace period remaining before your account is suspended.`,
        actionText: "Renew Now",
        cancelText: "Remind Me Later",
        variant: "default",
      };
    }

    return null;
  };

  // Banner content for warning/critical states
  const getBannerConfig = () => {
    if (status === "critical") {
      return {
        variant: "destructive",
        icon: XCircle,
        title: isTrial
          ? "Trial Ending Very Soon!"
          : "Subscription Ending Very Soon!",
        message: is_auto_renew
          ? `Your subscription will auto-renew in ${daysRemaining} ${
              daysRemaining === 1 ? "day" : "days"
            }.`
          : `Your ${
              plan_details?.plan_name || "subscription"
            } expires in ${daysRemaining} ${
              daysRemaining === 1 ? "day" : "days"
            }. Renew now to avoid service interruption.`,
        actionText: is_auto_renew ? "Manage Subscription" : "Renew Now",
        showDays: true,
      };
    }

    if (status === "warning") {
      return {
        variant: "default",
        icon: isTrial ? Clock : AlertCircle,
        title: isTrial ? "Trial Ending Soon" : "Subscription Ending Soon",
        message: is_auto_renew
          ? `Your subscription will auto-renew on ${new Date(
              end_date
            ).toLocaleDateString()}.`
          : `Your ${
              plan_details?.plan_name || "subscription"
            } expires in ${daysRemaining} days. Consider ${
              isTrial ? "upgrading" : "renewing"
            } to continue uninterrupted access.`,
        actionText: is_auto_renew
          ? "Manage Subscription"
          : isTrial
          ? "Upgrade Now"
          : "Renew Now",
        showDays: true,
      };
    }

    return null;
  };

  const dialogContent = getDialogContent();
  const bannerConfig = getBannerConfig();

  // Render Dialog for expired states
  if (showDialog && dialogContent) {
    const DialogIcon = dialogContent.icon;
    return (
      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) =>
            status === "suspended" && e.preventDefault()
          }
        >
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-full bg-destructive/10`}>
                <DialogIcon className={dialogContent.iconColor} size={24} />
              </div>
              <DialogTitle className="text-xl">
                {dialogContent.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              {dialogContent.description}
            </DialogDescription>
            {!isTrial && plan_details?.plan_description && (
              <p className="text-sm text-muted-foreground pt-2">
                {plan_details.plan_description}
              </p>
            )}
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {dialogContent.cancelText && (
              <Button variant="outline" onClick={handleDialogClose}>
                {dialogContent.cancelText}
              </Button>
            )}
            <Button
              variant={dialogContent.variant}
              onClick={handleAction}
              className="w-full sm:w-auto"
            >
              {dialogContent.actionText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Render Banner for warning/critical states
  if (!isMounted || !bannerConfig) return null;

  const BannerIcon = bannerConfig.icon;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 pb-4 sm:px-6 lg:px-8">
        <Alert
          variant={bannerConfig.variant}
          className="shadow-lg bg-background"
        >
          <div className="flex items-start gap-3">
            <BannerIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <AlertTitle className="mb-1">{bannerConfig.title}</AlertTitle>
                  <AlertDescription className="text-sm">
                    {bannerConfig.message}
                  </AlertDescription>
                  {!isTrial && plan_details?.plan_description && (
                    <p className="text-xs opacity-75 mt-1">
                      {plan_details.plan_description}
                    </p>
                  )}
                  <Button
                    variant={
                      bannerConfig.variant === "destructive"
                        ? "destructive"
                        : "default"
                    }
                    size="sm"
                    className="mt-3"
                    onClick={handleAction}
                  >
                    {bannerConfig.actionText}
                  </Button>
                </div>

                <div className="flex items-start gap-2">
                  {bannerConfig.showDays && daysRemaining > 0 && (
                    <div className="border rounded-md px-3 py-1.5 text-center flex-shrink-0 bg-background">
                      <div className="font-bold text-lg leading-none">
                        {daysRemaining}
                      </div>
                      <div className="text-xs opacity-75">
                        {daysRemaining === 1 ? "day" : "days"}
                      </div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={handleClose}
                    aria-label="Close banner"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}
