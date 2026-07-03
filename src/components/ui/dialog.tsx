"use client";

import React from "react";

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Dialog({ children, ...props }: DialogProps) {
  return <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center" {...props}>{children}</div>;
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  return <div className={`fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-700 bg-background p-6 shadow-lg duration-200 rounded-lg ${className || ""}`} {...props}>{children}</div>;
}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <p className={`text-sm text-gray-500 ${className || ""}`} {...props} />;
}