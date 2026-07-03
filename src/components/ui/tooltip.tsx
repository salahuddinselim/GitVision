"use client";

import React from "react";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  content?: string;
}

export function Tooltip({ children, content, ...props }: TooltipProps) {
  return (
    <div className="group relative inline-block" {...props}>
      {children}
      {content && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}