"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, MoreVertical, Plus, Search, X } from "lucide-react"

type Player = {
  name: string
  position: string
  yellowCards: number
  redCards: number
}

const initialPlayers: Player[] = [
  { name: "João", position: "Atacante", yellowCards: 3, redCards: 0 },
  { name: "Pedrinho", position: "Atacante", yellowCards: 5, redCards: 1 },
  { name: "Carlinhos", position: "Meia", yellowCards: 2, redCards: 0 },
  { name: "Rafa", position: "Zagueiro", yellowCards: 4, redCards: 0 },
  { name: "Lucas", position: "Lateral", yellowCards: 1, redCards: 0 },
  { name: "Marquinhos", position: "Meia", yellowCards: 0, redCards: 0 },
  { name: "André", position: "Goleiro", yellowCards: 2, redCards: 0 },
]

const positions = [
  "Todos",
  "Atacante",
  "Meia",
  "Lateral",
  "Zagueiro",
  "Goleiro",
] as const

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function PlayersPage() {
  const [query, setQuery] = useState("")
  const [positionFilter, setPositionFilter] = useState<typeof positions[number]>("Todos")
  const [playerList, setPlayerList] = useState<Player[]>(initialPlayers)
  const [modalOpen, setModalOpen] = useState(false)

  const players = useMemo(() => {
    return playerList
      .filter((p) =>
        positionFilter === "Todos" ? true : p.position === positionFilter
      )
      .filter((p) =>
        query.trim().length === 0
          ? true
          : p.name.toLowerCase().includes(query.toLowerCase())
      )
  }, [query, positionFilter, playerList])

  function handleCreatePlayer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const nome = String(formData.get("nome_completo") || "").trim()
    const posicao = String(formData.get("posicao_principal") || "").trim()
    if (!nome || !posicao) return
    setPlayerList((prev) => [{ name: nome, position: posicao, yellowCards: 0, redCards: 0 }, ...prev])
    setModalOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6">
      {/* Filtro e busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou apelido..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Buscar jogadores"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filtro
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {positions.map((pos) => (
              <DropdownMenuItem
                key={pos}
                onSelect={() => setPositionFilter(pos)}
                className={positionFilter === pos ? "font-semibold" : undefined}
              >
                {pos}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lista padronizada em Card com linhas divididas */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        <div className="divide-y divide-slate-100">
          {players.map((player) => (
            <div
              key={`${player.name}-${player.position}`}
              className="p-4 flex items-center justify-between relative"
              role="listitem"
            >
              <Link
                href="/dashboard/players/detailsplayers"
                className="absolute inset-0 z-10"
                aria-label="Abrir detalhes do jogador"
              >
                <span className="sr-only">Abrir detalhes do jogador</span>
              </Link>

              <div className="relative z-20 flex items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-emerald-50 text-emerald-700 font-semibold">
                    {getInitials(player.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{player.name}</p>
                  <p className="text-xs text-slate-600">{player.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-20">
                <div className="flex items-center gap-1.5 text-sm text-slate-700">
                  <span className="inline-block size-3 rounded-full bg-yellow-400" aria-hidden />
                  <span className="min-w-4 text-center">{player.yellowCards}</span>
                </div>
                {player.redCards > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-700">
                    <span className="inline-block size-3 rounded-full bg-red-500" aria-hidden />
                    <span className="min-w-4 text-center">{player.redCards}</span>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ações do jogador"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => { }}>Editar</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => { }}>Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ação Flutuante padronizada com Partidas */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-4 shadow-lg flex items-center gap-2 font-medium transition-colors z-50"
      >
        <Plus className="h-5 w-5" />
        <span>Novo Jogador</span>
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (igual ao de Partidas) */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Novo Jogador</h2>
                <p className="text-white/90 text-sm">Cadastre um novo jogador</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white hover:text-white/80 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form className="space-y-6" onSubmit={handleCreatePlayer}>
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome completo</Label>
                  <Input id="nome_completo" name="nome_completo" placeholder="Ex: João Silva" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posicao_principal">Posição principal</Label>
                  <Input id="posicao_principal" name="posicao_principal" placeholder="Ex: Atacante" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pe_dominante">Pé dominante</Label>
                  <Input id="pe_dominante" name="pe_dominante" placeholder="Direito/Esquerdo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de nascimento</Label>
                  <Input id="data_nascimento" name="data_nascimento" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" name="telefone" type="tel" placeholder="(00) 00000-0000" />
                </div>

                {/* Buttons (igual ao de Partidas) */}
                <div className="flex gap-4 pt-4 justify-end">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Salvar</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
