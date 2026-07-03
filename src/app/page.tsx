"use client";

import { motion } from "framer-motion";
import { Code2, GitBranch, Sparkles, Zap, Play, ArrowRight, BookOpen, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl"
            animate={{ x: mousePosition.x, y: mousePosition.y }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
            animate={{ x: -mousePosition.x * 0.5, y: -mousePosition.y * 0.5 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,166,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,166,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              >
                <Sparkles className="w-4 h-4" />
                Learn Git Visually
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance">
                <span className="text-primary">
                  GitVision
                </span>
                <br />
                <span className="text-gray-100">Master Git</span>
                <br />
                <span className="text-gray-500">Through Visualization</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                Interactive Git learning platform with real-time visualization.
                Execute commands, watch commit graphs animate, and understand Git
                like never before — all in your browser.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span className="hidden sm:inline">Open Playground</span>
                  <span className="sm:hidden">Playground</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-surface/50 hover:scale-105 transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Learning
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-surface/50 hover:scale-105 transition-all duration-300"
                >
                  <Code2 className="w-4 h-4" />
                  Docs
                </Link>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 flex gap-8"
              >
                <div>
                  <div className="text-2xl font-bold text-gray-100">50+</div>
                  <div className="text-sm text-gray-500">Git Commands</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-100">Interactive</div>
                  <div className="text-sm text-gray-500">Visualization</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-100">Free</div>
                  <div className="text-sm text-gray-500">No Install Needed</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Terminal + Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-surface rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="text-[11px] text-gray-500 font-mono ml-2">
                      terminal
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
                  </div>
                </div>

                {/* Terminal content */}
                <div className="p-4 font-mono text-sm space-y-1.5 max-h-96 overflow-y-auto">
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300 animate-typing">
                      mkdir project
                    </span>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">cd project</span>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300 animate-typing">
                      git init
                    </span>
                  </div>
                  <div className="text-green-400 text-xs pl-10">
                    Initialized empty Git repository in /home/user/project/.git/
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300 animate-typing">
                      touch app.js
                    </span>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300 animate-typing">
                      git add .
                    </span>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="text-green-400">user@GitVision</span>
                    <span className="text-blue-400">~/project (master)</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">
                      {`git commit -m "first commit"`}
                    </span>
                  </div>
                  <div className="text-green-400 text-xs pl-10">
                    [master (root-commit) a3f2c81] first commit
                  </div>
                </div>

                {/* Mini Git Graph */}
                <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-900/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                      </div>
                      <span>first commit</span>
                    </div>
                    <div className="text-gray-600 text-xs">← HEAD (master)</div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 -left-3 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                <Code2 className="w-4 h-4 inline mr-1" />
                Live Demo
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to master Git, from basic commands to advanced workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Git Visualization",
                description: "Watch your repository evolve with animated commit graphs and branch visualization.",
                icon: <GitBranch className="w-6 h-6 text-primary" />,
              },
              {
                title: "Interactive Terminal",
                description: "Practice Git commands in a real terminal simulator with instant feedback.",
                icon: <TerminalIcon className="w-6 h-6 text-primary" />,
              },
              {
                title: "Branch Simulation",
                description: "Create, switch, and merge branches visually to understand branching strategies.",
                icon: <GitBranch className="w-6 h-6 text-primary" />,
              },
              {
                title: "Merge Conflict Lab",
                description: "Learn to resolve merge conflicts with side-by-side diff visualization.",
                icon: <Code2 className="w-6 h-6 text-primary" />,
              },
              {
                title: "Replay Sessions",
                description: "Record and replay your Git sessions to review and share your workflow.",
                icon: <Zap className="w-6 h-6 text-primary" />,
              },
              {
                title: "GitHub Workflow",
                description: "Simulate push, pull, fetch, and remote repository operations.",
                icon: <Code2 className="w-6 h-6 text-primary" />,
              },
              {
                title: "Teacher Classroom",
                description: "Create tutorials and guide students through Git concepts in real time.",
                icon: <Sparkles className="w-6 h-6 text-primary" />,
              },
              {
                title: "Git Internals",
                description: "Explore blobs, trees, commits, and the object database that powers Git.",
                icon: <Zap className="w-6 h-6 text-primary" />,
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="group relative p-5 sm:p-6 rounded-xl border border-gray-700/50 bg-surface/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 h-full">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-100 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GitVision Section */}
      <section className="py-20 bg-muted/30 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why{" "}
                <span className="text-primary">
                  GitVision
                </span>{" "}
                Changes How You Learn Git
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Traditional Git tutorials show you commands without context.
                GitVision lets you see the impact of every command on your
                repository structure, branch graph, and object database — in
                real time.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Visual Learning",
                    desc: "See commits, branches, and merges rendered as interactive graphs that update as you type commands.",
                  },
                  {
                    title: "Interactive Education",
                    desc: "Practice in a safe sandbox environment. Make mistakes, experiment, and learn without consequences.",
                  },
                  {
                    title: "Deep Understanding",
                    desc: "Explore Git internals — blobs, trees, refs, and SHA hashes — to truly understand how Git works.",
                  },
                  {
                    title: "Practical Training",
                    desc: "Real-world scenarios including merge conflicts, rebasing, cherry-picking, and GitHub workflows.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-200">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-surface rounded-xl border border-gray-700/50 p-4 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span className="text-[10px] text-gray-500 font-mono ml-2">
                  playground
                </span>
              </div>
              <div className="grid grid-cols-3 gap-px bg-gray-700 h-64 rounded-lg overflow-hidden">
                <div className="bg-[#0d1117] p-2 text-[10px] text-gray-500 font-mono">
                  <div className="text-gray-400 mb-1">📁 src/</div>
                  <div className="text-gray-400">📄 app.js</div>
                </div>
                <div className="bg-[#0d1117] p-2 text-[10px] font-mono flex flex-col gap-0.5">
                  <div className="text-blue-400">$ git log --oneline</div>
                  <div className="text-gray-300">a1b2c3d First commit</div>
                  <div className="text-gray-300">e4f5g6h Add feature</div>
                </div>
                <div className="bg-[#0d1117] p-2 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 mx-auto mb-2 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/40" />
                    </div>
                    <div className="text-[10px] text-gray-400">
                      HEAD → master
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Try It Yourself</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Jump into the interactive playground and start exploring Git
              commands with real-time visualization.
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700/50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="text-[11px] text-gray-500 font-mono ml-2">
                interactive playground
              </span>
              <Link
                href="/playground"
                className="ml-auto px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                Open Full Playground →
              </Link>
            </div>
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-700"
              style={{ height: "450px" }}
            >
              <div className="bg-[#0d1117] p-3 overflow-y-auto">
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                  Explorer
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400 hover:bg-gray-700/50 rounded px-2 py-1 cursor-pointer">
                    <FolderIcon className="w-4 h-4 text-yellow-500" /> src/
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-sm text-gray-400 hover:bg-gray-700/50 rounded px-2 py-1 cursor-pointer">
                    <FileIcon className="w-4 h-4 text-gray-400" /> index.html
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-sm text-gray-400 hover:bg-gray-700/50 rounded px-2 py-1 cursor-pointer">
                    <FileIcon className="w-4 h-4 text-gray-400" /> style.css
                  </div>
                </div>
              </div>
              <div className="bg-[#0d1117] p-3 col-span-2 flex flex-col">
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">
                  Terminal
                </div>
                <div className="flex-1 font-mono text-sm space-y-1 overflow-y-auto">
                  <div className="flex gap-2">
                    <span className="text-green-400">user@demo</span>
                    <span className="text-gray-600">~/project</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">git init</span>
                  </div>
                  <div className="text-green-400 text-xs pl-10">
                    Initialized empty Git repository
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-400">user@demo</span>
                    <span className="text-gray-600">~/project (master)</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">
                      {`echo "Hello Git"`} &gt;{" "}
                      <span className="text-green-400">app.js</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-400">user@demo</span>
                    <span className="text-gray-600">~/project (master)</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">git add app.js</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-400">user@demo</span>
                    <span className="text-gray-600">~/project (master)</span>
                    <span className="text-gray-500">$</span>
                    <span className="text-gray-300">
                      {`git commit -m "initial"`}
                    </span>
                  </div>
                  <div className="text-green-400 text-xs pl-10">
                    [master a1b2c3d] initial — 1 file changed
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700/50 flex justify-between items-center">
                  <span className="text-[10px] text-gray-600">
                    Try commands like: git branch, git status, git log
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-muted/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Latest from the Blog</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Stay up to date with Git tips, tutorials, and best practices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Git Merge vs Rebase: The Complete Guide",
                excerpt:
                  "Understand when to merge and when to rebase with visual examples.",
                date: "May 2026",
                tag: "Intermediate",
                readTime: "8 min",
              },
              {
                title: "10 Git Mistakes and How to Fix Them",
                excerpt:
                  "Common Git pitfalls and their solutions for developers at every level.",
                date: "April 2026",
                tag: "Beginner",
                readTime: "6 min",
              },
              {
                title: "Understanding Git Internals: Objects and Storage",
                excerpt:
                  "Dive deep into blobs, trees, commits, and how Git stores your data.",
                date: "March 2026",
                tag: "Advanced",
                readTime: "12 min",
              },
            ].map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden hover:border-primary/50 transition-colors h-full flex flex-col">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                        {post.tag}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-400">{post.excerpt}</p>
                  </div>
                  <div className="px-6 py-3 border-t border-gray-700/50 text-xs text-gray-500">
                    {post.date}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Learners</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See what students, teachers, and developers say about GitVision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "University Student",
                avatar: "SC",
                content:
                  "GitVision made branching and merging finally click for me. The visual graphs are so much clearer than any textbook!",
              },
              {
                name: "Prof. James Rodriguez",
                role: "Computer Science Teacher",
                avatar: "JR",
                content:
                  "I use GitVision in my classroom and my students' understanding of Git has improved dramatically. It's an essential teaching tool.",
              },
              {
                name: "Marcus Johnson",
                role: "Senior Developer",
                avatar: "MJ",
                content:
                  "Even after 8 years of using Git, I learned new things. The internals section is incredibly well-designed.",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl border border-gray-700/50 bg-surface/50 backdrop-blur-sm p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-200">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    “{testimonial.content}”
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30 border-y border-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400">
              Everything you need to know about GitVision.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is Git?",
                a: "Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work on the same codebase without conflicts.",
              },
              {
                q: "What is GitVision?",
                a: "GitVision is a free, interactive platform that teaches Git through visual learning. It features a terminal simulator, animated Git graphs, filesystem visualization, and comprehensive documentation.",
              },
              {
                q: "Is GitVision free?",
                a: "Yes, GitVision is completely free to use. We believe Git education should be accessible to everyone. There are no subscriptions, hidden fees, or premium walls.",
              },
              {
                q: "How does Git visualization work?",
                a: "Our engine simulates Git operations in real-time. When you type a command, we update the filesystem tree, commit graph, staging area, and other visualizations simultaneously to show exactly what's happening.",
              },
              {
                q: "Can teachers use this platform?",
                a: "Absolutely! GitVision includes a Classroom Mode where teachers can create tutorials, share sessions via URL, and guide students through Git concepts with synchronized terminals.",
              },
              {
                q: "Does GitVision use real Git?",
                a: "GitVision simulates Git behavior entirely in the browser using JavaScript. No actual Git binary is executed. This makes it safe, fast, and accessible without installation.",
              },
              {
                q: "Can I export my work?",
                a: "Your sessions are saved automatically in your browser using IndexedDB. You can also share links to your replays and tutorials with others.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-700/30 transition-colors">
                    <h3 className="text-sm font-semibold text-gray-200">
                      {faq.q}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Master Git?</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers, students, and teachers who are
            learning Git visually with GitVision.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/playground"
              className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
            >
              Start Learning Now
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-surface/50 transition-colors"
            >
              View Learning Paths
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path d="M.5 3.75C.5 2.784.779 2 1.25 2h6.5c.471 0 .75.784.75 1.75v.5h4.5c.966 0 1.75.784 1.75 1.75v7A1.75 1.75 0 0113.25 15H1.25A1.75 1.75 0 01-.5 13.25v-9.5z" />
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 15h-9.5A1.75 1.75 0 012 13.25z" />
    </svg>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
