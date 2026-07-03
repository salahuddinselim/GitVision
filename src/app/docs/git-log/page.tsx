"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitLogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Inspection</span> <span className="mx-2">/</span> <span className="text-primary">git log</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git log</code></h1>
        <p className="text-xl text-gray-400 mb-8">Display commit history</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Browse your project history</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git log --oneline\ngit log --graph --all --decorate\ngit log -n 5\ngit log --author="Name"\ngit log --since="1 week ago"`}
            showLineNumbers={false}
          />
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Common Aliases</h2>
          <CodeBlock
            code={`git log --oneline --graph --all --decorate  # Visual graph\ngit log -5 --stat                                    # Last 5 with files\ngit log --pretty=format:"%h %an: %s"                  # Custom format`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch a.js", "git add .", "git commit -m 'First commit'", "echo 'v2' > a.js", "git add .", "git commit -m 'Second commit'", "git log"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
