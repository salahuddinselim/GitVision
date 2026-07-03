"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitWorktreePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Advanced</span> <span className="mx-2">/</span> <span className="text-primary">git worktree</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git worktree</code></h1>
        <p className="text-xl text-gray-400 mb-8">Work on multiple branches simultaneously</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">Advanced</span>
          <span className="text-sm text-gray-500">Multiple working directories</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git worktree add <path> <branch>   # Add worktree\ngit worktree list                 # List all worktrees\ngit worktree remove <path>        # Remove worktree\ngit worktree move <path> <new>`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch a.js", "git add .", "git commit -m 'Init'", "git worktree add ../new-branch feature", "git worktree list"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
