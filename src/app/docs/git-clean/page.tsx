"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitCleanPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Advanced</span> <span className="mx-2">/</span> <span className="text-primary">git clean</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git clean</code></h1>
        <p className="text-xl text-gray-400 mb-8">Remove untracked files from the working directory</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">Advanced</span>
          <span className="text-sm text-gray-500">Clean up your working directory</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git clean</code> removes untracked files from your working directory. This is the counterpart to <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git reset</code>, which handles tracked files.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Use it to clean up build artifacts, temporary files, or other untracked content that clutters your working directory.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git clean -n              # Dry run (show what would be deleted)\ngit clean -f              # Remove untracked files\ngit clean -fd             # Remove untracked files and directories\ngit clean -fX             # Remove only ignored files\ngit clean -x              # Remove untracked and ignored files`}
            showLineNumbers={false}
          />
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p><strong className="text-gray-200">Key Options:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-n</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--dry-run</code> — Show what would be removed without actually removing</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-f</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--force</code> — Required (safety flag)</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-d</code> — Remove untracked directories too</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-x</code> — Remove ignored files (respecting .gitignore)</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-X</code> — Remove only ignored files</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-i</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--interactive</code> — Interactive mode</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Dry run — see what would be removed</h3>
              <CodeBlock code={'git clean -n'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Always run this first! Shows files that would be deleted.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Remove untracked files and directories</h3>
              <CodeBlock code={'git clean -fd'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Removes untracked files AND directories (like build/ or dist/).</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Remove both tracked and untracked build artifacts</h3>
              <CodeBlock code={'git clean -fdx'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">The -x flag also removes files matched by .gitignore (like node_modules/ build outputs).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">⚠️ Safety Warning</h2>
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git clean -f</code> permanently deletes files. They cannot be recovered through Git!
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Always run <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git clean -n</code> first to preview what will be deleted.
            </p>
            <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs">
              <div className="text-gray-500 mb-1">Safe workflow:</div>
              <div className="text-gray-300">git clean -n  ← Preview</div>
              <div className="text-gray-300">git clean -f  ← Delete (after verifying)</div>
              <div className="text-gray-300">git clean -fd ← Also remove directories</div>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch tracked.js", "git add .", "git commit -m 'Init'", "touch untracked.js", "git clean -n"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
