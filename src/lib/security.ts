import bcrypt from "bcrypt"

/**
 * Gera hash de senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Valida força da senha
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("A senha deve ter no mínimo 8 caracteres")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("A senha deve conter pelo menos um número")
  }

  if (password.length > 128) {
    errors.push("A senha deve ter no máximo 128 caracteres")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 255)
}

/**
 * Sanitiza email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 255)
}

