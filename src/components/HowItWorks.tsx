import { useEffect, useRef, useState, type RefObject } from "react";

const DIAGRAM_FILE = "AI Sales Coach Application Diagram.jpeg";
const DIAGRAM_SRC = `/${encodeURI(DIAGRAM_FILE)}`;
const DIAGRAM_ALT =
  "Diagram of how the AI Sales Coach works: the learner is presented with a scenario and selects " +
  "one of three responses. The app server receives the learner's answer and builds an AI prompt, " +
  "which it sends to the Gemini API. Gemini returns coaching feedback to the app server, which " +
  "sends it back for the learner to read.";

/** A phone outline with a curved arrow, suggesting turning the phone sideways. */
function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="7" width="9" height="15" rx="2" />
      <path d="M13 3a7 7 0 0 1 7 7" />
      <path d="m17 7 3 3 3-3" />
    </svg>
  );
}

/** Only shown on phones held upright (by CSS); turning the phone sideways shows the diagram bigger. */
function RotateHint() {
  return (
    <p className="rotate-hint">
      <RotateIcon />
      Rotate your phone to enlarge
    </p>
  );
}

/** Phones, upright or sideways. Matches the phone media queries in globals.css. */
const PHONE_QUERY = "(orientation: portrait) and (max-width: 760px), (orientation: landscape) and (max-height: 500px)";

/** Opens or closes a <dialog> as a modal to match `open`. */
function useModal(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [ref, open]);
}

export function HowItWorks({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const viewerRef = useRef<HTMLDialogElement>(null);
  const [enlarged, setEnlarged] = useState(false);
  useModal(ref, open);
  useModal(viewerRef, open && enlarged);

  return (
    <dialog
      ref={ref}
      className="how"
      onClose={(e) => {
        // React passes the enlarged view's close event up to here too; only react to our own.
        if (e.target !== e.currentTarget) return;
        setEnlarged(false);
        onClose();
      }}
      aria-labelledby="how-title"
    >
      {/* Scrolls inside the rounded box, so a scrollbar never squares off the dialog's corners. */}
      <div className="how-body">
        <h2 id="how-title">How this works</h2>
        {/* Enlarges in the app rather than opening a new tab, so learners don't lose their place.
            Not on phones, where turning the phone is how learners enlarge it. */}
        <button
          className="how-diagram"
          onClick={() => {
            if (!window.matchMedia(PHONE_QUERY).matches) setEnlarged(true);
          }}
          title="Enlarge diagram"
        >
          <img src={DIAGRAM_SRC} alt={DIAGRAM_ALT} width={2082} height={902} />
        </button>
        <RotateHint />
        {/* autoFocus so opening the dialog doesn't put a focus ring around the diagram. */}
        <button className="btn btn-primary" onClick={onClose} autoFocus>
          Got it
        </button>
      </div>

      {/* Enlarged diagram, on top of the pop-up. Close, Escape or a click outside the image returns to it. */}
      <dialog
        ref={viewerRef}
        className="diagram-viewer"
        aria-label="Enlarged diagram"
        onClose={() => setEnlarged(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as Element).classList.contains("viewer-scroll")) {
            setEnlarged(false);
          }
        }}
      >
        <div className="viewer-bar">
          <button className="btn btn-primary" onClick={() => setEnlarged(false)} autoFocus>
            Close ✕
          </button>
        </div>
        <div className="viewer-scroll">
          <img src={DIAGRAM_SRC} alt={DIAGRAM_ALT} width={2082} height={902} />
        </div>
      </dialog>
    </dialog>
  );
}
