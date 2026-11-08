"use client";

import { useEffect, useState } from "react";
import { scenarios } from "@/scenarios";
import type { Choice, Scenario } from "@/types";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { FeedbackScreen } from "./FeedbackScreen";
import { HowItWorks } from "./HowItWorks";
import { SparkleIcon } from "./SparkleIcon";

type Step =
  | { name: "intro" }
  | { name: "question" }
  /** `restore`: show the remembered feedback (refresh, back/forward) rather than asking for new. */
  | { name: "feedback"; choice: Choice; restore?: boolean };

/** Reads the current screen from the address, e.g. ?screen=feedback&choice=curious_probe. */
function stepFromUrl(scenario: Scenario): Step {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  if (screen === "question") return { name: "question" };
  if (screen === "feedback") {
    const choice = scenario.choices.find((c) => c.id === params.get("choice"));
    if (choice) return { name: "feedback", choice, restore: true };
  }
  return { name: "intro" };
}

function urlForStep(step: Step) {
  if (step.name === "question") return "?screen=question";
  if (step.name === "feedback") return `?screen=feedback&choice=${step.choice.id}`;
  return window.location.pathname;
}

export function CoachApp() {
  const scenario = scenarios[0];
  // Unknown until mounted: the screen comes from the address, which only the browser can read.
  const [step, setStep] = useState<Step | null>(null);
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    const initial = stepFromUrl(scenario);
    // Tidy the address if it named a screen or choice that doesn't exist.
    window.history.replaceState(null, "", urlForStep(initial));
    setStep(initial);
    const onPopState = () => setStep(stepFromUrl(scenario));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [scenario]);

  const go = (next: Step) => {
    window.history.pushState(null, "", urlForStep(next));
    setStep(next);
  };

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">
          <SparkleIcon className="brand-icon" />
          AI Sales Coach
        </span>
      </header>

      {step && (
        <main key={step.name}>
          {step.name === "intro" && (
            <IntroScreen scenario={scenario} onStart={() => go({ name: "question" })} />
          )}
          {step.name === "question" && (
            <QuestionScreen
              scenario={scenario}
              onChoose={(choice) => go({ name: "feedback", choice })}
              onBack={() => go({ name: "intro" })}
            />
          )}
          {step.name === "feedback" && (
            <FeedbackScreen
              scenario={scenario}
              choice={step.choice}
              restore={step.restore ?? false}
              onBack={() => go({ name: "question" })}
              onRestart={() => go({ name: "intro" })}
              onHowItWorks={() => setShowHow(true)}
            />
          )}
        </main>
      )}

      <HowItWorks open={showHow} onClose={() => setShowHow(false)} />
    </div>
  );
}
