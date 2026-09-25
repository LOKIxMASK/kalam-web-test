"use client";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Scroll progress through a target element.
 *
 * Framer Motion 13 hands simple range transforms of scroll progress to a native
 * ViewTimeline, which ignores custom offsets such as "start start"/"end end" and
 * desynchronises opacity from transforms. Routing through a function transform
 * keeps every scroll-linked value on the same, correct JS timeline.
 */
export function useProgress(ref: RefObject<HTMLElement | null>, offset: Offset): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useTransform(scrollYProgress, (v) => v);
}

export function usePageProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  return { scrollY, progress: useTransform(scrollYProgress, (v) => v) };
}
