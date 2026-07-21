import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { DemoCommandSchema } from "@/domain/demo-contract";
import { StarterSplit } from "@/domain/money";
import {
  applyDemoCommand,
  getOrCreateDemoSession,
  type DemoSession,
} from "@/server/demo/session-store";
import { generateMoneyMoment } from "@/server/money-moment/service";
import { assertCsrf, assertSameOrigin } from "@/server/security/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-mfm_demo" : "mfm_demo";

function jsonHeaders(requestId: string) {
  return {
    "Cache-Control": "no-store, private",
    "X-Request-Id": requestId,
  };
}

function snapshot(session: DemoSession) {
  return {
    state: session.state,
    csrfToken: session.csrfToken,
    expiresAt: new Date(session.expiresAt).toISOString(),
  };
}

function setSessionCookie(response: NextResponse, session: DemoSession): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: session.id,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 60,
  });
}

export function GET(request: NextRequest) {
  const requestId = randomUUID();
  try {
    const { session } = getOrCreateDemoSession(
      request.cookies.get(COOKIE_NAME)?.value,
    );
    const response = NextResponse.json(snapshot(session), {
      headers: jsonHeaders(requestId),
    });
    setSessionCookie(response, session);
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "REQUEST_REJECTED";
    return NextResponse.json(
      { error: { code } },
      {
        status: code === "DEMO_CAPACITY_REACHED" ? 503 : 400,
        headers: jsonHeaders(requestId),
      },
    );
  }
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  try {
    assertSameOrigin(request);
    const { session } = getOrCreateDemoSession(
      request.cookies.get(COOKIE_NAME)?.value,
    );
    assertCsrf(session.csrfToken, request.headers.get("x-csrf-token"));
    const command = DemoCommandSchema.parse(await request.json());

    if (command.action === "request_money_moment") {
      const { state } = session;
      if (
        state.stage !== "closed" ||
        !state.child ||
        !state.mission ||
        !state.payday
      ) {
        throw new Error("STAGE_CONFLICT");
      }
      if (session.moneyMomentCount >= 3) throw new Error("RATE_LIMITED");
      session.moneyMomentCount += 1;
      session.lastMoneyMomentAt = Date.now();

      const completedPaid = state.mission.tasks.filter(
        (task) =>
          task.included && task.kind === "paid" && task.status === "completed",
      ).length;
      const paidTotal = state.mission.tasks.filter(
        (task) => task.included && task.kind === "paid",
      ).length;
      const result = await generateMoneyMoment({
        ageBand: state.child.ageBand,
        locale: state.locale,
        learningObjective: state.mission.objective,
        bucketBasisPoints: StarterSplit,
        completedPaidWork:
          completedPaid === 0
            ? "none"
            : completedPaid === paidTotal
              ? "all"
              : "some",
        savedTowardGoal: state.payday.allocation.save > 0,
      });
      state.moneyMoment = {
        card: result.card,
        source: result.source,
        generatedAt: new Date().toISOString(),
      };
      console.info(
        JSON.stringify({
          event: "money_moment_generated",
          requestId,
          model:
            result.source === "openai"
              ? "gpt-5.6-sol"
              : "deterministic-fallback",
          latencyMs: result.latencyMs,
          locale: state.locale,
          ageBand: state.child.ageBand,
          objective: state.mission.objective,
          schemaValid: true,
          fallbackReason: result.fallbackReason,
        }),
      );
    } else {
      applyDemoCommand(session, command);
    }

    const response = NextResponse.json(snapshot(session), {
      headers: jsonHeaders(requestId),
    });
    setSessionCookie(response, session);
    return response;
  } catch (error) {
    const code = error instanceof Error ? error.message : "REQUEST_REJECTED";
    const status =
      code === "DEMO_CAPACITY_REACHED"
        ? 503
        : code === "RATE_LIMITED" ||
            code === "DEMO_LEDGER_CAPACITY_REACHED" ||
            code === "DEMO_HISTORY_CAPACITY_REACHED"
          ? 429
          : code.includes("REJECTED")
            ? 403
            : 400;
    return NextResponse.json(
      { error: { code: code.startsWith("[") ? "VALIDATION_FAILED" : code } },
      { status, headers: jsonHeaders(requestId) },
    );
  }
}
