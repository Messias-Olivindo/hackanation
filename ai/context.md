# SellerDAO — Contexto Completo do Projeto

> **Use este arquivo como contexto inicial em qualquer IA ou ferramenta de desenvolvimento.**

---

## 1. Origem

Projeto desenvolvido para submissão no **Hackathon Solana Brasil 2026**, trilha **"Real World Web3 Applications"**, categoria **Payments, RWAs & Tokenização** (prêmio de até US$ 2.000 no 1º lugar + possibilidade de prêmio adicional Chainlink de US$ 500).

---

## 2. O Problema

Sellers de marketplace (Mercado Livre, Shopee etc.) operam de forma isolada e perdem poder de barganha:

| Situação | Seller Isolado | Sellers na DAO |
|---|---|---|
| Frete por pacote | R$ 28 | R$ 16–18 |
| Mídia paga | CPM alto, disputa com grandes | CPM menor via compra em bloco |
| Influencer | Sem poder de negociar | Custo rateado entre membros |
| Dados de mercado | Isolados, sem benchmark | Agregados em tempo real |

---

## 3. A Solução — SellerDAO

Uma DAO (Organização Autônoma Descentralizada) **na Solana** que agrupa sellers de marketplace para:

- Negociar **frete em volume** com transportadoras (Jadlog, Correios etc.)
- Comprar **mídia em bloco** (Meta Ads, Google Ads) com CPM menor
- Contratar **influencers coletivamente** com custo rateado
- Compartilhar **dados de vendas agregados** como benchmark

**Narrativa central:** O seller pequeno sozinho nunca vai negociar com a Jadlog. 100 sellers com R$ 8k de treasury e voto on-chain, sim.

---

## 4. Fluxo de Funcionamento

### Passo 1 — Entrada na DAO
- Seller deposita stake mínimo (ex: **10 USDC**) em um programa Anchor na Solana
- Recebe **tokens de governança** proporcionais ao volume de vendas dos últimos 30 dias
- Teto de concentração implementado para evitar dominância de um único seller

### Passo 2 — Alimentação do Treasury
- A cada venda processada, **1–2% vai automaticamente para o treasury** via smart contract
- Sem intervenção manual — programa Solana distribui no momento do pagamento
- Treasury visível publicamente no Solana Explorer

### Passo 3 — Proposta e Votação On-Chain
- Qualquer membro propõe uso do treasury (contratar transportadora, campanha com influencer, mídia em bloco etc.)
- Proposta aberta por **72 horas**
- Membros votam com tokens de governança
- Aprovação: maioria simples (ou supermaioria para gastos grandes)

### Passo 4 — Execução e Distribuição
- Proposta aprovada: treasury paga fornecedor diretamente via instrução Solana
- Benefício distribuído entre membros **proporcionalmente ao volume de vendas do período**
- Automático, sem intermediário humano

---

## 5. Stack Técnica

### On-chain (Programa Anchor)
- **Linguagem:** Rust + Anchor Framework
- **4 instruções principais:**
  - `join_dao` — stake + mint de governance token
  - `propose` — criar proposta com alvo de gasto
  - `vote` — registrar voto
  - `execute` — liberar treasury se aprovado
- **Primitivas:** PDAs (Program Derived Addresses), SPL Token
- **Estimativa:** ~200 linhas de código real

### Frontend
- **React** + `@solana/web3.js`
- Wallet connect via **Phantom**
- Dashboard com: treasury atual em USDC, propostas ativas com contagem de votos em tempo real, histórico de execuções

### Demo (Hackathon)
- 5–10 sellers pré-carregados com wallets de teste na **Devnet**
- Proposta real sendo votada ao vivo durante a apresentação
- Treasury visível no **Solana Explorer** (argumento mais forte: verificável em 3 segundos)

---

## 6. Impacto Projetado (100 Sellers Médios)

- **R$ 12/pacote** de economia de frete
- **40%** de redução de CPM em mídia paga
- **R$ 8.000/mês** estimado de treasury coletivo
- **0** intermediários humanos no processo

---

## 7. O Que Faz Esta Ideia Ser Forte

1. **Narrativa única:** não é "blockchain pra pagar" — é **poder coletivo programável**
2. **Técnica mínima e limpa:** apenas 4 instruções no programa Anchor + 1 treasury PDA — sem oráculo externo, sem bridge entre chains. Solana puro.
3. **Problema real verificável:** founders com experiência direta no universo de sellers de marketplace (DNT, fitness apparel)
4. **Demo convincente:** treasury visível on-chain é argumento que qualquer juiz entende sem conhecer Solana

---

## 8. Risco Principal

**Bootstrap:** DAO sem membros → sem treasury → sem poder de barganha → sem motivo para entrar.

**Mitigação para o hackathon:** apresentar grupo piloto simulado — 10 sellers fictícios com volume real inserido, proposta de frete ativa, treasury visível no explorer. O demo precisa fazer o juiz sentir que a coisa já existe.

---

## 9. Compatibilidade com Prêmio Chainlink (US$ 500 adicional)

O projeto pode qualificar para o **Prêmio Chainlink CRE** integrando um workflow que:
- Conecte a Solana a uma API externa (ex: API de cotação de frete das transportadoras)
- Valide volume de vendas dos sellers via fonte de dados off-chain
- Orquestre lógica de distribuição de benefícios com dados verificados

**Requisito:** usar CRE SDK (Go ou TypeScript) para build + simular via CRE CLI.

Referências:
- Docs: https://docs.chain.link/cre
- Bootcamp PT-BR: https://smartcontractkit.github.io/cre-bootcamp-2026/pt
- Templates: https://github.com/smartcontractkit/cre-templates/

---

## 10. Critérios de Avaliação do Hackathon

- Clareza do problema e da solução
- Aplicabilidade no mundo real
- Qualidade técnica e uso da Solana
- Potencial de escala e continuidade
- Experiência do usuário

---

## 11. Glossário Rápido

| Termo | Definição no contexto |
|---|---|
| DAO | Organização Autônoma Descentralizada — governança por smart contract |
| Treasury | Fundo coletivo gerenciado pelo programa Solana (conta PDA) |
| Governance Token | Token SPL que dá direito de voto proporcional ao volume de vendas |
| Stake | Depósito mínimo para entrar na DAO (10 USDC) |
| PDA | Program Derived Address — conta controlada pelo programa, não por wallet privada |
| Anchor | Framework Rust para desenvolvimento de programas Solana |
| Devnet | Rede de testes da Solana (sem dinheiro real) |
| CPM | Custo Por Mil impressões em mídia paga |
| CRE | Chainlink Runtime Environment — camada de orquestração on/off-chain |