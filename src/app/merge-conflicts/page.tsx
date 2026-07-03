"use client";

import { motion } from "framer-motion";
import { AlertTriangle, GitBranch, GitPullRequest, Code2, CheckCircle, XCircle } from "lucide-react";

export default function MergeConflictsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Interactive Lab
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Merge Conflict <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Resolver</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn to identify, understand, and resolve merge conflicts through interactive visualization.
          </p>
        </div>

        {/* How Conflicts Happen */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">What Causes Merge Conflicts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                A merge conflict occurs when Git can’t automatically reconcile changes from two different branches. This typically happens when:
              </p>
              <div className="space-y-3">
                {[
                  "Two branches modify the same line in a file",
                  "One branch deletes a file that the other modifies",
                  "Both branches add a file with the same name",
                  "Edit conflicts in binary files",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-4">
              <div className="text-gray-500 text-xs">CONFLICT (content): Merge conflict in app.js</div>
              <div className="border border-red-500/30 rounded p-3">
                <div className="text-blue-400 text-xs mb-1">{"// Auto-merged content"}</div>
                <div className="text-red-400">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</div>
                <div className="text-gray-300">{`const message = "Hello from main";`}</div>
                <div className="text-gray-400">=======</div>
                <div className="text-green-400">{`const message = "Hello from feature";`}</div>
                <div className="text-red-400">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch</div>
              </div>
              <div className="text-yellow-400 text-xs">⚠ Manual resolution required</div>
            </div>
          </div>
        </div>

        {/* Interactive Resolution */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Interactive Conflict Resolution</h2>
          <p className="text-gray-400 mb-6">
            Below is a simulated merge conflict. Choose how to resolve it:
          </p>

          {/* Conflict Scenario */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">
              <div className="bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-400 flex items-center gap-2 border-b border-yellow-500/20">
                <GitBranch className="w-4 h-4" />
                Current Branch (main) — HEAD
              </div>
              <pre className="p-4 font-mono text-sm text-gray-300 bg-[#0d1117]">
{`function greet() {
  return "Hello from main";
}

function farewell() {
  return "Goodbye";
}`}
              </pre>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 overflow-hidden">
              <div className="bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-400 flex items-center gap-2 border-b border-blue-500/20">
                <GitPullRequest className="w-4 h-4" />
                Incoming Branch (feature)
              </div>
              <pre className="p-4 font-mono text-sm text-gray-300 bg-[#0d1117]">
{`function greet() {
  return "Hello from feature";
}

function party() {
  return "Let's celebrate";
}`}
              </pre>
            </div>
          </div>

          {/* Merge Result */}
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 overflow-hidden">
            <div className="bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 flex items-center gap-2 border-b border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
              Merge Conflict — Resolution Required
            </div>
            <pre className="p-4 font-mono text-sm bg-[#0d1117] overflow-x-auto">
              <span className="text-gray-500">{`<<<<<<< HEAD\n`}</span>
              <span className="text-red-400">{`  return "Hello from main";\n`}</span>
              <span className="text-gray-500">{`=======\n`}</span>
              <span className="text-blue-400">{`  return "Hello from feature";\n`}</span>
              <span className="text-gray-500">{`>>>>>>> feature\n`}</span>
            </pre>
          </div>

          {/* Resolution Options */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Choose a resolution strategy:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { strategy: "Accept Current", desc: "Keep the main branch version", color: "yellow", code: 'return "Hello from main";' },
                { strategy: "Accept Incoming", desc: "Use the feature branch version", color: "blue", code: 'return "Hello from feature";' },
                { strategy: "Combine Both", desc: "Merge both changes manually", color: "green", code: 'return "Hello from both";' },
              ].map((opt) => (
                <button
                  key={opt.strategy}
                  className={`rounded-lg border p-4 text-left transition-all hover:border-${opt.color}-500/50 hover:bg-${opt.color}-500/5`}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: `var(--${opt.color}-400, #facc15)` }}>
                    {opt.strategy}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{opt.desc}</div>
                  <code className="text-[11px] bg-gray-700/50 px-2 py-1 rounded text-gray-300 font-mono">
                    {opt.code}
                  </code>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Steps */}
          <div className="mt-8 rounded-lg border border-gray-700/50 bg-surface/50 p-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">Resolution Steps</h3>
            <ol className="space-y-3 text-sm text-gray-400">
              {[
                "1. Open the conflicted file in your editor",
                "2. Locate the conflict markers: <<<<<<<, =======, >>>>>>>",
                "3. Review both versions of the conflicting code",
                "4. Edit the file to keep the desired content",
                "5. Remove all conflict markers",
                "6. Run <code className=\"bg-gray-700 px-1.5 py-0.5 rounded font-mono text-xs\">git add</code> to mark as resolved",
                "7. Run <code className=\"bg-gray-700 px-1.5 py-0.5 rounded font-mono text-xs\">git commit</code> to complete the merge",
              ].map((step) => (
                <li key={step} className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: step }} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Terminal Simulation */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 overflow-hidden mb-12">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/50">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-[11px] text-gray-500 font-mono ml-2">merge-conflict-simulation</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-2 bg-[#0d1117] min-h-[200px] overflow-y-auto">
            <div className="flex gap-2">
              <span className="text-green-400">user@GitVision</span>
              <span className="text-gray-600">~/project (main)</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-300">git merge feature</span>
            </div>
            <div className="text-red-400 text-xs pl-10">
              Auto-merging app.js<br />
              CONFLICT (content): Merge conflict in app.js<br />
              Automatic merge failed; fix conflicts and then commit the result.
            </div>
            <div className="flex gap-2">
              <span className="text-yellow-400">!</span>
              <span className="text-gray-600">~/project (main)</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-300">git status</span>
            </div>
            <div className="text-gray-400 text-xs pl-10">
              Unmerged paths:<br />
              &nbsp;&nbsp;both modified:   app.js
            </div>
            <div className="flex gap-2">
              <span className="text-green-400">user@GitVision</span>
              <span className="text-gray-600">~/project (main)</span>
              <span className="text-gray-500">$</span>
              <span className="text-blue-300 cursor-pointer hover:underline" onClick={() => {}}>▸ Resolve conflict in editor</span>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8">
          <h2 className="text-2xl font-bold mb-6">Common Mistakes to Avoid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { mistake: "Committing without resolving conflicts", fix: "Always resolve all conflict markers before committing" },
              { mistake: "Force pushing over shared branches", fix: "Use --force-with-lease instead of --force" },
              { mistake: "Ignoring .gitattributes for binary files", fix: "Set up merge drivers for binary files" },
              { mistake: "Merging into feature branches", fix: "Prefer rebasing feature branches onto main" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-red-500/10 bg-red-500/5 p-4">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-400">{item.mistake}</p>
                    <p className="text-xs text-gray-500 mt-1">✅ {item.fix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}