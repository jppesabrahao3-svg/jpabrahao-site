// Mesma paleta fixa e validada (contraste + daltonismo) do financeiro.ts real,
// reatribuida aos grupos ficticios de pessoa fisica. Onde o nome do grupo bate
// com um dos GRUPOS_ORDEM reais (Alimentacao, Transporte, Moradia, Saude,
// Compras, Lazer), usa a MESMA cor. "Assinaturas" e "Educacao" herdam as cores
// reais de "Servicos" e "Financeiro" (grupos que nao aparecem neste recorte).
// "Outros" herda a cor de fallback real (COR_SEM_GRUPO), nunca uma cor nova.
export const COR_SEM_GRUPO = "#8DA396"

const CORES_GRUPO: Record<string, string> = {
  "Alimentacao": "#009447",
  "Transporte": "#9A59BE",
  "Moradia": "#009593",
  "Saude": "#5B70D8",
  "Compras": "#B26500",
  "Lazer": "#BD4A84",
  "Assinaturas": "#7E8200",
  "Educacao": "#0087C7",
  "Outros": COR_SEM_GRUPO,
}

export function corDoGrupo(grupo: string): string {
  return CORES_GRUPO[grupo] ?? COR_SEM_GRUPO
}
