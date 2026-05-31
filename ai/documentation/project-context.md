# SellerDAO — Contexto Completo do Projeto

> **Use este arquivo como contexto inicial em qualquer IA ou ferramenta de desenvolvimento.**

---

## 1. Origem

Projeto desenvolvido para submissão no **Hackathon Solana Brasil 2026**, trilha **"Real World Web3 Applications"**, categoria **Payments, RWAs & Tokenização**.

---

## 2. O Problema

Sellers de marketplace (Mercado Livre, Shopee, TikTok Shop) operam de forma isolada e perdem poder de barganha nos espaços onde o marketplace não interfere:

| Situação                         | Seller Isolado                                                   | Sellers na DAO                                            |
| -------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Compra de estoque                | Preço de atacado ruim, baixo volume                              | Desconto real por compra coletiva (30–40%)                |
| Creator pool (lives TikTok Shop) | Sem acesso a creators grandes, sem divisão automática de receita | Revenue share automático entre sellers via smart contract |
| Mídia paga                       | CPM alto, disputa com grandes varejistas                         | CPM menor via compra em bloco (até 40% de redução)        |
| Capital de giro                  | Travado 30–60 dias, antecipação a 4% a.m.                        | Empréstimo coletivo interno a ~1,5% a.m.                  |
| Dados de mercado                 | Isolados, sem benchmark                                          | Agregados em tempo real                                   |
| Frete (canais próprios)          | R$ 28/pacote pelo balcão                                         | R$ 14–16/pacote via contrato coletivo com transportadora  |

### 2.1 O que cada marketplace bloqueia — e onde a DAO age

A DAO **não briga com o marketplace**. A estratégia é agir nos espaços que o marketplace não controla.

| Plataforma    | Bloqueado pelo marketplace                                            | Livre para a DAO atuar                                                    |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Mercado Livre | Frete (Mercado Envios fixo), taxa da plataforma, algoritmo de ranking | Estoque e fornecedor, anúncio externo (tráfego), capital de giro          |
| Shopee        | Frete subsidiado pela Shopee, Moedas Shopee                           | Fornecedor/atacado, lives e afiliados externos, antecipação de recebíveis |
| TikTok Shop   | Comissão de afiliado (fixa), algoritmo de feed                        | Contratação de creators, produção de conteúdo, estoque pré-posicionado    |

---

## 3. A Solução — SellerDAO

Uma DAO (Organização Autônoma Descentralizada) **na Solana** que agrupa sellers de marketplace para exercer poder coletivo programável nos espaços onde o marketplace não chega.

**Narrativa central:** O seller pequeno sozinho nunca vai negociar com a Jadlog. 100 sellers com R$ 8k de treasury e voto on-chain, sim.

### 3.1 Casos de uso por plataforma

**Todos os marketplaces**

- **Compra coletiva de estoque no atacado:** sellers identificam fornecedor com desconto por volume (ex: 35% a partir de 500kg). A DAO vota, o treasury paga, o estoque é rateado proporcionalmente. Economia: 30–40% no custo do produto.

**Mercado Livre**

- **Fundo coletivo de anúncio externo:** ML Ads interno é leilão — seller pequeno perde pro grande. Tráfego externo (Google Shopping, Meta Ads) apontando pro anúncio do ML é livre. A DAO contrata campanha coletiva por categoria (ex: "legging fitness") e distribui cliques entre membros por volume.

**TikTok Shop**

- **Creator pool:** creator com 500k seguidores cobra R$ 4.000 por live. A DAO contrata a live coletivamente — 10 sellers, cada um exibe 3 produtos, paga R$ 400. Revenue share distribuído automaticamente via smart contract conforme vendas geradas por produto.

**Shopee**

- **Antecipação coletiva de recebíveis:** seller com R$ 12.000 parcelado em 6x pode tomar empréstimo do treasury coletivo a ~1,5% a.m. (vs 4% a.m. de fintechs). Reembolso descontado automaticamente das próximas contribuições. Stake do seller como colateral em caso de inadimplência.

**Canais próprios (Instagram, site, WhatsApp)**

- **Frete próprio fora do marketplace:** volume coletivo para negociar contrato direto com Jadlog, Sequoia ou transportadora regional. Etiquetas geradas via API da transportadora, crédito descontado do saldo no treasury. Frete de R$ 28 → R$ 14–16.

### 3.2 Casos de uso prioritários para o hackathon

- **Compra coletiva de estoque (caso mais fácil de demonstrar):** fluxo completo e físico. Sellers entram, treasury acumula, votação acontece, pagamento sai, estoque chega. Sem depender de API externa ou integração de terceiros. O caso mais limpo para construir em 2 dias.
- **Creator pool do TikTok Shop (caso mais impactante para a banca):** demo de uma live com receita dividida automaticamente entre 10 sellers via smart contract. Revenue share coletivo ainda não resolvido no mercado.

---

## 4. Fluxo de Funcionamento

### Passo 1 — Entrada na DAO

- Seller deposita stake mínimo (**10 USDC**) em programa Anchor na Solana
- Recebe **tokens de governança** proporcionais ao volume de vendas dos últimos 30 dias
- Teto de concentração para evitar dominância de um único seller
- Parte do stake vai para o treasury coletivo, parte para os criadores como taxa de onboarding

### Passo 2 — Alimentação do Treasury

- A cada venda processada, **1–2% vai automaticamente para o treasury** via smart contract
- Sem intervenção manual — programa Solana distribui no momento do pagamento
- Treasury visível publicamente no Solana Explorer

### Passo 3 — Proposta e Votação On-Chain

- Qualquer membro propõe uso do treasury (compra coletiva, creator pool, mídia em bloco, empréstimo etc.)
- Proposta aberta por **72 horas**
- Membros votam com tokens de governança
- Aprovação: maioria simples (ou supermaioria para gastos grandes)

### Passo 4 — Execução Trustless via Squads Multisig

- Proposta aprovada: **Squads Protocol** coleta M-de-N assinaturas dos membros
- Threshold atingido → contrato executa automaticamente, sem nenhuma pessoa com a chave do treasury
- Treasury envia USDC para wallet do fornecedor (custodial ou nativa)
- Benefício distribuído entre membros **proporcionalmente ao volume de vendas do período**
- Todo o fluxo auditável publicamente no Solana Explorer

---

## 5. Arquitetura Trustless de Pagamento

### 5.1 O problema do pagamento off-chain

Pagar fornecedores do mundo real (Jadlog, atacadistas, creators) exige que alguém "aperte enviar". Essa pessoa se torna um ponto de falha e quebra o princípio trustless da DAO.

**Solução na Solana:** Squads Protocol + abstração custodial para fornecedores sem wallet.

### 5.2 Squads Protocol (multisig nativo Solana)

- Programa auditado, em produção no ecossistema Solana
- O treasury pertence a um endereço multisig do Squads — nenhuma pessoa tem a chave privada
- Pagamento só executa quando M-de-N membros assinam (ex: 5 de 9)
- Execução automática ao atingir threshold — sem intervenção humana
- Fluxo: DAO vota na proposta → Squads coleta assinaturas → threshold atingido → USDC vai direto ao fornecedor

### 5.3 Abstração custodial para fornecedores sem wallet Solana

Fornecedores (Jadlog, atacadistas, creators) **não precisam saber que existe blockchain**.

**Fluxo completo:**

1. DAO aprova pagamento para o fornecedor (ex: R$ 3.200 para Jadlog)
2. Sistema cria wallet Solana **custodial** vinculada ao CNPJ/CPF do fornecedor (ou usa wallet já registrada)
3. Treasury envia USDC para essa wallet — 100% on-chain, 100% auditável
4. Integração com fintech (ex: **Brla Digital** ou **Transfero**) converte USDC → BRL e faz Pix/TED para conta bancária do fornecedor
5. Fornecedor recebe como uma TED normal — nunca soube que veio de blockchain

**Legislação:** A entidade operadora da SellerDAO (LTDA ou cooperativa registrada no Brasil) detém as wallets custodiais dos fornecedores e é responsável pelo KYC/AML. O fornecedor cadastra CNPJ e dados bancários — igual a qualquer plataforma de pagamento. Mesmo modelo da Brla Digital, Mercado Pago e demais fintechs brasileiras.

---

## 6. Stack Técnica

### On-chain (Programa Anchor)

- **Linguagem:** Rust + Anchor Framework
- **4 instruções principais:**
  - `join_dao` — stake + mint de governance token
  - `propose` — criar proposta com alvo de gasto e endereço de destino
  - `vote` — registrar voto com peso proporcional ao governance token
  - `execute` — liberar treasury se threshold atingido (integrado ao Squads multisig)
- **Primitivas:** PDAs (Program Derived Addresses), SPL Token
- **Multisig:** Squads Protocol para execução trustless
- **Estimativa:** ~200 linhas de código real

### Off-chain / Integrações

- **On/off ramp BRL:** Brla Digital ou Transfero (USDC → BRL via Pix)
- **Wallets custodiais:** geradas pelo sistema, vinculadas a CNPJ/CPF do fornecedor
- **KYC/AML:** responsabilidade da entidade operadora (LTDA ou cooperativa)

### Frontend

- **Next.js** + TypeScript
- **UI:** TailwindCSS + biblioteca de componentes para UI minimalista e focada em dados
- **Web3:** `@solana/web3.js` + `@solana/wallet-adapter-react` (Phantom)
- Dashboard com: treasury atual em USDC, propostas ativas com contagem de votos em tempo real, histórico de execuções, membros ativos

**Setup esperado do Tailwind (MVP):**

- `tailwindcss`, `postcss`, `autoprefixer` instalados
- `tailwind.config` com `content` apontando para `app/`, `pages/`, `src/`
- `postcss.config` com `tailwindcss` e `autoprefixer`
- `globals.css` com `@tailwind base; @tailwind components; @tailwind utilities;`

### Integracao de pagamento (on-ramp)

- **Status:** validar apenas MoonPay para PIX -> USDC na Solana e SmartPay para USDC -> PIX.
- **MoonPay (docs):** ramps e virtual accounts com APIs/SDKs e KYC/KYB integrados. Nao ha confirmacao publica de PIX -> USDC nem de SmartPay.
- **MVP hackathon:** apenas simulacao do fluxo no cliente, sem chaves privadas nem dados sensiveis

### Backend (visao de futuro, fora do MVP)

- **NestJS** + **PostgreSQL** + **Prisma** para ingestao de dados off-chain
- **Fila de eventos (ex.: Redis/BullMQ)** para processar volumes de vendas e reconciliacao
- **KYC/AML** e integracao segura com provedores de on/off-ramp

### Referencias (pagamento e on-ramp)

- https://www.moonpay.com/business
- https://www.moonpay.com/business/ramps
- https://www.moonpay.com/business/virtual-accounts
- https://dev.moonpay.com/

### Demo (Hackathon)

- 5–10 sellers pré-carregados com wallets de teste na **Devnet**
- Proposta real de **compra coletiva de estoque** sendo votada ao vivo durante a apresentação
- Treasury visível no **Solana Explorer** (verificável em 3 segundos — argumento mais forte perante a banca)

---

## 7. Modelo de Monetização

| Fonte                                 | Mecanismo                                                                                    | Escala                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Fee por transação** (principal)     | 0,3–0,5% hardcoded no contrato em cada pagamento que sai do treasury                         | Linear com volume — R$ 200/mês com 100 sellers, R$ 2.000/mês com 1.000 |
| **Taxa de entrada**                   | Parte do stake de 10 USDC vai para os criadores como onboarding fee                          | Cresce com número de sellers                                           |
| **SellerDAO Pro** (SaaS)              | Licença mensal para grupos que querem DAO fechada de nicho (ex: só sellers de fitness de SP) | White-label da infraestrutura                                          |
| **Token de governança** (longo prazo) | Criadores detêm parcela dos tokens emitidos na gênese com vesting                            | Valor atrelado ao crescimento da rede                                  |

**Diferencial do fee:** está hardcoded no contrato — ninguém pode remover. Automático, sem negociação, sem inadimplência.

---

## 8. Impacto Projetado (100 Sellers Médios)

- **30–40%** de desconto médio em estoque por compra coletiva
- **40%** de redução de CPM em mídia paga
- **R$ 12/pacote** de economia em frete (canais próprios)
- **R$ 8.000/mês** estimado de treasury coletivo
- **0** intermediários humanos no processo de pagamento

---

## 9. O Que Faz Esta Ideia Ser Forte

1. **Narrativa única:** não é "blockchain pra pagar" — é **poder coletivo programável** para quem sempre competiu sozinho
2. **Técnica mínima e limpa:** 4 instruções no programa Anchor + 1 treasury PDA + Squads multisig — sem oráculo externo, sem bridge entre chains. Solana puro.
3. **Problema real verificável:** founders com experiência direta no universo de sellers de marketplace
4. **Trustless de ponta a ponta:** nenhuma etapa — proposta, votação, execução, recebimento — passa pela mão de um único ser humano
5. **Fornecedor nunca precisa saber de blockchain:** abstração custodial + Pix preserva a experiência familiar do outro lado
6. **Demo convincente:** treasury visível on-chain, argumento que qualquer juiz entende sem conhecer Solana

---

## 10. Riscos do Projeto

| Risco                                        | Tipo        | Mitigação                                                                                                                   |
| -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| Bootstrap — DAO sem membros não tem treasury | Negócio     | Demo com grupo piloto simulado: 10 sellers fictícios com volume real inserido, proposta ativa, treasury visível no explorer |
| Fornecedor sem wallet Solana                 | Técnico/UX  | Abstração custodial — sistema cria e gerencia a wallet, fornecedor só vê Pix                                                |
| Regulação de custódia de cripto no Brasil    | Regulatório | Entidade operadora registrada assume responsabilidade KYC/AML, mesmo modelo de fintechs existentes                          |
| Dependência de fintech para off-ramp         | Técnico     | Brla Digital e Transfero já operacionais no Brasil; fallback possível com múltiplos provedores                              |
| Concentração de poder de voto                | Técnico     | Teto de concentração implementado no contrato — limite máximo de tokens por wallet                                          |

---

## 11. Pitch — Estrutura dos 2 Minutos

| Bloco                | Tempo     | Conteúdo                                                                                                                                                                                                                     |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gancho               | 0:00–0:15 | "Quanto custa pra você enviar um pacote hoje? Agora imagina pagar quase metade disso — só porque você chegou junto com outros 99 sellers. Isso é possível. O problema é: quem guarda o dinheiro coletivo sem trair o grupo?" |
| Dor                  | 0:15–0:35 | "No Brasil, um seller pequeno paga R$ 28 por entrega. Uma grande varejista paga R$ 14 — no mesmo caminhão. A diferença não é eficiência, é poder de barganha."                                                               |
| Solução              | 0:35–1:05 | Apresentar SellerDAO — treasury coletivo, votação on-chain, execução automática via Squads, fornecedor recebe no Pix                                                                                                         |
| Demo ao vivo         | 1:05–1:35 | Treasury visível no Solana Explorer, proposta sendo votada, execução automática                                                                                                                                              |
| Visão + encerramento | 1:35–2:00 | "1,7 milhão de sellers ativos em marketplace no Brasil. A SellerDAO dá poder coletivo programável pra quem sempre competiu sozinho. Poder que não depende de confiança — depende de código."                                 |

---

## 12. Critérios de Avaliação do Hackathon

- Clareza do problema e da solução
- Aplicabilidade no mundo real
- Qualidade técnica e uso da Solana
- Potencial de escala e continuidade
- Experiência do usuário

---

## 13. Glossário

| Termo            | Definição no contexto                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| DAO              | Organização Autônoma Descentralizada — governança por smart contract                |
| Treasury         | Fundo coletivo gerenciado pelo programa Solana (conta PDA)                          |
| Governance Token | Token SPL que dá direito de voto proporcional ao volume de vendas                   |
| Stake            | Depósito mínimo para entrar na DAO (10 USDC)                                        |
| PDA              | Program Derived Address — conta controlada pelo programa, não por wallet privada    |
| Anchor           | Framework Rust para desenvolvimento de programas Solana                             |
| Squads Protocol  | Programa de multisig nativo Solana — execução trustless sem trusted party           |
| Custodial Wallet | Wallet Solana criada e gerenciada pelo sistema em nome do fornecedor                |
| Off-ramp         | Conversão de USDC para BRL via fintech (Brla Digital / Transfero) + Pix             |
| Brla Digital     | Fintech brasileira que converte USDC para BRL via Pix na Solana                     |
| Devnet           | Rede de testes da Solana (sem dinheiro real)                                        |
| CPM              | Custo Por Mil impressões em mídia paga                                              |
| KYC/AML          | Know Your Customer / Anti-Money Laundering — obrigação regulatória de identificação |
