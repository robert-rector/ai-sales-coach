import { useEffect, useRef, useState, type RefObject } from "react";

const DIAGRAM_FILE = "AI Sales Coach Application Diagram.jpeg";
const DIAGRAM_SRC = `/${encodeURI(DIAGRAM_FILE)}`;
const DIAGRAM_ALT =
  "Diagram of how the AI Sales Coach works: the learner is presented with a scenario and selects " +
  "one of three responses. The app server receives the learner's answer and builds an AI prompt, " +
  "which it sends to the Gemini API. Gemini returns coaching feedback to the app server, which " +
  "sends it back for the learner to read.";

/** A phone between two curved arrows (from rotate_phone_2.svg, drawn in Inkscape). Filled with
    currentColor, so it takes the hint text's colour in light and dark mode. */
const ROTATE_ICON_PATH =
  "M 20.896014,5.0593374 V 71.059337 c 0,5.238301 4.2617,9.500001 9.5,9.500001 h 34 c 5.2383,0 9.5,-4.2617 9.5,-9.500001 V 5.0593374 c 0,-5.23829998 -4.2617,-9.5 -9.5,-9.5 h -34 c -5.2383,0 -9.5,4.26170002 -9.5,9.5 z m 43.5,-6.5 c 3.582,0 6.5,2.918 6.5,6.5 V 71.059337 c 0,3.582001 -2.918,6.500001 -6.5,6.500001 h -34 c -3.582,0 -6.5,-2.918 -6.5,-6.500001 V 5.0593374 c 0,-3.582 2.918,-6.5 6.5,-6.5 z m -52.219,63.5619996 -10.9259996,-1.6211 c -0.82031,-0.12109 -1.3789,-0.88672 -1.2656,-1.7031 0.12109,-0.82031 0.88672,-1.3867 1.7031,-1.2656 l 6.4141,0.95312 c -4.9336,-5.6172 -7.707,-12.84 -7.707,-20.426 0,-9.1562 4.0195,-17.797 11.0349996,-23.707 0.63281,-0.53125 1.5781,-0.45312 2.1133,0.17969 0.53516,0.63672 0.45312,1.582 -0.17969,2.1133 -6.3319996,5.3359 -9.9647996,13.141 -9.9647996,21.41 0,7.3359 2.8711,14.297 7.9413996,19.504 l 1.1992,-8.0742 c 0.12109,-0.82031 0.88672,-1.3867 1.7031,-1.2656 0.74609,0.10938 1.2812,0.75 1.2812,1.4805 0,0.07422 -0.0039,0.14844 -0.01563,0.22266 l -1.6211,10.926 c -0.12109,0.82031 -0.88672,1.3867 -1.7031,1.2656 z m 70.441,-48.121 10.926,1.6211 c 0.74609,0.10938 1.2812,0.75 1.2812,1.4805 0,0.07422 -0.0039,0.14844 -0.01563,0.22266 -0.12109,0.82031 -0.88672,1.3867 -1.7031,1.2656 l -6.418,-0.95312 c 4.9375,5.6172 7.7109,12.836 7.7109,20.426 0,9.1562 -4.0195,17.797 -11.031,23.707 -0.63281,0.53516 -1.5781,0.45312 -2.1133,-0.17969 -0.53516,-0.63672 -0.45312,-1.5781 0.17969,-2.1133 6.332,-5.3398 9.9688,-13.141 9.9688,-21.414 0,-7.3398 -2.8711,-14.301 -7.9375,-19.504 l -1.1992,8.0742 c -0.12109,0.82031 -0.88672,1.3867 -1.7031,1.2656 -0.82031,-0.12109 -1.3789,-0.89453 -1.2656,-1.7031 l 1.6211,-10.926 c 0.12109,-0.82031 0.88672,-1.3867 1.7031,-1.2656 z";

function RotateIcon() {
  return (
    <svg viewBox="-5 -10 104.8 96.12" aria-hidden="true" focusable="false">
      <path d={ROTATE_ICON_PATH} fill="currentColor" />
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
