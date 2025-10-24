// app/(dashboard)/loading.js
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const increment = Math.random() * 20;
        return Math.min(prev + increment, 85);
      });
    }, 200);

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center">
      {/* Ambient background effect */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div> */}

      {/* Main loading content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Animated loader circle */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />

          {/* Inner orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[0, 120, 240].map((rotation, i) => (
              <div
                key={i}
                className="absolute w-full h-full animate-spin"
                style={{
                  animationDuration: "3s",
                  animationDelay: `${i * -1}s`,
                }}
              >
                <div
                  className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2"
                  style={{
                    transform: `rotate(${rotation}deg) translateY(-36px)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Loading{".".repeat(dots)}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="mt-8 space-y-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shimmer {
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
