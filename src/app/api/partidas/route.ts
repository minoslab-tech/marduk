import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { partidas, partidasParticipacao, jogadores, eventosPartida } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"

// GET - Listar partidas
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") // agendada, em_andamento, finalizada, cancelada
    const tipo = searchParams.get("tipo") // amistoso, campeonato, treino

    // Construir filtros
    const filters = []
    if (status) {
      filters.push(eq(partidas.status, status))
    }
    if (tipo) {
      filters.push(eq(partidas.tipo, tipo))
    }

    // Buscar partidas
    const partidasList = await db
      .select()
      .from(partidas)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(partidas.dataHora))

    // Buscar participações e eventos para cada partida
    const partidasComDetalhes = await Promise.all(
      partidasList.map(async (partida) => {
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
          .where(eq(partidasParticipacao.partidaId, partida.id))

        const eventos = await db
          .select()
          .from(eventosPartida)
          .where(eq(eventosPartida.partidaId, partida.id))

        return {
          ...partida,
          partidasParticipacao: participacoes,
          eventosPartida: eventos,
        }
      })
    )

    return NextResponse.json(partidasComDetalhes)
  } catch (error) {
    console.error("Erro ao listar partidas:", error)
    return NextResponse.json(
      { error: "Erro ao listar partidas" },
      { status: 500 }
    )
  }
}

// POST - Criar nova partida
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const {
      timeId,
      dataHora,
      local,
      adversarioNome,
      tipo,
      status,
      golsPro,
      golsContra,
      observacoesTecnico,
    } = body

    // Validações
    if (!timeId || !dataHora || !local || !adversarioNome || !tipo) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    // Verificar se o tipo é válido
    const tiposValidos = ["amistoso", "campeonato", "treino"]
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de partida inválido" },
        { status: 400 }
      )
    }

    // Verificar se o status é válido
    const statusValidos = ["agendada", "em_andamento", "finalizada", "cancelada"]
    if (status && !statusValidos.includes(status)) {
      return NextResponse.json(
        { error: "Status de partida inválido" },
        { status: 400 }
      )
    }

    // Criar a partida
    const [partida] = await db
      .insert(partidas)
      .values({
        timeId,
        dataHora: new Date(dataHora),
        local,
        adversarioNome,
        tipo,
        status: status || "agendada",
        golsPro: golsPro || null,
        golsContra: golsContra || null,
        observacoesTecnico: observacoesTecnico || null,
      })
      .returning()

    return NextResponse.json(partida, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar partida:", error)
    return NextResponse.json(
      { error: "Erro ao criar partida" },
      { status: 500 }
    )
  }
}
