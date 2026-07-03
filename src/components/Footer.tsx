"use client";

import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Playground", href: "/playground" },
      { label: "Learn", href: "/learn" },
      { label: "Docs", href: "/docs" },
      { label: "Commands", href: "/commands" },
    ],
    Resources: [
      { label: "GitHub Workflow", href: "/blog" },
      { label: "Linux Basics", href: "/linux-basics" },
      { label: "Merge Conflicts", href: "/merge-conflicts" },
      { label: "Git Internals", href: "/internals" },
    ],
    Community: [
      { label: "Classroom", href: "/classroom" },
      { label: "Blog", href: "/blog" },
      { label: "Feedback", href: "#" },
      { label: "Contribute", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-gray-800 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">
                GV
              </div>
              <span className="text-gray-100">GitVision</span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">
              Interactive Git visualization and learning platform. Master version control through hands-on practice.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-300 mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} GitVision. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}