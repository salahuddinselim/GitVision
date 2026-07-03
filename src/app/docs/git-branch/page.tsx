"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitBranchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Branching</span> <span className="mx-2">/</span> <span className="text-primary">git branch</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git branch</code></h1>
        <p className="text-xl text-gray-400 mb-8">List, create, and delete branches</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Manage your development branches</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git branch              # List branches\ngit branch <name>       # Create branch\ngit branch -d <name>    # Delete (safe)\ngit branch -D <name>    # Force delete\ngit branch -m <old> <new>  # Rename\ngit branch -a           # List all (incl. remote)`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch a.js", "git add .", "git commit -m 'Initial'", "git branch feature", "git branch"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
