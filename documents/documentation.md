# Documentação da Solução - SellerDAO - Hackanation 2026 (3rd edition)

## Integrantes do time
- [Igor Rodrigues](https://www.linkedin.com/in/igor-dasilva-rodrigues/)
- [João Victor Penin Caldeira](https://www.linkedin.com/in/jvpenin/)
- [Messias Olivindo](https://www.linkedin.com/in/messias-olivindo/)

## Sumário
<!-- comming soon -->

# 1. Visão Geral
## 1.1. Problemática
&ensp; O seller pequeno de marketplace não perde para o concorrente por falta de produto, mas sim por custo de estrutura. Um seller que fatura R$ 30k/mês compra estoque pelo preço de balcão, anuncia no leilão mais caro, toma crédito a 4% ao mês e contrata creator de 50k seguidores porque é o que cabe no orçamento. Um seller que fatura R$ 3M/mês faz as mesmas quatro coisas com custo estruturalmente menor.

&ensp; A diferença nunca foi mérito, mas sim volume. O estoque mais barato vem de pedido mínimo que o microempreendedor não atinge. O CPM menor vem de verba que justifica mesa de negociação. O crédito mais barato vem de histórico bancário que leva anos para construir. O creator com audiência real cobra cachê que não faz sentido para o caixa de uma loja que vende 200 unidades por mês.
Nenhum desses problemas tem solução individual. São todos, por definição, problemas de escala. Até agora, escala só existia para quem já era grande.

&ensp; Há ainda um segundo problema, quando um grupo de sellers tenta resolver isso de forma tradicional, isto é, formando um grupo de compra, um fundo coletivo, qualquer tipo de estrutura compartilhada, alguém precisa guardar o dinheiro. Alguém precisa ser confiável o suficiente para gerir o capital que sustenta as familias que dependem daquele negócio. E é exatamente nesse eixo que esse tipo de iniciativa costuma quebrar, não há infraestrutura que elimine a dependência de confiança interpessoal ou possíveis golpes.

## 1.2. Solução Proposta
&ensp; A SellerDAO é uma infraestrutura financeira coletiva para sellers de marketplace, como Mercado Livre, Shopee, TikTok Shop e etc, construída sobre a Solana.

&ensp; A ideia central é permitir que sellers contribuam com um percentual do seu faturamento <strong>validado</strong> para um treasury compartilhado, votem em como usar esse capital, e o smart contract executa automaticamente. Ninguém irá armazenar o dinheiro ou distribuir os pagamentos, o código é o responsável. Enquanto isso, pequenos vendedores aumentam seu poder de barganha/negociação com os fornecedores e diminuem o custo de produção e distribuição dos produtos.

### 1.2.1. Como funciona na prática:

&ensp; O seller conecta a conta do marketplace à plataforma. A API dos marketplaces confirma as vendas realizadas. O sistema calcula a contribuição proporcional e gera uma cobrança: Pix, boleto, cartão ou USDC direto na Solana. Quando o pagamento é confirmado, o valor entra no treasury on-chain.

Marketplace API
↓
Backend SellerDAO
↓
Calcula contribuição (1% do faturamento validado)
↓
Gera cobrança (Pix / boleto / USDC)
↓
Treasury Solana
↓
Votação on-chain → execução automática

&ensp; O treasury acumula o capital e qualquer membro pode propor um uso, seja uma compra coletiva de estoque, contratação de creator para live no TikTok Shop, campanha de mídia em bloco, empréstimo interno para capital de giro. A proposta fica aberta 72 horas para votação. Aprovada, o smart contract executa sem intermediário.

### 1.2.2. Por que Solana?

&ensp; A SellerDAO depende de uma infraestrutura onde movimentar recursos, votar propostas e executar decisões coletivas seja tão simples quanto utilizar qualquer software tradicional. Por isso, blockchain é o que viabiliza nosso modelo.

&ensp; A Solana combina três características essenciais para a operação da SellerDAO. A primeira é o custo extremamente baixo das transações, permitindo que contribuições, votações e distribuições ocorram sem criar atrito para os membros da comunidade. A segunda é a velocidade de confirmação, que possibilita uma experiência praticamente instantânea para ações de governança e movimentação de recursos. A terceira é seu ecossistema financeiro já consolidado, com suporte nativo a USDC, ferramentas maduras de governança, multisigs e infraestrutura de pagamentos.

&ensp; Além da performance da rede, a Solana oferece um ecossistema de desenvolvimento que reduz significativamente a complexidade de implementação. Ferramentas como Anchor, SPL Tokens e Squads permitem construir tesourarias, sistemas de governança e mecanismos de controle financeiro utilizando componentes amplamente testados pelo mercado, acelerando o desenvolvimento e aumentando a segurança da solução.

&ensp; Por fim, a forte presença de stablecoins na Solana torna possível conectar o ambiente on-chain com operações do mundo real. Isso permite que recursos sejam administrados digitalmente dentro da DAO enquanto fornecedores, creators e parceiros continuam recebendo por meios tradicionais, como Pix, sem precisar interagir diretamente com blockchain.

&ensp; A blockchain Solana foi escolhida por ser rápida e reunir, em uma única infraestrutura, custo operacional baixo, experiência de uso fluida e um ecossistema financeiro capaz de sustentar uma organização econômica formada por centenas de sellers independentes.

### 1.2.3. Como funciona para o recebedor

&ensp; Fornecedores, transportadoras, atacadistas, creators não precisam saber que existe blockchain. O sistema gera uma wallet custodial vinculada ao CNPJ deles e usa uma integração com fintech brasileira para converter USDC em BRL e depositar via Pix na conta bancária deles. Recebem como se fosse uma transferência normal.

&ensp; O pagamento sai do treasury via Squads Protocol, um programa de multisig nativo da Solana. Nenhuma pessoa tem a chave privada do treasury. O pagamento só executa quando M-de-N membros assinam, automaticamente, ao atingir o threshold.

## Value Proposition Canvas

&ensp; O Value Proposition Canvas é uma ferramenta de modelagem estratégica utilizada para analisar como um produto ou serviço gera valor para um público específico. Seu objetivo é alinhar a proposta de valor da solução às necessidades, dores e expectativas do cliente, assegurando que o produto resolva problemas relevantes e entregue benefícios claros. Segue o nosso modelo:

<div align="center">
<p>Figura 1 – canvas proposta de valor.</p>
<img src="./assets/canva-proposition-value.png">
<p>Fonte: Próprios autores (2026).</p>
</div>

# Análises de Mercado

# Matriz de Risco

# Produto

## Personas

## Interface e front-end

# 3. Arquitetura Técnica

&ensp; Esta seção apresenta a arquitetura técnica da plataforma SellerDAO, organizada nas subsecções previstas: visão geral da arquitetura, stack tecnológico, lógica das smart contracts, limitações do MVP e o fluxo de pagamento off-chain.

&ensp; O objetivo é mostrar como os componentes se conectam e se comunicam, separando com clareza o que roda **on-chain** — governança, treasury e execução automática de decisões coletivas — do que roda **off-chain** — interfaces de usuário, integrações com marketplaces e compliance financeiro. Essa separação é intencional: o on-chain concentra tudo o que precisa ser imutável e auditável; o off-chain cuida do que exige flexibilidade, adaptação regulatória e integração com o mundo real.

## 3.1. Visão Geral da Arquitetura

&ensp; A arquitetura da SellerDAO é organizada em três camadas que se comunicam em sequência: **interface**, **execução on-chain** e **orquestração off-chain**. Cada camada tem responsabilidades bem delimitadas, o que facilita tanto o desenvolvimento quanto a auditoria do sistema.

&ensp; A **camada de interface** é o que o seller vê e usa — o dashboard web onde ele conecta sua carteira, acompanha o saldo do treasury, cria propostas, vota e monitora execuções. Toda ação iniciada aqui se transforma em uma instrução enviada para o contrato inteligente na Solana.

&ensp; A **camada on-chain** é o núcleo da SellerDAO. É onde o dinheiro coletivo fica guardado, onde os votos são registrados de forma permanente e onde as decisões aprovadas são executadas automaticamente. Nenhuma pessoa tem acesso direto ao treasury: o próprio contrato é o guardião. Tudo o que acontece aqui é público, verificável no Solana Explorer em tempo real e impossível de ser alterado retroativamente.

&ensp; A **camada off-chain** é onde acontece a ponte com o mundo real — validação de faturamento dos sellers via APIs de marketplace, integração com provedores de pagamento para converter USDC em Pix, gestão de compliance (KYC/AML) e processamento assíncrono de eventos. No MVP do hackathon, essa camada é simulada: os dados de vendas são inseridos manualmente e o fluxo de pagamento é demonstrado como hipótese técnica. Na versão de mercado, ela se torna essencial para a operação real da DAO.

&ensp; O diagrama abaixo apresenta a visão geral das três camadas e como elas se relacionam:

<div align="center">
<p>Figura X – Diagrama de arquitetura da SellerDAO.</p>
<!-- diagrama de arquitetura -->

<img src="./assets/diagrama_arquitetura.png">

<p>Fonte: Próprios autores (2026).</p>
</div>

&ensp; No MVP, o seller entra na DAO, cria propostas, vota e acompanha execuções usando apenas o frontend e o contrato on-chain. O fluxo off-chain — validação de marketplace e conversão de pagamento — aparece como simulação. Na versão de mercado, o backend passa a ser indispensável: valida vendas em tempo real, calcula contribuições automaticamente, integra os provedores de pagamento e garante o cumprimento regulatório.

## 3.2. Stack Tecnológico

&ensp; A tabela abaixo resume o stack por módulo, com a justificativa técnica de cada escolha.

| Módulo                        | Tecnologias                                                | Motivo da escolha                                                                                |
| ----------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Frontend**                  | Next.js, TypeScript, TailwindCSS                           | Rapidez de desenvolvimento, tipagem segura, UI consistente e responsiva                          |
| **Web3**                      | `@solana/web3.js`, `@solana/wallet-adapter-react`, Phantom | Integração direta com Solana e carteira amplamente usada no ecossistema                          |
| **On-chain**                  | Rust, Anchor Framework, SPL Token                          | Padrão de desenvolvimento no ecossistema Solana — produtividade, segurança e ferramental maduro  |
| **Multisig / Treasury**       | Squads Protocol                                            | Execução trustless com modelo M-de-N, auditado e em produção em projetos Solana relevantes       |
| **Backend (futuro)**          | NestJS, PostgreSQL, Prisma                                 | Arquitetura escalável, tipada e preparada para integrações com APIs externas e compliance        |
| **Filas de eventos (futuro)** | Redis + BullMQ                                             | Processamento assíncrono e resiliente de eventos de vendas e reconciliação financeira            |
| **Pagamento on-ramp**         | MoonPay                                                    | Fluxo Pix → USDC com KYC/KYB integrado — em validação para o produto                             |
| **Pagamento off-ramp**        | SmartPay                                                   | Fluxo USDC → Pix para fornecedores — em validação para o produto                                 |
| **Compliance**                | KYC/AML + armazenamento seguro                             | Exigência regulatória para operação como provedor de serviço de ativos virtuais (PSAV) no Brasil |

&ensp; Vale destacar três escolhas com impacto direto na viabilidade da proposta. O **Anchor** reduz drasticamente a complexidade de desenvolvimento em Rust para Solana — sem ele, construir as quatro instruções do contrato em 48 horas de hackathon seria inviável. O **Squads Protocol** resolve o problema de custódia do treasury sem exigir que nenhum membro individual seja confiável: o dinheiro só se move quando o threshold de assinaturas for atingido, e isso é garantido pelo código, não por acordos verbais. Por fim, a escolha de **USDC nativo na Solana** — emitido diretamente pela Circle na rede — elimina a necessidade de bridges entre blockchains, simplificando o fluxo e reduzindo pontos de falha.

## 3.3. Lógica das Smart Contracts

&ensp; O contrato inteligente da SellerDAO — escrito em Rust com o framework Anchor — concentra toda a lógica crítica da plataforma: quem pode participar, como as decisões são tomadas, e sob quais condições o dinheiro se move. É ele que torna a DAO verdadeiramente trustless: nenhuma regra de negócio relevante depende de uma pessoa honesta no caminho.

&ensp; A lógica on-chain é organizada em quatro instruções principais, alinhadas ao ciclo de vida da governança. Essa separação reduz acoplamento entre os módulos, facilita auditoria independente e permite que o contrato evolua sem quebrar as funcionalidades existentes.

**`join_dao` — entrada do seller**

&ensp; Quando um seller decide entrar na SellerDAO, ele deposita um stake mínimo de 10 USDC em uma conta PDA (Program Derived Address) — um endereço controlado pelo programa, não por uma carteira privada. Em resposta, o contrato emite tokens de governança proporcionais ao volume de vendas declarado dos últimos 30 dias. Um teto de concentração é aplicado: nenhum seller pode acumular mais do que um determinado percentual do total de tokens em circulação, o que impede que um único seller grande domine as votações. Parte do stake é destinada ao treasury coletivo; o restante é registrado como colateral do membro.

**`propose` — criação de proposta**

&ensp; Qualquer membro ativo pode abrir uma proposta de uso do treasury. A proposta deve especificar: descrição do gasto, valor em USDC, endereço de destino na Solana (wallet do fornecedor ou do gateway de pagamento) e, quando aplicável, o hash da chave Pix do destinatário final — o que permite verificar depois que o pagamento chegou à pessoa certa. A proposta fica aberta para votação por 72 horas a partir da criação.

**`vote` — registro de voto**

&ensp; Membros votam com seus tokens de governança durante a janela de 72 horas. O peso de cada voto é proporcional ao saldo de tokens do membro no momento da votação — quem tem mais tokens de governança tem mais influência, mas dentro dos limites do teto de concentração definido em `join_dao`. Para propostas de alto valor — acima de um threshold definido no contrato — é exigida supermaioria (67%) em vez de maioria simples. O histórico de votos é permanente e público na blockchain.

**`execute` — liberação do treasury**

&ensp; Após o encerramento da janela de 72 horas, qualquer membro pode acionar a instrução de execução. O contrato verifica: (1) o quorum foi atingido, (2) os votos favoráveis superam o threshold exigido, e (3) o timelock de 24 horas pós-aprovação já passou — essa janela existe para que qualquer membro possa contestar uma proposta suspeita antes que o USDC saia. Se todas as condições forem satisfeitas, o Squads Protocol coleta as assinaturas M-de-N dos membros do multisig e executa a transferência automaticamente. Nenhuma pessoa tem a chave privada do treasury — o próprio threshold de assinaturas é a autorização.

&ensp; Na versão de mercado, o contrato recebe entradas de contribuições automatizadas validadas pelo backend — via APIs de marketplace ou conectores de nota fiscal eletrônica —, e as propostas podem carregar regras de rateio mais complexas, como distribuição proporcional ao volume real de vendas de cada membro no período. O núcleo de governança se mantém idêntico; o que evolui é o grau de automação e integração com dados do mundo real.

## 3.4. Limitações do MVP e Escopo

&ensp; O MVP desenvolvido para o hackathon faz escolhas deliberadas de escopo, priorizando a demonstração do núcleo de valor da SellerDAO — governança coletiva trustless e execução automática do treasury — em detrimento de integrações que exigiriam semanas de desenvolvimento e homologação regulatória.

&ensp; **O que está fora do MVP:**

- Integração com APIs de marketplaces (Mercado Livre, Shopee, TikTok Shop) para validação automática de faturamento. No MVP, os volumes de vendas são inseridos manualmente ou via CSV.
- Integração com provedores de pagamento em produção (MoonPay, SmartPay). O fluxo Pix ↔ USDC é demonstrado como hipótese técnica viável, não como integração ativa.
- KYC/AML automatizado para onboarding de sellers e fornecedores.
- Backend de reconciliação e processamento de eventos em tempo real.

&ensp; **O que está entregue no MVP:**

- Contrato Anchor com as quatro instruções de governança deployado na Devnet da Solana.
- Treasury visível e verificável no Solana Explorer — o argumento mais imediato de transparência para a banca.
- Frontend com dashboard de propostas, votação em tempo real e histórico de execuções, conectado via Phantom.

&ensp; Essa limitação é proposital. Um MVP que tenta integrar marketplace, fintech e compliance ao mesmo tempo em 48 horas entrega nenhum deles com qualidade. A SellerDAO prefere demonstrar com precisão o problema que blockchain realmente resolve — a custódia e execução trustless de recursos coletivos — e apresentar o restante como roadmap fundamentado tecnicamente.

## 3.5. Fluxo de Pagamento Off-chain

&ensp; O fluxo de pagamento é a camada que conecta o treasury em USDC, que existe dentro da blockchain Solana, com o mundo real dos fornecedores — transportadoras, atacadistas, creators — que recebem e operam em reais via Pix. O princípio que governa esse fluxo é o mesmo do restante da plataforma: nenhum pagamento acontece antes da aprovação on-chain, e nenhuma etapa depende de uma pessoa honesta no meio do caminho.

&ensp; O diagrama de sequência abaixo ilustra os dois sentidos do fluxo — entrada (Pix → USDC) e saída (USDC → Pix) — e os atores envolvidos em cada etapa:

<div align="center">
<p>Figura X – Diagrama de sequência do fluxo de pagamento off-chain.</p>
<!-- diagrama de sequência -->

<img src="./assets/diagrama_uml.png">

<p>Fonte: Próprios autores (2026).</p>
</div>

### 3.5.1. Entrada de recursos: Pix → USDC (on-ramp)

&ensp; Quando um seller precisa depositar recursos no treasury ou contribuir com sua parcela mensal, o processo começa por ele, em reais, via Pix — o método de pagamento que já é parte do cotidiano de qualquer brasileiro. Nos bastidores, o seguinte acontece:

1. O frontend da SellerDAO solicita ao provedor de on-ramp (MoonPay, em validação) a geração de um QR Code Pix com o valor correspondente à contribuição do seller. A cotação BRL/USDC é travada por 15 minutos.
2. O seller escaneia o QR Code em qualquer banco ou carteira digital e paga. A liquidação via Pix ocorre em segundos, 24 horas por dia, inclusive fins de semana e feriados.
3. O provedor detecta a liquidação do Pix, converte o valor em USDC e o envia diretamente para o endereço do treasury na Solana.
4. O sistema da SellerDAO monitora o treasury via RPC da Solana. O acesso do seller como membro — e a emissão dos seus tokens de governança — só é liberado após confirmação on-chain do depósito. O aviso do provedor dispara a consulta; a blockchain é a autoridade final.

### 3.5.2. Saída de recursos: USDC → Pix (off-ramp)

&ensp; Quando uma proposta é aprovada e executada on-chain, o USDC precisa chegar ao fornecedor em reais, via Pix, sem que o fornecedor precise saber que existe blockchain. O processo:

1. A instrução `execute` do contrato Anchor, após verificar aprovação e timelock, aciona o Squads Protocol para transferir USDC do treasury para o endereço do provedor de off-ramp (SmartPay, em validação).
2. O servidor da SellerDAO monitora a blockchain via Solana SDK com fila de reprocessamento (BullMQ) — garantindo que, mesmo em caso de falha momentânea, nenhuma proposta aprovada deixa de ser executada.
3. O provedor recebe o USDC, converte para BRL e realiza um Pix para a chave registrada pelo fornecedor no momento do cadastro.
4. A chave Pix do fornecedor foi incluída como campo na proposta on-chain — em formato de hash criptográfico — no momento em que a proposta foi criada. Isso permite que qualquer membro verifique depois que o pagamento foi realizado para o destinatário correto, sem expor os dados bancários do fornecedor publicamente na blockchain.

### 3.5.3. Abstração para o fornecedor

&ensp; Fornecedores, transportadoras, atacadistas e creators **não precisam interagir com blockchain em nenhum momento**. O cadastro deles na plataforma é idêntico ao de qualquer fintech: CNPJ ou CPF, dados bancários e chave Pix. O sistema gera internamente uma carteira Solana custodial vinculada ao CNPJ deles — essa carteira é o ponto de chegada do USDC antes da conversão para Pix. Para o fornecedor, o que aparece na conta bancária é uma transferência em reais, como qualquer outra.

&ensp; A entidade operadora da SellerDAO — registrada como LTDA ou cooperativa no Brasil — é responsável pelo KYC e AML dos fornecedores, assumindo as mesmas obrigações que qualquer fintech ou plataforma de pagamento que gerencie recursos de terceiros. Esse modelo já é praticado por empresas similares no mercado brasileiro.

### 3.5.4. Provedores de pagamento considerados

&ensp; O projeto avalia dois provedores para o fluxo completo Pix ↔ USDC na Solana:

- **MoonPay** — para o fluxo de entrada (Pix → USDC). Possui APIs e SDKs documentados, KYC/KYB integrado e suporte a virtual accounts. A compatibilidade específica com Pix e USDC na Solana está em processo de validação técnica com a equipe do provedor.
- **SmartPay** — para o fluxo de saída (USDC → Pix). Avaliado pela capacidade de liquidação em reais via Pix a partir de USDC na Solana. Igualmente em validação.

&ensp; No MVP do hackathon, ambos os provedores são representados como simulação no frontend, sem integração ativa nem uso de chaves privadas ou dados sensíveis. O fluxo completo será implementado na versão de produto, após validação técnica e assinatura dos contratos de parceria.

# Conclusão
