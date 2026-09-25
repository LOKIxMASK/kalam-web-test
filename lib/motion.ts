export const EASE = [0.22, 1, 0.36, 1] as const; // Apple-like expo out
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Map v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
