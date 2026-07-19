import { timingSafeEqual } from "node:crypto";

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let originHost: string | null = null;
  try {
    originHost = origin ? new URL(origin).host : null;
  } catch {
    originHost = null;
  }
  if (!originHost || !host || originHost !== host) {
    throw new Error("ORIGIN_REJECTED");
  }
}

export function assertCsrf(expected: string, supplied: string | null): void {
  if (!supplied) throw new Error("CSRF_REJECTED");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    throw new Error("CSRF_REJECTED");
  }
}
