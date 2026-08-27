"use client"

// Copiado de src/components/OverviewContas.tsx do Gestor real, so trocando o
// import do ValorMonetario (sem PrivacidadeProvider) e removendo o link para
// a fatura completa (rota que nao existe nesta demo).

import { useState } from "react"
import ValorMonetario from "./ValorMonetario"

export type ContaOverview = {
  id: string
  name: string
  kind: string
  context: string
  saldo: number
  faturaAberta?: number
  limite?: number | null
  limiteUsado?: number
  fechamento?: number | null
  vencimento?: number | null
  periodoFatura?: string
}

export type AtivoOverview = { classe: string; valor: number; quantidade: number }

function Cartao({
  titulo, icone, cor, total, legenda, children,
}: {
  titulo: string
  icone: string
  cor: string
  total: number
  legenda?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5 flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-sm" aria-hidden>{icone}</span>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">{titulo}</h3>
      </div>

      <ValorMonetario valor={total} className="block font-mono text-2xl font-semibold mt-3" style={{ color: cor }} />

      {legenda}

      <div className="mt-4 pt-3 border-t border-dashed border-[#22332A] space-y-1 flex-1">{children}</div>
    </div>
  )
}

function LinhaConta({ conta, expandivel }: { conta: ContaOverview; expandivel: boolean }) {
  const [aberto, setAberto] = useState(false)
  const ehCartao = conta.kind === "cartao"

  return (
    <div className="rounded-lg -mx-2 px-2 py-1.5 hover:bg-[#0F1713]/60 transition">
      <button
        type="button"
        onClick={() => expandivel && setAberto((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
        disabled={!expandivel}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-sm truncate">{conta.name}</span>
          {conta.context === "negocio" ? (
            <span className="text-[9px] rounded-full border border-[#2C6A4C] bg-[#2FA36B]/10 px-1.5 py-0.5 text-[#7FD4A2] shrink-0">MEI</span>
          ) : null}
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <ValorMonetario valor={ehCartao ? (conta.faturaAberta ?? 0) : conta.saldo} className="font-mono text-sm text-[#8DA396]" />
          {expandivel ? (
            <span className={`text-[#8DA396]/50 text-[10px] transition-transform ${aberto ? "rotate-180" : ""}`}>▼</span>
          ) : null}
        </span>
      </button>

      {aberto ? (
        <div className="mt-2 mb-1 ml-1 pl-3 border-l border-[#22332A] space-y-1 text-[11px] text-[#8DA396]/80">
          {ehCartao ? (
            <>
              {conta.periodoFatura ? (
                <div className="flex justify-between gap-3">
                  <span>Periodo da fatura</span>
                  <span className="font-mono">{conta.periodoFatura}</span>
                </div>
              ) : null}
              {conta.vencimento ? (
                <div className="flex justify-between gap-3">
                  <span>Vence dia</span>
                  <span className="font-mono">{conta.vencimento}</span>
                </div>
              ) : null}
              {conta.limiteUsado != null ? (
                <div className="flex justify-between gap-3">
                  <span>Limite usado (com parcelas futuras)</span>
                  <ValorMonetario valor={conta.limiteUsado} className="font-mono" />
                </div>
              ) : null}
              {conta.limite ? (
                <div className="flex justify-between gap-3">
                  <span>Limite total</span>
                  <ValorMonetario valor={conta.limite} className="font-mono" />
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex justify-between gap-3">
              <span>Tipo</span>
              <span className="capitalize">{conta.kind}</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default function OverviewContas({
  contasBancarias, cartoes, investimentos,
}: {
  contasBancarias: ContaOverview[]
  cartoes: ContaOverview[]
  investimentos: AtivoOverview[]
}) {
  const saldoTotal = contasBancarias.reduce((s, c) => s + c.saldo, 0)
  const limiteUsadoTotal = cartoes.reduce((s, c) => s + (c.limiteUsado ?? 0), 0)
  const limiteTotal = cartoes.reduce((s, c) => s + (c.limite ?? 0), 0)
  const faturaTotal = cartoes.reduce((s, c) => s + (c.faturaAberta ?? 0), 0)
  const pctLimite = limiteTotal ? (limiteUsadoTotal / limiteTotal) * 100 : 0

  const totalInvestido = investimentos.reduce((s, a) => s + a.valor, 0)
  const totalAtivos = investimentos.reduce((s, a) => s + a.quantidade, 0)
  const temInvestimentos = investimentos.length > 0

  return (
    <div className={`grid gap-4 ${temInvestimentos ? "lg:grid-cols-3" : "sm:grid-cols-2"}`}>
      <Cartao
        titulo="Contas bancarias"
        icone="🏦"
        cor="#E9F0EB"
        total={saldoTotal}
        legenda={<p className="text-[11px] text-[#8DA396]/60 mt-1">{contasBancarias.length} {contasBancarias.length === 1 ? "conta" : "contas"} · saldo atual</p>}
      >
        {contasBancarias.length ? (
          contasBancarias.map((c) => <LinhaConta key={c.id} conta={c} expandivel />)
        ) : (
          <p className="text-xs text-[#8DA396]">Nenhuma conta cadastrada.</p>
        )}
      </Cartao>

      <Cartao
        titulo="Cartoes de credito"
        icone="💳"
        cor={pctLimite > 70 ? "#D9A03C" : "#7FD4A2"}
        total={faturaTotal}
        legenda={
          <>
            <p className="text-[11px] text-[#8DA396]/60 mt-1">
              Fatura aberta{cartoes[0]?.periodoFatura ? ` · ${cartoes[0].periodoFatura}` : ""}
            </p>
            {limiteTotal > 0 ? (
              <div className="mt-3">
                <div className="h-1.5 bg-[#18251E] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(pctLimite, 100)}%`, background: pctLimite > 70 ? "#D9A03C" : "#2FA36B" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#8DA396]/70 mt-1.5">
                  <span>{pctLimite.toFixed(0)}% do limite usado</span>
                  <span>limite <ValorMonetario valor={limiteTotal} /></span>
                </div>
              </div>
            ) : null}
          </>
        }
      >
        {cartoes.length ? (
          cartoes.map((c) => <LinhaConta key={c.id} conta={c} expandivel />)
        ) : (
          <p className="text-xs text-[#8DA396]">Nenhum cartao cadastrado.</p>
        )}
      </Cartao>

      {temInvestimentos ? (
        <Cartao
          titulo="Investimentos"
          icone="📈"
          cor="#7FD4A2"
          total={totalInvestido}
          legenda={<p className="text-[11px] text-[#8DA396]/60 mt-1">{investimentos.length} {investimentos.length === 1 ? "classe" : "classes"} · {totalAtivos} {totalAtivos === 1 ? "ativo" : "ativos"}</p>}
        >
          {investimentos.map((a) => {
            const pct = totalInvestido ? (a.valor / totalInvestido) * 100 : 0
            return (
              <div key={a.classe} className="py-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm truncate">{a.classe} <span className="text-[#8DA396]/60 text-xs">({a.quantidade})</span></span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-[#8DA396]/60 font-mono">{pct.toFixed(1)}%</span>
                    <ValorMonetario valor={a.valor} className="font-mono text-sm text-[#8DA396]" />
                  </span>
                </div>
                <div className="h-1 bg-[#18251E] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#2FA36B]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </Cartao>
      ) : null}
    </div>
  )
}
