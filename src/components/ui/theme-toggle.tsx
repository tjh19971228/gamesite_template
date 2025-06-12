"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useTheme } from "@/lib/hooks/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 在组件挂载后设置mounted为true
  useEffect(() => {
    setMounted(true);
  }, []);

  // 如果组件尚未挂载，返回预渲染状态（避免水合不匹配）
  if (!mounted) {
    return <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-md" />;
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-md"
      title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {/* Sun icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 transition-opacity ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        } absolute`}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      
      {/* Moon icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 transition-opacity ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        } absolute`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      
      <span className="sr-only">
        {theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      </span>
    </Button>
  );
} 