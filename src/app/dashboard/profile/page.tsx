"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, X, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "ALEXANDRE TALLES FERREIRA",
    email: "painel@universalpagamentos.com.br",
    time: "MeuTime FC",
    planoAtual: "Premium",
  })
  const [initialData] = useState(formData)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const initials = formData.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do perfil:", formData)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  const handleDiscard = () => {
    setShowDiscardConfirm(true)
  }

  const confirmDiscard = () => {
    setFormData(initialData)
    setShowDiscardConfirm(false)
    router.back()
  }

  const cancelDiscard = () => {
    setShowDiscardConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* Card do Header do Usuário */}
      <Card className="bg-white shadow-sm rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-gray-300">
              <AvatarFallback className="bg-gray-400 text-lg font-semibold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{formData.nome}</h2>
              <p className="text-sm text-gray-500 mt-0.5">SUPER_USER</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card do Formulário */}
      <Card className="bg-white shadow-sm rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-gray-900">
            Informações do usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Editar email"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="text"
                  value={formData.time}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* Plano Atual */}
              <div className="space-y-2">
                <Label htmlFor="planoAtual" className="text-sm font-medium text-gray-700">
                  Plano Atual
                </Label>
                <select
                  id="planoAtual"
                  name="planoAtual"
                  value={formData.planoAtual}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="Básico">Básico</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            {/* Botões Salvar e Descartar */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                className="px-6 py-2.5 rounded-md font-medium flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Descartar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium flex items-center gap-2 shadow-sm"
              >
                <Lock className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pop-up de Sucesso */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Salvo com sucesso</h3>
                <p className="text-sm text-gray-600 mt-1">Suas alterações foram salvas.</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Descarte */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descartar alterações?
              </h3>
              <p className="text-sm text-gray-600">
                Tem certeza que deseja descartar as alterações? Todas as mudanças não salvas serão perdidas.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={cancelDiscard}
                className="px-4 py-2"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={confirmDiscard}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
              >
                Descartar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

