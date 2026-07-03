"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGitStore } from "@/store/gitStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import FileExplorer from "./FileExplorer";
import Terminal from "./Terminal";
import GitGraph from "./GitGraph";
import StagingArea from "./StagingArea";

export default function SplitView() {
  const isGraphOnly = false;
  const isTerminalOnly = false;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-700 h-full">
        {/* File Explorer - Left */}
        <div className={`bg-surface ${isTerminalOnly ? "hidden" : ""}`}>
          <div className="h-full border-r border-gray-700">
            <FileExplorer />
          </div>
        </div>

        {/* Terminal + Graph area */}
        <div className={`${isTerminalOnly ? "col-span-2" : isGraphOnly ? "col-span-2" : "col-span-2"} flex flex-col`}>
          {/* Terminal */}
          <div className={`${isGraphOnly ? "h-full" : "h-1/2"} min-h-[200px]`}>
            <Terminal />
          </div>

          {/* Git Graph & Staging */}
          {!isGraphOnly && (
            <div className="h-1/2 flex border-t border-gray-700">
              <GitGraph />
              <div className="w-px bg-gray-700" />
              <StagingArea />
            </div>
          )}

          {isGraphOnly && (
            <div className="flex">
              <GitGraph />
              <div className="w-px bg-gray-700" />
              <StagingArea />
            </div>
          )}
        </div>
      </div>

      {/* View Mode Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        {["combined", "terminal", "graph"].map((mode) => (
          <button
            key={mode}
            className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
              mode === "combined"
                ? "bg-primary text-primary-foreground"
                : "bg-background/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            {mode === "combined" ? "⊞" : mode === "terminal" ? "⌨" : "📊"}
          </button>
        ))}
      </div>
    </div>
  );
}