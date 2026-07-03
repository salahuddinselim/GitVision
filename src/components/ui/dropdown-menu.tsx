"use client";

import React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  inset?: boolean;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative">{children}</div>;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  return <div>{children}</div>;
}

export function DropdownMenuContent({ children, className, align = "start", ...props }: DropdownMenuContentProps) {
  return (
    <div
      className={`z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-surface p-1 text-gray-200 shadow-md ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className, inset, ...props }: DropdownMenuItemProps) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-700 ${inset ? "pl-8" : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: DropdownMenuSeparatorProps) {
  return <div className={`-mx-1 my-1 h-px bg-gray-700 ${className || ""}`} />;
}

DropdownMenu.displayName = "DropdownMenu";
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
DropdownMenuContent.displayName = "DropdownMenuContent";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";