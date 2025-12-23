"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, UploadCloud, X } from "lucide-react"

type TeamForm = {
  nome: string
  cidade: string
  uf: string
  fundacao: string
}

const UFs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export default function MeuTimePage() {
  const [form, setForm] = useState<TeamForm>({ nome: "", cidade: "", uf: "", fundacao: "" })
  const [logoUrl, setLogoUrl] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  function handleChange<K extends keyof TeamForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setLogoUrl(url)
  }

  function handleRemoveLogo() {
    setLogoUrl("")
    if (fileRef.current) {
      fileRef.current.value = ""
    }
    setShowRemoveDialog(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
    }, 800)
  }

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Meu Time</CardTitle>
            <CardDescription data-slot="card-action">Edite as informações do seu time</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 mb-6">
            {logoUrl ? (
              <div className="relative group">
                <div
                  className="flex size-32 items-center justify-center rounded-full border bg-muted cursor-pointer hover:ring-2 hover:ring-ring/50 transition"
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileRef.current?.click()
                  }}
                >
                  <img src={logoUrl} alt="Brasão do time" className="size-full object-cover rounded-full" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowRemoveDialog(true)
                  }}
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white"
                  aria-label="Remover brasão"
                >
                  <X className="size-5" />
                  <span className="text-xs font-medium">Remover brasão</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">Faça upload do brasão do time</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="gap-2"
                >
                  <UploadCloud className="size-4" />
                  Selecionar arquivo
                </Button>
              </div>
            )}
            <Input ref={fileRef} id="brasao" type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
          </div>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Ex: Atlético do Bairro" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} placeholder="Ex: Fortaleza" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="uf">Estado (UF)</Label>
              <select
                id="uf"
                value={form.uf}
                onChange={(e) => handleChange("uf", e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                required
              >
                <option value="" disabled>Selecione</option>
                {UFs.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundacao">Data de Fundação</Label>
              <Input id="fundacao" type="date" value={form.fundacao} onChange={(e) => handleChange("fundacao", e.target.value)} required />
            </div>



            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline">Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover brasão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o brasão do time? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleRemoveLogo}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
