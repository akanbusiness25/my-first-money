// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useJarSound } from "./use-jar-sound";

describe("useJarSound", () => {
  it("does not construct Web Audio while sound is disabled", () => {
    const audioContext = vi.fn();
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      value: audioContext,
    });

    const { result } = renderHook(() => useJarSound("save", false));
    result.current.play();

    expect(audioContext).not.toHaveBeenCalled();
  });
});
