# Design Document: GitVision Platform Complete

## Overview

GitVision is a Next.js 16 / React 19 / Tailwind CSS v4 / TypeScript interactive Git visualization learning platform. This design covers two parallel workstreams:

1. **Bug Fixes** — 30 identified defects that prevent the application from building and running correctly.
2. **UI Completion** — Full product design across all pages and components.

The platform simulates Git entirely in the browser via a Zustand store (`useGitStore`), renders an interactive terminal via `@xterm/xterm`, visualizes commit graphs via `@xyflow/react`, and persists data via IndexedDB. All pages are Next.js App Router Server Components where possible, with `"use client"` used only where browser APIs or interactivity are required.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                        │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Server      │  │  Client      │  │  Hybrid              │  │
│  │  Components  │  │  Components  │  │  (layout + children) │  │
│  │              │  │              │  │                      │  │
│  │  /docs/*     │  │  /playground │  │  /learn/layout.tsx   │  │
│  │  /learn/*    │  │  Navbar      │  │  /app/layout.tsx     │  │
│  │  /blog       │  │  Terminal    │  │                      │  │
│  │  /commands   │  │  GitGraph    │  │                      │  │
│  │  /internals  │  │  CommandInput│  │                      │  │
│  │  /classroom  │  │  SplitView   │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌──────────────────────────────────────────┐
│  Next.js        │  │           Zustand Stores                  │
│  Metadata API   │  │                                           │
│  (SEO)          │  │  useGitStore        useTerminalStore      │
│                 │  │  ─────────────      ─────────────────     │
│  robots.ts      │  │  GitState           TerminalState         │
│  sitemap.ts     │  │  GitActions         history[]             │
└─────────────────┘  │  processCommand()   addEntry()            │
                     │  gitCommit()        clearInput()          │
                     │  gitCheckout()      setInput()            │
                     └──────────────────────────────────────────┘
                                  │
                     ┌────────────┴────────────┐
                     ▼                         ▼
              ┌─────────────┐         ┌──────────────┐
              │  IndexedDB  │         │  @xterm/xterm │
              │  (db.ts)    │         │  Terminal UI  │
              │  sessions   │         │  FitAddon     │
              │  replays    │         │  WebLinksAddon│
              │  settings   │         └──────────────┘
              │  progress   │
              └─────────────┘
```

### Data Flow: Command Execution Pipeline

```
User types command
       │
       ▼
CommandInput (client component)
  - reads input from useTerminalStore().input
  - validates: rejects empty/whitespace-only
  - calls processCommand(input) from useGitStore
       │
       ▼
useGitStore.processCommand(input)
  - tokenizes: parts = input.trim().split(/\s+/)
  - dispatches to gitInit / gitAdd / gitCommit / etc.
  - returns { success: boolean, message: string }
       │
       ▼
CommandInput receives result
  - calls useTerminalStore.getState().addEntry({
      command: input,
      output: result.message,
      timestamp: Date.now(),
      type: result.success ? "output" : "error"
    })
  - calls clearInput()
       │
       ▼
useTerminalStore.history updated (Zustand reactive)
       │
       ▼
playground/page.tsx passes history as entries prop to Terminal
       │
       ▼
Terminal useEffect [entries] fires
  - reads lastEntry = entries[entries.length - 1]
  - writes "$ command" to xterm
  - writes output (red if error)
  - calls fitAddonRef.current.fit()
```

---

## Component Hierarchy

```
RootLayout (src/app/layout.tsx)  [Server Component]
├── <html lang="en" suppressHydrationWarning>
│   └── <body>
│       ├── Providers (src/components/Providers.tsx)  [Client]
│       │   └── ThemeProvider (next-themes)
│       ├── Navbar (src/components/Navbar.tsx)  [Client]
│       │   ├── Logo link
│       │   ├── Desktop nav links (usePathname active state)
│       │   ├── ThemeToggle
│       │   └── Mobile hamburger → drawer
│       └── {children}
│
├── / (page.tsx)  [Server Component]
│   ├── HeroTerminal  [Client — animated demo]
│   ├── FeatureCards grid  [Server]
│   ├── WhyGitVision section  [Server]
│   ├── DemoPreview  [Server]
│   ├── BlogPreview  [Server]
│   ├── Testimonials  [Server]
│   ├── FAQAccordion  [Client — @radix-ui/react-accordion]
│   └── Footer  [Server]
│
├── /playground (page.tsx)  [Client Component]
│   ├── SplitView  [Client]
│   │   ├── FileExplorer  [Client]
│   │   ├── Terminal  [Client — xterm.js]
│   │   ├── CommandInput  [Client]
│   │   ├── GitGraph  [Client — @xyflow/react]
│   │   └── StagingArea  [Client]
│   └── ReplayTimeline  [Client]
│
├── /docs (page.tsx)  [Server Component]
│   ├── Sidebar (command categories)
│   ├── SearchInput  [Client]
│   └── CommandCards grid
│
├── /docs/[command] (page.tsx)  [Server Component]
│   ├── CodeBlock (syntax)
│   ├── Options table
│   ├── Usage examples (CodeBlock)
│   ├── Visual diagram
│   ├── Common mistakes
│   └── Related commands
│
├── /learn (layout.tsx)  [Server Component]
│   ├── Sidebar (lesson tree)
│   └── {children}
│
├── /learn (page.tsx)  [Server Component]
│   └── Track cards (Beginner / Intermediate / Advanced)
│
├── /blog (page.tsx)  [Server Component]
│   ├── FeaturedPost
│   ├── BlogFilter  [Client — tag state]
│   └── PostGrid
│
├── /commands (page.tsx)  [Server Component]
│   └── CommandsFilter  [Client — search + category state]
│
├── /linux-basics (page.tsx)  [Server Component]
│   └── LinuxSearch  [Client — search state]
│
├── /merge-conflicts (page.tsx)  [Client Component]
│   └── ConflictResolver
│
├── /internals (page.tsx)  [Server Component]
│   └── Animated object model diagrams (Framer Motion)
│
└── /classroom (page.tsx)  [Server Component]
    └── ClassroomUI
```

---

## State Management Design

### useGitStore (src/store/gitStore.ts)

Persisted via Zustand `persist` middleware to `localStorage` key `"gitvision-storage"`. Partial persistence — only serializable state (no functions).

**State shape:**

```typescript
interface GitState {
  cwd: string; // current working directory, default "/"
  initialized: boolean; // whether git init has been run
  files: GitFile[]; // virtual filesystem
  commits: GitCommit[]; // commit history
  branches: GitBranch[]; // branch list
  head: string; // MUST be branch name (e.g. "master"), not hash
  detachedHead: boolean;
  staging: string[]; // file IDs currently staged
  tags: Record<string, string>;
  remotes: Record<string, string>;
  stash: GitCommit[];
  history: string[]; // command history strings
}
```

**Key invariant (Bug Fix #14):** `head` must always equal the current branch's `name` after a commit or checkout, never the commit hash. The `gitCommit` action currently sets `head: hash` — this must be changed to `head: currentBranch.name`.

### useTerminalStore (src/store/gitStore.ts)

Persisted via Zustand `persist` middleware to `localStorage` key `"gitvision-terminal"`.

```typescript
interface TerminalState {
  history: CommandHistoryEntry[];
  input: string;
  addEntry: (entry: CommandHistoryEntry) => void;
  clearHistory: () => void;
  setInput: (input: string) => void;
  clearInput: () => void;
}

interface CommandHistoryEntry {
  command: string;
  output: string;
  timestamp: number;
  type: "input" | "output" | "error";
}
```

### Client Component State (local useState)

| Component      | State              | Type                                  |
| -------------- | ------------------ | ------------------------------------- |
| SplitView      | viewMode           | `"combined" \| "terminal" \| "graph"` |
| Navbar         | mobileOpen         | `boolean`                             |
| CommandInput   | historyIndex       | `number`                              |
| BlogFilter     | activeTag          | `string \| null`                      |
| LinuxSearch    | query              | `string`                              |
| CommandsFilter | query, category    | `string, string \| null`              |
| FAQAccordion   | (managed by Radix) | —                                     |

---

## Routing Structure

```
/                          → src/app/page.tsx
/playground                → src/app/playground/page.tsx
/docs                      → src/app/docs/page.tsx
/docs/git-add              → src/app/docs/git-add/page.tsx
/docs/git-commit           → src/app/docs/git-commit/page.tsx
... (40 command pages)
/learn                     → src/app/learn/page.tsx
/learn/what-is-git         → src/app/learn/what-is-git/page.tsx
/learn/[other-lessons]     → stub pages
/blog                      → src/app/blog/page.tsx
/commands                  → src/app/commands/page.tsx
/internals                 → src/app/internals/page.tsx
/merge-conflicts           → src/app/merge-conflicts/page.tsx
/classroom                 → src/app/classroom/page.tsx
/linux-basics              → src/app/linux-basics/page.tsx
/not-found                 → src/app/not-found.tsx
/robots.txt                → src/app/robots.ts (MetadataRoute.Robots)
/sitemap.xml               → src/app/sitemap.ts
```

---

## File-by-File Change Plan

This section documents every file that must be created, modified, or deleted, grouped by category.

---

### Group 1: Files to Delete

| File                          | Reason                                                                    |
| ----------------------------- | ------------------------------------------------------------------------- |
| `src/app/client.tsx`          | Stale artifact, not imported anywhere                                     |
| `src/app/globals.html`        | Not a valid Next.js file                                                  |
| `src/next.config.ts`          | Misplaced; canonical config is at project root `next.config.ts`           |
| `src/tailwind.config.ts`      | Misplaced; Tailwind v4 uses `@theme inline` in CSS, no config file needed |
| `src/styles/globals.css`      | Duplicate; canonical is `src/app/globals.css`                             |
| `src/app/robots.txt/page.tsx` | Replaced by `src/app/robots.ts`                                           |
| `src/components/SEO.tsx`      | Replaced by Next.js `metadata` exports on each page                       |

---

### Group 2: Bug Fix — Import Corrections

#### `src/components/Terminal.tsx`

**Bug:** Imports `"xterm/css/xterm.css"` and `import("xterm")` — package was renamed.

**Fix:**

```typescript
// BEFORE
import "xterm/css/xterm.css";
// ...
import("xterm").then(({ Terminal }) => { ... })

// AFTER
import "@xterm/xterm/css/xterm.css";
// ...
import("@xterm/xterm").then(({ Terminal }) => { ... })
```

Also remove unused `useCallback` import (Requirement 19.3).

Store `FitAddon` in a ref so it is created once, not on every `entries` update (Requirement 10):

```typescript
const fitAddonRef = useRef<any>(null);

// In initialization useEffect:
import("@xterm/addon-fit").then(({ FitAddon }) => {
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  fitAddon.fit();
  fitAddonRef.current = fitAddon;
});

// In entries useEffect:
if (fitAddonRef.current) fitAddonRef.current.fit();
// Do NOT create a new FitAddon here
```

#### `src/types/globals.d.ts`

**Bug:** Declares `module 'xterm'` and `module 'xterm/css/xterm.css'`.

**Fix:** Replace both with `@xterm/xterm` and `@xterm/xterm/css/xterm.css`:

```typescript
declare module "@xterm/xterm/css/xterm.css" {
  const content: string;
  export default content;
}

declare module "@xterm/xterm" {
  // ... same interface declarations ...
}
```

Keep `@xterm/addon-fit` and `@xterm/addon-web-links` declarations (already correct).

#### `src/app/internals/page.tsx`

**Bug:** Imports non-existent `Trees` from `lucide-react`. Also imports unused `Layers`.

**Fix:**

```typescript
// BEFORE
import { Trees, Layers, ... } from "lucide-react";

// AFTER
import { Network, ... } from "lucide-react";
// Remove Layers if unused
```

---

### Group 3: Bug Fix — Root Layout Wiring

#### `src/app/layout.tsx`

**Current state:** Missing `globals.css` import, missing `Navbar`, missing `Providers` wrapper.

**Fix:**

```typescript
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "GitVision | Learn Git Visually",
    template: "%s | GitVision",
  },
  description: "The best Git visualization learning platform...",
  // ... rest of metadata unchanged
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

### Group 4: Bug Fix — Navbar

#### `src/components/Navbar.tsx`

**Bugs:**

1. Uses `window.location.pathname` instead of `usePathname()` — breaks SSR and causes hydration mismatch.
2. Uses `<a>` tags instead of `<Link>` — causes full-page reloads.
3. No mobile hamburger menu.

**Fix:**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/linux-basics", label: "Linux" },
  { href: "/merge-conflicts", label: "Conflicts" },
  { href: "/internals", label: "Internals" },
  { href: "/classroom", label: "Classroom" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-2xl h-14">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            GV
          </div>
          <span className="hidden sm:inline">GitVision</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-2xl px-4 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

---

### Group 5: Bug Fix — cn Utility

#### `src/lib/cn.ts`

**Bug:** Current implementation is a simple string join — does not resolve conflicting Tailwind classes.

**Fix:**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cn;
```

---

### Group 6: Bug Fix — IndexedDB SSR Guard

#### `src/lib/db.ts`

**Bug:** `openDB` calls `indexedDB.open` unconditionally — crashes in Node.js (SSR).

**Fix:**

```typescript
export async function openDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("IndexedDB is not available in server environment"),
    );
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // ... rest unchanged
  });
}
```

All other functions (`dbGet`, `dbSet`, `dbGetAll`, `dbDelete`, `dbClear`) already call `openDB()` first, so they will propagate the rejection automatically.

---

### Group 7: Bug Fix — processCommand Argument Parsing

#### `src/store/gitStore.ts` — `processCommand`

**Bug:** Uses `args.replace("add", "").trim()` patterns which corrupt arguments containing the subcommand name.

**Fix:** Use `parts` array (already computed) for all argument extraction:

```typescript
processCommand: async (input: string) => {
  const cmd = input.trim();
  if (!cmd) return { success: false, message: "" };

  const parts = cmd.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1).join(" ");

  // ...

  if (command === "git") {
    const gitArg = parts[1] || "";
    const gitArgs = parts.slice(2).join(" ");  // ← use this, not args.replace(...)

    if (gitArg === "init") return get().gitInit();
    if (gitArg === "status") return get().gitStatus();
    if (gitArg === "add") return get().gitAdd(gitArgs || ".");
    if (gitArg === "commit") {
      // Keep regex for quoted message parsing — this is correct
      const msgMatch =
        cmd.match(/commit\s+-m\s+"([^"]+)"/) ||
        cmd.match(/commit\s+-m\s+'([^']+)'/) ||
        cmd.match(/commit\s+-m\s+(\S+)/);
      return get().gitCommit(msgMatch?.[1] || "");
    }
    if (gitArg === "branch") return get().gitBranch(parts[2] || undefined);
    if (gitArg === "checkout") return get().gitCheckout(gitArgs);
    if (gitArg === "switch") return get().gitSwitch(gitArgs);
    if (gitArg === "log") return get().gitLog();
    if (gitArg === "reflog") return get().gitReflog();
    if (gitArg === "diff") return get().gitDiff(gitArgs || undefined);
    if (gitArg === "merge") return get().gitMerge(gitArgs);
    if (gitArg === "rebase") return get().gitRebase(gitArgs);
    if (gitArg === "reset") return get().gitReset(gitArgs);
    if (gitArg === "stash") return get().gitStash(gitArgs || undefined);
    if (gitArg === "tag") return get().gitTag(parts[2] || "", parts[3]);
    if (gitArg === "remote") return get().gitRemote(gitArgs);
    if (gitArg === "push") return get().gitPush();
    if (gitArg === "pull") return get().gitPull();
    if (gitArg === "fetch") return get().gitFetch();
    if (gitArg === "revert") return get().gitRevert(gitArgs);
    if (gitArg === "cherry-pick") return get().gitCherryPick(gitArgs);
    if (gitArg === "show") return get().gitShow(gitArgs);
    if (gitArg === "blame") return get().gitBlame(gitArgs);
    if (gitArg === "restore") return get().gitRestore(gitArgs);
    if (gitArg === "clean") return get().gitClean();
    if (gitArg === "bisect") return get().gitBisect(gitArgs);
    if (gitArg === "worktree") return get().gitWorktree(gitArgs);
    if (gitArg === "config") return get().gitConfig(gitArgs);
    if (gitArg === "clone") return get().gitClone(gitArgs);
    if (gitArg === "help") return { success: true, message: "Type 'help' to see available commands" };
  }

  return { success: false, message: `command not found: ${command}` };
},
```

---

### Group 8: Bug Fix — gitCommit Branch Tracking

#### `src/store/gitStore.ts` — `gitCommit`

**Bug:** Sets `head: hash` after commit — should be `head: currentBranch.name`.

**Fix:**

```typescript
gitCommit: (message, author, email) => {
  // ... existing validation ...
  const currentBranch = state.branches.find((b) => b.isHead);
  const branchName = currentBranch?.name || "master";  // ← capture name

  set({
    commits: [...state.commits, commit],
    branches: state.branches.map((b) =>
      b.isHead ? { ...b, commitHash: hash } : b
    ),
    head: branchName,  // ← branch name, NOT hash
    // ...
  });
},
```

Also fix `gitCheckout` to set `head: branch.name` (not `branch.commitHash`):

```typescript
gitCheckout: (target) => {
  const branch = state.branches.find((b) => b.name === target);
  if (branch) {
    set({
      branches: state.branches.map((b) => ({ ...b, isHead: b.name === target })),
      head: target,          // ← branch name
      detachedHead: false,
      // ...
    });
  }
},
```

---

### Group 9: Bug Fix — CommandInput Wiring

#### `src/components/CommandInput.tsx`

**Bugs:**

1. Does not call `addEntry` after `processCommand` resolves.
2. Does not support history navigation (up/down arrow keys).
3. Does not call `clearInput()` from TerminalStore.

**Fix:**

```typescript
"use client";

import { useRef, useState } from "react";
import { useGitStore, useTerminalStore } from "@/store/gitStore";

export default function CommandInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { input, setInput, clearInput, addEntry, history } = useTerminalStore();
  const { processCommand } = useGitStore();
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input;
    const result = await processCommand(cmd);
    addEntry({
      command: cmd,
      output: result.message,
      timestamp: Date.now(),
      type: result.success ? "output" : "error",
    });
    clearInput();
    setHistoryIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const commandHistory = history.map((h) => h.command).filter(Boolean);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[commandHistory.length - 1 - nextIndex] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === -1 ? "" : commandHistory[commandHistory.length - 1 - nextIndex] ?? "");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
      <span className="text-green-400 font-mono text-sm font-bold select-none">user@GitVision</span>
      <span className="text-gray-500 font-mono text-sm">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command..."
        className="flex-1 bg-transparent outline-none text-white font-mono text-sm"
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </form>
  );
}
```

---

### Group 10: Bug Fix — Terminal Wiring and FitAddon

#### `src/components/Terminal.tsx`

**Bugs:**

1. Imports from `"xterm"` instead of `"@xterm/xterm"`.
2. Creates a new `FitAddon` on every `entries` update (memory leak).
3. Imports unused `useCallback`.

**Fix (complete rewrite):**

```typescript
"use client";

import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  entries?: Array<{
    command: string;
    output: string;
    timestamp: number;
    type: "input" | "output" | "error";
  }>;
}

export default function Terminal({ entries = [] }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);  // ← single ref, created once

  // Initialization effect — runs once
  useEffect(() => {
    if (!terminalRef.current) return;

    import("@xterm/xterm").then(({ Terminal }) => {
      if (!terminalRef.current || xtermRef.current) return;

      const term = new Terminal({
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13,
        cursorBlink: true,
        theme: { background: "#0d1117", foreground: "#c9d1d9", cursor: "#c9d1d9", /* ... */ },
      });

      term.open(terminalRef.current);

      // Load FitAddon once, store in ref
      import("@xterm/addon-fit").then(({ FitAddon }) => {
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();
        fitAddonRef.current = fitAddon;
      });

      import("@xterm/addon-web-links").then(({ WebLinksAddon }) => {
        term.loadAddon(new WebLinksAddon());
      });

      xtermRef.current = term;

      // Print welcome banner
      term.writeln("  Welcome to GitVision. Type 'help' for commands.");

      // Restore existing history on mount
      entries.forEach((entry) => {
        if (entry.command) term.writeln(`\r\n$ ${entry.command}`);
        if (entry.output) {
          entry.output.split("\n").forEach((line) => {
            term.writeln(entry.type === "error" ? `\x1b[31m${line}\x1b[0m` : line);
          });
        }
      });
    });

    return () => {
      if (xtermRef.current) {
        try { xtermRef.current.dispose(); } catch {}
        xtermRef.current = null;
        fitAddonRef.current = null;
      }
    };
  }, []); // ← empty deps: runs once

  // Entries update effect — appends only the latest entry
  useEffect(() => {
    if (!xtermRef.current || entries.length === 0) return;
    const lastEntry = entries[entries.length - 1];
    if (lastEntry.command) xtermRef.current.writeln(`\r\n$ ${lastEntry.command}`);
    if (lastEntry.output) {
      lastEntry.output.split("\n").forEach((line: string) => {
        xtermRef.current.writeln(
          lastEntry.type === "error" ? `\x1b[31m${line}\x1b[0m` : line
        );
      });
    }
    // Use stored ref — no new FitAddon created
    if (fitAddonRef.current) fitAddonRef.current.fit();
  }, [entries]);

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center px-3 py-1.5 bg-[#161b22] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="text-[11px] text-gray-500 ml-2 font-mono">terminal</span>
        </div>
      </div>
      <div ref={terminalRef} className="flex-1 min-h-0" />
    </div>
  );
}
```

#### `src/app/playground/page.tsx`

Pass `useTerminalStore().history` as `entries` prop:

```typescript
const entries = useTerminalStore((s) => s.history);
// ...
<Terminal entries={entries} />
```

---

### Group 11: Bug Fix — SplitView viewMode

#### `src/components/SplitView.tsx`

**Bug:** `viewMode` is hardcoded as `false` constants; buttons have no `onClick`.

**Fix:**

```typescript
const [viewMode, setViewMode] = useState<"combined" | "terminal" | "graph">("combined");

// Conditional rendering:
const showFileExplorer = viewMode === "combined";
const showTerminal = viewMode === "combined" || viewMode === "terminal";
const showGraph = viewMode === "combined" || viewMode === "graph";

// Buttons:
{["combined", "terminal", "graph"].map((mode) => (
  <button
    key={mode}
    onClick={() => setViewMode(mode as typeof viewMode)}
    className={cn(
      "px-2 py-1 rounded text-[10px] font-mono transition-colors",
      viewMode === mode
        ? "bg-primary text-primary-foreground"
        : "bg-background/80 text-muted-foreground hover:text-foreground"
    )}
  >
    {mode === "combined" ? "⊞" : mode === "terminal" ? "⌨" : "📊"}
  </button>
))}
```

---

### Group 12: Bug Fix — parseGitLog

#### `src/lib/utils.ts`

**Bug:** `parseGitLog` applies regex to `lines[0]` (the commit hash line) for all fields — `Author` and `Date` are on subsequent lines.

**Fix:**

```typescript
export function parseGitLog(raw: string) {
  return raw
    .split(/\n(?=commit\s)/)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const hash = lines[0]?.match(/^commit\s+(\S+)/)?.[1] || "";
      const author =
        lines
          .find((l) => l.startsWith("Author:"))
          ?.replace("Author:", "")
          .trim() || "";
      const date =
        lines
          .find((l) => l.startsWith("Date:"))
          ?.replace("Date:", "")
          .trim() || "";
      const messageStart = lines.findIndex((l) => l.trim() === "") + 1;
      const message = lines.slice(messageStart).join("\n").trim();
      return { hash, author, date, message };
    });
}
```

---

### Group 13: Bug Fix — SearchBar AnimatePresence Import Order

#### `src/components/SearchBar.tsx`

**Bug:** `AnimatePresence` is imported at the bottom of the file after it is used — this is a hoisting issue that can cause linting errors and confuses bundlers.

**Fix:** Move the import to the top of the file:

```typescript
// TOP of file
import { AnimatePresence } from "framer-motion";
// Remove the duplicate import at the bottom
```

---

### Group 14: Bug Fix — learn/layout.tsx Cleanup

#### `src/app/learn/layout.tsx`

**Bugs:**

1. Has `"use client"` directive — prevents Server Component optimization.
2. Imports `motion` from `framer-motion` — unused in a layout.

**Fix:** Remove `"use client"` and the `motion` import. The layout becomes a Server Component. Any animated elements should be extracted to a child Client Component.

---

### Group 15: Bug Fix — sitemap.ts /404 Removal

#### `src/app/sitemap.ts`

**Bug:** Includes `https://gitvision.dev/404` as a sitemap entry.

**Fix:** Remove the `/404` entry from the returned array.

---

### Group 16: Bug Fix — merge-conflicts dangerouslySetInnerHTML

#### `src/app/merge-conflicts/page.tsx`

**Bug:** Uses `dangerouslySetInnerHTML` for static content containing `<code>` elements.

**Fix:** Replace with proper JSX:

```tsx
// BEFORE
<li dangerouslySetInnerHTML={{ __html: "Run <code>git merge branch-name</code>" }} />

// AFTER
<li>Run <code className="bg-gray-700 px-1 rounded font-mono text-sm">git merge branch-name</code></li>
```

---

### Group 17: Bug Fix — robots.ts

#### `src/app/robots.ts` (new file)

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: "https://gitvision.dev/sitemap.xml",
  };
}
```

---

### Group 18: Bug Fix — Radix UI Component Implementations

#### `src/components/ui/tabs.tsx`

Replace stub with `@radix-ui/react-tabs`:

```typescript
"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef<...>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1", className)}
    {...props}
  />
));
const TabsTrigger = React.forwardRef<...>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground", className)}
    {...props}
  />
));
const TabsContent = React.forwardRef<...>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("mt-2", className)} {...props} />
));
export { Tabs, TabsList, TabsTrigger, TabsContent };
```

#### `src/components/ui/dialog.tsx`

Replace stub with `@radix-ui/react-dialog`. Export `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`.

#### `src/components/ui/toast.tsx`

Replace stub with `@radix-ui/react-toast`. Export `ToastProvider`, `ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`.

---

### Group 19: Unused Import Cleanup

| File                             | Remove                              |
| -------------------------------- | ----------------------------------- |
| `src/app/page.tsx`               | `useAnimation` from `framer-motion` |
| `src/app/internals/page.tsx`     | `Layers` from `lucide-react`        |
| `src/components/Terminal.tsx`    | `useCallback` from `react`          |
| `src/components/FeatureCard.tsx` | unused import from `ui/card`        |

---

### Group 20: SEO — metadata Exports

Each page that previously used `<SEO />` component must export a `metadata` constant:

```typescript
// Example: src/app/playground/page.tsx
export const metadata: Metadata = {
  title: "Playground",
  description:
    "Interactive Git playground — practice commands with real-time visualization.",
};
```

Pages and their titles:

| Page               | metadata.title              |
| ------------------ | --------------------------- |
| `/playground`      | `"Playground"`              |
| `/docs`            | `"Git Documentation"`       |
| `/learn`           | `"Learn Git"`               |
| `/blog`            | `"Blog"`                    |
| `/commands`        | `"Git Commands Reference"`  |
| `/internals`       | `"Git Internals"`           |
| `/merge-conflicts` | `"Merge Conflict Resolver"` |
| `/classroom`       | `"Classroom"`               |
| `/linux-basics`    | `"Linux Basics"`            |
| `/docs/git-[cmd]`  | `"git [cmd]"`               |

---

## UI Component Designs

### Landing Page (`/`)

The landing page must be a Server Component at the file level. Interactive sections are extracted to Client Components.

**Sections (top to bottom):**

1. **Hero** — Two-column layout. Left: headline, subheadline, CTA buttons. Right: `<HeroTerminal />` (Client Component) that cycles through a sequence of Git commands with a typewriter animation, updating a mini commit graph below the terminal window.

2. **Feature Cards Grid** — 8 cards in a `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` grid. Each card: icon (lucide), title, description. Framer Motion `whileInView` fade-up animation.

3. **Why GitVision** — Two-column: left prose + benefit list, right playground preview mockup.

4. **Demo Preview** — Static mockup of the three-panel playground with a "Open Full Playground →" link.

5. **Blog Preview** — 3 most recent post cards in a `grid-cols-1 md:grid-cols-3` grid.

6. **Testimonials** — 3 testimonial cards.

7. **FAQ** — `<FAQAccordion />` (Client Component) using `@radix-ui/react-accordion`. Each item: question as `AccordionTrigger`, answer as `AccordionContent`.

8. **CTA** — Centered headline + two CTA buttons.

9. **Footer** — Nav links, social links, copyright.

**Client Components extracted from landing page:**

```
src/components/HeroTerminal.tsx   — "use client", typewriter animation
src/components/FAQAccordion.tsx   — "use client", @radix-ui/react-accordion
```

### Playground Page (`/playground`)

Full `"use client"` page. Layout:

```
┌─────────────────────────────────────────────────────────┐
│  Header: title, repo status badge, Initialize button     │
├─────────────────────────────────────────────────────────┤
│  View mode toolbar: [⊞ Combined] [⌨ Terminal] [📊 Graph] │
├──────────────┬──────────────────────┬───────────────────┤
│ FileExplorer │ Terminal (xterm.js)  │ GitGraph          │
│ (260px)      │                      │                   │
│              ├──────────────────────┤ StagingArea       │
│              │ CommandInput         │                   │
└──────────────┴──────────────────────┴───────────────────┘
│  ReplayTimeline                                          │
└─────────────────────────────────────────────────────────┘
```

When `!initialized`: show welcome screen with `git init` instructions.

### GitGraph Component (upgraded to @xyflow/react)

**Current state:** Custom SVG-based rendering with `Circle` icons.

**Target state:** Use `@xyflow/react` for proper DAG layout.

```typescript
"use client";
import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Convert commits to nodes
const nodes: Node[] = commits.map((commit, idx) => ({
  id: commit.hash,
  type: "commitNode",
  position: { x: 0, y: idx * 80 },  // vertical layout, newest at top
  data: {
    hash: commit.hash.substring(0, 7),
    message: commit.message,
    author: commit.author.split("<")[0].trim(),
    isHead: commit.hash === headCommitHash,
    branchLabels: branches.filter((b) => b.commitHash === commit.hash).map((b) => b.name),
  },
}));

// Convert parent relationships to edges
const edges: Edge[] = commits.flatMap((commit) =>
  commit.parentHashes.map((parentHash) => ({
    id: `${parentHash}-${commit.hash}`,
    source: parentHash,
    target: commit.hash,
    type: "smoothstep",
    style: { stroke: "#4b5563" },
  }))
);

// Custom node component
function CommitNode({ data }: { data: CommitNodeData }) {
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg border text-xs font-mono min-w-[160px]",
      data.isHead
        ? "border-blue-500 bg-blue-500/10"
        : "border-gray-600 bg-gray-800/50"
    )}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-400">{data.hash}</span>
        {data.isHead && <span className="bg-blue-500/20 text-blue-400 px-1 rounded text-[10px]">HEAD</span>}
        {data.branchLabels.map((label) => (
          <span key={label} className="bg-purple-500/20 text-purple-400 px-1 rounded text-[10px]">{label}</span>
        ))}
      </div>
      <div className="text-gray-200 truncate max-w-[140px]">{data.message}</div>
      <div className="text-gray-500 text-[10px] mt-0.5">{data.author}</div>
    </div>
  );
}
```

### FileExplorer Component (expand/collapse tree)

**Current state:** Only shows files in `cwd`, no recursive tree.

**Target state:** Full recursive tree with expand/collapse per folder.

```typescript
// Recursive tree rendering
function FileNode({ file, depth, openFolders, onToggle }: FileNodeProps) {
  const isOpen = openFolders.has(file.path);
  const children = allFiles.filter((f) => {
    const parent = f.path.split("/").slice(0, -1).join("/") || "/";
    return parent === file.path;
  });

  return (
    <>
      <div
        className="flex items-center gap-1 px-2 py-1 hover:bg-gray-700/50 cursor-pointer"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={() => file.type === "folder" && onToggle(file.path)}
      >
        {file.type === "folder" && (
          <ChevronRight className={cn("w-3 h-3 transition-transform", isOpen && "rotate-90")} />
        )}
        {file.type === "folder"
          ? <Folder className="w-4 h-4 text-yellow-500" />
          : <FileText className="w-4 h-4 text-gray-400" />
        }
        <span className="text-sm flex-1">{file.name}</span>
        <span className={cn("text-xs", getStatusColor(file.status))}>
          {file.status !== "committed" ? file.status[0].toUpperCase() : ""}
        </span>
      </div>
      {file.type === "folder" && isOpen && children.map((child) => (
        <FileNode key={child.id} file={child} depth={depth + 1} ... />
      ))}
    </>
  );
}
```

### Blog Page (`/blog`)

Server Component renders static post data. `<BlogFilter />` is a Client Component that receives the full posts array and manages `activeTag` state:

```typescript
// src/app/blog/page.tsx  — Server Component
import BlogFilter from "@/components/BlogFilter";

export default function BlogPage() {
  return (
    <>
      <FeaturedPost post={POSTS[0]} />
      <BlogFilter posts={POSTS} />
    </>
  );
}

// src/components/BlogFilter.tsx  — Client Component
"use client";
export default function BlogFilter({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const filtered = activeTag ? posts.filter((p) => p.tag === activeTag) : posts;
  // render tag buttons + post grid
}
```

### Linux Basics Page (`/linux-basics`)

Server Component renders static command data. `<LinuxSearch />` is a Client Component:

```typescript
// src/components/LinuxSearch.tsx  — Client Component
"use client";
export default function LinuxSearch({
  commands,
}: {
  commands: LinuxCommand[];
}) {
  const [query, setQuery] = useState("");
  const filtered = commands.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()),
  );
  // render search input + command cards
}
```

### Docs Index Page (`/docs`)

Server Component. Search input is a Client Component `<DocsSearch />` that filters the command cards grid client-side.

### Commands Page (`/commands`)

Server Component shell. `<CommandsFilter />` is a Client Component managing both `query` (string) and `category` (string | null) state. Both filters are applied simultaneously with `&&`.

---

## Data Models

### GitFile

```typescript
interface GitFile {
  id: string; // short random hash
  name: string; // filename or folder name
  path: string; // absolute path from root, e.g. "/src/app.js"
  content: string; // file content (empty for folders)
  type: "file" | "folder";
  status: "untracked" | "staged" | "modified" | "committed" | "deleted";
  createdAt: number; // Unix timestamp ms
  updatedAt: number;
}
```

### GitCommit

```typescript
interface GitCommit {
  hash: string; // 40-char hex string
  message: string;
  author: string; // "Name <email>"
  email: string;
  date: number; // Unix timestamp ms
  parentHashes: string[]; // empty for root commit, two entries for merge commits
  treeHash: string; // 7-char hex
  filesSnapshot: Record<string, string>; // path → content/id at commit time
}
```

### GitBranch

```typescript
interface GitBranch {
  name: string; // e.g. "master", "feature/auth"
  commitHash: string; // hash of the tip commit
  isHead: boolean; // true for the currently checked-out branch
}
```

### CommandHistoryEntry

```typescript
interface CommandHistoryEntry {
  command: string; // the raw command string typed by the user
  output: string; // the result message from processCommand
  timestamp: number; // Unix timestamp ms
  type: "input" | "output" | "error";
}
```

### BlogPost (static data)

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // human-readable, e.g. "May 2026"
  tag: "Beginner" | "Intermediate" | "Advanced";
  readTime: string; // e.g. "8 min"
  featured?: boolean;
}
```

### LinuxCommand (static data)

```typescript
interface LinuxCommand {
  name: string; // e.g. "ls"
  syntax: string; // e.g. "ls [options] [path]"
  description: string;
  examples: Array<{ command: string; description: string }>;
  category: string; // e.g. "Navigation", "File Operations"
}
```

---

## Error Handling

### processCommand Error Handling

All git operations return `{ success: boolean, message: string }`. The `processCommand` dispatcher:

- Returns `{ success: false, message: "command not found: <cmd>" }` for unrecognized commands.
- Propagates the `success: false` result from individual git operations.
- CommandInput maps `success: false` → `type: "error"` in the terminal entry.

### IndexedDB Error Handling

`openDB` rejects with a descriptive error in SSR environments. All `db*` functions propagate the rejection. Callers should wrap in try/catch and degrade gracefully (e.g., skip persistence, show a toast).

### xterm.js Initialization Errors

The Terminal component wraps addon loading in try/catch. If `@xterm/addon-fit` or `@xterm/addon-web-links` fail to load, the terminal still renders — just without fit/link features.

### Next.js Metadata

Each page exports a static `metadata` object. Pages that need dynamic metadata (e.g., individual command pages) use `generateMetadata`. The root layout provides the title template fallback.

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

This feature involves a mix of pure logic (the `cn` utility, `processCommand` argument parsing, `gitCommit` state transitions, `parseGitLog` parsing) and UI wiring. Property-based testing is applicable to the pure logic layer. UI rendering and infrastructure checks use example-based tests.

The property-based testing library for this project is **fast-check** (TypeScript-native, works with Jest/Vitest).

---

### Property 1: cn resolves conflicting Tailwind classes

_For any_ two conflicting Tailwind utility classes from the same property group (e.g., `p-2` and `p-4`, `text-sm` and `text-lg`, `bg-red-500` and `bg-blue-500`), calling `cn(first, second)` SHALL return a string containing only the second class and not the first.

**Validates: Requirements 12.1, 12.2**

---

### Property 2: cn accepts all clsx input types without throwing

_For any_ combination of strings, arrays of strings, objects mapping strings to booleans, `null`, `undefined`, and `false` values, calling `cn(...inputs)` SHALL return a string without throwing an exception.

**Validates: Requirements 12.3**

---

### Property 3: processCommand extracts git subcommand arguments correctly

_For any_ non-empty string `message` that does not contain double-quote characters, calling `processCommand('git commit -m "' + message + '"')` on an initialized repository with staged files SHALL call `gitCommit` with exactly `message` as the first argument — not a string that has been corrupted by substring replacement.

**Validates: Requirements 13.1, 13.2, 13.3**

---

### Property 4: head is always a branch name after commit

_For any_ sequence of `gitInit`, `gitAdd`, and `gitCommit` operations, after each `gitCommit` call the `head` field in GitStore SHALL equal the `name` of the branch where `isHead === true`, never a commit hash.

**Validates: Requirements 14.1, 14.2, 14.3**

---

### Property 5: head is always a branch name after checkout

_For any_ branch name that exists in the branches array, calling `gitCheckout(branchName)` SHALL set `head` to `branchName` and `detachedHead` to `false`.

**Validates: Requirements 14.4**

---

### Property 6: parseGitLog round-trip preserves commit fields

_For any_ `GitCommit` object with a non-empty `hash`, `author`, and `message`, formatting it as `gitLog` output and then parsing it with `parseGitLog` SHALL produce an object where `hash`, `author`, and `message` match the original values.

**Validates: Requirements 21.1, 21.2**

---

### Property 7: CommandInput rejects whitespace-only input

_For any_ string composed entirely of whitespace characters (spaces, tabs, newlines), submitting it via CommandInput SHALL NOT call `processCommand` and SHALL NOT add an entry to TerminalStore history.

**Validates: Requirements 8.4**

---

### Property 8: CommandInput addEntry type matches processCommand success

_For any_ non-empty command string, after CommandInput submits it and `processCommand` resolves, the entry added to TerminalStore SHALL have `type: "output"` if `result.success === true` and `type: "error"` if `result.success === false`.

**Validates: Requirements 8.2**

---

### Property 9: Terminal entry formatting invariant

_For any_ `CommandHistoryEntry` with `type: "error"`, the string written to the xterm terminal SHALL contain the ANSI red escape sequence `\x1b[31m`. _For any_ entry with `type: "output"`, the written string SHALL NOT contain `\x1b[31m`.

**Validates: Requirements 9.3, 9.4, 9.5**

---

### Property 10: openDB rejects in non-browser environments

_For any_ call to `openDB()` in an environment where `typeof window === "undefined"`, the returned Promise SHALL reject with an Error whose message contains the word "server" or "IndexedDB".

**Validates: Requirements 11.1, 11.2**

---

### Property 11: SplitView panel visibility matches viewMode

_For any_ `viewMode` value in `{"combined", "terminal", "graph"}`, the SplitView component SHALL render:

- `viewMode === "combined"`: FileExplorer, Terminal, and GitGraph/StagingArea all visible.
- `viewMode === "terminal"`: only Terminal visible at full width; FileExplorer and GitGraph hidden.
- `viewMode === "graph"`: only GitGraph and StagingArea visible; FileExplorer and Terminal hidden.

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**

---

### Property 12: Navbar active item is exactly the current pathname

_For any_ pathname that matches one of the navigation items' `href` values, rendering the Navbar with that pathname SHALL result in exactly one navigation item having the active class (`bg-primary/10 text-primary`), and all other items SHALL NOT have that class.

**Validates: Requirements 6.3**

---

## Testing Strategy

### Dual Testing Approach

Both unit/example tests and property-based tests are used. They are complementary:

- **Unit tests** verify specific examples, integration points, and edge cases.
- **Property tests** verify universal invariants across a wide input space.

### Property-Based Testing Setup

**Library:** `fast-check` (already compatible with Vitest/Jest)

**Configuration:** Each property test runs a minimum of **100 iterations**.

**Tag format:** Each property test is tagged with a comment:

```typescript
// Feature: gitvision-platform-complete, Property N: <property_text>
```

**Example property test:**

```typescript
import fc from "fast-check";
import { cn } from "@/lib/cn";

// Feature: gitvision-platform-complete, Property 1: cn resolves conflicting Tailwind classes
test("cn resolves conflicting padding classes", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 96 }),
      fc.integer({ min: 0, max: 96 }),
      (a, b) => {
        const result = cn(`p-${a}`, `p-${b}`);
        // The last class wins; the first should not appear if different
        if (a !== b) {
          expect(result).toContain(`p-${b}`);
          expect(result).not.toContain(`p-${a}`);
        }
      },
    ),
    { numRuns: 100 },
  );
});
```

### Unit Test Coverage

**Priority unit tests (example-based):**

1. `cn` — specific conflicting class pairs: `p-2 p-4`, `text-sm text-lg`, `bg-red-500 bg-blue-500`
2. `processCommand("git add .")` — stages all files
3. `processCommand("git commit -m \"initial commit\"")` — creates commit with correct message
4. `gitCommit` — `head` equals branch name after commit
5. `gitCheckout("feature")` — `head` equals `"feature"` after checkout
6. `parseGitLog("")` — returns empty array
7. `parseGitLog` — parses a known log string correctly
8. `openDB` in Node.js environment — rejects with error
9. Navbar renders with active class on matching pathname
10. SplitView renders correct panels for each viewMode
11. CommandInput does not call processCommand on empty submit
12. Terminal writes `\x1b[31m` for error entries

### Integration Tests

1. Full command pipeline: type `git init` → `git add .` → `git commit -m "test"` → verify terminal history has 3 entries
2. Playground page renders three-panel layout when initialized
3. Blog tag filter shows only matching posts
4. Linux search filters commands by name

### Smoke Tests (build-level)

1. `tsc --noEmit` passes with zero errors
2. `next build` completes without errors
3. Deleted files do not exist in the repository
4. `src/app/globals.css` is the only `globals.css` in the project
5. `src/app/robots.ts` exists and exports a default function
6. No page file imports from `src/components/SEO.tsx`

---

## Implementation Notes

### Tailwind CSS v4 Compatibility

This project uses Tailwind CSS v4 with `@theme inline` in `globals.css`. There is **no `tailwind.config.js` or `tailwind.config.ts`**. The misplaced `src/tailwind.config.ts` must be deleted. All theme tokens are defined via CSS custom properties in `globals.css`.

When using `cn()` with Tailwind v4, `tailwind-merge` v3.x is required (already installed as `tailwind-merge@3.6`). The `cn` fix in `src/lib/cn.ts` is compatible.

### Next.js App Router Conventions

- Server Components are the default. Only add `"use client"` when the component uses browser APIs (`window`, `document`, `localStorage`), React hooks that require client context (`useState`, `useEffect`, `useRef`), or event handlers.
- `metadata` exports only work in Server Components and layout/page files — not in Client Components.
- The `"use client"` directive must be the first line of the file (before imports).
- `usePathname()` from `next/navigation` requires `"use client"`.

### @xyflow/react v12 API

The package was renamed from `reactflow` to `@xyflow/react`. The import is:

```typescript
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
```

Custom node types are registered via the `nodeTypes` prop:

```typescript
const nodeTypes = { commitNode: CommitNode };
<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView />
```

### Zustand v5 Compatibility

Zustand v5 changes the `devtools` middleware signature. The store is already using the correct v5 pattern (`create<State>()(devtools(persist(...)))`). No changes needed to the store structure.

### IndexedDB and SSR

The `db.ts` SSR guard must be added before any other IndexedDB call. The guard pattern `if (typeof window === "undefined")` is the correct approach for Next.js — do not use `typeof indexedDB !== "undefined"` as that can be polyfilled in some environments.

### Framer Motion and Server Components

Framer Motion components (`motion.div`, `AnimatePresence`) require `"use client"`. When a Server Component needs animation, extract the animated part to a Client Component. The `learn/layout.tsx` fix removes `motion` because layouts should be Server Components — any animated content in the learn section should be in the page files or extracted Client Components.

## Components and Interfaces

This section documents the public interface (props and exports) of every component that is created or modified.

### `Navbar` (`src/components/Navbar.tsx`)

```typescript
// No props — reads pathname from usePathname(), manages mobileOpen state internally
export default function Navbar(): JSX.Element;
```

### `Terminal` (`src/components/Terminal.tsx`)

```typescript
interface TerminalProps {
  entries?: CommandHistoryEntry[]; // history from useTerminalStore
}
export default function Terminal(props: TerminalProps): JSX.Element;
```

### `CommandInput` (`src/components/CommandInput.tsx`)

```typescript
// No props — reads/writes useTerminalStore and useGitStore directly
export default function CommandInput(): JSX.Element;
```

### `GitGraph` (`src/components/GitGraph.tsx`)

```typescript
// No props — reads commits, branches, head from useGitStore directly
export default function GitGraph(): JSX.Element;
```

### `SplitView` (`src/components/SplitView.tsx`)

```typescript
// No props — manages viewMode state internally, composes FileExplorer/Terminal/GitGraph/StagingArea
export default function SplitView(): JSX.Element;
```

### `FileExplorer` (`src/components/FileExplorer.tsx`)

```typescript
// No props — reads files, cwd from useGitStore directly
export default function FileExplorer(): JSX.Element;
```

### `StagingArea` (`src/components/StagingArea.tsx`)

```typescript
// No props — reads files from useGitStore directly
export default function StagingArea(): JSX.Element;
```

### `HeroTerminal` (`src/components/HeroTerminal.tsx`) — new

```typescript
// No props — self-contained animated demo terminal
// "use client" — uses useState, useEffect for typewriter animation
export default function HeroTerminal(): JSX.Element;
```

### `FAQAccordion` (`src/components/FAQAccordion.tsx`) — new

```typescript
interface FAQItem {
  question: string;
  answer: string;
}
interface FAQAccordionProps {
  items: FAQItem[];
}
// "use client" — uses @radix-ui/react-accordion
export default function FAQAccordion(props: FAQAccordionProps): JSX.Element;
```

### `BlogFilter` (`src/components/BlogFilter.tsx`) — new

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  featured?: boolean;
}
interface BlogFilterProps {
  posts: BlogPost[];
}
// "use client" — manages activeTag state
export default function BlogFilter(props: BlogFilterProps): JSX.Element;
```

### `LinuxSearch` (`src/components/LinuxSearch.tsx`) — new

```typescript
interface LinuxCommand {
  name: string;
  syntax: string;
  description: string;
  examples: Array<{ command: string; description: string }>;
  category: string;
}
interface LinuxSearchProps {
  commands: LinuxCommand[];
}
// "use client" — manages query state
export default function LinuxSearch(props: LinuxSearchProps): JSX.Element;
```

### `CommandsFilter` (`src/components/CommandsFilter.tsx`) — new

```typescript
interface GitCommandCard {
  name: string;
  description: string;
  category: "Basics" | "Branching" | "Remote" | "Advanced" | "Inspection";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  href: string;
}
interface CommandsFilterProps {
  commands: GitCommandCard[];
}
// "use client" — manages query and category state
export default function CommandsFilter(props: CommandsFilterProps): JSX.Element;
```

### `SearchBar` (`src/components/SearchBar.tsx`)

```typescript
// No props — self-contained search overlay
// Fix: move AnimatePresence import to top of file
export default function SearchBar(): JSX.Element;
```

### UI Primitives (`src/components/ui/`)

```typescript
// tabs.tsx — re-exports from @radix-ui/react-tabs with className merging
export { Tabs, TabsList, TabsTrigger, TabsContent };

// dialog.tsx — re-exports from @radix-ui/react-dialog with className merging
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};

// toast.tsx — re-exports from @radix-ui/react-toast with className merging
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
};
```

### Store Exports (`src/store/gitStore.ts`)

```typescript
// Stores
export const useGitStore: StoreApi<GitState & GitActions>;
export const useTerminalStore: StoreApi<TerminalState>;

// Types
export type {
  GitFile,
  GitCommit,
  GitBranch,
  GitState,
  CommandHistoryEntry,
  PlaygroundState,
  ReplayState,
};
```

### Utility Exports (`src/lib/cn.ts`)

```typescript
export function cn(...inputs: ClassValue[]): string;
export default cn;
```

### Utility Exports (`src/lib/db.ts`)

```typescript
export async function openDB(): Promise<IDBDatabase>;
export async function dbGet<T>(
  store: string,
  key: string,
): Promise<T | undefined>;
export async function dbSet<T extends { id: string }>(
  store: string,
  value: T,
): Promise<void>;
export async function dbGetAll<T>(store: string): Promise<T[]>;
export async function dbDelete(store: string, key: string): Promise<void>;
export async function dbClear(store: string): Promise<void>;
```

### Utility Exports (`src/lib/utils.ts`)

```typescript
export function parseGitLog(
  raw: string,
): Array<{ hash: string; author: string; date: string; message: string }>;
export function parseGitDiff(
  raw: string,
): Array<{ type: "header" | "context" | "added" | "removed"; content: string }>;
export function resolvePath(cwd: string, input: string): string;
export function basename(path: string): string;
export function dirname(path: string): string;
export function uid(): string;
export function formatBytes(bytes: number): string;
export function escapeHtml(str: string): string;
export function deepClone<T>(obj: T): T;
export function generateFileTree(files: GitFile[], basePath?: string): string;
```

### Route Handlers

```typescript
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots;

// src/app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap;
```
