"use client"

import { Fragment, useEffect, useState, type ComponentType } from "react"
import Link from "next/link"
import {
  BarChart3, AlertTriangle, ClipboardList, FileText, Truck, TrendingUp, X,
  ChevronLeft, ChevronRight, ChevronDown, Undo2, Redo2, Printer, Paintbrush, DollarSign, Percent,
  Plus, LayoutGrid, Users, Settings,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { hubComercialDemoData as D, produtosFicticios } from "../../lib/casesData"

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
  amber:      "#D9A03C",
  amberFaint: "#2E230D",
  red:        "#C2544A",
  redFaint:   "#2A1714",
} as const

const syne = { fontFamily: "var(--font-syne), sans-serif" }

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
}

type CardKey = "bi-vendas" | "inadimplentes" | "pedidos" | "contratos" | "entregas" | "analise"

type CardDef = {
  key: CardKey
  tag: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  title: string
  desc: string
  disponivel: boolean
}

const CARDS: CardDef[] = [
  { key: "bi-vendas", tag: "Analytics", icon: BarChart3, title: "BI de Vendas", desc: "Painel de metas, faturamento e ranking de vendedores em tempo real.", disponivel: true },
  { key: "inadimplentes", tag: "Financeiro", icon: AlertTriangle, title: "Clientes Inadimplentes", desc: "Inadimplencia consolidada por representante e por cliente.", disponivel: true },
  { key: "pedidos", tag: "Operacional", icon: ClipboardList, title: "Cadastro de Pedidos", desc: "Lancamento e acompanhamento de pedidos em um unico lugar.", disponivel: true },
  { key: "contratos", tag: "Comercial", icon: FileText, title: "Contratos Comerciais", desc: "Gestao de contratos, vigencias e condicoes comerciais.", disponivel: true },
  { key: "entregas", tag: "Logistica", icon: Truck, title: "Saldo de Entregas", desc: "Acompanhamento do saldo de entregas por pedido e por rota.", disponivel: true },
  { key: "analise", tag: "Analise", icon: TrendingUp, title: "Analise de Vendas", desc: "Tendencias, sazonalidade e projecao de vendas.", disponivel: true },
]

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #DADCE0", borderRadius: 6, padding: "8px 12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
      <div style={{ color: "#5F6368", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {brl(p.value)}</div>
      ))}
    </div>
  )
}

export default function HubComercialDemoPage() {
  const [modalAberto, setModalAberto] = useState<CardKey | null>(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!modalAberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalAberto(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [modalAberto])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(false), 2200)
    return () => clearTimeout(t)
  }, [toast])

  function abrirCard(card: CardDef) {
    if (card.disponivel) setModalAberto(card.key)
    else setToast(true)
  }

  return (
    <main style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", backgroundColor: C.bg, color: C.text, minHeight: "100vh" }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "10px 24px", fontSize: 13, color: C.muted, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.muted, textDecoration: "none" }}>
          <span aria-hidden>←</span> Voltar ao site
        </Link>
        <span style={{ fontStyle: "italic" as const }}>Demonstracao com dados ficticios</span>
      </div>

      {/* HERO */}
      <section
        style={{
          background: `radial-gradient(circle at 20% 0%, ${C.greenFaint} 0%, transparent 60%), ${C.bg}`,
          borderBottom: `1px solid ${C.border}`,
          padding: "56px 24px 48px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...syne, fontSize: 12, fontWeight: 700, color: C.green, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
            Hub Comercial
          </span>
          <h1 style={{ ...syne, fontWeight: 800, fontSize: "clamp(30px, 4.6vw, 46px)", letterSpacing: "-0.02em", color: C.text, marginTop: 10, marginBottom: 14 }}>
            Central de Decisao
          </h1>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, maxWidth: 560, marginBottom: 20 }}>
            Acesso rapido a todos os dados e ferramentas operacionais em um so lugar.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: C.greenFaint, border: `1px solid ${C.greenDim}`, borderRadius: 999, padding: "6px 14px" }}>
            <span className="pulse-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", backgroundColor: C.green }} />
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Demonstracao · dados ficticios</span>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
          {CARDS.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => abrirCard(card)}
                style={{
                  textAlign: "left" as const, backgroundColor: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 14,
                  font: "inherit", color: "inherit", cursor: "pointer", position: "relative" as const,
                  opacity: card.disponivel ? 1 : 0.65,
                }}
              >
                {!card.disponivel && (
                  <span style={{ position: "absolute", top: 14, right: 14, ...syne, fontSize: 10, fontWeight: 700, color: C.amber, backgroundColor: C.amberFaint, padding: "3px 9px", borderRadius: 999, letterSpacing: "0.04em" }}>
                    Em breve
                  </span>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: C.greenFaint, display: "flex", alignItems: "center", justifyContent: "center", color: C.green }}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  {card.disponivel && (
                    <span style={{ ...syne, fontSize: 10, fontWeight: 700, color: C.green, backgroundColor: C.greenFaint, padding: "3px 9px", borderRadius: 4, letterSpacing: "0.05em" }}>
                      {card.tag.toUpperCase()}
                    </span>
                  )}
                  {!card.disponivel && (
                    <span style={{ ...syne, fontSize: 10, fontWeight: 700, color: C.muted, backgroundColor: C.surface, padding: "3px 9px", borderRadius: 4, letterSpacing: "0.05em" }}>
                      {card.tag.toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 style={{ ...syne, fontWeight: 700, fontSize: 17, color: C.text, lineHeight: 1.3 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, flex: 1 }}>{card.desc}</p>

                <span
                  style={{
                    ...syne, fontSize: 12, fontWeight: 700, marginTop: "auto",
                    color: card.disponivel ? C.bg : C.muted,
                    backgroundColor: card.disponivel ? C.green : C.surface,
                    border: card.disponivel ? "none" : `1px solid ${C.border}`,
                    borderRadius: 6, padding: "9px 0", textAlign: "center" as const,
                  }}
                >
                  Abrir {card.title}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {modalAberto === "bi-vendas" && <BiVendasModal onClose={() => setModalAberto(null)} />}
      {modalAberto === "inadimplentes" && <InadimplentesModal onClose={() => setModalAberto(null)} />}
      {modalAberto === "pedidos" && <PedidosModal onClose={() => setModalAberto(null)} />}
      {modalAberto === "contratos" && <ContratosModal onClose={() => setModalAberto(null)} />}
      {modalAberto === "entregas" && <EntregasModal onClose={() => setModalAberto(null)} />}
      {modalAberto === "analise" && <AnaliseVendasModal onClose={() => setModalAberto(null)} />}

      {toast && (
        <div
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 300,
            backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 20px",
            fontSize: 13, color: C.text, boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          }}
        >
          Essa ferramenta ainda esta em desenvolvimento.
        </div>
      )}
    </main>
  )
}

/* ============================================================
   MODAL "BI DE VENDAS" — replica de painel Looker Studio.
   Fundo e paleta proprios (cinza claro + azul), nao usa o tema
   escuro do site aqui dentro.
   ============================================================ */

const LOOKER = {
  bg:       "#F1F3F4",
  panel:    "#FFFFFF",
  border:   "#DADCE0",
  headBg:   "#F8F9FA",
  blue:     "#1A5FB4",
  bluePill: "#E8F0FE",
  blueText: "#174EA6",
  ink:      "#202124",
  inkMuted: "#5F6368",
  gold:     "#E8A33D",
  good:     "#1E8E3E",
  bad:      "#D8481D",
} as const

function LookerKpi({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, padding: "10px 14px" }}>
      <div style={{ fontSize: 10, color: LOOKER.inkMuted, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.03em" }}>{rotulo}</div>
      <div style={{ fontWeight: 700, fontSize: 18, color: LOOKER.ink }}>{valor}</div>
    </div>
  )
}

function LookerPill({ texto }: { texto: string }) {
  return (
    <div style={{ backgroundColor: LOOKER.bluePill, border: `1px solid ${LOOKER.border}`, borderRadius: 4, padding: "10px 14px", display: "flex", alignItems: "center", fontSize: 12, color: LOOKER.blueText, fontWeight: 500 }}>
      {texto}
    </div>
  )
}

function LookerDropdown({ label }: { label: string }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 4, padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: LOOKER.blueText, fontWeight: 500 }}>
      {label}
      <span style={{ fontSize: 9 }}>▾</span>
    </div>
  )
}

// Mesmo visual do LookerDropdown, mas com <select> real por baixo — filtro
// funcional de verdade, sem precisar de backend.
function LookerSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative" as const }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none" as const, WebkitAppearance: "none" as const,
          backgroundColor: "#fff", border: "none", borderRadius: 4, padding: "9px 22px 9px 12px",
          fontSize: 12, color: LOOKER.blueText, fontWeight: 500, width: "100%", cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span style={{ position: "absolute" as const, right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 9, pointerEvents: "none" as const, color: LOOKER.blueText }}>▾</span>
    </div>
  )
}

function LookerPagination() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, padding: "6px 10px", borderTop: `1px solid ${LOOKER.border}`, fontSize: 10, color: LOOKER.inkMuted }}>
      <span>1 - 5 / 40</span>
      <ChevronLeft size={12} />
      <ChevronRight size={12} />
    </div>
  )
}

function pctNum(s: string) {
  return parseFloat(s.replace(",", "."))
}

function LookerPctCell({ texto }: { texto: string }) {
  const acima = pctNum(texto) >= 100
  return <span style={{ fontWeight: 700, color: acima ? LOOKER.good : LOOKER.bad }}>{texto}</span>
}

function BiVendasModal({ onClose }: { onClose: () => void }) {
  const d = D.biVendas
  const teto = Math.max(...d.graficoMetaFaturamento.flatMap((m) => [m.meta, m.faturamento]), 1)

  const [vendedorFiltro, setVendedorFiltro] = useState("Todos")
  const [redeFiltro, setRedeFiltro] = useState("Todos")
  const [produtoFiltro, setProdutoFiltro] = useState("Todos")

  // Agregado "por rede" a partir do mesmo ranking de vendedores (sem inventar dado novo).
  const porRede = Object.values(
    d.rankingVendedores.reduce<Record<string, { rede: string; associado: number; meta: number; valor: number }>>((acc, v) => {
      const atual = acc[v.rede] ?? { rede: v.rede, associado: 0, meta: 0, valor: 0 }
      atual.associado += 1
      atual.meta += v.meta
      atual.valor += v.valor
      acc[v.rede] = atual
      return acc
    }, {})
  ).map((r) => ({ ...r, percentual: `${Math.round((r.valor / r.meta) * 100)}%` }))

  // Tabela "Cliente" reaproveita os mesmos clientes ficticios ja usados em clientesInadimplentes,
  // so trocando o rotulo de leitura (mesma base de dado, sem criar cliente novo).
  const porCliente = D.clientesInadimplentes.porCliente

  const vendedoresExibidos = vendedorFiltro === "Todos" ? d.rankingVendedores : d.rankingVendedores.filter((v) => v.vendedor === vendedorFiltro)
  const redesExibidas = redeFiltro === "Todos" ? porRede : porRede.filter((r) => r.rede === redeFiltro)

  const produtosOrdenados = [...d.rankingProdutos].sort((a, b) => b.valor - a.valor)
  const maxProduto = produtosOrdenados[0]?.valor ?? 1
  const produtosExibidos = produtoFiltro === "Todos" ? produtosOrdenados : produtosOrdenados.filter((p) => p.produto === produtoFiltro)

  const thStyle: React.CSSProperties = { padding: "5px 8px", fontWeight: 400, fontStyle: "italic", color: LOOKER.inkMuted, textAlign: "left", borderBottom: `1px solid ${LOOKER.border}` }
  const tdStyle: React.CSSProperties = { padding: "5px 8px", color: LOOKER.ink }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: LOOKER.bg, borderRadius: 8, overflow: "hidden",
          maxWidth: 1080, width: "100%", maxHeight: "92vh",
          display: "flex", fontFamily: "Arial, Helvetica, sans-serif", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        >
          <X size={15} />
        </button>

        {/* SIDEBAR */}
        <div style={{ width: 168, flexShrink: 0, backgroundColor: LOOKER.blue, color: "#fff", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
            HC
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>META x REAL</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <LookerSelect
              value={vendedorFiltro}
              onChange={setVendedorFiltro}
              options={["Todos", ...d.rankingVendedores.map((v) => v.vendedor)]}
            />
            <LookerSelect
              value={redeFiltro}
              onChange={setRedeFiltro}
              options={["Todos", ...porRede.map((r) => r.rede)]}
            />
            <LookerDropdown label="Categoria" />
            <LookerSelect
              value={produtoFiltro}
              onChange={setProdutoFiltro}
              options={["Todos", ...produtosFicticios.map((p) => p.nome)]}
            />
          </div>
        </div>

        {/* CONTEUDO */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px 8px", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(120px, 1fr))", gap: 8, marginBottom: 8 }}>
            <LookerKpi rotulo="Positivacao" valor={d.positivacao} />
            <LookerKpi rotulo="Velocidade do dia" valor={d.velocidadeDia} />
            <LookerPill texto="p_base: Faturado" />
            <LookerPill texto="p_metrica: Valor (R$)" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
            <LookerKpi rotulo="Meta" valor={brl(d.meta)} />
            <LookerKpi rotulo="Carteira" valor={brl(d.carteira)} />
            <LookerKpi rotulo="Valor" valor={brl(d.valor)} />
            <LookerKpi rotulo="Atingido (%)" valor={d.atingido} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 12, alignItems: "start" }}>
            {/* GRAFICO + RANKING DE PRODUTOS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, padding: "14px 12px 6px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LOOKER.ink, marginBottom: 8 }}>Meta x Faturamento</div>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={d.graficoMetaFaturamento} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke={LOOKER.border} vertical={false} />
                    <XAxis dataKey="mes" stroke={LOOKER.inkMuted} fontSize={10} tickLine={false} axisLine={{ stroke: LOOKER.border }} />
                    <YAxis stroke={LOOKER.inkMuted} fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} domain={[0, teto]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="meta" name="Meta" fill={LOOKER.blue} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="faturamento" name="Faturamento" fill={LOOKER.gold} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, padding: "14px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: LOOKER.ink, marginBottom: 10 }}>Ranking de Produtos</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {produtosExibidos.map((p) => (
                    <div key={p.produto}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: LOOKER.ink, marginBottom: 3 }}>
                        <span>{p.produto}</span>
                        <span style={{ fontWeight: 600 }}>{brl(p.valor)}</span>
                      </div>
                      <div style={{ height: 8, backgroundColor: LOOKER.headBg, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(p.valor / maxProduto) * 100}%`, backgroundColor: LOOKER.blue, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TABELAS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ backgroundColor: LOOKER.headBg, padding: "6px 8px", fontSize: 10, fontWeight: 700, color: LOOKER.ink, borderBottom: `1px solid ${LOOKER.border}` }}>Vendedor</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>nome</th>
                      <th style={thStyle}>rede</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>meta</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>valor</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>%atingido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedoresExibidos.map((v, i) => (
                      <tr key={v.vendedor} style={{ backgroundColor: i % 2 === 1 ? LOOKER.headBg : "transparent" }}>
                        <td style={tdStyle}>{v.vendedor}</td>
                        <td style={{ ...tdStyle, color: LOOKER.inkMuted }}>{v.rede}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{brl(v.meta)}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{brl(v.valor)}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}><LookerPctCell texto={v.percentual} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <LookerPagination />
              </div>

              <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ backgroundColor: LOOKER.headBg, padding: "6px 8px", fontSize: 10, fontWeight: 700, color: LOOKER.ink, borderBottom: `1px solid ${LOOKER.border}` }}>Rede</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>rede</th>
                      <th style={thStyle}>associado</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>meta</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>valor</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>%atingido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redesExibidas.map((r, i) => (
                      <tr key={r.rede} style={{ backgroundColor: i % 2 === 1 ? LOOKER.headBg : "transparent" }}>
                        <td style={tdStyle}>{r.rede}</td>
                        <td style={{ ...tdStyle, color: LOOKER.inkMuted }}>{r.associado}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{brl(r.meta)}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{brl(r.valor)}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}><LookerPctCell texto={r.percentual} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <LookerPagination />
              </div>

              <div style={{ backgroundColor: LOOKER.panel, border: `1px solid ${LOOKER.border}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ backgroundColor: LOOKER.headBg, padding: "6px 8px", fontSize: 10, fontWeight: 700, color: LOOKER.ink, borderBottom: `1px solid ${LOOKER.border}` }}>Cliente</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>cliente</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>valor</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>m.c.%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porCliente.map((cl, i) => (
                      <tr key={cl.nome} style={{ backgroundColor: i % 2 === 1 ? LOOKER.headBg : "transparent" }}>
                        <td style={tdStyle}>{cl.nome}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}>{brl(cl.valor)}</td>
                        <td style={{ ...tdStyle, textAlign: "right" }}><LookerPctCell texto={cl.percentual} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <LookerPagination />
              </div>
            </div>
          </div>

          <p style={{ fontSize: 10, color: LOOKER.inkMuted, margin: "10px 0 4px", fontStyle: "italic" }}>
            Demonstracao com dados ficticios, para ilustrar a capacidade tecnica.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL "CLIENTES INADIMPLENTES" — replica de planilha Google Sheets.
   Fundo e paleta proprios (branco + teal), nao usa o tema escuro
   do site aqui dentro.
   ============================================================ */

const SHEETS = {
  bg:      "#FFFFFF",
  border:  "#D3D3D3",
  headBg:  "#F3F3F3",
  teal:    "#3D8B8B",
  ink:     "#202124",
  inkMuted:"#5F6368",
  amber:   "#B06000",
} as const

const SHEETS_TABS = ["DASH", "Detalhe1", "Detalhe2", "BASE"]

function SheetsToolbarIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 26, height: 26, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: SHEETS.inkMuted }}>
      {children}
    </div>
  )
}

function SheetsChevron({ aberto }: { aberto: boolean }) {
  return (
    <ChevronDown
      size={13}
      style={{ transition: "transform 150ms ease", transform: aberto ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0, color: SHEETS.inkMuted }}
    />
  )
}

function InadimplentesModal({ onClose }: { onClose: () => void }) {
  const d = D.clientesInadimplentes
  const [aba, setAba] = useState("DASH")
  const [repAberto, setRepAberto] = useState<string | null>(null)
  const [clienteAberto, setClienteAberto] = useState<string | null>(null)

  const totalRepresentante = d.porRepresentante.reduce((s, r) => s + r.valor, 0)

  const thStyle: React.CSSProperties = { padding: "5px 8px", fontSize: 11, fontStyle: "italic", fontWeight: 400, color: SHEETS.inkMuted, textAlign: "left", backgroundColor: SHEETS.headBg, border: `1px solid ${SHEETS.border}` }
  const tdStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 12, color: SHEETS.ink, border: `1px solid ${SHEETS.border}` }
  const detalheThStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 10, fontStyle: "italic", fontWeight: 400, color: SHEETS.inkMuted, textAlign: "left", backgroundColor: "#EAEAEA", border: `1px solid ${SHEETS.border}` }
  const detalheTdStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 11, color: SHEETS.ink, border: `1px solid ${SHEETS.border}` }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: SHEETS.bg, borderRadius: 8, overflow: "hidden",
          maxWidth: 1140, width: "100%", maxHeight: "95vh",
          display: "flex", flexDirection: "column", fontFamily: "Arial, Helvetica, sans-serif", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        >
          <X size={15} />
        </button>

        {/* TOOLBAR FICTICIA */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderBottom: `1px solid ${SHEETS.border}` }}>
          <SheetsToolbarIcon><Undo2 size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Redo2 size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Printer size={15} /></SheetsToolbarIcon>
          <div style={{ width: 1, height: 16, backgroundColor: SHEETS.border, margin: "0 4px" }} />
          <SheetsToolbarIcon><Paintbrush size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><DollarSign size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Percent size={15} /></SheetsToolbarIcon>
        </div>

        {/* CABECALHO TEAL */}
        <div style={{ backgroundColor: SHEETS.teal, color: "#fff", textAlign: "center", padding: "22px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>INADIMPLENTES</div>
          <div style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 700, marginTop: 8 }}>{brl(d.totalInadimplencia)}</div>
        </div>

        {/* CORPO PLANILHA */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: SHEETS.ink, marginBottom: 6, textTransform: "uppercase" as const }}>Margem por representante</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Vendedor</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Valor</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {d.porRepresentante.map((r) => {
                    const aberto = repAberto === r.nome
                    const detalhe = d.detalhePorRepresentante[r.nome] ?? []
                    return (
                      <Fragment key={r.nome}>
                        <tr
                          onClick={() => setRepAberto(aberto ? null : r.nome)}
                          style={{ cursor: "pointer" }}
                        >
                          <td style={tdStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <SheetsChevron aberto={aberto} />
                              {r.nome}
                            </div>
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{brl(r.valor)}</td>
                          <td style={{ ...tdStyle, textAlign: "right", color: SHEETS.amber, fontWeight: 700 }}>{r.percentual}</td>
                        </tr>
                        {aberto && (
                          <tr>
                            <td colSpan={3} style={{ padding: 0, border: `1px solid ${SHEETS.border}`, backgroundColor: "#F7F7F7" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                  <tr>
                                    <th style={detalheThStyle}>Cliente</th>
                                    <th style={detalheThStyle}>Vencimento</th>
                                    <th style={{ ...detalheThStyle, textAlign: "right" }}>Valor</th>
                                    <th style={detalheThStyle}>Número da NF</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detalhe.map((t, i) => (
                                    <tr key={i}>
                                      <td style={detalheTdStyle}>{t.cliente}</td>
                                      <td style={detalheTdStyle}>{t.vencimento}</td>
                                      <td style={{ ...detalheTdStyle, textAlign: "right" }}>{brl(t.valor)}</td>
                                      <td style={detalheTdStyle}>{t.numeroNF}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                  <tr>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>Total geral</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{brl(totalRepresentante)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: SHEETS.ink, marginBottom: 6, textTransform: "uppercase" as const }}>Margem por cliente</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Cliente</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>Valor</th>
                    <th style={{ ...thStyle, textAlign: "right" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {d.porCliente.map((cl) => {
                    const aberto = clienteAberto === cl.nome
                    const detalhe = d.detalhePorCliente[cl.nome] ?? []
                    return (
                      <Fragment key={cl.nome}>
                        <tr
                          onClick={() => setClienteAberto(aberto ? null : cl.nome)}
                          style={{ cursor: "pointer" }}
                        >
                          <td style={tdStyle}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <SheetsChevron aberto={aberto} />
                              {cl.nome}
                            </div>
                          </td>
                          <td style={{ ...tdStyle, textAlign: "right" }}>{brl(cl.valor)}</td>
                          <td style={{ ...tdStyle, textAlign: "right", color: SHEETS.amber, fontWeight: 700 }}>{cl.percentual}</td>
                        </tr>
                        {aberto && (
                          <tr>
                            <td colSpan={3} style={{ padding: 0, border: `1px solid ${SHEETS.border}`, backgroundColor: "#F7F7F7" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                  <tr>
                                    <th style={detalheThStyle}>Título</th>
                                    <th style={detalheThStyle}>Vencimento</th>
                                    <th style={{ ...detalheThStyle, textAlign: "right" }}>Valor</th>
                                    <th style={detalheThStyle}>Número da NF</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detalhe.map((t, i) => (
                                    <tr key={i}>
                                      <td style={detalheTdStyle}>{t.titulo}</td>
                                      <td style={detalheTdStyle}>{t.vencimento}</td>
                                      <td style={{ ...detalheTdStyle, textAlign: "right" }}>{brl(t.valor)}</td>
                                      <td style={detalheTdStyle}>{t.numeroNF}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p style={{ fontSize: 10, color: SHEETS.inkMuted, marginTop: 16, fontStyle: "italic" }}>
            Demonstracao com dados ficticios, para ilustrar a capacidade tecnica.
          </p>
        </div>

        {/* ABAS FICTICIAS */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "4px 8px", borderTop: `1px solid ${SHEETS.border}`, backgroundColor: SHEETS.headBg }}>
          {SHEETS_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAba(t)}
              style={{
                fontSize: 11, padding: "6px 12px", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer",
                backgroundColor: aba === t ? "#fff" : "transparent",
                color: aba === t ? SHEETS.ink : SHEETS.inkMuted,
                fontWeight: aba === t ? 700 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL "CADASTRO DE PEDIDOS" — replica do sistema real "FASE BETA".
   Tema escuro estilo SaaS, paleta propria (nao usa o tema do site).
   ============================================================ */

const PEDIDOS = {
  bg:        "#0F172A",
  sidebar:   "#0B1220",
  panel:     "#1A2740",
  panelAlt:  "#141F35",
  border:    "#28374F",
  blue:      "#3B82F6",
  blueFaint: "#16274A",
  text:      "#E2E8F0",
  muted:     "#8B9AB3",
  green:     "#22C55E",
} as const

const PEDIDOS_ABAS = ["Plano Comercial", "Novo Pedido", "Analise de Custos", "Historico", "Carteira Aberta"]
const PEDIDOS_FORMAS_PAGAMENTO = ["A vista", "30 dias", "30-60 dias"]
const PEDIDOS_NAV_ICONS = [LayoutGrid, ClipboardList, FileText, Truck, TrendingUp, Users, Settings]

function PedidosSelect({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundColor: PEDIDOS.panelAlt, border: `1px solid ${PEDIDOS.border}`, borderRadius: 6,
        padding: "10px 12px", fontSize: 13, color: value ? PEDIDOS.text : PEDIDOS.muted, width: "100%", cursor: "pointer",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

function PedidosRodapeBox({ rotulo, valor, destaque }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div style={{ backgroundColor: PEDIDOS.panelAlt, border: `1px solid ${PEDIDOS.border}`, borderRadius: 6, padding: "10px 14px", flex: 1 }}>
      <div style={{ fontSize: 10, color: PEDIDOS.muted, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 4 }}>{rotulo}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: destaque ? PEDIDOS.green : PEDIDOS.text }}>{valor}</div>
    </div>
  )
}

function PedidosModal({ onClose }: { onClose: () => void }) {
  const clientes = D.clientesInadimplentes.porCliente.map((c) => c.nome)

  const [abaAtiva, setAbaAtiva] = useState("Novo Pedido")
  const [cliente, setCliente] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")
  const [quantidades, setQuantidades] = useState<Record<string, number>>({})

  const podeVerProdutos = cliente !== "" && formaPagamento !== ""

  function setQtd(id: string, qtd: number) {
    setQuantidades((prev) => ({ ...prev, [id]: Math.max(0, qtd) }))
  }

  const totalItens = produtosFicticios.reduce((s, p) => s + (quantidades[p.id] ?? 0), 0)
  const valorTotal = produtosFicticios.reduce((s, p) => s + (quantidades[p.id] ?? 0) * p.precoUnitario, 0)
  const comissao = valorTotal * 0.05
  const margemTotal = valorTotal * 0.3

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: PEDIDOS.bg, borderRadius: 8, overflow: "hidden",
          maxWidth: 1100, width: "100%", maxHeight: "94vh",
          display: "flex", fontFamily: "Inter, Arial, sans-serif", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: PEDIDOS.text,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        >
          <X size={15} />
        </button>

        {/* SIDEBAR DECORATIVA */}
        <div style={{ width: 56, flexShrink: 0, backgroundColor: PEDIDOS.sidebar, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "20px 0" }}>
          {PEDIDOS_NAV_ICONS.map((Icon, i) => (
            <div key={i} style={{ color: i === 1 ? PEDIDOS.blue : PEDIDOS.muted, opacity: i === 1 ? 1 : 0.6 }}>
              <Icon size={18} strokeWidth={1.8} />
            </div>
          ))}
        </div>

        {/* CONTEUDO */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* CABECALHO */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", borderBottom: `1px solid ${PEDIDOS.border}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, backgroundColor: PEDIDOS.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ClipboardList size={19} color="#fff" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Sistema de Pedidos</div>
              <div style={{ fontSize: 11, color: PEDIDOS.muted }}>Bem-vindo</div>
            </div>
          </div>

          {/* ABAS */}
          <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "0 22px", borderBottom: `1px solid ${PEDIDOS.border}`, overflowX: "auto" as const }}>
            {PEDIDOS_ABAS.map((aba) => {
              const ativa = aba === abaAtiva
              const habilitada = aba === "Novo Pedido"
              return (
                <button
                  key={aba}
                  type="button"
                  disabled={!habilitada}
                  onClick={() => habilitada && setAbaAtiva(aba)}
                  style={{
                    fontSize: 12, padding: "12px 14px", border: "none", background: "none", whiteSpace: "nowrap" as const,
                    borderBottom: ativa ? `2px solid ${PEDIDOS.blue}` : "2px solid transparent",
                    color: ativa ? PEDIDOS.text : PEDIDOS.muted,
                    fontWeight: ativa ? 700 : 400,
                    cursor: habilitada ? "pointer" : "not-allowed",
                    opacity: habilitada ? 1 : 0.5,
                  }}
                >
                  {aba}
                </button>
              )
            })}
          </div>

          {/* CORPO */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: PEDIDOS.muted, marginBottom: 6 }}>Selecionar Cliente</div>
                <PedidosSelect value={cliente} onChange={setCliente} placeholder="Selecionar cliente" options={clientes} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: PEDIDOS.muted, marginBottom: 6 }}>Forma de Pagamento</div>
                <PedidosSelect value={formaPagamento} onChange={setFormaPagamento} placeholder="Selecionar forma de pagamento" options={PEDIDOS_FORMAS_PAGAMENTO} />
              </div>
            </div>

            {podeVerProdutos ? (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: PEDIDOS.text, marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                  Produtos Disponiveis
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 12 }}>
                  {produtosFicticios.map((p) => {
                    const qtd = quantidades[p.id] ?? 0
                    const valorLiquido = qtd * p.precoUnitario
                    return (
                      <div key={p.id} style={{ backgroundColor: PEDIDOS.panel, border: `1px solid ${PEDIDOS.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.nome}</div>
                          <div style={{ fontSize: 10, color: PEDIDOS.muted }}>{p.linha} · {brl(p.precoUnitario)}/un</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <label style={{ fontSize: 10, color: PEDIDOS.muted }}>Qtd</label>
                          <input
                            type="number"
                            min={0}
                            value={qtd}
                            onChange={(e) => setQtd(p.id, parseInt(e.target.value, 10) || 0)}
                            style={{
                              backgroundColor: PEDIDOS.panelAlt, border: `1px solid ${PEDIDOS.border}`, borderRadius: 5,
                              padding: "5px 8px", fontSize: 12, color: PEDIDOS.text, width: 64,
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 12, color: PEDIDOS.muted }}>
                          Valor liquido: <span style={{ color: PEDIDOS.green, fontWeight: 700 }}>{brl(valorLiquido)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" as const, color: PEDIDOS.muted, fontSize: 13, padding: "40px 0" }}>
                Selecione um cliente e uma forma de pagamento para ver os produtos disponiveis.
              </div>
            )}

            <p style={{ fontSize: 10, color: PEDIDOS.muted, marginTop: 20, fontStyle: "italic" }}>
              Demonstracao com dados ficticios, para ilustrar a capacidade tecnica.
            </p>
          </div>

          {/* RODAPE FIXO */}
          <div style={{ display: "flex", gap: 10, padding: "14px 22px", borderTop: `1px solid ${PEDIDOS.border}`, backgroundColor: PEDIDOS.sidebar }}>
            <PedidosRodapeBox rotulo="Total de Itens" valor={String(totalItens)} />
            <PedidosRodapeBox rotulo="Valor Total" valor={brl(valorTotal)} destaque />
            <PedidosRodapeBox rotulo="Comissao" valor={brl(comissao)} />
            <PedidosRodapeBox rotulo="Margem Total" valor={brl(margemTotal)} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAIS "CONTRATOS COMERCIAIS", "SALDO DE ENTREGAS" e
   "ANALISE DE VENDAS" — mesmo "chrome" de planilha Google Sheets
   ja usado no modal de Inadimplentes.
   ============================================================ */

function SheetsShell({
  onClose, titulo, subtitulo, largura, children,
}: {
  onClose: () => void
  titulo: string
  subtitulo: string
  largura?: number
  children: React.ReactNode
}) {
  const [aba, setAba] = useState("DASH")

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: SHEETS.bg, borderRadius: 8, overflow: "hidden",
          maxWidth: largura ?? 1140, width: "100%", maxHeight: "95vh",
          display: "flex", flexDirection: "column", fontFamily: "Arial, Helvetica, sans-serif", position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.35)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        >
          <X size={15} />
        </button>

        {/* TOOLBAR FICTICIA */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderBottom: `1px solid ${SHEETS.border}` }}>
          <SheetsToolbarIcon><Undo2 size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Redo2 size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Printer size={15} /></SheetsToolbarIcon>
          <div style={{ width: 1, height: 16, backgroundColor: SHEETS.border, margin: "0 4px" }} />
          <SheetsToolbarIcon><Paintbrush size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><DollarSign size={15} /></SheetsToolbarIcon>
          <SheetsToolbarIcon><Percent size={15} /></SheetsToolbarIcon>
        </div>

        {/* CABECALHO TEAL */}
        <div style={{ backgroundColor: SHEETS.teal, color: "#fff", textAlign: "center", padding: "22px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em" }}>{titulo}</div>
          <div style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 700, marginTop: 8 }}>{subtitulo}</div>
        </div>

        {/* CORPO PLANILHA */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {children}
          <p style={{ fontSize: 10, color: SHEETS.inkMuted, marginTop: 16, fontStyle: "italic" }}>
            Demonstracao com dados ficticios, para ilustrar a capacidade tecnica.
          </p>
        </div>

        {/* ABAS FICTICIAS */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "4px 8px", borderTop: `1px solid ${SHEETS.border}`, backgroundColor: SHEETS.headBg }}>
          {SHEETS_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAba(t)}
              style={{
                fontSize: 11, padding: "6px 12px", border: "none", borderRadius: "4px 4px 0 0", cursor: "pointer",
                backgroundColor: aba === t ? "#fff" : "transparent",
                color: aba === t ? SHEETS.ink : SHEETS.inkMuted,
                fontWeight: aba === t ? 700 : 400,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContratosModal({ onClose }: { onClose: () => void }) {
  const contratos = D.contratosComerciais
  const totalValor = contratos.reduce((s, c) => s + c.valor, 0)

  const thStyle: React.CSSProperties = { padding: "5px 8px", fontSize: 11, fontStyle: "italic", fontWeight: 400, color: SHEETS.inkMuted, textAlign: "left", backgroundColor: SHEETS.headBg, border: `1px solid ${SHEETS.border}` }
  const tdStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 12, color: SHEETS.ink, border: `1px solid ${SHEETS.border}` }

  return (
    <SheetsShell onClose={onClose} titulo="CONTRATOS COMERCIAIS" subtitulo={brl(totalValor)}>
      <div style={{ overflowX: "auto" as const }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
          <thead>
            <tr>
              <th style={thStyle}>Rede</th>
              <th style={thStyle}>Associado</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Data de Inicio</th>
              <th style={thStyle}>Data de Vencimento</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Porcentagem</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Valor</th>
              <th style={thStyle}>Link</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((c, i) => (
              <tr key={i}>
                <td style={tdStyle}>{c.rede}</td>
                <td style={tdStyle}>{c.associado}</td>
                <td style={tdStyle}>{c.cliente}</td>
                <td style={tdStyle}>{c.dataInicio}</td>
                <td style={tdStyle}>{c.dataVencimento}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{c.porcentagem}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{brl(c.valor)}</td>
                <td style={{ ...tdStyle, color: SHEETS.teal, textDecoration: "underline" }}>{c.link}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SheetsShell>
  )
}

function EntregasModal({ onClose }: { onClose: () => void }) {
  const entregas = D.saldoEntregas
  const totalPendente = entregas.reduce((s, e) => s + e.quantidadePendente, 0)

  const thStyle: React.CSSProperties = { padding: "5px 8px", fontSize: 11, fontStyle: "italic", fontWeight: 400, color: SHEETS.inkMuted, textAlign: "left", backgroundColor: SHEETS.headBg, border: `1px solid ${SHEETS.border}` }
  const tdStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 12, color: SHEETS.ink, border: `1px solid ${SHEETS.border}` }

  return (
    <SheetsShell onClose={onClose} titulo="SALDO DE ENTREGAS" subtitulo={`${totalPendente} un.`}>
      <div style={{ overflowX: "auto" as const }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 780 }}>
          <thead>
            <tr>
              <th style={thStyle}>Data de Cadastro</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>CNPJ</th>
              <th style={thStyle}>Numero do Pedido</th>
              <th style={thStyle}>Produto</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Quantidade Pendente</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((e, i) => (
              <tr key={i}>
                <td style={tdStyle}>{e.dataCadastro}</td>
                <td style={tdStyle}>{e.cliente}</td>
                <td style={tdStyle}>{e.cnpj}</td>
                <td style={tdStyle}>{e.numeroPedido}</td>
                <td style={tdStyle}>{e.produto}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{e.quantidadePendente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SheetsShell>
  )
}

function AnaliseVendasModal({ onClose }: { onClose: () => void }) {
  const d = D.analiseVendas
  const totalGeralGeral = d.redes.reduce((s, r) => s + r.totalGeral, 0)

  const thStyle: React.CSSProperties = { padding: "5px 8px", fontSize: 11, fontStyle: "italic", fontWeight: 400, color: SHEETS.inkMuted, textAlign: "left", backgroundColor: SHEETS.headBg, border: `1px solid ${SHEETS.border}` }
  const tdStyle: React.CSSProperties = { padding: "4px 8px", fontSize: 12, color: SHEETS.ink, border: `1px solid ${SHEETS.border}` }

  return (
    <SheetsShell onClose={onClose} titulo="ANALISE DE VENDAS" subtitulo={brl(totalGeralGeral)}>
      <div style={{ overflowX: "auto" as const }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: "right" }}>% total</th>
              <th style={thStyle}>Nome Rede</th>
              {d.meses.map((m) => (
                <th key={m} style={{ ...thStyle, textAlign: "right" }}>{m}</th>
              ))}
              <th style={{ ...thStyle, textAlign: "right" }}>Total Geral</th>
            </tr>
          </thead>
          <tbody>
            {d.redes.map((r) => (
              <tr key={r.rede}>
                <td style={{ ...tdStyle, textAlign: "right", color: SHEETS.amber, fontWeight: 700 }}>{r.percentualTotal}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Plus size={11} style={{ color: SHEETS.inkMuted, flexShrink: 0 }} />
                    {r.rede}
                  </div>
                </td>
                {r.valoresMensais.map((v, i) => (
                  <td key={i} style={{ ...tdStyle, textAlign: "right" }}>{brl(v)}</td>
                ))}
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700 }}>{brl(r.totalGeral)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SheetsShell>
  )
}
