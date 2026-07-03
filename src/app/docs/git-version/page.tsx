"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import LiveExample from "@/components/LiveExample";

export default function GitVersionPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Setup & Config</span> <span className="mx-2">/</span> <span className="text-primary">git version</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git version</code></h1>
        <p className="text-xl text-gray-400 mb-8">Display Git version information</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Check your Git installation</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Does It Do?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git version</code> displays the version of Git installed on your system, along with build information and copyright details.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Useful for troubleshooting, reporting bugs, and verifying you have the required version for specific features.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git version\ngit version --build-options\ngit --version`}
            showLineNumbers={false}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Example Output</h2>
          <CodeBlock
            code={`$ git version
  git version 2.44.0

$ git version --build-options
  git version: 2.44.0
  cpu: x86_64
  no commit associated with this build
  sizeof-long: 8
  sizeof-size_t: 8
  shell-path: /bin/sh`}
            showLineNumbers={false}
          />
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "git version"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
