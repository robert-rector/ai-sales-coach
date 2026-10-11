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
        <li>When you choose a response, its ID is sent to a Cloudflare Worker.</li>
        <li>The Worker wraps it in a structured coaching prompt and calls Google’s Gemini API.</li>
        <li>Gemini’s feedback comes back and is streamed onto the page word by word.</li>
      </ol>
      <p>Keeping the API key in the Worker means it never reaches the browser.</p>
      <button className="btn btn-primary" onClick={onClose}>
        Got it
      </button>
    </dialog>
  );
}
