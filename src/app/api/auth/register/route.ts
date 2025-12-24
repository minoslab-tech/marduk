import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server"
import {
  hashPassword,
  isValidEmail,
  validatePasswordStrength,
  sanitizeEmail,
  sanitizeInput,
} from "@/lib/security"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email: rawEmail, password } = body

    // Validações básicas
    if (!name || !rawEmail || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Sanitização de inputs
    const sanitizedName = sanitizeInput(name)
    const email = sanitizeEmail(rawEmail)
    const sanitizedPassword = password.trim()

    // Validação de nome
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: "O nome deve ter entre 2 e 100 caracteres" },
        { status: 400 }
      )
    }

    // Validação de email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    // Validação de força da senha
    const passwordValidation = validatePasswordStrength(sanitizedPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(", ") },
        { status: 400 }
      )
    }

    // Rate limiting por IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"
    const rateLimitKey = `register:${clientIp}`
    if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
      // 3 tentativas por hora por IP
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      )
    }

    // Verificar se o email já existe
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await hashPassword(sanitizedPassword)

    // Criar usuário
    const [user] = await db
      .insert(users)
      .values({
        name: sanitizedName,
        email,
        password: hashedPassword,
      })
      .returning()

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    // Não expor detalhes do erro em produção
    const isDevelopment = process.env.NODE_ENV === "development"
    if (isDevelopment) {
      console.error("Erro ao criar usuário:", error)
    }

    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}
