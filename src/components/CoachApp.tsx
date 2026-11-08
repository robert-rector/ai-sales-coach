"use client";

import { useEffect, useState } from "react";
import { scenarios } from "@/scenarios";
import type { Choice, Scenario } from "@/types";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { FeedbackScreen } from "./FeedbackScreen";
import { HowItWorks } from "./HowItWorks";
import { SparkleIcon } from "./SparkleIcon";

/** Learners play the scenarios in order: intro, then each scenario's question and feedback. */
type Step =
  | { name: "intro" }
  | { name: "question"; scenario: Scenario }
  /** `restore`: show the remembered feedback (refresh, back/forward) rather than asking for new. */
  | { name: "feedback"; scenario: Scenario; choice: Choice; restore?: boolean };

/** Reads the current screen from the address, e.g. ?screen=feedback&scenario=…&choice=…. */
function stepFromUrl(): Step {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  const scenario = scenarios.find((s) => s.id === params.get("scenario")) ?? scenarios[0];
  if (screen === "question") return { name: "question", scenario };
  if (screen === "feedback") {
    const choice = scenario.choices.find((c) => c.id === params.get("choice"));
    if (choice) return { name: "feedback", scenario, choice, restore: true };
  }
  return { name: "intro" };
}

function urlForStep(step: Step) {
  if (step.name === "question") return `?screen=question&scenario=${step.scenario.id}`;
  if (step.name === "feedback") {
    return `?screen=feedback&scenario=${step.scenario.id}&choice=${step.choice.id}`;
  }
  return window.location.pathname;
}

const neighbours = (scenario: Scenario) => {
  const i = scenarios.indexOf(scenario);
  return { previous: scenarios[i - 1], next: scenarios[i + 1] };
};

export function CoachApp() {
  // Unknown until mounted: the screen comes from the address, which only the browser can read.
  const [step, setStep] = useState<Step | null>(null);
  const [showHow, setShowHow] = useState(false);

  useEffect(() => {
    const initial = stepFromUrl();
    // Tidy the address if it named a screen, scenario or choice that doesn't exist.
    window.history.replaceState(null, "", urlForStep(initial));
    setStep(initial);
    const onPopState = () => setStep(stepFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const go = (next: Step) => {
    window.history.pushState(null, "", urlForStep(next));
    setStep(next);
  };

  const screen = () => {
    if (!step) return null;
    if (step.name === "intro") {
      return (
        <IntroScreen
          scenario={scenarios[0]}
          onStart={() => go({ name: "question", scenario: scenarios[0] })}
        />
      );
    }
    const { previous, next } = neighbours(step.scenario);
    if (step.name === "question") {
      return (
        <QuestionScreen
          scenario={step.scenario}
          onChoose={(choice) => go({ name: "feedback", scenario: step.scenario, choice })}
          onBack={() => go(previous ? { name: "question", scenario: previous } : { name: "intro" })}
        />
      );
    }
    return (
      <FeedbackScreen
        scenario={step.scenario}
        choice={step.choice}
        restore={step.restore ?? false}
        onBack={() => go({ name: "question", scenario: step.scenario })}
        onNext={next ? () => go({ name: "question", scenario: next }) : undefined}
        onHowItWorks={() => setShowHow(true)}
      />
    );
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
        <main key={step.name === "intro" ? "intro" : `${step.name}:${step.scenario.id}`}>
          {screen()}
        </main>
      )}

      <HowItWorks open={showHow} onClose={() => setShowHow(false)} />
    </div>
  );
}
