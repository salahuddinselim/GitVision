"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitRestorePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Undoing Changes</span> <span className="mx-2">/</span> <span className="text-primary">git restore</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git restore</code></h1>
        <p className="text-xl text-gray-400 mb-8">Restore files in the working tree</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">Intermediate</span>
          <span className="text-sm text-gray-500">Modern file restoration</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git restore <file>                 # Discard working tree changes\ngit restore --staged <file>        # Unstage file\ngit restore --staged --worktree .  # Unstage all\ngit restore --source=<commit> <f>`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "echo 'content' > a.js", "git add .", "git commit -m 'Init'", "echo 'modified' > a.js", "git restore a.js", "cat a.js"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
