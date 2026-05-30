# SellerDAO — Contexto Completo do Projeto

> **Use este arquivo como contexto inicial em qualquer IA ou ferramenta de desenvolvimento.**

---

## 1. Origem

Projeto desenvolvido para submissao no **Hackathon Solana Brasil 2026**, trilha **"Real World Web3 Applications"**, categoria **Payments, RWAs & Tokenizacao**.

---

## 2. O Problema

Sellers de marketplace (Mercado Livre, Shopee etc.) operam de forma isolada e perdem poder de barganha:

| Situacao | Seller Isolado | Sellers na DAO |
|---|---|---|
| Frete por pacote | R$ 28 | R$ 16-18 |
| Midia paga | CPM alto, disputa com grandes | CPM menor via compra em bloco |
| Influencer | Sem poder de negociar | Custo rateado entre membros |
| Dados de mercado | Isolados, sem benchmark | Agregados em tempo real |

---

## 3. A Solucao — SellerDAO

Uma DAO (Organizacao Autonoma Descentralizada) **na Solana** que agrupa sellers de marketplace para:

- Negociar **frete em volume** com transportadoras (Jadlog, Correios etc.)
- Comprar **midia em bloco** (Meta Ads, Google Ads) com CPM menor
- Contratar **influencers coletivamente** com custo rateado
- Compartilhar **dados de vendas agregados** como benchmark

**Narrativa central:** O seller pequeno sozinho nunca vai negociar com a Jadlog. 100 sellers com R$ 8k de treasury e voto on-chain, sim.

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
- Qualquer membro propoe uso do treasury (contratar transportadora, campanha com influencer, midia em bloco etc.)
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
- Proposta real sendo votada ao vivo durante a apresentacao
- Treasury visivel no **Solana Explorer** (argumento mais forte: verificavel em 3 segundos)

---

## 6. Impacto Projetado (100 Sellers Medios)

- **R$ 12/pacote** de economia de frete
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

**Mitigacao para o hackathon:** apresentar grupo piloto simulado — 10 sellers ficticios com volume real inserido, proposta de frete ativa, treasury visivel no explorer. O demo precisa fazer o juiz sentir que a coisa ja existe.

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
