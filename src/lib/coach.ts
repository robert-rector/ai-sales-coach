/** Thrown when the learner has hit the usage limit (Vercel Firewall returns 429). */
export class RateLimitError extends Error {
  name = "RateLimitError";
}

/**
 * Streams coaching feedback from the app's /api/coach route.
 * `onText` receives the full text received so far each time a new piece arrives.
 */
export async function streamCoaching(
  scenarioId: string,
  choiceId: string,
  onText: (textSoFar: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, choiceId }),
    signal,
  });
  if (res.status === 429) throw new RateLimitError("Usage limit reached");
  if (!res.ok || !res.body) throw new Error(`Coach request failed (${res.status})`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += value;
    onText(text);
  }
  if (!text.trim()) throw new Error("Coach returned no feedback");
  return text;
}
