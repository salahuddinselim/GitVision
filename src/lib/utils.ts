/* ── Git Command Parser ───────────────────────────────────────── */

import { GitFile } from "@/store/gitStore";

/**
 * Parse a git log output and return structured commit data
 */
export function parseGitLog(raw: string) {
  if (!raw || !raw.trim()) return [];

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
      const blankLineIdx = lines.findIndex((l) => l.trim() === "");
      const message =
        blankLineIdx >= 0
          ? lines
              .slice(blankLineIdx + 1)
              .join("\n")
              .trim()
          : "";
      return { hash, author, date, message };
    });
}

/**
 * Parse git diff output
 */
export function parseGitDiff(raw: string) {
  const lines = raw.split("\n");
  const result: Array<{
    type: "header" | "context" | "added" | "removed";
    content: string;
  }> = [];

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      result.push({ type: "header", content: line });
    } else if (line.startsWith("+++") || line.startsWith("---")) {
      result.push({ type: "header", content: line });
    } else if (line.startsWith("@@")) {
      result.push({ type: "header", content: line });
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      result.push({ type: "added", content: line });
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      result.push({ type: "removed", content: line });
    } else {
      result.push({ type: "context", content: line });
    }
  }
  return result;
}

/**
 * Resolve absolute path from cwd and user input
 */
export function resolvePath(cwd: string, input: string): string {
  if (input.startsWith("/")) return input;

  const prefix = cwd === "/" ? "" : cwd;
  const fullPath = `${prefix}/${input}`;

  // Normalize: resolve .. and .
  const parts = fullPath.split("/").filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }

  return "/" + resolved.join("/");
}

/**
 * Get file basename from path
 */
export function basename(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] || "/";
}

/**
 * Get directory name from path
 */
export function dirname(path: string): string {
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return parts.length ? "/" + parts.join("/") : "/";
}

/**
 * Generate a unique ID
 */
export function uid(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate a visual tree representation of files
 */
export function generateFileTree(
  files: GitFile[],
  basePath: string = "/",
): string {
  const tree: string[] = [];

  function buildTree(prefix: string, path: string) {
    const children = files
      .filter((f) => dirname(f.path) === path)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;
      const connector = isLast ? "└── " : "├── ";

      if (child.type === "folder") {
        tree.push(`${prefix}${connector}📁 ${child.name}/`);
        buildTree(prefix + (isLast ? "    " : "│   "), child.path);
      } else {
        tree.push(`${prefix}${connector}📄 ${child.name}`);
      }
    });
  }

  buildTree("", basePath);
  return tree.join("\n");
}
