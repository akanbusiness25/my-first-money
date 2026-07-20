// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JarVisual } from "./jar-visual";

describe("JarVisual", () => {
  it("exposes its fill and supports keyboard activation", () => {
    const onActivate = vi.fn();
    render(
      <JarVisual
        bucket="save"
        fillBasisPoints={350}
        focused
        interactive
        label="Save jar"
        onActivate={onActivate}
      />,
    );

    const button = screen.getByRole("button", { name: /Save jar/i });
    expect(
      screen.getByRole("progressbar", { name: /Save jar fill/i }),
    ).toHaveAttribute("aria-valuenow", "3.5");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("calls the shake action after a deliberate side-to-side drag", () => {
    const onShake = vi.fn();
    render(
      <JarVisual
        bucket="grow"
        fillBasisPoints={1_400}
        interactive
        label="Grow jar"
        onShake={onShake}
      />,
    );

    const button = screen.getByRole("button", { name: /Grow jar/i });
    fireEvent.pointerDown(button, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(button, { clientX: 128, pointerId: 1 });
    fireEvent.pointerMove(button, { clientX: 88, pointerId: 1 });
    fireEvent.pointerUp(button, { clientX: 88, pointerId: 1 });

    expect(onShake).toHaveBeenCalledTimes(1);
  });
});
