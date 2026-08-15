import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/admin-session";

// Compara em tempo constante (via digest de tamanho fixo) para não
// vazar, pelo tempo de resposta, quantos caracteres da senha batem.
function passwordMatches(input: string, expected: string): boolean {
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurado no servidor." },
      { status: 500 }
    );
  }

  if (typeof password !== "string" || !passwordMatches(password, expected)) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
