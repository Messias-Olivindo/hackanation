# Documentação da Solução - SellerDAO - Hackanation 2026 (3rd edition)

## Integrantes do time

- [Igor Rodrigues](https://www.linkedin.com/in/igor-dasilva-rodrigues/)
- [João Victor Penin Caldeira](https://www.linkedin.com/in/jvpenin/)
- [Messias Olivindo](https://www.linkedin.com/in/messias-olivindo/)

## Sumário

1. [Visão Geral](#1-visão-geral)
   - 1.1. [Problemática](#11-problemática)
   - 1.2. [Solução Proposta](#12-solução-proposta)
2. [Value Proposition Canvas](#2-value-proposition-canvas)
3. [Análises de Mercado](#3-análises-de-mercado)
4. [Matriz de Risco](#4-matriz-de-risco)
5. [Produto & Experiência](#5-produto--experiência)
   - 5.1. [Personas](#51-personas)
   - 5.2. [Interface e Front-end](#52-interface-e-front-end)
6. [Arquitetura Técnica](#6-arquitetura-técnica)
   - 6.1. [Visão Geral da Arquitetura](#61-visão-geral-da-arquitetura)
   - 6.2. [Stack Tecnológico](#62-stack-tecnológico)
   - 6.3. [Lógica dos Smart Contracts (Anchor)](#63-lógica-dos-smart-contracts-anchor)
   - 6.4. [Fluxo de Pagamento Off-chain & Abstração de UX](#64-fluxo-de-pagamento-off-chain--abstração-de-ux)
7. [Conclusão](#7-conclusão)

---

# 1. Visão Geral

## 1.1. Problemática

O seller pequeno de marketplace não perde para o concorrente por falta de produto ou incapacidade, mas sim por custo de estrutura. Um seller que fatura R$ 30k/mês compra estoque pelo preço de balcão, anuncia no leilão de mídia mais caro, toma crédito a 4% ao mês e contrata creators pequenos com pouco alcance porque é o que cabe no orçamento. Em contrapartida, um seller que fatura R$ 3M/mês faz as mesmas quatro coisas com custo estruturalmente menor.

A diferença nunca foi mérito, mas sim **escala**. O estoque mais barato vem de pedido mínimo que o microempreendedor não atinge sozinho. O CPM (Custo por Mil Impressões) menor vem de uma verba que justifica uma mesa de negociação. O crédito mais barato vem de um histórico bancário robusto que leva anos para construir. O creator com audiência real cobra cachês que não fazem sentido para o caixa de uma loja de pequeno porte.

Até hoje, essa escala só existia para quem já era grande. E quando sellers tentam cooperar informalmente para compras coletivas ou fundos compartilhados, a iniciativa quebra em um gargalo clássico: **quem guarda o dinheiro?** Sem uma infraestrutura de governança transparente e imutável, o risco de fraudes ou disputas interpessoais inviabiliza a união de pequenos empreendedores.

## 1.2. Solução Proposta

A **SellerDAO** é uma infraestrutura financeira coletiva para sellers de marketplace (Mercado Livre, Shopee, TikTok Shop etc.), construída inteiramente na rede blockchain Solana. 

Ao automatizar a entrada via stake, a governança e a distribuição de recursos on-chain, permitimos que pequenos vendedores formem um pool de recursos e tomem decisões transparentes sem depender da confiança em terceiros. O smart contract age como custodiante neutro dos fundos.

### 1.2.1. Como funciona na prática

```
 Marketplace API
       ↓ (OAuth / Verificação de Vendas)
 Backend SellerDAO (Simulado no MVP)
       ↓
 Calcula contribuição (Ex: 1% do faturamento)
       ↓
 Depósito no Treasury Solana via USDC (Programa Anchor)
       ↓
 Votação On-Chain (Membros propõem e votam)
       ↓
 Proposta Aprovada → Execução Automática (Treasury envia USDC para o receptor)
```

Qualquer membro pode criar propostas (ex: "Compra Coletiva de 1000kg de insumo com Fornecedor X"). O treasury financia o pagamento assim que a votação de 72 horas é aprovada, e o benefício é rateado proporcionalmente.

### 1.2.2. O que a blockchain resolve

- **Transparência Absoluta:** O saldo e todas as transações são auditáveis em tempo real via Solana Explorer, eliminando planilhas obscuras.
- **Segurança de Fundos (Trustless):** O dinheiro do treasury é controlado por uma PDA (Program Derived Address) vinculada ao smart contract. Nenhuma pessoa física tem a chave privada de controle.
- **Governança Ponderada:** O peso do voto é proporcional às suas contribuições de governança on-chain, protegendo o sistema contra ataques de criação de múltiplas carteiras (Sybil attacks) por meio de um teto de concentração.

---

# 2. Value Proposition Canvas

O Value Proposition Canvas ajuda a alinhar nosso produto com as necessidades exatas dos sellers:

### **Perfil do Cliente (Sellers de Marketplace)**
- **Customer Jobs (Tarefas do Cliente):**
  - Adquirir estoque com margem saudável.
  - Divulgar produtos para conversão imediata.
  - Conseguir capital de giro rápido.
  - Enviar encomendas no menor custo possível.
- **Pains (Dores):**
  - Margens espremidas devido a custos de fornecedor unitários elevados.
  - Juros abusivos (4% a.m.) para antecipação de recebíveis.
  - Perda de leilão de anúncios (ML Ads) para concorrentes gigantes.
  - Frete caro fora dos canais oficiais do marketplace.
- **Gains (Ganhos Desejados):**
  - Margem competitiva similar à de grandes redes varejistas.
  - Acesso a creators profissionais com alta conversão.
  - Taxas de financiamento internas acessíveis (~1.5% a.m.).

### **Proposta de Valor (SellerDAO)**
- **Products & Services (Produtos e Serviços):**
  - Plataforma de governança coletiva on-chain integrada a carteiras Web3.
  - Smart contracts robustos em Anchor Solana para custódia de fundos.
  - Dashboard para visualização de propostas e tesouraria.
- **Pain Relievers (Aliviadores de Dor):**
  - Smart contract elimina a necessidade de confiar em um líder humano para guardar fundos.
  - Compras coletivas organizadas que reduzem custos de estoque em até 30-40%.
  - Custos de frete reduzidos via negociação coletiva com transportadoras integradas off-chain.
- **Gain Creators (Criadores de Ganho):**
  - Distribuição justa e proporcional de benefícios on-chain.
  - Creator pools que viabilizam lives de alta conversão sem expor um único seller a riscos de caixa altos.

---

# 3. Análises de Mercado

## 3.1. Tamanho de Mercado (TAM, SAM, SOM)

- **TAM (Total Addressable Market):** Mercado global de e-commerce e varejo de marketplace, estimado em mais de USD 4 trilhões.
- **SAM (Serviceable Addressable Market):** Sellers ativos no mercado de e-commerce brasileiro (Mercado Livre, Shopee, TikTok Shop), movimentando mais de 1,7 milhão de vendedores ativos com vendas anuais ultrapassando R$ 180 bilhões.
- **SOM (Serviceable Obtainable Market):** Pequenos e médios sellers organizados em nichos específicos (moda, eletrônicos, casa e decoração) que já cooperam informalmente em grupos de WhatsApp/Telegram, representando inicialmente 10.000 a 50.000 sellers de alta fidelidade.

## 3.2. Posicionamento de Mercado e Concorrência

A SellerDAO se posiciona em uma zona híbrida e altamente disruptiva:

| Característica | Cooperativas Tradicionais | SPL Governance / Realms | Squads Protocol | SellerDAO |
|---|---|---|---|---|
| **Velocidade** | Muito lenta (burocracia) | Média (exige conhecimento) | Rápida (focada em multisig) | Instantânea (Solana) |
| **UX Tradicional** | Familiar (Banco/Pix) | Péssimo para leigos | Focado em desenvolvedores | Abstraído (carteira MPC / Pix) |
| **Custódia** | Bancária (Risco humano) | Smart Contract genérico | Multisig multifuncional | Smart Contract customizado |
| **Público Alvo** | Agricultores / Cooperados | Comunidades Web3 | Times de Devs Web3 | Vendedores de Marketplace |

---

# 4. Matriz de Risco

| Risco | Impacto | Probabilidade | Mitigação Técnica / Comercial |
|---|---|---|---|
| **Bootstrap da DAO** (falta de membros iniciais) | Alto | Média | Utilização de um grupo piloto simulado no MVP com 10 sellers reais pré-configurados e fundos devnet para validação imediata da banca. |
| **Falta de carteira Web3 por parte do seller** | Alto | Alta | Integração de Embedded Wallets (Privy, Web3Auth) usando login social. O usuário não precisa guardar seed phrase para interagir. |
| **Flutuação de Preço e Volatilidade (Solana/USDC)** | Médio | Baixa | Foco absoluto no uso de stablecoins (USDC) como unidade primária de valor na tesouraria e staking. |
| **Complexidade Regulatória (Criptoativos no Brasil)** | Alto | Média | A SellerDAO opera off-chain sob o modelo de cooperativa ou LTDA de serviços, assumindo a responsabilidade KYC/AML e a custódia perante fintechs parceiras. |

---

# 5. Produto & Experiência

## 5.1. Personas

### **Persona 1: Ana (Serrana Moda Fitness)**
* **Perfil:** Microempreendedora, 32 anos, vende leggings no Mercado Livre e Shopee. Faturamento: R$ 35k/mês.
* **Problema:** Seu maior custo é o tecido de poliamida. Ela compra de 50m em 50m a R$ 25/metro. Um grande concorrente compra rolos de 2000m a R$ 14/metro.
* **Uso na DAO:** Ana entra na DAO com o stake mínimo, vota a favor da compra coletiva de insumos da categoria Moda, e adquire tecido na mesma margem dos gigantes de varejo.

### **Persona 2: Marcos (TechImport Br)**
* **Perfil:** Importador de eletrônicos domésticos, 28 anos, vende no TikTok Shop e Instagram. Faturamento: R$ 120k/mês.
* **Problema:** Precisa contratar criadores de conteúdo para lives e vídeos review no TikTok Shop, mas os creators de médio porte cobram cachê adiantado de R$ 5.000.
* **Uso na DAO:** Marcos participa do Creator Pool. A DAO contrata uma live de R$ 5.000 dividida entre 5 sellers. O smart contract de governança e pagamento garante a divisão segura do caixa.

## 5.2. Interface e Front-end

A interface foi projetada usando **Next.js**, **TailwindCSS**, e `@solana/wallet-adapter-react`.
- **Dashboard Principal:** Apresenta o saldo acumulado da tesouraria do pool em USDC em tempo real on-chain.
- **Painel de Propostas:** Lista as propostas divididas por categorias (Estoque, Creators, Mídia, Crédito), exibindo percentual de votos a favor/contra e tempo restante (janela de votação de 72h).
- **Onboarding UX:** Passos limpos e amigáveis para simular faturamento, conectar carteira Phantom ou social login e participar do pool realizando stake instantâneo.

---

# 6. Arquitetura Técnica

## 6.1. Visão Geral da Arquitetura

O sistema é dividido em três camadas robustas de tecnologia Web3:

```
[ FRONTEND React / Next.js ]
        │ (Chamadas RPC / Web3.js / Anchor Client)
        ▼
[ ON-CHAIN Rust / Anchor Program ] ───▶ [ Solana Blockchain ]
   ├── lib.rs (Instruções MVP)
   ├── state (PDAs de Estado: DAO, Member, Proposal, VoteRecord)
   └── instructions (Lógica de Negócio e CPIs de Token)
        │
        ▼ (CPI - Cross Program Invocation)
[ SPL Token Program ]
        │ (Transferência de USDC Staking/Treasury)
        ▼
[ Treasury Token Account (PDA signer) ]
```

## 6.2. Stack Tecnológico

- **On-chain:**
  - Rust + Anchor Framework (v0.29.0)
  - SPL Token (Token Program) para transferências seguras
- **Off-chain / Frontend:**
  - Next.js (TypeScript)
  - TailwindCSS para estilização minimalista premium
  - `@solana/web3.js` & `@coral-xyz/anchor` para integração de RPC
  - Zustand para gerenciamento de estado global off-chain

## 6.3. Lógica dos Smart Contracts (Anchor)

O programa **SellerDAO** implementa 4 instruções cruciais estruturadas para escala segura:

1. **`join_dao`**: Inicializa os dados globais da DAO (via `init_if_needed`) e cria a conta individual do membro (`Member`). Transfere a quantia de stake selecionada (`stake_amount`) da conta de token do usuário para o treasury da DAO (uma conta associada à PDA de autoridade do treasury). O membro recebe peso de governança proporcional ao depósito.
2. **`propose`**: Cria a proposta (`Proposal`) usando o contador sequencial da DAO como seed para a PDA. Recebe descrição, o valor de destino (`target_amount` > 0) e a carteira associada do receptor. Abre uma janela de votação baseada no timestamp da rede Solana.
3. **`vote`**: Registra votos a favor/contra. A proteção contra gasto duplo de voto (anti-duplicação) é implementada criando a PDA `VoteRecord` com seeds `[b"vote", proposal_key, member_key]`. Se um membro tentar votar novamente, o Anchor aborta a transação com um erro de conta já inicializada.
4. **`execute`**: Finaliza o ciclo. Valida se a janela de 72h expirou, valida a aprovação por maioria simples, e executa uma Cross-Program Invocation (CPI) de transferência de tokens a partir da conta do treasury assinada pela PDA do treasury (`treasury_authority` usando seeds `[b"treasury"]`).

### Sizing e Espaço de Contas (PDA safety)

Para evitar erros de alocação de memória no runtime da Solana, todas as contas têm tamanhos calculados com margem de segurança estrita:
- **`Dao`**: `8 + 8 + 32 + 1 + 1 + 8` bytes.
- **`Member`**: `8 + 32 + 8 + 8 + 8 + 1` bytes.
- **`Proposal`**: `8 + 8 + 32 + 284 + 8 + 32 + 8 + 8 + 8 + 1 + 1` bytes (espaço fixado para suporte a strings de até 280 caracteres).
- **`VoteRecord`**: `8 + 32 + 32 + 1 + 1` bytes.

Usamos `Box<Account>` na instrução `JoinDao` para desviar dados do stack frame limitado do BPF (4096 bytes) para o heap dinâmico, evitando erros de estouro de stack durante o processamento das transações.

## 6.4. Fluxo de Pagamento Off-chain & Abstração de UX

Para que os fornecedores tradicionais não sofram fricção, o sistema conta com uma infraestrutura de suporte híbrida:

1. **Embedded Wallets (Auto-custódia Simples):** O login social (Google, Apple, E-mail) gera uma carteira on-chain gerenciada por um módulo de computação multipartidária (MPC) do Privy ou Web3Auth.
2. **On-ramp (Entrada):** Simulação ou integração com chaves seguras MoonPay para processamento de Pix -> USDC na Solana.
3. **Off-ramp (Saída Trustless):** Quando o smart contract de governança da SellerDAO aprova a execução de um pagamento de estoque, os fundos USDC saem da conta de token controlada pela PDA do treasury e são enviados para uma wallet custodial gerada para o fornecedor. A API da fintech convertora (ex: BRLA Digital / Transfero) liquida os tokens e dispara instantaneamente um Pix em reais para o CNPJ bancário tradicional do destinatário.

---

# 7. Conclusão

A **SellerDAO** transforma a governança comunitária em poder real de mercado para sellers de e-commerce. Ao substituir intermediários por smart contracts transparentes na Solana, eliminamos o risco de fraude, reduzimos as margens estruturais dos microempreendedores e criamos um ecossistema cooperativo escalável e trustless. É a Web3 aplicada à economia real produtiva do varejo digital brasileiro.
