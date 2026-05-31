# Smart Contracts — O Que Foi Feito, Como Testar e Como Fazer Deploy

> **Última atualização:** 2026-05-31
> **Status:** ✅ Compilado, testado e pronto para deploy na Devnet

---

## 📋 O Que Foi Feito

### 1. Estrutura do Programa Anchor (Rust)

O programa **SellerDAO** implementa 4 instruções on-chain para governança de sellers de marketplace:

```
programs/seller-dao/src/
├── lib.rs                    # Entry point — 4 instruções MVP
├── dao_accounts.rs           # Structs de contas (Anchor #[derive(Accounts)])
├── errors.rs                 # Códigos de erro customizados (6000-6009)
├── instructions/
│   ├── mod.rs                # Re-exportação dos módulos
│   ├── join_dao.rs           # Entrar na DAO (stake + governance tokens)
│   ├── propose.rs            # Criar proposta de uso do treasury
│   ├── vote.rs               # Votar em proposta (anti-voto-duplo via PDA)
│   └── execute.rs            # Executar proposta aprovada (CPI transfer)
└── state/
    ├── mod.rs                # Re-exportação dos módulos
    ├── constants.rs          # Seeds PDA e período de votação
    ├── dao.rs                # Estado global da DAO
    ├── member.rs             # Estado de cada membro
    ├── proposal.rs           # Estado de cada proposta
    └── vote_record.rs        # Registro de voto (anti-duplicação)
```

### 2. Instruções Implementadas

| Instrução | Descrição | Status |
|-----------|-----------|--------|
| `join_dao(stake_amount)` | Deposita tokens no treasury, cria membro, recebe governance tokens | ✅ |
| `propose(description, target_amount, recipient)` | Cria proposta com janela de votação | ✅ |
| `vote(proposal_id, approve)` | Vota a favor/contra com peso = governance_tokens | ✅ |
| `execute(proposal_id)` | Transfere tokens do treasury para destinatário | ✅ |

### 3. Problemas Técnicos Resolvidos

#### Conflito de namespace `accounts`
O Anchor reserva o nome `accounts` internamente. O módulo foi renomeado para `dao_accounts`.

#### Stack overflow no BPF (4096 bytes)
A struct `JoinDao` tem 10 contas e excedia o limite de stack. Resolvido com `Box<Account>` para mover dados para o heap.

#### Conflito de porta 8000
O validador local do Solana usa a porta 8000 para gossip, que conflitava com servidores de desenvolvimento. Configurado em `Anchor.toml`:
```toml
[test.validator]
bind_address = "127.0.0.1"
gossip_port = 8020
dynamic_port_range = "8021-8050"
```

#### Período de votação para testes
O `VOTING_PERIOD_SECONDS` está configurado como 3 segundos para testes locais rápidos. Para produção, alterar em `programs/seller-dao/src/state/constants.rs`:
```rust
pub const VOTING_PERIOD_SECONDS: i64 = 72 * 60 * 60; // 72 horas
```

### 4. Suíte de Testes

3 testes de integração em `programs/seller-dao/tests/dao_mvp.js`:

| Teste | O que valida |
|-------|-------------|
| `join_dao initializes DAO and member` | Criação da DAO, membro, treasury ATA, transferência de stake |
| `propose, vote, and execute` | Fluxo completo: proposta → voto → espera → execução → saldos |
| `prevents double voting` | VoteRecord PDA impede voto duplicado |

### 5. Comentários no Código

Todos os arquivos foram reescritos com comentários detalhados em português explicando:
- O propósito de cada arquivo/struct/função
- O significado de cada campo e seu tamanho em bytes
- As referências a padrões de DAOs Solana (SPL Governance, Squads, Tribeca)
- O porquê das decisões técnicas (Box<>, naming, PDA seeds)

---

## 🧪 Como Testar Localmente

### Pré-requisitos

```bash
# Verificar instalações
solana --version       # Solana CLI (testado com 3.1.x)
anchor --version       # Anchor CLI (0.29.0)
node --version         # Node.js 18+
rustc --version        # Rust stable
```

### Rodar os Testes

```bash
# 1. Ir para o diretório raiz do projeto
cd /home/messiasolivindo/Documentos/github/hackanation

# 2. Instalar dependências do teste (se ainda não instalou)
cd programs/seller-dao && npm install && cd ../..

# 3. Build do programa Anchor
anchor build

# 4. Copiar artefatos de build (necessário por causa da estrutura de workspace)
cp programs/seller-dao/target/deploy/seller_dao.so target/deploy/
cp programs/seller-dao/target/deploy/seller_dao-keypair.json target/deploy/
cp target/idl/seller_dao.json programs/seller-dao/target/idl/

# 5. Rodar os testes
anchor test
```

### Resultado Esperado

```
  seller-dao mvp
    ✔ join_dao initializes DAO and member (1677ms)
    ✔ propose, vote, and execute (7529ms)
    ✔ prevents double voting

  3 passing (10s)
```

### Troubleshooting

| Problema | Solução |
|----------|---------|
| `gossip_addr bind_to port 8000: Address already in use` | A porta 8000 está ocupada. A config em `Anchor.toml` já resolve isso usando porta 8020. |
| `target/deploy/seller_dao.so not found` | Rode `anchor build` e copie os artefatos conforme passo 4 acima. |
| `IDL does not have metadata.address` | Copie o IDL: `cp target/idl/seller_dao.json programs/seller-dao/target/idl/` |
| `ProposalOpen` no teste execute | O `VOTING_PERIOD_SECONDS` precisa ser curto (3s) para testes. Verifique `state/constants.rs`. |

---

## 🚀 Como Fazer Deploy na Devnet

### Passo 1: Configurar o Solana CLI

```bash
# Mudar para devnet
solana config set --url devnet

# Verificar configuração
solana config get

# Gerar keypair se não tiver
solana-keygen new --no-bip39-passphrase  # (pule se já tiver)

# Obter SOL de teste
solana airdrop 2
```

### Passo 2: Build e Deploy

```bash
# Build do programa
anchor build

# Deploy na devnet
anchor deploy --provider.cluster devnet
```

### Passo 3: Registrar o Program ID

Após o deploy, o Anchor vai mostrar o Program ID. Atualize em:

1. **`Anchor.toml`** (raiz):
   ```toml
   [programs.devnet]
   seller_dao = "SEU_PROGRAM_ID_AQUI"
   ```

2. **`programs/seller-dao/src/lib.rs`**:
   ```rust
   declare_id!("SEU_PROGRAM_ID_AQUI");
   ```

3. **`programs/seller-dao/Anchor.toml`**:
   ```toml
   [programs.devnet]
   seller_dao = "SEU_PROGRAM_ID_AQUI"
   ```

### Passo 4: Verificar no Explorer

Após o deploy, verifique no [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet):

```bash
# Ver informações do programa
solana program show SEU_PROGRAM_ID_AQUI --url devnet
```

### Passo 5: Restaurar Constantes de Produção

Antes do deploy final, altere o período de votação em `programs/seller-dao/src/state/constants.rs`:

```rust
// De:
pub const VOTING_PERIOD_SECONDS: i64 = 3;

// Para:
pub const VOTING_PERIOD_SECONDS: i64 = 72 * 60 * 60; // 72 horas
```

E faça o rebuild e redeploy.

---

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `Anchor.toml` | Configuração do workspace, program ID, validator ports |
| `programs/seller-dao/Cargo.toml` | Dependências Rust (anchor-lang 0.29.0, anchor-spl) |
| `programs/seller-dao/src/lib.rs` | Entry point com as 4 instruções |
| `programs/seller-dao/src/dao_accounts.rs` | Definições de contas com Box<> para stack safety |
| `programs/seller-dao/src/state/constants.rs` | Seeds PDA e VOTING_PERIOD_SECONDS |
| `programs/seller-dao/tests/dao_mvp.js` | Suíte de testes Mocha/Chai |
| `target/idl/seller_dao.json` | IDL gerado pelo Anchor (interface do programa) |
| `target/deploy/seller_dao.so` | Binário BPF compilado para deploy |

---

## 🏗️ Arquitetura de PDAs

```
Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
│
├── DAO PDA
│   seeds: [b"dao"]
│   Conta única global da DAO
│
├── Treasury Authority PDA
│   seeds: [b"treasury"]
│   Authority da token account do treasury (PDA signer)
│
├── Member PDA (uma por usuário)
│   seeds: [b"member", user_pubkey]
│   Estado de cada membro
│
├── Proposal PDA (uma por proposta)
│   seeds: [b"proposal", dao_key, proposal_count_le_bytes]
│   Estado de cada proposta
│
└── VoteRecord PDA (uma por voto)
    seeds: [b"vote", proposal_key, member_key]
    Anti-voto-duplo + registro do voto
```
