import Image from "next/image";

/** Design box for the KalamSpark robot figure (image is 318 x 656). */
export const BOT_W = 340;
export const BOT_H = 700;

/**
 * The KalamSpark robot: product figure with warm halo, gold/cyan rim light
 * and a soft floor shadow so it sits in the space scene.
 */
export function KalamBot({ glow = 1, shadow = true }: { glow?: number; shadow?: boolean }) {
  return (
    <div className="relative" style={{ width: BOT_W, height: BOT_H }} aria-hidden>
      {/* halo behind the head and shoulders */}
      <div
        className="absolute left-1/2 top-[-20px] h-[460px] w-[460px] -translate-x-1/2 rounded-full"
        style={{
          opacity: glow,
          background: "radial-gradient(closest-side, rgba(245,194,66,0.30), rgba(245,194,66,0.08) 55%, transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-[260px] h-[380px] w-[380px] -translate-x-1/2 rounded-full"
        style={{ opacity: glow * 0.8, background: "radial-gradient(closest-side, rgba(111,214,232,0.12), transparent)" }}
      />
      {/* floor shadow */}
      {shadow && (
        <div className="absolute bottom-[4px] left-1/2 h-[34px] w-[230px] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />
      )}
      <Image
        src="/kalam-robot.png"
        alt=""
        width={318}
        height={656}
        sizes="340px"
        className="absolute bottom-0 left-1/2 h-auto w-[318px] max-w-none -translate-x-1/2 select-none"
        style={{
          filter:
            "drop-shadow(-6px -4px 14px rgba(245,194,66,0.35)) drop-shadow(8px 6px 18px rgba(111,214,232,0.22)) drop-shadow(0 30px 40px rgba(0,0,0,0.6))",
        }}
        draggable={false}
      />
    </div>
  );
}
