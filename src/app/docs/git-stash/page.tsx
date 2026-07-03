"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import { CheckCircle } from "lucide-react";
import LiveExample from "@/components/LiveExample";

export default function GitStashPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Stashing</span> <span className="mx-2">/</span> <span className="text-primary">git stash</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git stash</code></h1>
        <p className="text-xl text-gray-400 mb-8">Temporarily store uncommitted changes</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">Intermediate</span>
          <span className="text-sm text-gray-500">The “undo” button for your work-in-progress</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What is Stashing?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git stash</code> temporarily shelves (or “stashes”) changes you’re not ready to commit. It saves your modified and staged files away, leaving you with a clean working directory.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Imagine you’re in the middle of work on a feature, but an urgent bug is reported. You can stash your current changes, switch to a hotfix branch, fix the bug, and then come back and restore your stashed work exactly where you left it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git stash                          # Stash all changes\ngit stash push -m "message"         # Stash with message\ngit stash list                      # List all stashes\ngit stash apply                     # Apply latest stash\ngit stash pop                       # Apply and remove latest stash\ngit stash drop                      # Remove latest stash\ngit stash show                      # Show latest stash diff\ngit stash branch <name>             # Create branch from stash`}
            showLineNumbers={false}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Stash current work</h3>
              <CodeBlock code={'git stash'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Saves modified and staged files internally and returns to a clean state.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Restore your stashed work</h3>
              <CodeBlock code={'git stash pop'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Applies the most recent stash and removes it from the stash list.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">List all stashes</h3>
              <CodeBlock code={'git stash list'} showLineNumbers={false} />
              <pre className="text-sm text-gray-500 mt-2">stash@{0}: WIP on main: a1b2c3d Commit message\nstash@{1}: WIP on feature: e4f5g6h Another commit</pre>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Stash with descriptive message</h3>
              <CodeBlock code={'git stash push -m "WIP: login form styling"'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Create a branch from a stash</h3>
              <CodeBlock code={'git stash branch fix-branch stash@{0}'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Creates a new branch from the stash and applies it there.</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Common Mistakes</h2>
          <div className="space-y-3">
            {[
              { mistake: "Forgetting about stashed changes", fix: "Use git stash list regularly to keep track of stashes" },
              { mistake: "Applying stash with conflicts and not resolving them", fix: "After apply, check for conflicts and resolve them" },
              { mistake: "Using stash as long-term storage", fix: "Stashes are meant to be temporary — commit and push when ready" },
              { mistake: "Stashing untracked files (they're not included by default)", fix: "Use git stash -u to include untracked files" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border-l-4 border-red-500/50 bg-red-500/5 p-4">
                <p className="text-sm font-semibold text-red-400 mb-1">❌ {item.mistake}</p>
                <p className="text-sm text-gray-400">✅ {item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Stash Workflow</h2>
          <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6">
            <pre className="font-mono text-xs text-gray-400 whitespace-nowrap overflow-x-auto">
{`1. Working on feature...
   git add .
   git stash  ← save progress

2. Switch to hotfix branch
   git checkout -b hotfix

3. Fix the bug & commit
   git commit -m "Fix critical bug"

4. Return to your feature
   git checkout feature
   git stash pop  ← restore progress

5. Continue working!`}
            </pre>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch app.js", "git add .", "git commit -m 'Init'", "echo 'work in progress' > app.js", "git stash", "git stash list"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
