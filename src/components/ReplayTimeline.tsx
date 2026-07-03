"use client";

import { motion } from "framer-motion";

interface ReplayTimelineProps {
  commands: Array<{ command: string; timestamp: number }>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onPlay?: () => void;
  onReset?: () => void;
}

export default function ReplayTimeline({
  commands = [],
  currentStep = 0,
  onStepChange,
  onPlay,
  onReset,
}: ReplayTimelineProps) {
  const progress = commands.length > 0 ? ((currentStep + 1) / commands.length) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">
          Step {Math.min(currentStep + 1, commands.length)} of {commands.length}
        </span>
        <span className="text-primary font-mono">{Math.round(progress)}%</span>
      </div>

      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width);
          onStepChange(Math.floor(pct * commands.length));
        }}>
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 py-2 rounded-lg bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 transition-colors"
        >
          ↺ Reset
        </button>
        <button
          onClick={onPlay}
          className="flex-1 py-2 rounded-lg bg-primary text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          ▶ Play
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1">
        {commands.map((cmd, i) => (
          <div
            key={i}
            className={`text-xs font-mono px-2 py-1 rounded cursor-pointer transition-colors ${
              i === currentStep
                ? "bg-primary/20 text-primary border border-primary/30"
                : i < currentStep
                ? "bg-gray-700/50 text-gray-400"
                : "text-gray-600 hover:bg-gray-700/30"
            }`}
            onClick={() => onStepChange(i)}
          >
            <span className="text-gray-500 mr-2">${i + 1}</span>
            {cmd.command}
          </div>
        ))}
        {commands.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            No commands recorded yet. Start typing in the terminal!
          </div>
        )}
      </div>
    </div>
  );
}