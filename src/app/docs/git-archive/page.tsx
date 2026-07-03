"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitArchivePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Advanced</span> <span className="mx-2">/</span> <span className="text-primary">git archive</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git archive</code></h1>
        <p className="text-xl text-gray-400 mb-8">Create an archive of files from a named tree</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">Advanced</span>
          <span className="text-sm text-gray-500">Export your project as a tarball or zip</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git archive</code> creates a tar, zip, or other archive of files from a Git tree. Unlike regular archives, it only includes tracked files and respects .gitattributes export-ignore directives.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git archive <tree-ish> [path]\ngit archive --format=tar HEAD > project.tar\ngit archive --format=zip HEAD -o project.zip\ngit archive --format=tar --prefix=dir/ HEAD | gzip > project.tar.gz`}
            showLineNumbers={false}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Create a tar archive of HEAD</h3>
              <CodeBlock code={'git archive --format=tar HEAD > project.tar'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Create a gzipped tarball</h3>
              <CodeBlock code={'git archive --format=tar HEAD | gzip > project.tar.gz'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Create a zip archive with prefix</h3>
              <CodeBlock code={'git archive --format=zip --prefix=project-1.0/ HEAD -o project-1.0.zip'} showLineNumbers={false} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Key Options</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <div><code className="bg-gray-700 px-1.5 py-0.5 rounded">--format=&lt;fmt&gt;</code> — Archive format: tar, zip, tar.gz</div>
            <div><code className="bg-gray-700 px-1.5 py-0.5 rounded">--prefix=&lt;dir&gt;</code> — Prepend prefix to each filename</div>
            <div><code className="bg-gray-700 px-1.5 py-0.5 rounded">-o &lt;file&gt;</code> — Write to file instead of stdout</div>
            <div><code className="bg-gray-700 px-1.5 py-0.5 rounded">--add-file &lt;name&gt;</code> — Include untracked file</div>
            <div><code className="bg-gray-700 px-1.5 py-0.5 rounded">--remote=&lt;repo&gt;</code> — Archive from remote without checking out</div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch app.js", "git add .", "git commit -m 'Initial'", "git log"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
