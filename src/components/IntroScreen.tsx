import { useEffect, useState, type CSSProperties } from "react";
import intro from "@/content/intro.json";
import type { Scenario } from "../types";
import { StreamedLines } from "./StreamedLines";

/** How long the avatar and title entrance takes before Alex starts talking. */
const ENTRANCE_MS = 1600;
/** How long after the last intro line finishes before Get Started fades in. */
const BUTTON_DELAY_MS = 1000;

/** Title whose letters rise in one after another. Screen readers get the plain text. */
function AnimatedTitle({ text }: { text: string }) {
  let index = 0;
  return (
    <h1>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="title-word">
              {[...word].map((letter, l) => (
                <span key={l} className="title-letter" style={{ "--i": index++ } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
}

export function IntroScreen({ scenario, onStart }: { scenario: Scenario; onStart: () => void }) {
  const [entered, setEntered] = useState(false);
  const [linesDone, setLinesDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), ENTRANCE_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!linesDone) return;
    const id = window.setTimeout(() => setReady(true), BUTTON_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [linesDone]);

  return (
    <section className="screen intro">
      <div className="avatar-entrance">
        <img className="avatar avatar-lg" src={scenario.coach.avatar} alt="" />
      </div>
      <AnimatedTitle text={scenario.title} />
      <div className="intro-lines">
        {entered && (
          <StreamedLines
            lines={intro.lines.map((text) => ({ text, className: "line" }))}
            pauseMs={1000}
            onDone={() => setLinesDone(true)}
          />
        )}
      </div>
      <button className={`btn btn-primary reveal ${ready ? "is-visible" : ""}`} onClick={onStart}>
        Get Started
      </button>
    </section>
  );
}
