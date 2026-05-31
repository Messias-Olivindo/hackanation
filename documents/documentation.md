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

&ensp; Há ainda um segundo problema, quando um grupo de sellers tenta resolver isso de forma tradicional, isto é,  formando um grupo de compra, um fundo coletivo, qualquer tipo de estrutura compartilhada, alguém precisa guardar o dinheiro. Alguém precisa ser confiável o suficiente para gerir o capital que sustenta as familias que dependem daquele negócio. E é exatamente nesse eixo que esse tipo de iniciativa costuma quebrar, não há infraestrutura que elimine a dependência de confiança interpessoal ou possíveis golpes.

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
&ensp; Fornecedores, transportadoras, atacadistas, creators não precisam saber que existe blockchain. O sistema gera uma wallet custodial vinculada ao CNPJ deles e usa uma integração com fintech brasileira (Brla Digital ou similar) para converter USDC em BRL e depositar via Pix na conta bancária deles. Recebem como se fosse uma transferência normal.

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

# Arquitetura Técnica
## Visão geral da arquitetura
## Stack Tecnológico
## Lógicas das smart contracts
## Fluxo de pagamento off-chain

# Conclusão