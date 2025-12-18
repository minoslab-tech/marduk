"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Paperclip, X } from "lucide-react"

interface FirstAccessModalProps {
    open: boolean
    onComplete: (data: FirstAccessData) => void
}

interface FirstAccessData {
    nome: string
    brasao?: File | null
    cidade: string
    estado: string
    dataFundacao: string
}

const estadosBrasileiros = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]

export function FirstAccessModal({ open, onComplete }: FirstAccessModalProps) {
    const [formData, setFormData] = useState<FirstAccessData>({
        nome: "",
        brasao: null,
        cidade: "",
        estado: "",
        dataFundacao: ""
    })
    const [brasaoPreview, setBrasaoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleBrasaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, brasao: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setBrasaoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveBrasao = () => {
        setFormData({ ...formData, brasao: null })
        setBrasaoPreview(null)
        const fileInput = document.getElementById('brasao') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    const handleSkip = () => {
        onComplete(formData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            //Adicionar a lógica para enviar os dados para o backend
            await onComplete(formData)
        } catch (error) {
            console.error("Erro ao salvar dados:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = formData.nome && formData.cidade && formData.estado && formData.dataFundacao

    return (
        <Dialog open={false} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Bem Vindo! Cadastre seu Time</DialogTitle>
                    <DialogDescription>
                        Preencha com as informações do seu time para começar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nome">Nome do Time *</Label>
                            <Input
                                id="nome"
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Ex: Flamengo, Corinthians, Palmeiras"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="brasao">Brasão do Time</Label>
                            <div>
                                <label htmlFor="brasao" className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                    Escolher Arquivo
                                </label>
                                <Input
                                    id="brasao"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBrasaoChange}
                                    className="hidden"
                                />
                            </div>
                            {brasaoPreview && (
                                <div className="mt-2 flex justify-center">
                                    <div className="relative group">
                                        <img
                                            src={brasaoPreview}
                                            alt="Preview do brasão"
                                            className="h-24 w-24 object-contain rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveBrasao}
                                            className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
                                            aria-label="Remover imagem"
                                        >
                                            <X className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cidade">Cidade *</Label>
                            <Input
                                id="cidade"
                                type="text"
                                value={formData.cidade}
                                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                placeholder="Cidade sede do time"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="estado">Estado (UF) *</Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(value) => setFormData({ ...formData, estado: value })}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {estadosBrasileiros.map((estado) => (
                                        <SelectItem key={estado} value={estado}>
                                            {estado}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dataFundacao">Data de Fundação *</Label>
                            <Input
                                id="dataFundacao"
                                type="date"
                                value={formData.dataFundacao}
                                onChange={(e) => setFormData({ ...formData, dataFundacao: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleSkip}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Pular
                        </Button>
                        <Button type="submit" disabled={!isFormValid || isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Cadastrar Time"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
