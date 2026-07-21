// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialDemoState } from "@/domain/demo";
import { AppShell } from "./app-shell";

afterEach(cleanup);

describe("AppShell parent settings", () => {
  it("keeps language and fixed USD inside Settings", () => {
    render(
      <AppShell
        state={createInitialDemoState()}
        busy={false}
        onCommand={vi.fn().mockResolvedValue(undefined)}
      >
        <p>Demo content</p>
      </AppShell>,
    );

    expect(screen.queryByRole("button", { name: "English" })).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Open parent settings" }),
    );
    expect(
      screen.getByRole("dialog", { name: "Parent settings" }),
    ).toBeVisible();
    expect(
      screen.getByText("US dollar (USD) · fixed for this MVP"),
    ).toBeVisible();
    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
  });

  it("shows the primary product navigation during an active week", () => {
    const state = createInitialDemoState();
    state.stage = "week";

    render(
      <AppShell
        state={state}
        busy={false}
        tab="week"
        onTabChange={vi.fn()}
        onCommand={vi.fn().mockResolvedValue(undefined)}
      >
        <p>Active week</p>
      </AppShell>,
    );

    expect(screen.getByRole("button", { name: "Week" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Jars" })).toBeVisible();
    expect(screen.getByRole("button", { name: "History" })).toBeVisible();
  });
});
