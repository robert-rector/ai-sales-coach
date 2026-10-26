import { GoogleGenAI } from "@google/genai";
import { findChoice } from "@/scenarios";
import { buildCoachingPrompt, COACH_MODEL } from "@/lib/prompt";

/**
 * POST { scenarioId, choiceId } → streams Gemini's coaching feedback as plain text.
 * Only choices that exist in a scenario file are accepted, so callers can't send arbitrary prompts.
 */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return Response.json({ error: "Coach is not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const found = findChoice(body?.scenarioId, body?.choiceId);
  if (!found) {
    return Response.json({ error: "Unknown scenario or choice" }, { status: 400 });
  }

  const { systemInstruction, contents } = buildCoachingPrompt(found.scenario, found.choice);
  const ai = new GoogleGenAI({ apiKey });

  let chunks;
  try {
    chunks = await ai.models.generateContentStream({
      model: COACH_MODEL,
      contents,
      config: { systemInstruction, temperature: 0.7, abortSignal: request.signal },
    });
  } catch (err) {
    console.error("Gemini request failed", err);
    return Response.json({ error: "Coach is unavailable" }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of chunks) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();
      } catch (err) {
        console.error("Gemini stream failed", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
