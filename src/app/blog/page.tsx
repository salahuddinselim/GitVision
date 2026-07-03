"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, Tag } from "lucide-react";

const posts = [
  {
    title: "Git Merge vs Rebase: The Complete Visual Guide",
    excerpt: "Understand the differences between merging and rebasing with animated diagrams and interactive examples.",
    date: "May 13, 2026",
    readTime: "8 min read",
    tags: ["git", "merge", "rebase", "workflow"],
    difficulty: "Intermediate",
  },
  {
    title: "10 Git Mistakes Every Developer Makes (And How to Fix Them)",
    excerpt: "From force-pushing to losing work, here are the most common Git pitfalls and their solutions.",
    date: "May 10, 2026",
    readTime: "6 min read",
    tags: ["git", "mistakes", "best-practices"],
    difficulty: "Beginner",
  },
  {
    title: "Understanding Git Internals: Objects, Trees, and Commits",
    excerpt: "Dive deep into Git's content-addressable filesystem and understand exactly how your data is stored.",
    date: "May 8, 2026",
    readTime: "12 min read",
    tags: ["git", "internals", "advanced"],
    difficulty: "Advanced",
  },
  {
    title: "A Complete Guide to Resolving Merge Conflicts",
    excerpt: "Step-by-step guide to identifying, understanding, and resolving merge conflicts with confidence.",
    date: "May 5, 2026",
    readTime: "10 min read",
    tags: ["git", "conflicts", "merge"],
    difficulty: "Intermediate",
  },
  {
    title: "GitHub Workflow for Teams: From Clone to Merge",
    excerpt: "Best practices for team collaboration using Git and GitHub, including branch strategies and PR reviews.",
    date: "May 1, 2026",
    readTime: "15 min read",
    tags: ["github", "workflow", "collaboration"],
    difficulty: "Intermediate",
  },
  {
    title: "Git Interview Questions and Answers for 2026",
    excerpt: "The most common Git interview questions with clear, concise answers to help you prepare.",
    date: "April 28, 2026",
    readTime: "11 min read",
    tags: ["git", "interview", "career"],
    difficulty: "All Levels",
  },
];

// A single muted tag style keeps the tag cloud legible without turning every
// post into a rainbow — per the design system's one-accent rule.
const defaultTagColor = "bg-primary/10 text-primary";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-primary">GitVision Blog</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Tutorials, tips, and deep dives into Git — from basics to advanced workflows.
          </p>
        </div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-gray-700/50 bg-surface/50 overflow-hidden mb-12 cursor-pointer group"
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-medium">Featured</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                May 13, 2026
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                8 min read
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
              Git Merge vs Rebase: The Complete Visual Guide
            </h2>
            <p className="text-lg text-gray-400 mb-6 max-w-3xl">
              Understand when to merge and when to rebase with visual examples. This comprehensive guide covers the pros and cons of each approach, with animated diagrams that make the concepts crystal clear.
            </p>
            <div className="flex flex-wrap gap-2">
              {["git", "merge", "rebase", "workflow"].map((tag) => (
                <span key={tag} className={`text-[10px] px-2 py-1 rounded-full font-medium ${defaultTagColor}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-700/50 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">SV</div>
              <span className="text-sm text-gray-300">SabrVision Team</span>
            </div>
            <span className="text-sm text-primary font-medium">Read More →</span>
          </div>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{post.difficulty}</span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-100 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${defaultTagColor}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-700/50 text-xs text-gray-500 flex items-center justify-between">
                <span>{post.date}</span>
                <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read More →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}