import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { escalacoes, times, escalacoesJogadores, jogadores } from "@/db/schema"
import { eq, desc, asc, and } from "drizzle-orm"

// GET - Listar escalações
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const timeId = searchParams.get("timeId")
    const ativa = searchParams.get("ativa")

    // Construir filtros
    const filters = []
    if (timeId) {
      filters.push(eq(escalacoes.timeId, timeId))
    }
    if (ativa !== null && ativa !== undefined) {
      filters.push(eq(escalacoes.ativa, ativa === "true"))
    }

    const escalacoesList = await db
      .select()
      .from(escalacoes)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(escalacoes.ativa), desc(escalacoes.updatedAt))

    // Buscar dados completos para cada escalação
    const escalacoesCompletas = await Promise.all(
      escalacoesList.map(async (escalacao) => {
        const [time] = await db.select().from(times).where(eq(times.id, escalacao.timeId)).limit(1)

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
          .where(eq(escalacoesJogadores.escalacaoId, escalacao.id))
          .orderBy(desc(escalacoesJogadores.titular), asc(escalacoesJogadores.ordem))

        return {
          ...escalacao,
          time,
          escalacoesJogadores: jogadoresEscalacao,
        }
      })
    )

    return NextResponse.json(escalacoesCompletas)
  } catch (error) {
    console.error("Erro ao listar escalações:", error)
    return NextResponse.json(
      { error: "Erro ao listar escalações" },
      { status: 500 }
    )
  }
}

// POST - Criar nova escalação
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { timeId, nome, esquemaTatico, descricao, ativa, jogadores } = body

    // Validações
    if (!timeId || !nome || !esquemaTatico) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    // Se for marcar como ativa, desativar as outras
    if (ativa) {
      await db
        .update(escalacoes)
        .set({ ativa: false, updatedAt: new Date() })
        .where(
          and(
            eq(escalacoes.timeId, timeId),
            eq(escalacoes.ativa, true)
          )
        )
    }

    // Criar a escalação
    const [escalacao] = await db
      .insert(escalacoes)
      .values({
        timeId,
        nome,
        esquemaTatico,
        descricao: descricao || null,
        ativa: ativa || false,
      })
      .returning()

    // Adicionar jogadores se fornecidos
    if (jogadores && Array.isArray(jogadores) && jogadores.length > 0) {
      await db.insert(escalacoesJogadores).values(
        jogadores.map((jogador: any, index: number) => ({
          escalacaoId: escalacao.id,
          jogadorId: jogador.jogadorId,
          titular: jogador.titular || false,
          posicaoEmCampo: jogador.posicaoEmCampo,
          numeroCamisa: jogador.numeroCamisa || null,
          ordem: jogador.ordem || index + 1,
        }))
      )
    }

    // Buscar escalação completa
    const [escalacaoCompleta] = await db.select().from(escalacoes).where(eq(escalacoes.id, escalacao.id)).limit(1)
    const [time] = await db.select().from(times).where(eq(times.id, escalacaoCompleta.timeId)).limit(1)

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
      .where(eq(escalacoesJogadores.escalacaoId, escalacao.id))
      .orderBy(desc(escalacoesJogadores.titular), asc(escalacoesJogadores.ordem))

    return NextResponse.json(
      {
        ...escalacaoCompleta,
        time,
        escalacoesJogadores: jogadoresEscalacao,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erro ao criar escalação:", error)
    return NextResponse.json(
      { error: "Erro ao criar escalação" },
      { status: 500 }
    )
  }
}
