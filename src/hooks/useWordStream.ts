import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/**
 * Reveals `text` one word at a time, like the Storyline version did.
 * Pass `null` to hold off starting. Reduced-motion users get the full text at once.
 */
export function useWordStream(text: string | null, msPerWord = 50) {
  const [count, setCount] = useState(0);
  const words = text ? text.split(" ") : [];

  useEffect(() => {
    if (text === null) {
      setCount(0);
      return;
    }
    const total = text.split(" ").length;
    if (prefersReducedMotion()) {
      setCount(total);
      return;
    }
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= total) window.clearInterval(id);
    }, msPerWord);
    return () => window.clearInterval(id);
  }, [text, msPerWord]);

  return {
    shown: words.slice(0, count).join(" "),
    done: text !== null && count >= words.length,
  };
}
