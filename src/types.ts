export interface Persona {
  name: string;
  avatar: string;
}

export interface Choice {
  id: string;
  text: string;
  /** What this response does, in the designer's words. Given to the AI coach, never shown to the learner. */
  intent: string;
}

export interface Scenario {
  id: string;
  title: string;
  coach: Persona;
  prospect: Persona;
  /** Coach's opening lines on the intro screen. */
  intro: string[];
  /** Narration that sets up the moment before the prospect speaks. */
  setup: string[];
  prospectLine: string;
  question: string;
  choices: Choice[];
}
