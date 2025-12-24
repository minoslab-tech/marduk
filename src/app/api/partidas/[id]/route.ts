import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { partidas, times, partidasParticipacao, jogadores, eventosPartida } from "@/db/schema"
import { eq, desc, asc } from "drizzle-orm"

// GET - Obter detalhes de uma partida específica
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

    const [partida] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    if (!partida) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      )
    }

    // Buscar time
    const [time] = await db.select().from(times).where(eq(times.id, partida.timeId)).limit(1)

    // Buscar participações com jogadores
    const participacoes = await db
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

    // Buscar eventos com jogadores
    const eventos = await db
      .select({
        id: eventosPartida.id,
        partidaId: eventosPartida.partidaId,
        jogadorId: eventosPartida.jogadorId,
        tipoEvento: eventosPartida.tipoEvento,
        minuto: eventosPartida.minuto,
        relacionadoJogadorId: eventosPartida.relacionadoJogadorId,
        observacao: eventosPartida.observacao,
      })
      .from(eventosPartida)
      .where(eq(eventosPartida.partidaId, id))
      .orderBy(asc(eventosPartida.minuto))

    // Buscar jogadores para os eventos
    const eventosComJogadores = await Promise.all(
      eventos.map(async (evento) => {
        const [jogador] = await db.select().from(jogadores).where(eq(jogadores.id, evento.jogadorId)).limit(1)
        let jogadorRelacionado = null
        if (evento.relacionadoJogadorId) {
          const [rel] = await db.select().from(jogadores).where(eq(jogadores.id, evento.relacionadoJogadorId)).limit(1)
          jogadorRelacionado = rel
        }
        return { ...evento, jogador, jogadorRelacionado }
      })
    )

    return NextResponse.json({
      ...partida,
      time,
      partidasParticipacao: participacoes,
      eventosPartida: eventosComJogadores,
    })
  } catch (error) {
    console.error("Erro ao buscar partida:", error)
    return NextResponse.json(
      { error: "Erro ao buscar partida" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar dados da partida
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
      dataHora,
      local,
      adversarioNome,
      tipo,
      status,
      golsPro,
      golsContra,
      observacoesTecnico,
    } = body

    // Verificar se a partida existe
    const [partidaExistente] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    if (!partidaExistente) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      )
    }

    // Validar tipo se fornecido
    if (tipo) {
      const tiposValidos = ["amistoso", "campeonato", "treino"]
      if (!tiposValidos.includes(tipo)) {
        return NextResponse.json(
          { error: "Tipo de partida inválido" },
          { status: 400 }
        )
      }
    }

    // Validar status se fornecido
    if (status) {
      const statusValidos = ["agendada", "em_andamento", "finalizada", "cancelada"]
      if (!statusValidos.includes(status)) {
        return NextResponse.json(
          { error: "Status de partida inválido" },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: any = {}
    if (dataHora) updateData.dataHora = new Date(dataHora)
    if (local) updateData.local = local
    if (adversarioNome) updateData.adversarioNome = adversarioNome
    if (tipo) updateData.tipo = tipo
    if (status) updateData.status = status
    if (golsPro !== undefined) updateData.golsPro = golsPro
    if (golsContra !== undefined) updateData.golsContra = golsContra
    if (observacoesTecnico !== undefined) updateData.observacoesTecnico = observacoesTecnico
    updateData.updatedAt = new Date()

    // Atualizar a partida
    const [partidaAtualizada] = await db
      .update(partidas)
      .set(updateData)
      .where(eq(partidas.id, id))
      .returning()

    // Buscar dados completos
    const [time] = await db.select().from(times).where(eq(times.id, partidaAtualizada.timeId)).limit(1)

    const participacoes = await db
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

    const eventos = await db
      .select({
        id: eventosPartida.id,
        partidaId: eventosPartida.partidaId,
        jogadorId: eventosPartida.jogadorId,
        tipoEvento: eventosPartida.tipoEvento,
        minuto: eventosPartida.minuto,
        relacionadoJogadorId: eventosPartida.relacionadoJogadorId,
        observacao: eventosPartida.observacao,
      })
      .from(eventosPartida)
      .where(eq(eventosPartida.partidaId, id))

    const eventosComJogadores = await Promise.all(
      eventos.map(async (evento) => {
        const [jogador] = await db.select().from(jogadores).where(eq(jogadores.id, evento.jogadorId)).limit(1)
        let jogadorRelacionado = null
        if (evento.relacionadoJogadorId) {
          const [rel] = await db.select().from(jogadores).where(eq(jogadores.id, evento.relacionadoJogadorId)).limit(1)
          jogadorRelacionado = rel
        }
        return { ...evento, jogador, jogadorRelacionado }
      })
    )

    return NextResponse.json({
      ...partidaAtualizada,
      time,
      partidasParticipacao: participacoes,
      eventosPartida: eventosComJogadores,
    })
  } catch (error) {
    console.error("Erro ao atualizar partida:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar partida" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir partida
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

    // Verificar se a partida existe
    const [partida] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    if (!partida) {
      return NextResponse.json(
        { error: "Partida não encontrada" },
        { status: 404 }
      )
    }

    // Excluir a partida (cascade vai excluir participações e eventos)
    await db.delete(partidas).where(eq(partidas.id, id))

    return NextResponse.json({ message: "Partida excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir partida:", error)
    return NextResponse.json(
      { error: "Erro ao excluir partida" },
      { status: 500 }
    )
  }
}
