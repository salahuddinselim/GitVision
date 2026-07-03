"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitShowPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Inspection</span> <span className="mx-2">/</span> <span className="text-primary">git show</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git show</code></h1>
        <p className="text-xl text-gray-400 mb-8">Show information about a Git object</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">Intermediate</span>
          <span className="text-sm text-gray-500">Inspect any Git object</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git show <commit>            # Show commit details\ngit show --stat <commit>      # Summary only\ngit show <tag>                # Show tag\ngit show <commit>:<file>      # File at commit`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch app.js", "git add .", "git commit -m 'Initial commit'", "git show HEAD"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
