"use client";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";

const learnSidebar = [
  { label: "Foundations", href: "/learn", children: [
    { label: "What is Git?", href: "/learn/what-is-git" },
    { label: "Installing Git", href: "/learn/installing-git" },
    { label: "Your First Repository", href: "/learn/first-repo" },
  ]},
  { label: "Basic Commands", href: "/learn/basics", children: [
    { label: "git add", href: "/learn/git-add" },
    { label: "git commit", href: "/learn/git-commit" },
    { label: "git status", href: "/learn/git-status" },
    { label: "git log", href: "/learn/git-log" },
  ]},
  { label: "Branching", href: "/learn/branching", children: [
    { label: "Creating Branches", href: "/learn/creating-branches" },
    { label: "Switching Branches", href: "/learn/switching-branches" },
    { label: "Merging", href: "/learn/merging" },
  ]},
  { label: "Intermediate", href: "/learn/intermediate", children: [
    { label: "Rebasing", href: "/learn/rebasing" },
    { label: "Stashing", href: "/learn/stashing" },
    { label: "Cherry-picking", href: "/learn/cherry-picking" },
  ]},
];

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3">
          <div className="lg:sticky lg:top-20">
            <Sidebar items={learnSidebar} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}