import { useState } from "react";
import { scenarios } from "./scenarios";
import type { Choice } from "./types";
import { IntroScreen } from "./components/IntroScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { HowItWorks } from "./components/HowItWorks";

type Step = { name: "intro" } | { name: "question" } | { name: "feedback"; choice: Choice };

export function App() {
  const scenario = scenarios[0];
  const [step, setStep] = useState<Step>({ name: "intro" });
  const [showHow, setShowHow] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">AI Sales Coach</span>
        <button className="btn btn-link" onClick={() => setShowHow(true)}>
          How this works
        </button>
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
