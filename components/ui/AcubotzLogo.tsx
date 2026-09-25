export function AcubotzMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <g stroke="#F5C242" strokeWidth="3.2">
        <circle cx="20" cy="13.5" r="8.5" />
        <circle cx="13" cy="25.5" r="8.5" />
        <circle cx="27" cy="25.5" r="8.5" />
      </g>
    </svg>
  );
}

export function AcubotzLogo({ withTagline = false, className = "" }: { withTagline?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <AcubotzMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
          <span className="text-gold">A</span>cubotz
        </span>
        {withTagline && (
          <span className="mt-1.5 text-[0.62rem] font-medium tracking-[0.02em] text-ink-2">
            Igniting Curiosity, Inspiring Innovation
          </span>
        )}
      </span>
    </span>
  );
}
