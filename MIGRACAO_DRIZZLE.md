# Guia de Migração Prisma → Drizzle

## ✅ O que já foi feito:

1. ✅ Instalação do Drizzle ORM e dependências
2. ✅ Criação do schema em `src/db/schema.ts`
3. ✅ Configuração do Drizzle em `drizzle.config.ts`
4. ✅ Criação do cliente do banco em `src/db/index.ts`
5. ✅ Geração e aplicação das migrations
6. ✅ Criação do seed em `src/db/seed.ts`
7. ✅ Seed executado com sucesso (30 jogadores, 3 escalações, 8 partidas)

## 📝 Padrões de Migração:

### Importações:
```typescript
// ANTES (Prisma)
import { prisma } from "@/lib/db"

// DEPOIS (Drizzle)
import { db } from "@/db"
import { users, times, jogadores, partidas, escalacoes, etc } from "@/db/schema"
import { eq, and, or, like, desc, asc } from "drizzle-orm"
```

### Queries Básicas:

#### SELECT (findMany)
```typescript
// ANTES
const partidas = await prisma.partida.findMany({
  where: { status: "agendada" },
  include: { time: true },
  orderBy: { dataHora: "desc" }
})

// DEPOIS
import { partidas, times } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

const partidasResult = await db
  .select()
  .from(partidas)
  .where(eq(partidas.status, "agendada"))
  .leftJoin(times, eq(partidas.timeId, times.id))
  .orderBy(desc(partidas.dataHora))
```

#### SELECT com múltiplos filtros
```typescript
// ANTES
const jogadoresAtivos = await prisma.jogador.findMany({
  where: {
    timeId: timeId,
    ativo: true,
    posicaoPrincipal: "Atacante"
  }
})

// DEPOIS
import { jogadores } from "@/db/schema"
import { eq, and } from "drizzle-orm"

const jogadoresAtivos = await db
  .select()
  .from(jogadores)
  .where(
    and(
      eq(jogadores.timeId, timeId),
      eq(jogadores.ativo, true),
      eq(jogadores.posicaoPrincipal, "Atacante")
    )
  )
```

#### SELECT único (findUnique/findFirst)
```typescript
// ANTES
const partida = await prisma.partida.findUnique({
  where: { id },
  include: { time: true, partidasParticipacao: true }
})

// DEPOIS
const [partida] = await db
  .select()
  .from(partidas)
  .where(eq(partidas.id, id))
  .limit(1)

// Para includes complexos, usar múltiplas queries ou subqueries
```

#### INSERT (create)
```typescript
// ANTES
const novaPartida = await prisma.partida.create({
  data: {
    timeId,
    dataHora,
    local,
    adversarioNome,
    tipo,
    status: "agendada"
  }
})

// DEPOIS
const [novaPartida] = await db
  .insert(partidas)
  .values({
    timeId,
    dataHora,
    local,
    adversarioNome,
    tipo,
    status: "agendada"
  })
  .returning()
```

#### UPDATE
```typescript
// ANTES
const partidaAtualizada = await prisma.partida.update({
  where: { id },
  data: { status: "finalizada", golsPro: 3, golsContra: 1 }
})

// DEPOIS
const [partidaAtualizada] = await db
  .update(partidas)
  .set({ status: "finalizada", golsPro: 3, golsContra: 1 })
  .where(eq(partidas.id, id))
  .returning()
```

#### DELETE
```typescript
// ANTES
await prisma.partida.delete({
  where: { id }
})

// DEPOIS
await db
  .delete(partidas)
  .where(eq(partidas.id, id))
```

#### DELETE Many
```typescript
// ANTES
await prisma.eventoPartida.deleteMany({
  where: { partidaId }
})

// DEPOIS
await db
  .delete(eventosPartida)
  .where(eq(eventosPartida.partidaId, partidaId))
```

### Joins e Relacionamentos:

```typescript
// Partida com Time
const partidasComTime = await db
  .select({
    id: partidas.id,
    dataHora: partidas.dataHora,
    local: partidas.local,
    adversarioNome: partidas.adversarioNome,
    status: partidas.status,
    time: {
      id: times.id,
      nome: times.nome
    }
  })
  .from(partidas)
  .leftJoin(times, eq(partidas.timeId, times.id))
```

### Agregações:

```typescript
// COUNT
import { count } from "drizzle-orm"

const [{ total }] = await db
  .select({ total: count() })
  .from(partidas)
  .where(eq(partidas.status, "finalizada"))

// AVG, SUM, etc
import { avg, sum } from "drizzle-orm"

const [stats] = await db
  .select({
    media: avg(partidasParticipacao.notaTecnica),
    totalMinutos: sum(partidasParticipacao.minutosJogados)
  })
  .from(partidasParticipacao)
  .where(eq(partidasParticipacao.jogadorId, jogadorId))
```

### Transações:

```typescript
// ANTES
await prisma.$transaction(async (tx) => {
  await tx.eventoPartida.deleteMany({ where: { partidaId } })
  await tx.eventoPartida.createMany({ data: eventos })
})

// DEPOIS
await db.transaction(async (tx) => {
  await tx.delete(eventosPartida).where(eq(eventosPartida.partidaId, partidaId))
  await tx.insert(eventosPartida).values(eventos)
})
```

## 📂 Arquivos que precisam ser migrados:

1. ✅ `src/lib/db.ts` → Substituir por `src/db/index.ts` (já criado)
2. ⏳ `src/auth.ts` → Substituir queries do usuário
3. ⏳ `src/app/api/auth/register/route.ts`
4. ⏳ `src/app/api/auth/forgot-password/route.ts`
5. ⏳ `src/app/api/times/route.ts`
6. ⏳ `src/app/api/partidas/route.ts`
7. ⏳ `src/app/api/partidas/[id]/route.ts`
8. ⏳ `src/app/api/partidas/[id]/participacao/route.ts`
9. ⏳ `src/app/api/partidas/[id]/eventos/route.ts`
10. ⏳ `src/app/api/jogadores/route.ts`
11. ⏳ `src/app/api/jogadores/[id]/route.ts`
12. ⏳ `src/app/api/jogadores/[id]/estatisticas/route.ts`
13. ⏳ `src/app/api/escalacoes/route.ts`
14. ⏳ `src/app/api/escalacoes/[id]/route.ts`

## 🎯 Próximos Passos:

1. Backup do código atual (feito automaticamente pelo Git)
2. Migrar cada arquivo de API seguindo os padrões acima
3. Testar cada endpoint após migração
4. Atualizar `src/auth.ts` para usar Drizzle
5. Remover dependências do Prisma do package.json
6. Deletar pasta `prisma/` e `src/generated/prisma/`

## 💡 Dicas:

- Use o Drizzle Studio para visualizar dados: `npm run db:studio`
- As queries do Drizzle são tipadas, aproveite o autocomplete
- Para relacionamentos complexos, considere fazer múltiplas queries ou usar subqueries
- O Drizzle não tem um sistema de "include" como o Prisma, use joins explícitos

## 🔗 Documentação:

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Queries](https://orm.drizzle.team/docs/select)
- [Drizzle SQLite](https://orm.drizzle.team/docs/get-started-sqlite)
