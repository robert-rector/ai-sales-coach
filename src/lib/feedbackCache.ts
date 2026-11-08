/**
 * Remembers each choice's feedback for this browser tab, so refreshing the feedback
 * screen shows the same text instead of asking Gemini again. Storage can be blocked
 * (e.g. some private modes); the app then just fetches fresh feedback.
 */
const key = (scenarioId: string, choiceId: string) => `coach-feedback:${scenarioId}:${choiceId}`;

export function loadFeedback(scenarioId: string, choiceId: string): string | null {
  try {
    return window.sessionStorage.getItem(key(scenarioId, choiceId));
  } catch {
    return null;
  }
}

export function saveFeedback(scenarioId: string, choiceId: string, text: string) {
  try {
    window.sessionStorage.setItem(key(scenarioId, choiceId), text);
  } catch {
    // Not being able to remember it only means a refresh fetches new feedback.
  }
}
