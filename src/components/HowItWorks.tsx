import { useEffect, useRef } from "react";

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
