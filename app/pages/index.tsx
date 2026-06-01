import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const MKT: Record<string, { block: string[]; free: string[] }> = {
  'Mercado Livre': {
    block: ['Frete (Mercado Envios fixo)', 'Taxa da plataforma', 'Algoritmo de ranking'],
    free: ['Estoque e fornecedor', 'Anúncio externo (tráfego)', 'Capital de giro'],
  },
  'Shopee': {
    block: ['Frete subsidiado pela Shopee', 'Moedas Shopee'],
    free: ['Fornecedor / atacado', 'Lives e afiliados externos', 'Antecipação de recebíveis'],
  },
  'TikTok Shop': {
    block: ['Comissão de afiliado (fixa)', 'Algoritmo de feed'],
    free: ['Contratação de creators', 'Produção de conteúdo', 'Estoque pré-posicionado'],
  },
};

const STEPS = [
  {
    n: 1,
    lab: 'Conectar operação',
    ix: 'OAuth · API',
    k: 'Passo 1 · Integração real',
    h: 'Conecta com seu marketplace e ERP',
    p: 'A Guild integra de verdade via API ao Mercado Livre, Shopee e TikTok Shop, e ao seu ERP (Bling, Tiny). O faturamento é lido automaticamente — sem planilha, sem digitar venda.',
  },
  {
    n: 2,
    lab: 'Definir contribuição',
    ix: 'join_dao · stake',
    k: 'Passo 2 · Treasury',
    h: 'Você define quanto do faturamento entra',
    p: 'O seller escolhe a taxa mínima do faturamento mensal que vira contribuição. A cada venda lida pela integração, o valor é depositado automaticamente em USDC na treasury coletiva — visível on-chain.',
  },
  {
    n: 3,
    lab: 'Propor & votar',
    ix: 'propose · vote',
    k: 'Passo 3 · Governança',
    h: 'Seu peso de voto vem da contribuição',
    p: 'Qualquer membro propõe um uso do treasury. O peso do voto é proporcional ao quanto cada seller contribui — quem mais sustenta o coletivo decide com mais força. Janela de 72h, maioria simples.',
  },
  {
    n: 4,
    lab: 'Execução trustless',
    ix: 'execute',
    k: 'Passo 4 · Pagamento',
    h: 'Fornecedor recebe no Pix',
    p: 'Aprovada, a transferência sai do treasury via PDA. Uma fintech converte USDC → BRL e dispara o Pix. O fornecedor recebe como uma TED normal — sem intermediários.',
  },
];

const Home: NextPage = () => {
  const [mkActive, setMkActive] = useState<string>('Mercado Livre');
  const [stepActive, setStepActive] = useState<number>(0);
  const isAutoplayRef = useRef<boolean>(true);

  // Autoplay for steps
  useEffect(() => {
    const timer = setInterval(() => {
      if (isAutoplayRef.current) {
        setStepActive((prev) => (prev + 1) % STEPS.length);
      }
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  const handleStepClick = (index: number) => {
    isAutoplayRef.current = false;
    setStepActive(index);
  };

  const xIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5484d" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );

  const cIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06BF8B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans min-h-screen selection:bg-green-200 selection:text-green-950">
      <Head>
        <title>Guild — Poder coletivo para sellers</title>
        <meta name="description" content="Infraestrutura financeira coletiva para sellers de marketplace, construída na Solana." />
      </Head>

      {/* shared logo + net defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#07F2B0" />
            <stop offset="1" stopColor="#06BF8B" />
          </linearGradient>
        </defs>
      </svg>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 flex items-center justify-between h-[68px]">
          <Link href="/" className="flex items-center gap-[11px]">
            <svg className="w-[34px] h-[34px]" viewBox="0 0 100 100">
              <path d="M75.98 65 A30 30 0 1 1 75.98 35" fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round" />
              <rect x="48" y="44" width="30" height="12" rx="6" fill="url(#gg)" />
              <circle cx="20" cy="50" r="6.5" fill="url(#gg)" />
              <circle cx="76" cy="50" r="6.5" fill="url(#gg)" />
              <circle cx="76" cy="65" r="5.5" fill="#96D9C0" />
            </svg>
            <span className="font-sans font-extrabold text-[1.25rem] leading-none tracking-tight text-neutral-900">
              Guild<span className="text-[#06BF8B]">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-7">
            <a className="hidden md:inline-block font-sans font-semibold text-[0.9rem] leading-none text-neutral-600 hover:text-neutral-900 transition-colors" href="#problema">O problema</a>
            <a className="hidden md:inline-block font-sans font-semibold text-[0.9rem] leading-none text-neutral-600 hover:text-neutral-900 transition-colors" href="#como">Como funciona</a>
            <a className="hidden md:inline-block font-sans font-semibold text-[0.9rem] leading-none text-neutral-600 hover:text-neutral-900 transition-colors" href="#casos">Casos de uso</a>
            <Link href="/painel" className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-[0.9375rem] leading-none px-[18px] py-[11px] rounded-sm bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand">
              Ver demonstração
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-dark text-emerald-100/90 py-16 md:py-28" id="top">
        <svg className="absolute inset-0 w-full h-full opacity-55 object-cover" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g stroke="#2EE6A6" strokeWidth="1" opacity="0.5">
            <line x1="120" y1="90" x2="330" y2="190" />
            <line x1="330" y1="190" x2="560" y2="110" />
            <line x1="560" y1="110" x2="800" y2="220" />
            <line x1="800" y1="220" x2="1040" y2="130" />
            <line x1="330" y1="190" x2="440" y2="390" />
            <line x1="440" y1="390" x2="720" y2="420" />
            <line x1="720" y1="420" x2="800" y2="220" />
            <line x1="440" y1="390" x2="180" y2="350" />
            <line x1="180" y1="350" x2="120" y2="90" />
            <line x1="1040" y1="130" x2="980" y2="370" />
            <line x1="980" y1="370" x2="720" y2="420" />
          </g>
          <g fill="#5BE8BE">
            <circle cx="120" cy="90" r="5" />
            <circle cx="330" cy="190" r="6" />
            <circle cx="560" cy="110" r="5" />
            <circle cx="800" cy="220" r="6" />
            <circle cx="1040" cy="130" r="5" />
            <circle cx="440" cy="390" r="6" />
            <circle cx="720" cy="420" r="5" />
            <circle cx="180" cy="350" r="5" />
            <circle cx="980" cy="370" r="5" />
          </g>
        </svg>
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 relative flex flex-col items-start">
          <div className="inline-flex items-center gap-[9px] font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-300 border border-green-200/30 px-[15px] py-2 rounded-full mb-7">
            <span className="w-[7px] h-[7px] rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(7,242,176,0.25)]"></span>
            Infraestrutura financeira coletiva · Solana
          </div>
          <h1 className="font-sans font-extrabold text-[2.5rem] md:text-[4.25rem] leading-[1.06] tracking-tight text-white max-w-[16ch] text-balance">
            O poder de uma grande operação, na mão de <em className="not-italic text-green-400">cada seller</em>.
          </h1>
          <p className="font-sans font-normal text-[1.0625rem] md:text-[1.25rem] leading-relaxed text-green-100 max-w-[56ch] my-9 text-pretty">
            O seller pequeno sozinho nunca vai negociar com a transportadora. Cem sellers com treasury coletivo e voto on-chain, sim. A Guild transforma escala em poder de barganha — sem depender de confiança, só de código.
          </p>
          <div className="flex gap-[14px] flex-wrap items-center">
            <Link href="/painel" className="inline-flex items-center justify-center gap-[9px] font-sans font-semibold text-[1.0625rem] leading-none px-7 py-4 rounded-md bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand">
              Ver demonstração ao vivo
              <svg className="w-[17px] h-[17px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a className="inline-flex items-center justify-center gap-[9px] font-sans font-semibold text-[1.0625rem] leading-none px-7 py-4 rounded-md bg-white/10 text-white border border-green-200/30 hover:bg-white/16 active:translate-y-[1px] transition-all" href="#como">
              Como funciona
            </a>
          </div>
          <div className="flex gap-7 md:gap-14 flex-wrap mt-14 pt-8 border-t border-green-200/18 w-full">
            <div className="flex-1 min-w-[200px]">
              <div className="font-sans font-extrabold text-[1.6rem] md:text-[2.25rem] leading-none text-white tracking-tight tabular-nums">
                30–40<small className="font-mono text-[0.85rem] text-green-300 font-medium">%</small>
              </div>
              <div className="font-sans font-normal text-sm text-green-200 mt-2 max-w-[22ch]">de desconto em estoque por compra coletiva</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-sans font-extrabold text-[1.6rem] md:text-[2.25rem] leading-none text-white tracking-tight tabular-nums">
                R$ 14<small className="font-mono text-[0.85rem] text-green-300 font-medium">/pacote</small>
              </div>
              <div className="font-sans font-normal text-sm text-green-200 mt-2 max-w-[22ch]">de frete, contra R$ 28 do seller isolado</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="font-sans font-extrabold text-[1.6rem] md:text-[2.25rem] leading-none text-white tracking-tight tabular-nums">0</div>
              <div className="font-sans font-normal text-sm text-green-200 mt-2 max-w-[22ch]">intermediários humanos no pagamento</div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEMA */}
      <section className="py-16 md:py-28" id="problema">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div>
            <div className="inline-flex items-center gap-2 font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-700 bg-green-50 px-[13px] py-1.5 rounded-full mb-5">
              ● O problema
            </div>
            <h2 className="font-sans font-extrabold text-[1.9rem] md:text-[2.75rem] leading-[1.08] tracking-tight text-neutral-900 max-w-[18ch] text-balance">
              A diferença nunca foi mérito. Foi escala.
            </h2>
            <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-neutral-600 max-w-[60ch] mt-4 text-pretty">
              Um seller que fatura R$ 30 mil compra estoque no balcão, disputa o leilão de mídia mais caro e toma crédito a 4% ao mês. Um que fatura R$ 3 milhões faz as mesmas coisas por uma fração do custo. A Guild dá a quem é pequeno o custo de quem é grande.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            <div className="rounded-xl p-8 border border-neutral-200 bg-neutral-25">
              <div className="flex items-center gap-[10px] font-sans font-bold text-[1.05rem] leading-none mb-1.5 text-neutral-900">
                Seller isolado
              </div>
              <div className="font-sans font-normal text-sm text-neutral-500 mb-6">Competindo sozinho nos espaços livres do marketplace</div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-neutral-200">
                <span className="font-sans font-normal text-sm text-neutral-600 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-white border border-neutral-200 grid place-items-center text-neutral-400 flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  Compra de estoque
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-neutral-500 whitespace-nowrap">Preço de balcão</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-neutral-200">
                <span className="font-sans font-normal text-sm text-neutral-600 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-white border border-neutral-200 grid place-items-center text-neutral-400 flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  Frete (canal próprio)
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-neutral-500 whitespace-nowrap">R$ 28/pacote</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-neutral-200">
                <span className="font-sans font-normal text-sm text-neutral-600 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-white border border-neutral-200 grid place-items-center text-neutral-400 flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  Capital de giro
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-neutral-500 whitespace-nowrap">4% a.m.</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-neutral-200">
                <span className="font-sans font-normal text-sm text-neutral-600 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-white border border-neutral-200 grid place-items-center text-neutral-400 flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  Creator para live
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-neutral-500 whitespace-nowrap">Sem acesso</span>
              </div>
            </div>

            <div className="rounded-xl p-8 bg-gradient-dark text-emerald-100/90 border border-transparent shadow-lg">
              <div className="flex items-center gap-[10px] font-sans font-bold text-[1.05rem] leading-none mb-1.5 text-white">
                <svg width="20" height="20" viewBox="0 0 100 100" className="mr-1">
                  <path d="M75.98 65 A30 30 0 1 1 75.98 35" fill="none" stroke="url(#gg)" strokeWidth="13" strokeLinecap="round" />
                  <rect x="48" y="43" width="30" height="13" rx="6.5" fill="url(#gg)" />
                  <circle cx="20" cy="50" r="7" fill="url(#gg)" />
                  <circle cx="76" cy="50" r="7" fill="url(#gg)" />
                </svg>
                Sellers na Guild
              </div>
              <div className="font-sans font-normal text-sm text-green-200 mb-6">Atuando como uma só organização econômica</div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-green-200/16">
                <span className="font-sans font-normal text-sm text-green-100 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-green-400/16 text-green-300 grid place-items-center flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Compra coletiva no atacado
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-green-400 whitespace-nowrap">−30 a 40%</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-green-200/16">
                <span className="font-sans font-normal text-sm text-green-100 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-green-400/16 text-green-300 grid place-items-center flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Contrato coletivo de frete
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-green-400 whitespace-nowrap">R$ 14–16</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-green-200/16">
                <span className="font-sans font-normal text-sm text-green-100 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-green-400/16 text-green-300 grid place-items-center flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Empréstimo interno do treasury
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-green-400 whitespace-nowrap">~1,5% a.m.</span>
              </div>
              <div className="flex items-center justify-between gap-3.5 py-[15px] border-t border-green-200/16">
                <span className="font-sans font-normal text-sm text-green-100 flex items-center gap-[10px]">
                  <span className="w-[22px] h-[22px] rounded-xs bg-green-400/16 text-green-300 grid place-items-center flex-none">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  Creator pool rateado
                </span>
                <span className="font-sans font-bold text-[0.95rem] leading-none text-green-400 whitespace-nowrap">R$ 4 mil → R$ 400</span>
              </div>
            </div>
          </div>

          <div className="mt-10 bg-white border border-neutral-200 rounded-xl p-7 shadow-sm">
            <div className="font-sans font-bold text-[1.05rem] leading-none mb-1.5 text-neutral-900">
              A Guild não briga com o marketplace.
            </div>
            <p className="font-sans font-normal text-sm text-neutral-500 mb-6">
              Ela age nos espaços que o marketplace não controla. Veja por plataforma:
            </p>
            <div className="flex gap-2 flex-wrap mb-6">
              {Object.keys(MKT).map((k) => (
                <button
                  key={k}
                  className={`font-sans font-semibold text-[0.9rem] leading-none px-[18px] py-[11px] rounded-full cursor-pointer transition-all border border-transparent ${
                    k === mkActive
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:border-green-300'
                  }`}
                  onClick={() => setMkActive(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-lg p-5.5 bg-danger-bg/50 border border-danger-bg">
                <div className="flex items-center gap-[9px] font-sans font-bold text-[0.92rem] leading-none text-danger-fg mb-3.5">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="mr-1">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12h8" />
                  </svg>
                  Bloqueado pelo marketplace
                </div>
                <ul className="flex flex-col gap-[11px]">
                  {MKT[mkActive].block.map((item) => (
                    <li key={item} className="font-sans text-sm text-[#9a4044] flex items-center gap-[9px]">
                      {xIcon}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg p-5.5 bg-green-50/50 border border-green-100/50">
                <div className="flex items-center gap-[9px] font-sans font-bold text-[0.92rem] leading-none text-green-800 mb-3.5">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Livre para a Guild atuar
                </div>
                <ul className="flex flex-col gap-[11px]">
                  {MKT[mkActive].free.map((item) => (
                    <li key={item} className="font-sans text-sm text-green-900 flex items-center gap-[9px]">
                      {cIcon}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 md:py-28 bg-neutral-100/60 border-y border-neutral-200/50" id="como">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div>
            <div className="inline-flex items-center gap-2 font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-700 bg-green-50 px-[13px] py-1.5 rounded-full mb-5">
              ● Como funciona
            </div>
            <h2 className="font-sans font-extrabold text-[1.9rem] md:text-[2.75rem] leading-[1.08] tracking-tight text-neutral-900 max-w-[18ch] text-balance">
              Quatro passos. Zero confiança em terceiros.
            </h2>
            <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-neutral-600 max-w-[60ch] mt-4 text-pretty">
              Nenhuma etapa — entrada, treasury, votação ou execução — passa pela mão de um único ser humano. O smart contract na Solana é o custodiante neutro.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-[18px] flex-wrap p-5 bg-white border border-neutral-200 rounded-lg shadow-xs">
            <span className="font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-neutral-400">Integração real com</span>
            <div className="flex gap-2 flex-wrap">
              <span className="font-sans font-semibold text-[0.85rem] leading-none text-neutral-600 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-full">Mercado Livre</span>
              <span className="font-sans font-semibold text-[0.85rem] leading-none text-neutral-600 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-full">Shopee</span>
              <span className="font-sans font-semibold text-[0.85rem] leading-none text-neutral-600 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-full">TikTok Shop</span>
              <span className="font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-neutral-400 bg-transparent border-transparent px-1 py-2.5 rounded-full">ERP</span>
              <span className="font-sans font-semibold text-[0.85rem] leading-none text-neutral-600 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-full">Bling</span>
              <span className="font-sans font-semibold text-[0.85rem] leading-none text-neutral-600 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-full">Tiny</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 mt-8 items-start">
            <div className="flex flex-col gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s.n}
                  className={`flex items-center gap-3.5 p-4 rounded-md border text-left cursor-pointer transition-all ${
                    i === stepActive
                      ? 'border-green-500 bg-green-50/60 shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-green-300'
                  }`}
                  onClick={() => handleStepClick(i)}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-extrabold text-[0.9rem] leading-none flex-none transition-all ${
                    i === stepActive ? 'bg-green-500 text-[#042A20]' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {s.n}
                  </span>
                  <span className="font-sans font-semibold text-[0.95rem] leading-tight block">
                    <span className={`block font-sans ${i === stepActive ? 'text-green-950 font-bold' : 'text-neutral-600'}`}>
                      {s.lab}
                    </span>
                    <small className="block font-mono text-[0.7rem] text-neutral-400 font-normal mt-1">{s.ix}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="relative overflow-hidden bg-gradient-dark text-white rounded-xl p-10 min-h-[340px] shadow-lg">
              <svg className="absolute inset-0 w-full h-full opacity-40 object-cover" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <g stroke="#2EE6A6" strokeWidth="1" opacity="0.5">
                  <line x1="60" y1="60" x2="200" y2="140" />
                  <line x1="200" y1="140" x2="360" y2="80" />
                  <line x1="360" y1="80" x2="520" y2="160" />
                  <line x1="200" y1="140" x2="260" y2="280" />
                  <line x1="260" y1="280" x2="460" y2="300" />
                  <line x1="460" y1="300" x2="520" y2="160" />
                </g>
                <g fill="#5BE8BE">
                  <circle cx="60" cy="60" r="4" />
                  <circle cx="200" cy="140" r="5" />
                  <circle cx="360" cy="80" r="4" />
                  <circle cx="520" cy="160" r="5" />
                  <circle cx="260" cy="280" r="5" />
                  <circle cx="460" cy="300" r="4" />
                </g>
              </svg>
              <div className="relative z-10">
                <div className="font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-300 mb-4">
                  {STEPS[stepActive].k}
                </div>
                <h3 className="font-sans font-extrabold text-[1.75rem] leading-[1.1] text-white mb-3.5 tracking-tight">
                  {STEPS[stepActive].h}
                </h3>
                <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-green-100 max-w-[48ch] mb-6">
                  {STEPS[stepActive].p}
                </p>
                <span className="inline-flex items-center gap-2 font-mono text-[0.8rem] text-green-300 bg-green-400/10 border border-green-200/20 px-3.5 py-2.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#07F2B0]"></span>
                  instrução on-chain: {STEPS[stepActive].ix}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="py-16 md:py-28" id="casos">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-700 bg-green-50 px-[13px] py-1.5 rounded-full mb-5">
              ● Casos de uso
            </div>
            <h2 className="font-sans font-extrabold text-[1.9rem] md:text-[2.75rem] leading-[1.08] tracking-tight text-neutral-900 max-w-[18ch] text-balance">
              Poder coletivo programável, por categoria
            </h2>
            <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-neutral-600 max-w-[60ch] mt-4 text-pretty">
              Qualquer membro propõe; o coletivo vota; o treasury executa. O benefício é rateado proporcionalmente, automaticamente.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            <div className="bg-white border border-neutral-200 rounded-lg p-6.5 hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all shadow-xs">
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[0.72rem] tracking-wider uppercase bg-[#EAF4EF] text-[#04785A] px-2 py-1 rounded-xs mb-[18px]">
                Estoque
              </span>
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-neutral-900">Compra coletiva no atacado</h4>
              <p className="font-sans text-sm text-neutral-500 mb-5 leading-normal">Sellers destravam o pedido mínimo do fornecedor. O treasury paga, o estoque é rateado por volume.</p>
              <div className="font-sans font-extrabold text-[1.5rem] leading-none text-green-700 tracking-tight">
                −30 a 40%<small className="block font-sans font-medium text-[0.8125rem] text-neutral-400 mt-1">no custo do produto</small>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6.5 hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all shadow-xs">
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[0.72rem] tracking-wider uppercase bg-[#F1ECFB] text-[#6D3FC4] px-2 py-1 rounded-xs mb-[18px]">
                Creators
              </span>
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-neutral-900">Creator pool no TikTok Shop</h4>
              <p className="font-sans text-sm text-neutral-500 mb-5 leading-normal">Uma live de R$ 4.000 dividida entre 10 sellers. Revenue share automático via smart contract.</p>
              <div className="font-sans font-extrabold text-[1.5rem] leading-none text-green-700 tracking-tight">
                R$ 400<small className="block font-sans font-medium text-[0.8125rem] text-neutral-400 mt-1">por seller, não R$ 4 mil</small>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6.5 hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all shadow-xs">
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[0.72rem] tracking-wider uppercase bg-[#FBEFE3] text-[#B5651A] px-2 py-1 rounded-xs mb-[18px]">
                Mídia
              </span>
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-neutral-900">Fundo de mídia em bloco</h4>
              <p className="font-sans text-sm text-neutral-500 mb-5 leading-normal">Campanha externa por categoria apontando para os anúncios do coletivo. Cliques distribuídos por volume.</p>
              <div className="font-sans font-extrabold text-[1.5rem] leading-none text-green-700 tracking-tight">
                −40%<small className="block font-sans font-medium text-[0.8125rem] text-neutral-400 mt-1">de CPM em mídia paga</small>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6.5 hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all shadow-xs">
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[0.72rem] tracking-wider uppercase bg-[#E6EFFE] text-[#1B5FCB] px-2 py-1 rounded-xs mb-[18px]">
                Crédito
              </span>
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-neutral-900">Antecipação de recebíveis</h4>
              <p className="font-sans text-sm text-neutral-500 mb-5 leading-normal">Empréstimo do treasury coletivo com o stake como colateral, reembolso automático nas próximas contribuições.</p>
              <div className="font-sans font-extrabold text-[1.5rem] leading-none text-green-700 tracking-tight">
                ~1,5% a.m.<small className="block font-sans font-medium text-[0.8125rem] text-neutral-400 mt-1">vs 4% a.m. de fintechs</small>
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-lg p-6.5 hover:-translate-y-1 hover:shadow-md hover:border-green-300 transition-all shadow-xs">
              <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[0.72rem] tracking-wider uppercase bg-[#ECF6F1] text-[#0A6E52] px-2 py-1 rounded-xs mb-[18px]">
                Frete
              </span>
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-neutral-900">Contrato coletivo de frete</h4>
              <p className="font-sans text-sm text-neutral-500 mb-5 leading-normal">Volume agregado para negociar direto com a transportadora regional nos canais próprios.</p>
              <div className="font-sans font-extrabold text-[1.5rem] leading-none text-green-700 tracking-tight">
                R$ 12<small className="block font-sans font-medium text-[0.8125rem] text-neutral-400 mt-1">de economia por pacote</small>
              </div>
            </div>
            <div className="bg-gradient-dark text-white rounded-lg p-6.5 border border-transparent shadow-lg flex flex-col justify-center">
              <h4 className="font-sans font-bold text-[1.125rem] leading-tight mb-2.5 text-white">E o que o coletivo decidir a seguir.</h4>
              <p className="font-sans text-sm text-green-200 mb-5 leading-normal">Qualquer membro abre uma proposta. A Guild é a infraestrutura — o uso é do grupo.</p>
              <Link href="/governanca" className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-[0.9375rem] px-[18px] py-[11px] rounded-sm bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand self-start">
                Ver governança
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 md:py-28">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="bg-gradient-dark text-white rounded-xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center relative overflow-hidden shadow-lg">
            <svg className="absolute inset-0 w-full h-full opacity-40 object-cover" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g stroke="#2EE6A6" strokeWidth="1" opacity="0.45">
                <line x1="70" y1="70" x2="240" y2="160" />
                <line x1="240" y1="160" x2="420" y2="90" />
                <line x1="420" y1="90" x2="600" y2="180" />
                <line x1="240" y1="160" x2="320" y2="320" />
                <line x1="320" y1="320" x2="540" y2="340" />
                <line x1="540" y1="340" x2="600" y2="180" />
              </g>
              <g fill="#5BE8BE">
                <circle cx="70" cy="70" r="5" />
                <circle cx="240" cy="160" r="6" />
                <circle cx="420" cy="90" r="5" />
                <circle cx="600" cy="180" r="6" />
                <circle cx="320" cy="320" r="5" />
                <circle cx="540" cy="340" r="5" />
              </g>
            </svg>
            <div className="relative z-10">
              <h2 className="font-sans font-extrabold text-[1.7rem] md:text-[2.5rem] leading-[1.1] text-white tracking-tight mb-5 text-balance">
                Quem guarda o dinheiro do grupo? <em className="not-italic text-green-400">O código.</em>
              </h2>
              <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-green-100 mb-3.5">
                Toda iniciativa coletiva informal quebra no mesmo ponto: confiança. Na Guild, o treasury é controlado por uma PDA — uma conta do smart contract, sem chave privada humana. Saldo, votos e execuções são auditáveis em tempo real no Solana Explorer.
              </p>
              <p className="text-green-300 font-semibold mt-4">Transparência absoluta. Custódia trustless. Governança ponderada.</p>
            </div>
            <div className="relative z-10 bg-white/5 border border-green-200/20 rounded-lg p-6.5 backdrop-blur-sm">
              <div className="font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-300">Treasury · PDA on-chain</div>
              <div className="font-mono text-[0.85rem] text-white my-3 break-all bg-emerald-950/40 p-2 rounded-xs border border-emerald-900/40">trsyF1t9c2…Mns9q</div>
              <div className="font-sans font-extrabold text-[2.25rem] leading-none text-white tracking-tight tabular-nums">
                24.680 <small className="font-mono text-[0.85rem] text-green-300 font-medium">USDC</small>
              </div>
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-green-200/16 font-sans text-sm text-green-200">
                <span>Compre Fitness Manaus · 47 sellers</span>
                <a className="text-[#07F2B0] font-semibold flex items-center gap-1" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer">
                  Explorer ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-28 text-center bg-white border-t border-neutral-200">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8">
          <div className="bg-gradient-dark rounded-xl py-12 md:py-20 px-8 relative overflow-hidden shadow-lg text-white">
            <svg className="absolute inset-0 w-full h-full opacity-18 object-cover" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g stroke="#04432F" strokeWidth="1.4">
                <line x1="120" y1="80" x2="330" y2="180" />
                <line x1="330" y1="180" x2="560" y2="100" />
                <line x1="560" y1="100" x2="800" y2="210" />
                <line x1="800" y1="210" x2="1040" y2="120" />
                <line x1="330" y1="180" x2="440" y2="340" />
                <line x1="440" y1="340" x2="720" y2="360" />
              </g>
              <g fill="#04432F">
                <circle cx="120" cy="80" r="5" />
                <circle cx="330" cy="180" r="6" />
                <circle cx="560" cy="100" r="5" />
                <circle cx="800" cy="210" r="6" />
                <circle cx="1040" cy="120" r="5" />
                <circle cx="440" cy="340" r="6" />
                <circle cx="720" cy="360" r="5" />
              </g>
            </svg>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-sans font-extrabold text-[2rem] md:text-[3rem] leading-[1.05] tracking-tight text-white mb-5 text-balance">
                Pare de competir sozinho.
              </h2>
              <p className="font-sans font-normal text-[1.125rem] leading-relaxed text-green-100 mb-8 max-w-[50ch] mx-auto text-pretty">
                1,7 milhão de sellers ativos em marketplace no Brasil. Veja a Guild funcionando dentro de um coletivo real.
              </p>
              <Link href="/painel" className="inline-flex items-center justify-center gap-[9px] font-sans font-semibold text-[1.0625rem] leading-none px-7 py-4 rounded-md bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand">
                Ver demonstração ao vivo
                <svg className="w-[17px] h-[17px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 py-10 bg-white">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 flex items-center justify-between gap-5 flex-wrap">
          <Link href="/" className="flex items-center gap-[11px]">
            <svg className="w-7 h-7" viewBox="0 0 100 100">
              <path d="M75.98 65 A30 30 0 1 1 75.98 35" fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round" />
              <rect x="48" y="44" width="30" height="12" rx="6" fill="url(#gg)" />
              <circle cx="20" cy="50" r="6.5" fill="url(#gg)" />
              <circle cx="76" cy="50" r="6.5" fill="url(#gg)" />
            </svg>
            <span className="font-sans font-extrabold text-[1.05rem] leading-none tracking-tight text-neutral-900">
              Guild<span className="text-[#06BF8B]">.</span>
            </span>
          </Link>
          <div className="font-sans text-sm text-neutral-400">
            Infraestrutura financeira coletiva para sellers · <code className="font-mono text-green-700 bg-green-50 px-2 py-1 rounded">Solana · Devnet</code> · Hackanation 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
