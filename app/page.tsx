import ImpactCalculator from "./components/ImpactCalculator"
import CasesSection from "./components/CasesSection"
import AgendarModal from "./components/AgendarModal"
import ServicesSection from "./components/ServicesSection"

const C = {
  bg:         "#0C1009",
  surface:    "#131A0F",
  card:       "#172014",
  border:     "#1E2E18",
  green:      "#2FA36B",
  greenDim:   "#1A5C3C",
  greenFaint: "#0D2318",
  text:       "#E8EDE6",
  muted:      "#9DB096",
} as const

const metrics = [
  { value: "75%",  label: "menos tempo operacional",   sub: "Pro Water · automação comercial" },
  { value: "4",    label: "sistemas entregues",        sub: "hubs · apps · automações com IA" },
  { value: "3 × 1", label: "uma pessoa rende como equipe", sub: "com o sistema certo" },
]

const services = [
  { tag: "SISTEMA",    title: "Sistemas internos sob medida", desc: "Sua planilha vira sistema. Sua equipe para de perder tempo com processo manual e passa a alimentar uma ferramenta que trabalha sozinha." },
  { tag: "AUTOMAÇÃO",  title: "Automação com IA",              desc: "O relatório que hoje leva 3 horas para ficar pronto passa a chegar pronto, todo dia, sem ninguém copiar e colar nada." },
  { tag: "CONTEÚDO",   title: "Marketing com IA",              desc: "Planejamento, arte e legenda prontos todo mês, com relatório de resultado. Você decide o que vai pro ar, eu cuido do resto." },
  { tag: "SITE",       title: "Site institucional",            desc: "Presença profissional pronta em até 3 semanas, sem depender de agência." },
]

const cases = [
  {
    company: "Maior empresa de clorados do RJ",
    project: "Hub de Marketing",
    tag: "Sistema interno",
    before: "KPIs em planilha, tarefas no WhatsApp, briefings em e-mail, influenciadores em outro arquivo.",
    after:  "Hub centralizado com painel de margem, kanban de demandas, mapeamento de influenciadores e calendário de campanhas.",
  },
  {
    company: "Maior empresa de clorados do RJ",
    project: "Hub Comercial",
    tag: "Sistema interno",
    before: "Informações críticas espalhadas em 4 sistemas. O vendedor abria quatro telas para fechar uma venda.",
    after:  "Uma tela: BI de vendas, clientes inadimplentes, contratos, saldo de entregas e cadastro de pedidos.",
  },
  {
    company: "Maior empresa de clorados do RJ",
    project: "Automação Comercial",
    tag: "Automação + IA",
    before: "Equipe preenchia relatório manual. Diretor recebia dados atrasados.",
    after:  "75% menos tempo operacional. Resumo automático diário entregue à diretoria toda manhã.",
  },
  {
    company: "Projeto próprio",
    project: "Gestor: App Financeiro",
    tag: "Sistema + IA",
    before: "Controle financeiro pessoal e MEI em planilhas separadas, sem visão integrada, sem automação.",
    after:  "Sistema completo com Open Finance, categorização por IA, painel de investimentos e conciliação ao centavo.",
  },
]

const skills = [
  "Next.js + TypeScript", "Supabase + PostgreSQL",
  "IA aplicada (Gemini)",  "Looker Studio + BI",
  "Open Finance (Pluggy)", "Automação de processos",
  "Economia + DRE",        "Trade marketing",
]

const WA = "https://wa.me/5521991711204?text=Ol%C3%A1%2C+JP%21+Vi+seu+site+e+quero+conversar+sobre+um+projeto."

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "JP Abrahao",
  url: "https://jpabrahao.com.br",
  description: "Sistemas internos sob medida, automação de processos com IA e marketing com IA para pequenas e médias empresas.",
  areaServed: {
    "@type": "City",
    name: "Rio de Janeiro",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.desc,
      },
    })),
  },
}

export default function Page() {
  const font  = { fontFamily: "var(--font-inter), system-ui, sans-serif" }
  const titleFont  = { fontFamily: "var(--font-inter), sans-serif" }
  const label = { fontSize: 12, ...titleFont, color: C.green, letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }
  const h2    = { ...titleFont, fontWeight: 700, fontSize: "clamp(30px, 4.4vw, 44px)", letterSpacing: "-0.02em", color: C.text, marginTop: 14 }
  const wrap  = { maxWidth: 1100, margin: "0 auto", padding: "0 24px" }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ ...font, backgroundColor: C.bg, color: C.text }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: C.bg + "F0", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...wrap, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ ...titleFont, fontWeight: 700, fontSize: 20, color: C.green, letterSpacing: "-0.02em" }}>JP Abrahao</span>
          <AgendarModal style={{ ...titleFont, backgroundColor: C.green, color: C.bg, padding: "9px 22px", borderRadius: 6, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            Agendar diagnóstico
          </AgendarModal>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ ...wrap, padding: "96px 24px 80px" }}>
        <div className="hero-grid" style={{ marginBottom: 64 }}>
          <div>
            <div className="fade-up-1" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
              <span className="pulse-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: C.green }} />
              <span style={{ ...titleFont, fontSize: 12, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
                Disponível para novos projetos
              </span>
            </div>

            <h1 className="fade-up-2" style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 780 }}>
              Sua empresa não precisa{" "}
              <span style={{ color: C.green }}>de uma software house</span>.
              <br />
              <span style={{ fontWeight: 400, color: C.muted }}>Precisa de resultado.</span>
            </h1>

            <p className="fade-up-3" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: C.muted, lineHeight: 1.7, maxWidth: 560 }}>
              Sistema sob medida, automação de processos e marketing com inteligência artificial para empresas que querem reduzir custo operacional sem aumentar a folha.
            </p>
          </div>

          <div className="fade-up-3">
            <ImpactCalculator colors={C} />
          </div>
        </div>

        <div className="fade-up-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {metrics.map((m) => (
            <div key={m.value} style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${C.green}`, borderRadius: 8, padding: "24px 24px 20px" }}>
              <div style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(30px, 4vw, 46px)", color: C.text, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>{m.value}</div>
              <div style={{ fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.02em" }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={wrap}><div style={{ height: 1, backgroundColor: C.border }} /></div>

      {/* PROBLEMA */}
      <section style={{ ...wrap, padding: "104px 24px" }}>
        <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", lineHeight: 1.7, color: C.muted, maxWidth: 700 }}>
          Toda pequena e média empresa chega no mesmo ponto.{" "}
          <span style={{ color: C.text }}>Paga três pessoas para fazer o que um sistema resolve sozinho.</span>{" "}
          Ou precisa de tecnologia sob medida e não tem orçamento para contratar uma software house.{" "}
          <span style={{ color: C.green }}>Os dois problemas têm a mesma solução, e ela custa uma fração do que você imagina.</span>
        </p>
      </section>

      {/* SERVIÇOS */}
      <section style={{ ...wrap, padding: "8px 24px 112px" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={label}>Serviços</span>
          <h2 style={h2}>O que entrego</h2>
        </div>
        <ServicesSection services={services} colors={C} />
      </section>

      {/* DIAGNÓSTICO */}
      <section style={{ ...wrap, padding: "0 24px 112px" }}>
        <div
          style={{
            border: `1px solid ${C.green}`,
            backgroundColor: C.greenFaint,
            borderRadius: 16,
            padding: "56px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center" as const,
            gap: 20,
          }}
        >
          <span style={label}>Sem custo</span>
          <h2 style={{ ...h2, marginTop: 0 }}>Diagnóstico gratuito, 30 minutos</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: C.muted, maxWidth: 620 }}>
            Eu atendo poucos diagnósticos por semana. Cada projeto recebe atenção real, não fila de agência. Nessa conversa eu te digo, sem custo, onde sua empresa está perdendo tempo e dinheiro, e se dá para resolver.
          </p>
          <AgendarModal style={{ ...titleFont, display: "inline-block", backgroundColor: C.green, color: C.bg, padding: "15px 36px", borderRadius: 8, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", marginTop: 8 }}>
            Agendar diagnóstico
          </AgendarModal>
        </div>
      </section>

      {/* CASES */}
      <CasesSection cases={cases} colors={C} wrap={wrap} label={label} h2={h2} />

      {/* SOBRE */}
      <section style={{ ...wrap, padding: "112px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <span style={label}>Sobre</span>
            <h2 style={{ ...h2, marginBottom: 26 }}>Quem resolve o problema</h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75 }}>
              Economista pela UFF. Trabalho todo dia com dados, processo e automação com IA, dentro da maior empresa de clorados do Rio de Janeiro. Uso o que aprendo lá para resolver o mesmo problema em empresas menores, que não têm um departamento de TI para chamar.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {skills.map((s) => (
              <div key={s} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "10px 14px", fontSize: 13, color: C.muted, fontWeight: 500 }}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: C.greenFaint, borderTop: `1px solid ${C.greenDim}` }}>
        <div style={{ ...wrap, padding: "112px 24px", textAlign: "center" as const }}>
          <h2 style={{ ...titleFont, fontWeight: 700, fontSize: "clamp(32px, 5vw, 58px)", letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, marginBottom: 20 }}>
            Pronto para pagar menos<br />e entregar mais?
          </h2>
          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, marginBottom: 40 }}>Me conta o problema. A conversa é de graça.</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <AgendarModal style={{ ...titleFont, display: "inline-block", backgroundColor: C.green, color: C.bg, padding: "16px 40px", borderRadius: 8, fontWeight: 700, fontSize: 18, border: "none", cursor: "pointer" }}>
              Agendar diagnóstico gratuito
            </AgendarModal>
            <a href={WA} target="_blank" rel="noopener noreferrer"
               style={{ fontSize: 14, color: C.muted, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Prefiro falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.bg }}>
        <div style={{ ...wrap, padding: "24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12 }}>
          <span style={{ ...titleFont, fontWeight: 700, fontSize: 16, color: C.green }}>JP Abrahao</span>
          <span style={{ fontSize: 13, color: C.muted }}>© 2026 · jpabrahao.com.br</span>
        </div>
      </footer>

    </main>
    </>
  )
}
