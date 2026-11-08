import { useState } from "react";
import type { Scenario } from "../types";
import { StreamedLines } from "./StreamedLines";

export function IntroScreen({ scenario, onStart }: { scenario: Scenario; onStart: () => void }) {
  const [ready, setReady] = useState(false);

  return (
    <section className="screen intro">
      <img className="avatar avatar-lg" src={scenario.coach.avatar} alt="" />
      <h1>{scenario.title}</h1>
      <div className="intro-lines">
        <StreamedLines
          lines={scenario.intro.map((text) => ({ text, className: "line" }))}
          pauseMs={1000}
          onDone={() => setReady(true)}
        />
      </div>
      <button className="btn btn-primary" onClick={onStart} disabled={!ready}>
        Get Started
      </button>
    </section>
  );
}
