import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { partidas, partidasParticipacao, jogadores } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

// PUT - Atualizar participação dos jogadores na partida
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verificar se a partida existe
    const [partida] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    if (!partida) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      )
    }

    const { participacoes } = body

    if (!Array.isArray(participacoes)) {
      return NextResponse.json(
        { error: "participacoes deve ser um array" },
        { status: 400 }
      )
    }

    // Atualizar ou criar participações
    // Deletar participações existentes
    await db.delete(partidasParticipacao).where(eq(partidasParticipacao.partidaId, id))

    // Criar novas participações
    if (participacoes.length > 0) {
      await db.insert(partidasParticipacao).values(
        participacoes.map((participacao: any) => ({
          partidaId: id,
          jogadorId: participacao.jogadorId,
          titular: participacao.titular || false,
          minutosJogados: participacao.minutosJogados || 0,
          notaTecnica: participacao.notaTecnica || null,
          observacoes: participacao.observacoes || null,
        }))
      )
    }

    // Buscar a partida atualizada com as participações
    const [partidaAtualizada] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    const participacoesCompletas = await db
      .select({
        id: partidasParticipacao.id,
        partidaId: partidasParticipacao.partidaId,
        jogadorId: partidasParticipacao.jogadorId,
        titular: partidasParticipacao.titular,
        minutosJogados: partidasParticipacao.minutosJogados,
        notaTecnica: partidasParticipacao.notaTecnica,
        observacoes: partidasParticipacao.observacoes,
        jogador: jogadores,
      })
      .from(partidasParticipacao)
      .leftJoin(jogadores, eq(partidasParticipacao.jogadorId, jogadores.id))
      .where(eq(partidasParticipacao.partidaId, id))
      .orderBy(desc(partidasParticipacao.titular), desc(partidasParticipacao.minutosJogados))

    return NextResponse.json({
      ...partidaAtualizada,
      partidasParticipacao: participacoesCompletas,
    })
  } catch (error) {
    console.error("Erro ao atualizar participação:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar participação" },
      { status: 500 }
    )
  }
}

// POST - Adicionar ou atualizar participação de um jogador específico
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verificar se a partida existe
    const [partida] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    if (!partida) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      )
    }

    const {
      jogadorId,
      titular,
      minutosJogados,
      notaTecnica,
      observacoes,
    } = body

    if (!jogadorId) {
      return NextResponse.json(
        { error: "jogadorId é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o jogador existe
    const [jogador] = await db.select().from(jogadores).where(eq(jogadores.id, jogadorId)).limit(1)

    if (!jogador) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se já existe participação
    const [participacaoExistente] = await db
      .select()
      .from(partidasParticipacao)
      .where(
        and(
          eq(partidasParticipacao.partidaId, id),
          eq(partidasParticipacao.jogadorId, jogadorId)
        )
      )
      .limit(1)

    let participacao

    if (participacaoExistente) {
      // Preparar dados para atualização
      const updateData: any = { updatedAt: new Date() }
      if (titular !== undefined) updateData.titular = titular
      if (minutosJogados !== undefined) updateData.minutosJogados = minutosJogados
      if (notaTecnica !== undefined) updateData.notaTecnica = notaTecnica
      if (observacoes !== undefined) updateData.observacoes = observacoes

      // Atualizar participação existente
      const [updated] = await db
        .update(partidasParticipacao)
        .set(updateData)
        .where(eq(partidasParticipacao.id, participacaoExistente.id))
        .returning()

      const [jog] = await db.select().from(jogadores).where(eq(jogadores.id, updated.jogadorId)).limit(1)
      participacao = { ...updated, jogador: jog }
    } else {
      // Criar nova participação
      const [created] = await db
        .insert(partidasParticipacao)
        .values({
          partidaId: id,
          jogadorId,
          titular: titular || false,
          minutosJogados: minutosJogados || 0,
          notaTecnica: notaTecnica || null,
          observacoes: observacoes || null,
        })
        .returning()

      const [jog] = await db.select().from(jogadores).where(eq(jogadores.id, created.jogadorId)).limit(1)
      participacao = { ...created, jogador: jog }
    }

    return NextResponse.json(participacao)
  } catch (error) {
    console.error("Erro ao salvar participação:", error)
    return NextResponse.json(
      { error: "Erro ao salvar participação" },
      { status: 500 }
    )
  }
}
