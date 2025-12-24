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
import { usePartidas, excluirPartida, type Partida } from "@/hooks/usePartidas"
import { useTimes } from "@/hooks/useTimes"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import ConvocarElencoModal from "@/components/convocar-elenco-modal"

const getTypeColor = (type: string) => {
  switch (type) {
    case "campeonato":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "amistoso":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "treino":
      return "bg-orange-100 text-orange-700 border-orange-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function PartidasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"proximos" | "finalizados">("proximos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [partidaSelecionada, setPartidaSelecionada] = useState<Partida | null>(null)

  // Buscar partidas agendadas ou finalizadas
  const statusFiltro = activeTab === "proximos" ? "agendada,em_andamento" : "finalizada"
  const { partidas, loading, refetch } = usePartidas()
  const { times } = useTimes()

  // Filtrar partidas localmente
  const partidasFiltradas = partidas
  .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
  .filter((p) => {
    if (activeTab === "proximos") {
      return p.status === "agendada" || p.status === "em_andamento"
    }
    return p.status === "finalizada"
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "finalizados") {
      setActiveTab("finalizados")
    }
  }, [searchParams])

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      try {
        await excluirPartida(id)
        refetch()
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando partidas...</p>
          </div>
        ) : partidasFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Nenhuma partida {activeTab === "proximos" ? "agendada" : "finalizada"}
            </p>
          </div>
        ) : (
          partidasFiltradas.map((partida) => (
            <Card key={partida.id} className="bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {partida.adversarioNome}
                      </h3>
                      <Badge
                        className={`${getTypeColor(partida.tipo)} border font-medium text-xs px-2 py-0.5`}
                      >
                        {partida.tipo === "campeonato"
                          ? "Campeonato"
                          : partida.tipo === "amistoso"
                          ? "Amistoso"
                          : "Treino"}
                      </Badge>
                    </div>
                    {activeTab === "finalizados" && (
                      <div className="flex items-center justify-center mb-4">
                        <span
                          className={`text-3xl font-bold ${
                            (partida.golsPro ?? 0) > (partida.golsContra ?? 0)
                              ? "text-green-500"
                              : "text-gray-700"
                          }`}
                        >
                          {partida.golsPro ?? 0}
                        </span>
                        <span className="text-3xl font-bold text-gray-400 mx-2">×</span>
                        <span
                          className={`text-3xl font-bold ${
                            (partida.golsContra ?? 0) > (partida.golsPro ?? 0)
                              ? "text-red-500"
                              : "text-gray-700"
                          }`}
                        >
                          {partida.golsContra ?? 0}
                        </span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(partida.dataHora)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(partida.dataHora)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{partida.local}</span>
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
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/partidas/${partida.id}/editar`)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(partida.id)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {activeTab === "proximos" ? (
                  <Button 
                    className="w-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50"
                    onClick={() => {
                      setPartidaSelecionada(partida)
                      setIsModalOpen(true)
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Convocar Elenco
                  </Button>
                ) : (
                  <Link href={`/dashboard/partidas/${partida.id}`} className="block">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Estatísticas
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/dashboard/partidas/nova">
        <button className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-4 shadow-lg flex items-center gap-2 font-medium transition-colors z-50">
          <Plus className="h-5 w-5" />
          <span>Nova Partida</span>
        </button>
      </Link>

      {/* Modal de Convocação */}
      {partidaSelecionada && (
        <ConvocarElencoModal
          partida={partidaSelecionada}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setPartidaSelecionada(null)
          }}
        />
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

