"use client"

import { useState, useEffect } from "react"
import { FirstAccessModal } from "@/components/first-access-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Circle, TrendingDown, Users, Clock, MapPin, Target } from "lucide-react"

export default function DashboardPage() {
  const [showFirstAccessModal, setShowFirstAccessModal] = useState(false)

  useEffect(() => {
    const hasCompletedFirstAccess = localStorage.getItem("hasCompletedFirstAccess")

    if (!hasCompletedFirstAccess) {
      setShowFirstAccessModal(true)
    }
  }, [])

  const handleFirstAccessComplete = async (data: any) => {
    try {
      localStorage.setItem("hasCompletedFirstAccess", "true")
      setShowFirstAccessModal(false)

      console.log("Dados do primeiro acesso:", data)
    } catch (error) {
      console.error("Erro ao completar primeiro acesso:", error)
    }
  }

  // Dados mockados baseados na imagem
  const proximaPartida = {
    campeonato: "Campeonato",
    adversario: "Garra FC vs FC Unidos",
    data: "07 de dez. de 2024",
    horario: "15:00",
    local: "Campo do Parque Central"
  }

  const resumo = {
    vitorias: { valor: 8, porcentagem: "53% de aproveitamento" },
    empates: { valor: 4, total: "15 jogos totais" },
    derrotas: { valor: 3, mensagem: "Continue melhorando!" },
    jogadores: { valor: 12, mensagem: "Elenco completo" }
  }

  const artilheiros = [
    { posicao: "1°", nome: "João", jogos: "12 jogos", gols: 8, cor: "bg-[#f4c900]" },
    { posicao: "2°", nome: "Pedrinho", jogos: "14 jogos", gols: 6, cor: "bg-[#c9d1dc]" },
    { posicao: "3°", nome: "Felipe", jogos: "11 jogos", gols: 5, cor: "bg-[#b55a07]" }
  ]

  const ultimosResultados = [
    { resultado: "V", adversario: "Tigres FC", data: "01/12", placar: "3-1", badgeBg: "bg-[#c6f4dc]", badgeText: "text-[#1ca36b]" },
    { resultado: "E", adversario: "Leões do Norte", data: "24/11", placar: "2-2", badgeBg: "bg-[#f4e8bf]", badgeText: "text-[#caa214]" },
    { resultado: "D", adversario: "FC Vitória", data: "17/11", placar: "1-3", badgeBg: "bg-[#f6d7d7]", badgeText: "text-[#c94c4c]" },
    { resultado: "V", adversario: "Estrela FC", data: "10/11", placar: "2-0", badgeBg: "bg-[#c6f4dc]", badgeText: "text-[#1ca36b]" },
    { resultado: "V", adversario: "Atlético Bairro", data: "03/11", placar: "4-1", badgeBg: "bg-[#c6f4dc]", badgeText: "text-[#1ca36b]" }
  ]

  const estatisticas = {
    golsMarcados: 32,
    golsSofridos: 18,
    saldoGols: 14
  }

  return (
    <div>
      <FirstAccessModal
        open={showFirstAccessModal}
        onComplete={handleFirstAccessComplete}
      />

      <div className="space-y-6">
        {/* Próxima Partida */}
        <div>
          <h2 className="text-gray-500 text-sm font-medium mb-3">Próxima Partida</h2>
          <Card className="border-0 text-white bg-gradient-to-r from-[#0fa46f] to-[#007c59] rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2 text-white/85">
                    {proximaPartida.campeonato}
                  </div>
                  <div className="text-lg font-semibold mb-4">
                    {proximaPartida.adversario}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/80" />
                      <span>{proximaPartida.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-white/80" />
                      <span>{proximaPartida.local}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f3c615] text-[#0a0a0a] px-4 py-1 rounded-full text-sm font-semibold">
                  {proximaPartida.data}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                        {resumo.vitorias.porcentagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {resumo.vitorias.valor}
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
                        {resumo.empates.total}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">
                    {resumo.empates.valor}
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
                        {resumo.derrotas.mensagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    {resumo.derrotas.valor}
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
                        {resumo.jogadores.mensagem}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-700">
                    {resumo.jogadores.valor}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artilheiros */}
        <div>
          <h2 className="text-slate-600 text-sm font-semibold mb-3">Artilheiros</h2>
          <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-slate-100">
                {artilheiros.map((artilheiro) => (
                  <div key={artilheiro.posicao} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`${artilheiro.cor} text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}>
                        {artilheiro.posicao}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{artilheiro.nome}</div>
                        <div className="text-xs text-gray-500">{artilheiro.jogos}</div>
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

        {/* Últimos Resultados */}
        <div>
          <h2 className="text-slate-600 text-sm font-semibold mb-3">Últimos Resultados</h2>
          <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardContent className="p-0">
              <div className="flex flex-col divide-y divide-slate-100">
                {ultimosResultados.map((resultado, index) => (
                  <div key={index} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`${resultado.badgeBg} ${resultado.badgeText} rounded-lg w-10 h-10 flex items-center justify-center font-semibold text-sm`}>
                        {resultado.resultado}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{resultado.adversario}</div>
                        <div className="text-xs text-slate-500">{resultado.data}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {resultado.placar}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Rápidas */}
        <div>
          <h2 className="text-slate-700 text-sm font-semibold mb-3">Estatísticas Rápidas</h2>
          <Card className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-1">
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-semibold text-emerald-600 mb-1">{estatisticas.golsMarcados}</div>
                    <div className="text-sm text-slate-600">Gols Marcados</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-semibold text-red-600 mb-1">{estatisticas.golsSofridos}</div>
                    <div className="text-sm text-slate-600">Gols Sofridos</div>
                  </div>
                </div>

                <div className="my-5 h-px bg-slate-200" />

                <div className="text-center">
                  <div className="text-3xl font-semibold text-slate-800 mb-1">+{estatisticas.saldoGols}</div>
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
