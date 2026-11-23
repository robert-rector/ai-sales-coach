import { useEffect, useRef } from "react";

const DIAGRAM_FILE = "AI Sales Coach Application Diagram.jpeg";
const DIAGRAM_SRC = `/${encodeURI(DIAGRAM_FILE)}`;
const DIAGRAM_ALT =
  "Diagram of how the AI Sales Coach works: the learner is presented with a scenario and selects " +
  "one of three responses. The app server receives the learner's answer and builds an AI prompt, " +
  "which it sends to the Gemini API. Gemini returns coaching feedback to the app server, which " +
  "sends it back for the learner to read.";

export function HowItWorks({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="how" onClose={onClose} aria-labelledby="how-title">
      {/* Scrolls inside the rounded box, so a scrollbar never squares off the dialog's corners. */}
      <div className="how-body">
        <h2 id="how-title">How this works</h2>
        {/* Click for the full-size image (useful on phones, where it's small). */}
        <a className="how-diagram" href={DIAGRAM_SRC} target="_blank" rel="noopener">
          <img src={DIAGRAM_SRC} alt={DIAGRAM_ALT} width={2082} height={902} />
        </a>
        {/* autoFocus so opening the dialog doesn't put a focus ring around the diagram. */}
        <button className="btn btn-primary" onClick={onClose} autoFocus>
          Got it
        </button>
      </div>
    </dialog>
  );
}
