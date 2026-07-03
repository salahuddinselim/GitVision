"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitHelpPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Setup & Config</span> <span className="mx-2">/</span> <span className="text-primary">git help</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git help</code></h1>
        <p className="text-xl text-gray-400 mb-8">Get help on Git commands and concepts</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Built-in documentation at your fingertips</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git help</code> provides access to Git’s built-in documentation. It can display manual pages for any Git command, list all available commands, or show concept guides.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git help <command>        # Help for a specific command\ngit help --all            # List all available help topics\ngit help <concept>        # Help on a concept\ngit help -g <pattern>     # Search help topics\ngit <command> --help      # Same as git help <command>`}
            showLineNumbers={false}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Get help for a specific command</h3>
              <CodeBlock code={'git help commit'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">List all available commands</h3>
              <CodeBlock code={'git help --all'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Quick help via --help flag</h3>
              <CodeBlock code={'git log --help'} showLineNumbers={false} />
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "git help", "git help status"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
