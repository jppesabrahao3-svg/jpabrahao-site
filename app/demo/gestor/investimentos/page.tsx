import type { Metadata } from "next"
import ValorMonetario from "../../../components/gestor-demo/ValorMonetario"
import ListaAtivos from "../../../components/gestor-demo/ListaAtivos"
import {
  posicoesDemo, snapshotsDemo, resumirInvest, porTipoInvest, porSubtipoInvest, porEmissorInvest,
  diasAteVencimentoDemo, corDoGrupoInvest, type GrupoInvest,
} from "../../../lib/gestorDemoExtra"

export const metadata: Metadata = {
  title: "Investimentos do Gestor",
  description: "Carteira de investimentos, evolução do patrimônio e ranking por classe, produto e emissor em uma demonstração do Gestor com dados fictícios.",
  alternates: {
    canonical: "/demo/gestor/investimentos",
  },
}

function pct(n: number | null) {
  if (n == null) return "—"
  return `${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function dataBr(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${a}`
}

function BarrasGrupo({ grupos, titulo }: { grupos: GrupoInvest[]; titulo: string }) {
  const maior = grupos[0]?.valor ?? 1
  return (
    <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">{titulo}</h2>
      <div className="mt-4 space-y-3">
        {grupos.map((g) => (
          <div key={g.rotulo}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm truncate">{g.rotulo} <span className="text-[#8DA396]/60 text-xs">({g.quantidade})</span></span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] text-[#8DA396]/60">{g.participacao.toFixed(1)}%</span>
                <ValorMonetario valor={g.valor} className="font-mono text-sm text-[#8DA396]" />
              </span>
            </div>
            <div className="h-1.5 bg-[#18251E] rounded-full mt-1.5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(g.valor / maior) * 100}%`, background: corDoGrupoInvest(g.rotulo) }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function InvestimentosDemoPage() {
  const resumo = resumirInvest(posicoesDemo)
  const grupoTipo = porTipoInvest(posicoesDemo)
  const grupoSubtipo = porSubtipoInvest(posicoesDemo)
  const grupoEmissor = porEmissorInvest(posicoesDemo)
  const maiorEmissor = grupoEmissor[0]

  const vencimentos = posicoesDemo
    .filter((p) => p.due_date)
    .map((p) => ({ p, dias: diasAteVencimentoDemo(p.due_date) ?? 99999 }))
    .filter((v) => v.dias >= 0)
    .sort((a, b) => a.dias - b.dias)
    .slice(0, 5)

  const maxSnap = Math.max(...snapshotsDemo.map((s) => s.total_balance), 1)

  const cards = [
    { rotulo: "Total investido", valor: resumo.total, cor: "#E9F0EB", nota: `${resumo.ativos} ativos` },
    { rotulo: "Aplicado", valor: resumo.aplicado, cor: "#8DA396", nota: "valor original das aplicacoes" },
    {
      rotulo: "Lucro acumulado", valor: resumo.lucro, cor: resumo.lucro >= 0 ? "#7FD4A2" : "#D97A7A",
      nota: resumo.rentabilidade != null ? `${pct(resumo.rentabilidade)} sobre o aplicado` : "desde a aplicacao",
    },
  ]

  const ativos = posicoesDemo.map((p) => ({
    id: p.id,
    nome: p.name,
    tipo: p.type === "FIXED_INCOME" ? "Renda fixa" : "Fundo",
    subtipo: p.subtype,
    emissor: p.issuer,
    saldo: p.balance,
    aplicado: p.amount_original ?? p.balance - (p.amount_profit ?? 0),
    lucro: p.amount_profit,
    taxa: p.taxa,
    vencimento: p.due_date,
    diasAteVencer: diasAteVencimentoDemo(p.due_date),
    participacao: resumo.total ? (p.balance / resumo.total) * 100 : 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Investimentos</h1>
        <p className="text-sm text-[#8DA396] mt-1">Sua carteira, direto do Open Finance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.rotulo} className="rounded-xl border border-[#22332A] bg-[#121C17] p-5">
            <p className="text-xs text-[#8DA396]">{c.rotulo}</p>
            <ValorMonetario valor={c.valor} className="block font-mono text-2xl font-semibold mt-2" style={{ color: c.cor }} />
            <p className="text-[10px] text-[#8DA396]/60 mt-1">{c.nota}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">Evolucao do patrimonio</h2>
          {resumo.rentabilidade12m != null ? (
            <span className="text-xs text-[#8DA396]">rendimento medio em 12 meses <span className="font-mono text-[#7FD4A2]">{pct(resumo.rentabilidade12m)}</span></span>
          ) : null}
        </div>

        <div className="mt-5 flex items-end gap-2 h-40">
          {snapshotsDemo.map((s) => (
            <div key={s.snapshot_month} className="flex-1 flex flex-col items-center gap-2 h-full">
              <div className="flex-1 w-full flex items-end justify-center">
                <div className="w-full max-w-10 bg-[#2FA36B] rounded-t transition-all" style={{ height: `${(s.total_balance / maxSnap) * 100}%` }} />
              </div>
              <span className="text-[10px] text-[#8DA396]">{s.snapshot_month.slice(5, 7)}/{s.snapshot_month.slice(2, 4)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarrasGrupo grupos={grupoTipo} titulo="Por classe" />
        <BarrasGrupo grupos={grupoSubtipo} titulo="Por produto" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarrasGrupo grupos={grupoEmissor} titulo="Por emissor" />

        <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">Proximos vencimentos</h2>
          <div className="mt-4 space-y-2.5">
            {vencimentos.length ? (
              vencimentos.map(({ p, dias }) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{p.name}</p>
                    <p className="text-[10px] text-[#8DA396]">
                      {dataBr(p.due_date!.slice(0, 10))} · {dias === 0 ? "vence hoje" : dias < 30 ? `em ${dias} dias` : `em ${Math.round(dias / 30)} meses`}
                    </p>
                  </div>
                  <ValorMonetario valor={p.balance} className="font-mono text-sm text-[#8DA396] shrink-0" />
                </div>
              ))
            ) : (
              <p className="text-xs text-[#8DA396]">Nenhum ativo com data de vencimento.</p>
            )}
          </div>

          {maiorEmissor && maiorEmissor.participacao > 40 ? (
            <div className="mt-4 pt-3 border-t border-dashed border-[#22332A]">
              <p className="text-[11px] text-[#D9A03C]">
                {maiorEmissor.participacao.toFixed(0)}% da carteira esta em {maiorEmissor.rotulo}. Vale saber que o FGC cobre ate R$ 250 mil por instituicao.
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-sm font-medium text-[#8DA396]">Ativos</h2>
          <p className="text-[11px] text-[#8DA396]/60">clique para ver taxa, vencimento e rentabilidade</p>
        </div>
        <ListaAtivos ativos={ativos} />
      </section>
    </div>
  )
}
