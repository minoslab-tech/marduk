import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export interface Partida {
  id: string
  timeId: string
  dataHora: string
  local: string
  adversarioNome: string
  tipo: string
  status: string
  golsPro: number | null
  golsContra: number | null
  observacoesTecnico: string | null
  createdAt: string
  updatedAt: string
  partidasParticipacao?: PartidaParticipacao[]
  eventosPartida?: EventoPartida[]
  time?: {
    id: string
    nome: string
  }
}

export interface Jogador {
  id: string
  timeId: string
  nomeCompleto: string
  posicaoPrincipal: string
  peDominante: string
  dataNascimento: string | null
  telefone: string | null
  fotoUrl: string | null
  ativo: boolean
}

export interface PartidaParticipacao {
  id: string
  partidaId: string
  jogadorId: string
  titular: boolean
  minutosJogados: number | null
  notaTecnica: number | null
  observacoes: string | null
  jogador: Jogador
}

export interface EventoPartida {
  id: string
  partidaId: string
  jogadorId: string
  tipoEvento: string
  minuto: number
  relacionadoJogadorId: string | null
  observacao: string | null
  jogador: Jogador
  jogadorRelacionado?: Jogador | null
}

export function usePartidas(status?: string) {
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartidas = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (status) {
        params.append("status", status)
      }
      const response = await api.get(`/partidas?${params.toString()}`)
      setPartidas(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar partidas")
      toast.error("Erro ao carregar partidas")
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchPartidas()
  }, [fetchPartidas])

  return { partidas, loading, error, refetch: fetchPartidas }
}

export function usePartida(id: string | null) {
  const [partida, setPartida] = useState<Partida | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPartida = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/partidas/${id}`)
      setPartida(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar partida")
      toast.error("Erro ao carregar partida")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPartida()
  }, [fetchPartida])

  return { partida, loading, error, refetch: fetchPartida }
}

export async function criarPartida(data: {
  timeId: string
  dataHora: string
  local: string
  adversarioNome: string
  tipo: string
  status?: string
}) {
  try {
    const response = await api.post("/partidas", data)
    toast.success("Partida criada com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao criar partida")
    throw err
  }
}

export async function atualizarPartida(
  id: string,
  data: Partial<{
    dataHora: string
    local: string
    adversarioNome: string
    tipo: string
    status: string
    golsPro: number
    golsContra: number
    observacoesTecnico: string
  }>
) {
  try {
    const response = await api.put(`/partidas/${id}`, data)
    toast.success("Partida atualizada com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao atualizar partida")
    throw err
  }
}

export async function excluirPartida(id: string) {
  try {
    await api.delete(`/partidas/${id}`)
    toast.success("Partida excluída com sucesso!")
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao excluir partida")
    throw err
  }
}

export async function atualizarParticipacao(
  partidaId: string,
  participacoes: Array<{
    jogadorId: string
    titular: boolean
    minutosJogados: number
    notaTecnica?: number
    observacoes?: string
  }>
) {
  try {
    const response = await api.put(`/partidas/${partidaId}/participacao`, {
      participacoes,
    })
    toast.success("Participação atualizada com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao atualizar participação")
    throw err
  }
}

export async function adicionarEvento(
  partidaId: string,
  evento: {
    jogadorId: string
    tipoEvento: string
    minuto: number
    relacionadoJogadorId?: string
    observacao?: string
  }
) {
  try {
    const response = await api.post(`/partidas/${partidaId}/eventos`, evento)
    toast.success("Evento adicionado com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao adicionar evento")
    throw err
  }
}

export async function excluirEvento(partidaId: string, eventoId: string) {
  try {
    await api.delete(`/partidas/${partidaId}/eventos?eventoId=${eventoId}`)
    toast.success("Evento excluído com sucesso!")
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao excluir evento")
    throw err
  }
}
