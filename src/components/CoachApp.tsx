"use client";

import { useState } from "react";
import { scenarios } from "@/scenarios";
import type { Choice } from "@/types";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { FeedbackScreen } from "./FeedbackScreen";
import { HowItWorks } from "./HowItWorks";
import { SparkleIcon } from "./SparkleIcon";

type Step = { name: "intro" } | { name: "question" } | { name: "feedback"; choice: Choice };

export function CoachApp() {
  const scenario = scenarios[0];
  const [step, setStep] = useState<Step>({ name: "intro" });
  const [showHow, setShowHow] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <SparkleIcon className="brand-icon" />
          AI Sales Coach
        </span>
      </header>

      <main key={step.name}>
        {step.name === "intro" && (
          <IntroScreen scenario={scenario} onStart={() => setStep({ name: "question" })} />
        )}
        {step.name === "question" && (
          <QuestionScreen
            scenario={scenario}
            onChoose={(choice) => setStep({ name: "feedback", choice })}
            onBack={() => setStep({ name: "intro" })}
          />
        )}
        {step.name === "feedback" && (
          <FeedbackScreen
            scenario={scenario}
            choice={step.choice}
            onBack={() => setStep({ name: "question" })}
            onRestart={() => setStep({ name: "intro" })}
            onHowItWorks={() => setShowHow(true)}
          />
        )}
      </main>

      <HowItWorks open={showHow} onClose={() => setShowHow(false)} />
    </div>
  );
}
