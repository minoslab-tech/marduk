-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "times" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "shield_img" TEXT,
    "city" TEXT,
    "state_code" TEXT,
    "start_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogadores" (
    "id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "posicao_principal" TEXT NOT NULL,
    "pe_dominante" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "foto_url" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "adversario_nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'agendada',
    "gols_pro" INTEGER,
    "gols_contra" INTEGER,
    "observacoes_tecnico" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalacoes" (
    "id" TEXT NOT NULL,
    "time_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "esquema_tatico" TEXT NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalacoes_jogadores" (
    "id" TEXT NOT NULL,
    "escalacao_id" TEXT NOT NULL,
    "jogador_id" TEXT NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT false,
    "posicao_em_campo" TEXT NOT NULL,
    "numero_camisa" INTEGER,
    "ordem" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalacoes_jogadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partidas_participacao" (
    "id" TEXT NOT NULL,
    "partida_id" TEXT NOT NULL,
    "jogador_id" TEXT NOT NULL,
    "titular" BOOLEAN NOT NULL DEFAULT false,
    "minutos_jogados" INTEGER,
    "nota_tecnica" DOUBLE PRECISION,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partidas_participacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_partida" (
    "id" TEXT NOT NULL,
    "partida_id" TEXT NOT NULL,
    "jogador_id" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "minuto" INTEGER NOT NULL,
    "relacionado_jogador_id" TEXT,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_partida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_time_id_fkey" FOREIGN KEY ("time_id") REFERENCES "times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_time_id_fkey" FOREIGN KEY ("time_id") REFERENCES "times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes" ADD CONSTRAINT "escalacoes_time_id_fkey" FOREIGN KEY ("time_id") REFERENCES "times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes_jogadores" ADD CONSTRAINT "escalacoes_jogadores_escalacao_id_fkey" FOREIGN KEY ("escalacao_id") REFERENCES "escalacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalacoes_jogadores" ADD CONSTRAINT "escalacoes_jogadores_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas_participacao" ADD CONSTRAINT "partidas_participacao_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partidas_participacao" ADD CONSTRAINT "partidas_participacao_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_partida" ADD CONSTRAINT "eventos_partida_partida_id_fkey" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_partida" ADD CONSTRAINT "eventos_partida_jogador_id_fkey" FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_partida" ADD CONSTRAINT "eventos_partida_relacionado_jogador_id_fkey" FOREIGN KEY ("relacionado_jogador_id") REFERENCES "jogadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
