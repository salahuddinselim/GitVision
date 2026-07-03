"use client";

import { motion } from "framer-motion";
import {
  GitCommit,
  GitBranch,
  Network as Tree,
  Hash,
  Database,
  Package,
  Lock,
} from "lucide-react";

export default function InternalsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Git{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Internals
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Understand how Git works under the hood — from objects to packfiles
            to the reflog.
          </p>
        </div>

        {/* Object Model */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Git Object Model
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {/* Blob */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-xl border border-gray-700/50 bg-gray-900/30 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-4">
                  <Package className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-blue-400">Blob</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Binary Large Object
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  A blob stores the raw content of a single file. It contains no
                  metadata — just the file’s data. Every version of every file
                  is stored as a separate blob.
                </p>
                <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-500 mb-2">Structure:</div>
                  <div className="text-cyan-300">
                    {'header: "blob {size}\\0'}
                  </div>
                  <div className="text-green-300">
                    {`content: "${Array.from({ length: 32 }, () => "x").join("")}"`}
                  </div>
                  <div className="text-gray-400 mt-2">
                    hash: sha1(header + content)
                  </div>
                </div>
              </div>
            </div>

            {/* Tree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-xl border border-gray-700/50 bg-gray-900/30 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-4">
                  <Tree className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400">Tree</h3>
                <p className="text-sm text-gray-500 mt-1">Directory Listing</p>
              </div>
              <div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  A tree object represents a directory. It contains pointers to
                  blobs (files) and other trees (subdirectories), along with
                  their names and modes.
                </p>
                <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-500 mb-2">Structure:</div>
                  <div className="text-green-300">
                    100644 blob a1b2c3d...&nbsp;&nbsp;app.js
                  </div>
                  <div className="text-green-300">
                    040000 tree d4e5f6a...&nbsp;&nbsp;src/
                  </div>
                  <div className="text-green-300">
                    100644 blob b7c8d9e...&nbsp;&nbsp;README.md
                  </div>
                  <div className="text-gray-400 mt-2">
                    hash: sha1(header + sorted entries)
                  </div>
                </div>
              </div>
            </div>

            {/* Commit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-xl border border-gray-700/50 bg-gray-900/30 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center mb-4">
                  <GitCommit className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-purple-400">Commit</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Snapshot + Metadata
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  A commit object stores a pointer to the top-level tree,
                  author/committer info, a message, and pointers to parent
                  commits (forming the DAG).
                </p>
                <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-500 mb-2">Structure:</div>
                  <div className="text-purple-300">
                    tree d4e5f6a...{Array(44).fill(" ").join("")}subtree hash
                  </div>
                  <div className="text-purple-300">
                    parent a1b2c3d...{Array(44).fill(" ").join("")}previous
                    commit
                  </div>
                  <div className="text-purple-300">
                    author User {"<user@email.com>"} 1715000000 +0000
                  </div>
                  <div className="text-purple-300">
                    committer User {"<user@email.com>"} 1715000000 +0000
                  </div>
                  <div className="text-purple-300 mt-1">
                    {Array(40).fill(" ").join("")}initial commit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SHA Explanation */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Hash className="text-cyan-400" />
            SHA-1 Hashes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs space-y-3">
              <div className="text-gray-500">SHA-1 Hash Calculation:</div>
              <div className="text-cyan-300">{`header = "blob 123\\0"`}</div>
              <div className="text-green-300">
                {`content = "file content here"`}
              </div>
              <div className="text-yellow-300">
                store.write(compress(header + content))
              </div>
              <div className="text-gray-400">=</div>
              <div className="text-purple-400 font-bold">
                a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Every Git object is identified by a SHA-1 hash of its contents.
                This makes Git:
              </p>
              <div className="space-y-3">
                {[
                  "Content-addressable — same content = same hash",
                  "Tamper-evident — any change produces a completely different hash",
                  "Deduplicated — identical files share the same blob",
                  "Distributed — no central authority needed for verification",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 text-cyan-400 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Packfiles */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock className="text-green-400" />
            Packfiles
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            To save space and improve performance, Git periodically compresses
            objects into “packfiles.” Instead of storing each object
            individually, Git uses delta compression to store only the
            differences between similar objects.
          </p>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="font-mono text-xs space-y-2">
              <div className="text-gray-500">
                Git automatically runs garbage collection:
              </div>
              <div className="text-green-400">$ git gc</div>
              <div className="text-gray-500 mt-4">
                This compresses loose objects into packfiles:
              </div>
              <div className="text-gray-400">.git/objects/</div>
              <div className="text-green-300"> pack/</div>
              <div className="text-green-300">
                {" "}
                pack-a1b2c3d.pack ← compressed objects
              </div>
              <div className="text-green-300">
                {" "}
                pack-a1b2c3d.idx ← index for fast lookup
              </div>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Database className="text-orange-400" />
            References (Refs)
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "HEAD",
                desc: "Points to the current commit or branch you're on",
                dotClassName: "bg-blue-500",
              },
              {
                name: "Branches",
                desc: "Pointers to commits that move forward with new commits",
                dotClassName: "bg-green-500",
              },
              {
                name: "Tags",
                desc: "Fixed references to specific commits (usually for releases)",
                dotClassName: "bg-primary",
              },
              {
                name: "Remote Refs",
                desc: "Local copies of remote branch states (refs/remotes/)",
                dotClassName: "bg-orange-500",
              },
            ].map((ref, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${ref.dotClassName}`} />
                  <code className="font-mono text-sm text-gray-200">
                    {ref.name}
                  </code>
                </div>
                <p className="text-sm text-gray-500 ml-6 mt-1">{ref.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Chain Visualization */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Complete Object Chain
          </h2>
          <div className="overflow-x-auto">
            <pre className="font-mono text-xs text-gray-400 whitespace-nowrap p-4 bg-[#0d1117] rounded-lg">
              {`Working Directory → git add → Index/Stage → git commit → Object Store
                                                    │
                    ┌───────────────────────────────┐│┌───────────────────────────────┐
                    │  .git/objects/                │││  .git/refs/                    │
                    │  ├── a1/b2c3d4... (blob)       │││  ├── heads/                     │
                    │  ├── e5/f6g7h8... (blob)       │││  │   └── main → a1b2c3d         │
                    │  ├── i9/j0k1l2... (tree)       │││  ├── tags/                      │
                    │  └── m3/n4o5p6... (commit)     │││  │   └── v1.0 → a1b2c3d         │
                    │                                │││  └── HEAD → refs/heads/main     │
                    │  Loose objects  │  Packfiles    ││└───────────────────────────────┘
                    │  ├── blob       │  ├── pack-*.pack  │
                    │  ├── tree       │  └── pack-*.idx   │
                    │  └── commit     │                   │
                    └─────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
