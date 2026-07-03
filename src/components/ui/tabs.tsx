"use client";

import React from "react";

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
}

export function Tabs({ children, defaultValue, ...props }: TabsProps) {
  return <div data-default-value={defaultValue} {...props}>{children}</div>;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return <div className={`inline-flex items-center justify-center rounded-lg bg-muted p-1 text-gray-500 ${className || ""}`} {...props}>{children}</div>;
}

export function TabsTrigger({ children, className, value, ...props }: TabsTriggerProps) {
  return <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all ${className || ""}`} data-value={value} {...props}>{children}</button>;
}

export function TabsContent({ children, className, value, ...props }: TabsContentProps) {
  return <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className || ""}`} data-value={value} {...props}>{children}</div>;
}