"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface ConflictResolverProps {
  conflict: {
    filePath: string;
    currentContent: string;
    incomingContent: string;
  } | null;
  onResolve: (resolution: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ConflictResolver({ conflict, onResolve, onNext, onPrev }: ConflictResolverProps) {
  const [resolution, setResolution] = useState<"current" | "incoming" | "both" | "custom">("current");
  const [customText, setCustomText] = useState("");

  if (!conflict) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p>No active conflicts</p>
        <p className="text-sm mt-1">Resolve merge conflicts to see them here</p>
      </div>
    );
  }

  const handleResolve = (choice: string) => {
    if (choice === "current") onResolve(conflict.currentContent);
    else if (choice === "incoming") onResolve(conflict.incomingContent);
    else if (choice === "both") onResolve(conflict.currentContent + "\n" + conflict.incomingContent);
    else onResolve(customText);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-200">Merge Conflict Resolution</h3>
        <div className="flex gap-1">
          <button onClick={onPrev} className="p-1 rounded hover:bg-gray-700" aria-label="Previous conflict">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={onNext} className="p-1 rounded hover:bg-gray-700" aria-label="Next conflict">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Conflict in <code className="font-mono">{conflict.filePath}</code> — line by line differences detected between current and incoming changes.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
          <div className="bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-400 flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Current Changes (HEAD)
          </div>
          <pre className="p-3 font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-auto">
            {conflict.currentContent || "(empty)"}
          </pre>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 overflow-hidden">
          <div className="bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400 flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" />
            Incoming Changes
          </div>
          <pre className="p-3 font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-auto">
            {conflict.incomingContent || "(empty)"}
          </pre>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-400">Choose resolution:</p>
        <div className="flex gap-2">
          {[
            { key: "current", label: "Keep Current" },
            { key: "incoming", label: "Accept Incoming" },
            { key: "both", label: "Keep Both" },
            { key: "custom", label: "Custom" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setResolution(opt.key as any)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                resolution === opt.key
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {resolution === "custom" && (
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 font-mono resize-none focus:outline-none focus:border-primary"
            placeholder="Write your custom resolution..."
          />
        )}
      </div>

      <button
        onClick={() => handleResolve(resolution)}
        className="w-full py-3 rounded-lg bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Resolve Conflict
      </button>
    </div>
  );
}