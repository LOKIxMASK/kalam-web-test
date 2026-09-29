export function AcubotzLogo({ withTagline = false, className = "" }: { withTagline?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
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
