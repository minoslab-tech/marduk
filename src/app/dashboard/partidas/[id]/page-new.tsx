"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, ArrowRightLeft, Check, Trophy, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePartida } from "@/hooks/usePartidas"

const getRatingColor = (rating: number) => {
  if (rating >= 8.0) return "bg-green-500 text-white"
  if (rating >= 7.0) return "bg-blue-500 text-white"
  if (rating >= 6.0) return "bg-yellow-500 text-white"
  return "bg-red-500 text-white"
}

export default function MatchDetailsPage() {
  const params = useParams()
  const matchId = params.id as string
  const [activeTab, setActiveTab] = useState<"resumo" | "eventos" | "elenco">("resumo")
  
  const { partida, loading } = usePartida(matchId)

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando partida...</p>
        </div>
      </div>
    )
  }

  if (!partida) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Partida não encontrada</h1>
          <Link href="/dashboard/partidas">
            <Button>Voltar para Partidas</Button>
          </Link>
        </div>
      </div>
    )
  }

  const golsPro = partida.golsPro ?? 0
  const golsContra = partida.golsContra ?? 0
  const resultado = golsPro > golsContra ? "VITÓRIA" : golsPro < golsContra ? "DERROTA" : "EMPATE"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular gols e assistências dos jogadores
  const eventosGol = partida.eventosPartida?.filter((e) => e.tipoEvento === "gol") || []
  const jogadoresComGols = eventosGol.reduce((acc, evento) => {
    acc[evento.jogadorId] = (acc[evento.jogadorId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const jogadoresComAssistencias = eventosGol.reduce((acc, evento) => {
    if (evento.relacionadoJogadorId) {
      acc[evento.relacionadoJogadorId] = (acc[evento.relacionadoJogadorId] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/partidas?tab=finalizados">
            <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
          </Link>
        </div>
        <div className="text-center">
          <p className="text-white/90 mb-4 text-base">
            {formatDate(partida.dataHora)} • {formatTime(partida.dataHora)}
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-xl font-semibold">{partida.time?.nome || "Garra FC"}</span>
            <div className="flex items-center gap-2">
              <div
                className={`px-4 py-2 rounded-lg ${
                  golsPro > golsContra ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    golsPro > golsContra ? "text-white" : "text-gray-800"
                  }`}
                >
                  {golsPro}
                </span>
              </div>
              <span className="text-3xl font-bold text-white">×</span>
              <div
                className={`px-4 py-2 rounded-lg ${
                  golsContra > golsPro ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    golsContra > golsPro ? "text-white" : "text-gray-800"
                  }`}
                >
                  {golsContra}
                </span>
              </div>
            </div>
            <span className="text-xl font-semibold">{partida.adversarioNome}</span>
          </div>
          <div className="flex justify-center">
            <Badge
              className={`${
                resultado === "VITÓRIA"
                  ? "bg-green-500 text-white border-green-500"
                  : resultado === "DERROTA"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-yellow-500 text-white border-yellow-500"
              } border font-medium px-4 py-1.5 rounded-md`}
            >
              {resultado}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8 justify-center">
          <button
            onClick={() => setActiveTab("resumo")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "resumo"
                ? "text-green-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            RESUMO
            {activeTab === "resumo" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("eventos")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "eventos"
                ? "text-green-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            EVENTOS
            {activeTab === "eventos" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("elenco")}
            className={`py-4 px-2 font-medium text-sm transition-colors relative ${
              activeTab === "elenco"
                ? "text-green-500 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ELENCO E NOTAS
            {activeTab === "elenco" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-6 space-y-6 px-6">
        {activeTab === "resumo" && (
          <div className="space-y-6">
            {/* Observações do Técnico */}
            {partida.observacoesTecnico && (
              <div className="bg-white rounded-lg p-4 space-y-2 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Observações do Técnico
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {partida.observacoesTecnico}
                </p>
              </div>
            )}

            {/* Estatísticas Rápidas */}
            <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Estatísticas Rápidas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-1">
                    {golsPro}
                  </div>
                  <div className="text-sm font-medium text-green-500">
                    Gols Marcados
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    {golsContra}
                  </div>
                  <div className="text-sm font-medium text-red-500">
                    Gols Sofridos
                  </div>
                </div>
              </div>
            </div>

            {/* Melhores em Campo */}
            {partida.partidasParticipacao && partida.partidasParticipacao.length > 0 && (
              <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Melhores em Campo
                </h2>
                <div className="space-y-3">
                  {partida.partidasParticipacao
                    .map((p) => ({
                      ...p,
                      gols: jogadoresComGols[p.jogadorId] || 0,
                      assists: jogadoresComAssistencias[p.jogadorId] || 0,
                    }))
                    .filter((p) => p.gols > 0 || p.assists > 0)
                    .sort((a, b) => {
                      const participacoesA = a.gols + a.assists
                      const participacoesB = b.gols + b.assists
                      if (participacoesB !== participacoesA) {
                        return participacoesB - participacoesA
                      }
                      return b.gols - a.gols
                    })
                    .slice(0, 3)
                    .map((participacao, index) => {
                      const positionColors = [
                        "bg-yellow-500",
                        "bg-gray-400",
                        "bg-orange-500",
                      ]
                      const participacoes = participacao.gols + participacao.assists
                      return (
                        <div
                          key={participacao.id}
                          className="flex items-center justify-between bg-white border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 ${positionColors[index]} rounded-full flex items-center justify-center text-white font-bold`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {participacao.jogador.nomeCompleto}
                              </div>
                              <div className="text-sm text-gray-600">
                                {participacao.gols}{" "}
                                {participacao.gols === 1 ? "gol" : "gols"} •{" "}
                                {participacao.assists}{" "}
                                {participacao.assists === 1 ? "assistência" : "assistências"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {participacoes}{" "}
                            {participacoes === 1 ? "participação" : "participações"}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "eventos" && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Eventos da Partida
            </h2>
            {partida.eventosPartida && partida.eventosPartida.length > 0 ? (
              <div className="space-y-4 w-full">
                {partida.eventosPartida
                  .sort((a, b) => a.minuto - b.minuto)
                  .map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-start gap-4 bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-2 min-w-[60px]">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            evento.tipoEvento === "gol"
                              ? "bg-green-500"
                              : evento.tipoEvento === "cartao_amarelo"
                              ? "bg-yellow-500"
                              : evento.tipoEvento === "cartao_vermelho"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <span className="font-semibold text-gray-700">
                          {evento.minuto}'
                        </span>
                      </div>
                      <div className="flex-1">
                        {evento.tipoEvento === "gol" && (
                          <div>
                            <div className="font-medium text-gray-900">
                              GOL - {evento.jogador.nomeCompleto}
                            </div>
                            {evento.jogadorRelacionado && (
                              <div className="text-sm text-gray-600 mt-1">
                                Assistência: {evento.jogadorRelacionado.nomeCompleto}
                              </div>
                            )}
                          </div>
                        )}
                        {evento.tipoEvento === "cartao_amarelo" && (
                          <div className="font-medium text-gray-900">
                            Cartão Amarelo - {evento.jogador.nomeCompleto}
                          </div>
                        )}
                        {evento.tipoEvento === "cartao_vermelho" && (
                          <div className="font-medium text-gray-900">
                            Cartão Vermelho - {evento.jogador.nomeCompleto}
                          </div>
                        )}
                        {evento.tipoEvento === "substituicao" && (
                          <div>
                            <div className="flex items-center gap-2">
                              <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-gray-900">
                                Substituição
                              </span>
                            </div>
                            {evento.jogadorRelacionado && (
                              <div className="text-sm text-red-600 mt-1">
                                Sai: {evento.jogadorRelacionado.nomeCompleto}
                              </div>
                            )}
                            <div className="text-sm text-green-600 mt-1">
                              Entra: {evento.jogador.nomeCompleto}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum evento registrado</p>
            )}
          </div>
        )}

        {activeTab === "elenco" && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Participação dos Jogadores
            </h2>
            {partida.partidasParticipacao && partida.partidasParticipacao.length > 0 ? (
              <div className="bg-white rounded-lg border overflow-hidden w-full">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Jogador
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Ti.
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Min.
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Nota
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {partida.partidasParticipacao
                        .sort((a, b) => {
                          if (a.titular !== b.titular) return a.titular ? -1 : 1
                          return (b.minutosJogados || 0) - (a.minutosJogados || 0)
                        })
                        .map((participacao, index) => (
                          <tr
                            key={participacao.id}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {participacao.jogador.nomeCompleto}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {participacao.jogador.posicaoPrincipal}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {participacao.titular ? (
                                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" />
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-gray-700">
                              {participacao.minutosJogados || 0}'
                            </td>
                            <td className="px-4 py-3 text-center">
                              {participacao.notaTecnica ? (
                                <Badge
                                  className={`${getRatingColor(
                                    participacao.notaTecnica
                                  )} border font-medium px-2 py-0.5`}
                                >
                                  {participacao.notaTecnica.toFixed(1)}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-600">
                  <p>Ti. = Titular • Min. = Minutos</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma participação registrada</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-6 py-4 flex items-center justify-center">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-base font-medium">
          <Edit className="h-5 w-5 mr-2" />
          Editar Dados e Estatísticas
        </Button>
      </div>
    </div>
  )
}
