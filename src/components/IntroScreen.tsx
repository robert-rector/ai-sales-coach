import { useEffect, useState } from "react";
import type { Scenario } from "../types";
import { StreamedLines } from "./StreamedLines";

/** How long after the last intro line finishes before Get Started fades in. */
const BUTTON_DELAY_MS = 1000;

export function IntroScreen({ scenario, onStart }: { scenario: Scenario; onStart: () => void }) {
  const [linesDone, setLinesDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!linesDone) return;
    const id = window.setTimeout(() => setReady(true), BUTTON_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [linesDone]);

  return (
    <section className="screen intro">
      <img className="avatar avatar-lg" src={scenario.coach.avatar} alt="" />
      <h1>{scenario.title}</h1>
      <div className="intro-lines">
        <StreamedLines
          lines={scenario.intro.map((text) => ({ text, className: "line" }))}
          pauseMs={1000}
          onDone={() => setLinesDone(true)}
        />
      </div>
      <button className={`btn btn-primary reveal ${ready ? "is-visible" : ""}`} onClick={onStart}>
        Get Started
      </button>
    </section>
  );
}
