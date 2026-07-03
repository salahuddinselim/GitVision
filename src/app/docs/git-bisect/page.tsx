"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitBisectPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Advanced</span> <span className="mx-2">/</span> <span className="text-primary">git bisect</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git bisect</code></h1>
        <p className="text-xl text-gray-400 mb-8">Binary search for bugs</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">Advanced</span>
          <span className="text-sm text-gray-500">Find the commit that introduced a bug</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <CodeBlock
            code={`git bisect start\ngit bisect bad              # Current is bad\ngit bisect good <commit>    # This works\ngit bisect reset            # Exit\ngit bisect log              # Show log\ngit bisect run <script>     # Automated`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch app.js", "git add .", "git commit -m 'Initial'", "git bisect start", "git bisect reset"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
