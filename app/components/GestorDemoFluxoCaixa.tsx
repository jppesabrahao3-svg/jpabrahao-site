"use client"

import { useState } from "react"
import type { GestorPessoalGrupo } from "../lib/casesData"
import { corDoGrupo } from "../lib/gestorDemoPalette"

function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

export default function GestorDemoFluxoCaixa({ grupos }: { grupos: GestorPessoalGrupo[] }) {
  const [grupoAberto, setGrupoAberto] = useState<string | null>(null)

  const totalDespesas = grupos.reduce((s, g) => s + g.valor, 0)
  const grupoAtual = grupoAberto ? grupos.find((g) => g.grupo === grupoAberto) : null

  const itens = grupoAtual
    ? grupoAtual.categorias
        .map((c) => ({ nome: c.nome, valor: c.valor, cor: corDoGrupo(grupoAtual.grupo) }))
        .sort((a, b) => b.valor - a.valor)
    : grupos.map((g) => ({ nome: g.grupo, valor: g.valor, cor: corDoGrupo(g.grupo) })).sort((a, b) => b.valor - a.valor)

  const totalDoGrupo = grupoAtual ? grupoAtual.valor : totalDespesas
  const maxValor = itens[0]?.valor ?? 1

  return (
    <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden>🧾</span>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">Despesas por grupo</h2>
      </div>

      <span className="block font-mono text-2xl font-semibold mt-3 text-[#D97A7A]">{brl(totalDoGrupo)}</span>

      {grupoAtual ? (
        <div className="flex items-center justify-between gap-3 mt-1">
          <p className="text-[11px] text-[#8DA396]/60">
            dentro de <span style={{ color: corDoGrupo(grupoAtual.grupo) }}>{grupoAtual.grupo}</span>
            {" · "}
            {((totalDoGrupo / (totalDespesas || 1)) * 100).toFixed(0)}% do mes
          </p>
          <button type="button" onClick={() => setGrupoAberto(null)} className="text-[11px] text-[#7FD4A2] hover:underline shrink-0">
            ← todos os grupos
          </button>
        </div>
      ) : (
        <p className="text-[11px] text-[#8DA396]/60 mt-1">
          {grupos.length} grupos neste mes · clique para abrir
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-dashed border-[#22332A] space-y-2.5">
        {itens.map((d) => (
          <button
            key={d.nome}
            type="button"
            onClick={() => !grupoAtual && setGrupoAberto(d.nome)}
            className={`block w-full text-left rounded-lg -mx-2 px-2 py-1 transition ${grupoAtual ? "" : "hover:bg-[#0F1713] cursor-pointer"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 min-w-0">
                <i className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.cor }} aria-hidden />
                <span className="text-sm truncate">{d.nome}</span>
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] text-[#8DA396]/50">
                  {((d.valor / (totalDoGrupo || 1)) * 100).toFixed(0)}%
                </span>
                <span className="font-mono text-sm text-[#8DA396]">{brl(d.valor)}</span>
              </span>
            </div>
            <div className="h-1.5 bg-[#18251E] rounded-full mt-1.5 overflow-hidden">
              <div className="h-full rounded-r" style={{ width: `${(d.valor / maxValor) * 100}%`, background: d.cor }} />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
