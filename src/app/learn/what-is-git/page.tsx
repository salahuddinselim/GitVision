"use client";
import { motion } from "framer-motion";

export default function LearnWhatIsGitPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-6">What is Git?</h1>
      <p className="text-gray-400 text-lg mb-8 leading-relaxed">
        Git is a <strong className="text-gray-200">distributed version control system</strong> designed to handle everything from small to very large projects with speed and efficiency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">Created by Linus Torvalds</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Git was created in 2005 by Linus Torvalds, the creator of Linux. It was designed to be fast, scalable, and distributed from the ground up.
          </p>
        </div>
        <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-200">Used by Millions</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Git is the most widely used version control system in the world, powering projects like Linux, Android, Chromium, and millions more.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-200">Key Features</h2>
      <div className="space-y-4 mb-8">
        {[
          "Distributed — Every developer has a complete copy of the repository",
          "Fast — Most operations are performed locally, making them extremely fast",
          "Data Integrity — Git uses SHA-1 hashes to ensure data hasn't been corrupted",
          "Branching & Merging — Create and merge branches in seconds",
          "Staging Area — Fine-grained control over what goes into each commit",
          "Free & Open Source — Git is released under the GPL v2 license",
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
            </div>
            <span className="text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-700/50 bg-surface/50 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-200">Git vs Other Version Control Systems</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                <th className="text-center py-3 px-4 text-gray-400">Git</th>
                <th className="text-center py-3 px-4 text-gray-400">SVN</th>
                <th className="text-center py-3 px-4 text-gray-400">Mercurial</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4">Architecture</td>
                <td className="text-center py-3 px-4 text-green-400">Distributed</td>
                <td className="text-center py-3 px-4 text-red-400">Centralized</td>
                <td className="text-center py-3 px-4 text-green-400">Distributed</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4">Branching</td>
                <td className="text-center py-3 px-4 text-green-400">Lightweight</td>
                <td className="text-center py-3 px-4 text-red-400">Heavyweight</td>
                <td className="text-center py-3 px-4 text-yellow-400">Medium</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4">Offline Work</td>
                <td className="text-center py-3 px-4 text-green-400">Full</td>
                <td className="text-center py-3 px-4 text-red-400">Limited</td>
                <td className="text-center py-3 px-4 text-green-400">Full</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Speed</td>
                <td className="text-center py-3 px-4 text-green-400">Fast</td>
                <td className="text-center py-3 px-4 text-yellow-400">Moderate</td>
                <td className="text-center py-3 px-4 text-yellow-400">Moderate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-primary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-400">💡 Try It!</h3>
        <p className="text-sm text-gray-400 mb-4">
          The best way to learn Git is by doing. Head to the <strong className="text-gray-200">Playground</strong> and try running <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git init</code> to create your first repository!
        </p>
        <a href="/playground" className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Open Playground →
        </a>
      </div>
    </motion.div>
  );
}