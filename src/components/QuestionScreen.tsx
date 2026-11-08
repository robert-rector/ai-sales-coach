import { useEffect, useState } from "react";
import type { Choice, Scenario } from "../types";
import { BackButton } from "./BackButton";
import { StreamedLines } from "./StreamedLines";

/** How long after "How will you respond?" finishes before the choices appear. */
const CHOICES_DELAY_MS = 1000;

interface Props {
  scenario: Scenario;
  onChoose: (choice: Choice) => void;
  onBack: () => void;
}

export function QuestionScreen({ scenario, onChoose, onBack }: Props) {
  const [linesDone, setLinesDone] = useState(false);
  const [ready, setReady] = useState(false);
  const { coach, prospect } = scenario;

  useEffect(() => {
    if (!linesDone) return;
    const id = window.setTimeout(() => setReady(true), CHOICES_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [linesDone]);

  return (
    <section className="screen question">
      <div className="speaker">
        <img className="avatar" src={coach.avatar} alt={coach.name} />
        <div className="speaker-body">
          <StreamedLines
            pauseMs={1000}
            onDone={() => setLinesDone(true)}
            lines={[
              ...scenario.setup.map((text) => ({ text, className: "line" })),
              {
                text: scenario.prospectLine,
                className: "prospect",
                render: (shown) => (
                  <span className="bubble-row">
                    <img className="avatar avatar-sm" src={prospect.avatar} alt="" />
                    <span className="bubble">{shown}</span>
                  </span>
                ),
              },
              { text: scenario.question, className: "line line-strong" },
            ]}
          />
        </div>
      </div>

      <div className={`choices ${ready ? "is-ready" : ""}`} role="group" aria-label="Your response">
        {scenario.choices.map((choice) => (
          <button
            key={choice.id}
            className="choice"
            onClick={() => onChoose(choice)}
            disabled={!ready}
          >
            “{choice.text}”
          </button>
        ))}
      </div>

      <div className="screen-footer">
        <div className="footer-nav">
          <BackButton onClick={onBack} />
        </div>
      </div>
    </section>
  );
}
