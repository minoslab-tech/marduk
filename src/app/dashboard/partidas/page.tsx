"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Calendar, Users, MoreVertical, MapPin, Clock, BarChart3, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Match {
  id: string
  opponent: string
  type: "Campeonato" | "Amistoso" | "Treino"
  date: string
  time: string
  location: string
}

interface FinishedMatch {
  id: string
  opponent: string
  type: "Campeonato" | "Amistoso"
  date: string
  time: string
  location: string
  ourScore: number
  opponentScore: number
}

const upcomingMatches: Match[] = [
  {
    id: "1",
    opponent: "FC Unidos",
    type: "Campeonato",
    date: "08 de dez. de 2024",
    time: "15:00",
    location: "Campo do Parque Central",
  },
  {
    id: "2",
    opponent: "Estrela FC",
    type: "Amistoso",
    date: "12 de dez. de 2024",
    time: "18:30",
    location: "Estádio Municipal",
  },
  {
    id: "3",
    opponent: "Atlético Bairro",
    type: "Treino",
    date: "15 de dez. de 2024",
    time: "16:00",
    location: "Campo do Clube",
  },
]

const finishedMatches: FinishedMatch[] = [
  {
    id: "1",
    opponent: "Tigres FC",
    type: "Campeonato",
    date: "01 de dez. de 2024",
    time: "14:00",
    location: "Campo do Parque Central",
    ourScore: 3,
    opponentScore: 1,
  },
  {
    id: "2",
    opponent: "Leões do Norte",
    type: "Campeonato",
    date: "24 de nov. de 2024",
    time: "15:30",
    location: "Estádio Regional",
    ourScore: 2,
    opponentScore: 2,
  },
  {
    id: "3",
    opponent: "FC Vitória",
    type: "Amistoso",
    date: "17 de nov. de 2024",
    time: "16:00",
    location: "Campo do Clube",
    ourScore: 1,
    opponentScore: 3,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "Campeonato":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "Amistoso":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Treino":
      return "bg-orange-100 text-orange-700 border-orange-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
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

function PartidasContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"proximos" | "finalizados">("proximos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    data_hora: "",
    local: "",
    adversario_nome: "",
    tipo: "",
    status: "",
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "finalizados") {
      setActiveTab("finalizados")
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica para salvar a partida
    console.log("Dados do formulário:", formData)
    // Fechar o modal e limpar o formulário
    setIsModalOpen(false)
    setFormData({
      data_hora: "",
      local: "",
      adversario_nome: "",
      tipo: "",
      status: "",
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Tabs padronizadas */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab("proximos")}
            className={`flex-1 py-3 text-center text-sm font-medium relative transition-colors ${activeTab === "proximos" ? "text-emerald-600" : "text-slate-600 hover:text-slate-800"
              }`}
          >
            PRÓXIMOS JOGOS
            {activeTab === "proximos" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("finalizados")}
            className={`flex-1 py-3 text-center text-sm font-medium relative transition-colors ${activeTab === "finalizados" ? "text-emerald-600" : "text-slate-600 hover:text-slate-800"
              }`}
          >
            JOGOS FINALIZADOS
            {activeTab === "finalizados" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "proximos" &&
          upcomingMatches.map((match) => (
            <Card key={match.id} className="bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {match.opponent}
                      </h3>
                      <Badge
                        className={`${getTypeColor(match.type)} border font-medium text-xs px-2 py-0.5`}
                      >
                        {match.type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{match.location}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Cancelar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button className="w-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50">
                  <Users className="h-4 w-4 mr-2" />
                  Convocar Elenco
                </Button>
              </div>
            </Card>
          ))}

        {activeTab === "finalizados" &&
          finishedMatches.map((match) => {
            const scoreColors = getScoreColor(match.ourScore, match.opponentScore)
            return (
              <Card key={match.id} className="bg-white shadow-sm">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {match.opponent}
                        </h3>
                        <Badge
                          className={`${getTypeColor(match.type)} border font-medium text-xs px-2 py-0.5`}
                        >
                          {match.type}
                        </Badge>
                      </div>
                      {/* Score */}
                      <div className="flex items-center justify-center mb-4">
                        <span
                          className={`text-3xl font-bold ${scoreColors.ourColor}`}
                        >
                          {match.ourScore}
                        </span>
                        <span className="text-3xl font-bold text-gray-400 mx-2">
                          ×
                        </span>
                        <span
                          className={`text-3xl font-bold ${scoreColors.opponentColor}`}
                        >
                          {match.opponentScore}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{match.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{match.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Cancelar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Link href={`/dashboard/partidas/${match.id}`} className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Estatísticas
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-4 shadow-lg flex items-center gap-2 font-medium transition-colors z-50"
      >
        <Plus className="h-5 w-5" />
        <span>Nova Partida</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Nova Partida</h2>
                <p className="text-white/90 text-sm">Cadastre uma nova partida</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data e Hora */}
                <div className="space-y-2">
                  <Label htmlFor="data_hora">Data e Hora</Label>
                  <Input
                    id="data_hora"
                    name="data_hora"
                    type="datetime-local"
                    value={formData.data_hora}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Local */}
                <div className="space-y-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    name="local"
                    type="text"
                    placeholder="Ex: Campo do Parque Central"
                    value={formData.local}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Adversário */}
                <div className="space-y-2">
                  <Label htmlFor="adversario_nome">Adversário</Label>
                  <Input
                    id="adversario_nome"
                    name="adversario_nome"
                    type="text"
                    placeholder="Ex: Tigres FC"
                    value={formData.adversario_nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="amistoso">Amistoso</option>
                    <option value="campeonato">Campeonato</option>
                    <option value="treino">Treino</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Selecione o status</option>
                    <option value="agendada">Agendada</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    Salvar Partida
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PartidasPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PartidasContent />
    </Suspense>
  )
}

