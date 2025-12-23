import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import crypto from "crypto"
import { isValidEmail, sanitizeEmail } from "@/lib/security"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email: rawEmail } = body

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    const email = sanitizeEmail(rawEmail)

    // Validação de email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    // Rate limiting por email e IP para prevenir abuso
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"
    
    const rateLimitKeyEmail = `forgot-password:${email}`
    const rateLimitKeyIp = `forgot-password-ip:${clientIp}`

    if (!checkRateLimit(rateLimitKeyEmail, 3, 60 * 60 * 1000)) {
      // 3 tentativas por hora por email
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      )
    }

    if (!checkRateLimit(rateLimitKeyIp, 5, 60 * 60 * 1000)) {
      // 5 tentativas por hora por IP
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Por segurança, sempre retorne sucesso mesmo se o usuário não existir
    // Isso previne enumeração de emails
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Gerar token de recuperação seguro
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    // Atualizar usuário com token de reset
    // Nota: Isso requer que o schema do Prisma tenha os campos resetToken e resetTokenExpiry
    // Por enquanto, vamos apenas retornar sucesso já que o schema não tem esses campos
    // TODO: Adicionar campos resetToken e resetTokenExpiry ao schema do Prisma
    
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry,
    //   },
    // })

    // TODO: Enviar email com link de recuperação
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    // await sendEmail({
    //   to: email,
    //   subject: "Recuperação de senha",
    //   html: `<p>Clique no link para redefinir sua senha: <a href="${resetUrl}">${resetUrl}</a></p>`,
    // })

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.log(`Token de reset gerado para ${email}: ${resetToken}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    // Não expor detalhes do erro em produção
    const isDevelopment = process.env.NODE_ENV === "development"
    if (isDevelopment) {
      console.error("Erro ao processar recuperação de senha:", error)
    }

    return NextResponse.json(
      { error: "Erro ao processar solicitação. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}
