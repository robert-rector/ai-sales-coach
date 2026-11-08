import { useEffect, useState, type ReactNode } from "react";
import { useWordStream } from "../hooks/useWordStream";

interface LineProps {
  text: string;
  started: boolean;
  onDone: () => void;
  render?: (shown: string) => ReactNode;
}

function StreamedLine({ text, started, onDone, render }: LineProps) {
  const { shown, done } = useWordStream(started ? text : null);

  useEffect(() => {
    if (done) onDone();
  }, [done]);

  if (!started) return null;
  // Screen readers get the whole line once; the word-by-word reveal is visual only.
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{render ? render(shown) : shown}</span>
    </>
  );
}

interface Props {
  lines: { text: string; render?: (shown: string) => ReactNode; className?: string }[];
  /** Pause between one line finishing and the next starting. */
  pauseMs?: number;
  onDone?: () => void;
}

/** Streams each line in turn, starting the next once the previous finishes. */
export function StreamedLines({ lines, pauseMs = 0, onDone }: Props) {
  const [active, setActive] = useState(0); // line currently streaming
  const [finished, setFinished] = useState(0); // lines fully shown

  useEffect(() => {
    if (finished >= lines.length) {
      onDone?.();
      return;
    }
    if (finished <= active) return;
    const id = window.setTimeout(() => setActive(finished), pauseMs);
    return () => window.clearTimeout(id);
  }, [finished]);

  return (
    <>
      {lines.map((line, i) =>
        i <= active ? (
          <div key={i} className={line.className}>
            <StreamedLine
              text={line.text}
              started={i <= active}
              render={line.render}
              onDone={() => setFinished((f) => Math.max(f, i + 1))}
            />
          </div>
        ) : null,
      )}
    </>
  );
}
