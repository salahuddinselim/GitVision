"use client";

import { motion } from "framer-motion";
import { Terminal, Play, Code2, GitBranch } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CodeBlock from "@/components/CodeBlock";
import FeatureCard from "@/components/FeatureCard";

const docsSidebarItems = [
  { label: "Getting Started", href: "/docs", children: [
    { label: "What is Git?", href: "/docs/what-is-git" },
    { label: "Installation", href: "/docs/installation" },
    { label: "Configuration", href: "/docs/configuration" },
    { label: "Git Basics", href: "/docs/git-basics" },
  ]},
  { label: "Core Commands", href: "/docs/git-add", children: [
    { label: "git init", href: "/docs/git-init" },
    { label: "git clone", href: "/docs/git-clone" },
    { label: "git add", href: "/docs/git-add" },
    { label: "git commit", href: "/docs/git-commit" },
    { label: "git status", href: "/docs/git-status" },
    { label: "git diff", href: "/docs/git-diff" },
    { label: "git log", href: "/docs/git-log" },
    { label: "git branch", href: "/docs/git-branch" },
  ]},
  { label: "Branching & Merging", href: "/docs/git-branching", children: [
    { label: "git checkout", href: "/docs/git-checkout" },
    { label: "git switch", href: "/docs/git-switch" },
    { label: "git merge", href: "/docs/git-merge" },
    { label: "git rebase", href: "/docs/git-rebase" },
    { label: "git reset", href: "/docs/git-reset" },
  ]},
  { label: "Remote Repositories", href: "/docs/git-remote", children: [
    { label: "git remote", href: "/docs/git-remote" },
    { label: "git push", href: "/docs/git-push" },
    { label: "git pull", href: "/docs/git-pull" },
    { label: "git fetch", href: "/docs/git-fetch" },
  ]},
  { label: "Advanced", href: "/docs/git-stash", children: [
    { label: "git stash", href: "/docs/git-stash" },
    { label: "git tag", href: "/docs/git-tag" },
    { label: "git revert", href: "/docs/git-revert" },
    { label: "git cherry-pick", href: "/docs/git-cherry-pick" },
    { label: "git bisect", href: "/docs/git-bisect" },
    { label: "git blame", href: "/docs/git-blame" },
    { label: "git worktree", href: "/docs/git-worktree" },
    { label: "git submodule", href: "/docs/git-submodule" },
    { label: "git gc", href: "/docs/git-gc" },
    { label: "git fsck", href: "/docs/git-fsck" },
  ]},
  { label: "Git Internals", href: "/internals", children: [
    { label: "Blobs, Trees, Commits", href: "/internals#objects" },
    { label: "SHA Hashing", href: "/internals#hashing" },
    { label: "Packfiles", href: "/internals#packfiles" },
  ]},
];

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Comprehensive guides and references for all Git commands and concepts.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Commands Documented", value: "160+", icon: <Code2 className="w-5 h-5" /> },
            { label: "Lessons Available", value: "24", icon: <Play className="w-5 h-5" /> },
            { label: "Interactive Labs", value: "8", icon: <Terminal className="w-5 h-5" /> },
            { label: "Git Concepts", value: "50+", icon: <GitBranch className="w-5 h-5" /> },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-gray-700/50 bg-surface/50 p-4 text-center">
              <div className="text-primary mb-2 flex items-center justify-center">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-100">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-20">
              <Sidebar items={docsSidebarItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* Welcome Section */}
            <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to Git Documentation</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                GitVision’s documentation covers everything from basic Git commands to advanced workflows. Each article includes code examples, visual explanations, and interactive sandboxes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "New to Git?", desc: "Start with the basics — learn what Git is and how to set up your first repository.", href: "/docs/what-is-git" },
                  { title: "Need a Reference?", desc: "Quick lookup for any Git command with examples and options.", href: "/docs/git-add" },
                  { title: "Want to Practice?", desc: "Jump into the interactive playground and try commands yourself.", href: "/playground" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-colors cursor-pointer">
                      <h3 className="text-sm font-semibold text-primary mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Featured Commands */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-200">Essential Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { cmd: "git init", desc: "Initialize a new Git repository", difficulty: "Beginner", href: "/docs/git-init" },
                  { cmd: "git clone", desc: "Clone a remote repository locally", difficulty: "Beginner", href: "/docs/git-clone" },
                  { cmd: "git add", desc: "Stage changes for the next commit", difficulty: "Beginner", href: "/docs/git-add" },
                  { cmd: "git commit", desc: "Record staged changes to the repository", difficulty: "Beginner", href: "/docs/git-commit" },
                  { cmd: "git branch", desc: "List, create, or delete branches", difficulty: "Beginner", href: "/docs/git-branch" },
                  { cmd: "git merge", desc: "Join development histories together", difficulty: "Intermediate", href: "/docs/git-merge" },
                  { cmd: "git rebase", desc: "Reapply commits on top of another base", difficulty: "Intermediate", href: "/docs/git-rebase" },
                  { cmd: "git log", desc: "Show commit history", difficulty: "Beginner", href: "/docs/git-log" },
                  { cmd: "git diff", desc: "Show changes between commits, working tree, etc.", difficulty: "Beginner", href: "/docs/git-diff" },
                  { cmd: "git stash", desc: "Temporarily store uncommitted changes", difficulty: "Intermediate", href: "/docs/git-stash" },
                  { cmd: "git reset", desc: "Reset current HEAD to a specified state", difficulty: "Advanced", href: "/docs/git-reset" },
                  { cmd: "git bisect", desc: "Find which commit introduced a bug", difficulty: "Advanced", href: "/docs/git-bisect" },
                ].map((cmd) => (
                  <Link key={cmd.cmd} href={cmd.href}>
                    <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4 hover:border-primary/50 hover:bg-surface/80 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-bold text-primary group-hover:text-blue-300 transition-colors">{cmd.cmd}</code>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          cmd.difficulty === "Beginner" ? "bg-green-500/20 text-green-400" :
                          cmd.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {cmd.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{cmd.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}