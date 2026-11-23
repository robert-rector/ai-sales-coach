import { useEffect, useState } from "react";

/** A word that ends a sentence (allowing for closing quotes or brackets). */
const SENTENCE_END = /[.!?…]["”’)]*$/;

/**
 * Reveals `text` one word at a time. `text` may keep growing (e.g. while an AI
 * response streams in); the reveal carries on from where it was.
 * Pass `null` to hold off or reset.
 *
 * Pacing is deliberately uneven, like a model streaming: each word arrives after
 * 0.5–1.5× `msPerWord` (averaging `msPerWord`), with a longer beat after a sentence.
 */
export function useWordStream(text: string | null, msPerWord = 75) {
  const [count, setCount] = useState(0);
  const words = text ? text.split(" ") : [];
  const total = words.length;
  const started = text !== null;

  useEffect(() => {
    if (!started) setCount(0);
  }, [started]);

  useEffect(() => {
    if (!started || count >= total) return;
    const previous = words[count - 1] ?? "";
    const delay = SENTENCE_END.test(previous) ? msPerWord * 3.5 : msPerWord * (0.5 + Math.random());
    const id = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(id);
  }, [started, count, total, msPerWord]);

  const shownWords = words.slice(0, count);
  return {
    shownWords,
    shown: shownWords.join(" "),
    done: started && count >= total,
  };
}
