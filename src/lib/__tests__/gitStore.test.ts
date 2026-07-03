import { describe, it, expect, beforeEach } from "vitest";
import { useGitStore, useTerminalStore } from "@/store/gitStore";

// Reset store before each test
beforeEach(() => {
  const store = useGitStore.getState();
  store.resetState();
  useTerminalStore.getState().clearHistory();
});

describe("GitStore", () => {
  describe("Initialization", () => {
    it("should start uninitialized", () => {
      const state = useGitStore.getState();
      expect(state.initialized).toBe(false);
      expect(state.commits).toHaveLength(0);
      expect(state.branches).toHaveLength(0);
    });

    it("should initialize with git init", () => {
      const store = useGitStore.getState();
      const result = store.gitInit();
      expect(result.success).toBe(true);
      expect(useGitStore.getState().initialized).toBe(true);
      expect(useGitStore.getState().branches).toHaveLength(1);
      expect(useGitStore.getState().branches[0].name).toBe("master");
      expect(useGitStore.getState().branches[0].isHead).toBe(true);
    });

    it("should not reinitialize", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitInit();
      expect(result.success).toBe(false);
    });
  });

  describe("Filesystem operations", () => {
    beforeEach(() => {
      useGitStore.getState().gitInit();
    });

    it("mkdir should create a folder", () => {
      const store = useGitStore.getState();
      const result = store.mkdir("src");
      expect(result.success).toBe(true);
      const files = useGitStore.getState().files;
      expect(files.some((f) => f.path === "/src" && f.type === "folder")).toBe(true);
    });

    it("mkdir should fail for existing folder", () => {
      const store = useGitStore.getState();
      store.mkdir("src");
      const result = store.mkdir("src");
      expect(result.success).toBe(false);
    });

    it("touch should create a file", () => {
      const store = useGitStore.getState();
      const result = store.touch("app.js");
      expect(result.success).toBe(true);
      const files = useGitStore.getState().files;
      expect(files.some((f) => f.path === "/app.js" && f.type === "file")).toBe(true);
    });

    it("echo should create file with content", () => {
      const store = useGitStore.getState();
      const result = store.echo("test.txt", "Hello World");
      expect(result.success).toBe(true);
      const file = useGitStore.getState().files.find((f) => f.path === "/test.txt");
      expect(file).toBeDefined();
      expect(file!.content).toBe("Hello World");
    });

    it("cat should read file content", () => {
      const store = useGitStore.getState();
      store.echo("test.txt", "Hello World");
      const result = store.cat("test.txt");
      expect(result.success).toBe(true);
      expect(result.content).toBe("Hello World");
    });

    it("ls should list directory contents", () => {
      const store = useGitStore.getState();
      store.mkdir("src");
      store.touch("readme.md");
      const result = store.ls();
      expect(result.success).toBe(true);
      expect(result.files).toContain("src/");
      expect(result.files).toContain("readme.md");
    });

    it("rm should remove a file", () => {
      const store = useGitStore.getState();
      store.touch("temp.txt");
      store.rm("temp.txt");
      expect(useGitStore.getState().files.some((f) => f.path === "/temp.txt")).toBe(false);
    });

    it("cd and pwd should work", () => {
      const store = useGitStore.getState();
      store.mkdir("src");
      store.cd("src");
      expect(useGitStore.getState().cwd).toBe("/src");
      expect(store.pwd()).toBe("/src");
      store.cd("/");
      expect(store.pwd()).toBe("/");
    });
  });

  describe("Git operations", () => {
    beforeEach(() => {
      useGitStore.getState().gitInit();
    });

    it("git status on clean repo", () => {
      const result = useGitStore.getState().gitStatus();
      expect(result.success).toBe(true);
      expect(result.message).toContain("nothing to commit");
    });

    it("should track untracked files", () => {
      const store = useGitStore.getState();
      store.touch("newfile.js");
      const result = store.gitStatus();
      expect(result.message).toContain("Untracked files");
      expect(result.message).toContain("newfile.js");
    });

    it("git add should stage files", () => {
      const store = useGitStore.getState();
      store.touch("app.js");
      store.gitAdd("app.js");
      const file = useGitStore.getState().files.find((f) => f.path === "/app.js");
      expect(file?.status).toBe("staged");
    });

    it("git add . should stage all", () => {
      const store = useGitStore.getState();
      store.touch("a.js");
      store.touch("b.js");
      store.gitAdd(".");
      const files = useGitStore.getState().files;
      expect(files.every((f) => f.status === "staged")).toBe(true);
    });

    it("git commit should create a commit", async () => {
      const store = useGitStore.getState();
      store.touch("app.js");
      store.gitAdd(".");
      const result = await store.gitCommit("Initial commit");
      expect(result.success).toBe(true);
      const state = useGitStore.getState();
      expect(state.commits).toHaveLength(1);
      expect(state.commits[0].message).toBe("Initial commit");
    });

    it("commit hash should be content-addressable", async () => {
      const store = useGitStore.getState();
      store.touch("app.js");
      store.gitAdd(".");
      await store.gitCommit("First commit");
      const hash1 = useGitStore.getState().commits[0].hash;

      // Same content should produce same hash
      useGitStore.getState().resetState();
      useGitStore.getState().gitInit();
      store.touch("app.js");
      store.gitAdd(".");
      await store.gitCommit("First commit");
      const hash2 = useGitStore.getState().commits[0].hash;
      expect(hash1).toBe(hash2);
    });

    it("should reject empty commit message", async () => {
      const store = useGitStore.getState();
      store.touch("app.js");
      store.gitAdd(".");
      const result = await store.gitCommit("");
      expect(result.success).toBe(false);
    });
  });

  describe("Branching", () => {
    beforeEach(() => {
      const store = useGitStore.getState();
      store.gitInit();
    });

    it("git branch should list branches", () => {
      const store = useGitStore.getState();
      const result = store.gitBranch();
      expect(result.success).toBe(true);
      expect(result.message).toContain("master");
    });

    it("git branch should create a new branch", () => {
      const store = useGitStore.getState();
      const result = store.gitBranch("feature");
      expect(result.success).toBe(true);
      expect(useGitStore.getState().branches).toHaveLength(2);
    });

    it("should not create duplicate branches", () => {
      const store = useGitStore.getState();
      store.gitBranch("feature");
      const result = store.gitBranch("feature");
      expect(result.success).toBe(false);
    });

    it("git checkout should switch branches", () => {
      const store = useGitStore.getState();
      store.gitBranch("feature");
      const result = store.gitCheckout("feature");
      expect(result.success).toBe(true);
      const branch = useGitStore.getState().branches.find((b) => b.isHead);
      expect(branch?.name).toBe("feature");
    });
  });

  describe("Merge", () => {
    it("should fast-forward when possible", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.gitBranch("feature");
      store.gitCheckout("feature");
      store.touch("b.js");
      store.gitAdd(".");
      await store.gitCommit("Feature work");
      store.gitCheckout("master");
      const result = store.gitMerge("feature");
      expect(result.success).toBe(true);
      expect(result.message).toContain("Fast-forward");
    });

    it("head should remain the branch name (not a commit hash) after fast-forward", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.gitBranch("feature");
      store.gitCheckout("feature");
      store.touch("b.js");
      store.gitAdd(".");
      await store.gitCommit("Feature work");
      store.gitCheckout("master");
      store.gitMerge("feature");
      expect(useGitStore.getState().head).toBe("master");
    });

    it("head should remain the branch name after a 3-way merge commit", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.gitBranch("feature");
      store.gitCheckout("feature");
      store.touch("b.js");
      store.gitAdd(".");
      await store.gitCommit("Feature work");
      store.gitCheckout("master");
      store.touch("c.js");
      store.gitAdd(".");
      await store.gitCommit("Master work");
      store.gitMerge("feature");
      expect(useGitStore.getState().head).toBe("master");
    });

    it("should fail to merge same branch", () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      store.gitCommit("First");
      const result = store.gitMerge("master");
      expect(result.message).toContain("Already up to date");
    });

    it("should fail for non-existent branch", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitMerge("nonexistent");
      expect(result.success).toBe(false);
    });
  });

  describe("Merge conflicts", () => {
    it("conflict markers should include content from both sides, not just the last line", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("shared.js");
      store.echo("shared.js", "line1\nline2\nline3");
      store.gitAdd(".");
      await store.gitCommit("Base");

      store.gitBranch("feature");
      store.gitCheckout("feature");
      store.echo("shared.js", "feature1\nfeature2\nfeature3");
      store.gitAdd(".");
      await store.gitCommit("Feature edits");

      store.gitCheckout("master");
      store.echo("shared.js", "master1\nmaster2\nmaster3");
      store.gitAdd(".");
      await store.gitCommit("Master edits");

      const result = store.gitMerge("feature");
      expect(result.success).toBe(false);
      expect(result.message).toContain("CONFLICT");

      const file = useGitStore.getState().files.find((f) => f.path === "/shared.js");
      expect(file?.content).toContain("<<<<<<< HEAD");
      expect(file?.content).toContain("=======");
      expect(file?.content).toContain(">>>>>>> incoming");
      // All three "ours" lines must survive, not just the first.
      expect(file?.content).toContain("master1");
      expect(file?.content).toContain("master2");
      expect(file?.content).toContain("master3");
      // All three "theirs" lines must survive — this is the bug that was fixed:
      // previously only the single line where the conflict closed made it in.
      expect(file?.content).toContain("feature1");
      expect(file?.content).toContain("feature2");
      expect(file?.content).toContain("feature3");
    });
  });

  describe("Rebase", () => {
    it("head should remain the branch name (not a commit hash) after rebase", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.gitBranch("feature");
      store.gitCheckout("feature");
      store.touch("b.js");
      store.gitAdd(".");
      await store.gitCommit("Feature work");
      store.gitCheckout("master");
      store.touch("c.js");
      store.gitAdd(".");
      await store.gitCommit("Master work");
      store.gitCheckout("feature");
      await store.gitRebase("master");
      expect(useGitStore.getState().head).toBe("feature");
    });
  });

  describe("Checkout -b", () => {
    it("should create AND switch to the new branch", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitCheckout("-b feature");
      expect(result.success).toBe(true);
      const state = useGitStore.getState();
      expect(state.branches.some((b) => b.name === "feature")).toBe(true);
      expect(state.branches.find((b) => b.isHead)?.name).toBe("feature");
      expect(state.head).toBe("feature");
    });
  });

  describe("File deletion", () => {
    it("rm on a committed file marks it deleted, not silently removed", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.rm("a.js");
      const file = useGitStore.getState().files.find((f) => f.path === "/a.js");
      expect(file).toBeDefined();
      expect(file?.status).toBe("deleted");
    });

    it("git status shows the deletion, staged or not", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.rm("a.js");
      const unstaged = store.gitStatus();
      expect(unstaged.message).toContain("deleted:");
      store.gitAdd("a.js");
      const staged = store.gitStatus();
      expect(staged.message).toContain("Changes to be committed");
      expect(staged.message).toContain("deleted:");
    });

    it("committing a staged deletion removes the file from tracked files", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.rm("a.js");
      store.gitAdd("a.js");
      await store.gitCommit("Remove a.js");
      expect(useGitStore.getState().files.some((f) => f.path === "/a.js")).toBe(false);
    });

    it("rm on an untracked file removes it entirely", () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("temp.txt");
      store.rm("temp.txt");
      expect(useGitStore.getState().files.some((f) => f.path === "/temp.txt")).toBe(false);
    });
  });

  describe("echo status semantics", () => {
    it("editing an untracked file keeps it untracked", () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.echo("a.js", "content");
      const file = useGitStore.getState().files.find((f) => f.path === "/a.js");
      expect(file?.status).toBe("untracked");
    });

    it("editing a committed file marks it modified", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.echo("a.js", "new content");
      const file = useGitStore.getState().files.find((f) => f.path === "/a.js");
      expect(file?.status).toBe("modified");
    });
  });

  describe("Diff staging semantics", () => {
    it("git diff shows only unstaged changes", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.echo("a.js", "unstaged change");
      store.touch("b.js");
      store.gitAdd("b.js");
      const result = store.gitDiff();
      expect(result.message).toContain("a.js");
      expect(result.message).not.toContain("b.js");
    });

    it("git diff --staged shows only staged changes", async () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.touch("a.js");
      store.gitAdd(".");
      await store.gitCommit("First");
      store.echo("a.js", "unstaged change");
      store.touch("b.js");
      store.gitAdd("b.js");
      const result = store.gitDiff("--staged");
      expect(result.message).toContain("b.js");
      expect(result.message).not.toContain("a.js");
    });
  });

  describe("Tagging", () => {
    it("git tag should create a tag", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitTag("v1.0");
      expect(result.success).toBe(true);
      expect(useGitStore.getState().tags["v1.0"]).toBeDefined();
    });
  });

  describe("Remote operations", () => {
    it("git remote add should add a remote", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitRemote("add origin https://github.com/user/repo.git");
      expect(result.success).toBe(true);
      expect(useGitStore.getState().remotes["origin"]).toBe("https://github.com/user/repo.git");
    });

    it("git push should work with configured remote", () => {
      const store = useGitStore.getState();
      store.gitInit();
      store.gitRemote("add origin https://github.com/user/repo.git");
      const result = store.gitPush();
      expect(result.success).toBe(true);
      expect(result.message).toContain("Writing objects");
    });

    it("git push should fail without remote", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const result = store.gitPush();
      expect(result.success).toBe(false);
    });
  });

  describe("processCommand", () => {
    beforeEach(() => {
      useGitStore.getState().gitInit();
    });

    it("should process filesystem commands", async () => {
      const store = useGitStore.getState();
      const result = await store.processCommand("touch hello.txt");
      expect(result.success).toBe(true);
      expect(useGitStore.getState().files.some((f) => f.path === "/hello.txt")).toBe(true);
    });

    it("should process git commands", async () => {
      const store = useGitStore.getState();
      const result = await store.processCommand("git status");
      expect(result.success).toBe(true);
    });

    it("should reject unknown commands", async () => {
      const store = useGitStore.getState();
      const result = await store.processCommand("foobar");
      expect(result.success).toBe(false);
    });

    it("should handle help command", async () => {
      const store = useGitStore.getState();
      const result = await store.processCommand("help");
      expect(result.success).toBe(true);
    });

    it("git add . and git commit workflow", async () => {
      const store = useGitStore.getState();
      await store.processCommand("touch app.js");
      await store.processCommand('echo "console.log(1)" > app.js');
      await store.processCommand("git add .");
      await store.processCommand('git commit -m "Initial"');
      expect(useGitStore.getState().commits).toHaveLength(1);
    });
  });

  describe("Graph data", () => {
    it("getGraphData should return empty array for no commits", () => {
      const store = useGitStore.getState();
      store.gitInit();
      const graph = store.getGraphData();
      expect(graph).toHaveLength(0);
    });
  });
});
