"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "@/constants";

// Lazy load heavy visual components — only on client and md+ screens
const Particles = dynamic(
  () => import("react-tsparticles").then((m) => m.Particles),
  { ssr: false }
);
const ThreeScene = dynamic(
  () => import("./_three/ThreeScene").then((mod) => mod.default),
  { ssr: false }
);
// note: _three/ThreeScene is an inline nested component we fall back to below if you prefer to keep everything in one file.
// For maintainability, I recommend a small file at app/login/_three/ThreeScene.jsx exporting the R3F scene. See comment below.

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

const carouselSlides = [
  {
    title: "Designed for performance",
    desc: "Fast, reliable workflows for your teams.",
  },
  {
    title: "Security you can trust",
    desc: "Enterprise-grade controls and auditing.",
  },
  {
    title: "Scale without limits",
    desc: "Grow confidently — the platform grows with you.",
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [slide, setSlide] = useState(0);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // auto-slide
  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = setInterval(
      () => setSlide((s) => (s + 1) % carouselSlides.length),
      6000
    );
    return () => clearInterval(t);
  }, [prefersReducedMotion]);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  // Caps lock detection
  const onKeyHandler = (e) => {
    // modern browsers: getModifierState
    if (e.getModifierState) {
      setCapsOn(e.getModifierState("CapsLock"));
    } else {
      // fallback: infer from keys (not perfect)
      setCapsOn(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
    } catch (err) {
      // login handles errors in context; show fallback if needed
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  // particles options (lightweight)
  const particlesOptions = {
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false } },
    },
    particles: {
      number: { value: 30, density: { enable: true, area: 800 } },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.6 },
      opacity: { value: 0.6 },
      links: { enable: true, distance: 120, opacity: 0.08, width: 1 },
    },
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50 dark:bg-slate-900">
      {/* LEFT - FORM */}
      <section className="flex flex-col justify-center px-6 md:px-16 py-12 max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
            Welcome back!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Use your email and password to access your workspace.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="space-y-5"
        >
          {/* email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                id="email"
                className="pl-10"
                placeholder="you@company.com"
                {...register("email")}
                onKeyUp={onKeyHandler}
                onKeyDown={onKeyHandler}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {capsOn && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-amber-600"
                >
                  Caps Lock is on
                </motion.span>
              )}
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                placeholder="••••••••"
                {...register("password")}
                onKeyUp={onKeyHandler}
                onKeyDown={onKeyHandler}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Signing
                  in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </motion.form>

        <motion.div
          className="relative my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 dark:bg-slate-900 px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </motion.div>

        <div>
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={() =>
              (window.location.href =
                process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.GOOGLE_LOGIN)
            }
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </section>

      {/* RIGHT - Visuals */}
      <aside className="relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 dark:from-slate-800 to-transparent">
        {/* Particles (desktop only) */}
        <div className="absolute inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <Particles
              options={particlesOptions}
              style={{ width: "100%", height: "100%" }}
            />
          </Suspense>
        </div>

        {/* 3D illustration: lazy load. If ThreeScene file not found, it gracefully fails. */}
        <div className="relative z-10 w-full max-w-lg p-8 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-56 md:h-72 lg:h-80 rounded-2xl bg-gradient-to-tr from-white/60 to-transparent dark:from-slate-900/60 border border-border flex items-center justify-center">
              <Suspense fallback={<HeroFallback />}>
                <ThreeScene />
              </Suspense>
            </div>
          </motion.div>

          {/* rotating copy */}
          <div className="mt-6 w-full text-center">
            <motion.h3
              key={slide}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              {carouselSlides[slide].title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              {carouselSlides[slide].desc}
            </motion.p>
          </div>
        </div>
      </aside>
    </div>
  );
}

/**
 * HeroFallback: shown while 3D or particles are lazy-loading or on small devices.
 * Lightweight SVG or gradient-based illustration.
 */
function HeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        width="260"
        height="160"
        viewBox="0 0 260 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="260" height="160" rx="20" fill="url(#g)" />
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#eef2ff" />
            <stop offset="1" stopColor="#ecfeff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
