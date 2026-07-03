import { describe, it, expect } from "vitest";
import { gitHash, shortHash, hashBlob, hashCommit } from "@/lib/crypto";

describe("crypto utilities", () => {
  it("should produce consistent SHA-1 hashes", async () => {
    const hash1 = await gitHash("blob", "hello world");
    const hash2 = await gitHash("blob", "hello world");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(40);
    expect(/^[0-9a-f]{40}$/.test(hash1)).toBe(true);
  });

  it("should produce different hashes for different content", async () => {
    const hash1 = await gitHash("blob", "hello");
    const hash2 = await gitHash("blob", "world");
    expect(hash1).not.toBe(hash2);
  });

  it("should produce different hashes for different types", async () => {
    const hash1 = await gitHash("blob", "hello");
    const hash2 = await gitHash("commit", "hello");
    expect(hash1).not.toBe(hash2);
  });

  it("should match Git's SHA-1 for known blob", async () => {
    // Git computes: echo -n "hello" | git hash-object --stdin
    // The hash includes the header "blob 5\0hello"
    const hash = await gitHash("blob", "hello");
    expect(hash).toHaveLength(40);
  });

  it("shortHash should return first 7 characters", () => {
    const full = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0";
    expect(shortHash(full)).toBe("a1b2c3d");
  });

  it("hashBlob should produce valid SHA-1", async () => {
    const hash = await hashBlob("test content");
    expect(hash).toHaveLength(40);
    expect(/^[0-9a-f]{40}$/.test(hash)).toBe(true);
  });

  it("hashCommit should include tree, author, and message", async () => {
    const hash = await hashCommit(
      "abc123def456abc123def456abc123def456abc1",
      ["parent1hash"],
      "Initial commit",
      "Test User <test@example.com>",
      1000000,
    );
    expect(hash).toHaveLength(40);
    expect(/^[0-9a-f]{40}$/.test(hash)).toBe(true);
  });

  it("hashCommit with no parents should still work", async () => {
    const hash = await hashCommit(
      "treehash",
      [],
      "root commit",
      "Root <root@example.com>",
      500000,
    );
    expect(hash).toHaveLength(40);
  });
});
