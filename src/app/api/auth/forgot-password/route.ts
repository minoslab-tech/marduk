import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
import crypto from "crypto"

const prisma: any = {}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Por segurança, sempre retorne sucesso mesmo se o usuário não existir
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // TODO: Enviar email com link de recuperação
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    // await sendEmail({
    //   to: email,
    //   subject: "Recuperação de senha",
    //   html: `<p>Clique no link para redefinir sua senha: <a href="${resetUrl}">${resetUrl}</a></p>`,
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar recuperação de senha:", error)
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    )
  }
}
