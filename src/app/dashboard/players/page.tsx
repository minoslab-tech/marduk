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
import { Filter, MoreVertical, Plus, Search } from "lucide-react"

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

    <div className="space-y-6 ">
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
      <div className="space-y-3">

        {players.map((player) => (
          <div
            key={`${player.name}-${player.position}`}
            className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow relative"
            role="listitem"
          >
            <Link href="/dashboard/players/detailsplayers" className="absolute inset-0 z-10 rounded-xl" aria-label="Abrir detalhes do jogador">
              <span className="sr-only">Abrir detalhes do jogador</span>
            </Link>
            <div className="relative flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                  {getInitials(player.name)}
                </AvatarFallback>
              </Avatar>
              <div className="relative">
                <p className="text-sm font-medium  text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-600">{player.position}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-20">
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <span className="inline-block size-3 rounded-full bg-yellow-400" aria-hidden />
                <span className="min-w-4 text-center">{player.yellowCards}</span>
              </div>
              {player.redCards > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <span className="inline-block size-3 rounded-full bg-red-500" aria-hidden />
                  <span className="min-w-4 text-center">{player.redCards}</span>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Ações do jogador" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => {}}>Editar</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onSelect={() => {}}>Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="fixed bottom-6 right-6 bg-yellow-400 text-black hover:bg-yellow-500 shadow-md px-5 py-6 rounded-full"
        onClick={() => setModalOpen(true)}
      >
        <Plus className="size-5" />
        Novo Jogador
      </Button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border shadow-lg w-full max-w-md p-6">
            <p className="text-lg font-semibold">Novo Jogador</p>
            <form className="mt-4 space-y-4" onSubmit={handleCreatePlayer}>
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

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Salvar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
