import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { partidas, jogadores, eventosPartida, partidasParticipacao, times } from "@/db/schema"
import { eq, desc, asc, gte, and, or, count, sum, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar o time do usuário (usando o primeiro time disponível)
    const [time] = await db.select().from(times).limit(1)
    
    if (!time) {
      return NextResponse.json({ error: "Time não encontrado" }, { status: 404 })
    }

    // Buscar próxima partida (primeira partida agendada ou em andamento)
    const [proximaPartida] = await db
      .select()
      .from(partidas)
      .where(
        and(
          eq(partidas.timeId, time.id),
          or(
            eq(partidas.status, "agendada"),
            eq(partidas.status, "em_andamento")
          )
        )
      )
      .orderBy(asc(partidas.dataHora))
      .limit(1)

    // Buscar todas as partidas finalizadas
    const partidasFinalizadas = await db
      .select()
      .from(partidas)
      .where(
        and(
          eq(partidas.timeId, time.id),
          eq(partidas.status, "finalizada")
        )
      )

    // Calcular estatísticas
    const vitorias = partidasFinalizadas.filter(p => 
      (p.golsPro !== null && p.golsContra !== null && p.golsPro > p.golsContra)
    ).length
    
    const empates = partidasFinalizadas.filter(p => 
      (p.golsPro !== null && p.golsContra !== null && p.golsPro === p.golsContra)
    ).length
    
    const derrotas = partidasFinalizadas.filter(p => 
      (p.golsPro !== null && p.golsContra !== null && p.golsPro < p.golsContra)
    ).length

    const totalJogos = partidasFinalizadas.length
    const aproveitamento = totalJogos > 0 
      ? Math.round(((vitorias * 3 + empates) / (totalJogos * 3)) * 100) 
      : 0

    // Buscar jogadores ativos
    const jogadoresAtivos = await db
      .select()
      .from(jogadores)
      .where(
        and(
          eq(jogadores.timeId, time.id),
          eq(jogadores.ativo, true)
        )
      )

    // Buscar artilheiros (jogadores com mais gols)
    const gols = await db
      .select({
        jogadorId: eventosPartida.jogadorId,
        jogadorNome: jogadores.nomeCompleto,
        totalGols: count(eventosPartida.id),
      })
      .from(eventosPartida)
      .leftJoin(jogadores, eq(eventosPartida.jogadorId, jogadores.id))
      .leftJoin(partidas, eq(eventosPartida.partidaId, partidas.id))
      .where(
        and(
          eq(eventosPartida.tipoEvento, "gol"),
          eq(partidas.timeId, time.id),
          eq(partidas.status, "finalizada")
        )
      )
      .groupBy(eventosPartida.jogadorId, jogadores.nomeCompleto)
      .orderBy(desc(count(eventosPartida.id)))
      .limit(3)

    // Buscar número de jogos de cada artilheiro
    const artilheirosComJogos = await Promise.all(
      gols.map(async (artilheiro) => {
        const participacoes = await db
          .select({ count: count() })
          .from(partidasParticipacao)
          .leftJoin(partidas, eq(partidasParticipacao.partidaId, partidas.id))
          .where(
            and(
              eq(partidasParticipacao.jogadorId, artilheiro.jogadorId),
              eq(partidas.status, "finalizada")
            )
          )

        return {
          nome: artilheiro.jogadorNome || "Desconhecido",
          gols: Number(artilheiro.totalGols),
          jogos: participacoes[0]?.count || 0,
        }
      })
    )

    // Buscar últimos 5 resultados
    const ultimosResultados = await db
      .select()
      .from(partidas)
      .where(
        and(
          eq(partidas.timeId, time.id),
          eq(partidas.status, "finalizada")
        )
      )
      .orderBy(desc(partidas.dataHora))
      .limit(5)

    // Calcular estatísticas de gols
    const golsMarcados = partidasFinalizadas.reduce((sum, p) => sum + (p.golsPro || 0), 0)
    const golsSofridos = partidasFinalizadas.reduce((sum, p) => sum + (p.golsContra || 0), 0)
    const saldoGols = golsMarcados - golsSofridos

    const overview = {
      time: {
        id: time.id,
        nome: time.nome,
        shieldImg: time.shieldImg,
      },
      proximaPartida: proximaPartida ? {
        id: proximaPartida.id,
        adversario: proximaPartida.adversarioNome,
        tipo: proximaPartida.tipo,
        dataHora: proximaPartida.dataHora,
        local: proximaPartida.local,
        status: proximaPartida.status,
      } : null,
      resumo: {
        vitorias: {
          valor: vitorias,
          porcentagem: `${aproveitamento}% de aproveitamento`,
        },
        empates: {
          valor: empates,
          total: `${totalJogos} jogos totais`,
        },
        derrotas: {
          valor: derrotas,
          mensagem: derrotas <= vitorias ? "Continue melhorando!" : "Vamos buscar a virada!",
        },
        jogadores: {
          valor: jogadoresAtivos.length,
          mensagem: jogadoresAtivos.length >= 11 ? "Elenco completo" : "Elenco em formação",
        },
      },
      artilheiros: artilheirosComJogos,
      ultimosResultados: ultimosResultados.map(p => ({
        id: p.id,
        adversario: p.adversarioNome,
        dataHora: p.dataHora,
        golsPro: p.golsPro,
        golsContra: p.golsContra,
        resultado: p.golsPro! > p.golsContra! ? 'V' : p.golsPro === p.golsContra ? 'E' : 'D',
      })),
      estatisticas: {
        golsMarcados,
        golsSofridos,
        saldoGols,
        totalJogos,
        vitorias,
        empates,
        derrotas,
      },
    }

    return NextResponse.json(overview)
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
}
