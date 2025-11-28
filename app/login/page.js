"use client";

import Image from "next/image";
import { LoginForm } from "@/sections/Login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-xl border bg-background rounded-xl overflow-hidden">
        {/* Left: Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center md:text-left">
            Welcome Back
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6 text-center md:text-left">
            Sign in to continue to your workspace
          </p>

          <LoginForm />
        </div>

        {/* Right side visual */}
        <div className="hidden md:block relative bg-muted">
          <Image
            src="/placeholder.svg"
            alt="Login Illustration"
            fill
            className="absolute inset-0 object-cover dark:brightness-[0.5] dark:grayscale"
            priority
          />
        </div>
      </div>
    </div>
  );
}
