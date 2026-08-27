"use client"

// Adaptado de src/components/ListaAssinaturas.tsx do Gestor real: mesma
// estrutura visual, categoria e cor direto do dado ficticio.

import { useState } from "react"
import ValorMonetario from "./ValorMonetario"
import { corDoGrupo } from "../../lib/gestorDemoPalette"
import type { AssinaturaDemo } from "../../lib/gestorDemoExtra"

function dataBr(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${a}`
}

function Item({ a }: { a: AssinaturaDemo }) {
  const [aberto, setAberto] = useState(false)
  const cor = corDoGrupo(a.categoria)

  return (
    <div className="border-b border-[#22332A] last:border-0">
      <button type="button" onClick={() => setAberto((v) => !v)} className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#121C17]/60 transition ${a.ativa ? "" : "opacity-50"}`}>
        <span className="w-1 h-9 rounded-full shrink-0" style={{ background: cor }} aria-hidden />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{a.descricao}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${cor}22`, color: cor }}>{a.categoria}</span>
            <span className="text-[10px] text-[#8DA396]">{a.periodicidade === "mensal" ? "mensal" : "anual"}</span>
            {a.confirmadaPelaIA ? <span className="text-[9px] text-[#8DA396]/50">IA</span> : null}
            {!a.ativa ? <span className="text-[10px] rounded-full border border-[#22332A] px-2 py-0.5 text-[#8DA396]">parou de cobrar</span> : null}
            {a.variacao > 5 ? <span className="text-[10px] rounded border border-[#D9A03C]/40 px-1.5 py-0.5 text-[#D9A03C]">+{a.variacao.toFixed(0)}% desde o inicio</span> : null}
          </div>
          <p className="text-xs text-[#8DA396] mt-1.5">
            {a.ativa ? (
              <>Proxima em <span className="text-[#E9F0EB]">{dataBr(a.proximaCobranca)}</span></>
            ) : (
              <>Ultima cobranca em {dataBr(a.ultimaCobranca)}</>
            )}
            {" · "}
            {a.cobrancas} {a.cobrancas === 1 ? "cobranca" : "cobrancas"}
          </p>
        </div>

        <div className="text-right shrink-0">
          <ValorMonetario valor={a.valor} className="block font-mono text-sm font-medium" />
          <span className="text-[10px] text-[#8DA396]">{a.periodicidade === "mensal" ? "por mes" : "por ano"}</span>
          <span className={`block text-[10px] text-[#8DA396]/40 mt-1 transition-transform ${aberto ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {aberto ? (
        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#22332A] bg-[#0F1713] p-4 grid gap-3 sm:grid-cols-4 text-[11px]">
            <div>
              <p className="text-[#8DA396]">Ja custou</p>
              <ValorMonetario valor={a.totalPago} className="block font-mono text-base mt-0.5" />
            </div>
            <div>
              <p className="text-[#8DA396]">Por ano</p>
              <ValorMonetario valor={a.periodicidade === "mensal" ? a.valor * 12 : a.valor} className="block font-mono text-base mt-0.5 text-[#D9A03C]" />
            </div>
            <div>
              <p className="text-[#8DA396]">Cobra desde</p>
              <p className="mt-0.5 font-mono">{dataBr(a.primeiraCobranca)}</p>
            </div>
            <div>
              <p className="text-[#8DA396]">Ultima</p>
              <p className="mt-0.5 font-mono">{dataBr(a.ultimaCobranca)}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[#22332A] bg-[#0F1713] p-4">
            <p className="text-[11px] text-[#8DA396] mb-2">Cobrancas encontradas ({a.cobrancasVistas.length}) · intervalo tipico de {a.intervaloDias} dias</p>
            <div className="flex flex-wrap gap-1.5">
              {a.cobrancasVistas.map((c, i) => (
                <span key={`${c.data}-${i}`} className="text-[10px] font-mono rounded border border-[#22332A] px-2 py-1 text-[#8DA396]">
                  {dataBr(c.data)}
                  <span className="text-[#8DA396]/50 ml-1.5">{c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ListaAssinaturas({ assinaturas }: { assinaturas: AssinaturaDemo[] }) {
  const [mostrarInativas, setMostrarInativas] = useState(false)
  const ativas = assinaturas.filter((a) => a.ativa)
  const inativas = assinaturas.filter((a) => !a.ativa)
  const visiveis = mostrarInativas ? assinaturas : ativas

  return (
    <div className="space-y-3">
      {inativas.length ? (
        <div className="flex justify-end">
          <button type="button" onClick={() => setMostrarInativas((v) => !v)} className="text-xs text-[#8DA396] hover:text-[#E9F0EB] transition">
            {mostrarInativas ? "ocultar as que pararam" : `mostrar ${inativas.length} que pararam de cobrar`}
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#22332A] overflow-hidden">
        {visiveis.map((a) => <Item key={a.chave} a={a} />)}
      </div>
    </div>
  )
}
