import { useEffect, useRef } from "react";

const DIAGRAM_FILE = "AI Sales Coach Application Diagram.jpeg";
const DIAGRAM_SRC = `/${encodeURI(DIAGRAM_FILE)}`;
/** Alt text is the file name without its extension; the steps below describe the same flow in words. */
const DIAGRAM_ALT = DIAGRAM_FILE.replace(/\.[^.]+$/, "");

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
      <h2 id="how-title">How this works</h2>
      <a className="how-diagram" href={DIAGRAM_SRC} target="_blank" rel="noopener">
        <img src={DIAGRAM_SRC} alt={DIAGRAM_ALT} width={2082} height={902} />
      </a>
      <a className="how-diagram-open" href={DIAGRAM_SRC} target="_blank" rel="noopener">
        Open the diagram full size ↗
      </a>
      <ol>
        <li>The scenario (setup, objection, response options) is plain data, separate from the app.</li>
        <li>When you choose a response, the app’s server looks it up in the scenario.</li>
        <li>The server builds a structured coaching prompt (the situation, what the prospect said, and what you said) and sends it to Google’s Gemini API.</li>
        <li>Gemini’s feedback streams back onto the page as it’s written.</li>
      </ol>
      <p>The Gemini API key and the coaching prompt stay on the server, so they never reach the browser.</p>
      <button className="btn btn-primary" onClick={onClose}>
        Got it
      </button>
    </dialog>
  );
}
