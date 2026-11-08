import type { Scenario } from "../types";
import discoveryPriceObjection from "./discovery-price-objection.json";
import discoveryStatusQuoObjection from "./discovery-status-quo-objection.json";

export const scenarios: Scenario[] = [discoveryPriceObjection, discoveryStatusQuoObjection];

export function findChoice(scenarioId: unknown, choiceId: unknown) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const choice = scenario?.choices.find((c) => c.id === choiceId);
  return scenario && choice ? { scenario, choice } : null;
}
