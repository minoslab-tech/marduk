import { useState, useEffect } from "react"
import api from "@/lib/api"

export interface Time {
  id: string
  nome: string
  shieldImg: string | null
  city: string | null
  stateCode: string | null
  startDate: string | null
}

export function useTimes() {
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTimes() {
      try {
        const response = await api.get("/times")
        setTimes(response.data)
      } catch (err) {
        console.error("Erro ao carregar times:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTimes()
  }, [])

  return { times, loading }
}
