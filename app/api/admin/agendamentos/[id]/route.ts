import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!isSessionTokenValid(token)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  // Cancelamento é lógico (status = 'cancelado'), não exclusão física —
  // preserva histórico e libera o horário automaticamente (o índice único
  // de date+time ignora linhas canceladas).
  const { error } = await supabaseAdmin
    .from("agendamentos")
    .update({ status: "cancelado" })
    .eq("id", params.id);

  if (error) {
    console.error("Erro ao cancelar agendamento", error);
    return NextResponse.json(
      { error: "Erro ao cancelar agendamento." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
