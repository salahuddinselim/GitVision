"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitConfigPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Setup & Config</span> <span className="mx-2">/</span> <span className="text-primary">git config</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git config</code></h1>
        <p className="text-xl text-gray-400 mb-8">Configure Git settings</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Personalize your Git experience</span>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Essential Configs</h2>
          <CodeBlock
            code={`git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\ngit config --global init.defaultBranch main\ngit config --global core.editor "code --wait"\n\n# Useful aliases\ngit config --global alias.st status\ngit config --global alias.lg "log --oneline --graph"`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "git config user.name 'Test User'", "git config --list"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
