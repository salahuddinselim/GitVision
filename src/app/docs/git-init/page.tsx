"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import { CheckCircle } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import LiveExample from "@/components/LiveExample";

export default function GitInitPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Repository Creation</span> <span className="mx-2">/</span> <span className="text-primary">git init</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article */}
          <div className="lg:col-span-2 space-y-8">
            <article>
              <h1 className="text-4xl font-bold mb-2">
                <code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git init</code>
              </h1>
              <p className="text-xl text-gray-400 mb-8">Initialize a new Git repository</p>

              {/* Difficulty & Tags */}
              <div className="flex items-center gap-4 mb-8">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
                <span className="text-sm text-gray-500">Essential command</span>
              </div>

              {/* What is it? */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-200">What is <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-400">git init</code>?</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git init</code> command creates a new Git repository in your current directory. It generates a hidden <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">.git</code> folder that contains all the metadata and object database for your project’s version history.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Think of it as setting up a control center — once initialized, Git can track every change, every version, and every branch in your project.
                </p>
              </section>

              {/* Syntax */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
                <CodeBlock
                  code={`git init [directory]`}
                  language="bash"
                  showLineNumbers={false}
                />
                <div className="mt-3 space-y-2 text-sm text-gray-400">
                  <p><strong className="text-gray-200">Parameters:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">directory</code> (optional) — Name of the directory to initialize. Creates the directory if it doesn’t exist.</li>
                  </ul>
                  <p><strong className="text-gray-200">Options:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">--bare</code> — Create a bare repository (no working directory)</li>
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">--initial-branch &lt;name&gt;</code> — Set the initial branch name (default: master/main)</li>
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">--quiet</code> — Suppress output</li>
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">--template=&lt;template-directory&gt;</code> — Specify a template directory</li>
                    <li><code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">--separate-git-dir=&lt;dir&gt;</code> — Store Git data in a different location</li>
                  </ul>
                </div>
              </section>

              {/* Examples */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>

                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Initialize in the current directory</h3>
                    <CodeBlock
                      code={'mkdir my-project\ncd my-project\ngit init'}
                      language="bash"
                    />
                    <p className="text-sm text-gray-500 mt-2">This creates a <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">.git</code> folder in <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">my-project/</code>.</p>
                  </div>

                  <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Initialize a new directory by name</h3>
                    <CodeBlock
                      code={'git init my-new-project'}
                      language="bash"
                    />
                    <p className="text-sm text-gray-500 mt-2">Git creates the directory <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">my-new-project/</code> and initializes a repository inside it.</p>
                  </div>

                  <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Initialize a bare repository (for servers)</h3>
                    <CodeBlock
                      code={'git init --bare my-server-repo.git'}
                      language="bash"
                    />
                    <p className="text-sm text-gray-500 mt-2">Bare repos have no working directory — they’re used as shared remote repositories on servers.</p>
                  </div>

                  <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Set a custom initial branch name</h3>
                    <CodeBlock
                      code={'git init --initial-branch main'}
                      language="bash"
                    />
                    <p className="text-sm text-gray-500 mt-2">Uses <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">main</code> as the default branch instead of <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs">master</code>.</p>
                  </div>
                </div>
              </section>

              {/* What Happens Under the Hood */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-200">What Happens Under the Hood?</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">When you run <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git init</code>, Git creates this directory structure:</p>
                <CodeBlock
                  code={`.git/\n├── hooks/           # Git hooks (scripts that run on events)\n├── info/            # Repository info & exclusions\n│   └── exclude\n├── objects/         # All Git objects (blobs, trees, commits)\n│   ├── info/\n│   └── pack/\n├── refs/            # References (branches, tags, HEAD)\n│   ├── heads/       # Local branch pointers\n│   ├── remotes/     # Remote branch pointers\n│   └── tags/        # Tag pointers\n├── HEAD             # Points to your current branch\n├── config           # Repository configuration\n├── description      # Repository description\n└── index            # The staging area (binary file)`}
                  showLineNumbers={false}
                />
              </section>

              {/* Configuration */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-200">Configure After Initialization</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">After <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git init</code>, it’s a good practice to configure your repository:</p>
                <CodeBlock
                  code={`# Set your identity (required to commit)\ngit config user.name "Your Name"\ngit config user.email "you@example.com"\n\n# Set the default branch name\ngit config --global init.defaultBranch main\n\n# Make the initial commit\necho "# My Project" > README.md\ngit add README.md\ngit commit -m "Initial commit"`}
                />
              </section>

              {/* Common Mistakes */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Common Mistakes & Pitfalls</h2>
                <div className="space-y-3">
                  {[
                    { mistake: "Running git init in the wrong directory", fix: "Always check your current directory with pwd before initializing" },
                    { mistake: "Forgetting to set user.name and user.email", fix: "Git requires identity to create commits. Use git config to set them" },
                    { mistake: "Initializing inside an existing repository", fix: "Git will warn you — it's safe but unnecessary" },
                    { mistake: "Using git init on an existing project without adding files", fix: "Remember to run git add to start tracking existing files" },
                    { mistake: "Deleting the .git folder to 'undo' git", fix: "This works but be careful — you lose all history and branches" },
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-red-500/50 bg-red-500/5 p-4">
                      <p className="text-sm font-semibold text-red-400 mb-1">❌ {item.mistake}</p>
                      <p className="text-sm text-gray-400">✅ {item.fix}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Best Practices */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-200">Best Practices</h2>
                <div className="space-y-3">
                  {[
                    "Always initialize a repository at the root of your project",
                    "Use .gitignore to exclude unnecessary files (node_modules, .env, build artifacts)",
                    "Make your initial commit immediately after initialization",
                    "Set up a .gitignore before your first commit to keep history clean",
                    "Consider using git init --initial-branch main for modern naming conventions",
                    "Use --bare for shared repositories on servers",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Related Commands */}
              <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Related Commands</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { cmd: "git clone", desc: "Clone an existing remote repository" },
                    { cmd: "git config", desc: "Configure Git settings" },
                    { cmd: "git add", desc: "Start tracking files" },
                    { cmd: "git status", desc: "Check repository state" },
                    { cmd: "git commit", desc: "Save your changes" },
                    { cmd: "git remote", desc: "Manage remote connections" },
                  ].map((rel) => (
                    <a key={rel.cmd} href={`/commands#${rel.cmd.replace("git ", "")}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <code className="bg-gray-700 px-2 py-1 rounded font-mono text-xs">{rel.cmd}</code>
                      <span className="text-gray-400">{rel.desc}</span>
                    </a>
                  ))}
                </div>
              </section>
            </article>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-200 mb-4">Quick Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Category</span>
                  <span className="text-gray-200">Repository Creation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Difficulty</span>
                  <span className="text-green-400">Beginner</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Frequency</span>
                  <span className="text-yellow-400">Used daily</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">First commit</span>
                  <span className="text-blue-400">Required</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6">
              <h3 className="font-semibold text-gray-200 mb-3">Command Syntax</h3>
              <div className="bg-[#0d1117] rounded-lg p-3 font-mono text-sm">
                <div className="text-gray-500 text-xs mb-1">SYNTAX</div>
                <div className="text-green-400">git init [options] [directory]</div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6">
              <h3 className="font-semibold text-gray-200 mb-3">Try in Playground</h3>
              <p className="text-sm text-gray-400 mb-3">Open the interactive playground to practice this command.</p>
              <a href="/playground" className="inline-block w-full text-center py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                Open Playground →
              </a>
            </div>

            <div className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-700/50 bg-surface/50">
                <h3 className="font-semibold text-gray-200 text-sm">Live Demo</h3>
              </div>
              <LiveExample
                commands={[
                  "mkdir my-project",
                  "cd my-project",
                  "git init",
                  "echo \"# My Project\" > README.md",
                  "git add README.md",
                  "git commit -m \"Initial commit\"",
                  "git log",
                ]}
                height={320}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}