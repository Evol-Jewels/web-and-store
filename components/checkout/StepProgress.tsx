"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { CheckoutStep } from "@/lib/stores/checkoutStore";

interface StepProgressProps {
  currentStep: CheckoutStep;
  isMobile?: boolean;
}

const STEPS: Array<{ id: CheckoutStep; label: string; number: number }> = [
  { id: "delivery", label: "Delivery", number: 1 },
  { id: "review", label: "Review", number: 2 },
  { id: "payment", label: "Payment", number: 3 },
];

const stepOrder: Record<CheckoutStep, number> = {
  delivery: 0,
  review: 1,
  payment: 2,
  confirmed: 3,
};

export function StepProgress({ currentStep, isMobile = false }: StepProgressProps) {
  const currentIndex = stepOrder[currentStep];

  if (isMobile) {
    return (
      <div className="bg-white border-b border-evol-grey px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 flex-1 bg-evol-grey rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-evolRed"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-medium text-evol-dark-grey whitespace-nowrap">
              Step {currentIndex + 1} of {STEPS.length}
            </span>
          </div>
          <p className="text-14px font-inter text-evol-dark-grey">
            {STEPS[currentIndex].label}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-evol-grey py-8">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8">
        {STEPS.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isActive = currentIndex === index;

          return (
            <div key={step.id} className="flex items-center gap-4">
              {/* Circle */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-white"
                  animate={{
                    backgroundColor: isCompleted ? "#333333" : isActive ? "#9F0B10" : "#C0C0C0",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span className={isActive ? "text-white" : "text-evol-grey"}>
                      {step.number}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Label and Connector */}
              <div className="flex flex-col gap-2">
                <p
                  className={`text-12px font-inter uppercase tracking-wider ${
                    isCompleted || isActive ? "text-evol-dark-grey" : "text-evol-grey"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <motion.div
                  className="w-16 h-0.5 ml-4"
                  animate={{
                    backgroundColor: isCompleted ? "#333333" : "#C0C0C0",
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
