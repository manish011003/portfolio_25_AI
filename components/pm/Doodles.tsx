export function DoodleCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 90"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="110"
        cy="45"
        rx="100"
        ry="34"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(-4 110 45)"
      />
    </svg>
  );
}

export function DoodleArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 30c28-22 62-28 96-18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M90 8l18 8-12 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-[-10px] h-5 w-[72px] -translate-x-1/2 rotate-[-2deg] bg-[#f3e3a0]/80 shadow-sm ${className}`}
    />
  );
}
