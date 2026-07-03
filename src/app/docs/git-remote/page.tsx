"use client";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import { CheckCircle } from "lucide-react";
import LiveExample from "@/components/LiveExample";

export default function GitRemotePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-sm text-gray-500 mb-4">
          <a href="/docs" className="hover:text-primary transition-colors">Docs</a> <span className="mx-2">/</span> <span className="text-gray-300">Remote Repositories</span> <span className="mx-2">/</span> <span className="text-primary">git remote</span>
        </div>
        <h1 className="text-4xl font-bold mb-2"><code className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-2xl">git remote</code></h1>
        <p className="text-xl text-gray-400 mb-8">Manage remote repository connections</p>
        <div className="flex items-center gap-4 mb-8">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">Beginner</span>
          <span className="text-sm text-gray-500">Connect to GitHub, GitLab, Bitbucket</span>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">What Are Remotes?</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Remotes are references to other copies of your repository, typically on a server like GitHub, GitLab, or Bitbucket. They enable collaboration by allowing you to share and synchronize your work.
          </p>
          <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs text-center mb-4">
            <div className="text-gray-500 mb-2">Remote Repository Architecture:</div>
            <pre className="text-gray-300">
  Local:      your-machine:~/project/.git
                  ↕ (push/pull/fetch)
  Remote:     github.com:user/project.git</pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Syntax</h2>
          <CodeBlock
            code={`git remote                           # List remotes\ngit remote -v                        # List with URLs\ngit remote add <name> <url>          # Add remote\ngit remote remove <name>             # Remove remote\ngit remote rename <old> <new>        # Rename remote\ngit remote show <name>               # Show remote details\ngit remote set-url <name> <newurl>   # Change URL`}
            showLineNumbers={false}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Examples</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Add the default “origin” remote</h3>
              <CodeBlock code={'git remote add origin https://github.com/user/repo.git'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">View remote details</h3>
              <CodeBlock code={'git remote show origin'} showLineNumbers={false} />
              <pre className="text-sm text-gray-500 mt-2">
{`* remote origin\n  Fetch URL: https://github.com/user/repo.git\n  Push  URL: https://github.com/user/repo.git\n  HEAD branch: main\n  Remote branches:\n    main tracked\n    dev  tracked\n  Local branches configured for 'git pull':\n    main merges with remote main\n  Local refs configured for 'git push':\n    main pushes to main (up to date)`}
              </pre>
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">List all remotes with URLs</h3>
              <CodeBlock code={'git remote -v'} showLineNumbers={false} />
            </div>
            <div className="rounded-lg border border-gray-700/50 bg-surface/50 p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Change remote URL</h3>
              <CodeBlock code={'git remote set-url origin git@github.com:user/repo.git'} showLineNumbers={false} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Fetch vs Pull</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">git fetch</h4>
              <p className="text-sm text-gray-400">Downloads remote changes but doesn’t merge them. Safer — lets you review before integrating.</p>
              <p className="text-xs text-gray-500 mt-2">→ Updates remote tracking branches only</p>
            </div>
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">git pull</h4>
              <p className="text-sm text-gray-400">Fetches AND merges remote changes into your current branch. Convenient but can cause surprise merges.</p>
              <p className="text-xs text-gray-500 mt-2">→ Equivalent to: git fetch + git merge</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Common Mistakes</h2>
          <div className="space-y-3">
            {[
              { mistake: "Adding wrong remote URL", fix: "Verify with git remote -v before pushing" },
              { mistake: "Not understanding fetch vs pull", fix: "Use fetch + merge for more control" },
              { mistake: "Pushing to wrong remote", fix: "Double-check with git remote -v" },
              { mistake: "Forgetting to add origin after clone", fix: "git clone adds origin automatically" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border-l-4 border-red-500/50 bg-red-500/5 p-4">
                <p className="text-sm font-semibold text-red-400 mb-1">❌ {item.mistake}</p>
                <p className="text-sm text-gray-400">✅ {item.fix}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3 text-gray-200">Best Practices</h2>
          <div className="space-y-3">
            {["Use 'origin' as the default name for the primary remote", "Use git fetch + review before merging", "Keep remote URLs updated when repos move", "Use SSH URLs for frequent interaction, HTTPS for simplicity"].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Live Example</h2>
          <LiveExample
            commands={["git init", "touch a.js", "git add .", "git commit -m 'Init'", "git remote add origin https://github.com/user/repo.git", "git remote -v"]}
            height={280}
          />
        </section>
      </motion.div>
    </div>
  );
}
