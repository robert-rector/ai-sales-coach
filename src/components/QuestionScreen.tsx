import { useState } from "react";
import type { Choice, Scenario } from "../types";
import { StreamedLines } from "./StreamedLines";

interface Props {
  scenario: Scenario;
  onChoose: (choice: Choice) => void;
  onBack: () => void;
}

export function QuestionScreen({ scenario, onChoose, onBack }: Props) {
  const [ready, setReady] = useState(false);
  const { coach, prospect } = scenario;

  return (
    <section className="screen question">
      <div className="speaker">
        <img className="avatar" src={coach.avatar} alt={coach.name} />
        <div className="speaker-body">
          <StreamedLines
            onDone={() => setReady(true)}
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

      <button className="btn btn-link back" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
