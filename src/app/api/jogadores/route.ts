import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { jogadores, times } from "@/db/schema"
import { eq, desc, asc, and } from "drizzle-orm"

// GET - Listar jogadores
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const timeId = searchParams.get("timeId")
    const ativo = searchParams.get("ativo")
    const posicao = searchParams.get("posicao")

    // Construir filtros
    const filters = []
    if (timeId) {
      filters.push(eq(jogadores.timeId, timeId))
    }
    if (ativo !== null && ativo !== undefined) {
      filters.push(eq(jogadores.ativo, ativo === "true"))
    }
    if (posicao) {
      filters.push(eq(jogadores.posicaoPrincipal, posicao))
    }

    const jogadoresList = await db
      .select({
        id: jogadores.id,
        timeId: jogadores.timeId,
        nomeCompleto: jogadores.nomeCompleto,
        posicaoPrincipal: jogadores.posicaoPrincipal,
        peDominante: jogadores.peDominante,
        dataNascimento: jogadores.dataNascimento,
        telefone: jogadores.telefone,
        fotoUrl: jogadores.fotoUrl,
        ativo: jogadores.ativo,
        createdAt: jogadores.createdAt,
        updatedAt: jogadores.updatedAt,
        time: times,
      })
      .from(jogadores)
      .leftJoin(times, eq(jogadores.timeId, times.id))
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(jogadores.ativo), asc(jogadores.nomeCompleto))

    return NextResponse.json(jogadoresList)
  } catch (error) {
    console.error("Erro ao listar jogadores:", error)
    return NextResponse.json(
      { error: "Erro ao listar jogadores" },
      { status: 500 }
    )
  }
}

// POST - Criar novo jogador
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const {
      timeId,
      nomeCompleto,
      posicaoPrincipal,
      peDominante,
      dataNascimento,
      telefone,
      fotoUrl,
      ativo,
    } = body

    // Validações
    if (!timeId || !nomeCompleto || !posicaoPrincipal || !peDominante) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      )
    }

    // Verificar se o time existe
    const [time] = await db.select().from(times).where(eq(times.id, timeId)).limit(1)

    if (!time) {
      return NextResponse.json(
        { error: "Time não encontrado" },
        { status: 404 }
      )
    }

    // Validar pé dominante
    const pesValidos = ["direito", "esquerdo", "ambidestro"]
    if (!pesValidos.includes(peDominante)) {
      return NextResponse.json(
        { error: "Pé dominante inválido" },
        { status: 400 }
      )
    }

    // Criar o jogador
    const [jogador] = await db
      .insert(jogadores)
      .values({
        timeId,
        nomeCompleto,
        posicaoPrincipal,
        peDominante,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        telefone: telefone || null,
        fotoUrl: fotoUrl || null,
        ativo: ativo !== undefined ? ativo : true,
      })
      .returning()

    // Buscar time para retornar completo
    const [timeCompleto] = await db.select().from(times).where(eq(times.id, jogador.timeId)).limit(1)

    return NextResponse.json({ ...jogador, time: timeCompleto }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar jogador:", error)
    return NextResponse.json(
      { error: "Erro ao criar jogador" },
      { status: 500 }
    )
  }
}
