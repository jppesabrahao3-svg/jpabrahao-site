"use client"

// Adaptado de src/app/app/compromissos/page.tsx (+ SecaoParcelas + SecaoFaturas)
// do Gestor real. As abas usam estado local em vez de query string (aqui nao
// ha servidor entre as trocas), mas mesma estrutura, posicao e estilo.

import { useState } from "react"
import ValorMonetario from "../../../components/gestor-demo/ValorMonetario"
import ListaParcelamentos from "../../../components/gestor-demo/ListaParcelamentos"
import ListaAssinaturas from "../../../components/gestor-demo/ListaAssinaturas"
import { corDoGrupo } from "../../../lib/gestorDemoPalette"
import { parcelamentosDemo, assinaturasDemo, cartoesDemo, itensFaturaDemo } from "../../../lib/gestorDemoExtra"

type Aba = "parcelas" | "faturas"
type Filtro = "tudo" | "parcelamentos" | "assinaturas"

export default function CompromissosDemoPage() {
  const [aba, setAba] = useState<Aba>("parcelas")

  const estiloAba = (ativa: boolean) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      ativa ? "bg-[#1B6B47] text-white" : "bg-[#121C17] text-[#8DA396] border border-[#22332A] hover:text-[#E9F0EB]"
    }`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Compromissos</h1>
        <p className="text-sm text-[#8DA396] mt-1">O que ja esta assumido: fatura do cartao, parcelas e assinaturas.</p>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setAba("parcelas")} className={estiloAba(aba === "parcelas")}>Parcelas e assinaturas</button>
        <button type="button" onClick={() => setAba("faturas")} className={estiloAba(aba === "faturas")}>Faturas do cartao</button>
      </div>

      {aba === "parcelas" ? <SecaoParcelas /> : <SecaoFaturas />}
    </div>
  )
}

function SecaoParcelas() {
  const [filtro, setFiltro] = useState<Filtro>("tudo")

  const parcelasAtivas = parcelamentosDemo.filter((p) => !p.quitado)
  const totalFaltaParcelas = parcelasAtivas.reduce((s, p) => s + p.falta, 0)
  const assinaturasAtivas = assinaturasDemo.filter((a) => a.ativa)
  const custoAssinaturas = assinaturasAtivas.reduce((s, a) => s + (a.periodicidade === "mensal" ? a.valor : a.valor / 12), 0)
  const comprometidoMes = custoAssinaturas + parcelasAtivas.reduce((s, p) => s + p.valorParcela, 0)

  const nomePorConta = Object.fromEntries(cartoesDemo.map((c) => [c.id, c.name]))

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
          <p className="text-xs text-[#8DA396]">Comprometido em Agosto</p>
          <ValorMonetario valor={comprometidoMes} className="block font-mono text-2xl font-semibold mt-2" />
          <p className="text-[10px] text-[#8DA396]/60 mt-1">parcelas + assinaturas</p>
        </div>
        <div className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
          <p className="text-xs text-[#8DA396]">Falta pagar em parcelamentos</p>
          <ValorMonetario valor={totalFaltaParcelas} className="block font-mono text-2xl font-semibold mt-2 text-[#D9A03C]" />
          <p className="text-[10px] text-[#8DA396]/60 mt-1">{parcelasAtivas.length} {parcelasAtivas.length === 1 ? "compra em aberto" : "compras em aberto"}</p>
        </div>
        <div className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
          <p className="text-xs text-[#8DA396]">Assinaturas por mes</p>
          <ValorMonetario valor={custoAssinaturas} className="block font-mono text-2xl font-semibold mt-2" />
          <p className="text-[10px] text-[#8DA396]/60 mt-1">{assinaturasAtivas.length} ativas</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-[#22332A] p-0.5 w-fit">
        {([
          ["tudo", "Tudo"],
          ["parcelamentos", `Parcelamentos (${parcelasAtivas.length})`],
          ["assinaturas", `Assinaturas (${assinaturasDemo.length})`],
        ] as [Filtro, string][]).map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setFiltro(valor)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${filtro === valor ? "bg-[#1B6B47] text-white" : "text-[#8DA396] hover:text-[#E9F0EB]"}`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {filtro !== "assinaturas" ? (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="text-sm font-medium text-[#8DA396]">Parcelamentos do cartao</h2>
            <p className="text-[11px] text-[#8DA396]/60">tem fim — detectados na sincronizacao</p>
          </div>
          <ListaParcelamentos parcelamentos={parcelamentosDemo} nomePorConta={nomePorConta} />
        </section>
      ) : null}

      {filtro !== "parcelamentos" ? (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="text-sm font-medium text-[#8DA396]">Assinaturas</h2>
            <p className="text-[11px] text-[#8DA396]/60">nao tem fim — detectadas pelo padrao de cobranca</p>
          </div>
          <ListaAssinaturas assinaturas={assinaturasDemo} />
        </section>
      ) : null}
    </div>
  )
}

function SecaoFaturas() {
  const cartao = cartoesDemo[0]
  const totalFatura = itensFaturaDemo.reduce((s, i) => s + i.valor, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap rounded-xl border border-[#22332A] bg-[#121C17] px-5 py-3">
        <div>
          <p className="text-sm font-medium">{cartao.name}</p>
          <p className="text-xs text-[#8DA396] mt-0.5">Periodo da fatura: {cartao.periodoFatura} · vence dia {cartao.vencimento}</p>
        </div>
        <ValorMonetario valor={totalFatura} className="font-mono text-xl font-semibold text-[#7FD4A2]" />
      </div>

      <div className="rounded-2xl border border-[#22332A] overflow-hidden">
        {itensFaturaDemo.map((i) => {
          const cor = corDoGrupo(i.categoria)
          return (
            <div key={i.id} className="flex items-center gap-3 px-5 py-3 border-b border-[#22332A] last:border-0 hover:bg-[#121C17]/60 transition">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{i.descricao}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block" style={{ background: `${cor}22`, color: cor }}>{i.categoria}</span>
              </div>
              <ValorMonetario valor={i.valor} className="font-mono text-sm shrink-0" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
