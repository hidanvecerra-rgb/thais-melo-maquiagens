import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isSessionTokenValid(token)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("agendamentos")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Erro ao buscar agendamentos", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 }
    );
  }

  return NextResponse.json({ agendamentos: data });
}
