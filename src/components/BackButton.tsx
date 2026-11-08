export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-primary btn-back" onClick={onClick}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M10.5 2.5 5 8l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back
    </button>
  );
}
