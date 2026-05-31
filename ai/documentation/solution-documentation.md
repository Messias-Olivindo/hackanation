# Documentacao da Solucao - SellerDAO - Hackanation 2026 (3rd edition)

## Integrantes do time

- [Igor Rodrigues](https://www.linkedin.com/in/igor-dasilva-rodrigues/)
- [Joao Victor Penin Caldeira](https://www.linkedin.com/in/jvpenin/)
- [Messias Olivindo](https://www.linkedin.com/in/messias-olivindo/)

## Sumario

<!-- coming soon -->

# 1. Visao Geral

## 1.1. Problematica

O seller pequeno de marketplace nao perde para o concorrente por falta de produto, mas sim por custo de estrutura. Um seller que fatura R$ 30k/mes compra estoque pelo preco de balcao, anuncia no leilao mais caro, toma credito a 4% ao mes e contrata creator de 50k seguidores porque e o que cabe no orcamento. Um seller que fatura R$ 3M/mes faz as mesmas quatro coisas com custo estruturalmente menor.

A diferenca nunca foi merito, mas sim volume. O estoque mais barato vem de pedido minimo que o microempreendedor nao atinge. O CPM menor vem de verba que justifica mesa de negociacao. O credito mais barato vem de historico bancario que leva anos para construir. O creator com audiencia real cobra cache que nao faz sentido para o caixa de uma loja que vende 200 unidades por mes.
Nenhum desses problemas tem solucao individual. Sao todos, por definicao, problemas de escala. Ate agora, escala so existia para quem ja era grande.

Ha ainda um segundo problema, quando um grupo de sellers tenta resolver isso de forma tradicional, isto e, formando um grupo de compra, um fundo coletivo, qualquer tipo de estrutura compartilhada, alguem precisa guardar o dinheiro. Alguem precisa ser confiavel o suficiente para gerir o capital que sustenta as familias que dependem daquele negocio. E e exatamente nesse eixo que esse tipo de iniciativa costuma quebrar, nao ha infraestrutura que elimine a dependencia de confianca interpessoal ou possiveis golpes.

## 1.2. Solucao Proposta

A SellerDAO e uma infraestrutura financeira coletiva para sellers de marketplace, como Mercado Livre, Shopee, TikTok Shop e etc, construida sobre a Solana.

A ideia central e permitir que sellers contribuam com um percentual do seu faturamento validado para um treasury compartilhado, votem em como usar esse capital, e o smart contract executa automaticamente. Ninguem ira armazenar o dinheiro ou distribuir os pagamentos, o codigo e o responsavel. Enquanto isso, pequenos vendedores aumentam seu poder de barganha/negociacao com os fornecedores e diminuem o custo de producao e distribuicao dos produtos.

### 1.2.1. Como funciona na pratica

O seller conecta a conta do marketplace a plataforma. A API dos marketplaces confirma as vendas realizadas. O sistema calcula a contribuicao proporcional e gera uma cobranca: Pix, boleto, cartao ou USDC direto na Solana. Quando o pagamento e confirmado, o valor entra no treasury on-chain.

Marketplace API
↓
Backend SellerDAO
↓
Calcula contribuicao (1% do faturamento validado)
↓
Gera cobranca (Pix / boleto / USDC)
↓
Treasury Solana
↓
Votacao on-chain → execucao automatica

O treasury acumula o capital e qualquer membro pode propor um uso, seja uma compra coletiva de estoque, contratacao de creator para live no TikTok Shop, campanha de midia em bloco, emprestimo interno para capital de giro. A proposta fica aberta 72 horas para votacao. Aprovada, o smart contract executa sem intermediario.

### 1.2.2. O que a blockchain resolve

Transparencia: qualquer membro ve o saldo do treasury e o historico completo de movimentacoes no Solana Explorer, em tempo real, sem depender de relatorio de ninguem.

Governanca: o peso de cada voto e proporcional ao faturamento validado, ou seja, quem contribui mais tem mais voz, com teto de concentracao para evitar que um seller domine o grupo.

Distribuicao automatica: o beneficio de cada acao coletiva volta para os membros proporcionalmente ao volume do periodo, sem planilha, sem pessoa calculando, sem discussao.

### 1.2.3. Como funciona para o recebedor

Fornecedores, transportadoras, atacadistas, creators nao precisam saber que existe blockchain. O sistema gera uma wallet custodial vinculada ao CNPJ deles e usa uma integracao com fintech brasileira (Brla Digital ou similar) para converter USDC em BRL e depositar via Pix na conta bancaria deles. Recebem como se fosse uma transferencia normal.

O pagamento sai do treasury via Squads Protocol, um programa de multisig nativo da Solana. Nenhuma pessoa tem a chave privada do treasury. O pagamento so executa quando M-de-N membros assinam, automaticamente, ao atingir o threshold.

# Value Proposition Canvas

O Value Proposition Canvas e uma ferramenta de modelagem estrategica utilizada para analisar como um produto ou servico gera valor para um publico especifico. Seu objetivo e alinhar a proposta de valor da solucao as necessidades, dores e expectativas do cliente, assegurando que o produto resolva problemas relevantes e entregue beneficios claros. Segue o nosso modelo:

<div align="center">
<p>Figura 1 – canvas proposta de valor.</p>
<img src="./assets/canva-proposition-value.png">
<p>Fonte: Proprios autores (2026).</p>
</div>

# Analises de Mercado

# Matriz de Risco

# Produto

## Personas

## Interface e front-end

# Arquitetura Tecnica

## Visao geral da arquitetura

## Stack Tecnologico

## Logicas das smart contracts

## Fluxo de pagamento off-chain

# Conclusao
