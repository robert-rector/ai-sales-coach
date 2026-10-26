import type { Choice, Scenario } from "@/types";

export const COACH_MODEL = "gemini-2.5-flash";

/** Builds the Gemini request for coaching on one learner choice. Runs on the server only. */
export function buildCoachingPrompt(scenario: Scenario, choice: Choice) {
  const { coach, prospect } = scenario;

  const systemInstruction = `You are Coach ${coach.name}, a sales mentor giving feedback to a learner who just practiced a moment from a sales call.

Provide coaching feedback in EXACTLY 3 sentences:
Sentence 1: Evaluate the learner's response in the context of what the prospect said.
Sentence 2: Explain the consequence or benefit of that response.
Sentence 3: Give a specific recommendation or a better script.

Constraints:
- Speak directly to the learner as "you".
- Do not introduce yourself or greet the learner. Start immediately with the evaluation.
- Write plain text only: no markdown, asterisks, bullet points or headings.`;

  const contents = `Situation: ${scenario.setup.join(" ")}
Prospect (${prospect.name}): "${scenario.prospectLine}"
Learner's response: "${choice.text}"
What this response does: ${choice.intent}`;

  return { systemInstruction, contents };
}
