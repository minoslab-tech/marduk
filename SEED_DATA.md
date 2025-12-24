# Dados de Teste - Seed Database

Este arquivo documenta os dados fictícios criados para facilitar os testes da aplicação.

## Como executar o seed

```bash
npm run db:seed
```

## Dados Criados

### 👤 Usuário de Teste
- **Email:** `admin@garra.fc`
- **Senha:** `admin123`
- **Nome:** Técnico Principal

### ⚽ Time
- **Nome:** Garra FC
- **Cidade:** São Paulo - SP
- **Data de Fundação:** 15/01/2020

### 👥 Jogadores (30 jogadores)

Posições distribuídas:
- Goleiros
- Laterais (Direito e Esquerdo)
- Zagueiros
- Volantes
- Meio-campistas
- Atacantes

**Jogadores de Destaque:**
- João Silva
- Pedro Santos
- Carlos Mendes
- Rafael Costa
- Lucas Oliveira
- E mais 25 jogadores...

**Características:**
- 28 jogadores ativos
- 2 jogadores inativos
- Pé dominante variado (direito, esquerdo, ambidestro)
- Datas de nascimento entre 1995-2004
- Telefones e fotos fictícias

### 📋 Escalações (3 escalações)

1. **Time Titular** - 4-3-3 (Ativa)
   - Escalação principal para jogos normais
   - 11 titulares + 7 reservas

2. **Time Reserva** - 4-4-2
   - Escalação para jogos defensivos
   - 11 titulares + 7 reservas

3. **Time Ofensivo** - 3-5-2
   - Escalação para jogos ofensivos
   - 11 titulares + 7 reservas

### 🏆 Partidas (8 partidas)

#### Partidas Finalizadas (4)
- Incluem placar, participações dos jogadores e eventos
- Gols, assistências, cartões e substituições
- Notas técnicas para cada jogador
- Observações do técnico

**Adversários:**
- Tigres FC
- Leões do Norte
- FC Vitória
- Estrela FC

#### Partidas Agendadas (2)
- Datas futuras
- Adversários: Unidos FC, Dragões SC

#### Partida em Andamento (1)
- Acontecendo agora
- Adversário: Atlético Bairro

#### Partida Cancelada (1)
- Adversário: Falcões United

### 📊 Eventos de Partidas Finalizadas

Cada partida finalizada contém:
- **Participações:** 16 jogadores (11 titulares + 5 reservas)
- **Gols:** Quantidade variável com possíveis assistências
- **Cartões Amarelos:** 1-3 por partida
- **Substituições:** 2-3 por partida
- **Notas Técnicas:** Entre 5.0 e 9.0 para cada jogador

## Tipos de Dados

### Status de Partidas
- `agendada` - Partidas futuras
- `em_andamento` - Partida acontecendo agora
- `finalizada` - Partidas com resultado
- `cancelada` - Partidas canceladas

### Tipos de Partidas
- `campeonato` - Jogos oficiais
- `amistoso` - Jogos amistosos
- `treino` - Treinos internos

### Tipos de Eventos
- `gol` - Gols marcados
- `assistencia` - Assistências para gols
- `cartao_amarelo` - Cartões amarelos
- `cartao_vermelho` - Cartões vermelhos
- `substituicao` - Substituições de jogadores

## Observações

- Todos os dados são fictícios
- As datas das partidas são calculadas relativamente à data atual
- Os placares e eventos são gerados aleatoriamente
- As notas técnicas variam entre 5.0 e 9.0
- O seed limpa todos os dados anteriores antes de criar novos

## Resetar o Banco de Dados

Para resetar e recriar os dados:

```bash
npx prisma migrate reset
```

Isso irá:
1. Deletar o banco de dados
2. Recriar o banco de dados
3. Aplicar todas as migrations
4. Executar o seed automaticamente
