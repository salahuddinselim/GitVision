"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  title: string;
  href: string;
  description: string;
  type: "command" | "doc" | "tutorial" | "blog";
}

const SUGGESTIONS: SearchResult[] = [
  {
    title: "git init",
    href: "/docs/git-init",
    description: "Initialize a new Git repository",
    type: "command",
  },
  {
    title: "git add",
    href: "/docs/git-add",
    description: "Stage changes for commit",
    type: "command",
  },
  {
    title: "git commit",
    href: "/docs/git-commit",
    description: "Record changes to the repository",
    type: "command",
  },
  {
    title: "git branch",
    href: "/docs/git-branch",
    description: "List, create, or delete branches",
    type: "command",
  },
  {
    title: "git checkout",
    href: "/docs/git-checkout",
    description: "Switch branches or restore files",
    type: "command",
  },
  {
    title: "git merge",
    href: "/docs/git-merge",
    description: "Join two or more development histories",
    type: "command",
  },
  {
    title: "git rebase",
    href: "/docs/git-rebase",
    description: "Reapply commits on top of another base",
    type: "command",
  },
  {
    title: "git status",
    href: "/docs/git-status",
    description: "Show working tree status",
    type: "command",
  },
  {
    title: "git log",
    href: "/docs/git-log",
    description: "Show commit logs",
    type: "command",
  },
  {
    title: "git diff",
    href: "/docs/git-diff",
    description: "Show changes between commits",
    type: "command",
  },
  {
    title: "Git Basics Tutorial",
    href: "/learn",
    description: "Start learning Git from scratch",
    type: "tutorial",
  },
  {
    title: "Merge Conflicts Guide",
    href: "/merge-conflicts",
    description: "Learn to resolve conflicts visually",
    type: "tutorial",
  },
  {
    title: "Git Internals",
    href: "/internals",
    description: "Understand how Git works under the hood",
    type: "doc",
  },
  {
    title: "Linux Basics",
    href: "/linux-basics",
    description: "Learn terminal commands for Git",
    type: "tutorial",
  },
  {
    title: "Classroom Mode",
    href: "/classroom",
    description: "Teach Git to students visually",
    type: "doc",
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const filtered = query
    ? SUGGESTIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase()),
      )
    : SUGGESTIONS.slice(0, 8);

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors w-64 sm:w-72 text-left"
      >
        <Search className="w-4 h-4" />
        <span>Search commands, docs, tutorials...</span>
        <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400">
          /
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)}>
            <div className="relative max-w-2xl mx-auto mt-16 px-4">
              <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none text-white text-sm"
                    autoFocus
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-gray-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {filtered.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No results for “{query}”
                    </div>
                  )}
                  {filtered.map((result) => (
                    <button
                      key={result.href}
                      onClick={() => handleSelect(result.href)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-primary/10 transition-colors text-left"
                    >
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-primary/10 text-primary">
                        {result.type}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-100">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
