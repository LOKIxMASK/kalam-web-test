"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navLinks } from "@/lib/content";
import { AcubotzLogo } from "./ui/AcubotzLogo";
import { EASE } from "@/lib/motion";

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 2.4 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 md:pt-4"
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-[1320px] items-center justify-between rounded-2xl px-4 py-3 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-700 md:px-6 ${
            solid
              ? "border border-white/[0.07] bg-[#0a1020]/55 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <a href="#top" aria-label="Acubotz, back to top">
            <AcubotzLogo />
          </a>
          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-[0.82rem] font-medium tracking-[0.01em] text-ink-2 transition-colors duration-300 hover:text-ink"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold/70 transition-transform duration-500 ease-[var(--ease-apple)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[0.8rem] font-semibold tracking-[0.14em] text-ink-2 uppercase md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-[#050812]/90 px-6 pt-5 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <AcubotzLogo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[0.8rem] font-semibold tracking-[0.14em] text-ink-2 uppercase"
              >
                Close
              </button>
            </div>
            <ul className="mt-20 flex flex-col gap-6">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.08 * i }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="text-[2.6rem] font-bold tracking-[-0.04em] text-ink">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
