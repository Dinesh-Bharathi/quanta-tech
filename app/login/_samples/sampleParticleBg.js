"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "./_particles/ParticlesBackground";
import { LoginForm } from "@/sections/Login"; // you'll update next
import { ShieldCheck, Sparkles, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [capsLock, setCapsLock] = useState(false);

  // Detect Caps Lock
  useEffect(() => {
    const handleCaps = (e) => setCapsLock(e.getModifierState("CapsLock"));
    window.addEventListener("keydown", handleCaps);
    return () => window.removeEventListener("keydown", handleCaps);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Animated Particles */}
      <ParticlesBackground />

      {/* Floating Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-transparent dark:from-blue-900/20 blur-3xl" />

      {/* Page Wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 p-6 pt-12 sm:pt-20">
        {/* LEFT: FORM */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20 dark:border-slate-800/60"
        >
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Use your email and password to access your workspace.
            </p>
          </div>

          {/* CAP LOCK WARNING */}
          {capsLock && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300/50">
              <KeyRound className="h-4 w-4" />
              <span className="text-sm font-medium">Caps Lock is on</span>
            </div>
          )}

          {/* Login Form Component */}
          <div className="mt-6">
            <LoginForm />
          </div>
        </motion.div>

        {/* RIGHT: 3D ANIMATION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-10 rounded-3xl shadow-xl bg-white/60 dark:bg-slate-900/40 border border-white/30 dark:border-slate-800/40 backdrop-blur-xl"
          >
            <Sparkles className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl font-semibold mt-6"
          >
            Secure. Fast. Seamless.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-muted-foreground max-w-sm mt-3"
          >
            Your workspace is protected with enterprise-grade authentication,
            intelligent session management and modern zero-trust security.
          </motion.p>

          <motion.div
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="mt-8"
          >
            <ShieldCheck className="h-14 w-14 text-blue-500 dark:text-blue-300" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
