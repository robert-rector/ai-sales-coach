function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d={direction === "left" ? "M10.5 2.5 5 8l5.5 5.5" : "M5.5 2.5 11 8l-5.5 5.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-primary btn-back" onClick={onClick}>
      <Chevron direction="left" />
      Back
    </button>
  );
}

interface NextButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function NextButton({ onClick, children, className = "" }: NextButtonProps) {
  return (
    <button className={`btn btn-primary btn-next ${className}`} onClick={onClick}>
      {children}
      <Chevron direction="right" />
    </button>
  );
}
