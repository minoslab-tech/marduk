"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock, Mail, Pencil, Star, Target, Trophy, Phone } from "lucide-react"

type PlayerDetails = {
  name: string
  fullName: string
  birthDate: string
  age: number
  roles: string[]
  primaryRole: string
  stats: {
    matches: number
    minutes: number
    goalInv: number
    avgRating: number
    goals: number
    assists: number
    goalsPerGame: number
    starts: number
    bench: number
    yellows: number
    reds: number
    dominantFoot: string
  }
}

const player: PlayerDetails = {
  name: "João",
  fullName: "João Silva Santos",
  birthDate: "1995-05-14",
  age: 30,
  roles: ["Atacante", "Meia Ofensivo"],
  primaryRole: "Atacante",
  stats: {
    matches: 28,
    minutes: 2340,
    goalInv: 23,
    avgRating: 7.8,
    goals: 15,
    assists: 8,
    goalsPerGame: 0.54,
    starts: 24,
    bench: 4,
    yellows: 3,
    reds: 0,
    dominantFoot: "Direito",
  },
}

type MatchItem = {
  opponent: string
  date: string
  result: { team: number; opp: number }
  role: "Titular" | "Reserva"
  minutes: number
  goals: number
  assists: number
  yellows: number
  reds: number
  rating: number
}

const history: MatchItem[] = [
  {
    opponent: "Atlético Bairro",
    date: "2024-11-09",
    result: { team: 4, opp: 0 },
    role: "Titular",
    minutes: 75,
    goals: 2,
    assists: 1,
    yellows: 0,
    reds: 0,
    rating: 9.0,
  },
  {
    opponent: "Estrela FC",
    date: "2024-11-02",
    result: { team: 2, opp: 1 },
    role: "Titular",
    minutes: 90,
    goals: 0,
    assists: 2,
    yellows: 0,
    reds: 0,
    rating: 8.0,
  },
  {
    opponent: "FC Unidos",
    date: "2024-10-26",
    result: { team: 1, opp: 1 },
    role: "Reserva",
    minutes: 25,
    goals: 0,
    assists: 0,
    yellows: 0,
    reds: 0,
    rating: 7.0,
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(d)
}

export default function PlayerDetailsPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "history">("stats")

  const win = (m: MatchItem) => m.result.team > m.result.opp
  const draw = (m: MatchItem) => m.result.team === m.result.opp

  const headerGradient = useMemo(
    () =>
      "relative overflow-hidden bg-gradient-to-tr from-slate-800 to-slate-900",
    []
  )

  return (
    <div className="space-y-6">
      <section className={headerGradient}>
        <div className="px-6 pt-6 flex items-center justify-between  relative z-10">
          <Link href="/dashboard/players" className="text-white/80 hover:text-white flex items-center gap-2">
            <ArrowLeft className="size-5" /> Voltar
          </Link>
          <Button className="bg-yellow-400 text-black hover:bg-yellow-500" aria-label="Editar">
            <Pencil className="size-4" /> Editar
          </Button>
        </div>

        <div className="px-6 py-6 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-6">
            <Avatar className="size-16">
              <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-lg">
                {initials(player.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h2 className="text-xl font-semibold">{player.name}</h2>
              <p className="text-sm text-white/80">{player.fullName}</p>
              <p className="text-sm text-white/80">{player.age} anos • {formatDate(player.birthDate)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {player.roles.map((r) => (
                  <Badge key={r} className="bg-emerald-600 text-white border-none">{r}</Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Phone className="size-4" aria-hidden /> WhatsApp
                </Button>
                <Button variant="outline" className="bg-white/10 text-white">
                  <Mail className="size-4" aria-hidden /> E-mail
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Trophy className="size-5 text-emerald-600" />
            <div>
              <p className="text-2xl font-semibold text-emerald-700">{player.stats.matches}</p>
              <p className="text-sm text-emerald-800/70">Jogos Disputados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Clock className="size-5 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-blue-700">{player.stats.minutes}'</p>
              <p className="text-sm text-blue-800/70">Minutos Jogados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-violet-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Target className="size-5 text-violet-600" />
            <div>
              <p className="text-2xl font-semibold text-violet-700">{player.stats.goalInv}</p>
              <p className="text-sm text-violet-800/70">Participação em Gols</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="flex items-center gap-3 py-6">
            <Star className="size-5 text-amber-600" />
            <div>
              <p className="text-2xl font-semibold text-amber-700">{player.stats.avgRating.toFixed(1)}</p>
              <p className="text-sm text-amber-800/70">Média de Nota</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between border-b">
        <button
          className={`px-3 py-2 text-sm ${activeTab === "stats" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("stats")}
        >
          ESTATÍSTICAS
        </button>
        <button
          className={`px-3 py-2 text-sm ${activeTab === "history" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("history")}
        >
          HISTÓRICO DE JOGOS
        </button>
      </div>

      {activeTab === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                Indicadores de Ataque
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-3">
              <span>Gols</span>
              <span className="justify-self-end">{player.stats.goals}</span>
              <span>Assistências</span>
              <span className="justify-self-end">{player.stats.assists}</span>
              <span>Gols por Jogo (Média)</span>
              <span className="justify-self-end">{player.stats.goalsPerGame}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presença e Disciplina</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-3">
              <span>Jogos como Titular</span>
              <span className="justify-self-end">{player.stats.starts}</span>
              <span>Jogos como Reserva</span>
              <span className="justify-self-end">{player.stats.bench}</span>
              <span className="flex items-center gap-2">Cartões Amarelos <span className="inline-block size-3 rounded-full bg-yellow-400" aria-hidden /></span>
              <span className="justify-self-end">{player.stats.yellows}</span>
              <span>Cartões Vermelhos</span>
              <span className="justify-self-end">{player.stats.reds}</span>
              <span>Pé Dominante</span>
              <span className="justify-self-end">{player.stats.dominantFoot}</span>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Desempenho por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                Gráfico de minutos jogados por mês
                <span className="block text-xs mt-2">(Visualização em desenvolvimento)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {history.map((m, i) => (
            <Card
              key={`${m.opponent}-${i}`}
              className={win(m) ? "border-emerald-400" : draw(m) ? "border-blue-300" : "border-red-300"}
            >
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{m.opponent}</CardTitle>
                  <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
                </div>
                <div className="text-emerald-700 font-semibold">
                  {m.result.team} × {m.result.opp}
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                <Badge className="bg-emerald-600 text-white border-none w-fit">
                  {m.role} • {m.minutes}'
                </Badge>
                <div className="text-center">
                  <p className="text-lg font-semibold">{m.goals}</p>
                  <p className="text-xs text-muted-foreground">Gols</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{m.assists}</p>
                  <p className="text-xs text-muted-foreground">Assist.</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{m.yellows || "—"}</p>
                  <p className="text-xs text-muted-foreground">C.A.</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{m.reds || "—"}</p>
                  <p className="text-xs text-muted-foreground">C.V.</p>
                </div>
                <div className="md:col-span-5 flex justify-end">
                  <Badge className={win(m) ? "bg-emerald-100 text-emerald-800 border-emerald-200" : draw(m) ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-red-100 text-red-800 border-red-200"}>
                    {m.rating.toFixed(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

