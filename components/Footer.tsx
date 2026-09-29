import { brand, footerLinks } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative bg-[#04060d] px-5 pb-12 pt-[18vh] md:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col items-center text-center">
          <p className="text-[clamp(2.4rem,5vw,4.6rem)] font-bold tracking-[-0.045em] text-ink">
            <span className="text-gold">A</span>cubotz
          </p>
          <p className="mt-3 text-[0.95rem] text-ink-2 md:text-[1.1rem]">{brand.tagline}</p>
        </div>

        <div className="mt-[16vh] flex flex-col gap-10 border-t border-white/[0.06] pt-10 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.85rem] font-semibold text-ink">
            KalamSpark <span className="font-normal text-ink-3">by Acubotz</span>
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[0.82rem] text-ink-3 transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a href={brand.site} className="text-[0.82rem] font-semibold text-gold/80 transition-colors hover:text-gold">
            {brand.siteLabel}
          </a>
        </div>
        <p className="mt-10 text-[0.72rem] text-ink-3/70">
          &copy; {new Date().getFullYear()} Acubotz. KalamSpark is inspired by Dr. A.P.J. Abdul Kalam.
        </p>
      </div>
    </footer>
  );
}
