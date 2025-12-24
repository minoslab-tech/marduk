import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { jogadores, times, partidasParticipacao, partidas, eventosPartida } from "@/db/schema"
import { eq, or } from "drizzle-orm"

// GET - Obter estatísticas do jogador
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

    // Verificar se o jogador existe
    const [jogador] = await db
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
      .where(eq(jogadores.id, id))
      .limit(1)

    if (!jogador) {
      return NextResponse.json(
        { error: "Jogador não encontrado" },
        { status: 404 }
      )
    }

    // Buscar todas as participações
    const participacoes = await db
      .select({
        id: partidasParticipacao.id,
        titular: partidasParticipacao.titular,
        minutosJogados: partidasParticipacao.minutosJogados,
        notaTecnica: partidasParticipacao.notaTecnica,
        partida: partidas,
      })
      .from(partidasParticipacao)
      .leftJoin(partidas, eq(partidasParticipacao.partidaId, partidas.id))
      .where(eq(partidasParticipacao.jogadorId, id))

    // Buscar todos os eventos
    const eventos = await db
      .select({
        id: eventosPartida.id,
        tipoEvento: eventosPartida.tipoEvento,
        jogadorId: eventosPartida.jogadorId,
        relacionadoJogadorId: eventosPartida.relacionadoJogadorId,
        partida: partidas,
      })
      .from(eventosPartida)
      .leftJoin(partidas, eq(eventosPartida.partidaId, partidas.id))
      .where(
        or(
          eq(eventosPartida.jogadorId, id),
          eq(eventosPartida.relacionadoJogadorId, id)
        )
      )

    // Calcular estatísticas
    const totalPartidas = participacoes.length
    const partidasComoTitular = participacoes.filter((p) => p.titular).length
    const minutosJogados = participacoes.reduce(
      (sum, p) => sum + (p.minutosJogados || 0),
      0
    )
    const mediaMinutos = totalPartidas > 0 ? minutosJogados / totalPartidas : 0

    const notaMedia =
      participacoes.filter((p) => p.notaTecnica !== null).length > 0
        ? participacoes.reduce((sum, p) => sum + (p.notaTecnica || 0), 0) /
          participacoes.filter((p) => p.notaTecnica !== null).length
        : null

    const gols = eventos.filter(
      (e) => e.tipoEvento === "gol" && e.jogadorId === id
    ).length

    const assistencias = eventos.filter(
      (e) => e.tipoEvento === "gol" && e.relacionadoJogadorId === id
    ).length

    const cartoesAmarelos = eventos.filter(
      (e) => e.tipoEvento === "cartao_amarelo" && e.jogadorId === id
    ).length

    const cartoesVermelhos = eventos.filter(
      (e) => e.tipoEvento === "cartao_vermelho" && e.jogadorId === id
    ).length

    // Estatísticas por tipo de partida
    const estatisticasPorTipo = {
      campeonato: {
        partidas: 0,
        gols: 0,
        assistencias: 0,
      },
      amistoso: {
        partidas: 0,
        gols: 0,
        assistencias: 0,
      },
      treino: {
        partidas: 0,
        gols: 0,
        assistencias: 0,
      },
    }

    participacoes.forEach((p) => {
      if (p.partida) {
        const tipo = p.partida.tipo as "campeonato" | "amistoso" | "treino"
        if (estatisticasPorTipo[tipo]) {
          estatisticasPorTipo[tipo].partidas++
        }
      }
    })

    eventos
      .filter((e) => e.tipoEvento === "gol" && e.jogadorId === id)
      .forEach((e) => {
        if (e.partida) {
          const tipo = e.partida.tipo as "campeonato" | "amistoso" | "treino"
          if (estatisticasPorTipo[tipo]) {
            estatisticasPorTipo[tipo].gols++
          }
        }
      })

    eventos
      .filter((e) => e.tipoEvento === "gol" && e.relacionadoJogadorId === id)
      .forEach((e) => {
        if (e.partida) {
          const tipo = e.partida.tipo as "campeonato" | "amistoso" | "treino"
          if (estatisticasPorTipo[tipo]) {
            estatisticasPorTipo[tipo].assistencias++
          }
        }
      })

    const estatisticas = {
      jogador,
      resumo: {
        totalPartidas,
        partidasComoTitular,
        partidasComoReserva: totalPartidas - partidasComoTitular,
        minutosJogados,
        mediaMinutos: Math.round(mediaMinutos),
        notaMedia: notaMedia ? Number(notaMedia.toFixed(2)) : null,
        gols,
        assistencias,
        cartoesAmarelos,
        cartoesVermelhos,
        mediaGolsPorPartida: totalPartidas > 0 ? (gols / totalPartidas).toFixed(2) : "0.00",
      },
      porTipo: estatisticasPorTipo,
      ultimasPartidas: participacoes.slice(0, 5).filter(p => p.partida).map((p) => ({
        id: p.partida!.id,
        adversario: p.partida!.adversarioNome,
        data: p.partida!.dataHora,
        tipo: p.partida!.tipo,
        titular: p.titular,
        minutosJogados: p.minutosJogados,
        notaTecnica: p.notaTecnica,
        resultado: p.partida!.status === "finalizada" ? {
          golsPro: p.partida!.golsPro,
          golsContra: p.partida!.golsContra,
        } : null,
      })),
    }

    return NextResponse.json(estatisticas)
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}
