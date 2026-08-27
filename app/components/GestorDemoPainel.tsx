import Link from "next/link"
import type { GestorPessoalDemoData } from "../lib/casesData"
import OverviewContas from "./gestor-demo/OverviewContas"
import LeituraDoMes from "./gestor-demo/LeituraDoMes"
import { contasBancariasDemo, cartoesDemo, posicoesDemo, porTipoInvest, assinaturasDemo, parcelamentosDemo } from "../lib/gestorDemoExtra"

function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

/** Uma linha da conciliacao: rotulo a esquerda, valor alinhado a direita. Espelha LinhaConta do Gestor real. */
function LinhaConta({ rotulo, valor, forte, alerta }: { rotulo: string; valor: number; forte?: boolean; alerta?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={`text-xs ${alerta ? "text-[#E2B45F]" : forte ? "text-[#E9F0EB]" : "text-[#8DA396]"}`}>{rotulo}</span>
      <span className={`font-mono text-sm ${alerta ? "text-[#E2B45F]" : forte ? "font-semibold text-[#7FD4A2]" : "text-[#E9F0EB]"}`}>
        {brl(valor)}
      </span>
    </div>
  )
}

type Modo = "" | "pessoal" | "negocio"

export default function GestorDemoPainel({ data, ctx }: { data: GestorPessoalDemoData; ctx: Modo }) {
  const { meses, conciliacao, tetoMEI } = data
  const { saldoInicio, entradas, saidas, investido, saldoHoje } = conciliacao

  const explicado = entradas - saidas - investido
  const movimentoBruto = saldoHoje - saldoInicio
  const naoClassificado = movimentoBruto - explicado
  const fechaExato = Math.abs(naoClassificado) < 0.01

  const cards = [
    { rotulo: "Entradas do mes", valor: entradas, destaque: true, nota: "o que caiu na conta" },
    { rotulo: "Saidas do mes", valor: saidas, destaque: false, nota: "o que saiu da conta, incluindo pagamentos" },
    { rotulo: "Investido no mes", valor: investido, destaque: false, nota: "aplicacoes menos resgates, saiu do caixa mas nao e gasto" },
  ]

  const maxMes = Math.max(...meses.flatMap((m) => [m.pessoal, m.mei]), 1)
  const percentualTeto = (tetoMEI.faturado / tetoMEI.limite) * 100

  const investimentosOverview = porTipoInvest(posicoesDemo).map((g) => ({ classe: g.rotulo, valor: g.valor, quantidade: g.quantidade }))

  const comprometido =
    assinaturasDemo.filter((a) => a.ativa).reduce((s, a) => s + (a.periodicidade === "mensal" ? a.valor : a.valor / 12), 0) +
    parcelamentosDemo.filter((p) => !p.quitado).reduce((s, p) => s + p.valorParcela, 0)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#8DA396]">Painel</p>
        <h1 className="text-2xl font-semibold mt-1">Agosto 2026</h1>
      </div>

      {/* RESUMO DO MES */}
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.rotulo} className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
            <p className="text-xs text-[#8DA396]">{c.rotulo}</p>
            <span className={`block font-mono text-2xl font-semibold mt-2 ${c.destaque ? "text-[#7FD4A2]" : "text-[#E9F0EB]"}`}>
              {brl(c.valor)}
            </span>
            <p className="mt-1.5 text-[10px] leading-snug text-[#8DA396]/70">{c.nota}</p>
          </div>
        ))}
      </div>

      <p className="-mt-4 text-xs text-[#8DA396]">
        Comprometido em cobrancas neste mes: <span className="font-mono text-[#E9F0EB]">{brl(comprometido)}</span>{" "}
        <Link href="/demo/gestor/compromissos" className="text-[#7FD4A2] hover:underline">
          ver compromissos
        </Link>
      </p>

      {/* CONCILIACAO */}
      <details className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
        <summary className="cursor-pointer list-none text-xs text-[#8DA396] hover:text-[#E9F0EB]">
          Conferir: como os tres cards chegam no saldo da conta
          {!fechaExato ? (
            <span className="ml-2 rounded-full bg-[#3A2A12] px-2 py-0.5 text-[10px] text-[#E2B45F]">
              {brl(Math.abs(naoClassificado))} sem classificacao
            </span>
          ) : (
            <span className="ml-2 rounded-full bg-[#12301F] px-2 py-0.5 text-[10px] text-[#7FD4A2]">fecha exato</span>
          )}
        </summary>

        <div className="mt-4 space-y-1.5 font-mono text-sm">
          <LinhaConta rotulo="Saldo no inicio do mes" valor={saldoInicio} />
          <LinhaConta rotulo="+ Entradas do mes" valor={entradas} />
          <LinhaConta rotulo="− Saidas do mes" valor={-saidas} />
          <LinhaConta rotulo="− Investido no mes" valor={-investido} />
          {!fechaExato ? <LinhaConta rotulo="± Movimento sem classificacao" valor={naoClassificado} alerta /> : null}
          <div className="border-t border-[#22332A] pt-1.5">
            <LinhaConta rotulo="= Saldo hoje" valor={saldoHoje} forte />
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-[#8DA396]">
          O saldo inicial e calculado de tras para frente: o banco so informa o saldo de hoje, entao desfazemos todo o
          movimento bancario do mes. Se a linha <b>sem classificacao</b> aparecer, e movimento que ficou fora dos tres
          cards.
        </p>
      </details>

      {/* OVERVIEW DAS CONTAS */}
      <h2 className="text-sm font-medium text-[#8DA396]">Visao geral das contas</h2>
      <OverviewContas contasBancarias={contasBancariasDemo} cartoes={cartoesDemo} investimentos={investimentosOverview} />

      {/* LEITURA DO MES */}
      <LeituraDoMes entradas={entradas} saidas={saidas} investido={investido} />

      {/* GRAFICO */}
      <section className="rounded-xl border border-[#22332A] bg-[#121C17] p-6">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <h2 className="font-semibold text-[#E9F0EB]">Pessoal e MEI por mes</h2>
          <div className="flex gap-4 text-xs text-[#8DA396]">
            {(ctx === "pessoal" || ctx === "") && (
              <span className="flex items-center gap-1.5">
                <i className="w-3 h-3 rounded-sm bg-[#2FA36B] inline-block" /> pessoal
              </span>
            )}
            {(ctx === "negocio" || ctx === "") && (
              <span className="flex items-center gap-1.5">
                <i className="w-3 h-3 rounded-sm bg-[#8DA396]/50 inline-block" /> MEI
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-6 gap-3 items-end h-48">
          {meses.map((m) => (
            <div key={m.mes} className="flex flex-col items-center gap-2 h-full">
              <div className="flex-1 w-full flex items-end justify-center gap-1">
                {(ctx === "pessoal" || ctx === "") && (
                  <div className="w-1/2 bg-[#2FA36B] rounded-t" style={{ height: `${(m.pessoal / maxMes) * 100}%` }} title={brl(m.pessoal)} />
                )}
                {(ctx === "negocio" || ctx === "") && (
                  <div className="w-1/2 bg-[#8DA396]/50 rounded-t" style={{ height: `${(m.mei / maxMes) * 100}%` }} title={brl(m.mei)} />
                )}
              </div>
              <span className="text-[11px] text-[#8DA396]">{m.mes}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TERMOMETRO */}
      <section className="rounded-xl border border-[#22332A] bg-[#121C17] p-6">
        <div className="flex justify-between items-baseline gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-[#E9F0EB]">Termometro do teto MEI</h2>
            <p className="text-sm text-[#8DA396] mt-1">Receita bruta do MEI acumulada em 2026.</p>
          </div>
          <span className="font-mono text-3xl font-semibold text-[#7FD4A2]">{percentualTeto.toFixed(1)}%</span>
        </div>

        <div className="h-3 bg-[#18251E] rounded-full mt-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(percentualTeto, 100)}%`, background: percentualTeto > 80 ? "#D9A03C" : "#2FA36B" }}
          />
        </div>

        <div className="flex justify-between text-xs text-[#8DA396] mt-4 pt-3 border-t border-dashed border-[#22332A]">
          <span>
            Faturado: <span className="text-[#7FD4A2] font-mono font-semibold">{brl(tetoMEI.faturado)}</span>
          </span>
          <span>
            Teto: <span className="text-[#D9A03C] font-mono font-semibold">{brl(tetoMEI.limite)}</span> · margem{" "}
            <span className="text-[#D9A03C] font-mono font-semibold">{brl(Math.max(tetoMEI.limite - tetoMEI.faturado, 0))}</span>
          </span>
        </div>
      </section>
    </div>
  )
}
