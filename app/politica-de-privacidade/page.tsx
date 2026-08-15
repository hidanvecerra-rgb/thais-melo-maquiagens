import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BookingProvider from "@/components/BookingProvider";
import { BRAND } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como ${BRAND.legalName} trata os dados informados no agendamento online.`,
};

export default function PoliticaDePrivacidadePage() {
  return (
    <BookingProvider>
      <Header />
      <main>
        <section>
          <div className="container" style={{ maxWidth: "760px" }}>
            <span className="eyebrow">Privacidade</span>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginBottom: "28px" }}>
              Política de Privacidade
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <p style={{ color: "var(--muted)" }}>
                Esta página explica, de forma simples, quais dados o site de{" "}
                {BRAND.legalName} coleta e para que eles são usados.
              </p>

              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  Quais dados coletamos
                </h2>
                <p style={{ color: "var(--muted)" }}>
                  Quando você agenda um horário pelo site, coletamos seu
                  nome, número de WhatsApp, o serviço escolhido, a data e o
                  horário desejados, e as observações que você escrever
                  sobre o estilo de maquiagem.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  Para que usamos esses dados
                </h2>
                <p style={{ color: "var(--muted)" }}>
                  Exclusivamente para gerenciar e confirmar o seu
                  agendamento — {BRAND.name} recebe essas informações para
                  entrar em contato pelo WhatsApp e preparar o seu
                  atendimento. Não vendemos nem compartilhamos seus dados
                  com terceiros.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  Cookies
                </h2>
                <p style={{ color: "var(--muted)" }}>
                  O site público não usa cookies de rastreamento ou
                  publicidade. A única área que usa um cookie é o painel
                  administrativo interno (acesso restrito à profissional),
                  que usa um cookie técnico de sessão só para manter o
                  login — ele não coleta dados de navegação de clientes.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                  Como falar sobre seus dados
                </h2>
                <p style={{ color: "var(--muted)" }}>
                  Para pedir a exclusão dos seus dados ou tirar dúvidas
                  sobre esta política, entre em contato pelo WhatsApp{" "}
                  {BRAND.phoneDisplay}.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </BookingProvider>
  );
}
