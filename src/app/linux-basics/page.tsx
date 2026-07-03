"use client";

import { motion } from "framer-motion";
import { Terminal, ChevronRight, CheckCircle } from "lucide-react";

export default function LinuxBasicsPage() {
  const commands = [
    { cmd: "pwd", desc: "Print Working Directory — shows your current directory path", example: "$ pwd\n/home/user/projects" },
    { cmd: "ls", desc: "List directory contents", example: "$ ls\nDocuments  Downloads  project\n$ ls -la\ntotal 24\ndrwxr-xr-x  user  Documents\ndrwxr-xr-x  user  project\n-rw-r--r--  user  file.txt" },
    { cmd: "cd", desc: "Change Directory — navigate between folders", example: "$ cd project\n$ cd ..\n$ cd /home/user\n$ cd ~" },
    { cmd: "mkdir", desc: "Make Directory — create new folders", example: "$ mkdir new-folder\n$ mkdir -p src/components/buttons" },
    { cmd: "touch", desc: "Create an empty file or update timestamps", example: "$ touch index.js\n$ touch file1.txt file2.txt file3.txt" },
    { cmd: "cat", desc: "Concatenate and display file contents", example: "$ cat index.js\nconsole.log('hello');\n$ cat > notes.txt\nType content, then Ctrl+D to save" },
    { cmd: "echo", desc: "Print text or write to files", example: "$ echo \"Hello World\"\nHello World\n$ echo \"content\" > file.txt\n$ echo \"append\" >> file.txt" },
    { cmd: "rm", desc: "Remove files or directories", example: "$ rm file.txt\n$ rm -r directory/\n$ rm *.tmp\n$ rm -rf dangerous-dir/" },
    { cmd: "mv", desc: "Move or rename files", example: "$ mv old.txt new.txt\n$ mv file.txt Documents/\n$ mv *.js src/" },
    { cmd: "cp", desc: "Copy files or directories", example: "$ cp file.txt backup.txt\n$ cp -r project/ project-backup/\n$ cp *.js src/" },
    { cmd: "clear", desc: "Clear the terminal screen", example: "$ clear\n// Screen is cleared, scrollback preserved" },
    { cmd: "history", desc: "Show previously executed commands", example: "$ history\n  1  ls\n  2  cd project\n  3  git init\n  4  git status\n  5  git add ." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Linux <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">Terminal Basics</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn essential terminal commands you need before mastering Git. Interactive examples included.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {commands.map((command, i) => (
            <motion.div
              key={command.cmd}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-700/50 bg-surface/50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-surface">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-green-400" />
                  <code className="text-lg font-bold text-green-400 font-mono">{command.cmd}</code>
                </div>
                <span className="text-xs text-gray-500 font-mono">Beginner</span>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-300 text-sm mb-2">{command.desc}</p>
                <div className="bg-[#0d1117] rounded-lg p-4 mt-4">
                  <div className="text-[10px] text-gray-500 font-mono mb-2">EXAMPLE</div>
                  <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                    {command.example.split("\n").map((line, j) => (
                      <div key={j} className={line.startsWith("$") ? "text-green-400" : line.startsWith("//") ? "text-gray-500" : "text-gray-300"}>
                        {line}
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Practice Area */}
        <div className="mt-12 rounded-2xl border border-gray-700/50 bg-surface/50 p-8">
          <h2 className="text-2xl font-bold mb-4">Quick Reference Card</h2>
          <p className="text-gray-400 mb-6 text-sm">Bookmark these common patterns:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Navigation", commands: "pwd · cd · ls · cd .. · cd ~ · cd -" },
              { title: "File Operations", commands: "mkdir · touch · cp · mv · rm · cat" },
              { title: "File Editing", commands: "nano · vim · echo > · echo >>" },
              { title: "Searching", commands: "find · grep · locate · which · whereis" },
              { title: "Permissions", commands: "chmod · chown · ls -la · sudo" },
              { title: "System Info", commands: "whoami · uname · df · du · free" },
            ].map((card) => (
              <div key={card.title} className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-4">
                <h4 className="text-sm font-semibold text-gray-200 mb-2">{card.title}</h4>
                <code className="text-[11px] text-gray-400 font-mono">{card.commands}</code>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}