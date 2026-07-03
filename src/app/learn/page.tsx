"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, GitBranch, ChevronRight } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Learn <span className="text-primary">Git Visually</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Follow structured learning paths with interactive exercises, visualizations, and quizzes.
          </p>
        </div>

        {/* Learning Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { level: "Beginner", bgClassName: "bg-green-500/10", dotClassName: "bg-green-500/60", icon: "🌱", lessons: 8, desc: "Perfect for those new to version control", topics: ["Install & Setup", "Basic Commands", "First Repository", "Understanding Commits"] },
            { level: "Intermediate", bgClassName: "bg-yellow-500/10", dotClassName: "bg-yellow-500/60", icon: "🚀", lessons: 8, desc: "For those comfortable with the basics", topics: ["Branching", "Merging", "Rebasing", "Remote Repos", "Conflict Resolution"] },
            { level: "Advanced", bgClassName: "bg-red-500/10", dotClassName: "bg-red-500/60", icon: "⚡", lessons: 8, desc: "Master advanced Git workflows", topics: ["Internals", "Bisect", "Worktrees", "Submodules", "Hooks", "Performance"] },
          ].map((track, i) => (
            <motion.div
              key={track.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl border border-gray-700/50 bg-surface/50 overflow-hidden ${i === 1 ? "ring-2 ring-primary/20 scale-105" : ""}`}
            >
              <div className={`${track.bgClassName} px-6 py-4 border-b border-gray-700/50`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{track.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">{track.level}</h3>
                    <p className="text-sm text-gray-400">{track.lessons} lessons</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-4">{track.desc}</p>
                <div className="space-y-2">
                  {track.topics.map((topic, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className={`w-2 h-2 rounded-full ${track.dotClassName}`} />
                      {topic}
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium">
                  Start Learning →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Lesson Previews */}
        <h2 className="text-2xl font-bold mb-6">Featured Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { title: "What is Git?", desc: "Understand what Git is and why it matters", duration: "5 min", progress: 0 },
            { title: "Your First Commit", desc: "Make your first commit in an interactive playground", duration: "10 min", progress: 0 },
            { title: "Branching Basics", desc: "Learn to create and switch between branches", duration: "15 min", progress: 0 },
            { title: "Merge vs Rebase", desc: "When to merge and when to rebase (with visuals)", duration: "20 min", progress: 0 },
            { title: "Resolving Conflicts", desc: "Hands-on merge conflict resolution practice", duration: "25 min", progress: 0 },
            { title: "Git Internals", desc: "Explore blobs, trees, and the object database", duration: "30 min", progress: 0 },
            { title: "GitHub Workflow", desc: "Clone, branch, PR, merge — the full workflow", duration: "35 min", progress: 0 },
            { title: "Bisect & Debug", desc: "Find bugs fast with git bisect", duration: "15 min", progress: 0 },
          ].map((lesson, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className="rounded-xl border border-gray-700/50 bg-surface/50 p-5 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">Lesson {i + 1}</span>
                <span className="text-xs text-gray-500">{lesson.duration}</span>
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-100">{lesson.title}</h4>
              <p className="text-sm text-gray-400">{lesson.desc}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/30 rounded-full" style={{ width: "0%" }} />
                </div>
                <span className="text-xs text-gray-500">0%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-700/50 bg-surface/50 overflow-hidden mb-16"
        >
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700/50 bg-surface">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="text-[11px] text-gray-500 font-mono ml-2">try it yourself</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-700" style={{ minHeight: "350px" }}>
            <div className="p-4 font-mono text-sm bg-[#0d1117] overflow-y-auto">
              <div className="text-gray-500 mb-4">
                <span className="text-green-400">user@learner</span>
                <span className="text-gray-600"> ~</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300"> mkdir my-project && cd my-project</span>
              </div>
              <div className="text-gray-500 mb-4">
                <span className="text-green-400">user@learner</span>
                <span className="text-gray-600"> ~/my-project</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300"> git init</span>
              </div>
              <div className="text-green-400 text-xs mb-4 pl-10">
                Initialized empty Git repository in /home/user/my-project/.git/
              </div>
              <div className="text-gray-500">
                <span className="text-green-400">user@learner</span>
                <span className="text-gray-600"> ~/my-project (master)</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300"> ▌</span>
              </div>
            </div>
            <div className="p-6 flex flex-col items-center justify-center bg-gray-900/50">
              <GitBranch className="w-20 h-20 text-gray-700 mb-4" />
              <p className="text-lg font-semibold text-gray-300">Commands you type appear here</p>
              <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">
                Try typing commands like <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">touch file.js</code>, <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">git add .</code>, or <code className="bg-gray-700 px-1.5 py-0.5 rounded text-green-300">{`git commit -m "msg"`}</code>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}