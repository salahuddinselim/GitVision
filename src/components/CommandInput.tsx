"use client";

import { useRef, useState, useMemo } from "react";
import { useGitStore } from "@/store/gitStore";
import { useTerminalStore } from "@/store/gitStore";

const GIT_COMMANDS = [
  "git init", "git status", "git add", "git commit -m", "git branch",
  "git checkout", "git switch", "git log", "git reflog", "git diff",
  "git merge", "git rebase", "git reset", "git stash", "git tag",
  "git remote add origin", "git push", "git pull", "git fetch",
  "git revert", "git cherry-pick", "git show", "git blame",
  "git restore", "git clean", "git bisect", "git worktree", "git config",
  "git clone", "git help",
  "undo", "redo", "clear", "help",
  "mkdir", "cd", "ls", "pwd", "touch", "echo", "cat", "rm", "mv", "cp",
];

export default function CommandInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalStore = useTerminalStore();
  const { processCommand } = useGitStore();
  const { input, setInput } = terminalStore;
  const [suggestionIdx, setSuggestionIdx] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  // Suggestions are a pure function of `input` — derive them during render
  // instead of syncing them via a state+effect pair.
  const rawSuggestions = useMemo(() => {
    if (!input.trim()) return [];
    return GIT_COMMANDS.filter((cmd) => cmd.startsWith(input.toLowerCase())).slice(0, 8);
  }, [input]);
  const suggestions = dismissed ? [] : rawSuggestions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await processCommand(input);
    setInput("");
    setSuggestionIdx(-1);
    setDismissed(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        const idx = suggestionIdx === -1 ? 0 : (suggestionIdx + 1) % suggestions.length;
        setSuggestionIdx(idx);
        setInput(suggestions[idx]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cmd = terminalStore.navigateHistory("up");
      if (cmd !== null) setInput(cmd);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cmd = terminalStore.navigateHistory("down");
      if (cmd !== null) setInput(cmd);
    } else if (e.key === "Escape") {
      setDismissed(true);
      setSuggestionIdx(-1);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
        <span className="text-green-400 font-mono text-sm font-bold select-none shrink-0">
          user@GitVision
        </span>
        <span className="text-gray-500 font-mono text-sm shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSuggestionIdx(-1);
            setDismissed(false);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command... (Tab to autocomplete, ↑↓ for history)"
          className="flex-1 bg-transparent outline-none text-white font-mono text-sm min-w-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-600">
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono">Tab</kbd>
          <span className="text-gray-600">⇥</span>
          <kbd className="px-1 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono">↑↓</kbd>
          <span className="text-gray-600">↕</span>
        </div>
      </form>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-xl z-50">
          {suggestions.map((s, i) => (
            <button
              key={s}
              type="button"
              className={`w-full text-left px-4 py-1.5 text-sm font-mono transition-colors ${
                i === suggestionIdx
                  ? "bg-primary/20 text-primary"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              onClick={() => {
                setInput(s);
                setDismissed(true);
                inputRef.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
