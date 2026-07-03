"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, AlertTriangle, CheckCircle, GitBranch, RefreshCw, Undo2, Redo2, Download, Upload, FileEdit, FileDiff, X, BookOpen, MessageSquare } from "lucide-react";
import { useGitStore } from "@/store/gitStore";
import { useTerminalStore } from "@/store/gitStore";
import dynamic from "next/dynamic";
import CommandInput from "@/components/CommandInput";
import Terminal from "@/components/Terminal";
import FileExplorer from "@/components/FileExplorer";
import GitGraph from "@/components/GitGraph";
import StagingArea from "@/components/StagingArea";
import DiffViewer from "@/components/DiffViewer";
import TutorialPanel from "@/components/TutorialPanel";

const MonacoEditor = dynamic(() => import("@/components/MonacoEditor"), { ssr: false });

interface ActiveFile {
  path: string;
  content: string;
  language: string;
}

export default function PlaygroundPage() {
  const { initialized, canUndo, canRedo } = useGitStore();
  const gitStore = useGitStore();
  const [activeFile, setActiveFile] = useState<ActiveFile | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"files" | "tutorials">("files");

  const handleExport = useCallback(() => {
    const state = {
      files: gitStore.files,
      commits: gitStore.commits,
      branches: gitStore.branches,
      head: gitStore.head,
      staging: gitStore.staging,
      tags: gitStore.tags,
      remotes: gitStore.remotes,
      remoteBranches: (gitStore as any).remoteBranches,
      stash: gitStore.stash,
      history: gitStore.history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gitvision-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gitStore]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        gitStore.resetState();
        // Re-import state
        if (data.files) (gitStore as any).files = data.files;
        if (data.commits) (gitStore as any).commits = data.commits;
        if (data.branches) (gitStore as any).branches = data.branches;
        if (data.head) (gitStore as any).head = data.head;
        if (data.staging) (gitStore as any).staging = data.staging;
        if (data.tags) (gitStore as any).tags = data.tags;
        if (data.remotes) (gitStore as any).remotes = data.remotes;
        if (data.remoteBranches) (gitStore as any).remoteBranches = data.remoteBranches;
        if (data.stash) (gitStore as any).stash = data.stash;
        if (data.history) (gitStore as any).history = data.history;
        alert("Session imported successfully!");
      } catch {
        alert("Invalid session file.");
      }
    };
    input.click();
  }, [gitStore]);

  // Watch for file clicks in FileExplorer
  useEffect(() => {
    const unsubscribe = useGitStore.subscribe((state, prev) => {
      if (state.files !== prev.files && state.files.length > 0) {
        // Check if there's a selected file (stored in a data attribute)
      }
    });
    return unsubscribe;
  }, []);

  const handleOpenFile = (path: string, content: string) => {
    const ext = path.split(".").pop()?.toLowerCase() || "";
    const langMap: Record<string, string> = {
      js: "javascript", ts: "typescript", tsx: "typescriptreact", jsx: "javascriptreact",
      html: "html", css: "css", json: "json", md: "markdown", py: "python",
      rs: "rust", go: "go", rb: "ruby", java: "java", c: "c", cpp: "cpp",
      sh: "shell", yaml: "yaml", yml: "yaml", xml: "xml", sql: "sql",
    };
    setActiveFile({
      path, content,
      language: langMap[ext] || "plaintext",
    });
    setShowDiff(false);
  };

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col bg-background">
      {/* Playground Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700/50 bg-surface/95 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TerminalIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-semibold">Playground</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={() => gitStore.undo()}
            disabled={!canUndo()}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo (or type 'undo')"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => gitStore.redo()}
            disabled={!canRedo()}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo (or type 'redo')"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-700" />

          {/* Export/Import */}
          <button
            onClick={handleExport}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
            title="Export session"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleImport}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
            title="Import session"
          >
            <Upload className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-700" />

          {!initialized && (
            <button
              onClick={() => useGitStore.getState().gitInit()}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Initialize Repository
            </button>
          )}
          {initialized && (
            <span className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
              Git Repo Active
            </span>
          )}
        </div>
      </div>

      {!initialized && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <GitBranch className="w-24 h-24 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-gray-200">Welcome to the Playground</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Start by initializing a Git repository. Type <code className="bg-gray-700 px-2 py-0.5 rounded font-mono text-sm">git init</code> in the terminal below, or click the button above.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Once initialized, try these commands:<br />
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">mkdir src</code> &nbsp;
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">touch app.js</code> &nbsp;
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">git add .</code> &nbsp;
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">git commit -m &quot;first&quot;</code>
            </p>
            <div className="bg-gray-900 rounded-lg p-2 inline-block">
              <p className="font-mono text-xs text-gray-500">
                $ ▌ <span className="text-gray-400">git init</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {initialized && (
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-surface border-b border-gray-700/50 text-xs text-gray-400 shrink-0">
              <span>File System</span>
              <span className="text-gray-600">│</span>
              <span>Terminal</span>
              <span className="text-gray-600">│</span>
              <span>Git Graph</span>
              <span className="text-gray-600">│</span>
              <span>Staging Area</span>
              <span className="text-gray-600">│</span>
              <span>Editor</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>

            {/* Main Grid */}
          <div className="flex-1 grid grid-cols-[260px_1fr_320px] overflow-hidden">
              {/* Left: File Explorer / Tutorials */}
              <div className="border-r border-gray-700/50 overflow-hidden flex flex-col">
                <div className="flex border-b border-gray-700/50 shrink-0">
                  <button
                    onClick={() => setSidebarTab("files")}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                      sidebarTab === "files"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <FileEdit className="w-3.5 h-3.5 inline mr-1.5" />
                    Files
                  </button>
                  <button
                    onClick={() => setSidebarTab("tutorials")}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                      sidebarTab === "tutorials"
                        ? "text-primary border-b-2 border-primary bg-primary/5"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
                    Tutorials
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  {sidebarTab === "files" ? (
                    <FileExplorer onOpenFile={handleOpenFile} />
                  ) : (
                    <TutorialPanel />
                  )}
                </div>
              </div>

              {/* Center: Terminal + Editor */}
              <div className="flex flex-col overflow-hidden">
                {activeFile ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-gray-700/50 text-xs text-gray-400 shrink-0">
                      <div className="flex items-center gap-2">
                        <FileEdit className="w-3.5 h-3.5" />
                        <span className="font-mono text-gray-300">{activeFile.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDiff(!showDiff)}
                          className={`p-1 rounded transition-colors ${showDiff ? "bg-primary/20 text-primary" : "hover:bg-gray-700"}`}
                          title="Toggle diff view"
                        >
                          <FileDiff className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-500">{activeFile.language}</span>
                        <button
                          onClick={() => {
                            // Save editor content back to store
                            const file = useGitStore.getState().files.find((f) => f.path === activeFile.path);
                            if (file) {
                              useGitStore.setState({
                                files: useGitStore.getState().files.map((f) =>
                                  f.path === activeFile.path
                                    ? { ...f, content: activeFile.content, status: "modified" as const, updatedAt: Date.now() }
                                    : f
                                ),
                              });
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setActiveFile(null)}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {showDiff ? (
                        <DiffViewer diff={activeFile.content} />
                      ) : (
                        <MonacoEditor
                          value={activeFile.content}
                          language={activeFile.language}
                          onChange={(val) => setActiveFile({ ...activeFile, content: val || "" })}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 min-h-0">
                      <Terminal />
                    </div>
                    <div className="border-t border-gray-700/50 bg-surface/50 px-3 py-2 shrink-0">
                      <CommandInput />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Git Info */}
              <div className="border-l border-gray-700/50 flex flex-col overflow-hidden">
                <div className="h-1/2 border-b border-gray-700/50 overflow-hidden">
                  <GitGraph />
                </div>
                <div className="h-1/2 overflow-hidden">
                  <StagingArea />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
