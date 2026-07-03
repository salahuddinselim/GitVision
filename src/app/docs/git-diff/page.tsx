"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitDiffPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Snapshot Commands</span> <span className="mx-2">/</span> <span className="text-primary">git diff</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git diff</code></h1>
        <p className="text-xl text-gray-400 mb-8">View changes between commits and the working tree</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">What changed?</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git diff</code> shows the difference between Git states — your working directory versus the index, the index versus HEAD, or any two commits.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git diff\ngit diff --staged\ngit diff HEAD\ngit diff <commit1>..<commit2>\ngit diff -- <file>`}
            showLineNumbers={false}
          />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Reading the Output</h2>
          <CodeBlock
            code={`-removed line\n+added line\n@@ -1,3 +1,4 @@\n context line`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "echo 'hello' > app.js", "git add .", "git commit -m 'Init'", "echo 'world' > app.js", "git diff"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
