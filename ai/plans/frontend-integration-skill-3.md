# 📋 Skill de Integração Frontend — Conexão On-Chain SellerDAO

Esta é uma **Skill (guia técnico passo a passo acionável)** projetada para orientar o próximo agente de IA a realizar a conexão visual e de experiência de usuário (UX) do **SellerDAO** no frontend React/Next.js.

> [!IMPORTANT]
> **Status Atual:** Toda a lógica estrutural, constantes de rede, derivação de contas on-chain (PDAs) e o custom hook de transações **já estão 100% implementados de forma modular dentro da pasta `app/`**. 
> 
> O próximo agente deve focar exclusivamente em consumir o hook existente para construir e estilizar a interface do usuário (UI).

---

## 📂 Arquivos de Integração Já Prontos (Não Modificar)

Os seguintes arquivos de infraestrutura Solana foram criados com sucesso e estão prontos para importação no Next.js:

1. 📑 **IDL Compilado:**
   * Local: [`app/src/lib/seller_dao.json`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/seller_dao.json)
   * Descrição: Esquema de métodos e contas do smart contract.

2. 🔗 **Constantes do Smart Contract:**
   * Local: [`app/src/lib/solana.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/solana.ts)
   * Descrição: Program ID oficial (`FPezMd8XbqDEYXsDgqRW7bpGQ6HDdnjnzMbKpNMjcPkL`), endereço da moeda de Staking USDC (`DPd4G6RYKrmYKnYTjRRhpJhR45JJjs1mXnkoXibbd5Sg`), RPC Devnet e seeds de PDAs.

3. 🧠 **Utilitários de Derivação PDA:**
   * Local: [`app/src/lib/pdas.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/pdas.ts)
   * Descrição: Funções tipadas `getSellerDaoPdas()`, `getProposalPda()` e `getVoteRecordPda()`.

4. 🎣 **Custom Hook de Transações:**
   * Local: [`app/src/hooks/useSellerDao.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/hooks/useSellerDao.ts)
   * Descrição: Hook `useSellerDao()` que exporta as 4 funções de transação prontas para envio à blockchain:
     * `joinDao(amountToStake, tokenMintAddress)`
     * `propose(title, description, amountToTransfer, tokenMintAddress, recipientWalletAddress)`
     * `vote(proposalId, approve)`
     * `execute(proposalId, tokenMintAddress, recipientWalletAddress)`

---

## 🚀 Próximas Atividades: Passo a Passo para o Novo Agente

O próximo agente de IA deve seguir o roteiro abaixo para dar vida à interface visual do SellerDAO:

### Passo 1: Configurar a Conexão de Carteiras no Layout (`_app.tsx` ou similar)
Instrua o agente a encapsular a raiz da aplicação com os Providers instalados para que a carteira do usuário possa assinar as transações:

```typescript
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { DEVNET_RPC } from '../lib/solana';

import '@solana/wallet-adapter-react-ui/styles.css';

export default function App({ Component, pageProps }) {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={DEVNET_RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

### Passo 2: Implementar o Componente de Adesão (Join DAO)
Criar um painel onde o usuário realiza o staking de tokens para virar membro votante da governança:
* Importar `useSellerDao` de `../hooks/useSellerDao` e `MINT_ADDRESS` de `../lib/solana`.
* Renderizar um campo de input numérico (ex: "Quantidade para Staking").
* Exibir um botão "Participar da DAO" que invoca a função `joinDao(amount, MINT_ADDRESS)`.
* Adicionar estados visuais de `loading` (carregamento) e sucesso com link para o Explorer da Solana (`https://explorer.solana.com/tx/.../devnet`).

### Passo 3: Implementar o Formulário de Novas Propostas
Criar a interface que permite aos membros ativos propor orçamentos de repasse:
* Renderizar inputs para:
  1. **Título da Proposta** (ex: "Frete de Lote Q3")
  2. **Descrição** (justificativa de governança)
  3. **Valor do Repasse** (USDC a transferir)
  4. **Carteira Destino** (endereço público do fornecedor do serviço)
* Chamar `propose(title, description, amount, MINT_ADDRESS, new PublicKey(fornecedor))` ao submeter o formulário.

### Passo 4: Construir o Feed de Propostas e Cronômetro de 60 Segundos
Exibir de forma premium a governança ativa da DAO:
* Buscar todas as propostas utilizando buscas em tempo real do Anchor.
* Exibir um card detalhado para cada proposta contendo:
  * Título, descrição e carteira de destino do repasse.
  * Progresso visual de votos (Votos SIM vs Votos NÃO).
  * **Cronômetro Regressivo de Votação (60 segundos)** baseado no `endTime` da proposta.
* Enquanto o cronômetro estiver rodando: exibir os botões de **"Votar SIM"** e **"Votar NÃO"** chamando a função `vote(proposalId, true/false)`.
* Após a expiração do cronômetro de 60 segundos:
  * Esconder botões de voto.
  * Se a proposta foi aprovada e ainda não foi executada: exibir o botão de ação principal **"Executar Repasse"** chamando a função `execute(proposalId, MINT_ADDRESS, fornecedorAddress)` para liberar a verba on-chain!

---

## 🎨 Recomendações de Design e UX para o Novo Agente
* **Aparência Premium:** Utilizar uma paleta de cores moderna (modo escuro com degradês sutis, estilo glassmorphism) e fontes profissionais (ex: Inter ou Outfit).
* **Feedback de Transação:** Exibir animações suaves de carregamento (spinners) enquanto as assinaturas do Phantom estão processando as transações.
* **Alertas Dinâmicos:** Usar notificações do tipo Toast para alertar se um usuário visitante tentar votar ou criar propostas sem ter feito Staking antes.
