/**
 * Rate limiting simples em memória
 * Para produção, considere usar Redis ou outro serviço distribuído
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

/**
 * Limpa entradas expiradas do store
 */
function cleanup() {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}

/**
 * Verifica rate limit
 * @param identifier Identificador único (IP, email, etc)
 * @param maxRequests Número máximo de requisições
 * @param windowMs Janela de tempo em milissegundos
 * @returns true se dentro do limite, false se excedido
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutos padrão
): boolean {
  cleanup()

  const now = Date.now()
  const entry = store[identifier]

  if (!entry || entry.resetTime < now) {
    // Nova entrada ou entrada expirada
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

/**
 * Obtém tempo restante até o reset
 */
export function getRemainingTime(identifier: string): number {
  const entry = store[identifier]
  if (!entry) return 0

  const remaining = entry.resetTime - Date.now()
  return Math.max(0, remaining)
}

