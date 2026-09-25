"use client";
import { useReduced } from "@/lib/hooks";
import { motion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";
import { EASE } from "@/lib/motion";

type LinesProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** animate immediately on mount instead of when in view */
  immediate?: boolean;
  amount?: number;
};

/** Headline vocabulary: masked line reveal, y 80 -> 0, blur 12px -> 0. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.14,
  immediate = false,
  amount = 0.5,
}: LinesProps) {
  const reduce = useReduced();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: 80, opacity: 0, filter: "blur(12px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: reduce ? 0.4 : 1.3, ease: EASE },
    },
  };
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount } };
  return (
    <Tag className={className}>
      <motion.span className="block" variants={container} initial="hidden" {...trigger}>
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span className={`block will-change-transform ${lineClassName ?? ""}`} variants={line}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Word stagger for mid-size headlines. */
export function RevealWords({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  amount = 0.6,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  amount?: number;
}) {
  const reduce = useReduced();
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "90%", opacity: 0, filter: "blur(8px)" },
                show: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Paragraph vocabulary: soft fade + slight Y. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
}) {
  const reduce = useReduced();
  const initial = { opacity: 0, y: reduce ? 0 : y };
  const target = { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE, delay } };
  return immediate ? (
    <motion.div className={className} initial={initial} animate={target}>
      {children}
    </motion.div>
  ) : (
    <motion.div className={className} initial={initial} whileInView={target} viewport={{ once: true, amount: 0.4 }}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <FadeUp y={14} delay={delay} className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" aria-hidden />
      <span>{children}</span>
    </FadeUp>
  );
}
