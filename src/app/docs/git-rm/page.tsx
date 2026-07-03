"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitRmPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Snapshot Commands</span> <span className="mx-2">/</span> <span className="text-primary">git rm</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git rm</code></h1>
        <p className="text-xl text-gray-400 mb-8">Remove files from the working tree and index</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Delete files from Git tracking</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git rm</code> removes files from the working directory and stages the deletion. It removes the file from both the disk and the Git index, so the deletion will be included in your next commit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git rm <file>\ngit rm --cached <file>  # Remove from tracking only\ngit rm -r <directory>   # Remove directory recursively\ngit rm --cached -r .    # Remove all from tracking`}
            showLineNumbers={false}
          />
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p><strong className="text-gray-200">Key Options:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-f</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--force</code> — Override up-to-date check</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">--cached</code> — Remove from index only (keep file on disk)</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-r</code> — Allow recursive removal</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-n</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--dry-run</code> — Show what would be removed</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">--ignore-unmatch</code> — Don’t error if files don’t exist</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Remove a file</h3>
              <CodeBlock code={'git rm app.js'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Deletes app.js from disk and stages the deletion.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Stop tracking a file but keep it on disk</h3>
              <CodeBlock code={'git rm --cached config.local.env'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Removes from Git tracking but leaves the file in your working directory. Useful for .gitignore situations.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Remove a directory recursively</h3>
              <CodeBlock code={'git rm -r temp-build/'} showLineNumbers={false} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Common Scenarios</h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Delete a file on disk and in Git</h4>
              <CodeBlock code={'# Option 1: Use git rm\ngit rm file.txt\ngit commit -m "Remove file.txt"\n\n# Option 2: Delete manually, then stage\ngit rm file.txt  # Already deleted? Use -f\ngit commit -m "Remove file.txt"'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h4 className="text-sm font-semibold text-gray-200 mb-2">Remove accidentally committed large file</h4>
              <CodeBlock code={'# Remove tracking\ngit rm --cached large-file.zip\ngit commit -m "Stop tracking large file"\n\n# Add to .gitignore\necho "large-file.zip" >> .gitignore'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">For already-pushed large files, use <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">git filter-branch</code> or BFG Repo-Cleaner.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-200">rm vs git rm</h2>
          <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-2 px-3 text-gray-400">Action</th>
                  <th className="text-left py-2 px-3 text-gray-400">rm file.txt</th>
                  <th className="text-left py-2 px-3 text-gray-400">git rm file.txt</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-3">Removes from disk</td>
                  <td className="py-2 px-3">✅</td>
                  <td className="py-2 px-3">✅</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-2 px-3">Stages deletion</td>
                  <td className="py-2 px-3">❌</td>
                  <td className="py-2 px-3">✅</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Included in next commit</td>
                  <td className="py-2 px-3">❌</td>
                  <td className="py-2 px-3">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch app.js", "git add .", "git commit -m 'Init'", "git rm --cached app.js", "git status"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
