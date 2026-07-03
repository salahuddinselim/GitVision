"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight, Lightbulb, GitBranch, Terminal, AlertTriangle } from "lucide-react";
import { useGitStore } from "@/store/gitStore";

interface Suggestion {
  icon: React.ReactNode;
  title: string;
  description: string;
  command?: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorContext, setErrorContext] = useState<string | null>(null);
  const store = useGitStore();
  const { initialized, commits, branches, files, head } = store;

  const suggestions = useMemo((): Suggestion[] => {
    const results: Suggestion[] = [];

    if (!initialized) {
      results.push({
        icon: <Terminal className="w-4 h-4 text-green-400" />,
        title: "Start Here",
        description: "Initialize a Git repository to begin",
        command: "git init",
      });
      return results;
    }

    const stagedCount = files.filter((f) => f.status === "staged").length;
    const modifiedCount = files.filter((f) => f.status === "modified").length;
    const untrackedCount = files.filter((f) => f.status === "untracked").length;

    if (untrackedCount > 0 && stagedCount === 0) {
      results.push({
        icon: <GitBranch className="w-4 h-4 text-blue-400" />,
        title: "Stage Your Files",
        description: `${untrackedCount} untracked file(s) — stage them with git add`,
        command: "git add .",
      });
    }

    if (stagedCount > 0) {
      results.push({
        icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        title: "Ready to Commit",
        description: `${stagedCount} staged file(s) — create a commit to save the snapshot`,
        command: 'git commit -m "Your message"',
      });
    }

    if (modifiedCount > 0 && stagedCount === 0) {
      results.push({
        icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
        title: "Modified Files",
        description: `${modifiedCount} modified file(s) — stage them before committing`,
        command: "git status",
      });
    }

    if (commits.length === 0 && stagedCount === 0 && untrackedCount === 0) {
      results.push({
        icon: <Terminal className="w-4 h-4 text-gray-400" />,
        title: "Create Some Files",
        description: "Use touch or echo to create files, then stage and commit them",
        command: "touch app.js",
      });
    }

    if (commits.length > 0 && branches.length < 2) {
      results.push({
        icon: <GitBranch className="w-4 h-4 text-primary" />,
        title: "Try Branching",
        description: "Create a branch to work on features in isolation",
        command: "git branch feature",
      });
    }

    if (branches.length > 1 && head === "master") {
      const otherBranches = branches.filter((b) => !b.isHead && b.name !== "master");
      if (otherBranches.length > 0) {
        results.push({
          icon: <GitBranch className="w-4 h-4 text-primary" />,
          title: "Switch Branches",
          description: `Try switching to '${otherBranches[0].name}' to see its commits`,
          command: `git checkout ${otherBranches[0].name}`,
        });
      }
    }

    if (branches.length > 1 && commits.length > 1) {
      const currentBranch = branches.find((b) => b.isHead);
      const otherBranches = branches.filter((b) => !b.isHead);
      if (currentBranch && otherBranches.length > 0) {
        results.push({
          icon: <GitBranch className="w-4 h-4 text-primary" />,
          title: "Merge Branches",
          description: `Merge '${otherBranches[0].name}' into '${currentBranch.name}'`,
          command: `git merge ${otherBranches[0].name}`,
        });
      }
    }

    if (Object.keys(store.remotes).length === 0 && commits.length > 0) {
      results.push({
        icon: <Sparkles className="w-4 h-4 text-primary" />,
        title: "Add a Remote",
        description: "Configure a remote to practice push/pull workflows",
        command: "git remote add origin https://github.com/user/repo.git",
      });
    }

    return results;
  }, [initialized, files, commits, branches, head, store.remotes]);

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    if (suggestion.command) {
      await store.processCommand(suggestion.command);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full bg-primary shadow-lg transition-all duration-300 ${
          isOpen ? "scale-110" : "hover:scale-110"
        }`}
        title="AI Git Assistant"
      >
        <Sparkles className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-45" : ""}`} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-80 bg-surface border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-primary/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-200">Git Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-500">
                  {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1">
              {suggestions.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p>No suggestions right now</p>
                  <p className="text-xs mt-1">Keep working — I&apos;ll guide you!</p>
                </div>
              ) : (
                suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{suggestion.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-200 group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {suggestion.description}
                        </p>
                        {suggestion.command && (
                          <div className="mt-1.5 flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            {suggestion.command}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-700 bg-surface/50">
              <p className="text-[10px] text-gray-600 text-center">
                AI Assistant analyzes your repo state and suggests next steps
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
