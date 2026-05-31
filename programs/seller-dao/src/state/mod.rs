// =============================================================================
// state/mod.rs — Re-exportação de todos os módulos de estado
// =============================================================================
//
// Centraliza os exports para que o resto do programa possa importar
// qualquer struct ou constante com: use crate::state::*;
// =============================================================================

pub mod dao;
pub mod constants;
pub mod member;
pub mod proposal;
pub mod vote_record;

pub use dao::*;
pub use constants::*;
pub use member::*;
pub use proposal::*;
pub use vote_record::*;
