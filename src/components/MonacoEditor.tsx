"use client";

import { useEffect, useRef } from "react";

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
}

export default function MonacoEditor({
  value,
  language = "plaintext",
  onChange,
  readOnly = false,
  height,
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const isInitialized = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;
    isInitialized.current = true;

    import("monaco-editor").then((monaco) => {
      if (!containerRef.current) return;

      // Define a dark theme matching GitVision
      monaco.editor.defineTheme("gitvision-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6a9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569cd6" },
          { token: "string", foreground: "ce9178" },
          { token: "number", foreground: "b5cea8" },
          { token: "type", foreground: "4ec9b0" },
          { token: "function", foreground: "dcdcaa" },
        ],
        colors: {
          "editor.background": "#0d1117",
          "editor.foreground": "#c9d1d9",
          "editor.lineHighlightBackground": "#161b22",
          "editor.selectionBackground": "#264f78",
          "editorCursor.foreground": "#c9d1d9",
          "editorLineNumber.foreground": "#6e7681",
          "editorLineNumber.activeForeground": "#c9d1d9",
          "editor.inactiveSelectionBackground": "#264f7855",
          "editorWidget.background": "#161b22",
          "editorWidget.border": "#30363d",
          "input.background": "#0d1117",
          "input.border": "#30363d",
          "scrollbarSlider.background": "#484f5866",
          "scrollbarSlider.activeBackground": "#484f58aa",
          "scrollbarSlider.hoverBackground": "#484f5888",
        },
      });

      const editor = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: "gitvision-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        lineNumbers: "on",
        renderLineHighlight: "line",
        scrollBeyondLastLine: false,
        tabSize: 2,
        readOnly,
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        padding: { top: 8, bottom: 8 },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
      });

      editorRef.current = editor;

      // Read the latest onChange via ref so a new callback identity from the
      // parent doesn't require recreating the (expensive) Monaco instance.
      editor.onDidChangeModelContent(() => {
        onChangeRef.current?.(editor.getValue());
      });
    });

    return () => {
      if (editorRef.current) {
        try { editorRef.current.dispose(); } catch {}
        editorRef.current = null;
      }
      isInitialized.current = false;
    };
    // Mount-only: creates the (expensive) Monaco instance once. Later
    // language/readOnly/value changes are pushed imperatively below instead
    // of recreating the editor; onChange is read via onChangeRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update value when prop changes (but not from our own edits).
  // `isInitialized` is a creation-in-progress flag, not a "ready" flag — it's
  // true for the entire mounted lifetime, so gating on it here always skipped
  // this sync. editorRef.current alone is sufficient to know the editor exists.
  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.getValue();
      if (current !== value) {
        editorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update language
  useEffect(() => {
    if (editorRef.current) {
      import("monaco-editor").then((monaco) => {
        monaco.editor.setModelLanguage(editorRef.current.getModel(), language);
      });
    }
  }, [language]);

  // Update read-only state
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[200px]"
      style={height ? { height } : undefined}
    />
  );
}
