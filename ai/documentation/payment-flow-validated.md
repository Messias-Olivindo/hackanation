# Fluxo de Onboarding e Pagamento (validado com pesquisa)

## 1. Objetivo

Descrever um fluxo de onboarding e pagamento que seja viavel no MVP e tenha caminho claro para producao, com base nas limitacoes reais de provedores e APIs.

## 2. Pontos validados na pesquisa

### 2.1 Carteira MPC (embedded wallet)

- Provedores como Privy, Dynamic e Web3Auth suportam embedded wallets e login social com MPC e modelo de auto-custodia tecnica.
- Isso melhora o UX (sem seed phrase) e permite assinar transacoes direto no app.
- Legalmente, "non-custodial" nao elimina obrigacoes reguladoras se o produto intermediar pagamentos. Precisa de revisao juridica para o go-to-market.

Fontes:

- https://www.privy.io/
- https://docs.privy.io/
- https://www.dynamic.xyz/
- https://www.dynamic.xyz/docs/
- https://web3auth.io/
- https://web3auth.io/docs

### 2.2 On-ramp Pix -> USDC (Solana)

- MoonPay oferece ramps e virtual accounts com APIs e KYC/KYB integrados, mas nao ha confirmacao publica de PIX -> USDC nem de "SmartPay".
- Portanto, o fluxo Pix -> USDC na Solana deve ser tratado como hipotese a validar com MoonPay.

Fontes:

- https://www.moonpay.com/business/ramps
- https://www.moonpay.com/business/virtual-accounts
- https://dev.moonpay.com/

### 2.3 APIs de marketplace no front-end

- Em geral, APIs de marketplace exigem OAuth e segredo de cliente. Isso inviabiliza chamadas diretas somente no front-end por questoes de seguranca e CORS.
- Para o MVP, use dados simulados, upload de CSV/relatorio ou um proxy serverless simples.

## 3. Fluxo proposto (MVP realista)

1. **Onboarding com embedded wallet (MPC)**
   - Login social cria wallet MPC.
   - O usuario assina transacoes sem seed phrase.

2. **Calculo da contribuicao**
   - MVP: valor informado manualmente ou CSV exportado do marketplace.
   - Producao: backend valida via OAuth e calcula automaticamente.

3. **Pagamento da contribuicao**
   - MVP: simulacao de on-ramp; usuario deposita USDC/SOL na wallet MPC via exchange ou faucet.
   - Producao: integrar on-ramp confirmado para USDC na Solana ou aceitar SOL e converter via DEX com politica de conversao.

4. **Transferencia para treasury (PDA)**
   - App detecta saldo na wallet MPC.
   - Usuario assina transferencia para o PDA do treasury.
   - Programa Anchor registra o pagamento e atualiza o estado do membro.

## 4. Ajustes recomendados

- **Nao afirmar Pix -> USDC na Solana** sem contrato e documentacao publica.
- **Separar MVP e producao**: MVP com simulacao ou deposito manual; producao com on-ramp validado.
- **Adicionar backend minimo (producao)** para OAuth, KYC/AML, webhooks e reconciliacao.

## 5. Proximos passos de validacao

- Confirmar com MoonPay se existe PIX -> USDC na Solana.
- Confirmar com MoonPay se o SmartPay cobre USDC -> PIX.
- Definir politica de conversao caso aceite SOL no MVP.
