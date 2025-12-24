import { pgTable, text, integer, real, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// User model
export const users = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// Time model
export const times = pgTable("times", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  shieldImg: text("shield_img"),
  city: text("city"),
  stateCode: text("state_code"),
  startDate: timestamp("start_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Jogador model
export const jogadores = pgTable("jogadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  timeId: uuid("time_id")
    .notNull()
    .references(() => times.id, { onDelete: "cascade" }),
  nomeCompleto: text("nome_completo").notNull(),
  posicaoPrincipal: text("posicao_principal").notNull(),
  peDominante: text("pe_dominante").notNull(),
  dataNascimento: timestamp("data_nascimento"),
  telefone: text("telefone"),
  fotoUrl: text("foto_url"),
  ativo: boolean("ativo").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Partida model
export const partidas = pgTable("partidas", {
  id: uuid("id").primaryKey().defaultRandom(),
  timeId: uuid("time_id")
    .notNull()
    .references(() => times.id, { onDelete: "cascade" }),
  dataHora: timestamp("data_hora").notNull(),
  local: text("local").notNull(),
  adversarioNome: text("adversario_nome").notNull(),
  tipo: text("tipo").notNull(),
  status: text("status").notNull().default("agendada"),
  golsPro: integer("gols_pro"),
  golsContra: integer("gols_contra"),
  observacoesTecnico: text("observacoes_tecnico"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Escalacao model
export const escalacoes = pgTable("escalacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  timeId: uuid("time_id")
    .notNull()
    .references(() => times.id, { onDelete: "cascade" }),
  nome: text("nome").notNull(),
  esquemaTatico: text("esquema_tatico").notNull(),
  descricao: text("descricao"),
  ativa: boolean("ativa").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// EscalacaoJogador model
export const escalacoesJogadores = pgTable("escalacoes_jogadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  escalacaoId: uuid("escalacao_id")
    .notNull()
    .references(() => escalacoes.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id")
    .notNull()
    .references(() => jogadores.id, { onDelete: "cascade" }),
  titular: boolean("titular").notNull().default(false),
  posicaoEmCampo: text("posicao_em_campo").notNull(),
  numeroCamisa: integer("numero_camisa"),
  ordem: integer("ordem"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// PartidaParticipacao model
export const partidasParticipacao = pgTable("partidas_participacao", {
  id: uuid("id").primaryKey().defaultRandom(),
  partidaId: uuid("partida_id")
    .notNull()
    .references(() => partidas.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id")
    .notNull()
    .references(() => jogadores.id, { onDelete: "cascade" }),
  titular: boolean("titular").notNull().default(false),
  minutosJogados: integer("minutos_jogados"),
  notaTecnica: real("nota_tecnica"),
  observacoes: text("observacoes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// EventoPartida model
export const eventosPartida = pgTable("eventos_partida", {
  id: uuid("id").primaryKey().defaultRandom(),
  partidaId: uuid("partida_id")
    .notNull()
    .references(() => partidas.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id")
    .notNull()
    .references(() => jogadores.id, { onDelete: "cascade" }),
  tipoEvento: text("tipo_evento").notNull(),
  minuto: integer("minuto").notNull(),
  relacionadoJogadorId: uuid("relacionado_jogador_id").references(
    () => jogadores.id
  ),
  observacao: text("observacao"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

// Types para TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Time = typeof times.$inferSelect;
export type NewTime = typeof times.$inferInsert;

export type Jogador = typeof jogadores.$inferSelect;
export type NewJogador = typeof jogadores.$inferInsert;

export type Partida = typeof partidas.$inferSelect;
export type NewPartida = typeof partidas.$inferInsert;

export type Escalacao = typeof escalacoes.$inferSelect;
export type NewEscalacao = typeof escalacoes.$inferInsert;

export type EscalacaoJogador = typeof escalacoesJogadores.$inferSelect;
export type NewEscalacaoJogador = typeof escalacoesJogadores.$inferInsert;

export type PartidaParticipacao = typeof partidasParticipacao.$inferSelect;
export type NewPartidaParticipacao = typeof partidasParticipacao.$inferInsert;

export type EventoPartida = typeof eventosPartida.$inferSelect;
export type NewEventoPartida = typeof eventosPartida.$inferInsert;
