"use client"

// Copiado de src/components/SeletorContexto.tsx do Gestor real: mesma
// posicao, mesmo estilo de pilula, mesmo comportamento (estado na URL).

import { usePathname, useSearchParams, useRouter } from "next/navigation"

const OPCOES = [
  { valor: "", rotulo: "Tudo" },
  { valor: "pessoal", rotulo: "Pessoal" },
  { valor: "negocio", rotulo: "MEI" },
]

export default function SeletorContextoDemo() {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const atual = params.get("ctx") ?? ""

  function trocar(valor: string) {
    const novo = new URLSearchParams(params.toString())
    if (valor) novo.set("ctx", valor)
    else novo.delete("ctx")
    const qs = novo.toString()
    // scroll:false porque isso so filtra dado na mesma tela, nao e navegacao de verdade.
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="inline-flex rounded-full border border-[#22332A] bg-[#121C17] p-1">
      {OPCOES.map((o) => (
        <button
          key={o.valor}
          type="button"
          onClick={() => trocar(o.valor)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            atual === o.valor ? "bg-[#1B6B47] text-white" : "text-[#8DA396] hover:text-[#E9F0EB]"
          }`}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  )
}
