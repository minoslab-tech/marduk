"use client"

import { useState, useEffect } from "react"
import { FirstAccessModal } from "@/components/first-access-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Circle, TrendingDown, Users, Clock, MapPin, Target } from "lucide-react"

interface OverviewData {
  time: {
    id: string
    nome: string
    shieldImg: string | null
  }
  proximaPartida: {
    id: string
    adversario: string
    tipo: string
    dataHora: Date
    local: string
    status: string
  } | null
  resumo: {
    vitorias: { valor: number; porcentagem: string }
    empates: { valor: number; total: string }
    derrotas: { valor: number; mensagem: string }
    jogadores: { valor: number; mensagem: string }
  }
  artilheiros: Array<{
    nome: string
    gols: number
    jogos: number
  }>
  ultimosResultados: Array<{
    id: string
    adversario: string
    dataHora: Date
    golsPro: number | null
    golsContra: number | null
    resultado: 'V' | 'E' | 'D'
  }>
  estatisticas: {
    golsMarcados: number
    golsSofridos: number
    saldoGols: number
  }
}

export default function DashboardPage() {
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false)
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasCompletedFirstAccess = localStorage.getItem("hasCompletedFirstAccess")

    if (!hasCompletedFirstAccess) {
      setShowFirstAccessModal(true)
    }

    // Buscar dados do overview
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      const response = await fetch("/api/dashboard/overview")
      if (response.ok) {
        const data = await response.json()
        setOverviewData(data)
      }
    } catch (error) {
      console.error("Erro ao buscar dados do overview:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFirstAccessComplete = async (data: any) => {
    try {
      localStorage.setItem("hasCompletedFirstAccess", "true")
      setShowFirstAccessModal(false)

      console.log("Dados do primeiro acesso:", data)
      // Recarregar dados após configuração inicial
      fetchOverviewData()
    } catch (error) {
      console.error("Erro ao completar primeiro acesso:", error)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatShortDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  const getResultadoStyle = (resultado: 'V' | 'E' | 'D') => {
    switch (resultado) {
      case 'V':
        return { badgeBg: "bg-[#c6f4dc]", badgeText: "text-[#1ca36b]" }
      case 'E':
        return { badgeBg: "bg-[#f4e8bf]", badgeText: "text-[#caa214]" }
      case 'D':
        return { badgeBg: "bg-[#f6d7d7]", badgeText: "text-[#c94c4c]" }
    }
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return "bg-[#f4c900]" // Ouro
      case 1: return "bg-[#c9d1dc]" // Prata
      case 2: return "bg-[#b55a07]" // Bronze
      default: return "bg-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Erro ao carregar dados</div>
      </div>
    )
  }

  return (
    <div>
      <FirstAccessModal
        open={showFirstAccessModal}
        onComplete={handleFirstAccessComplete}
      />

      <div className="space-y-6">
        {/* Próxima Partida */}
        {overviewData.proximaPartida && (
          <div>
            <h2 className="text-gray-500 text-sm font-medium mb-3">Próxima Partida</h2>
            <Card className="border-0 text-white bg-gradient-to-r from-[#0fa46f] to-[#007c59] rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2 text-white/85">
                      {overviewData.proximaPartida.tipo.charAt(0).toUpperCase() + overviewData.proximaPartida.tipo.slice(1)}
                    </div>
                    <div className="text-lg font-semibold mb-4">
                      {overviewData.time.nome} vs {overviewData.proximaPartida.adversario}
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/90">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-white/80" />
                        <span>{formatTime(overviewData.proximaPartida.dataHora)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white/80" />
                        <span>{overviewData.proximaPartida.local}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#f3c615] text-[#0a0a0a] px-4 py-1 rounded-full text-sm font-semibold">
                    {formatDate(overviewData.proximaPartida.dataHora)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resumo da Temporada */}
        <div>
          <h2 className="text-gray-700 text-lg font-semibold mb-4">Resumo da Temporada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vitórias */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="p-2 bg-green-100 rounded-lg w-fit">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Vitórias</div>
                      <div className="text-xs text-gray-500">
                        {overviewData.resumo.vitorias.porcentagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {overviewData.resumo.vitorias.valor}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empates */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="p-2 bg-yellow-100 rounded-lg w-fit">
                      <Circle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Empates</div>
                      <div className="text-xs text-gray-500">
                        {overviewData.resumo.empates.total}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {overviewData.resumo.empates.valor}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Derrotas */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="p-2 bg-red-100 rounded-lg w-fit">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Derrotas</div>
                      <div className="text-xs text-gray-500">
                        {overviewData.resumo.derrotas.mensagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    {overviewData.resumo.derrotas.valor}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jogadores */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg w-fit">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Jogadores</div>
                      <div className="text-xs text-gray-500">
                        {overviewData.resumo.jogadores.mensagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-700">
                    {overviewData.resumo.jogadores.valor}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artilheiros */}
        {overviewData.artilheiros.length > 0 && (
          <div>
            <h2 className="text-slate-600 text-sm font-semibold mb-3">Artilheiros</h2>
            <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-slate-100">
                  {overviewData.artilheiros.map((artilheiro, index) => (
                    <div key={index} className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`${getMedalColor(index)} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}>
                          {index + 1}°
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{artilheiro.nome}</div>
                          <div className="text-xs text-gray-500">{artilheiro.jogos} jogos</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                        <div className="w-9 h-9 rounded-full border border-emerald-100 bg-emerald-50 flex items-center justify-center">
                          <Target className="h-4 w-4" />
                        </div>
                        <span>{artilheiro.gols}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Últimos Resultados */}
        {overviewData.ultimosResultados.length > 0 && (
          <div>
            <h2 className="text-slate-600 text-sm font-semibold mb-3">Últimos Resultados</h2>
            <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-slate-100">
                  {overviewData.ultimosResultados.map((resultado) => {
                    const styles = getResultadoStyle(resultado.resultado)
                    return (
                      <div key={resultado.id} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`${styles.badgeBg} ${styles.badgeText} rounded-lg w-10 h-10 flex items-center justify-center font-semibold text-sm`}>
                            {resultado.resultado}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{resultado.adversario}</div>
                            <div className="text-xs text-slate-500">{formatShortDate(resultado.dataHora)}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-slate-800">
                          {resultado.golsPro}-{resultado.golsContra}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Estatísticas Rápidas */}
        <div>
          <h2 className="text-slate-700 text-sm font-semibold mb-3">Estatísticas Rápidas</h2>
          <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-1">
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-semibold text-emerald-600 mb-1">{overviewData.estatisticas.golsMarcados}</div>
                    <div className="text-sm text-slate-600">Gols Marcados</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-semibold text-red-600 mb-1">{overviewData.estatisticas.golsSofridos}</div>
                    <div className="text-sm text-slate-600">Gols Sofridos</div>
                  </div>
                </div>

                <div className="my-5 h-px bg-slate-200" />

                <div className="text-center">
                  <div className="text-3xl font-semibold text-slate-800 mb-1">
                    {overviewData.estatisticas.saldoGols >= 0 ? '+' : ''}{overviewData.estatisticas.saldoGols}
                  </div>
                  <div className="text-sm text-slate-600">Saldo de Gols</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
