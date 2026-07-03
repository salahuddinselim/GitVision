"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitMvPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Snapshot Commands</span> <span className="mx-2">/</span> <span className="text-primary">git mv</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git mv</code></h1>
        <p className="text-xl text-gray-400 mb-8">Move or rename a file, directory, or symlink</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Rename and move tracked files</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git mv</code> moves or renames a file while preserving its history. It’s equivalent to running a regular file move followed by <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git add</code> and <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git rm</code> on the old path.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Git is smart enough to detect renames even without <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git mv</code>, but using it keeps your history cleaner.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git mv <source> <destination>\ngit mv old-name.js new-name.js\ngit mv file.js src/new-location/\ngit mv -f existing-file.js src/  # Force overwrite`}
            showLineNumbers={false}
          />
          <div className="mt-3 space-y-2 text-sm text-gray-400">
            <p><strong className="text-gray-200">Key Options:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-f</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--force</code> — Force move even if destination exists</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-k</code> — Skip move if it would overwrite an existing file</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-n</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--dry-run</code> — Show what would happen without doing it</li>
              <li><code className="bg-gray-700 px-1.5 py-0.5 rounded">-v</code> / <code className="bg-gray-700 px-1.5 py-0.5 rounded">--verbose</code> — Report what is being done</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Rename a file</h3>
              <CodeBlock code={'git mv old-name.js new-name.js'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Renames the file and stages both the deletion and the new file.</p>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Move a file to a directory</h3>
              <CodeBlock code={'git mv app.js src/components/app.js'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Move an entire directory</h3>
              <CodeBlock code={'git mv old-dir/ new-dir/'} showLineNumbers={false} />
              <p className="text-sm text-gray-500 mt-2">Moves all files in the directory while preserving their history.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">git mv vs Manual Move</h2>
          <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-400 mb-1">Using git mv</h4>
                <pre className="bg-[#0d1117] rounded p-2 mt-1 text-xs"><span className="text-green-400">git mv old.js new.js</span></pre>
                <p className="text-gray-500 text-xs mt-1">Git handles everything in one step.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Manual move</h4>
                <pre className="bg-[#0d1117] rounded p-2 mt-1 text-xs"><span className="text-yellow-400">mv old.js new.js</span>
<span className="text-gray-500">git rm old.js</span>
<span className="text-gray-500">git add new.js</span></pre>
                <p className="text-gray-500 text-xs mt-1">Three separate commands needed.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch old-name.js", "git add .", "git commit -m 'Add file'", "git mv old-name.js new-name.js", "git status"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
