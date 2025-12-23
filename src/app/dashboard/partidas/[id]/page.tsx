"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, HelpCircle, ArrowRightLeft, Check, Trophy, Target, TrendingUp, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Card } from "@/components/ui/card"

// Dados mockados das partidas
const matchData: Record<
  string,
  {
    opponent: string
    type: "Campeonato" | "Amistoso"
    date: string
    time: string
    location: string
    ourScore: number
    opponentScore: number
    result: "VITÓRIA" | "DERROTA" | "EMPATE"
    coachNotes?: string
    last5Games?: Array<"VITÓRIA" | "DERROTA" | "EMPATE">
    players: Array<{
      id: string
      name: string
      fullName: string
      isStarter: boolean
      minutes: number
      goals: number
      assists: number
      yellowCards: number
      redCards: number
      rating: number
    }>
    events: Array<{
      id: string
      minute: number
      type: "goal" | "yellowCard" | "redCard" | "substitution"
      player: string
      assist?: string
      subOut?: string
      subIn?: string
    }>
  }
> = {
  "1": {
    opponent: "Tigres FC",
    type: "Campeonato",
    date: "30 de novembro de 2024",
    time: "14:00",
    location: "Campo do Parque Central",
    ourScore: 3,
    opponentScore: 1,
    result: "VITÓRIA",
    coachNotes: "Ótima atuação da equipe. Mantivemos a posse de bola e criamos várias oportunidades. A defesa trabalhou bem, mas precisa melhorar na saída de bola. Pedrinho e João fizeram uma excelente dupla de ataque.",
    last5Games: ["VITÓRIA", "VITÓRIA", "EMPATE", "DERROTA", "VITÓRIA"],
    players: [
      {
        id: "1",
        name: "João",
        fullName: "João Silva",
        isStarter: true,
        minutes: 90,
        goals: 2,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 8.5,
      },
      {
        id: "2",
        name: "Pedrinho",
        fullName: "Pedro Santos",
        isStarter: true,
        minutes: 90,
        goals: 1,
        assists: 1,
        yellowCards: 1,
        redCards: 0,
        rating: 7.5,
      },
      {
        id: "3",
        name: "Carlinhos",
        fullName: "Carlos Mendes",
        isStarter: true,
        minutes: 85,
        goals: 0,
        assists: 2,
        yellowCards: 0,
        redCards: 0,
        rating: 8.0,
      },
      {
        id: "4",
        name: "Rafa",
        fullName: "Rafael Costa",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 1,
        redCards: 0,
        rating: 7.0,
      },
      {
        id: "5",
        name: "Lucas",
        fullName: "Lucas Oliveira",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 7.5,
      },
      {
        id: "6",
        name: "Marquinhos",
        fullName: "Marcos Paulo",
        isStarter: false,
        minutes: 5,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 6.5,
      },
      {
        id: "7",
        name: "André",
        fullName: "André Lima",
        isStarter: false,
        minutes: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 0,
      },
    ],
    events: [
      {
        id: "1",
        minute: 12,
        type: "goal",
        player: "João",
        assist: "Carlinhos",
      },
      {
        id: "2",
        minute: 28,
        type: "yellowCard",
        player: "Rafa",
      },
      {
        id: "3",
        minute: 35,
        type: "goal",
        player: "Pedrinho",
        assist: "Carlinhos",
      },
      {
        id: "4",
        minute: 58,
        type: "goal",
        player: "João",
        assist: "Pedrinho",
      },
      {
        id: "5",
        minute: 72,
        type: "yellowCard",
        player: "Pedrinho",
      },
      {
        id: "6",
        minute: 85,
        type: "substitution",
        player: "",
        subOut: "Carlinhos",
        subIn: "Marquinhos",
      },
    ],
  },
  "2": {
    opponent: "Leões do Norte",
    type: "Campeonato",
    date: "24 de novembro de 2024",
    time: "15:30",
    location: "Estádio Regional",
    ourScore: 2,
    opponentScore: 2,
    result: "EMPATE",
    coachNotes: "Jogo equilibrado contra um adversário forte. Conquistamos um empate importante, mas perdemos alguns pontos. A equipe mostrou determinação, especialmente no segundo tempo. Precisamos melhorar na criação de oportunidades e na finalização. Pedrinho teve uma boa atuação e João marcou um gol importante.",
    last5Games: ["VITÓRIA", "VITÓRIA", "EMPATE", "DERROTA", "VITÓRIA"],
    players: [
      {
        id: "1",
        name: "João",
        fullName: "João Silva",
        isStarter: true,
        minutes: 90,
        goals: 1,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 7.5,
      },
      {
        id: "2",
        name: "Pedrinho",
        fullName: "Pedro Santos",
        isStarter: true,
        minutes: 90,
        goals: 1,
        assists: 1,
        yellowCards: 0,
        redCards: 0,
        rating: 8.0,
      },
      {
        id: "3",
        name: "Carlinhos",
        fullName: "Carlos Mendes",
        isStarter: true,
        minutes: 75,
        goals: 0,
        assists: 1,
        yellowCards: 0,
        redCards: 0,
        rating: 7.0,
      },
      {
        id: "4",
        name: "Rafa",
        fullName: "Rafael Costa",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 6.5,
      },
      {
        id: "5",
        name: "Lucas",
        fullName: "Lucas Oliveira",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 1,
        redCards: 0,
        rating: 6.8,
      },
      {
        id: "6",
        name: "Marquinhos",
        fullName: "Marcos Paulo",
        isStarter: false,
        minutes: 15,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 6.0,
      },
      {
        id: "7",
        name: "André",
        fullName: "André Lima",
        isStarter: false,
        minutes: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 0,
      },
      {
        id: "8",
        name: "Bruno",
        fullName: "Bruno Ferreira",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 7.2,
      },
    ],
    events: [
      {
        id: "1",
        minute: 18,
        type: "goal",
        player: "João",
        assist: "Carlinhos",
      },
      {
        id: "2",
        minute: 42,
        type: "yellowCard",
        player: "Lucas",
      },
      {
        id: "3",
        minute: 55,
        type: "goal",
        player: "Pedrinho",
        assist: "Carlinhos",
      },
      {
        id: "4",
        minute: 75,
        type: "substitution",
        player: "",
        subOut: "Carlinhos",
        subIn: "Marquinhos",
      },
    ],
  },
  "3": {
    opponent: "FC Vitória",
    type: "Amistoso",
    date: "17 de novembro de 2024",
    time: "16:00",
    location: "Campo do Clube",
    ourScore: 1,
    opponentScore: 3,
    result: "DERROTA",
    coachNotes: "Derrota difícil que nos serve de aprendizado. A defesa teve dificuldades para conter o ataque adversário. Precisamos trabalhar mais na marcação e na organização defensiva. A equipe não desistiu e João conseguiu marcar um gol. Vamos analisar os erros e melhorar para os próximos jogos.",
    last5Games: ["DERROTA", "VITÓRIA", "VITÓRIA", "EMPATE", "DERROTA"],
    players: [
      {
        id: "1",
        name: "João",
        fullName: "João Silva",
        isStarter: true,
        minutes: 90,
        goals: 1,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 6.5,
      },
      {
        id: "2",
        name: "Pedrinho",
        fullName: "Pedro Santos",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 1,
        yellowCards: 1,
        redCards: 0,
        rating: 6.0,
      },
      {
        id: "3",
        name: "Carlinhos",
        fullName: "Carlos Mendes",
        isStarter: true,
        minutes: 60,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 5.5,
      },
      {
        id: "4",
        name: "Rafa",
        fullName: "Rafael Costa",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 1,
        redCards: 0,
        rating: 5.8,
      },
      {
        id: "5",
        name: "Lucas",
        fullName: "Lucas Oliveira",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 6.2,
      },
      {
        id: "6",
        name: "Marquinhos",
        fullName: "Marcos Paulo",
        isStarter: false,
        minutes: 30,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 5.5,
      },
      {
        id: "7",
        name: "André",
        fullName: "André Lima",
        isStarter: false,
        minutes: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 0,
      },
      {
        id: "8",
        name: "Bruno",
        fullName: "Bruno Ferreira",
        isStarter: true,
        minutes: 90,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        rating: 5.0,
      },
    ],
    events: [
      {
        id: "1",
        minute: 25,
        type: "goal",
        player: "João",
        assist: "Pedrinho",
      },
      {
        id: "2",
        minute: 38,
        type: "yellowCard",
        player: "Pedrinho",
      },
      {
        id: "3",
        minute: 52,
        type: "yellowCard",
        player: "Rafa",
      },
      {
        id: "4",
        minute: 60,
        type: "substitution",
        player: "",
        subOut: "Carlinhos",
        subIn: "Marquinhos",
      },
    ],
  },
}

const getResultColor = (result: string) => {
  switch (result) {
    case "VITÓRIA":
      return "text-green-600"
    case "DERROTA":
      return "text-red-600"
    case "EMPATE":
      return "text-yellow-600"
    default:
      return "text-gray-700"
  }
}

const getScoreColor = (ourScore: number, opponentScore: number) => {
  if (ourScore > opponentScore) {
    return { ourColor: "text-green-500", opponentColor: "text-gray-700" }
  } else if (ourScore < opponentScore) {
    return { ourColor: "text-gray-700", opponentColor: "text-red-500" }
  } else {
    return { ourColor: "text-gray-700", opponentColor: "text-gray-700" }
  }
}

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

  const match = matchData[matchId]

  if (!match) {
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

  const scoreColors = getScoreColor(match.ourScore, match.opponentScore)

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
          {match.date} • {match.time}
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-xl font-semibold">Garra FC</span>
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-lg ${match.ourScore > match.opponentScore
              ? "bg-green-500"
              : match.ourScore < match.opponentScore
                ? "bg-gray-300"
                : "bg-gray-300"
              }`}>
              <span className={`text-2xl font-bold ${match.ourScore > match.opponentScore
                ? "text-white"
                : "text-gray-800"
                }`}>
                {match.ourScore}
              </span>
            </div>
            <span className="text-3xl font-bold text-white">×</span>
            <div className={`px-4 py-2 rounded-lg ${match.opponentScore > match.ourScore
              ? "bg-green-500"
              : match.opponentScore < match.ourScore
                ? "bg-gray-300"
                : "bg-gray-300"
              }`}>
              <span className={`text-2xl font-bold ${match.opponentScore > match.ourScore
                ? "text-white"
                : "text-gray-800"
                }`}>
                {match.opponentScore}
              </span>
            </div>
          </div>
          <span className="text-xl font-semibold">{match.opponent}</span>
        </div>
        <div className="flex justify-center">
          <Badge
            className={`${match.result === "VITÓRIA"
              ? "bg-green-500 text-white border-green-500"
              : match.result === "DERROTA"
                ? "bg-red-500 text-white border-red-500"
                : "bg-yellow-500 text-white border-yellow-500"
              } border font-medium px-4 py-1.5 rounded-md`}
          >
            {match.result}
          </Badge>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-8 justify-center">
        <button
          onClick={() => setActiveTab("resumo")}
          className={`py-4 px-2 font-medium text-sm transition-colors relative ${activeTab === "resumo"
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
          className={`py-4 px-2 font-medium text-sm transition-colors relative ${activeTab === "eventos"
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
          className={`py-4 px-2 font-medium text-sm transition-colors relative ${activeTab === "elenco"
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
    <div className="py-6 space-y-6">
      {activeTab === "resumo" && (
        <div className="space-y-6">
          {/* Observações do Técnico */}
          {match.coachNotes && (
            <div className="bg-white rounded-lg p-4 space-y-2 border border-gray-200">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Observações do Técnico
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {match.coachNotes}
              </p>
            </div>
          )}

          {/* Estatísticas Rápidas */}
          <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Estatísticas Rápidas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Gols Marcados */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-500 mb-1">
                  {match.ourScore}
                </div>
                <div className="text-sm font-medium text-green-500">
                  Gols Marcados
                </div>
              </div>
              {/* Gols Sofridos */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-red-500 mb-1">
                  {match.opponentScore}
                </div>
                <div className="text-sm font-medium text-red-500">
                  Gols Sofridos
                </div>
              </div>
            </div>
          </div>

          {/* Últimos 5 Jogos */}
          {match.last5Games && match.last5Games.length > 0 && (
            <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Últimos 5 Jogos
                </h2>
              </div>
              <div className="flex items-center justify-center gap-3">
                {match.last5Games.map((result, index) => {
                  const getResultColor = (r: string) => {
                    if (r === "VITÓRIA") return "bg-green-500 text-white"
                    if (r === "DERROTA") return "bg-red-500 text-white"
                    return "bg-gray-400 text-white"
                  }
                  const getResultLetter = (r: string) => {
                    if (r === "VITÓRIA") return "V"
                    if (r === "DERROTA") return "D"
                    return "E"
                  }
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-full ${getResultColor(
                        result
                      )} flex items-center justify-center font-bold text-sm`}
                    >
                      {getResultLetter(result)}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Melhores em Campo */}
          <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Melhores em Campo
            </h2>
            <div className="space-y-3">
              {match.players
                .filter((p) => p.goals > 0 || p.assists > 0)
                .sort((a, b) => {
                  if (b.goals !== a.goals) {
                    return b.goals - a.goals
                  }
                  return b.assists - a.assists
                })
                .slice(0, 3)
                .map((player, index) => {
                  const positionColors = [
                    "bg-yellow-500",
                    "bg-gray-400",
                    "bg-orange-500",
                  ]
                  const participations = player.goals + player.assists
                  return (
                    <div
                      key={player.id}
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
                            {player.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {player.goals} {player.goals === 1 ? "gol" : "gols"} • {player.assists} {player.assists === 1 ? "assistência" : "assistências"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {participations}{" "}
                        {participations === 1 ? "participação" : "participações"}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "eventos" && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Eventos da Partida
          </h2>
          <div className="space-y-4 w-full">
            {match.events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 bg-white p-4 rounded-lg border"
              >
                <div className="flex items-center gap-2 min-w-[60px]">
                  <div
                    className={`w-3 h-3 rounded-full ${event.type === "goal"
                      ? "bg-green-500"
                      : event.type === "yellowCard"
                        ? "bg-yellow-500"
                        : event.type === "redCard"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                  />
                  <span className="font-semibold text-gray-700">
                    {event.minute}'
                  </span>
                </div>
                <div className="flex-1">
                  {event.type === "goal" && (
                    <div>
                      <div className="font-medium text-gray-900">
                        GOL - {event.player}
                      </div>
                      {event.assist && (
                        <div className="text-sm text-gray-600 mt-1">
                          Assistência: {event.assist}
                        </div>
                      )}
                    </div>
                  )}
                  {event.type === "yellowCard" && (
                    <div className="font-medium text-gray-900">
                      Cartão Amarelo - {event.player}
                    </div>
                  )}
                  {event.type === "redCard" && (
                    <div className="font-medium text-gray-900">
                      Cartão Vermelho - {event.player}
                    </div>
                  )}
                  {event.type === "substitution" && (
                    <div>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-900">
                          Substituição
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mt-1">
                        + Sai: {event.subOut}
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        + Entra: {event.subIn}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "elenco" && (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Participação dos Jogadores
          </h2>
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
                      G
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      A
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      CA
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      CV
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Nota
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {match.players.map((player, index) => (
                    <tr key={player.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {player.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {player.fullName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.isStarter ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {player.minutes}'
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {player.goals || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {player.assists || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.yellowCards > 0 ? (
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto" />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {player.redCards || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.rating > 0 ? (
                          <Badge
                            className={`${getRatingColor(player.rating)} border font-medium px-2 py-0.5`}
                          >
                            {player.rating.toFixed(1)}
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
              <p>
                Ti. = Titular • Min. = Minutos • G = Gols • A = Assistências •
                CA = Cartão Amarelo • CV = Cartão Vermelho
              </p>
            </div>
          </div>
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

