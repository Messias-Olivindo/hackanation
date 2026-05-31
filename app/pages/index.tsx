import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../src/components/ui/Navbar';
import { Button } from '../src/components/ui/Button';

const steps = [
  {
    n: '01',
    title: 'Conecte seu marketplace',
    desc: 'Mercado Livre, Shopee, TikTok Shop. A API valida seu faturamento real.',
  },
  {
    n: '02',
    title: 'Contribua 1% do seu faturamento',
    desc: 'Pix, boleto ou USDC. O valor entra automaticamente no treasury coletivo on-chain.',
  },
  {
    n: '03',
    title: 'Vote e ganhe poder de compra',
    desc: 'Proponha usos para o capital. Aprovado, o smart contract executa sem intermediário.',
  },
];

const benefits = [
  { icon: '📦', title: 'Estoque coletivo', desc: 'Pedido mínimo que você nunca atingiria sozinho. Preço de indústria.' },
  { icon: '🎥', title: 'Creators de verdade', desc: 'Lives no TikTok Shop com audiência real, custo dividido entre a DAO.' },
  { icon: '📣', title: 'Mídia em bloco', desc: 'CPM menor com verba coletiva que justifica mesa de negociação.' },
  { icon: '💸', title: 'Crédito interno', desc: 'Capital de giro com taxa justa, lastreado no histórico de contribuição.' },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SellerDAO — Poder coletivo para sellers de marketplace</title>
        <meta name="description" content="Infraestrutura financeira coletiva para sellers de marketplace, construída na Solana." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1e1e35] text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            Construído na Solana
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
            Escala que{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              só os grandes
            </span>{' '}
            tinham
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sellers de marketplace se unem em uma DAO para comprar estoque, contratar creators e
            negociar mídia com o poder de quem fatura milhões — mesmo faturando 30k.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/onboarding">
              <Button size="lg">Entrar na DAO</Button>
            </Link>
            <Link href="/proposals">
              <Button variant="outline" size="lg">Ver propostas ativas</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { value: 'R$ 847k', label: 'No treasury' },
              { value: '142', label: 'Sellers ativos' },
              { value: '23', label: 'Propostas aprovadas' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problema */}
        <section className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#9945FF] mb-4 uppercase tracking-wider">O problema</p>
              <h2 className="text-3xl font-bold mb-6 leading-snug">
                A diferença nunca foi mérito. Foi volume.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Quem fatura R$ 30k/mês compra estoque pelo preço de balcão, paga CPM cheio e toma
                crédito a 4% ao mês. Quem fatura R$ 3M faz as mesmas quatro coisas — com custo
                estruturalmente menor.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Nenhum desses problemas tem solução individual. São todos, por definição,
                problemas de escala. Até agora, escala só existia para quem já era grande.
              </p>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-sm font-medium text-[#9945FF] mb-4 uppercase tracking-wider">Como funciona</p>
            <h2 className="text-3xl font-bold mb-12">Três passos para escalar junto</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.n} className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-6">
                  <div
                    className="text-4xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-sm font-medium text-[#9945FF] mb-4 uppercase tracking-wider">O que você ganha</p>
            <h2 className="text-3xl font-bold mb-12">Capital coletivo, decisão democrática</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-6 flex gap-4">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que Solana */}
        <section className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div
              className="rounded-2xl p-px"
              style={{ background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)' }}
            >
              <div className="bg-[#0d0d1a] rounded-2xl p-10 md:p-14">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <p className="text-sm font-medium text-[#9945FF] mb-4 uppercase tracking-wider">Por que Solana</p>
                    <h2 className="text-3xl font-bold mb-4">Nenhuma pessoa guarda o dinheiro</h2>
                    <p className="text-gray-400 leading-relaxed">
                      O treasury vive num smart contract. Ninguém tem a chave privada.
                      Pagamentos só executam quando a votação aprova — automaticamente,
                      sem intermediário. Taxa de transação menor que R$ 0,01.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      ['~0,00025¢', 'por transação na Solana'],
                      ['< 400ms', 'para confirmar uma votação'],
                      ['M-de-N multisig', 'Squads Protocol — sem chave única'],
                    ].map(([val, label]) => (
                      <div key={label} className="flex items-center gap-4">
                        <div
                          className="text-xl font-bold whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {val}
                        </div>
                        <div className="text-gray-400 text-sm">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">Pronto para escalar junto?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Conecte seu marketplace e faça parte da DAO em menos de 3 minutos.
            </p>
            <Link href="/onboarding">
              <Button size="lg">Começar agora</Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1e1e35]">
          <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded"
                style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
              />
              <span>SellerDAO</span>
            </div>
            <span>Hackanation 2026 — Igor, João Victor, Messias</span>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
