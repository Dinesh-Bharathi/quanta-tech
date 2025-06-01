"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  // Redirect to dashboard or login based on auth status
  if (isAuthenticated) {
    return redirect("/dashboard");
  }

  return null;
}
