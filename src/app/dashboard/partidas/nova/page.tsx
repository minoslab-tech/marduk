"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function NovaPartidaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    data_hora: "",
    local: "",
    adversario_nome: "",
    tipo: "",
    status: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica para salvar a partida
    console.log("Dados do formulário:", formData)
    // Redirecionar para a página de partidas após salvar
    router.push("/dashboard/partidas")
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
    <div className="bg-gray-50 -m-6 lg:-m-8 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/partidas">
            <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">Nova Partida</h1>
        <p className="text-white/90">Cadastre uma nova partida</p>
      </div>

      {/* Form */}
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Partida</CardTitle>
          </CardHeader>
          <CardContent>
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
                  onClick={() => router.push("/dashboard/partidas")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  Salvar Partida
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

