import { useEffect, useRef } from "react";

const DIAGRAM_FILE = "AI Sales Coach Application Diagram.jpeg";
const DIAGRAM_SRC = `/${encodeURI(DIAGRAM_FILE)}`;
/** Alt text is the file name without its extension. */
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
