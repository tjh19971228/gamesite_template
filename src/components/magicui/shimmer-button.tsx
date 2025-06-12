"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shimmerColor?: string;
}

export function ShimmerButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  shimmerColor = "#ffffff",
  ...props
}: ShimmerButtonProps) {
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white border-primary-500",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white border-secondary-500",
    outline: "border-2 border-white text-white bg-transparent hover:bg-white hover:text-black",
    ghost: "text-white bg-white/10 hover:bg-white/20 border-transparent"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl"
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md font-medium transition-all duration-300",
        "border border-transparent",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {/* Shimmer Effect */}
      <div
        className="absolute inset-0 -top-2 -bottom-2 w-1/3 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 skew-x-12 animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}40, transparent)`,
          animation: "shimmer 2s infinite"
        }}
      />
      
      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Styles for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-200%) skewX(12deg);
          }
          100% {
            transform: translateX(300%) skewX(12deg);
          }
        }
      `}</style>
    </button>
  );
}

export default ShimmerButton; 