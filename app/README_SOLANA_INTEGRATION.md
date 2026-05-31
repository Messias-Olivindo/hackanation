# 🚀 Integração Nativa SellerDAO (Solana / Next.js)

Este subdiretório `app` contém um projeto Next.js totalmente configurado com as dependências do Solana e do smart contract **SellerDAO** já implantadas de forma 100% modular.

A estrutura foi organizada seguindo as melhores práticas arquiteturais para garantir **compatibilidade total com deploys na Vercel** (sem imports externos ou referências fora do diretório modular do app).

---

## 📂 Estrutura dos Arquivos de Integração

Todas as constantes, regras de derivação de contas determinísticas (PDAs) e lógica de transações foram adicionadas de forma limpa nos seguintes locais:

1. 📑 **IDL Compilado**:
   * [`app/src/lib/seller_dao.json`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/seller_dao.json)
   * *O que é:* O arquivo JSON que descreve os métodos e chaves públicas da governança.

2. 🔗 **Constantes do Smart Contract**:
   * [`app/src/lib/solana.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/solana.ts)
   * *O que é:* Contém o Program ID oficial do Devnet (`FPezMd8XbqDEYXsDgqRW7bpGQ6HDdnjnzMbKpNMjcPkL`), o endereço da moeda de Staking (`DPd4G6RYKrmYKnYTjRRhpJhR45JJjs1mXnkoXibbd5Sg`) e as seeds PDA.

3. 🧠 **Utilitários PDA determinísticos**:
   * [`app/src/lib/pdas.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/lib/pdas.ts)
   * *O que é:* Abstrai o cálculo de chaves públicas on-chain como a conta global da DAO (`daoPda`), contas de tesouro e registros de voto.

4. 🎣 **Custom React Hook**:
   * [`app/src/hooks/useSellerDao.ts`](file:///home/messiasolivindo/Documentos/github/hackanation/app/src/hooks/useSellerDao.ts)
   * *O que é:* O hook que qualquer componente frontend React pode chamar para invocar as 4 transações principais (`joinDao`, `propose`, `vote`, `execute`).

---

## 💻 Como Utilizar no Frontend (Passo a Passo)

### 1. Inicializando o Contexto do Provedor de Carteira
Geralmente configurado no arquivo `app/src/pages/_app.tsx` ou equivalente root:

```typescript
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { DEVNET_RPC } from '../lib/solana';

// CSS do modal padrão de carteiras da Solana
import '@solana/wallet-adapter-react-ui/styles.css';

export default function MyApp({ Component, pageProps }) {
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

### 2. Chamando as Instruções nos Seus Componentes

No seu componente de interface (ex: formulário de criação de proposta ou botão de staking), basta importar e utilizar o hook:

```typescript
import { useState } from 'react';
import { useSellerDao } from '../hooks/useSellerDao';
import { MINT_ADDRESS } from '../lib/solana';
import { PublicKey } from '@solana/web3.js';

export function JoinDaoWidget() {
  const { joinDao } = useSellerDao();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setLoading(true);
      // Deposita 10 tokens (exemplo considerando 6 decimais = 10_000_000)
      const tx = await joinDao(10_000_000, MINT_ADDRESS);
      alert(`Bem-vindo à DAO! Transação confirmada: ${tx}`);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleJoin} disabled={loading}>
      {loading ? "Processando Staking..." : "Entrar na SellerDAO"}
    </button>
  );
}
```

### 3. Criando uma Proposta e Fazendo Repasses
```typescript
import { useSellerDao } from '../hooks/useSellerDao';
import { MINT_ADDRESS } from '../lib/solana';
import { PublicKey } from '@solana/web3.js';

export function CreateProposalWidget() {
  const { propose } = useSellerDao();

  const handlePropose = async () => {
    const fornecedorWallet = new PublicKey("CARTEIRA_DO_FORNECEDOR_AQUI");
    const valorRepasse = 250_000_000; // 250 tokens
    
    const tx = await propose(
      "Contratação de Influenciador de E-commerce",
      "Campanha de marketing para o Q3 para alavancar vendas dos sellers da DAO",
      valorRepasse,
      MINT_ADDRESS,
      fornecedorWallet
    );
    console.log("Proposta registrada on-chain:", tx);
  };

  return <button onClick={handlePropose}>Enviar Proposta de Governança</button>;
}
```

---

## 🛡️ Vantagens de Manter Dentro do `app/`

1. **Deploy sem erros na Vercel**: Todo o código está fisicamente aninhado dentro do diretório `app/`, evitando erros de importação fora do diretório de compilação do Next.js.
2. **Desenvolvimento Agilizado**: A equipe do frontend pode prosseguir de forma 100% paralela a partir deste manual, sem dependência de rodar comandos de CLI locais ou setups complexos de Rust.
