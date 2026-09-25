"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { motionValue, type MotionValue } from "framer-motion";

type Atmosphere = {
  /** 0..1, how much the whole page is dimmed (Night Study). */
  dim: MotionValue<number>;
};

const Ctx = createContext<Atmosphere | null>(null);

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const [value] = useState<Atmosphere>(() => ({ dim: motionValue(0) }));
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAtmosphere() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAtmosphere outside provider");
  return v;
}
