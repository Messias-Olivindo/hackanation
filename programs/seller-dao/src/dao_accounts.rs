// =============================================================================
// dao_accounts.rs — Definições de contas para cada instrução (Anchor Accounts)
// =============================================================================
//
// IMPORTANTE: Este módulo se chama "dao_accounts" e NÃO "accounts" porque
// o Anchor reserva internamente o nome "accounts" para os wrappers gerados
// pelo macro #[program]. Usar "pub mod accounts" causaria:
//   E0428: the name `accounts` is defined multiple times
//
// Cada struct #[derive(Accounts)] define as contas necessárias para uma
// instrução específica do programa. O Anchor valida automaticamente:
// - PDAs (seeds + bump)
// - Ownership
// - Constraints customizadas
// - Inicialização de contas (init / init_if_needed)
//
// NOTA SOBRE Box<Account>:
// O runtime BPF/SBF da Solana limita o stack frame a 4096 bytes.
// Structs com muitas contas (como JoinDao com 10 contas) excedem esse limite.
// Usar Box<> move os dados para o heap, resolvendo o stack overflow.
//
// Referência: https://book.anchor-lang.com/anchor_in_depth/the_accounts_struct.html
// Referência: https://solana.com/docs/programs/limitations#stack
// =============================================================================

use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::errors::DaoError;
use crate::state::{
    Dao, Member, Proposal, VoteRecord,
    DAO_SPACE, MEMBER_SPACE, PROPOSAL_SPACE, VOTE_RECORD_SPACE,
    DAO_SEED, MEMBER_SEED, PROPOSAL_SEED, TREASURY_SEED, VOTE_RECORD_SEED,
};

// =============================================================================
// JoinDao — Contas para a instrução de entrada na DAO
// =============================================================================
//
// Fluxo:
// 1. Inicializa a conta da DAO (se primeira chamada) com init_if_needed
// 2. Cria a conta do membro via PDA [b"member", user_pubkey]
// 3. Cria/reutiliza a ATA do treasury para receber o stake
// 4. Transfere tokens do usuário para o treasury via CPI com SPL Token
//
// Contas boxed (Box<>) para evitar stack overflow no BPF:
// - dao, member, treasury_token_account, user_token_account, mint
// =============================================================================
#[derive(Accounts)]
pub struct JoinDao<'info> {
    /// Conta global da DAO — inicializada na primeira chamada, reutilizada depois.
    /// PDA seeds: [b"dao"]
    #[account(
        init_if_needed,
        payer = user,
        space = DAO_SPACE,
        seeds = [DAO_SEED],
        bump
    )]
    pub dao: Box<Account<'info, Dao>>,

    /// Conta do novo membro — criada nesta transação.
    /// PDA seeds: [b"member", user.key()]
    #[account(
        init,
        payer = user,
        space = MEMBER_SPACE,
        seeds = [MEMBER_SEED, user.key().as_ref()],
        bump
    )]
    pub member: Box<Account<'info, Member>>,

    /// PDA de autoridade do treasury — usada como authority da ATA do treasury.
    /// Não armazena dados, apenas serve como signer PDA para transferências.
    /// CHECK: Validada pelas seeds [b"treasury"] + bump.
    #[account(seeds = [TREASURY_SEED], bump)]
    pub treasury_authority: AccountInfo<'info>,

    /// Token account do treasury — ATA controlada pela treasury_authority PDA.
    /// Inicializada automaticamente pelo Anchor na primeira chamada.
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = treasury_authority
    )]
    pub treasury_token_account: Box<Account<'info, TokenAccount>>,

    /// Token account do usuário — de onde os tokens de stake serão transferidos.
    /// Constraint: owner deve ser o user e mint deve corresponder.
    #[account(
        mut,
        constraint = user_token_account.owner == user.key()
            && user_token_account.mint == mint.key()
    )]
    pub user_token_account: Box<Account<'info, TokenAccount>>,

    /// Mint do token usado para stake (ex: USDC mint na devnet)
    pub mint: Box<Account<'info, Mint>>,

    /// Wallet do usuário que está entrando na DAO — paga as taxas de criação
    #[account(mut)]
    pub user: Signer<'info>,

    /// Programa SPL Token — necessário para a CPI de transferência
    pub token_program: Program<'info, Token>,

    /// Programa SPL Associated Token — necessário para criar ATAs
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System Program — necessário para criar contas PDA
    pub system_program: Program<'info, System>,
}

// =============================================================================
// Propose — Contas para a instrução de criação de proposta
// =============================================================================
//
// Fluxo:
// 1. Valida que o user é dono da conta member
// 2. Cria a conta da proposta via PDA [b"proposal", dao_key, proposal_count_le]
// 3. Incrementa o proposal_count da DAO
// =============================================================================
#[derive(Accounts)]
pub struct Propose<'info> {
    /// Conta do membro que está criando a proposta.
    /// Validação de ownership é feita na lógica da instrução (member.user == user.key).
    #[account(mut)]
    pub member: Account<'info, Member>,

    /// Conta global da DAO — precisa ser mut para incrementar proposal_count.
    /// PDA seeds: [b"dao"], bump validado pelo dao_bump armazenado.
    #[account(
        mut,
        seeds = [DAO_SEED],
        bump = dao.dao_bump
    )]
    pub dao: Account<'info, Dao>,

    /// Nova conta de proposta — criada nesta transação.
    /// PDA seeds: [b"proposal", dao.key(), dao.proposal_count.to_le_bytes()]
    /// O proposal_count atual é usado como seed para garantir unicidade.
    #[account(
        init,
        payer = user,
        space = PROPOSAL_SPACE,
        seeds = [PROPOSAL_SEED, dao.key().as_ref(), &dao.proposal_count.to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, Proposal>,

    /// Wallet do proponente — paga a criação da conta da proposta
    #[account(mut)]
    pub user: Signer<'info>,

    /// System Program — necessário para criar a conta PDA
    pub system_program: Program<'info, System>,
}

// =============================================================================
// Vote — Contas para a instrução de votação
// =============================================================================
//
// Fluxo:
// 1. Valida que o user é dono da conta member
// 2. Verifica que a proposta está dentro da janela de votação
// 3. Cria o VoteRecord PDA — a simples existência desta PDA impede voto duplo
// 4. Atualiza os contadores votes_for/votes_against da proposta
// =============================================================================
#[derive(Accounts)]
pub struct Vote<'info> {
    /// Conta do membro votante
    #[account(mut)]
    pub member: Account<'info, Member>,

    /// Conta da proposta sendo votada — mut para atualizar contadores de votos
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    /// Conta da DAO — read-only, usada para validação do bump
    #[account(seeds = [DAO_SEED], bump = dao.dao_bump)]
    pub dao: Account<'info, Dao>,

    /// Registro de voto — PDA única por (proposta, membro).
    /// Se o membro já votou nesta proposta, o init falhará com
    /// "account already initialized", impedindo voto duplo automaticamente.
    /// PDA seeds: [b"vote", proposal.key(), member.key()]
    #[account(
        init,
        payer = user,
        space = VOTE_RECORD_SPACE,
        seeds = [VOTE_RECORD_SEED, proposal.key().as_ref(), member.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,

    /// Wallet do votante — paga a criação do VoteRecord
    #[account(mut)]
    pub user: Signer<'info>,

    /// System Program — necessário para criar a conta PDA
    pub system_program: Program<'info, System>,
}

// =============================================================================
// Execute — Contas para a instrução de execução de proposta aprovada
// =============================================================================
//
// Fluxo:
// 1. Valida que a proposta não foi executada e que a janela de votação encerrou
// 2. Verifica maioria de votos a favor
// 3. Verifica saldo suficiente no treasury
// 4. Executa transferência CPI do treasury para o destinatário
// 5. Marca proposta como executada
//
// A transferência usa CpiContext::new_with_signer porque a authority
// da token account do treasury é uma PDA (treasury_authority),
// e somente o programa pode "assinar" por ela usando as seeds.
// =============================================================================
#[derive(Accounts)]
pub struct Execute<'info> {
    /// Conta da proposta — mut para marcar is_executed = true
    #[account(mut)]
    pub proposal: Account<'info, Proposal>,

    /// Conta da DAO — read-only, usada para validar bumps e treasury_token_account
    #[account(
        seeds = [DAO_SEED],
        bump = dao.dao_bump
    )]
    pub dao: Account<'info, Dao>,

    /// PDA de autoridade do treasury — atua como signer na CPI de transferência.
    /// CHECK: Validada pelas seeds [b"treasury"] + treasury_bump da DAO.
    #[account(seeds = [TREASURY_SEED], bump = dao.treasury_bump)]
    pub treasury_authority: UncheckedAccount<'info>,

    /// Token account do treasury — de onde os tokens serão transferidos.
    /// Constraint: deve ser a mesma token account registrada na DAO.
    #[account(
        mut,
        constraint = treasury_token_account.key() == dao.treasury_token_account
    )]
    pub treasury_token_account: Account<'info, TokenAccount>,

    /// Token account do destinatário — para onde os tokens serão enviados.
    /// Constraint: o mint deve corresponder ao mint do treasury.
    #[account(
        mut,
        constraint = recipient_token_account.key() == proposal.recipient
            @ DaoError::InvalidRecipientTokenAccount,
        constraint = recipient_token_account.mint == treasury_token_account.mint
            @ DaoError::TreasuryMintMismatch
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    /// Programa SPL Token — necessário para a CPI de transferência
    pub token_program: Program<'info, Token>,
}
