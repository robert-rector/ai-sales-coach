export interface Persona {
  name: string;
  avatar: string;
}

export interface Choice {
  /** Sent to the coach endpoint as `user_choice`; the Worker keys its prompt off this. */
  id: string;
  text: string;
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
