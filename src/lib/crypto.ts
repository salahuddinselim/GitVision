/* ── Content-Addressable SHA-1 (Git-compatible) ──────────────── */

async function sha1(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-1", bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function gitHash(type: "blob" | "tree" | "commit" | "tag", content: string): Promise<string> {
  const header = `${type} ${content.length}\0`;
  return sha1(header + content);
}

export function shortHash(hash: string): string {
  return hash.substring(0, 7);
}

export async function hashBlob(content: string): Promise<string> {
  return gitHash("blob", content);
}

export async function hashCommit(
  treeHash: string,
  parentHashes: string[],
  message: string,
  author: string,
  date: number,
): Promise<string> {
  let content = `tree ${treeHash}\n`;
  for (const p of parentHashes) {
    content += `parent ${p}\n`;
  }
  content += `author ${author} ${Math.floor(date / 1000)} +0000\n`;
  content += `committer ${author} ${Math.floor(date / 1000)} +0000\n`;
  content += `\n${message}\n`;
  return gitHash("commit", content);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
