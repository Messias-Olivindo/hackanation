// =============================================================================
// vote.rs — Lógica da instrução de votação
// =============================================================================
//
// Fluxo:
// 1. Valida que o user é dono da conta member
// 2. Verifica que a proposta está dentro da janela de votação
// 3. Verifica que a proposta não foi executada
// 4. Registra o voto no VoteRecord PDA (anti-voto-duplo via init)
// 5. Atualiza os contadores de votos da proposta
//
// Mecanismo anti-voto-duplo:
// O VoteRecord é um PDA com seeds [b"vote", proposal_key, member_key].
// Se o membro tentar votar novamente, o Anchor tentará `init` um PDA
// que já existe, resultando em erro automático "account already initialized".
//
// Peso do voto:
// O peso é igual ao governance_tokens do membro, que por sua vez é
// proporcional ao stake depositado (stake * 10).
//
// Referência: Anti-double-vote pattern em SPL Governance
// =============================================================================

use anchor_lang::prelude::*;
use crate::dao_accounts::Vote;
use crate::errors::DaoError;
use crate::state::VOTING_PERIOD_SECONDS;

/// Handler da instrução vote.
///
/// # Argumentos
/// - `ctx` - Contexto com todas as contas validadas
/// - `_proposal_id` - ID da proposta (parte da API, validação via PDA seeds)
/// - `approve` - true para votar a favor, false para votar contra
///
/// # Erros
/// - `DaoError::NotMember` - Se user não é o dono da conta member
/// - `DaoError::ProposalClosed` - Se o período de votação já encerrou
/// - `DaoError::ProposalExecuted` - Se a proposta já foi executada
pub fn vote(ctx: Context<Vote>, _proposal_id: u64, approve: bool) -> Result<()> {
    // Validação: somente o dono da conta member pode votar
    require!(
        ctx.accounts.member.user == *ctx.accounts.user.key,
        DaoError::NotMember
    );

    // Obter timestamp atual para verificar janela de votação
    let now = Clock::get()?.unix_timestamp;

    // Salvamos a key da proposta antes do borrow mut
    let proposal_key = ctx.accounts.proposal.key();

    let proposal = &mut ctx.accounts.proposal;

    // Validação: proposta deve estar dentro da janela de votação
    require!(
        now < proposal.created_at + VOTING_PERIOD_SECONDS,
        DaoError::ProposalClosed
    );

    // Validação: proposta não pode ter sido executada
    require!(!proposal.is_executed, DaoError::ProposalExecuted);

    // --- Registro do voto ---
    // A PDA do VoteRecord garante unicidade: se já existe, o init falha.
    let vote_record = &mut ctx.accounts.vote_record;
    vote_record.proposal = proposal_key;
    vote_record.voter = ctx.accounts.member.user;
    vote_record.approve = approve;
    vote_record.weight = ctx.accounts.member.governance_tokens;
    vote_record.bump = ctx.bumps.vote_record;

    // --- Atualização dos contadores de votos ---
    if approve {
        proposal.votes_for += ctx.accounts.member.governance_tokens;
    } else {
        proposal.votes_against += ctx.accounts.member.governance_tokens;
    }

    Ok(())
}
