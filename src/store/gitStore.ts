"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { hashBlob, hashCommit, shortHash, generateId } from "@/lib/crypto";

/* ── TypeScript Interfaces ───────────────────────────────────────── */

export interface GitFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: "file" | "folder";
  status: "untracked" | "staged" | "modified" | "committed" | "deleted";
  createdAt: number;
  updatedAt: number;
}

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  email: string;
  date: number;
  parentHashes: string[];
  treeHash: string;
  filesSnapshot: Record<string, string>;
}

export interface GitBranch {
  name: string;
  commitHash: string;
  isHead: boolean;
}

export interface GitState {
  cwd: string;
  initialized: boolean;
  files: GitFile[];
  commits: GitCommit[];
  branches: GitBranch[];
  head: string;
  detachedHead: boolean;
  staging: string[];
  tags: Record<string, string>;
  remotes: Record<string, string>;
  remoteBranches: Record<string, string>;
  stash: GitCommit[];
  history: string[];
  _undoStack: Array<{ state: GitState }>;
  _redoStack: Array<{ state: GitState }>;
}

export interface CommandHistoryEntry {
  command: string;
  output: string;
  timestamp: number;
  type: "input" | "output" | "error";
}

export interface PlaygroundState {
  git: GitState;
  terminal: {
    history: CommandHistoryEntry[];
    input: string;
  };
  ui: {
    splitView: "combined" | "terminal" | "graph";
    showStaging: boolean;
    showRemotes: boolean;
    sidebarOpen: boolean;
  };
  replays: ReplayState[];
}

export interface ReplayState {
  id: string;
  name: string;
  commands: CommandHistoryEntry[];
  snapshots: GitState[];
  currentStep: number;
  createdAt: number;
}

interface TerminalState {
  history: CommandHistoryEntry[];
  input: string;
  commandHistory: string[];
  historyIndex: number;
  addEntry: (entry: CommandHistoryEntry) => void;
  clearHistory: () => void;
  setInput: (input: string) => void;
  clearInput: () => void;
  addToCommandHistory: (cmd: string) => void;
  navigateHistory: (direction: "up" | "down") => string | null;
}

export const useTerminalStore = create<TerminalState>()(
  devtools(
    persist(
      (set, get) => ({
        history: [],
        input: "",
        commandHistory: [],
        historyIndex: -1,
        addEntry: (entry) =>
          set((state) => ({ history: [...state.history, entry] })),
        clearHistory: () => set({ history: [] }),
        setInput: (input) => set({ input }),
        clearInput: () => set({ input: "" }),
        addToCommandHistory: (cmd) =>
          set((state) => ({
            commandHistory: [
              ...state.commandHistory.filter((c) => c !== cmd),
              cmd,
            ],
            historyIndex: -1,
          })),
        navigateHistory: (direction) => {
          const { commandHistory } = get();
          if (commandHistory.length === 0) return null;
          const idx = get().historyIndex;
          let newIdx: number;
          if (direction === "up") {
            newIdx = idx === -1 ? commandHistory.length - 1 : Math.max(0, idx - 1);
          } else {
            newIdx = idx === -1 ? -1 : idx + 1;
            if (newIdx >= commandHistory.length) {
              set({ historyIndex: -1 });
              return null;
            }
          }
          set({ historyIndex: newIdx });
          return commandHistory[newIdx] || null;
        },
      }),
      { name: "gitvision-terminal" },
    ),
  ),
);

/* ── Line-by-line diff utilities ─────────────────────────────── */

function computeLines(a: string, b: string): string {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  let result = "";
  const maxLen = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] ?? "";
    const lineB = linesB[i] ?? "";
    if (lineA === lineB) {
      result += ` ${lineA}\n`;
    } else {
      if (i < linesA.length) result += `-${lineA}\n`;
      if (i < linesB.length) result += `+${lineB}\n`;
    }
  }
  return result;
}

function computeMergeConflict(
  currentContent: string,
  incomingContent: string,
): string {
  const linesA = currentContent.split("\n");
  const linesB = incomingContent.split("\n");
  const result: string[] = [];
  const maxLen = Math.max(linesA.length, linesB.length);
  let inConflict = false;
  let oursBuf: string[] = [];
  let theirsBuf: string[] = [];

  const flush = () => {
    if (!inConflict) return;
    result.push("<<<<<<< HEAD", ...oursBuf, "=======", ...theirsBuf, ">>>>>>> incoming");
    oursBuf = [];
    theirsBuf = [];
    inConflict = false;
  };

  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] ?? "";
    const lineB = linesB[i] ?? "";
    if (lineA !== lineB) {
      inConflict = true;
      if (i < linesA.length) oursBuf.push(lineA);
      if (i < linesB.length) theirsBuf.push(lineB);
    } else {
      flush();
      result.push(lineA);
    }
  }
  flush();
  return result.join("\n");
}

/* ── Snapshot for a worktree at a given commit ──────────────── */

function snapshotFiles(
  files: GitFile[],
  staging: string[],
): Record<string, string> {
  const snap: Record<string, string> = {};
  files.forEach((f) => {
    snap[f.path] = f.content || f.id;
  });
  return snap;
}

/* ── Git Simulation Store ───────────────────────────────────────── */

interface GitActions {
  init: () => { success: boolean; message: string };
  resetState: () => void;

  // Filesystem operations
  mkdir: (name: string) => { success: boolean; message: string };
  cd: (path: string) => { success: boolean; message: string };
  ls: (path?: string) => { success: boolean; message: string; files: string[] };
  pwd: () => string;
  touch: (name: string) => { success: boolean; message: string };
  echo: (name: string, content: string) => { success: boolean; message: string };
  cat: (name: string) => { success: boolean; message: string; content?: string };
  rm: (name: string) => { success: boolean; message: string };
  mv: (from: string, to: string) => { success: boolean; message: string };
  cp: (from: string, to: string) => { success: boolean; message: string };
  clear: () => void;

  // Git operations
  gitInit: () => { success: boolean; message: string };
  gitStatus: () => { success: boolean; message: string };
  gitAdd: (path: string) => { success: boolean; message: string };
  gitCommit: (message: string, author?: string, email?: string) => Promise<{ success: boolean; message: string }>;
  gitBranch: (name?: string, startPoint?: string) => { success: boolean; message: string };
  gitCheckout: (target: string) => { success: boolean; message: string };
  gitSwitch: (target: string) => { success: boolean; message: string };
  gitLog: () => { success: boolean; message: string };
  gitReflog: () => { success: boolean; message: string };
  gitDiff: (args?: string) => { success: boolean; message: string };
  gitMerge: (branch: string) => { success: boolean; message: string };
  gitRebase: (branch: string) => Promise<{ success: boolean; message: string }>;
  gitReset: (args: string) => { success: boolean; message: string };
  gitStash: (args?: string) => { success: boolean; message: string };
  gitTag: (name: string, commit?: string) => { success: boolean; message: string };
  gitRemote: (args: string) => { success: boolean; message: string };
  gitPush: () => { success: boolean; message: string };
  gitPull: () => { success: boolean; message: string };
  gitFetch: () => { success: boolean; message: string };
  gitRevert: (commit: string) => { success: boolean; message: string };
  gitCherryPick: (commit: string) => { success: boolean; message: string };
  gitShow: (commit: string) => { success: boolean; message: string };
  gitBlame: (file: string) => { success: boolean; message: string };
  gitRestore: (path: string) => { success: boolean; message: string };
  gitClean: () => { success: boolean; message: string };
  gitBisect: (args: string) => { success: boolean; message: string };
  gitWorktree: (args: string) => { success: boolean; message: string };
  gitConfig: (args: string) => { success: boolean; message: string };
  gitClone: (url: string) => { success: boolean; message: string };
  gitMergeBase: (branchA: string, branchB: string) => string | null;

  // Command processor / Undo
  processCommand: (input: string) => Promise<{ success: boolean; message: string }>;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveSnapshot: () => void;

  // Replay
  saveReplay: (name: string) => void;
  loadReplay: (id: string) => void;

  // Graph data for DAG rendering
  getGraphData: () => GraphNode[];
}

export interface GraphNode {
  hash: string;
  message: string;
  author: string;
  date: number;
  parentHashes: string[];
  branchLabels: string[];
  isHead: boolean;
  isMergeCommit: boolean;
  depth: number;
  column: number;
}

interface SnapshotEntry {
  state: GitState;
}

export const useGitStore = create<GitState & GitActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cwd: "/",
        initialized: false,
        files: [],
        commits: [],
        branches: [],
        head: "",
        detachedHead: false,
        staging: [],
        tags: {},
        remotes: {},
        remoteBranches: {},
        stash: [],
        history: [],
        _undoStack: [],
        _redoStack: [],

        saveSnapshot: () => {
          const s = get();
          const entry: SnapshotEntry = {
            state: {
              cwd: s.cwd,
              initialized: s.initialized,
              files: JSON.parse(JSON.stringify(s.files)),
              commits: JSON.parse(JSON.stringify(s.commits)),
              branches: JSON.parse(JSON.stringify(s.branches)),
              head: s.head,
              detachedHead: s.detachedHead,
              staging: [...s.staging],
              tags: { ...s.tags },
              remotes: { ...s.remotes },
              remoteBranches: { ...s.remoteBranches },
              stash: JSON.parse(JSON.stringify(s.stash)),
              history: [...s.history],
              _undoStack: [],
              _redoStack: [],
            },
          };
          const newUndo = [...s._undoStack, entry];
          set({ _undoStack: newUndo, _redoStack: [] });
        },

        undo: () => {
          const s = get();
          const stack = s._undoStack;
          if (stack.length < 2) return;
          const current = stack[stack.length - 1];
          const prev = stack[stack.length - 2];
          if (!prev) return;
          const redoStack = [...s._redoStack, current];
          set({
            ...prev.state,
            _undoStack: stack.slice(0, -1),
            _redoStack: redoStack,
          });
        },

        redo: () => {
          const s = get();
          const stack = s._redoStack;
          if (stack.length === 0) return;
          const next = stack[stack.length - 1];
          const undoStack = [...s._undoStack, next];
          set({
            ...next.state,
            _undoStack: undoStack,
            _redoStack: stack.slice(0, -1),
          });
        },

        canUndo: () => {
          return get()._undoStack.length > 1;
        },

        canRedo: () => {
          return get()._redoStack.length > 0;
        },

        resetState: () => {
          set({
            cwd: "/",
            initialized: false,
            files: [],
            commits: [],
            branches: [],
            head: "",
            detachedHead: false,
            staging: [],
            tags: {},
            remotes: {},
            remoteBranches: {},
            stash: [],
            history: [],
            _undoStack: [],
            _redoStack: [],
          });
        },


        getGraphData: () => {
          const state = get();
          const nodes: GraphNode[] = [];
          const sorted = [...state.commits].sort((a, b) => a.date - b.date);

          const branchHeads = new Set(state.branches.map((b) => b.commitHash));
          const headHash = state.branches.find((b) => b.isHead)?.commitHash || "";
          const branchMap = new Map<string, string[]>();
          state.branches.forEach((b) => {
            const existing = branchMap.get(b.commitHash) || [];
            existing.push(b.name);
            branchMap.set(b.commitHash, existing);
          });

          const visited = new Set<string>();
          const depths = new Map<string, number>();
          const columns = new Map<string, number>();

          function dfs(hash: string, depth: number, col: number) {
            if (visited.has(hash)) return;
            visited.add(hash);
            const commit = state.commits.find((c) => c.hash === hash);
            if (!commit) return;
            depths.set(hash, depth);
            columns.set(hash, col);
            let childCol = col;
            commit.parentHashes.forEach((ph) => {
              if (!visited.has(ph)) {
                dfs(ph, depth + 1, childCol);
                childCol++;
              }
            });
          }

          sorted.forEach((c) => {
            if (!visited.has(c.hash)) {
              dfs(c.hash, 0, columns.size);
            }
          });

          sorted.forEach((commit) => {
            const labels = branchMap.get(commit.hash) || [];
            if (commit.hash === headHash) labels.push("HEAD");
            nodes.push({
              hash: commit.hash,
              message: commit.message,
              author: commit.author.split("<")[0].trim(),
              date: commit.date,
              parentHashes: commit.parentHashes,
              branchLabels: labels,
              isHead: commit.hash === headHash,
              isMergeCommit: commit.parentHashes.length > 1,
              depth: depths.get(commit.hash) || 0,
              column: columns.get(commit.hash) || 0,
            });
          });

          return nodes;
        },

        // Utilities
        init: () => {
          const state = get();
          if (state.initialized)
            return { success: false, message: "Reinitialized existing repository" };
          set({
            initialized: true,
            files: [],
            branches: [{ name: "master", commitHash: "", isHead: true }],
            head: "master",
            detachedHead: false,
            history: [],
            _undoStack: [],
            _redoStack: [],
          });
          return { success: true, message: "Initialized empty Git repository" };
        },

        // Filesystem operations
        mkdir: (name: string) => {
          const state = get();
          if (!state.initialized)
            return { success: false, message: "Not a git repository. Run 'git init' first." };
          if (!name) return { success: false, message: "mkdir: missing operand" };
          const fullPath = state.cwd === "/" ? `/${name}` : `${state.cwd}/${name}`;
          if (state.files.some((f) => f.path === fullPath))
            return { success: false, message: `mkdir: cannot create directory '${name}': File exists` };
          const newFolder: GitFile = {
            id: generateId(), name, path: fullPath, content: "", type: "folder",
            status: "untracked", createdAt: Date.now(), updatedAt: Date.now(),
          };
          set({ files: [...state.files, newFolder], history: [...state.history, `mkdir ${name}`] });
          return { success: true, message: "" };
        },

        cd: (path: string) => {
          const state = get();
          if (!path) return { success: false, message: "" };
          if (path === "~" || path === "/") { set({ cwd: "/" }); return { success: true, message: "" }; }
          if (path === "-") return { success: true, message: "" };
          let newPath: string;
          if (path.startsWith("/")) newPath = path;
          else if (path === "..") {
            const parts = state.cwd.split("/").filter(Boolean);
            parts.pop();
            newPath = parts.length ? "/" + parts.join("/") : "/";
          } else newPath = state.cwd === "/" ? `/${path}` : `${state.cwd}/${path}`;
          set({ cwd: newPath });
          return { success: true, message: "" };
        },

        ls: (path?: string) => {
          const state = get();
          const targetPath = path || state.cwd;
          const files = state.files.filter((f) => {
            const parentPath = f.path.split("/").slice(0, -1).join("/") || "/";
            return parentPath === targetPath || (targetPath === "/" && !f.path.slice(1).includes("/"));
          });
          const names = files.map((f) => f.type === "folder" ? `${f.name}/` : f.name);
          return { success: true, message: names.join("\n"), files: names };
        },

        pwd: () => get().cwd,

        touch: (name: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "Not a git repository. Run 'git init' first." };
          if (!name) return { success: false, message: "touch: missing file operand" };
          name = name.startsWith("/") ? name : state.cwd === "/" ? `/${name}` : `${state.cwd}/${name}`;
          const existing = state.files.find((f) => f.path === name);
          if (existing) {
            set({ files: state.files.map((f) => f.path === name ? { ...f, updatedAt: Date.now() } : f) });
            return { success: true, message: "" };
          }
          const newFile: GitFile = {
            id: generateId(), name: name.split("/").pop() || name, path: name, content: "", type: "file",
            status: "untracked", createdAt: Date.now(), updatedAt: Date.now(),
          };
          set({ files: [...state.files, newFile] });
          return { success: true, message: "" };
        },

        echo: (name: string, content: string) => {
          const state = get();
          if (!name) return { success: false, message: "echo: missing operand" };
          const filePath = name.startsWith("/") ? name : state.cwd === "/" ? `/${name}` : `${state.cwd}/${name}`;
          const existing = state.files.find((f) => f.path === filePath);
          if (existing && existing.type === "file") {
            // Editing a file git has never tracked keeps it untracked; only
            // previously-committed content becomes "modified".
            const nextStatus: GitFile["status"] = existing.status === "untracked" ? "untracked" : "modified";
            set({ files: state.files.map((f) => f.path === filePath ? { ...f, content, updatedAt: Date.now(), status: nextStatus } : f) });
          } else {
            const newFile: GitFile = {
              id: generateId(), name: filePath.split("/").pop() || filePath, path: filePath, content, type: "file",
              status: "untracked", createdAt: Date.now(), updatedAt: Date.now(),
            };
            set({ files: [...state.files, newFile] });
          }
          return { success: true, message: "" };
        },

        cat: (name: string) => {
          const state = get();
          const filePath = name.startsWith("/") ? name : state.cwd === "/" ? `/${name}` : `${state.cwd}/${name}`;
          const file = state.files.find((f) => f.path === filePath);
          if (!file || file.type === "folder") return { success: false, message: `cat: ${name}: No such file or directory`, content: "" };
          return { success: true, message: file.content, content: file.content };
        },

        rm: (name: string) => {
          const state = get();
          const filePath = name.startsWith("/") ? name : state.cwd === "/" ? `/${name}` : `${state.cwd}/${name}`;
          const file = state.files.find((f) => f.path === filePath);
          if (!file) return { success: false, message: `rm: cannot remove '${name}': No such file or directory` };
          if (file.type === "folder" && !name.endsWith("/")) {
            const hasChildren = state.files.some((f) => f.path.startsWith(filePath + "/"));
            if (hasChildren) return { success: false, message: `rm: cannot remove '${name}': Directory not empty` };
          }
          if (file.status === "committed") {
            // Git still tracks this path until the deletion is staged and committed.
            set({ files: state.files.map((f) => f.path === filePath ? { ...f, status: "deleted" as const, updatedAt: Date.now() } : f) });
          } else {
            set({ files: state.files.filter((f) => f.path !== filePath && !f.path.startsWith(filePath + "/")) });
          }
          return { success: true, message: "" };
        },

        mv: (from: string, to: string) => {
          const state = get();
          const fromPath = from.startsWith("/") ? from : state.cwd === "/" ? `/${from}` : `${state.cwd}/${from}`;
          const file = state.files.find((f) => f.path === fromPath);
          if (!file) return { success: false, message: `mv: cannot stat '${from}': No such file or directory` };
          const toPath = to.startsWith("/") ? to : state.cwd === "/" ? `/${to}` : `${state.cwd}/${to}`;
          set({ files: state.files.map((f) => f.path === fromPath ? { ...f, name: toPath.split("/").pop() || to, path: toPath, updatedAt: Date.now() } : f) });
          return { success: true, message: "" };
        },

        cp: (from: string, to: string) => {
          const state = get();
          const fromPath = from.startsWith("/") ? from : state.cwd === "/" ? `/${from}` : `${state.cwd}/${from}`;
          const file = state.files.find((f) => f.path === fromPath);
          if (!file) return { success: false, message: `cp: cannot stat '${from}': No such file or directory` };
          const toPath = to.startsWith("/") ? to : state.cwd === "/" ? `/${to}` : `${state.cwd}/${to}`;
          set({ files: [...state.files, { ...file, id: generateId(), name: toPath.split("/").pop() || to, path: toPath, createdAt: Date.now(), updatedAt: Date.now() }] });
          return { success: true, message: "" };
        },

        clear: () => {},

        // ── Git operations ──

        gitInit: () => {
          const state = get();
          if (state.initialized)
            return { success: false, message: "Reinitialized existing Git repository" };
          set({
            initialized: true,
            branches: [{ name: "master", commitHash: "", isHead: true }],
            head: "master",
            detachedHead: false,
            staging: [],
            history: [...state.history, "git init"],
          });
          return { success: true, message: "Initialized empty Git repository in .git/" };
        },

        gitStatus: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          const staged = state.files.filter((f) => f.status === "staged");
          const modified = state.files.filter((f) => f.status === "modified");
          const untracked = state.files.filter((f) => f.status === "untracked");
          const deleted = state.files.filter((f) => f.status === "deleted");
          const stagedDeleted = deleted.filter((f) => state.staging.includes(f.id));
          const unstagedDeleted = deleted.filter((f) => !state.staging.includes(f.id));
          let msg = state.detachedHead ? `HEAD detached at ${shortHash(state.head)}\n` : `On branch ${state.head}\n`;
          if (staged.length === 0 && modified.length === 0 && untracked.length === 0 && deleted.length === 0) {
            msg += "\nnothing to commit, working tree clean";
            return { success: true, message: msg };
          }
          if (staged.length > 0 || stagedDeleted.length > 0) {
            msg += "\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n\n";
            staged.forEach((f) => { msg += `\tmodified:   ${f.path}\n`; });
            stagedDeleted.forEach((f) => { msg += `\tdeleted:    ${f.path}\n`; });
            msg += "\n";
          }
          if (modified.length > 0 || unstagedDeleted.length > 0) {
            msg += "Changes not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n\n";
            modified.forEach((f) => { msg += `\tmodified:   ${f.path}\n`; });
            unstagedDeleted.forEach((f) => { msg += `\tdeleted:    ${f.path}\n`; });
            msg += "\n";
          }
          if (untracked.length > 0) {
            msg += "Untracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\n";
            untracked.forEach((f) => { msg += `\t${f.path}\n`; });
            msg += "\n";
          }
          return { success: true, message: msg };
        },

        gitAdd: (path: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          let filesToStage: GitFile[] = [];
          if (path === "." || path === "./" || path === "-A" || path === "--all") {
            filesToStage = state.files.filter((f) => f.status === "untracked" || f.status === "modified" || f.status === "deleted");
          } else {
            const filePath = path.startsWith("/") ? path : state.cwd === "/" ? `/${path}` : `${state.cwd}/${path}`;
            const exactMatch = state.files.find((f) => f.path === filePath);
            const dirMatch = state.files.filter((f) => f.path.startsWith(filePath + "/"));
            if (exactMatch) filesToStage = [exactMatch];
            else if (dirMatch.length > 0) filesToStage = dirMatch;
            else return { success: false, message: `fatal: pathspec '${path}' did not match any files` };
          }
          if (filesToStage.length === 0) return { success: true, message: "No changes added to commit" };
          const newStagingIds = filesToStage.map((f) => f.id);
          set({
            // A staged deletion stays "deleted" (git status reads staging membership
            // to know it's staged); only untracked/modified files flip to "staged".
            files: state.files.map((f) =>
              newStagingIds.includes(f.id)
                ? { ...f, status: f.status === "deleted" ? "deleted" as const : "staged" as const }
                : f
            ),
            staging: [...new Set([...state.staging, ...newStagingIds])],
            history: [...state.history, `git add ${path}`],
          });
          return { success: true, message: "" };
        },

        gitCommit: async (message: string, author?: string, email?: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!message) return { success: false, message: "Aborting commit due to empty commit message." };
          const stagedFiles = state.files.filter((f) => f.status === "staged");
          const stagedDeletions = state.files.filter((f) => f.status === "deleted" && state.staging.includes(f.id));
          if (stagedFiles.length === 0 && stagedDeletions.length === 0 && state.commits.length > 0)
            return { success: false, message: `On branch ${state.head}\nnothing to commit, working tree clean` };

          // Build tree hash from staged file contents
          const treeContent = stagedFiles.map((f) => `100644 blob ${f.content || ""}\t${f.path}`).join("\n");
          const treeHash = await hashBlob(treeContent);

          // Build commit content for content-addressable hash. Staged deletions
          // are excluded — that's what makes them absent from the new tree.
          const snapshot: Record<string, string> = {};
          state.files.forEach((f) => {
            const isStagedDeletion = f.status === "deleted" && state.staging.includes(f.id);
            if (!isStagedDeletion) snapshot[f.path] = f.content || f.id;
          });

          const currentBranch = state.branches.find((b) => b.isHead);
          const parentHashes: string[] = [];
          if (currentBranch?.commitHash) {
            parentHashes.push(currentBranch.commitHash);
          }

          const authorStr = `${author || "User"} <${email || "user@example.com"}>`;
          const hash = await hashCommit(treeHash, parentHashes, message, authorStr, Date.now());

          const commit: GitCommit = {
            hash, message, author: authorStr, email: email || "user@example.com",
            date: Date.now(), parentHashes, treeHash, filesSnapshot: snapshot,
          };

          const branchName = currentBranch?.name ?? "master";
          set({
            commits: [...state.commits, commit],
            branches: state.branches.map((b) => b.isHead ? { ...b, commitHash: hash } : b),
            head: branchName,
            files: state.files
              .filter((f) => !(f.status === "deleted" && state.staging.includes(f.id)))
              .map((f) => f.status === "staged" ? { ...f, status: "committed" as const } : f),
            staging: [],
            history: [...state.history, `git commit -m "${message}"`],
          });

          return {
            success: true,
            message: `[${branchName} ${shortHash(hash)}] ${message}\n ${stagedFiles.length + stagedDeletions.length} file(s) changed`,
          };
        },

        gitBranch: (name?: string, startPoint?: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!name) {
            let msg = "";
            state.branches.forEach((b) => { msg += (b.isHead ? "* " : "  ") + b.name + "\n"; });
            return { success: true, message: msg };
          }
          if (state.branches.some((b) => b.name === name))
            return { success: false, message: `fatal: a branch named '${name}' already exists` };
          const sourceCommit = startPoint || state.branches.find((b) => b.isHead)?.commitHash || "";
          set({ branches: [...state.branches, { name, commitHash: sourceCommit, isHead: false }] });
          return { success: true, message: `Created branch '${name}'` };
        },

        gitCheckout: (target: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (target === "-") return { success: true, message: "" };
          if (target.startsWith("-b")) {
            const newName = target.split(/\s+/)[1];
            if (!newName) return { success: false, message: "fatal: branch name required after -b" };
            const branchResult = get().gitBranch(newName);
            if (!branchResult.success) return branchResult;
            // `-b` creates AND switches to the new branch.
            return get().gitCheckout(newName);
          }
          const branch = state.branches.find((b) => b.name === target);
          if (branch) {
            set({
              branches: state.branches.map((b) => ({ ...b, isHead: b.name === target })),
              head: target, detachedHead: false,
              history: [...state.history, `git checkout ${target}`],
            });
            return { success: true, message: `Switched to branch '${target}'` };
          }
          return { success: false, message: `fatal: cannot switch to '${target}'` };
        },

        gitSwitch: (target: string) => get().gitCheckout(target),

        gitLog: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (state.commits.length === 0) return { success: true, message: "" };
          let msg = "";
          const ordered = [...state.commits].reverse();
          ordered.forEach((c) => {
            const date = new Date(c.date).toLocaleString();
            const refs = state.branches.filter((b) => b.commitHash === c.hash).map((b) => b.name);
            const tagRefs = Object.entries(state.tags).filter(([, h]) => h === c.hash || h.startsWith(c.hash)).map(([n]) => n);
            const allRefs = [...refs, ...tagRefs];
            const refStr = allRefs.length > 0 ? ` (${allRefs.join(", ")})` : "";
            msg += `commit ${c.hash}${refStr}\nAuthor: ${c.author}\nDate:   ${date}\n\n    ${c.message}\n\n`;
          });
          return { success: true, message: msg };
        },

        gitReflog: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          let msg = "";
          [...state.history].reverse().slice(0, 30).forEach((h, i) => {
            const fakeHash = generateId().substring(0, 7);
            msg += `${fakeHash} HEAD@{${i}}: ${h}\n`;
          });
          return { success: true, message: msg };
        },

        gitDiff: (args?: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          // Plain `git diff` shows the unstaged working tree; `--staged`/`--cached`
          // shows what's queued for the next commit. These are different sets.
          const showStaged = args === "--staged" || args === "--cached";
          const relevant = showStaged
            ? state.files.filter((f) => f.status === "staged" || (f.status === "deleted" && state.staging.includes(f.id)))
            : state.files.filter((f) => f.status === "modified" || (f.status === "deleted" && !state.staging.includes(f.id)));
          const lastCommit = state.commits[state.commits.length - 1];
          let msg = "";
          relevant.forEach((f) => {
            const oldContent = lastCommit?.filesSnapshot?.[f.path] || "";
            msg += `diff --git a/${f.path} b/${f.path}\n`;
            msg += `index ${shortHash(generateId())}..${shortHash(generateId())} 100644\n`;
            if (f.status === "deleted") {
              msg += `deleted file mode 100644\n--- a/${f.path}\n+++ /dev/null\n`;
              oldContent.split("\n").forEach((line) => { if (line) msg += `-${line}\n`; });
            } else if (!oldContent) {
              msg += `new file mode 100644\n--- /dev/null\n+++ b/${f.path}\n`;
              (f.content || "").split("\n").forEach((line) => { if (line) msg += `+${line}\n`; });
            } else {
              msg += `--- a/${f.path}\n+++ b/${f.path}\n`;
              msg += computeLines(oldContent, f.content || "");
            }
          });
          return { success: true, message: msg };
        },

        gitMergeBase: (branchA: string, branchB: string) => {
          const state = get();
          const a = state.branches.find((b) => b.name === branchA);
          const b = state.branches.find((b) => b.name === branchB);
          if (!a || !b) return null;
          const ancestorsA = new Set<string>();
          const queueA = [a.commitHash];
          while (queueA.length > 0) {
            const h = queueA.pop()!;
            if (ancestorsA.has(h)) continue;
            ancestorsA.add(h);
            const commit = state.commits.find((c) => c.hash === h);
            if (commit) queueA.push(...commit.parentHashes);
          }
          const queueB = [b.commitHash];
          while (queueB.length > 0) {
            const h = queueB.pop()!;
            if (ancestorsA.has(h)) return h;
            const commit = state.commits.find((c) => c.hash === h);
            if (commit) queueB.push(...commit.parentHashes);
          }
          return null;
        },

        gitMerge: (branch: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!branch) return { success: false, message: "fatal: No remote specified for merge." };
          const targetBranch = state.branches.find((b) => b.name === branch);
          if (!targetBranch) return { success: false, message: `fatal: ${branch} - no such branch` };
          const currentBranch = state.branches.find((b) => b.isHead);
          if (!currentBranch) return { success: false, message: "fatal: no current branch" };
          if (currentBranch.name === branch) return { success: true, message: "Already up to date." };

          // Check for fast-forward
          const base = get().gitMergeBase(currentBranch.name, branch);
          if (base && base === currentBranch.commitHash && base !== targetBranch.commitHash) {
            // Current branch is ancestor of target — fast-forward
            set({
              branches: state.branches.map((b) =>
                b.isHead ? { ...b, commitHash: targetBranch.commitHash } : b
              ),
              // `head` tracks the branch NAME (see gitStatus's "On branch X"), not a hash.
              head: currentBranch.name,
              history: [...state.history, `git merge ${branch}`],
            });
            return { success: true, message: `Updating ${shortHash(currentBranch.commitHash || "")}..${shortHash(targetBranch.commitHash)}\nFast-forward\nNo conflicts detected.` };
          }

          // Standard 3-way merge — simulate merge with conflict detection
          const stagedFiles = state.files.filter((f) => f.status === "staged");
          let hasConflict = false;
          let conflictMsg = "";

          // Check if both branches modified the same files
          const currentBranchCommit = state.commits.find((c) => c.hash === currentBranch.commitHash);
          const targetBranchCommit = state.commits.find((c) => c.hash === targetBranch.commitHash);

          if (currentBranchCommit && targetBranchCommit) {
            const currentFiles = currentBranchCommit.filesSnapshot || {};
            const targetFiles = targetBranchCommit.filesSnapshot || {};
            const baseCommit = state.commits.find((c) => c.hash === base);
            const baseFiles = baseCommit?.filesSnapshot || {};

            // Find files modified in both branches
            const allPaths = new Set([...Object.keys(currentFiles), ...Object.keys(targetFiles)]);
            for (const filePath of allPaths) {
              const currentContent = currentFiles[filePath] || "";
              const targetContent = targetFiles[filePath] || "";
              const baseContent = baseFiles[filePath] || "";

              // Both modified from base = conflict
              if (currentContent !== baseContent && targetContent !== baseContent && currentContent !== targetContent) {
                hasConflict = true;
                const conflictContent = computeMergeConflict(currentContent, targetContent);
                conflictMsg += `CONFLICT in ${filePath}\n`;
                // Update the file content to have conflict markers
                set({
                  files: state.files.map((f) =>
                    f.path === filePath ? { ...f, content: conflictContent, status: "modified" as const } : f
                  ),
                });
              }
            }
          }

          if (hasConflict) {
            return {
              success: false,
              message: `Auto-merging\n${conflictMsg}Automatic merge failed; fix conflicts and then commit the result.`,
            };
          }

          // No conflicts — create merge commit
          const hash = generateId();
          const mergeCommit: GitCommit = {
            hash, message: `Merge branch '${branch}' into ${currentBranch.name}`,
            author: "User <user@example.com>", email: "user@example.com",
            date: Date.now(),
            parentHashes: [currentBranch.commitHash || "", targetBranch.commitHash].filter(Boolean),
            treeHash: generateId(), filesSnapshot: {},
          };
          set({
            commits: [...state.commits, mergeCommit],
            branches: state.branches.map((b) => b.isHead ? { ...b, commitHash: hash } : b),
            head: currentBranch.name,
            history: [...state.history, `git merge ${branch}`],
          });
          return { success: true, message: `Merge made by the 'ort' strategy.\n${shortHash(hash)} ${mergeCommit.message}` };
        },

        gitRebase: async (branch: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!branch) return { success: false, message: "fatal: No branch specified for rebase." };
          const targetBranch = state.branches.find((b) => b.name === branch);
          if (!targetBranch) return { success: false, message: `fatal: ${branch} - no such branch` };
          const currentBranch = state.branches.find((b) => b.isHead);
          if (!currentBranch) return { success: false, message: "fatal: no current branch" };
          if (currentBranch.name === branch) return { success: true, message: "Already up to date." };

          const base = get().gitMergeBase(currentBranch.name, branch);
          // Collect commits to replay (from current branch, after merge-base)
          const commitsToReplay: GitCommit[] = [];
          const visited = new Set<string>();
          const queue = [currentBranch.commitHash];
          while (queue.length > 0) {
            const h = queue.pop()!;
            if (visited.has(h) || h === base || !h) continue;
            visited.add(h);
            const commit = state.commits.find((c) => c.hash === h);
            if (commit) {
              commitsToReplay.push(commit);
              queue.push(...commit.parentHashes);
            }
          }
          commitsToReplay.reverse();

          // Replay commits on top of target branch
          let replayBase = targetBranch.commitHash;
          let successCount = 0;
          for (const oldCommit of commitsToReplay) {
            const treeHash = generateId();
            const hash = await hashCommit(treeHash, [replayBase], oldCommit.message, oldCommit.author, Date.now());
            const newCommit: GitCommit = {
              hash, message: oldCommit.message, author: oldCommit.author,
              email: oldCommit.email, date: Date.now(),
              parentHashes: [replayBase], treeHash, filesSnapshot: oldCommit.filesSnapshot,
            };
            set((s) => ({ commits: [...s.commits, newCommit] }));
            replayBase = hash;
            successCount++;
          }

          // Update current branch to point to replayed head
          set((s) => ({
            branches: s.branches.map((b) => b.isHead ? { ...b, commitHash: replayBase } : b),
            head: currentBranch.name,
            history: [...s.history, `git rebase ${branch}`],
          }));

          return {
            success: true,
            message: `Successfully rebased and updated refs/heads/${currentBranch.name}.\nReplayed ${successCount} commit(s) onto ${branch}.`,
          };
        },

        gitReset: (args: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          const soft = args.includes("--soft");
          const hard = args.includes("--hard");
          const mixed = args.includes("--mixed") || (!soft && !hard);
          if (soft) return { success: true, message: "Unstaged changes after reset (soft mode)" };
          if (hard) {
            set({
              files: state.files.map((f) => ({ ...f, status: "committed" as const })),
              staging: [],
            });
            return { success: true, message: `HEAD is now at ${shortHash(generateId())} (hard reset)` };
          }
          if (mixed) {
            set({ staging: [] });
            return { success: true, message: "Unstaged changes after reset (mixed mode)" };
          }
          return { success: true, message: `HEAD is now at ${shortHash(generateId())}` };
        },

        gitStash: (args?: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (args === "pop") {
            if (state.stash.length === 0) return { success: false, message: "No stash entries found." };
            set({ stash: state.stash.slice(0, -1) });
            return { success: true, message: "Restored from stash.\nDropped refs/stash@{0}" };
          }
          if (args === "list") {
            if (state.stash.length === 0) return { success: true, message: "No stash entries found." };
            let msg = "";
            state.stash.forEach((s, i) => { msg += `stash@{${i}}: ${s.message}\n`; });
            return { success: true, message: msg };
          }
          if (args === "show") {
            if (state.stash.length === 0) return { success: false, message: "No stash entries found." };
            const top = state.stash[state.stash.length - 1];
            return { success: true, message: `commit ${top.hash}\nAuthor: ${top.author}\n\n    ${top.message}` };
          }
          const modifiedFiles = state.files.filter((f) => f.status === "modified" || f.status === "staged");
          const stashCommit: GitCommit = {
            hash: generateId(), message: `WIP on ${state.head}: ${modifiedFiles.length} file(s)`,
            author: "User <user@example.com>", email: "user@example.com", date: Date.now(),
            parentHashes: [], treeHash: generateId(), filesSnapshot: {},
          };
          set({
            stash: [...state.stash, stashCommit],
            files: state.files.map((f) => f.status === "staged" ? { ...f, status: "committed" as const } : f),
            staging: [],
            history: [...state.history, "git stash"],
          });
          return { success: true, message: "Saved working directory and index state WIP" };
        },

        gitTag: (name: string, commit?: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!name) return { success: false, message: "fatal: 'git tag' requires a tag name." };
          set({ tags: { ...state.tags, [name]: commit || state.head || "HEAD" } });
          return { success: true, message: `Created tag '${name}'` };
        },

        gitRemote: (args: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          const parts = args.split(" ");
          if (parts[0] === "add") {
            const url = parts[2] || "";
            const remoteName = parts[1] || "origin";
            set({ remotes: { ...state.remotes, [remoteName]: url } });
            return { success: true, message: `Added remote '${remoteName}' (${url})` };
          }
          if (parts[0] === "remove" || parts[0] === "rm") {
            const newRemotes = { ...state.remotes };
            delete newRemotes[parts[1]];
            set({ remotes: newRemotes });
            return { success: true, message: `Removed remote '${parts[1]}'` };
          }
          if (parts[0] === "-v") {
            let msg = "";
            Object.entries(state.remotes).forEach(([name, url]) => {
              msg += `${name}\t${url} (fetch)\n${name}\t${url} (push)\n`;
            });
            return { success: true, message: msg };
          }
          let msg = "";
          Object.entries(state.remotes).forEach(([name, url]) => { msg += `${name}\t${url}\n`; });
          return { success: true, message: msg };
        },

        gitPush: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (Object.keys(state.remotes).length === 0)
            return { success: false, message: "fatal: No configured push destination." };
          const currentBranch = state.branches.find((b) => b.isHead);
          const commitCount = state.commits.length;
          // Simulate pushing by syncing remoteBranches with local branches
          const newRemoteBranches: Record<string, string> = {};
          state.branches.forEach((b) => {
            newRemoteBranches[`origin/${b.name}`] = b.commitHash;
          });
          set({ remoteBranches: newRemoteBranches });
          return {
            success: true,
            message: `Enumerating objects: ${commitCount * 3 + state.files.length}, done.\nCounting objects: 100% (${commitCount + 1}/${commitCount + 1}), done.\nWriting objects: 100% (${commitCount + 1}/${commitCount + 1}), done.\nTotal ${commitCount + 1} (delta 0), reused 0 (delta 0)\nTo ${Object.values(state.remotes)[0] || "github.com:user/repo"}\n   ${shortHash(generateId())}..${shortHash(generateId())}  ${currentBranch?.name || "master"} -> ${currentBranch?.name || "master"}`,
          };
        },

        gitPull: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (Object.keys(state.remotes).length === 0)
            return { success: false, message: "fatal: No configured remote." };
          // Simulate pulling by fetching + merging. Re-read state after fetch —
          // it just wrote remoteBranches, and the pre-fetch `state` is stale.
          get().gitFetch();
          const remoteBranches = get().remoteBranches || {};
          const remoteBranchName = `origin/${state.head}`;
          const remoteHash = remoteBranches[remoteBranchName];
          if (!remoteHash) return { success: true, message: "Already up to date." };
          // Try to fast-forward
          const currentBranch = state.branches.find((b) => b.isHead);
          if (currentBranch) {
            set({
              branches: state.branches.map((b) =>
                b.isHead ? { ...b, commitHash: remoteHash } : b
              ),
            });
          }
          return { success: true, message: `Updating ${shortHash(generateId())}..${shortHash(remoteHash)}\nFast-forward\n1 file changed, 1 insertion(+)` };
        },

        gitFetch: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          // Simulate fetch — update remote tracking branches
          const remoteBranches: Record<string, string> = {};
          state.branches.forEach((b) => {
            remoteBranches[`origin/${b.name}`] = b.commitHash;
          });
          set({ remoteBranches });
          return {
            success: true,
            message: `Fetching origin\nFrom ${Object.values(state.remotes)[0] || "github.com:user/repo"}\n * [new branch]      ${state.head} -> origin/${state.head}`,
          };
        },

        gitRevert: (commit: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!commit) return { success: false, message: "fatal: No commit specified for revert." };
          return { success: true, message: `Finished one revert.\n[${state.head || "master"} ${shortHash(generateId())}] Revert "${commit}"` };
        },

        gitCherryPick: (commit: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!commit) return { success: false, message: "fatal: No commit specified for cherry-pick." };
          // Find the commit and replay it
          const sourceCommit = state.commits.find((c) => c.hash.startsWith(commit));
          if (!sourceCommit) return { success: false, message: `fatal: bad object '${commit}'` };
          const currentBranch = state.branches.find((b) => b.isHead);
          const newHash = generateId();
          const newCommit: GitCommit = {
            hash: newHash, message: sourceCommit.message, author: sourceCommit.author,
            email: sourceCommit.email, date: Date.now(),
            parentHashes: [currentBranch?.commitHash || ""].filter(Boolean),
            treeHash: generateId(), filesSnapshot: sourceCommit.filesSnapshot,
          };
          set((s) => ({
            commits: [...s.commits, newCommit],
            branches: s.branches.map((b) => b.isHead ? { ...b, commitHash: newHash } : b),
          }));
          return { success: true, message: `[${state.head || "master"} ${shortHash(newHash)}] ${sourceCommit.message}` };
        },

        gitShow: (commit: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          const foundCommit = state.commits.find((c) => c.hash.startsWith(commit)) || state.commits[state.commits.length - 1];
          if (!foundCommit) return { success: false, message: `fatal: bad object '${commit}'` };
          const date = new Date(foundCommit.date).toLocaleString();
          let msg = `commit ${foundCommit.hash}\nAuthor: ${foundCommit.author}\nDate:   ${date}\n\n    ${foundCommit.message}\n`;
          Object.entries(foundCommit.filesSnapshot).forEach(([path, content]) => {
            msg += `\ndiff --git a/${path} b/${path}\nnew file mode 100644\n--- /dev/null\n+++ b/${path}\n`;
            (content || "").split("\n").forEach((line) => { if (line) msg += `+${line}\n`; });
          });
          return { success: true, message: msg };
        },

        gitBlame: (file: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!file) return { success: false, message: "fatal: No file specified for blame." };
          const filePath = file.startsWith("/") ? file : state.cwd === "/" ? `/${file}` : `${state.cwd}/${file}`;
          const found = state.files.find((f) => f.path === filePath);
          if (!found) return { success: false, message: `fatal: no such file: ${file}` };
          const lines = (found.content || "").split("\n").filter(Boolean);
          let msg = "";
          let lineIdx = 0;
          for (const commit of [...state.commits].reverse()) {
            const snapshot = commit.filesSnapshot[filePath];
            if (snapshot !== undefined) {
              const snapshotLines = snapshot.split("\n").filter(Boolean);
              for (const line of snapshotLines) {
                if (lineIdx < lines.length && lines[lineIdx] === line) {
                  msg += `${shortHash(commit.hash)} (${commit.author.split("<")[0].trim()} ${new Date(commit.date).toLocaleDateString()} ${lineIdx + 1}) ${line}\n`;
                  lineIdx++;
                }
              }
            }
          }
          // Remaining lines attributed to HEAD
          while (lineIdx < lines.length) {
            msg += `${shortHash(generateId())} (${state.head || "master"} ${new Date().toLocaleDateString()} ${lineIdx + 1}) ${lines[lineIdx]}\n`;
            lineIdx++;
          }
          return { success: true, message: msg };
        },

        gitRestore: (path: string) => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          if (!path) return { success: false, message: "fatal: No path specified for restore." };
          const staged = path === "--staged";
          const filePath = staged ? path : path;
          if (staged) {
            set({ staging: [] });
            return { success: true, message: "Unstaged all changes." };
          }
          return { success: true, message: `Restored file: ${path}` };
        },

        gitClean: () => {
          const state = get();
          if (!state.initialized) return { success: false, message: "fatal: not a git repository" };
          const untracked = state.files.filter((f) => f.status === "untracked");
          if (untracked.length === 0) return { success: true, message: "No files to clean" };
          set({ files: state.files.filter((f) => f.status !== "untracked") });
          return { success: true, message: "Removing untracked files" };
        },

        gitBisect: (args: string) => {
          if (args === "start") return { success: true, message: "status: waiting for both good and bad commits" };
          if (args === "reset") return { success: true, message: "Bisecting back to the first bad commit" };
          if (args.includes("good")) return { success: true, message: "status: waiting for bad commit" };
          if (args.includes("bad")) return { success: true, message: "Bisecting: 5 revisions left to test after this" };
          return { success: true, message: "usage: git bisect start" };
        },

        gitWorktree: (args: string) => {
          if (args.startsWith("add")) return { success: true, message: `Preparing worktree (new branch '${args.split(" ")[2] || "worktree"}')` };
          if (args.startsWith("list")) return { success: true, message: "worktree main" };
          if (args.startsWith("remove")) return { success: true, message: "Removed worktree" };
          return { success: true, message: "usage: git worktree add|list|remove" };
        },

        gitConfig: (args: string) => {
          const parts = args.split(" ");
          if (parts.includes("--global")) return { success: true, message: "" };
          if (parts.includes("--list")) return { success: true, message: "user.name=User\nuser.email=user@example.com" };
          return { success: true, message: "" };
        },

        gitClone: (url: string) => {
          if (!url) return { success: false, message: "fatal: you must specify a repository to clone" };
          get().gitInit();
          return { success: true, message: `Cloning into '${url.split("/").pop() || "repo"}'...\nremote: Enumerating objects: 100%` };
        },

        processCommand: async (input: string) => {
          const cmd = input.trim();
          if (!cmd) return { success: false, message: "" };

          // Save snapshot before command for undo
          get().saveSnapshot();

          // Add to command history
          useTerminalStore.getState().addToCommandHistory(cmd);
          useTerminalStore.getState().addEntry({
            command: cmd, output: "", timestamp: Date.now(), type: "input",
          });

          const parts = cmd.split(/\s+/);
          const command = parts[0];
          const args = parts.slice(1).join(" ");
          let result = { success: false, message: "" };

          // Undo/Redo
          if (command === "undo") { get().undo(); return { success: true, message: "Undid last command" }; }
          if (command === "redo") { get().redo(); return { success: true, message: "Redid last command" }; }

          // Filesystem commands
          if (command === "mkdir") result = get().mkdir(args);
          else if (command === "cd") result = get().cd(args);
          else if (command === "ls") result = get().ls(args || undefined);
          else if (command === "pwd") result = { success: true, message: get().pwd() };
          else if (command === "touch") result = get().touch(args);
          else if (command === "echo") {
            const match = cmd.match(/^echo\s+(.+?)\s*>\s*(.+)$/);
            if (match) result = get().echo(match[2], match[1].replace(/^["']|["']$/g, ""));
            else result = { success: true, message: args };
          }
          else if (command === "cat") result = get().cat(args);
          else if (command === "rm") result = get().rm(args);
          else if (command === "mv") {
            const [from, to] = args.split(/\s+/);
            result = get().mv(from || "", to || "");
          }
          else if (command === "cp") {
            const [from, to] = args.split(/\s+/);
            result = get().cp(from || "", to || "");
          }
          else if (command === "clear") {
            get().clear();
            useTerminalStore.getState().clearHistory();
            return { success: true, message: "" };
          }

          // Git commands
          else if (command === "git") {
            const gitArg = parts[1] || "";
            const gitArgs = parts.slice(2).join(" ");
            if (gitArg === "init") result = get().gitInit();
            else if (gitArg === "status") result = get().gitStatus();
            else if (gitArg === "add") result = get().gitAdd(gitArgs || ".");
            else if (gitArg === "commit") {
              const msgMatch = cmd.match(/commit\s+-m\s+"([^"]+)"/) || cmd.match(/commit\s+-m\s+'([^']+)'/) || cmd.match(/commit\s+-m\s+(\S+)/);
              result = await get().gitCommit(msgMatch?.[1] || "");
            }
            else if (gitArg === "branch") result = get().gitBranch(parts[2] || undefined);
            else if (gitArg === "checkout") result = get().gitCheckout(gitArgs);
            else if (gitArg === "switch") result = get().gitSwitch(gitArgs);
            else if (gitArg === "log") result = get().gitLog();
            else if (gitArg === "reflog") result = get().gitReflog();
            else if (gitArg === "diff") result = get().gitDiff(gitArgs || undefined);
            else if (gitArg === "merge") result = get().gitMerge(gitArgs);
            else if (gitArg === "rebase") result = await get().gitRebase(gitArgs);
            else if (gitArg === "reset") result = get().gitReset(gitArgs);
            else if (gitArg === "stash") result = get().gitStash(gitArgs || undefined);
            else if (gitArg === "tag") result = get().gitTag(parts[2] || "", parts[3]);
            else if (gitArg === "remote") result = get().gitRemote(gitArgs);
            else if (gitArg === "push") result = get().gitPush();
            else if (gitArg === "pull") result = get().gitPull();
            else if (gitArg === "fetch") result = get().gitFetch();
            else if (gitArg === "revert") result = get().gitRevert(gitArgs);
            else if (gitArg === "cherry-pick") result = get().gitCherryPick(gitArgs);
            else if (gitArg === "show") result = get().gitShow(gitArgs);
            else if (gitArg === "blame") result = get().gitBlame(gitArgs);
            else if (gitArg === "restore") result = get().gitRestore(gitArgs);
            else if (gitArg === "clean") result = get().gitClean();
            else if (gitArg === "bisect") result = get().gitBisect(gitArgs);
            else if (gitArg === "worktree") result = get().gitWorktree(gitArgs);
            else if (gitArg === "config") result = get().gitConfig(gitArgs);
            else if (gitArg === "clone") result = get().gitClone(gitArgs);
            else if (gitArg === "help") result = { success: true, message: "GitVision supports: git init, status, add, commit, branch, checkout, switch, log, reflog, diff, merge, rebase, reset, stash, tag, remote, push, pull, fetch, revert, cherry-pick, show, blame, restore, clean, bisect, worktree, config, clone\n\nFilesystem: mkdir, cd, ls, pwd, touch, echo, cat, rm, mv, cp, clear\n\nNavigation: undo, redo" };
            else result = { success: false, message: `git: '${gitArg}' is not a git command. See 'git help'.` };
          }

          else if (command === "help") result = { success: true, message: "Available commands:\n- Filesystem: mkdir, cd, ls, pwd, touch, echo, cat, rm, mv, cp, clear\n- Git: git [command]\n- Navigation: undo, redo\n- Help: help" };
          else result = { success: false, message: `Command not found: ${command}. Type 'help' for available commands.` };

          // Add output to terminal history
          if (result.message) {
            useTerminalStore.getState().addEntry({
              command: "", output: result.message, timestamp: Date.now(),
              type: result.success ? "output" : "error",
            });
          }

          return result;
        },

        saveReplay: (name: string) => {},
        loadReplay: (id: string) => {},
      }),
      {
        name: "gitvision-storage",
        partialize: (state) => ({
          cwd: state.cwd,
          initialized: state.initialized,
          files: state.files,
          commits: state.commits,
          branches: state.branches,
          head: state.head,
          detachedHead: state.detachedHead,
          staging: state.staging,
          tags: state.tags,
          remotes: state.remotes,
          remoteBranches: (state as any).remoteBranches,
          stash: state.stash,
          history: state.history,
        }),
      },
    ),
  ),
);
