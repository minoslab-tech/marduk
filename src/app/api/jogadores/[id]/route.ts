import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { jogadores, times, partidasParticipacao, partidas, eventosPartida, escalacoesJogadores, escalacoes } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

// GET - Obter detalhes de um jogador específico
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

    const [jogador] = await db.select().from(jogadores).where(eq(jogadores.id, id)).limit(1)

    if (!jogador) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      )
    }

    // Buscar time
    const [time] = await db.select().from(times).where(eq(times.id, jogador.timeId)).limit(1)

    // Buscar participações com partidas (limitar a 10)
    const participacoesList = await db
      .select({
        id: partidasParticipacao.id,
        partidaId: partidasParticipacao.partidaId,
        jogadorId: partidasParticipacao.jogadorId,
        titular: partidasParticipacao.titular,
        minutosJogados: partidasParticipacao.minutosJogados,
        notaTecnica: partidasParticipacao.notaTecnica,
        observacoes: partidasParticipacao.observacoes,
        partida: partidas,
      })
      .from(partidasParticipacao)
      .leftJoin(partidas, eq(partidasParticipacao.partidaId, partidas.id))
      .where(eq(partidasParticipacao.jogadorId, id))
      .orderBy(desc(partidas.dataHora))
      .limit(10)

    // Buscar eventos com partidas (limitar a 20)
    const eventosList = await db
      .select({
        id: eventosPartida.id,
        partidaId: eventosPartida.partidaId,
        jogadorId: eventosPartida.jogadorId,
        tipoEvento: eventosPartida.tipoEvento,
        minuto: eventosPartida.minuto,
        relacionadoJogadorId: eventosPartida.relacionadoJogadorId,
        observacao: eventosPartida.observacao,
        partida: partidas,
      })
      .from(eventosPartida)
      .leftJoin(partidas, eq(eventosPartida.partidaId, partidas.id))
      .where(eq(eventosPartida.jogadorId, id))
      .orderBy(desc(partidas.dataHora))
      .limit(20)

    // Buscar escalações
    const escalacoesList = await db
      .select({
        id: escalacoesJogadores.id,
        escalacaoId: escalacoesJogadores.escalacaoId,
        jogadorId: escalacoesJogadores.jogadorId,
        titular: escalacoesJogadores.titular,
        posicaoEmCampo: escalacoesJogadores.posicaoEmCampo,
        numeroCamisa: escalacoesJogadores.numeroCamisa,
        ordem: escalacoesJogadores.ordem,
        escalacao: escalacoes,
      })
      .from(escalacoesJogadores)
      .leftJoin(escalacoes, eq(escalacoesJogadores.escalacaoId, escalacoes.id))
      .where(eq(escalacoesJogadores.jogadorId, id))

    return NextResponse.json({
      ...jogador,
      time,
      partidasParticipacao: participacoesList,
      eventosPartida: eventosList,
      escalacoesJogadores: escalacoesList,
    })
  } catch (error) {
    console.error("Erro ao buscar jogador:", error)
    return NextResponse.json(
      { error: "Erro ao buscar jogador" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar dados do jogador
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

    const {
      nomeCompleto,
      posicaoPrincipal,
      peDominante,
      dataNascimento,
      telefone,
      fotoUrl,
      ativo,
    } = body

    // Verificar se o jogador existe
    const [jogadorExistente] = await db.select().from(jogadores).where(eq(jogadores.id, id)).limit(1)

    if (!jogadorExistente) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      )
    }

    // Validar pé dominante se fornecido
    if (peDominante) {
      const pesValidos = ["direito", "esquerdo", "ambidestro"]
      if (!pesValidos.includes(peDominante)) {
        return NextResponse.json(
          { error: "Pé dominante inválido" },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: any = { updatedAt: new Date() }
    if (nomeCompleto) updateData.nomeCompleto = nomeCompleto
    if (posicaoPrincipal) updateData.posicaoPrincipal = posicaoPrincipal
    if (peDominante) updateData.peDominante = peDominante
    if (dataNascimento !== undefined) {
      updateData.dataNascimento = dataNascimento ? new Date(dataNascimento) : null
    }
    if (telefone !== undefined) updateData.telefone = telefone
    if (fotoUrl !== undefined) updateData.fotoUrl = fotoUrl
    if (ativo !== undefined) updateData.ativo = ativo

    // Atualizar o jogador
    const [jogadorAtualizado] = await db
      .update(jogadores)
      .set(updateData)
      .where(eq(jogadores.id, id))
      .returning()

    // Buscar time para retornar completo
    const [time] = await db.select().from(times).where(eq(times.id, jogadorAtualizado.timeId)).limit(1)

    return NextResponse.json({ ...jogadorAtualizado, time })
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar jogador" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir jogador
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    // Verificar se o jogador existe
    const [jogador] = await db.select().from(jogadores).where(eq(jogadores.id, id)).limit(1)

    if (!jogador) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      )
    }

    // Excluir o jogador (cascade vai excluir participações, eventos e escalações)
    await db.delete(jogadores).where(eq(jogadores.id, id))

    return NextResponse.json({ message: "Jogador excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir jogador:", error)
    return NextResponse.json(
      { error: "Erro ao excluir jogador" },
      { status: 500 }
    )
  }
}
