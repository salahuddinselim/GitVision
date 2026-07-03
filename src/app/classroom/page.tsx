"use client";

import { motion } from "framer-motion";
import { Users, Share2, Presentation, Terminal as TerminalIcon, PlayCircle } from "lucide-react";

export default function ClassroomPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Teacher Mode
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Classroom <span className="text-primary">Mode</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Teach Git visually to your students. Create tutorials, share live sessions, and guide learners through interactive exercises.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <Presentation className="w-6 h-6" />, title: "Live Demos", desc: "Present Git concepts in real-time with synchronized terminal and visualization. Students follow along on their own screens." },
            { icon: <Share2 className="w-6 h-6" />, title: "Shareable Sessions", desc: "Generate unique URLs for your lessons. Students join with a link — no accounts or setup required." },
            { icon: <TerminalIcon className="w-6 h-6" />, title: "Synchronized Terminals", desc: "Control a shared terminal that all students can see. Step through commands together with real-time updates." },
            { icon: <PlayCircle className="w-6 h-6" />, title: "Guided Exercises", desc: "Create step-by-step exercises with expected outputs. Students complete challenges and get instant feedback." },
            { icon: <Users className="w-6 h-6" />, title: "Student Progress", desc: "Track which lessons students have completed. Identify who needs help and where they're struggling." },
            { icon: <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center text-primary text-xs font-bold">+</div>, title: "Custom Curriculum", desc: "Build your own learning paths tailored to your course. Combine lessons, labs, and quizzes." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-gray-700/50 bg-surface/50 p-6 hover:border-primary/50 transition-colors"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-100">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">How Classroom Mode Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create a Lesson", desc: "Set up your tutorial with commands, expected outputs, and explanations." },
              { step: "2", title: "Share the Link", desc: "Send the unique session URL to your students. No login needed." },
              { step: "3", title: "Demo Live", desc: "Walk through the lesson with synchronized views. Students see everything in real-time." },
              { step: "4", title: "Track Progress", desc: "Monitor which students completed each step and identify who needs help." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">{item.step}</span>
                </div>
                <h4 className="font-semibold text-gray-200 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Demo */}
        <div className="rounded-2xl border border-gray-700/50 bg-surface/50 overflow-hidden mb-12">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700/50 bg-surface">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="text-[11px] text-gray-500 font-mono ml-2">classroom — live session</span>
            <span className="ml-auto flex items-center gap-2 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-700" style={{ height: "400px" }}>
            <div className="bg-[#0d1117] p-4 font-mono text-sm overflow-y-auto">
              <div className="text-gray-500 mb-2 text-[10px] uppercase tracking-wider">Teacher Terminal</div>
              <div className="flex gap-2 mb-3">
                <span className="text-green-400">instructor</span>
                <span className="text-gray-600">~/classroom</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300">git init lesson-1</span>
              </div>
              <div className="text-green-400 text-xs pl-10 mb-3">Initialized empty Git repository</div>
              <div className="flex gap-2 mb-3">
                <span className="text-green-400">instructor</span>
                <span className="text-gray-600">~/classroom/lesson-1</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300">{`echo "Learning Git"`}{' '}&gt;{' '}<span className="text-green-400">intro.md</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-400">instructor</span>
                <span className="text-gray-600">~/classroom/lesson-1</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-300">{`git add . && git commit -m "Start lesson"`}</span>
              </div>
              <div className="text-green-400 text-xs pl-10 mt-1">Created commit • Students see this in real-time</div>
            </div>
            <div className="bg-[#0d1117] p-4 font-mono text-sm overflow-y-auto">
              <div className="text-gray-500 mb-2 text-[10px] uppercase tracking-wider">Student View (Synchronized)</div>
              <div className="flex gap-2 mb-3">
                <span className="text-blue-400">student-1</span>
                <span className="text-gray-600">~/classroom/lesson-1</span>
                <span className="text-gray-500">$</span>
                <span className="text-gray-500 italic">{"// Following along..."}</span>
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-[11px] text-primary mb-3">
                📢 Instructor is running: git init lesson-1
              </div>
              <div className="bg-primary/10 border border-primary/20 rounded p-2 text-[11px] text-primary mb-3">
                📢 Instructor is running: <span className="text-green-400">echo</span>{" "}
                       <span className="text-yellow-400">{`"Learning Git"`}</span>
                       {' '}&gt;{' '}
                       <span className="text-blue-400">intro.md</span>
              </div>
              <div className="text-gray-500 text-xs mt-8">
                Session URL: gitvision.dev/classroom/abc123
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">Ready to Teach with GitVision?</h3>
          <p className="text-gray-400 mb-6">Create your first classroom session in minutes.</p>
          <button className="px-8 py-3 rounded-xl bg-primary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
            Create Classroom Session
          </button>
        </div>
      </motion.div>
    </div>
  );
}