"use client";

import { useEffect, useState, useRef } from "react";
import { useGitStore } from "@/store/gitStore";
import { motion } from "framer-motion";
import { Play, RotateCcw, Terminal, GitBranch } from "lucide-react";

interface LiveExampleProps {
  commands: string[];
  height?: number;
}

export default function LiveExample({ commands, height = 280 }: LiveExampleProps) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const store = useGitStore();
  const commits = useGitStore((s) => s.commits);
  const branches = useGitStore((s) => s.branches);
  const head = useGitStore((s) => s.head);
  const files = useGitStore((s) => s.files);

  const reset = () => {
    store.resetState();
    store.gitInit();
    setOutput([]);
    setStep(0);
    setRunning(false);
  };

  const run = async () => {
    reset();
    setRunning(true);
    for (let i = 0; i < commands.length; i++) {
      setStep(i);
      const result = await store.processCommand(commands[i]);
      setOutput((prev) => [
        ...prev,
        `$ ${commands[i]}`,
        ...(result.message ? [result.message] : []),
      ]);
      await new Promise((r) => setTimeout(r, 400));
    }
    setRunning(false);
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const branchLines = branches.map((b) => ({
    name: b.name,
    isHead: b.isHead,
    commitCount: commits.filter((c) => {
      if (!b.commitHash) return false;
      const idx = commits.findIndex((cc) => cc.hash === b.commitHash);
      return idx >= 0;
    }).length,
  }));

  return (
    <div className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50 bg-surface">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-gray-300">Live Example</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            disabled={running}
            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 disabled:opacity-30 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={run}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 disabled:opacity-30 transition-all"
          >
            <Play className="w-3 h-3" />
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-2 divide-x divide-gray-700/50" style={{ height: `${height}px` }}>
        {/* Terminal output */}
        <div className="overflow-auto p-3 font-mono text-xs" ref={outputRef} style={{ background: "#0d1117" }}>
          {output.length === 0 && !running && (
            <div className="text-gray-600 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Click “Run” to execute the commands above</p>
            </div>
          )}
          {output.map((line, i) => (
            <div
              key={i}
              className={`leading-relaxed ${
                line.startsWith("$") ? "text-green-400" :
                line.startsWith("fatal") || line.startsWith("error") ? "text-red-400" :
                "text-gray-400"
              }`}
            >
              {line}
            </div>
          ))}
          {running && (
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Running: {commands[step] || ""}
            </div>
          )}
        </div>

        {/* Git state visualization */}
        <div className="overflow-auto p-3" style={{ background: "#0d1117" }}>
          {commits.length === 0 && files.length === 0 && !running && (
            <div className="text-gray-600 text-center py-8">
              <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Git state will appear here</p>
            </div>
          )}
          {commits.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Commits ({commits.length})
              </div>
              {[...commits].reverse().slice(0, 5).map((c, i) => (
                <div key={c.hash} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                    i === 0 ? "border-blue-500 bg-blue-500/30" : "border-gray-600"
                  }`} />
                  <div className="min-w-0">
                    <div className="text-[11px] text-gray-300 truncate font-mono">
                      {c.hash.substring(0, 7)} {c.message}
                    </div>
                    <div className="text-[9px] text-gray-600">{c.author.split("<")[0].trim()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {branches.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Branches
              </div>
              {branches.map((b) => (
                <div key={b.name} className="flex items-center gap-2 text-xs mb-1">
                  <span className={`w-2 h-2 rounded-full ${b.isHead ? "bg-blue-500" : "bg-gray-600"}`} />
                  <span className={b.isHead ? "text-blue-400 font-mono" : "text-gray-400 font-mono"}>
                    {b.name}
                  </span>
                  {b.isHead && <span className="text-[9px] text-blue-500/70">← HEAD</span>}
                </div>
              ))}
            </div>
          )}
          {files.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Files
              </div>
              <div className="space-y-0.5">
                {files.filter((f) => f.type === "file").slice(0, 8).map((f) => (
                  <div key={f.id} className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      f.status === "staged" ? "bg-green-500" :
                      f.status === "modified" ? "bg-yellow-500" :
                      f.status === "untracked" ? "bg-blue-500" :
                      "bg-gray-600"
                    }`} />
                    <span className="truncate">{f.name}</span>
                  </div>
                ))}
                {files.filter((f) => f.type === "file").length > 8 && (
                  <div className="text-[10px] text-gray-600">+{files.filter((f) => f.type === "file").length - 8} more</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step indicator */}
      {running && (
        <div className="flex gap-1 px-4 py-1.5 border-t border-gray-700/50 bg-surface">
          {commands.map((cmd, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < step ? "bg-green-500" : i === step ? "bg-blue-500 animate-pulse" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
