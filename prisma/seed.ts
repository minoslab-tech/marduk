import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { hashPassword } from "../src/lib/security"

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.eventoPartida.deleteMany()
  await prisma.partidaParticipacao.deleteMany()
  await prisma.escalacaoJogador.deleteMany()
  await prisma.escalacao.deleteMany()
  await prisma.partida.deleteMany()
  await prisma.jogador.deleteMany()
  await prisma.time.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuário admin
  const hashedPassword = await hashPassword("admin123")
  const user = await prisma.user.create({
    data: {
      email: "admin@garra.fc",
      name: "Técnico Principal",
      password: hashedPassword,
    },
  })
  console.log("✅ Usuário criado:", user.email)

  // Criar time
  const time = await prisma.time.create({
    data: {
      nome: "Garra FC",
      shieldImg: "/images/garra-fc-shield.png",
      city: "São Paulo",
      stateCode: "SP",
      startDate: new Date("2020-01-15"),
    },
  })
  console.log("✅ Time criado:", time.nome)

  // Criar 30 jogadores
  const posicoes = [
    "Goleiro",
    "Lateral Direito",
    "Lateral Esquerdo",
    "Zagueiro",
    "Volante",
    "Meio-campista",
    "Atacante",
  ]

  const nomes = [
    "João Silva",
    "Pedro Santos",
    "Carlos Mendes",
    "Rafael Costa",
    "Lucas Oliveira",
    "Marcos Paulo",
    "André Lima",
    "Bruno Ferreira",
    "Felipe Rocha",
    "Gabriel Alves",
    "Thiago Martins",
    "Rodrigo Souza",
    "Diego Ribeiro",
    "Matheus Cardoso",
    "Vinícius Barros",
    "Leonardo Dias",
    "Gustavo Pereira",
    "Renato Nascimento",
    "Fábio Castro",
    "Ricardo Monteiro",
    "Márcio Gomes",
    "Leandro Silva",
    "Júlio César",
    "Adriano Lopes",
    "Wellington Freitas",
    "Alex Sandro",
    "Ederson Moura",
    "Douglas Pires",
    "Anderson Araújo",
    "Everton Cunha",
  ]

  const jogadores = []
  for (let i = 0; i < 30; i++) {
    const posicao = posicoes[i % posicoes.length]
    const jogador = await prisma.jogador.create({
      data: {
        timeId: time.id,
        nomeCompleto: nomes[i],
        posicaoPrincipal: posicao,
        peDominante: i % 3 === 0 ? "esquerdo" : i % 3 === 1 ? "direito" : "ambidestro",
        dataNascimento: new Date(1995 + (i % 10), (i % 12), (i % 28) + 1),
        telefone: `(11) 9${1000 + i}-${1000 + i * 2}`,
        fotoUrl: `/images/players/player-${i + 1}.jpg`,
        ativo: i < 28, // 28 ativos, 2 inativos
      },
    })
    jogadores.push(jogador)
  }
  console.log("✅ 30 jogadores criados")

  // Criar 3 escalações
  const escalacoes = []
  const esquemasTaticos = ["4-3-3", "4-4-2", "3-5-2"]
  const nomesEscalacoes = ["Time Titular", "Time Reserva", "Time Ofensivo"]

  for (let i = 0; i < 3; i++) {
    const escalacao = await prisma.escalacao.create({
      data: {
        timeId: time.id,
        nome: nomesEscalacoes[i],
        esquemaTatico: esquemasTaticos[i],
        descricao: `Escalação ${nomesEscalacoes[i].toLowerCase()} para jogos ${i === 2 ? "ofensivos" : i === 1 ? "defensivos" : "normais"}`,
        ativa: i === 0, // Apenas a primeira está ativa
      },
    })
    escalacoes.push(escalacao)

    // Adicionar jogadores à escalação (11 titulares + 7 reservas)
    for (let j = 0; j < 18 && j < jogadores.length; j++) {
      const jogadorIndex = (i * 18 + j) % jogadores.length
      await prisma.escalacaoJogador.create({
        data: {
          escalacaoId: escalacao.id,
          jogadorId: jogadores[jogadorIndex].id,
          titular: j < 11,
          posicaoEmCampo: posicoes[j % posicoes.length].substring(0, 3).toUpperCase(),
          numeroCamisa: j + 1,
          ordem: j + 1,
        },
      })
    }
  }
  console.log("✅ 3 escalações criadas com jogadores")

  // Criar 8 partidas com diferentes status
  const adversarios = [
    "Tigres FC",
    "Leões do Norte",
    "FC Vitória",
    "Estrela FC",
    "Atlético Bairro",
    "Unidos FC",
    "Dragões SC",
    "Falcões United",
  ]

  const locais = [
    "Estádio Municipal",
    "Campo do Parque Central",
    "Arena Esportiva",
    "Campo do Clube",
    "Estádio Regional",
  ]

  const tipos = ["campeonato", "amistoso", "treino"]
  const statusList = [
    "finalizada",
    "finalizada",
    "finalizada",
    "finalizada",
    "agendada",
    "agendada",
    "em_andamento",
    "cancelada",
  ]

  const partidas = []
  for (let i = 0; i < 8; i++) {
    const status = statusList[i]
    const dataHora = new Date()

    if (status === "finalizada") {
      // Partidas no passado
      dataHora.setDate(dataHora.getDate() - (30 - i * 4))
    } else if (status === "agendada") {
      // Partidas no futuro
      dataHora.setDate(dataHora.getDate() + (7 + i * 3))
    } else if (status === "em_andamento") {
      // Partida acontecendo agora
      dataHora.setHours(dataHora.getHours() - 1)
    } else {
      // Cancelada
      dataHora.setDate(dataHora.getDate() + 5)
    }

    const partida = await prisma.partida.create({
      data: {
        timeId: time.id,
        dataHora,
        local: locais[i % locais.length],
        adversarioNome: adversarios[i],
        tipo: tipos[i % tipos.length],
        status,
        golsPro: status === "finalizada" ? Math.floor(Math.random() * 4) : null,
        golsContra: status === "finalizada" ? Math.floor(Math.random() * 3) : null,
        observacoesTecnico:
          status === "finalizada"
            ? `Análise da partida contra ${adversarios[i]}. ${
                Math.random() > 0.5
                  ? "Boa atuação da equipe, mantivemos o controle do jogo."
                  : "Precisamos melhorar na marcação e criação de jogadas."
              }`
            : null,
      },
    })
    partidas.push(partida)
  }
  console.log("✅ 8 partidas criadas")

  // Adicionar participações e eventos para partidas finalizadas
  for (const partida of partidas) {
    if (partida.status === "finalizada") {
      // Adicionar 16 jogadores (11 titulares + 5 reservas)
      const jogadoresPartida = jogadores.slice(0, 16)

      for (let i = 0; i < jogadoresPartida.length; i++) {
        const titular = i < 11
        const minutosJogados = titular
          ? Math.floor(70 + Math.random() * 20)
          : Math.floor(Math.random() * 30)

        await prisma.partidaParticipacao.create({
          data: {
            partidaId: partida.id,
            jogadorId: jogadoresPartida[i].id,
            titular,
            minutosJogados,
            notaTecnica: minutosJogados > 0 ? 5.0 + Math.random() * 4 : null,
            observacoes:
              Math.random() > 0.7
                ? "Boa atuação, manteve a intensidade durante todo o jogo."
                : null,
          },
        })
      }

      // Adicionar eventos (gols)
      const golsPro = partida.golsPro || 0
      for (let i = 0; i < golsPro; i++) {
        const jogadorGol = jogadoresPartida[Math.floor(Math.random() * 11)]
        const jogadorAssist =
          Math.random() > 0.3
            ? jogadoresPartida[Math.floor(Math.random() * 11)]
            : null

        await prisma.eventoPartida.create({
          data: {
            partidaId: partida.id,
            jogadorId: jogadorGol.id,
            tipoEvento: "gol",
            minuto: Math.floor(10 + Math.random() * 80),
            relacionadoJogadorId:
              jogadorAssist && jogadorAssist.id !== jogadorGol.id
                ? jogadorAssist.id
                : null,
            observacao: "Belo gol após jogada trabalhada",
          },
        })
      }

      // Adicionar cartões amarelos (1-3 por partida)
      const numCartoesAmarelos = Math.floor(1 + Math.random() * 3)
      for (let i = 0; i < numCartoesAmarelos; i++) {
        const jogador = jogadoresPartida[Math.floor(Math.random() * 11)]
        await prisma.eventoPartida.create({
          data: {
            partidaId: partida.id,
            jogadorId: jogador.id,
            tipoEvento: "cartao_amarelo",
            minuto: Math.floor(20 + Math.random() * 60),
            observacao: "Falta tática",
          },
        })
      }

      // Adicionar substituições (2-3 por partida)
      const numSubstituicoes = Math.floor(2 + Math.random() * 2)
      for (let i = 0; i < numSubstituicoes && i + 11 < jogadoresPartida.length; i++) {
        await prisma.eventoPartida.create({
          data: {
            partidaId: partida.id,
            jogadorId: jogadoresPartida[11 + i].id, // Jogador que entra
            tipoEvento: "substituicao",
            minuto: Math.floor(60 + Math.random() * 25),
            relacionadoJogadorId: jogadoresPartida[8 + i].id, // Jogador que sai
            observacao: "Mudança tática",
          },
        })
      }
    }
  }
  console.log("✅ Participações e eventos adicionados às partidas finalizadas")

  console.log("🎉 Seed concluído com sucesso!")
  console.log("\n📊 Resumo:")
  console.log(`   - 1 usuário: ${user.email}`)
  console.log(`   - 1 time: ${time.nome}`)
  console.log(`   - 30 jogadores`)
  console.log(`   - 3 escalações`)
  console.log(`   - 8 partidas (4 finalizadas, 2 agendadas, 1 em andamento, 1 cancelada)`)
  console.log(`   - Participações e eventos nas partidas finalizadas`)
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
