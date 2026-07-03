"use client";

import { motion } from "framer-motion";
import { Code2, Play, GitBranch, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "git init",
      href: "/docs/git-init",
      desc: "Initialize a new Git repository",
      category: "Repository Creation",
      difficulty: "Beginner",
    },
    {
      title: "git clone",
      desc: "Clone a remote repository",
      href: "/docs/git-clone",
      category: "Repository Creation",
      difficulty: "Beginner",
    },
    {
      title: "git add",
      desc: "Stage changes for commit",
      href: "/docs/git-add",
      category: "Snapshot Commands",
      difficulty: "Beginner",
    },
    {
      title: "git commit",
      desc: "Record changes to the repository",
      href: "/docs/git-commit",
      category: "Snapshot Commands",
      difficulty: "Beginner",
    },
    {
      title: "git status",
      desc: "Show working tree status",
      href: "/docs/git-status",
      category: "Snapshot Commands",
      difficulty: "Beginner",
    },
    {
      title: "git diff",
      desc: "Show changes between commits",
      href: "/docs/git-diff",
      category: "Snapshot Commands",
      difficulty: "Beginner",
    },
    {
      title: "git branch",
      desc: "List, create, or delete branches",
      href: "/docs/git-branch",
      category: "Branching",
      difficulty: "Beginner",
    },
    {
      title: "git checkout",
      desc: "Switch branches or restore files",
      href: "/docs/git-checkout",
      category: "Branching",
      difficulty: "Intermediate",
    },
    {
      title: "git switch",
      desc: "Switch branches (modern alternative)",
      href: "/docs/git-switch",
      category: "Branching",
      difficulty: "Intermediate",
    },
    {
      title: "git merge",
      desc: "Join development histories",
      href: "/docs/git-merge",
      category: "Branching",
      difficulty: "Intermediate",
    },
    {
      title: "git rebase",
      desc: "Reapply commits on top of another base",
      href: "/docs/git-rebase",
      category: "Branching",
      difficulty: "Advanced",
    },
    {
      title: "git reset",
      desc: "Reset current HEAD to a specified state",
      href: "/docs/git-reset",
      category: "Undoing Changes",
      difficulty: "Advanced",
    },
    {
      title: "git revert",
      desc: "Revert a commit by creating a new one",
      href: "/docs/git-revert",
      category: "Undoing Changes",
      difficulty: "Intermediate",
    },
    {
      title: "git restore",
      desc: "Restore files in the working tree",
      href: "/docs/git-restore",
      category: "Undoing Changes",
      difficulty: "Intermediate",
    },
    {
      title: "git stash",
      desc: "Temporarily store uncommitted changes",
      href: "/docs/git-stash",
      category: "Stashing",
      difficulty: "Intermediate",
    },
    {
      title: "git log",
      desc: "Show commit logs",
      href: "/docs/git-log",
      category: "Inspection",
      difficulty: "Beginner",
    },
    {
      title: "git reflog",
      desc: "Record of all actions performed in repo",
      href: "/docs/git-reflog",
      category: "Inspection",
      difficulty: "Intermediate",
    },
    {
      title: "git show",
      desc: "Show info about a git object",
      href: "/docs/git-show",
      category: "Inspection",
      difficulty: "Intermediate",
    },
    {
      title: "git blame",
      desc: "Show who last modified each line of a file",
      href: "/docs/git-blame",
      category: "Inspection",
      difficulty: "Intermediate",
    },
    {
      title: "git remote",
      desc: "Manage remote repositories",
      href: "/docs/git-remote",
      category: "Remote Repositories",
      difficulty: "Beginner",
    },
    {
      title: "git push",
      desc: "Push local changes to a remote",
      href: "/docs/git-push",
      category: "Remote Repositories",
      difficulty: "Beginner",
    },
    {
      title: "git pull",
      desc: "Fetch and merge from remote",
      href: "/docs/git-pull",
      category: "Remote Repositories",
      difficulty: "Beginner",
    },
    {
      title: "git fetch",
      desc: "Fetch objects and refs from a remote",
      href: "/docs/git-fetch",
      category: "Remote Repositories",
      difficulty: "Intermediate",
    },
    {
      title: "git cherry-pick",
      desc: "Apply specific commits from another branch",
      href: "/docs/git-cherry-pick",
      category: "Advanced",
      difficulty: "Advanced",
    },
    {
      title: "git bisect",
      desc: "Find which commit introduced a bug",
      href: "/docs/git-bisect",
      category: "Advanced",
      difficulty: "Advanced",
    },
    {
      title: "git tag",
      desc: "Create, list, or delete tags",
      href: "/docs/git-tag",
      category: "Advanced",
      difficulty: "Intermediate",
    },
    {
      title: "git worktree",
      desc: "Work on multiple branches simultaneously",
      href: "/docs/git-worktree",
      category: "Advanced",
      difficulty: "Advanced",
    },
    {
      title: "git submodule",
      desc: "Manage nested repositories",
      href: "/docs/git-submodule",
      category: "Advanced",
      difficulty: "Advanced",
    },
    {
      title: "git gc",
      desc: "Clean up and optimize the repository",
      href: "/docs/git-gc",
      category: "Advanced",
      difficulty: "Advanced",
    },
    {
      title: "git fsck",
      desc: "Verify the integrity of the repository",
      href: "/docs/git-fsck",
      category: "Advanced",
      difficulty: "Advanced",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Git <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Command Reference</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comprehensive documentation for all major Git commands with examples, visualizations, and best practices.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search commands..."
              className="w-full bg-surface border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  level === "All"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-surface border border-gray-700/50 text-gray-400 hover:text-gray-200 hover:border-gray-500"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-10">
          {["Repository Creation", "Snapshot Commands", "Branching", "Undoing Changes", "Stashing", "Inspection", "Remote Repositories", "Advanced"].map((category) => {
            const cmds = sections.filter((s) => s.category === category);
            if (!cmds.length) return null;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-xl font-bold mb-4 text-gray-200 flex items-center gap-2">
                  <span className="w-1 h-6 rounded bg-primary/60"></span>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cmds.map((cmd) => (
                    <a key={cmd.title} href={cmd.href} className="group block">
                      <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all h-full">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-200 group-hover:text-primary transition-colors">
                            <code className="text-base">{cmd.title}</code>
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            cmd.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-400"
                              : cmd.difficulty === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {cmd.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{cmd.desc}</p>
                        <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          View docs <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}