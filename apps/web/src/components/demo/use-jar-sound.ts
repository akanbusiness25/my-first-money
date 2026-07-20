"use client";

import { useCallback } from "react";
import type { BucketKey } from "@/domain/money";

const soundPattern: Record<
  BucketKey,
  { type: OscillatorType; frequencies: readonly number[]; duration: number }
> = {
  spend: { type: "square", frequencies: [240, 180], duration: 0.045 },
  save: { type: "sine", frequencies: [880, 660], duration: 0.12 },
  give: { type: "sine", frequencies: [520, 660], duration: 0.16 },
  grow: { type: "triangle", frequencies: [420, 360], duration: 0.18 },
};

export function useJarSound(bucket: BucketKey, enabled: boolean) {
  const play = useCallback(() => {
    if (!enabled || typeof window === "undefined" || !window.AudioContext) {
      return;
    }

    const context = new window.AudioContext();
    const pattern = soundPattern[bucket];
    const start = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.075, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      start + pattern.duration * pattern.frequencies.length,
    );
    gain.connect(context.destination);

    for (const [index, frequency] of pattern.frequencies.entries()) {
      const oscillator = context.createOscillator();
      const offset = index * pattern.duration;
      oscillator.type = pattern.type;
      oscillator.frequency.setValueAtTime(frequency, start + offset);
      oscillator.connect(gain);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + pattern.duration);
    }

    window.setTimeout(
      () => void context.close(),
      Math.ceil(pattern.duration * pattern.frequencies.length * 1_000 + 80),
    );
  }, [bucket, enabled]);

  return { play };
}
