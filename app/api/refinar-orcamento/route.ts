import { NextResponse } from "next/server"

const COMPLEXIDADES = ["Simples", "Médio", "Complexo"] as const
type Complexidade = (typeof COMPLEXIDADES)[number]

const SYSTEM_PROMPT = `Você é um estimador técnico sênior de projetos de software (sistemas internos, automações com IA, marketing digital e sites institucionais).
Dado um resumo de diagnóstico de cliente e o tipo de serviço contratado, estime quantas horas de trabalho o projeto deve levar.
Responda SOMENTE com um objeto JSON válido, sem nenhum texto fora do JSON, sem markdown, no formato exato:
{"horasSugeridas": number, "complexidade": "Simples"|"Médio"|"Complexo", "justificativa": "uma frase curta explicando o raciocínio"}`

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    horasSugeridas: { type: "NUMBER" },
    complexidade: { type: "STRING", enum: [...COMPLEXIDADES] },
    justificativa: { type: "STRING" },
  },
  required: ["horasSugeridas", "complexidade", "justificativa"],
}

function isComplexidade(v: unknown): v is Complexidade {
  return typeof v === "string" && (COMPLEXIDADES as readonly string[]).includes(v)
}

export async function POST(request: Request) {
  let body: { texto?: unknown; servico?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 })
  }

  const texto = typeof body.texto === "string" ? body.texto.trim() : ""
  const servico = typeof body.servico === "string" ? body.servico : "Não informado"

  if (!texto) {
    return NextResponse.json({ error: "Descreva o escopo antes de refinar a estimativa." }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash"

  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY não configurada no servidor." }, { status: 500 })
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: `Serviço selecionado: ${servico}\n\nResumo do diagnóstico:\n${texto}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "")
      return NextResponse.json(
        { error: `Falha ao chamar a IA (${geminiRes.status}).`, detalhe: errText.slice(0, 300) },
        { status: 502 }
      )
    }

    const data = await geminiRes.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (typeof rawText !== "string") {
      return NextResponse.json({ error: "A IA não retornou uma resposta válida." }, { status: 502 })
    }

    let parsed: { horasSugeridas?: unknown; complexidade?: unknown; justificativa?: unknown }
    try {
      parsed = JSON.parse(rawText)
    } catch {
      return NextResponse.json({ error: "A IA não retornou um JSON válido." }, { status: 502 })
    }

    const horasBrutas = Number(parsed.horasSugeridas)
    if (!Number.isFinite(horasBrutas)) {
      return NextResponse.json({ error: "A IA não retornou um número de horas válido." }, { status: 502 })
    }

    const horasSugeridas = Math.min(200, Math.max(10, Math.round(horasBrutas)))
    const complexidade: Complexidade = isComplexidade(parsed.complexidade) ? parsed.complexidade : "Médio"
    const justificativa = typeof parsed.justificativa === "string" && parsed.justificativa.trim()
      ? parsed.justificativa.trim()
      : "Estimativa gerada pela IA a partir do resumo informado."

    return NextResponse.json({ horasSugeridas, complexidade, justificativa })
  } catch {
    return NextResponse.json({ error: "Não foi possível falar com a IA agora. Tente de novo em instantes." }, { status: 502 })
  }
}
