import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RateLimitError, streamCoaching } from "@/lib/coach";
import { loadFeedback, saveFeedback } from "@/lib/feedbackCache";
import { useWordStream } from "@/hooks/useWordStream";
import type { Choice, Scenario } from "@/types";
import { CheckIcon, CopyIcon, HelpIcon, RegenerateIcon } from "./ActionIcons";
import { BackButton, NextButton } from "./BackButton";

interface Props {
  scenario: Scenario;
  choice: Choice;
  /** Show this choice's remembered feedback, if any, instead of asking for new. */
  restore: boolean;
  onBack: () => void;
  /** Go on to the next scenario; absent on the last one. */
  onNext?: () => void;
  onHowItWorks: () => void;
}

type Status = "loading" | "streaming" | "complete" | "error" | "limited";

export function FeedbackScreen({ scenario, choice, restore, onBack, onNext, onHowItWorks }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Remembered feedback (after a refresh) is shown whole rather than streamed again.
  const [instant, setInstant] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const failed = status === "error" || status === "limited";

  // While streaming, hold back the last word in case it arrived cut in half.
  const revealTarget =
    feedback === null || failed
      ? null
      : status === "complete"
        ? feedback
        : feedback.slice(0, feedback.lastIndexOf(" ") + 1).trimEnd();
  const { shown: streamed, done: revealed } = useWordStream(instant ? null : revealTarget, 85);
  const shown = instant ? (feedback ?? "") : streamed;
  const done = status === "complete" && (instant || revealed);

  const request = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setFeedback(null);
    setInstant(false);
    streamCoaching(
      scenario.id,
      choice.id,
      (text) => {
        setFeedback(text);
        setStatus("streaming");
      },
      controller.signal,
    )
      .then((text) => {
        saveFeedback(scenario.id, choice.id, text);
        setStatus("complete");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setStatus(err instanceof RateLimitError ? "limited" : "error");
      });
  }, [scenario.id, choice.id]);

  // Layout effect so remembered feedback is in place before the first paint (no "thinking" flash).
  useLayoutEffect(() => {
    const saved = restore ? loadFeedback(scenario.id, choice.id) : null;
    if (saved) {
      setFeedback(saved);
      setStatus("complete");
      setInstant(true);
    } else {
      request();
    }
    return () => abortRef.current?.abort();
  }, [request, restore, scenario.id, choice.id]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    if (!feedback) return;
    try {
      await navigator.clipboard.writeText(feedback);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); nothing useful to show.
    }
  };

  return (
    <>
      <section className="screen feedback">
        <div className="your-choice">
          <span className="label">You said</span>
          <p>“{choice.text}”</p>
        </div>

        <div className="speaker">
          <img className="avatar" src={scenario.coach.avatar} alt={scenario.coach.name} />
          <div className="speaker-body">
            <h2>Your Feedback</h2>
            {!failed && !shown && (
              <p className="thinking" role="status">
                Coach {scenario.coach.name} is thinking<span className="dots" aria-hidden="true" />
              </p>
            )}
            {status === "error" && (
              <p className="error" role="alert">
                I'm having trouble reaching the coach.{" "}
                <button className="btn btn-link" onClick={request}>
                  Try again
                </button>
              </p>
            )}
            {status === "limited" && (
              <p className="notice" role="alert">
                Wow, you’ve asked for a lot of feedback in a short time! I need a quick break. Please
                try again in up to 10 minutes.{" "}
                <button className="btn btn-link" onClick={request}>
                  Try again
                </button>
              </p>
            )}
            {!failed && shown && (
              <p className="feedback-text" aria-hidden="true">
                {shown}
              </p>
            )}
            {status === "complete" && (
              <p className="sr-only" role="status">
                {feedback}
              </p>
            )}

            {done && (
              <div className="feedback-actions fade-in">
                <button className="btn btn-ghost" onClick={request}>
                  <RegenerateIcon />
                  Regenerate response
                </button>
                <button className="btn btn-ghost" onClick={copy}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pinned to the bottom of the box with Back shown from the start, so it never moves.
            Next and the explainer link fade into their reserved space once feedback finishes. */}
        <div className="feedback-footer">
          <div className="footer-nav">
            <BackButton onClick={onBack} />
            {onNext && (
              <NextButton onClick={onNext} className={`reveal ${done ? "is-visible" : ""}`}>
                Next scenario
              </NextButton>
            )}
          </div>
          <button
            className={`btn btn-link how-link reveal ${done ? "is-visible" : ""}`}
            onClick={onHowItWorks}
          >
            <HelpIcon />
            Learn how this works
          </button>
        </div>
      </section>
      <p className="disclaimer">
        Response generated by Gemini AI. AI-generated content may contain inaccuracies.
      </p>
    </>
  );
}
