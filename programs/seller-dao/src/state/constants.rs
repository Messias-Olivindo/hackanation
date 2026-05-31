// =============================================================================
// constants.rs — Constantes globais do programa SellerDAO
// =============================================================================
//
// Define as seeds usadas na derivação de PDAs (Program Derived Addresses)
// e parâmetros de governança. Cada seed é um slice de bytes (&[u8]) que
// garante endereços determinísticos e únicos on-chain.
//
// Referência: https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses
// Referência: https://book.anchor-lang.com/anchor_in_depth/PDAs.html
// =============================================================================

/// Seed para a PDA principal da DAO (conta global de estado).
/// Garante que exista apenas uma instância da DAO por programa.
pub const DAO_SEED: &[u8] = b"dao_v2";

/// Seed para a PDA de autoridade do treasury.
/// Esta PDA é usada como "authority" da token account do treasury,
/// permitindo transferências assinadas pelo programa via CPI.
pub const TREASURY_SEED: &[u8] = b"treasury";

/// Seed para a PDA de cada membro.
/// Combinada com a pubkey do usuário para criar uma conta única por membro.
pub const MEMBER_SEED: &[u8] = b"member";

/// Seed para a PDA de cada proposta.
/// Combinada com a key da DAO e o ID sequencial da proposta.
pub const PROPOSAL_SEED: &[u8] = b"proposal";

/// Seed para a PDA de registro de voto.
/// Combinada com a key da proposta e do membro para impedir voto duplicado.
pub const VOTE_RECORD_SEED: &[u8] = b"vote";

/// Período de votação em segundos.
///
/// IMPORTANTE: Para testes locais, este valor está definido como 3 segundos
/// para que os testes rodem rapidamente sem precisar de warp de slots.
///
/// Para deploy em produção/devnet, altere para o valor real de governança:
///   pub const VOTING_PERIOD_SECONDS: i64 = 72 * 60 * 60; // 72 horas
pub const VOTING_PERIOD_SECONDS: i64 = 60;
