// Placeholder estatico de src/components/LeituraDoMes.tsx do Gestor real —
// la o texto e gerado por IA (Gemini) a partir dos dados do mes; aqui o texto
// e fixo, so pra preencher a mesma estrutura visual.

function brl(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
}

function Parcela({ rotulo, valor, tom }: { rotulo: string; valor: number; tom: "verde" | "vermelho" | "azul" | "neutro" }) {
  const cores = { verde: "text-[#5FBF8B]", vermelho: "text-[#E88B7D]", azul: "text-[#7FA8E0]", neutro: "text-[#E9F0EB]" }
  return (
    <span className="inline-flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-[#8DA396]">{rotulo}</span>
      <span className={`font-mono text-sm ${cores[tom]}`}>{brl(valor)}</span>
    </span>
  )
}

function Sinal({ children }: { children: React.ReactNode }) {
  return <span className="px-1 text-[#5E7268]">{children}</span>
}

export default function LeituraDoMes({
  entradas, saidas, investido,
}: {
  entradas: number
  saidas: number
  investido: number
}) {
  const sobra = entradas - saidas
  const livre = sobra - investido

  const blocos = [
    { titulo: "Resultado do mes", texto: `Entrou ${brl(entradas)} e saiu ${brl(saidas)} da conta. O resultado do mes ficou positivo, com espaco pra manter o ritmo de investimento sem apertar o caixa.` },
    { titulo: "Onde prestar atencao", texto: "Moradia e Alimentacao seguem como os dois maiores blocos de despesa. O faturamento do MEI cresceu em relacao ao mes anterior, dentro do esperado para o periodo." },
  ]

  return (
    <section className="rounded-2xl border border-[#22332A] bg-[#121C17] p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden>📖</span>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#8DA396]">Leitura do mes</h2>
      </div>

      <div className="mt-4 rounded-xl border border-[#1D2C24] bg-[#0F1713] p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
          <Parcela rotulo="Entradas" valor={entradas} tom="verde" />
          <Sinal>−</Sinal>
          <Parcela rotulo="Saidas" valor={saidas} tom="vermelho" />
          <Sinal>=</Sinal>
          <Parcela rotulo="Sobra" valor={sobra} tom="neutro" />
          <Sinal>→</Sinal>
          <Parcela rotulo="Investido" valor={investido} tom="azul" />
          <Sinal>+</Sinal>
          <Parcela rotulo="Livre" valor={livre} tom="neutro" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {blocos.map((b) => (
          <div key={b.titulo} className="rounded-xl border border-[#1D2C24] bg-[#0F1713] p-4">
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-[#5FBF8B]">{b.titulo}</h3>
            <p className="text-sm leading-relaxed text-[#E9F0EB]/90">{b.texto}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#8DA396]/50 mt-4 italic">Texto ilustrativo — no app real esse bloco e gerado por IA a partir dos seus dados.</p>
    </section>
  )
}
