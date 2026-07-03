"use client";

import { useEffect, useRef } from "react";
import { useTerminalStore } from "@/store/gitStore";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {}

export default function Terminal({}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const isInitialized = useRef<boolean | "disposed">(false);
  const terminalStore = useTerminalStore();

  useEffect(() => {
    if (!terminalRef.current || isInitialized.current) return;
    isInitialized.current = true;

    import("@xterm/xterm").then(({ Terminal: XTerm }) => {
      if (!terminalRef.current || isInitialized.current === "disposed") return;

      const term = new XTerm({
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13,
        cursorBlink: true,
        theme: {
          background: "#0d1117",
          foreground: "#c9d1d9",
          cursor: "#c9d1d9",
          black: "#484f58",
          red: "#ff7b72",
          green: "#3fb950",
          yellow: "#d29922",
          blue: "#58a6ff",
          magenta: "#f778ba",
          cyan: "#39d2c0",
          white: "#b1bac4",
          brightBlack: "#6e7681",
          brightRed: "#ffa198",
          brightGreen: "#56d364",
          brightYellow: "#e3b341",
          brightBlue: "#79c0ff",
        },
        convertEol: true,
      });

      term.open(terminalRef.current);

      try {
        const fitAddonMod = require("@xterm/addon-fit");
        const FitAddon = fitAddonMod.FitAddon || fitAddonMod.default;
        if (FitAddon) {
          const fitAddon = new FitAddon();
          term.loadAddon(fitAddon);
          setTimeout(() => fitAddon.fit(), 100);
        }
      } catch {}

      try {
        const webLinksMod = require("@xterm/addon-web-links");
        const WebLinksAddon = webLinksMod.WebLinksAddon || webLinksMod.default;
        if (WebLinksAddon) {
          term.loadAddon(new WebLinksAddon());
        }
      } catch {}

      xtermRef.current = term;

      const welcome = [
        "",
        "  ╔══════════════════════════════════════════════════╗",
        "  ║            Welcome to GitVision                   ║",
        "  ║     Learn Git through interactive visualization   ║",
        "  ╚══════════════════════════════════════════════════╝",
        "",
        "  Type 'help' for available commands.",
        "  All Git commands are simulated in real-time.",
        "",
      ];
      term.writeln(welcome.join("\r\n"));

      // Initial history render
      const history = terminalStore.history;
      if (history && history.length > 0) {
        history.forEach((entry) => {
          if (entry.command) {
            term.writeln(`\r\n$ ${entry.command}`);
          }
          if (entry.output) {
            entry.output.split("\n").forEach((line: string) => {
              term.writeln(
                entry.type === "error" ? `\x1b[31m${line}\x1b[0m` : line,
              );
            });
          }
        });
      }
    });

    return () => {
      if (xtermRef.current) {
        isInitialized.current = "disposed";
        try {
          xtermRef.current.dispose();
        } catch {}
      }
    };
    // Mount-only: creates the xterm instance once and replays whatever history
    // existed at that moment. The `isInitialized` guard means adding
    // terminalStore.history here would re-run and immediately bail, not
    // re-replay — the effect below already streams incremental updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for new entries
  useEffect(() => {
    if (!xtermRef.current) return;

    const history = terminalStore.history;
    if (!history || history.length === 0) return;

    const lastEntry = history[history.length - 1];
    if (lastEntry && lastEntry.command) {
      xtermRef.current.writeln(`\r\n$ ${lastEntry.command}`);
    }
    if (lastEntry && lastEntry.output) {
      lastEntry.output.split("\n").forEach((line: string) => {
        xtermRef.current.writeln(
          lastEntry.type === "error" ? `\x1b[31m${line}\x1b[0m` : line,
        );
      });
    }
  }, [terminalStore.history]);

  return (
    <div className="h-full flex flex-col bg-[#0d1117] rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="text-[11px] text-gray-500 ml-2 font-mono" aria-label="Terminal">
            terminal
          </span>
        </div>
      </div>
      <div ref={terminalRef} className="flex-1 min-h-0" role="log" aria-live="polite" aria-label="Terminal output" />
    </div>
  );
}
