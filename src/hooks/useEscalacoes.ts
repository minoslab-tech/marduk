import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api"
import { toast } from "react-hot-toast"

export interface Escalacao {
  id: string
  timeId: string
  nome: string
  esquemaTatico: string
  descricao: string | null
  ativa: boolean
  createdAt: string
  updatedAt: string
  time?: {
    id: string
    nome: string
  }
  escalacoesJogadores?: EscalacaoJogador[]
}

export interface EscalacaoJogador {
  id: string
  escalacaoId: string
  jogadorId: string
  titular: boolean
  posicaoEmCampo: string
  numeroCamisa: number | null
  ordem: number | null
  jogador: {
    id: string
    nomeCompleto: string
    posicaoPrincipal: string
    telefone: string | null
    ativo: boolean
  }
}

export function useEscalacoes(filters?: { timeId?: string; ativa?: boolean }) {
  const [escalacoes, setEscalacoes] = useState<Escalacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEscalacoes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters?.timeId) {
        params.append("timeId", filters.timeId)
      }
      if (filters?.ativa !== undefined) {
        params.append("ativa", String(filters.ativa))
      }

      const response = await api.get(`/escalacoes?${params.toString()}`)
      setEscalacoes(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar escalações")
      toast.error("Erro ao carregar escalações")
    } finally {
      setLoading(false)
    }
  }, [filters?.timeId, filters?.ativa])

  useEffect(() => {
    fetchEscalacoes()
  }, [fetchEscalacoes])

  return { escalacoes, loading, error, refetch: fetchEscalacoes }
}

export function useEscalacao(id: string | null) {
  const [escalacao, setEscalacao] = useState<Escalacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEscalacao = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await api.get(`/escalacoes/${id}`)
      setEscalacao(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao carregar escalação")
      toast.error("Erro ao carregar escalação")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEscalacao()
  }, [fetchEscalacao])

  return { escalacao, loading, error, refetch: fetchEscalacao }
}
