import type { Metadata } from "next"
import { gestorPessoalDemoData } from "../../../lib/casesData"
import { parcelamentosDemo } from "../../../lib/gestorDemoExtra"
import { corDoGrupo } from "../../../lib/gestorDemoPalette"
import GestorDemoFluxoCaixa from "../../../components/GestorDemoFluxoCaixa"

export const metadata: Metadata = {
  title: "Fluxo de Caixa do Gestor",
  description: "Ranking de despesas por grupo e despesas futuras em uma demonstração do Gestor com dados fictícios.",
  alternates: {
    canonical: "/demo/gestor/fluxo-caixa",
  },
}

function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

export default function FluxoCaixaDemoPage() {
  const futurasPorCategoria = new Map<string, number>()
  let totalFuturas = 0

  for (const p of parcelamentosDemo) {
    const restantes = p.totalParcelas - p.parcelaAtual
    if (restantes <= 0) continue
    const valor = p.valorParcela * restantes
    futurasPorCategoria.set(p.categoria, (futurasPorCategoria.get(p.categoria) ?? 0) + valor)
    totalFuturas += valor
  }

  const futurasRanking = [...futurasPorCategoria.entries()]
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
  const maxFutura = futurasRanking[0]?.valor ?? 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fluxo de Caixa</h1>
        <p className="text-sm text-[#8DA396] mt-1">Despesas, receitas e movimentacoes das suas contas.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <GestorDemoFluxoCaixa grupos={gestorPessoalDemoData.despesasPorGrupo} />

        <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
          <div className="flex items-center gap-2">
            <span aria-hidden>🕐</span>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">Despesas futuras</h2>
          </div>
          <span className="block font-mono text-2xl font-semibold mt-3 text-[#D9A03C]">{brl(totalFuturas)}</span>
          <p className="text-[11px] text-[#8DA396]/60 mt-1">Parcelas que ainda vao cair nas proximas faturas</p>

          <div className="mt-4 pt-3 border-t border-dashed border-[#22332A] space-y-2.5">
            {futurasRanking.length ? (
              futurasRanking.map((d) => (
                <div key={d.nome}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm truncate">{d.nome}</span>
                    <span className="font-mono text-sm text-[#8DA396] shrink-0">{brl(d.valor)}</span>
                  </div>
                  <div className="h-1 bg-[#18251E] rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.valor / maxFutura) * 100}%`, background: corDoGrupo(d.nome) }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8DA396]">Nenhum parcelamento em aberto.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
