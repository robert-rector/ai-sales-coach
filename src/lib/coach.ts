const ENDPOINT =
  import.meta.env.VITE_COACH_ENDPOINT ?? "https://sales-scenario-ai.rrector59.workers.dev";

/** Asks the Worker for coaching feedback on a learner's choice. */
export async function getCoaching(choiceId: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_choice: choiceId }),
    signal,
  });
  if (!res.ok) throw new Error(`Coach endpoint returned ${res.status}`);
  const data: { text?: string } = await res.json();
  if (!data.text) throw new Error("Coach endpoint returned no text");
  return data.text;
}
