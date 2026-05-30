# SellerDAO — Contexto Completo do Projeto

> **Use este arquivo como contexto inicial em qualquer IA ou ferramenta de desenvolvimento.**

---

## 1. Origem

Projeto desenvolvido para submissao no **Hackathon Solana Brasil 2026**, trilha **"Real World Web3 Applications"**, categoria **Payments, RWAs & Tokenizacao**.

---

## 2. O Problema

Sellers de marketplace (Mercado Livre, Shopee etc.) operam de forma isolada e perdem poder de barganha
nos espacos onde o marketplace nao interfere:

| Situacao | Seller Isolado | Sellers na DAO |
|---|---|---|
| Compra de estoque | Preco de atacado ruim, baixo volume | Desconto real por compra coletiva |
| Creator pool (lives) | Sem poder de dividir receita | Revenue share automatico entre sellers |
| Midia paga | CPM alto, disputa com grandes | CPM menor via compra em bloco |
| Dados de mercado | Isolados, sem benchmark | Agregados em tempo real |

---

## 3. A Solucao — SellerDAO

Uma DAO (Organizacao Autonoma Descentralizada) **na Solana** que agrupa sellers de marketplace para:

- **Compra coletiva de estoque** com pagamento on-chain
- **Creator pool (TikTok Shop)** com revenue share automatico por live
- **Compra de midia em bloco** (Meta Ads, Google Ads) com CPM menor
- **Dados de vendas agregados** como benchmark

**Narrativa central:** O seller pequeno sozinho nunca vai negociar com a Jadlog. 100 sellers com R$ 8k de treasury e voto on-chain, sim.

### 3.1 Posicionamento (ponto critico)

A DAO nao muda o que o marketplace controla. A estrategia e agir nos espacos onde o marketplace nao chega.
O insight central do pitch: a DAO nao e uma solucao de logistica; e uma camada de poder coletivo
que atua em tudo que o marketplace nao bloqueia.

### 3.2 Casos de uso prioritarios para o hackathon

- **Compra coletiva de estoque (caso mais facil de demonstrar):** fluxo completo e fisico.
  Sellers entram, treasury acumula, votacao acontece, pagamento sai, estoque chega. Sem depender
  de API externa ou integracao de terceiros. E o caso mais limpo para construir rapido.
- **Creator pool do TikTok Shop (caso mais impactante para a banca):** demo de uma live com receita
  dividida automaticamente entre 10 sellers via smart contract. Mostra um revenue share coletivo
  que ainda nao foi resolvido no mercado.

---

## 4. Fluxo de Funcionamento

### Passo 1 — Entrada na DAO
- Seller deposita stake minimo (ex: **10 USDC**) em um programa Anchor na Solana
- Recebe **tokens de governanca** proporcionais ao volume de vendas dos ultimos 30 dias
- Teto de concentracao implementado para evitar dominancia de um unico seller

### Passo 2 — Alimentacao do Treasury
- A cada venda processada, **1-2% vai automaticamente para o treasury** via smart contract
- Sem intervencao manual — programa Solana distribui no momento do pagamento
- Treasury visivel publicamente no Solana Explorer

### Passo 3 — Proposta e Votacao On-Chain
- Qualquer membro propoe uso do treasury (compra coletiva de estoque, creator pool, midia em bloco etc.)
- Proposta aberta por **72 horas**
- Membros votam com tokens de governanca
- Aprovacao: maioria simples (ou supermaioria para gastos grandes)

### Passo 4 — Execucao e Distribuicao
- Proposta aprovada: treasury paga fornecedor diretamente via instrucao Solana
- Beneficio distribuido entre membros **proporcionalmente ao volume de vendas do periodo**
- Automatico, sem intermediario humano

---

## 5. Stack Tecnica

### On-chain (Programa Anchor)
- **Linguagem:** Rust + Anchor Framework
- **4 instrucoes principais:**
  - `join_dao` — stake + mint de governance token
  - `propose` — criar proposta com alvo de gasto
  - `vote` — registrar voto
  - `execute` — liberar treasury se aprovado
- **Primitivas:** PDAs (Program Derived Addresses), SPL Token
- **Estimativa:** ~200 linhas de codigo real

### Frontend
- **React** + `@solana/web3.js`
- Wallet connect via **Phantom**
- Dashboard com: treasury atual em USDC, propostas ativas com contagem de votos em tempo real, historico de execucoes

### Demo (Hackathon)
- 5-10 sellers pre-carregados com wallets de teste na **Devnet**
- Proposta real de **compra coletiva de estoque** sendo votada ao vivo
- Treasury visivel no **Solana Explorer** (argumento mais forte: verificavel em 3 segundos)

---

## 6. Impacto Projetado (100 Sellers Medios)

- **8-15%** de desconto medio em estoque por compra coletiva
- **40%** de reducao de CPM em midia paga
- **R$ 8.000/mes** estimado de treasury coletivo
- **0** intermediarios humanos no processo

---

## 7. O Que Faz Esta Ideia Ser Forte

1. **Narrativa unica:** nao e "blockchain pra pagar" — e **poder coletivo programavel**
2. **Tecnica minima e limpa:** apenas 4 instrucoes no programa Anchor + 1 treasury PDA — sem oraculo externo, sem bridge entre chains. Solana puro.
3. **Problema real verificavel:** founders com experiencia direta no universo de sellers de marketplace (DNT, fitness apparel)
4. **Demo convincente:** treasury visivel on-chain e argumento que qualquer juiz entende sem conhecer Solana

---

## 8. Risco Principal

**Bootstrap:** DAO sem membros -> sem treasury -> sem poder de barganha -> sem motivo para entrar.

**Mitigacao para o hackathon:** apresentar grupo piloto simulado — 10 sellers ficticios com volume real inserido, proposta de compra coletiva de estoque ativa, treasury visivel no explorer. O demo precisa fazer o juiz sentir que a coisa ja existe.

---

## 9. Criterios de Avaliacao do Hackathon

- Clareza do problema e da solucao
- Aplicabilidade no mundo real
- Qualidade tecnica e uso da Solana
- Potencial de escala e continuidade
- Experiencia do usuario

---

## 10. Glossario Rapido

| Termo | Definicao no contexto |
|---|---|
| DAO | Organizacao Autonoma Descentralizada — governanca por smart contract |
| Treasury | Fundo coletivo gerenciado pelo programa Solana (conta PDA) |
| Governance Token | Token SPL que da direito de voto proporcional ao volume de vendas |
| Stake | Deposito minimo para entrar na DAO (10 USDC) |
| PDA | Program Derived Address — conta controlada pelo programa, nao por wallet privada |
| Anchor | Framework Rust para desenvolvimento de programas Solana |
| Devnet | Rede de testes da Solana (sem dinheiro real) |
| CPM | Custo Por Mil impressoes em midia paga |
