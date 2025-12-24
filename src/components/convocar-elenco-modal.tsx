"use client"

import { useState, useEffect } from "react"
import { X, Users, MessageCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useEscalacoes } from "@/hooks/useEscalacoes"
import { toast } from "react-hot-toast"
import type { Partida } from "@/hooks/usePartidas"

interface ConvocarElencoModalProps {
  partida: Partida
  isOpen: boolean
  onClose: () => void
}

export default function ConvocarElencoModal({
  partida,
  isOpen,
  onClose,
}: ConvocarElencoModalProps) {
  const [escalacaoSelecionada, setEscalacaoSelecionada] = useState<string>("")
  const [mensagemGerada, setMensagemGerada] = useState<string>("")
  const [copiado, setCopiado] = useState(false)

  const { escalacoes, loading } = useEscalacoes({ timeId: partida.timeId })

  // Auto-selecionar escalação ativa
  useEffect(() => {
    if (escalacoes.length > 0 && !escalacaoSelecionada) {
      const ativa = escalacoes.find((e) => e.ativa)
      if (ativa) {
        setEscalacaoSelecionada(ativa.id)
      } else {
        setEscalacaoSelecionada(escalacoes[0].id)
      }
    }
  }, [escalacoes, escalacaoSelecionada])

  // Gerar mensagem quando selecionar escalação
  useEffect(() => {
    if (escalacaoSelecionada) {
      gerarMensagem()
    }
  }, [escalacaoSelecionada])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const gerarMensagem = () => {
    const escalacao = escalacoes.find((e) => e.id === escalacaoSelecionada)
    if (!escalacao) return

    const titulares = escalacao.escalacoesJogadores?.filter((ej) => ej.titular) || []
    const reservas = escalacao.escalacoesJogadores?.filter((ej) => !ej.titular) || []

    let mensagem = `🔴⚽ *CONVOCAÇÃO DE ELENCO* ⚽🔴\n\n`
    mensagem += `📋 *Partida:* ${partida.time?.nome || "Nosso Time"} x ${partida.adversarioNome}\n`
    mensagem += `📅 *Data:* ${formatDate(partida.dataHora)}\n`
    mensagem += `⏰ *Horário:* ${formatTime(partida.dataHora)}\n`
    mensagem += `📍 *Local:* ${partida.local}\n`
    mensagem += `🏆 *Tipo:* ${
      partida.tipo === "campeonato"
        ? "Campeonato"
        : partida.tipo === "amistoso"
        ? "Amistoso"
        : "Treino"
    }\n\n`

    mensagem += `⚡ *Escalação:* ${escalacao.nome} (${escalacao.esquemaTatico})\n\n`

    if (titulares.length > 0) {
      mensagem += `👥 *TITULARES:*\n`
      titulares.forEach((ej, index) => {
        const numero = ej.numeroCamisa ? `#${ej.numeroCamisa}` : ""
        mensagem += `${index + 1}. ${ej.jogador.nomeCompleto} ${numero} - ${ej.posicaoEmCampo}\n`
      })
      mensagem += `\n`
    }

    if (reservas.length > 0) {
      mensagem += `🔄 *RESERVAS:*\n`
      reservas.forEach((ej, index) => {
        const numero = ej.numeroCamisa ? `#${ej.numeroCamisa}` : ""
        mensagem += `${index + 1}. ${ej.jogador.nomeCompleto} ${numero}\n`
      })
      mensagem += `\n`
    }

    mensagem += `⚠️ *IMPORTANTE:*\n`
    mensagem += `• Chegar 30 minutos antes do horário\n`
    mensagem += `• Trazer documento com foto\n`
    mensagem += `• Uniforme completo\n\n`

    mensagem += `✅ Confirme sua presença respondendo esta mensagem!\n\n`
    mensagem += `💪 Vamos com tudo, equipe! 🔥`

    setMensagemGerada(mensagem)
  }

  const copiarMensagem = async () => {
    try {
      await navigator.clipboard.writeText(mensagemGerada)
      setCopiado(true)
      toast.success("Mensagem copiada!")
      setTimeout(() => setCopiado(false), 2000)
    } catch (error) {
      toast.error("Erro ao copiar mensagem")
    }
  }

  const abrirWhatsApp = () => {
    const escalacao = escalacoes.find((e) => e.id === escalacaoSelecionada)
    if (!escalacao) return

    // Pegar todos os jogadores com telefone
    const jogadoresComTelefone = escalacao.escalacoesJogadores?.filter(
      (ej) => ej.jogador.telefone && ej.jogador.ativo
    ) || []

    if (jogadoresComTelefone.length === 0) {
      toast.error("Nenhum jogador convocado possui telefone cadastrado")
      return
    }

    // Abrir WhatsApp Web com mensagem
    const mensagemEncoded = encodeURIComponent(mensagemGerada)
    
    // Se tiver apenas um jogador, abre direto para ele
    if (jogadoresComTelefone.length === 1) {
      const telefone = jogadoresComTelefone[0].jogador.telefone!.replace(/\D/g, "")
      window.open(
        `https://wa.me/55${telefone}?text=${mensagemEncoded}`,
        "_blank"
      )
    } else {
      // Se tiver múltiplos, copia a mensagem e abre o WhatsApp
      copiarMensagem()
      toast.success(
        `${jogadoresComTelefone.length} jogadores convocados. Mensagem copiada! Cole no WhatsApp.`,
        { duration: 5000 }
      )
      // Abre o WhatsApp Web
      window.open("https://web.whatsapp.com/", "_blank")
    }
  }

  const enviarWhatsAppIndividual = (telefone: string) => {
    const telefoneNumeros = telefone.replace(/\D/g, "")
    const mensagemEncoded = encodeURIComponent(mensagemGerada)
    window.open(
      `https://wa.me/55${telefoneNumeros}?text=${mensagemEncoded}`,
      "_blank"
    )
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Convocar Elenco</h2>
              <p className="text-white/90 text-sm">
                {partida.adversarioNome} • {formatDate(partida.dataHora)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Seleção de Escalação */}
          <div className="space-y-2">
            <Label htmlFor="escalacao">Selecione a Escalação</Label>
            {loading ? (
              <p className="text-gray-500 text-sm">Carregando escalações...</p>
            ) : escalacoes.length === 0 ? (
              <p className="text-red-500 text-sm">
                Nenhuma escalação cadastrada. Crie uma escalação primeiro.
              </p>
            ) : (
              <select
                id="escalacao"
                value={escalacaoSelecionada}
                onChange={(e) => setEscalacaoSelecionada(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {escalacoes.map((escalacao) => (
                  <option key={escalacao.id} value={escalacao.id}>
                    {escalacao.nome} ({escalacao.esquemaTatico})
                    {escalacao.ativa ? " ⭐ Ativa" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Preview da Mensagem */}
          {mensagemGerada && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mensagem para WhatsApp</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copiarMensagem}
                  className="flex items-center gap-2"
                >
                  {copiado ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                  {mensagemGerada}
                </pre>
              </div>
            </div>
          )}

          {/* Lista de Jogadores Convocados */}
          {escalacaoSelecionada && (
            <div className="space-y-3">
              <Label>Jogadores Convocados</Label>
              {(() => {
                const escalacao = escalacoes.find(
                  (e) => e.id === escalacaoSelecionada
                )
                if (!escalacao?.escalacoesJogadores) return null

                const jogadores = escalacao.escalacoesJogadores

                return (
                  <div className="border border-gray-200 rounded-lg divide-y">
                    {jogadores.map((ej) => (
                      <div
                        key={ej.id}
                        className="p-3 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {ej.titular && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {ej.jogador.nomeCompleto}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ej.posicaoEmCampo}
                              {ej.numeroCamisa && ` • #${ej.numeroCamisa}`}
                              {ej.titular ? " • Titular" : " • Reserva"}
                            </div>
                          </div>
                        </div>
                        {ej.jogador.telefone && ej.jogador.ativo && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              enviarWhatsAppIndividual(ej.jogador.telefone!)
                            }
                            className="flex items-center gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Enviar
                          </Button>
                        )}
                        {!ej.jogador.telefone && (
                          <span className="text-xs text-gray-400">
                            Sem telefone
                          </span>
                        )}
                        {!ej.jogador.ativo && (
                          <span className="text-xs text-red-500">Inativo</span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={abrirWhatsApp}
            disabled={!mensagemGerada || escalacoes.length === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Enviar pelo WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}
