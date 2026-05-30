# SellerDAO 🛒⚡

**DAO de sellers de marketplace construída na Solana para compra coletiva de estoque, creator pools e mídia em bloco.**

---

## O Problema

Sellers de marketplace (Mercado Livre, Shopee etc.) operam isolados e perdem poder de barganha
nos espacos onde o marketplace nao interfere:

- **Estoque:** compram pequeno e pagam mais caro no atacado
- **Creator pool:** nao conseguem dividir receita de live coletiva
- **Midia:** disputam CPM alto com empresas com budget 100x maior
- **Dados:** sem benchmark de mercado para tomar decisoes

## A Solução

Uma DAO on-chain na Solana que agrupa sellers para agir onde o marketplace nao bloqueia:

```
Seller entra → deposita stake (10 USDC) → recebe governance tokens
     ↓
 1–2% de cada venda → treasury compartilhado (PDA controlado pelo programa)
     ↓
 Membro propoe uso (estoque, creator pool, midia) → votacao 72h on-chain
     ↓
 Aprovado → treasury paga fornecedor → benefício distribuído por volume de vendas
```

**Sem intermediário humano. Tudo verificável no Solana Explorer.**

---

## Impacto Projetado (100 sellers médios)

| Métrica | Resultado |
|---|---|
| Desconto medio em estoque | 8-15% |
| Redução de CPM | 40% |
| Treasury mensal estimado | R$ 8.000 |
| Intermediários humanos | 0 |

---

## Stack Técnica

### On-chain — Programa Anchor (Rust)

```
programs/
  seller-dao/
    src/
      lib.rs          # Entry point + 4 instruções principais
      instructions/
        join_dao.rs   # stake + mint de governance token
        propose.rs    # criar proposta com alvo de gasto
        vote.rs       # registrar voto com governance token
        execute.rs    # liberar treasury se proposta aprovada
      state/
        dao.rs        # estado global da DAO
        member.rs     # estado por membro (volume, tokens)
        proposal.rs   # estado de cada proposta
```

**Primitivas Solana utilizadas:**
- PDAs (Program Derived Addresses) para treasury e contas de estado
- SPL Token para governance tokens
- System Program para transferências de USDC

### Frontend — React

```
app/
  src/
    components/
      Treasury.tsx     # saldo atual do treasury
      ProposalList.tsx # propostas ativas + contagem de votos
      VotePanel.tsx    # interface de votação
      History.tsx      # histórico de execuções
    hooks/
      useDAO.ts        # hook principal @solana/web3.js
      useWallet.ts     # Phantom wallet connect
```

---

## Instalação e Desenvolvimento

### Pré-requisitos

```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest && avm use latest

# Node.js 18+
node --version
```

### Setup

```bash
git clone https://github.com/seu-usuario/seller-dao
cd seller-dao

# Instalar dependências do programa
cd programs/seller-dao && cargo build

# Instalar dependências do frontend
cd ../../app && npm install
```

### Deploy na Devnet

```bash
# Configurar para devnet
solana config set --url devnet
solana airdrop 2  # SOL para pagar fees

# Build e deploy do programa
anchor build
anchor deploy --provider.cluster devnet

# Iniciar frontend
cd app && npm run dev
```

---

## Fluxo das Instruções On-chain

```
join_dao(stake_amount)
  ├── Transfer USDC do seller → treasury PDA
  ├── Mint governance tokens → wallet do seller
  │     (proporcional ao volume dos últimos 30 dias)
  └── Cria MemberAccount PDA

propose(description, target_amount, recipient)
  ├── Valida que proponente é membro
  ├── Cria ProposalAccount PDA
  └── Inicia janela de votação (72h)

vote(proposal_id, approve: bool)
  ├── Valida que votante é membro e não votou ainda
  ├── Registra peso do voto (governance tokens)
  └── Atualiza contadores na ProposalAccount

execute(proposal_id)
  ├── Valida que janela de 72h encerrou
  ├── Valida aprovação por maioria
  ├── Transfer USDC treasury → recipient
  └── Marca proposta como executada
```

---

## Demo (Hackathon)

Para a apresentação, o projeto inclui:

- **5 sellers simulados** com wallets de teste pré-carregadas na Devnet
- **Treasury inicial** visível no Solana Explorer
- **Proposta ativa** de compra coletiva de estoque pronta para votacao ao vivo
- Script de setup: `scripts/demo-setup.ts`

```bash
npm run demo:setup   # popula wallets e cria proposta inicial
npm run demo:vote    # simula votos dos membros
```

## Roadmap Pós-Hackathon

- [ ] Integração real com APIs de marketplaces (ML, Shopee)
- [ ] Onboarding simplificado sem wallet (custodial para novos usuarios)
- [ ] Modulo de benchmark de dados de vendas
- [ ] Parcerias com distribuidores para compra coletiva de estoque
- [ ] Mobile app para votacao

---

## Licença

MIT