import { createClient } from "@supabase/supabase-js";

// Cliente do navegador — usa a chave anônima (pública). RLS no banco
// restringe o que essa chave consegue fazer: só criar agendamentos e
// ler a view "horarios_ocupados" (sem dados de clientes).
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
