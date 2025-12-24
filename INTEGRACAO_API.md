# Integração Front-end com API - Partidas

## Bibliotecas Instaladas

- **axios**: Cliente HTTP para fazer requisições à API
- **react-hot-toast**: Notificações toast elegantes para feedback ao usuário

## Arquivos Criados

### 1. `/src/lib/api.ts`
Configuração do cliente Axios com:
- Base URL configurada para `/api`
- Interceptors para tratamento de erros
- Headers padrão configurados

### 2. `/src/hooks/usePartidas.ts`
Hook personalizado com funções para gerenciar partidas:

**Hooks:**
- `usePartidas(status?)` - Lista partidas com filtro opcional de status
- `usePartida(id)` - Busca detalhes de uma partida específica

**Funções:**
- `criarPartida(data)` - Cria nova partida
- `atualizarPartida(id, data)` - Atualiza dados da partida
- `excluirPartida(id)` - Exclui partida
- `atualizarParticipacao(partidaId, participacoes)` - Atualiza participação dos jogadores
- `adicionarEvento(partidaId, evento)` - Adiciona evento à partida
- `excluirEvento(partidaId, eventoId)` - Exclui evento

**Tipos TypeScript:**
- `Partida` - Modelo completo da partida
- `Jogador` - Modelo do jogador
- `PartidaParticipacao` - Modelo de participação
- `EventoPartida` - Modelo de evento

### 3. `/src/hooks/useTimes.ts`
Hook para buscar times disponíveis

### 4. `/src/app/api/times/route.ts`
Endpoint para listar times

## Páginas Atualizadas

### 1. `/dashboard/partidas/page.tsx`
**Integrações:**
- ✅ Listagem de partidas em tempo real
- ✅ Filtros por status (agendadas vs finalizadas)
- ✅ Exclusão de partidas com confirmação
- ✅ Formatação de datas e horas
- ✅ Navegação para detalhes
- ✅ Loading states

**Funcionalidades:**
- Busca partidas automaticamente ao carregar
- Separa partidas em abas (Próximos Jogos e Finalizadas)
- Exibe placar para partidas finalizadas
- Menu de ações (editar, excluir)

### 2. `/dashboard/partidas/nova/page.tsx`
**Integrações:**
- ✅ Criação de novas partidas via API
- ✅ Seleção automática do time
- ✅ Validação de formulário
- ✅ Estados de loading/submitting
- ✅ Redirecionamento após sucesso
- ✅ Notificações de sucesso/erro

**Campos do Formulário:**
- Time (auto-selecionado)
- Data e Hora
- Local
- Adversário
- Tipo (campeonato, amistoso, treino)
- Status (agendada por padrão)

### 3. `/dashboard/partidas/[id]/page.tsx`
**Integrações:**
- ✅ Carregamento de detalhes da partida
- ✅ Exibição de participações dos jogadores
- ✅ Listagem de eventos (gols, cartões, substituições)
- ✅ Cálculo automático de estatísticas
- ✅ Loading states
- ✅ Tratamento de partida não encontrada

**Abas Implementadas:**
1. **Resumo**
   - Observações do técnico
   - Estatísticas rápidas (gols marcados/sofridos)
   - Melhores jogadores em campo

2. **Eventos**
   - Timeline de eventos da partida
   - Gols com assistências
   - Cartões amarelos/vermelhos
   - Substituições

3. **Elenco e Notas**
   - Tabela de participação dos jogadores
   - Indicador de titulares
   - Minutos jogados
   - Notas técnicas

## Notificações Toast

Todas as operações exibem notificações apropriadas:
- ✅ Sucesso ao criar partida
- ✅ Sucesso ao atualizar partida
- ✅ Sucesso ao excluir partida
- ❌ Erros de validação
- ❌ Erros de servidor
- ❌ Erros de rede

## Estados de Loading

Todas as páginas implementam estados de loading:
- Skeleton/mensagem durante carregamento inicial
- Botões desabilitados durante submissão
- Feedback visual de progresso

## Tratamento de Erros

- Mensagens de erro amigáveis ao usuário
- Console logs para debugging (desenvolvimento)
- Fallbacks para dados ausentes
- Validação de campos obrigatórios

## Formatação de Dados

**Datas:**
```typescript
formatDate(dateString) // "24 de dezembro de 2024"
formatTime(dateString) // "15:30"
```

**Tipos de Partida:**
```typescript
campeonato → "Campeonato" (badge roxo)
amistoso → "Amistoso" (badge azul)
treino → "Treino" (badge laranja)
```

**Notas Técnicas:**
```typescript
>= 8.0 → Verde
>= 7.0 → Azul
>= 6.0 → Amarelo
< 6.0 → Vermelho
```

## Próximos Passos

Funcionalidades que podem ser implementadas:
- [ ] Edição de partidas
- [ ] Convocação de elenco
- [ ] Edição de eventos e participações
- [ ] Filtros avançados (por tipo, data, etc.)
- [ ] Busca por adversário
- [ ] Paginação para listagens grandes
- [ ] Exportação de relatórios
- [ ] Gráficos e estatísticas avançadas

## Testando

1. Faça login com: `admin@garra.fc` / `admin123`
2. Navegue até Partidas no menu
3. Visualize as partidas criadas pelo seed
4. Teste criar uma nova partida
5. Visualize os detalhes de uma partida finalizada
6. Experimente excluir uma partida
