# Anael: Correções de Vulnerabilidades

Este documento registra, de forma objetiva, as vulnerabilidades identificadas no sistema e as correções que implementei para melhorar a segurança da aplicação.

## Vulnerabilidades Críticas Corrigidas

### 1. Hash de Senhas com SHA-256
**Descrição:**  
O sistema utilizava SHA-256 para hash de senhas, o que não é adequado para esse fim por ser rápido demais e vulnerável a ataques de força bruta e rainbow tables.

**Risco:**  
- Quebra de senhas com uso de rainbow tables  
- Ausência de salt adequado  
- Alta velocidade de cálculo do hash, facilitando ataques  

**Correção:**  
- Substituí o SHA-256 por bcrypt com salt rounds configurado em 12  
- Centralizei a lógica de segurança em `src/lib/security.ts`  
- Apliquei a mudança nos fluxos de autenticação e registro  

**Arquivos afetados:**  
- `src/auth.ts`  
- `src/app/api/auth/register/route.ts`  
- Criado: `src/lib/security.ts`

---

### 2. Arquivo forgot-password com Prisma mockado
**Descrição:**  
O arquivo `forgot-password/route.ts` utilizava um objeto Prisma vazio, tornando a funcionalidade de recuperação de senha inutilizável.

**Risco:**  
- Recuperação de senha não funcionava  
- Ausência de proteção contra abuso da rota  

**Correção:**  
- Conectei o endpoint ao Prisma real  
- Adicionei rate limiting  
- Implementei validação de email  
- Implementei proteção contra enumeração de emails  

**Arquivos afetados:**  
- `src/app/api/auth/forgot-password/route.ts`

---

## Vulnerabilidades de Média Severidade Corrigidas

### 3. Falta de Rate Limiting
**Descrição:**  
Os endpoints de autenticação não possuíam proteção contra tentativas excessivas.

**Risco:**  
- Ataques de força bruta no login  
- Spam de registros  
- Abuso da funcionalidade de recuperação de senha  

**Correção:**  
- Criei um sistema de rate limiting em `src/lib/rate-limit.ts`  
- Login: 5 tentativas a cada 15 minutos por email  
- Registro: 3 tentativas por hora por IP  
- Forgot-password: 3 tentativas por hora por email e 5 por IP  

**Arquivos afetados:**  
- Criado: `src/lib/rate-limit.ts`  
- `src/auth.ts`  
- `src/app/api/auth/register/route.ts`  
- `src/app/api/auth/forgot-password/route.ts`

---

### 4. Validação Fraca de Senhas
**Descrição:**  
As senhas exigiam apenas 6 caracteres, sem critérios mínimos de complexidade.

**Risco:**  
- Senhas fracas  
- Maior facilidade para ataques de força bruta  

**Correção:**  
- Aumentei o tamanho mínimo para 8 caracteres  
- Exigi pelo menos uma letra maiúscula  
- Exigi pelo menos uma letra minúscula  
- Exigi pelo menos um número  
- Defini tamanho máximo de 128 caracteres  

**Arquivos afetados:**  
- `src/lib/security.ts` (função `validatePasswordStrength`)  
- `src/app/api/auth/register/route.ts`

---

### 5. Falta de Validação de Email
**Descrição:**  
Os emails não eram validados corretamente antes do processamento.

**Risco:**  
- Erros no sistema  
- Possível entrada de dados maliciosos  

**Correção:**  
- Implementei validação de formato com regex  
- Limitei o tamanho máximo para 255 caracteres  
- Normalizei o email (trim e lowercase)  

**Arquivos afetados:**  
- `src/lib/security.ts` (funções `isValidEmail` e `sanitizeEmail`)  
- `src/auth.ts`  
- `src/app/api/auth/register/route.ts`  
- `src/app/api/auth/forgot-password/route.ts`

---

### 6. Falta de Sanitização de Inputs
**Descrição:**  
Entradas do usuário eram processadas sem sanitização prévia.

**Risco:**  
- Injeção de dados maliciosos  
- Persistência de dados inválidos no banco  

**Correção:**  
- Criei a função `sanitizeInput` para limpeza de strings  
- Padronizei a sanitização de emails  
- Apliquei sanitização em todos os endpoints de autenticação  
- Defini limites de tamanho para entradas  

**Arquivos afetados:**  
- `src/lib/security.ts`  
- `src/app/api/auth/register/route.ts`  
- `src/app/api/auth/forgot-password/route.ts`  
- `src/auth.ts`

---

### 7. Exposição Excessiva de Informações em Erros
**Descrição:**  
Mensagens de erro detalhadas eram retornadas ao cliente.

**Risco:**  
- Exposição da estrutura interna do sistema  
- Possível enumeração de usuários  
- Vazamento de informações sensíveis  

**Correção:**  
- Padronizei mensagens de erro genéricas em produção  
- Mantive logs detalhados apenas em ambiente de desenvolvimento  
- A rota de forgot-password sempre retorna sucesso, evitando enumeração  

**Arquivos afetados:**  
- `src/app/api/auth/register/route.ts`  
- `src/app/api/auth/forgot-password/route.ts`

---

## Melhorias de Segurança Adicionais

### 8. Mitigação de Timing Attacks
**Descrição:**  
Implementei proteção contra ataques baseados em tempo de resposta.

**Correção:**  
- Execução de hash dummy mesmo quando o usuário não existe  
- Redução do vazamento de informações por tempo de resposta  

**Arquivos afetados:**  
- `src/auth.ts`

---

### 9. Melhoria na Gestão de Conexões do Prisma
**Descrição:**  
Havia risco de múltiplas instâncias do Prisma Client em desenvolvimento.

**Correção:**  
- Implementei o padrão Singleton  
- Evitei vazamento de conexões  

**Arquivos afetados:**  
- `src/lib/db.ts`

---

## Resumo das Mudanças

### Arquivos Criados
- `src/lib/security.ts` – Funções de segurança (hash, validação e sanitização)  
- `src/lib/rate-limit.ts` – Sistema de rate limiting  
- `VULNERABILIDADES_CORRIGIDAS.md` – Este documento  

### Arquivos Modificados
- `src/auth.ts` – Migração para bcrypt, validações e rate limiting  
- `src/app/api/auth/register/route.ts` – Validações robustas e sanitização  
- `src/app/api/auth/forgot-password/route.ts` – Uso do Prisma real e proteções  
- `src/lib/db.ts` – Implementação de singleton  

### Dependências Adicionadas
- `bcrypt` – Hash seguro de senhas  
- `@types/bcrypt` – Tipagens para TypeScript  

