"use client"

// Adaptado de src/components/ListaAtivos.tsx do Gestor real.

import { useState } from "react"
import ValorMonetario from "./ValorMonetario"
import { corDoGrupoInvest } from "../../lib/gestorDemoExtra"

export type AtivoLinha = {
  id: string
  nome: string
  tipo: string
  subtipo: string
  emissor: string | null
  saldo: number
  aplicado: number
  lucro: number | null
  taxa: string | null
  vencimento: string | null
  diasAteVencer: number | null
  participacao: number
}

function dataBr(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${a}`
}

function pct(n: number | null | undefined) {
  if (n == null) return "—"
  return `${n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function Linha({ a }: { a: AtivoLinha }) {
  const [aberto, setAberto] = useState(false)
  const rentabilidade = a.aplicado > 0 && a.lucro != null ? (a.lucro / a.aplicado) * 100 : null
  const cor = corDoGrupoInvest(a.subtipo)

  return (
    <div className="border-b border-[#22332A] last:border-0">
      <button type="button" onClick={() => setAberto((v) => !v)} className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#121C17]/60 transition">
        <span className="w-1 h-9 rounded-full shrink-0" style={{ background: cor }} />

        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{a.nome}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${cor}22`, color: cor }}>{a.subtipo}</span>
            {a.taxa ? <span className="text-[10px] text-[#8DA396]">{a.taxa}</span> : null}
            {a.diasAteVencer != null && a.diasAteVencer >= 0 && a.diasAteVencer < 90 ? (
              <span className="text-[10px] rounded border border-[#22332A] px-1.5 py-0.5 text-[#D9A03C]">vence em {a.diasAteVencer}d</span>
            ) : null}
          </div>
        </div>

        <div className="text-right shrink-0">
          <ValorMonetario valor={a.saldo} className="block font-mono text-sm font-medium" />
          {a.lucro != null ? (
            <span className={`text-[10px] font-mono ${a.lucro >= 0 ? "text-[#7FD4A2]" : "text-[#D97A7A]"}`}>
              {a.lucro >= 0 ? "+" : "−"} <ValorMonetario valor={Math.abs(a.lucro)} />
            </span>
          ) : (
            <span className="text-[10px] text-[#8DA396]/60">{a.participacao.toFixed(1)}% da carteira</span>
          )}
        </div>

        <span className={`text-[10px] text-[#8DA396]/40 transition-transform shrink-0 ${aberto ? "rotate-180" : ""}`}>▼</span>
      </button>

      {aberto ? (
        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#22332A] bg-[#0F1713] p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[11px] text-[#8DA396]">Aplicado</p>
                <ValorMonetario valor={a.aplicado} className="block font-mono text-base mt-0.5" />
              </div>
              <div>
                <p className="text-[11px] text-[#8DA396]">Saldo atual</p>
                <ValorMonetario valor={a.saldo} className="block font-mono text-base mt-0.5" />
              </div>
              <div>
                <p className="text-[11px] text-[#8DA396]">Lucro</p>
                {a.lucro != null ? (
                  <>
                    <ValorMonetario valor={a.lucro} className={`block font-mono text-base mt-0.5 ${a.lucro >= 0 ? "text-[#7FD4A2]" : "text-[#D97A7A]"}`} />
                    {rentabilidade != null ? <p className="text-[10px] text-[#8DA396]/60 mt-0.5">{pct(rentabilidade)} sobre o aplicado</p> : null}
                  </>
                ) : (
                  <p className="font-mono text-base mt-0.5 text-[#8DA396]">—</p>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4 pt-3 border-t border-dashed border-[#22332A] text-[11px]">
              <div>
                <p className="text-[#8DA396]">Classe</p>
                <p className="mt-0.5">{a.tipo}</p>
              </div>
              <div>
                <p className="text-[#8DA396]">Emissor</p>
                <p className="mt-0.5 truncate">{a.emissor || "—"}</p>
              </div>
              <div>
                <p className="text-[#8DA396]">Taxa contratada</p>
                <p className="mt-0.5">{a.taxa || "—"}</p>
              </div>
              <div>
                <p className="text-[#8DA396]">Vencimento</p>
                <p className="mt-0.5">{a.vencimento ? dataBr(a.vencimento) : "sem vencimento"}</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-[#8DA396]/60 mb-1">
                <span>participacao na carteira</span>
                <span className="font-mono">{a.participacao.toFixed(1)}%</span>
              </div>
              <div className="h-1 bg-[#18251E] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${a.participacao}%`, background: cor }} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ListaAtivos({ ativos }: { ativos: AtivoLinha[] }) {
  return (
    <div className="rounded-2xl border border-[#22332A] overflow-hidden">
      {ativos.length ? ativos.map((a) => <Linha key={a.id} a={a} />) : (
        <p className="px-5 py-10 text-sm text-[#8DA396] text-center">Nenhum ativo encontrado.</p>
      )}
    </div>
  )
}
