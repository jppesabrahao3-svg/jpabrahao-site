import { createHash } from "crypto"

export const INTERNO_AUTH_COOKIE = "interno_auth"
export const INTERNO_AUTH_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias, em segundos

// O valor do cookie e um hash da senha (nunca a senha em si), derivado da
// variavel de ambiente. Trocar INTERNO_PASSWORD invalida sessoes antigas.
export function getInternoAuthToken() {
  const senha = process.env.INTERNO_PASSWORD ?? ""
  return createHash("sha256").update(`interno-auth:${senha}`).digest("hex")
}

export function isValidInternoAuthCookie(valor: string | undefined) {
  const senha = process.env.INTERNO_PASSWORD
  if (!senha) return false
  return valor === getInternoAuthToken()
}
