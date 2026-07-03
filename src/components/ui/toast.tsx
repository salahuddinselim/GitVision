"use client";

import React from "react";

interface ToastProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastProviderProps {
  children: React.ReactNode;
  duration?: number;
}

interface ToastViewportProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <div>{children}</div>;
}

export function Toast({ children, ...props }: ToastProps) {
  return <div className="rounded-lg border border-gray-700 bg-surface p-4 shadow-lg">{children}</div>;
}

export function ToastTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold">{children}</div>;
}

export function ToastDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-500">{children}</div>;
}

export function ToastViewport({ children }: ToastViewportProps) {
  return <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">{children}</div>;
}

export const useToast = () => {
  return {
    toast: (props: ToastProps) => console.log("Toast:", props),
    dismiss: () => {},
  };
};