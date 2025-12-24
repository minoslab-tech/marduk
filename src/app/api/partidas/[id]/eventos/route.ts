import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { partidas, eventosPartida, jogadores } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

// PUT - Atualizar todos os eventos da partida
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

    const { eventos } = body

    if (!Array.isArray(eventos)) {
      return NextResponse.json(
        { error: "eventos deve ser um array" },
        { status: 400 }
      )
    }

    // Validar tipos de evento
    const tiposValidos = ["gol", "assistencia", "cartao_amarelo", "cartao_vermelho", "substituicao"]

    for (const evento of eventos) {
      if (!tiposValidos.includes(evento.tipoEvento)) {
        return NextResponse.json(
          { error: `Tipo de evento inválido: ${evento.tipoEvento}` },
          { status: 400 }
        )
      }
    }

    // Atualizar eventos
    // Deletar eventos existentes
    await db.delete(eventosPartida).where(eq(eventosPartida.partidaId, id))

    // Criar novos eventos
    if (eventos.length > 0) {
      await db.insert(eventosPartida).values(
        eventos.map((evento: any) => ({
          partidaId: id,
          jogadorId: evento.jogadorId,
          tipoEvento: evento.tipoEvento,
          minuto: evento.minuto,
          relacionadoJogadorId: evento.relacionadoJogadorId || null,
          observacao: evento.observacao || null,
        }))
      )
    }

    // Buscar a partida atualizada com os eventos
    const [partidaAtualizada] = await db.select().from(partidas).where(eq(partidas.id, id)).limit(1)

    const eventosCompletos = await db
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
      eventosCompletos.map(async (evento) => {
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
      eventosPartida: eventosComJogadores,
    })
  } catch (error) {
    console.error("Erro ao atualizar eventos:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar eventos" },
      { status: 500 }
    )
  }
}

// POST - Adicionar um novo evento à partida
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
      tipoEvento,
      minuto,
      relacionadoJogadorId,
      observacao,
    } = body

    if (!jogadorId || !tipoEvento || minuto === undefined) {
      return NextResponse.json(
        { error: "jogadorId, tipoEvento e minuto são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar tipo de evento
    const tiposValidos = ["gol", "assistencia", "cartao_amarelo", "cartao_vermelho", "substituicao"]
    if (!tiposValidos.includes(tipoEvento)) {
      return NextResponse.json(
        { error: "Tipo de evento inválido" },
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

    // Verificar jogador relacionado se fornecido
    if (relacionadoJogadorId) {
      const [jogadorRelacionado] = await db.select().from(jogadores).where(eq(jogadores.id, relacionadoJogadorId)).limit(1)

      if (!jogadorRelacionado) {
        return NextResponse.json(
          { error: "Jogador relacionado não encontrado" },
          { status: 404 }
        )
      }
    }

    // Criar o evento
    const [evento] = await db
      .insert(eventosPartida)
      .values({
        partidaId: id,
        jogadorId,
        tipoEvento,
        minuto,
        relacionadoJogadorId: relacionadoJogadorId || null,
        observacao: observacao || null,
      })
      .returning()

    // Buscar dados completos com jogadores
    const [jog] = await db.select().from(jogadores).where(eq(jogadores.id, evento.jogadorId)).limit(1)
    let jogRel = null
    if (evento.relacionadoJogadorId) {
      const [rel] = await db.select().from(jogadores).where(eq(jogadores.id, evento.relacionadoJogadorId)).limit(1)
      jogRel = rel
    }

    return NextResponse.json(
      { ...evento, jogador: jog, jogadorRelacionado: jogRel },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar evento:", error)
    return NextResponse.json(
      { error: "Erro ao criar evento" },
      { status: 500 }
    )
  }
}

// DELETE - Excluir um evento específico
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const eventoId = searchParams.get("eventoId")

    if (!eventoId) {
      return NextResponse.json(
        { error: "eventoId é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o evento existe
    const [evento] = await db.select().from(eventosPartida).where(eq(eventosPartida.id, eventoId)).limit(1)

    if (!evento) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      )
    }

    // Excluir o evento
    await db.delete(eventosPartida).where(eq(eventosPartida.id, eventoId))

    return NextResponse.json({ message: "Evento excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir evento:", error)
    return NextResponse.json(
      { error: "Erro ao excluir evento" },
      { status: 500 }
    )
  }
}
