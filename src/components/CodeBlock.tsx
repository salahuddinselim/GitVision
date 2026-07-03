"use client";

import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  highlightLines?: number[];
}

export default function CodeBlock({
  code,
  language = "bash",
  showLineNumbers = true,
  copyable = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-[#0d1117]">
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white text-xs z-10"
          aria-label="Copy code"
        >
          {copied ? "✓" : "📋"}
        </button>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const isHighlighted = highlightLines.includes(lineNum);
          return (
            <div
              key={i}
              className={`flex ${isHighlighted ? "bg-[#1c2128]" : ""}`}
            >
              {showLineNumbers && (
                <span className="text-gray-500 select-none w-8 text-right pr-4 mr-4 border-r border-gray-700">
                  {lineNum}
                </span>
              )}
              <span className="flex-1 whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}