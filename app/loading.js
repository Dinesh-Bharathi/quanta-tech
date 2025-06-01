import React from "react";
import "tailwindcss/tailwind.css";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/5" />

        {/* Accent color highlights */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/3 to-transparent" />

        {/* Floating Geometric Shapes with theme colors */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 4 === 0
                ? "bg-primary/15 w-3 h-3"
                : i % 4 === 1
                ? "bg-secondary/20 w-2 h-2"
                : i % 4 === 2
                ? "bg-accent/15 w-2.5 h-2.5"
                : "bg-muted/25 w-2 h-2"
            }`}
            style={{
              left: `${10 + ((i * 7) % 80)}%`,
              top: `${10 + ((i * 13) % 80)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}

        {/* Subtle Grid Pattern using border color */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              mask: "radial-gradient(circle at center, transparent 40%, black 70%)",
            }}
          />
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Central Loading Animation */}
        <div className="relative">
          {/* Outer Ring with primary color */}
          <div className="w-32 h-32 rounded-full border-2 border-border relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
              style={{ animationDuration: "2s" }}
            />
            <div
              className="absolute inset-2 rounded-full border border-accent/60 border-b-transparent animate-spin"
              style={{
                animationDuration: "1.5s",
                animationDirection: "reverse",
              }}
            />
          </div>

          {/* Inner Pulsing Core with theme colors */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary/30 animate-pulse flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full bg-primary/15 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Orbiting Elements with varied theme colors */}
          <div
            className="absolute inset-0 animate-spin"
            style={{ animationDuration: "4s" }}
          >
            <div className="absolute -top-1 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2" />
            <div className="absolute top-1/2 -right-1 w-2.5 h-2.5 bg-accent rounded-full transform -translate-y-1/2" />
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-secondary rounded-full transform -translate-x-1/2" />
            <div className="absolute top-1/2 -left-1 w-2.5 h-2.5 bg-muted rounded-full transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Corner Decorative Elements with theme colors */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-accent/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-secondary/40 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-muted/40 rounded-br-lg" />

      {/* Additional decorative elements with theme integration */}
      <div className="absolute top-1/4 left-8 w-4 h-4 border border-primary/20 rounded rotate-45 animate-spin" />
      <div
        className="absolute bottom-1/4 right-8 w-3 h-3 border border-accent/20 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-3/4 left-16 w-2 h-8 bg-gradient-to-b from-secondary to-transparent rounded-full opacity-40" />
      <div className="absolute top-1/3 right-16 w-8 h-2 bg-gradient-to-r from-muted to-transparent rounded-full opacity-40" />
    </div>
  );
}
