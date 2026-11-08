/** Small line icons for the feedback buttons. Sized by the .btn-icon class; colour follows the text. */
function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="btn-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function RegenerateIcon() {
  return (
    <Icon>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </Icon>
  );
}

/** Two overlapping rounded squares: the front one whole, the back one peeking out top-left. */
export function CopyIcon() {
  return (
    <Icon>
      <rect x="8" y="8" width="14" height="14" rx="3" />
      <path d="M4 16c-1.1 0-2-.9-2-2V5c0-1.7 1.3-3 3-3h9c1.1 0 2 .9 2 2" />
    </Icon>
  );
}

export function CheckIcon() {
  return (
    <Icon>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}
