import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { escalacoes, times, escalacoesJogadores, jogadores } from "@/db/schema"
import { eq, desc, asc } from "drizzle-orm"

// GET - Obter detalhes de uma escalação específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    const [escalacao] = await db.select().from(escalacoes).where(eq(escalacoes.id, id)).limit(1)

    if (!escalacao) {
      return NextResponse.json(
        { error: "Escalação não encontrada" },
        { status: 404 }
      )
    }

    // Buscar time
    const [time] = await db.select().from(times).where(eq(times.id, escalacao.timeId)).limit(1)

    // Buscar jogadores da escalação
    const jogadoresEscalacao = await db
      .select({
        id: escalacoesJogadores.id,
        escalacaoId: escalacoesJogadores.escalacaoId,
        jogadorId: escalacoesJogadores.jogadorId,
        titular: escalacoesJogadores.titular,
        posicaoEmCampo: escalacoesJogadores.posicaoEmCampo,
        numeroCamisa: escalacoesJogadores.numeroCamisa,
        ordem: escalacoesJogadores.ordem,
        jogador: jogadores,
      })
      .from(escalacoesJogadores)
      .leftJoin(jogadores, eq(escalacoesJogadores.jogadorId, jogadores.id))
      .where(eq(escalacoesJogadores.escalacaoId, id))
      .orderBy(desc(escalacoesJogadores.titular), asc(escalacoesJogadores.ordem))

    return NextResponse.json({
      ...escalacao,
      time,
      escalacoesJogadores: jogadoresEscalacao,
    })
  } catch (error) {
    console.error("Erro ao buscar escalação:", error)
    return NextResponse.json(
      { error: "Erro ao buscar escalação" },
      { status: 500 }
    )
  }
}
