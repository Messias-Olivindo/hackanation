# SellerDAO Program (Anchor)

Programa Anchor do SellerDAO. Implementa entrada na DAO, criacao de propostas, votacao e execucao de pagamentos via treasury.

## Requisitos

- Solana CLI (compatível com Anchor 0.29.0)
- Anchor CLI 0.29.0
- Rust stable
- Node.js 18+

## Como rodar (local)

```bash
# na raiz do repo
cd /home/messiasolivindo/Documentos/github/hackanation

# dependencias dos testes
cd programs/seller-dao
npm install
cd ../..

# build do programa
anchor build

# rodar testes
anchor test
```

## Deploy na devnet (resumo)

```bash
solana config set --url devnet
solana airdrop 2
anchor build
anchor deploy --provider.cluster devnet
```

Depois do deploy, atualize o Program ID em:
- Anchor.toml (raiz)
- programs/seller-dao/Anchor.toml
- programs/seller-dao/src/lib.rs

## Observacao sobre build

Se aparecer erro de stack relacionado a spl-token-2022 durante `anchor build`, alinhe as versoes do Solana/Anchor e rode `cargo update`. Os testes ainda podem passar, mas o ideal e manter o build limpo.
