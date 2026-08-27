"use client"

// Adaptado de src/components/ListaParcelamentos.tsx do Gestor real: mesma
// estrutura visual, so troca categoriaDaTransacao(regras) por usar a
// categoria ja gravada no dado ficticio direto, e corDaCategoria pela paleta
// fixa de grupos (gestorDemoPalette).

import { useState } from "react"
import ValorMonetario from "./ValorMonetario"
import { corDoGrupo } from "../../lib/gestorDemoPalette"
import type { ParcelamentoDemo } from "../../lib/gestorDemoExtra"

function rotuloFatura(invoiceMonth: string | null): string {
  if (!invoiceMonth) return "—"
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
  const ano = invoiceMonth.slice(0, 4)
  const mes = Number(invoiceMonth.slice(5, 7))
  return `${MESES[mes - 1]}/${ano}`
}

function Item({ p, nomeConta }: { p: ParcelamentoDemo; nomeConta: string | null }) {
  const [aberto, setAberto] = useState(false)
  const pct = (p.parcelaAtual / p.totalParcelas) * 100
  const cor = corDoGrupo(p.categoria)
  const restantes = p.totalParcelas - p.parcelaAtual

  return (
    <div className="border-b border-[#22332A] last:border-0">
      <button type="button" onClick={() => setAberto((v) => !v)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#121C17]/60 transition">
        <div className={`w-11 h-11 flex-none rounded-lg border flex flex-col items-center justify-center ${p.quitado ? "bg-[#18251E] border-[#22332A]" : "bg-[#2FA36B]/10 border-[#2C6A4C]"}`}>
          <span className="font-mono text-[13px] font-semibold leading-none">{p.parcelaAtual}</span>
          <span className="text-[9px] text-[#8DA396] leading-none mt-0.5">de {p.totalParcelas}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{p.descricao}</p>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${cor}22`, color: cor }}>{p.categoria}</span>
            {nomeConta ? <span className="text-[10px] text-[#8DA396]">{nomeConta}</span> : null}
            {p.context === "negocio" ? (
              <span className="text-[9px] rounded-full border border-[#2C6A4C] bg-[#2FA36B]/10 px-1.5 py-0.5 text-[#7FD4A2]">MEI</span>
            ) : null}
            {p.quitado ? <span className="text-[10px] rounded-full border border-[#22332A] px-2 py-0.5 text-[#8DA396]">quitado</span> : null}
          </div>

          <p className="text-xs text-[#8DA396] mt-1.5">
            {p.quitado ? (
              <>Encerrou em {rotuloFatura(p.ultimaFatura)}</>
            ) : (
              <>
                Termina em <span className="text-[#E9F0EB]">{rotuloFatura(p.ultimaFatura)}</span>
                {" · "}
                {restantes} {restantes === 1 ? "parcela restante" : "parcelas restantes"}
              </>
            )}
          </p>

          <div className="h-1 bg-[#18251E] rounded-full mt-2 overflow-hidden max-w-sm">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: p.quitado ? "#8DA396" : "#2FA36B" }} />
          </div>
        </div>

        <div className="text-right shrink-0">
          <ValorMonetario valor={p.valorParcela} className="block font-mono text-sm font-medium" />
          <span className="text-[10px] text-[#8DA396]">por mes</span>
          <span className={`block text-[10px] text-[#8DA396]/50 mt-1 transition-transform ${aberto ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {aberto ? (
        <div className="px-5 pb-5 -mt-1">
          <div className="rounded-xl border border-[#22332A] bg-[#0F1713] p-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[11px] text-[#8DA396]">Valor total da compra</p>
                <ValorMonetario valor={p.valorTotal} className="block font-mono text-lg font-semibold mt-0.5" />
                <p className="text-[10px] text-[#8DA396]/60 mt-0.5">{p.totalParcelas}× de <ValorMonetario valor={p.valorParcela} /></p>
              </div>
              <div>
                <p className="text-[11px] text-[#8DA396]">Ja pago</p>
                <ValorMonetario valor={p.jaPago} className="block font-mono text-lg font-semibold mt-0.5 text-[#7FD4A2]" />
                <p className="text-[10px] text-[#8DA396]/60 mt-0.5">{p.parcelaAtual} de {p.totalParcelas} parcelas{p.estimado ? " · estimado" : ""}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#8DA396]">Falta pagar</p>
                <ValorMonetario valor={p.falta} className={`block font-mono text-lg font-semibold mt-0.5 ${p.falta > 0 ? "text-[#D9A03C]" : "text-[#8DA396]"}`} />
                <p className="text-[10px] text-[#8DA396]/60 mt-0.5">{restantes > 0 ? `${restantes} ${restantes === 1 ? "parcela" : "parcelas"}` : "nada a pagar"}</p>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-[#8DA396] pt-3 border-t border-dashed border-[#22332A]">
              <span>Primeira parcela na fatura de <span className="text-[#E9F0EB]">{rotuloFatura(p.primeiraFatura)}</span></span>
              <span>Ultima na fatura de <span className="text-[#E9F0EB]">{rotuloFatura(p.ultimaFatura)}</span></span>
            </div>

            <div>
              <p className="text-[11px] text-[#8DA396] mb-2">Parcelas</p>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: p.totalParcelas }, (_, i) => {
                  const n = i + 1
                  const paga = n <= p.parcelaAtual
                  return (
                    <span key={n} className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[10px] border ${paga ? "bg-[#2FA36B]/15 border-[#2C6A4C] text-[#7FD4A2]" : "bg-[#18251E] border-[#22332A] text-[#8DA396]/50"}`}>
                      {n}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ListaParcelamentos({ parcelamentos, nomePorConta }: { parcelamentos: ParcelamentoDemo[]; nomePorConta: Record<string, string> }) {
  const [mostrarQuitados, setMostrarQuitados] = useState(false)
  const ativos = parcelamentos.filter((p) => !p.quitado)
  const quitados = parcelamentos.filter((p) => p.quitado)
  const visiveis = mostrarQuitados ? parcelamentos : ativos

  if (!parcelamentos.length) {
    return (
      <div className="rounded-2xl border border-[#22332A] px-5 py-12 text-center">
        <p className="text-sm text-[#8DA396]">Nenhuma compra parcelada no cartao.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {quitados.length ? (
        <div className="flex justify-end">
          <button type="button" onClick={() => setMostrarQuitados((v) => !v)} className="text-xs text-[#8DA396] hover:text-[#E9F0EB] transition">
            {mostrarQuitados ? "ocultar quitados" : `mostrar ${quitados.length} quitado${quitados.length > 1 ? "s" : ""}`}
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#22332A] overflow-hidden">
        {visiveis.map((p) => (
          <Item key={p.chave} p={p} nomeConta={p.contaId ? (nomePorConta[p.contaId] ?? null) : null} />
        ))}
      </div>
    </div>
  )
}
