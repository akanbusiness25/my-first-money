// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialDemoState, type DemoState } from "@/domain/demo";
import { ClosedWeek, type RootTab } from "./closed-week";

afterEach(cleanup);

function closedState(): DemoState {
  return {
    ...createInitialDemoState(),
    stage: "closed",
    child: {
      displayName: "Alex",
      ageBand: "8-12",
      presentationToken: "leaf",
      currency: "USD",
    },
    mission: {
      objective: "first_choices",
      baseAmountMinor: 1_000,
      tasks: [],
      agreementVersion: 1,
      parentMarked: true,
      childMarked: true,
    },
    payday: {
      weekNumber: 1,
      idempotencyKey: "22f8d588-5470-423d-8845-a1108869ba8e",
      baseAmountMinor: 1_000,
      paidTaskMinor: 800,
      totalMinor: 1_800,
      allocation: { spend: 1_260, save: 180, give: 180, grow: 180 },
      growBonusMinor: 100,
      closedAt: "2026-07-20T12:00:00.000Z",
    },
    ledgerEvents: [
      {
        id: "7a82b927-9a0c-407e-8cc3-4898ac985908",
        kind: "parent_bonus",
        bucket: "save",
        amountMinor: 100,
        createdAt: "2026-07-20T12:01:00.000Z",
      },
    ],
  };
}

function renderTab(tab: RootTab) {
  return render(
    <ClosedWeek
      state={closedState()}
      tab={tab}
      busy={false}
      onCommand={vi.fn().mockResolvedValue(undefined)}
      onTabChange={vi.fn()}
    />,
  );
}

describe("approved closed-week experience", () => {
  it("opens a focused jar from the Four Jars overview", () => {
    renderTab("jars");

    expect(screen.getByRole("heading", { name: "Four jars" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Save jar" }));
    expect(screen.getByRole("heading", { name: "Scooter goal" })).toBeVisible();
    expect(
      screen.getByRole("progressbar", { name: "Save jar fill" }),
    ).toHaveAttribute("aria-valuenow", "3.5");
  });

  it("keeps parent actions explicit and reviewable", () => {
    renderTab("jars");
    fireEvent.click(screen.getByRole("button", { name: "Add parent bonus" }));

    const dialog = screen.getByRole("dialog", { name: "Add parent bonus" });
    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByText("Parent confirms every change."),
    ).toBeVisible();
  });

  it("limits jar-use reasons to the selected jar", () => {
    renderTab("jars");
    fireEvent.click(screen.getByRole("button", { name: "Save jar" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Use money from this jar" }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Use money from this jar",
    });
    expect(within(dialog).getByLabelText("What was it used for?")).toHaveValue(
      "save_goal",
    );
    fireEvent.change(within(dialog).getByLabelText("Choose a jar"), {
      target: { value: "give" },
    });
    expect(within(dialog).getByLabelText("What was it used for?")).toHaveValue(
      "helped_someone",
    );
    expect(
      within(dialog).queryByRole("option", { name: "Bought the Save goal" }),
    ).not.toBeInTheDocument();
  });

  it("shows append-only events in History without a correction shortcut", () => {
    renderTab("history");

    expect(
      screen.getByRole("heading", { name: "Family history" }),
    ).toBeVisible();
    expect(
      within(screen.getByRole("list")).getByText("Parent bonus"),
    ).toBeVisible();
    expect(screen.getByText("+$1.00 · Save")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: /correction/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a closed-week allocation when History is filtered by jar", () => {
    renderTab("history");
    fireEvent.change(screen.getByLabelText("Filter history"), {
      target: { value: "give" },
    });

    const history = screen.getByRole("list");
    expect(within(history).getByText("Week allocation · 1")).toBeVisible();
    expect(within(history).getByText("+$1.80 · Give")).toBeVisible();
  });
});
