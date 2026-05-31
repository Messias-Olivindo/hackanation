// =============================================================================
// lib.rs — Entry point do programa SellerDAO (Anchor)
// =============================================================================
//
// Este é o ponto de entrada do programa Solana. O macro #[program] do Anchor
// gera automaticamente o entrypoint e os deserializers de contas.
//
// Arquitetura:
// - lib.rs: Entry point com as assinaturas das 4 instruções MVP
// - dao_accounts.rs: Definições de contas (#[derive(Accounts)])
// - instructions/: Lógica de negócio de cada instrução
// - state/: Structs de estado das contas (#[account]) e constantes
// - errors.rs: Códigos de erro customizados
//
// NOTA: O módulo de contas se chama "dao_accounts" e NÃO "accounts"
// porque o Anchor reserva internamente o nome "accounts" para os wrappers
// gerados pelo macro #[program].
//
// Instruções MVP:
// 1. join_dao  — Entrar na DAO depositando stake e recebendo governance tokens
// 2. propose   — Criar uma proposta de uso do treasury
// 3. vote      — Votar em uma proposta (a favor ou contra)
// 4. execute   — Executar uma proposta aprovada (transferir tokens do treasury)
//
// Program ID: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
// =============================================================================

use anchor_lang::prelude::*;

/// Módulos do programa
pub mod errors;
pub mod dao_accounts;
pub mod instructions;
pub mod state;

/// Importa todas as structs de contas para uso nos Context<>
use dao_accounts::*;

/// ID do programa — deve corresponder ao keypair em target/deploy/seller_dao-keypair.json
/// e ao valor em Anchor.toml [programs.localnet].
declare_id!("FPezMd8XbqDEYXsDgqRW7bpGQ6HDdnjnzMbKpNMjcPkL");

#[program]
pub mod seller_dao {
    use super::*;

    /// Instrução 1: Entrar na DAO
    ///
    /// O usuário deposita `stake_amount` tokens no treasury e recebe
    /// governance tokens proporcionais (stake * 10). A DAO é inicializada
    /// automaticamente na primeira chamada via init_if_needed.
    ///
    /// Parâmetros:
    /// - `stake_amount`: Quantidade de tokens a depositar como stake (deve ser > 0)
    pub fn join_dao(
        ctx: Context<JoinDao>,
        stake_amount: u64,
    ) -> Result<()> {
        instructions::join_dao::join_dao(ctx, stake_amount)
    }

    /// Instrução 2: Criar uma proposta
    ///
    /// Um membro cria uma proposta de uso dos fundos do treasury.
    /// A proposta inicia uma janela de votação definida por VOTING_PERIOD_SECONDS.
    ///
    /// Parâmetros:
    /// - `description`: Texto descritivo da proposta (max 280 chars)
    /// - `target_amount`: Valor em tokens solicitado do treasury
    /// - `recipient`: Pubkey da token account que receberá os fundos
    pub fn propose(
        ctx: Context<Propose>,
        description: String,
        target_amount: u64,
        recipient: Pubkey,
    ) -> Result<()> {
        instructions::propose::propose(ctx, description, target_amount, recipient)
    }

    /// Instrução 3: Votar em uma proposta
    ///
    /// O membro registra seu voto (a favor ou contra) com peso igual
    /// aos seus governance tokens. Cada membro só pode votar uma vez
    /// por proposta (garantido pela PDA do VoteRecord).
    ///
    /// Parâmetros:
    /// - `proposal_id`: ID da proposta (não usado na lógica, mas parte da API)
    /// - `approve`: true para votar a favor, false para votar contra
    pub fn vote(
        ctx: Context<Vote>,
        proposal_id: u64,
        approve: bool,
    ) -> Result<()> {
        instructions::vote::vote(ctx, proposal_id, approve)
    }

    /// Instrução 4: Executar uma proposta aprovada
    ///
    /// Após o período de votação encerrar, qualquer pessoa pode executar
    /// uma proposta que tenha maioria de votos a favor. Os tokens são
    /// transferidos do treasury para o destinatário via CPI com PDA signer.
    ///
    /// Parâmetros:
    /// - `proposal_id`: ID da proposta (não usado na lógica, mas parte da API)
    pub fn execute(
        ctx: Context<Execute>,
        proposal_id: u64,
    ) -> Result<()> {
        instructions::execute::execute(ctx, proposal_id)
    }
}
