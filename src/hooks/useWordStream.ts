import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * Reveals `text` one word at a time. `text` may keep growing (e.g. while an AI
 * response streams in); the reveal carries on from where it was.
 * Pass `null` to hold off or reset. Reduced-motion users get the text at once.
 */
export function useWordStream(text: string | null, msPerWord = 50) {
  const [count, setCount] = useState(0);
  const words = text ? text.split(" ") : [];
  const total = words.length;
  const started = text !== null;

  useEffect(() => {
    if (!started) setCount(0);
  }, [started]);

  useEffect(() => {
    if (!started || count >= total) return;
    if (prefersReducedMotion()) {
      setCount(total);
      return;
    }
    const id = window.setTimeout(() => setCount((c) => c + 1), msPerWord);
    return () => window.clearTimeout(id);
  }, [started, count, total, msPerWord]);

  return {
    shown: words.slice(0, count).join(" "),
    done: started && count >= total,
  };
}
