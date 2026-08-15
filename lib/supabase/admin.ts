import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente admin — usa a service_role key. Só pode ser importado por
// código que roda no servidor (rotas app/api/**), nunca por
// componentes de cliente. O pacote "server-only" faz o build falhar
// se isso acontecer por engano.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
