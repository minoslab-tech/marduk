import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

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
  createdAt: string
  updatedAt: string
  time?: {
    id: string
    nome: string
  }
}

export interface JogadorDetalhado extends Jogador {
  partidasParticipacao?: any[]
  eventosPartida?: any[]
  escalacoesJogadores?: any[]
}

export interface EstatisticasJogador {
  jogador: Jogador
  resumo: {
    totalPartidas: number
    partidasComoTitular: number
    partidasComoReserva: number
    minutosJogados: number
    mediaMinutos: number
    notaMedia: number | null
    gols: number
    assistencias: number
    cartoesAmarelos: number
    cartoesVermelhos: number
    mediaGolsPorPartida: string
  }
  porTipo: {
    campeonato: {
      partidas: number
      gols: number
      assistencias: number
    }
    amistoso: {
      partidas: number
      gols: number
      assistencias: number
    }
    treino: {
      partidas: number
      gols: number
      assistencias: number
    }
  }
  ultimasPartidas: any[]
}

export function useJogadores(filters?: {
  timeId?: string
  ativo?: boolean
  posicao?: string
}) {
  const [jogadores, setJogadores] = useState<Jogador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJogadores = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters?.timeId) {
        params.append("timeId", filters.timeId)
      }
      if (filters?.ativo !== undefined) {
        params.append("ativo", String(filters.ativo))
      }
      if (filters?.posicao) {
        params.append("posicao", filters.posicao)
      }

      const response = await api.get(`/jogadores?${params.toString()}`)
      setJogadores(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar jogadores")
      toast.error("Erro ao carregar jogadores")
    } finally {
      setLoading(false)
    }
  }, [filters?.timeId, filters?.ativo, filters?.posicao])

  useEffect(() => {
    fetchJogadores()
  }, [fetchJogadores])

  return { jogadores, loading, error, refetch: fetchJogadores }
}

export function useJogador(id: string | null) {
  const [jogador, setJogador] = useState<JogadorDetalhado | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJogador = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/jogadores/${id}`)
      setJogador(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar jogador")
      toast.error("Erro ao carregar jogador")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchJogador()
  }, [fetchJogador])

  return { jogador, loading, error, refetch: fetchJogador }
}

export function useEstatisticasJogador(id: string | null) {
  const [estatisticas, setEstatisticas] = useState<EstatisticasJogador | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEstatisticas = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/jogadores/${id}/estatisticas`)
      setEstatisticas(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar estatísticas")
      toast.error("Erro ao carregar estatísticas")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEstatisticas()
  }, [fetchEstatisticas])

  return { estatisticas, loading, error, refetch: fetchEstatisticas }
}

export async function criarJogador(data: {
  timeId: string
  nomeCompleto: string
  posicaoPrincipal: string
  peDominante: string
  dataNascimento?: string
  telefone?: string
  fotoUrl?: string
  ativo?: boolean
}) {
  try {
    const response = await api.post("/jogadores", data)
    toast.success("Jogador criado com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao criar jogador")
    throw err
  }
}

export async function atualizarJogador(
  id: string,
  data: Partial<{
    nomeCompleto: string
    posicaoPrincipal: string
    peDominante: string
    dataNascimento: string | null
    telefone: string | null
    fotoUrl: string | null
    ativo: boolean
  }>
) {
  try {
    const response = await api.put(`/jogadores/${id}`, data)
    toast.success("Jogador atualizado com sucesso!")
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao atualizar jogador")
    throw err
  }
}

export async function excluirJogador(id: string) {
  try {
    await api.delete(`/jogadores/${id}`)
    toast.success("Jogador excluído com sucesso!")
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao excluir jogador")
    throw err
  }
}

export async function alternarStatusJogador(id: string, ativo: boolean) {
  try {
    const response = await api.put(`/jogadores/${id}`, { ativo })
    toast.success(
      ativo ? "Jogador ativado com sucesso!" : "Jogador desativado com sucesso!"
    )
    return response.data
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Erro ao alterar status do jogador")
    throw err
  }
}
