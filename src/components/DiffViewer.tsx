"use client";

import { useState } from "react";
import MonacoEditor from "./MonacoEditor";

interface DiffViewerProps {
  diff: string;
}

export default function DiffViewer({ diff }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"unified" | "split">("unified");

  const lines = diff.split("\n");

  // Parse diff into structured hunks
  const hunks: Array<{ header: string; lines: Array<{ text: string; type: string }> }> = [];
  let currentHunk: { header: string; lines: Array<{ text: string; type: string }> } | null = null;

  lines.forEach((line) => {
    if (line.startsWith("@@")) {
      if (currentHunk) hunks.push(currentHunk);
      currentHunk = { header: line, lines: [] };
    } else if (currentHunk) {
      let type = "context";
      if (line.startsWith("+") && !line.startsWith("+++")) type = "added";
      else if (line.startsWith("-") && !line.startsWith("---")) type = "removed";
      currentHunk.lines.push({ text: line, type });
    }
  });
  if (currentHunk) hunks.push(currentHunk);

  if (!diff) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        <div className="text-center">
          <p>No changes to display</p>
          <p className="text-xs mt-1">Run git diff to see changes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0d1117]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-gray-700 shrink-0">
        <span className="text-xs text-gray-400 font-mono">
          diff — {diff.split("\n")[0] || ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("unified")}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              viewMode === "unified" ? "bg-primary/20 text-primary" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Unified
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              viewMode === "split" ? "bg-primary/20 text-primary" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Split
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {viewMode === "unified" ? (
          <pre className="p-4 font-mono text-sm leading-relaxed">
            {lines.map((line, i) => {
              let className = "text-gray-300";
              if (line.startsWith("+") && !line.startsWith("+++"))
                className = "text-green-400 bg-green-500/10 block";
              else if (line.startsWith("-") && !line.startsWith("---"))
                className = "text-red-400 bg-red-500/10 block";
              else if (line.startsWith("@@"))
                className = "text-cyan-400 bg-cyan-500/10 block";
              else if (line.startsWith("diff --git"))
                className = "text-purple-400 font-bold block";
              else if (line.startsWith("---") || line.startsWith("+++"))
                className = "text-blue-400 block";
              return (
                <div key={i} className={className}>
                  {line}
                </div>
              );
            })}
          </pre>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-gray-700 h-full">
            {/* Left: old */}
            <div className="overflow-auto">
              <div className="text-[10px] text-gray-500 px-3 py-1 bg-gray-800/50 font-mono sticky top-0">--- old</div>
              <pre className="p-3 font-mono text-sm leading-relaxed">
                {hunks.map((hunk, hi) => (
                  <div key={hi}>
                    <div className="text-cyan-400 bg-cyan-500/10 text-xs px-1">{hunk.header}</div>
                    {hunk.lines.map((l, li) => (
                      <div
                        key={li}
                        className={l.type === "removed" ? "text-red-400 bg-red-500/10" : l.type === "added" ? "text-gray-600" : "text-gray-400"}
                      >
                        {l.text}
                      </div>
                    ))}
                  </div>
                ))}
              </pre>
            </div>
            {/* Right: new */}
            <div className="overflow-auto">
              <div className="text-[10px] text-gray-500 px-3 py-1 bg-gray-800/50 font-mono sticky top-0">+++ new</div>
              <pre className="p-3 font-mono text-sm leading-relaxed">
                {hunks.map((hunk, hi) => (
                  <div key={hi}>
                    <div className="text-cyan-400 bg-cyan-500/10 text-xs px-1">{hunk.header}</div>
                    {hunk.lines.map((l, li) => (
                      <div
                        key={li}
                        className={l.type === "added" ? "text-green-400 bg-green-500/10" : l.type === "removed" ? "text-gray-600" : "text-gray-400"}
                      >
                        {l.text}
                      </div>
                    ))}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
