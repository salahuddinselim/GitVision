"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, Lightbulb, ArrowRight, Play, RotateCcw } from "lucide-react";
import { TUTORIALS, Tutorial, TutorialStep } from "./tutorials/tutorialData";
import { useGitStore } from "@/store/gitStore";

export default function TutorialPanel() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const handleStartTutorial = (tutorial: Tutorial) => {
    useGitStore.getState().resetState();
    useGitStore.getState().gitInit();
    setSelectedTutorial(tutorial);
    setCurrentStepIdx(0);
    setCompletedSteps(new Set());
    setShowHint(false);
  };

  const handleReset = () => {
    if (!selectedTutorial) return;
    useGitStore.getState().resetState();
    useGitStore.getState().gitInit();
    setCurrentStepIdx(0);
    setCompletedSteps(new Set());
    setShowHint(false);
  };

  const markStepComplete = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.has(stepId)) return prev;
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const checkCurrentStep = useCallback(() => {
    if (!selectedTutorial) return;
    const step = selectedTutorial.steps[currentStepIdx];
    if (!step) return;

    const store = useGitStore.getState();

    // Check based on expectedCommand or validation function
    if (step.expectedCommand) {
      const lastHistory = store.history[store.history.length - 1] || "";
      if (lastHistory.startsWith(step.expectedCommand)) {
        markStepComplete(step.id);
      }
    } else if (step.validationFn) {
      if (step.validationFn(store)) {
        markStepComplete(step.id);
      }
    } else if (step.instruction.includes("```")) {
      // Multi-step instruction - check if the last few commands were run
      const cmdLines = step.instruction
        .split("```")[1]
        ?.split("\n")
        .filter((l) => l.trim() && !l.startsWith("```"))
        .map((l) => l.trim()) || [];
      const allRun = cmdLines.every((cmd) => store.history.some((h) => h.includes(cmd)));
      if (allRun) {
        markStepComplete(step.id);
      }
    }
  }, [selectedTutorial, currentStepIdx, markStepComplete]);

  // Poll for step completion. This must be useEffect, not useState's lazy
  // initializer — useState's initializer runs once at mount and its return
  // value becomes state, so the interval was both never cleared and forever
  // bound to the very first (pre-selection) checkCurrentStep closure.
  useEffect(() => {
    const interval = setInterval(checkCurrentStep, 1000);
    return () => clearInterval(interval);
  }, [checkCurrentStep]);

  const goToNextStep = () => {
    if (!selectedTutorial) return;
    if (currentStepIdx < selectedTutorial.steps.length - 1) {
      setCurrentStepIdx((i) => i + 1);
      setShowHint(false);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((i) => i - 1);
      setShowHint(false);
    }
  };

  const currentStep = selectedTutorial?.steps[currentStepIdx];
  const isLastStep = selectedTutorial && currentStepIdx === selectedTutorial.steps.length - 1;
  const isComplete = currentStep && completedSteps.has(currentStep.id);

  if (!selectedTutorial) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          Tutorials
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {TUTORIALS.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => handleStartTutorial(tutorial)}
              className="w-full text-left p-3 rounded-xl border border-gray-700/50 bg-surface/30 hover:border-primary/50 hover:bg-surface/50 transition-all group"
            >
              <div className="text-2xl mb-2">{tutorial.icon}</div>
              <h3 className="text-sm font-semibold text-gray-200 group-hover:text-primary transition-colors">
                {tutorial.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {tutorial.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  tutorial.difficulty === "beginner" ? "bg-green-500/20 text-green-400" :
                  tutorial.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {tutorial.difficulty}
                </span>
                <span className="text-[10px] text-gray-600">
                  {tutorial.steps.length} steps
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTutorial(null)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-gray-200">{selectedTutorial.title}</span>
        </div>
        <button
          onClick={handleReset}
          className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors"
          title="Reset tutorial"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-3 py-2 border-b border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span>Step {currentStepIdx + 1} of {selectedTutorial.steps.length}</span>
          <span>{Math.round((completedSteps.size / selectedTutorial.steps.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.size / selectedTutorial.steps.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-1 mt-1.5">
          {selectedTutorial.steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => {
                if (completedSteps.has(step.id) || i <= currentStepIdx + 1) {
                  setCurrentStepIdx(i);
                  setShowHint(false);
                }
              }}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                completedSteps.has(step.id)
                  ? "bg-green-500"
                  : i === currentStepIdx
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isComplete ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : currentStepIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-200">{currentStep.title}</h3>
                  </div>
                </div>

                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-mono bg-gray-900 rounded-lg p-3 border border-gray-700/50">
                  {currentStep.instruction}
                </div>

                {/* Hint */}
                {currentStep.hint && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      {showHint ? "Hide hint" : "Show hint"}
                    </button>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 font-mono"
                      >
                        💡 {currentStep.hint}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Status */}
                <div className={`text-xs px-3 py-2 rounded-lg ${
                  isComplete
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-gray-800 text-gray-500 border border-gray-700"
                }`}>
                  {isComplete
                    ? currentStep.successMessage
                    : "Run the command(s) above in the terminal to proceed..."}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-700 px-3 py-2 flex items-center justify-between shrink-0">
        <button
          onClick={goToPrevStep}
          disabled={currentStepIdx === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        {isComplete && !isLastStep && (
          <button
            onClick={goToNextStep}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Next Step
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {isComplete && isLastStep && (
          <button
            onClick={() => setSelectedTutorial(null)}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Complete!
          </button>
        )}

        {!isComplete && (
          <div className="text-xs text-gray-600">
            <Play className="w-3.5 h-3.5 inline mr-1" />
            Type it in the terminal
          </div>
        )}
      </div>
    </div>
  );
}
