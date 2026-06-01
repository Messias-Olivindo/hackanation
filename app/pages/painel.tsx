import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const members = [
  { nm: 'Manaus Active Wear', cat: 'Leggings & tops · ML', g: 52, av: 'MA', c: '#07F2B0' },
  { nm: 'Flex Studio Wear', cat: 'Moda fitness · Shopee', g: 47, av: 'FS', c: '#2EE6A6' },
  { nm: 'Serrana Moda Fitness', cat: 'Leggings · ML + Shopee', g: 41, av: 'SM', c: '#06BF8B' },
  { nm: 'Amazon Fit Suplementos', cat: 'Suplementos · TikTok Shop', g: 38, av: 'AF', c: '#5BE8BE' },
  { nm: 'Tarumã Fit', cat: 'Acessórios · ML', g: 36, av: 'TF', c: '#07D99D' },
  { nm: 'TechFit Acessórios', cat: 'Garrafas & luvas · Shopee', g: 33, av: 'TA', c: '#96D9C0' },
  { nm: 'Norte Power Nutrition', cat: 'Suplementos · ML', g: 29, av: 'NP', c: '#06BF8B' },
  { nm: 'Equador Sportswear', cat: 'Roupas · TikTok Shop', g: 22, av: 'ES', c: '#5BE8BE' },
];

const Painel: NextPage = () => {
  const [stats, setStats] = useState({ treasury: 0, sellers: 0, econ: 0, growth: 0 });
  const [rate, setRate] = useState(1.5);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    // Count-up animation
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setStats({
        treasury: Math.round(24680 * ease),
        sellers: Math.round(47 * ease),
        econ: Math.round(312 * ease),
        growth: Math.round(34 * ease),
      });
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    // Chart height animation
    const timer = setTimeout(() => setChartVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const maxG = Math.max(...members.map((m) => m.g));

  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans min-h-screen">
      <Head>
        <title>Compre Fitness Manaus — Painel</title>
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-[256px_1fr] min-h-screen">
        {/* ============ SIDEBAR ============ */}
        <aside className="sticky top-0 h-screen bg-green-950 text-emerald-100/90 flex flex-col p-6 gap-6 md:h-auto md:relative md:flex-row md:items-center md:flex-wrap lg:h-screen lg:sticky lg:flex-col lg:items-stretch">
          <div className="flex items-center gap-[11px] p-1">
            <div className="w-10 h-10 rounded-sm bg-gradient-brand flex items-center justify-center font-sans font-extrabold text-[1rem] leading-none text-[#042A20] flex-none">
              CF
            </div>
            <div className="font-sans font-bold text-[0.95rem] leading-[1.15] text-white">
              Compre Fitness
              <br />
              <span className="font-medium text-xs text-green-300">Manaus · DAO · 47 sellers</span>
            </div>
          </div>

          <nav className="flex flex-col gap-0.5 md:flex-row md:flex-wrap lg:flex-col lg:w-full">
            <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-green-200/50 px-2.5 my-2 md:hidden lg:block">
              Organização
            </div>
            <Link href="/painel" className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-semibold text-[0.9rem] leading-none bg-green-500 text-[#042A20] transition-all">
              <svg className="w-[18px] h-[18px] opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              Painel
            </Link>
            <Link href="/governanca" className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-medium text-[0.9rem] leading-none text-emerald-100/78 hover:bg-white/5 hover:text-white transition-all">
              <svg className="w-[18px] h-[18px] opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Governança
            </Link>
            <a className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-medium text-[0.9rem] leading-none text-emerald-100/78 hover:bg-white/5 hover:text-white transition-all cursor-not-allowed" href="#" onClick={(e) => e.preventDefault()}>
              <svg className="w-[18px] h-[18px] opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M16 12h.01M2 10h20" />
              </svg>
              Tesouraria (em breve)
            </a>
            <a className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-medium text-[0.9rem] leading-none text-emerald-100/78 hover:bg-white/5 hover:text-white transition-all cursor-not-allowed" href="#" onClick={(e) => e.preventDefault()}>
              <svg className="w-[18px] h-[18px] opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 14c2.7 0 5 2 5 5" />
              </svg>
              Membros (em breve)
            </a>
          </nav>

          <div className="mt-auto flex flex-col gap-3 md:hidden lg:flex w-full">
            <div className="bg-white/5 border border-green-200/18 rounded-md p-3.5">
              <div className="font-sans font-semibold text-[0.75rem] tracking-[0.12em] uppercase text-green-300">Treasury coletivo</div>
              <div className="font-sans font-extrabold text-[1.4rem] leading-none text-white my-2 tracking-tight tabular-nums">
                24.680 <small className="font-mono text-[0.75rem] text-green-300">USDC</small>
              </div>
              <div className="font-sans text-xs text-green-200">≈ R$ 133,3 mil · on-chain</div>
            </div>
            <div className="flex items-center gap-2.5 p-1.5">
              <div className="w-8 h-8 rounded-full bg-gradient-brand-soft flex items-center justify-center font-sans font-bold text-[0.78rem] leading-none text-[#042A20] flex-none">
                JV
              </div>
              <div className="font-sans font-semibold text-[0.82rem] leading-tight text-white">
                João Victor<small className="block font-mono text-[0.68rem] text-green-300 font-normal mt-1">7xKX…W3fA9</small>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs text-green-200/60 p-1.5 border-t border-green-200/10">
              <svg className="w-4 h-4 flex-none" viewBox="0 0 100 100">
                <path d="M75.98 65 A30 30 0 1 1 75.98 35" fill="none" stroke="url(#pg)" strokeWidth="13" strokeLinecap="round" />
                <rect x="48" y="43" width="30" height="13" rx="6.5" fill="url(#pg)" />
                <circle cx="20" cy="50" r="7" fill="url(#pg)" />
                <circle cx="76" cy="50" r="7" fill="url(#pg)" />
              </svg>
              Powered by Guild
            </div>
          </div>
        </aside>

        {/* ============ MAIN ============ */}
        <div className="flex flex-col min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 py-4 px-6 md:px-9 bg-white/85 backdrop-blur-md border-b border-neutral-200">
            <div className="flex flex-col gap-1">
              <div className="font-sans font-extrabold text-[1.375rem] leading-none tracking-tight text-neutral-900">Painel</div>
              <div className="font-sans text-xs text-neutral-500">Visão geral do coletivo · maio 2026</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-green-900 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-xs">
                <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(7,217,157,0.2)]"></span>
                Solana · Devnet
              </span>
              <Link href="/governanca" className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-[0.9375rem] leading-none px-[18px] py-[11px] rounded-sm bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand">
                <svg className="w-[17px] h-[17px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nova proposta
              </Link>
            </div>
          </header>

          <div className="p-6 md:p-9 flex flex-col gap-6 max-w-[1200px] w-full mx-auto">
            {/* treasury verify banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4.5 bg-green-50 border border-green-100 rounded-lg shadow-xs">
              <div className="flex items-start md:items-center gap-3.5">
                <div className="w-9 h-9 rounded-sm bg-white border border-green-200 grid place-items-center text-green-600 flex-none">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="font-sans font-semibold text-sm text-green-950 leading-tight">
                  Treasury verificável on-chain a qualquer momento
                  <small className="block font-mono text-[0.72rem] text-green-700 font-normal mt-1 leading-none">PDA trsyF1t9c2…Mns9q · controlada por smart contract, sem chave humana</small>
                </div>
              </div>
              <a className="font-sans font-semibold text-xs text-green-800 bg-white border border-green-200 px-3.5 py-2 rounded-xs shadow-xs hover:bg-green-50/50 transition-colors flex items-center justify-center gap-1 self-start md:self-auto" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer">
                Ver no Solana Explorer
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-neutral-200 rounded-lg p-5 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-8.5 h-8.5 rounded-sm bg-green-50 text-green-700 grid place-items-center flex-none">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="13" rx="2" />
                      <path d="M16 12h.01M2 10h20" />
                    </svg>
                  </div>
                  <span className="font-sans font-semibold text-[0.78rem] text-success-fg flex items-center gap-0.5 leading-none">
                    <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                      <path d="M3 17l6-6 4 4 7-8" />
                      <path d="M14 7h7v7" />
                    </svg>
                    +15,9%
                  </span>
                </div>
                <div className="font-sans font-extrabold text-[2rem] leading-none tracking-tight tabular-nums">{stats.treasury.toLocaleString('pt-BR')}</div>
                <div className="font-sans text-xs text-neutral-500 mt-2.5">
                  Treasury · USDC <span className="text-[#059B72] font-semibold">≈ R$ 133,3 mil</span>
                </div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-5 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-8.5 h-8.5 rounded-sm bg-green-50 text-green-700 grid place-items-center flex-none">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="8" r="3" />
                      <circle cx="17" cy="9" r="2.5" />
                      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 14c2.7 0 5 2 5 5" />
                    </svg>
                  </div>
                  <span className="font-sans font-semibold text-[0.78rem] text-success-fg leading-none">+5 este mês</span>
                </div>
                <div className="font-sans font-extrabold text-[2rem] leading-none tracking-tight tabular-nums">{stats.sellers}</div>
                <div className="font-sans text-xs text-neutral-500 mt-2.5">Sellers ativos no coletivo</div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-5 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-8.5 h-8.5 rounded-sm bg-green-50 text-green-700 grid place-items-center flex-none">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span className="font-sans font-semibold text-[0.78rem] text-success-fg leading-none">+R$ 41 mil/mês</span>
                </div>
                <div className="font-sans font-extrabold text-[2rem] leading-none tracking-tight tabular-nums">R$ {stats.econ} mil</div>
                <div className="font-sans text-xs text-neutral-500 mt-2.5">Economia gerada (acumulada)</div>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-5 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-8.5 h-8.5 rounded-sm bg-green-50 text-green-700 grid place-items-center flex-none">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 17l6-6 4 4 7-8" />
                      <path d="M14 7h7v7" />
                    </svg>
                  </div>
                  <span className="font-sans font-semibold text-[0.78rem] text-neutral-500 leading-none">vs. entrada</span>
                </div>
                <div className="font-sans font-extrabold text-[2rem] leading-none tracking-tight tabular-nums">+{stats.growth}%</div>
                <div className="font-sans text-xs text-neutral-500 mt-2.5">Crescimento médio dos membros</div>
              </div>
            </div>

            {/* main contribution & integration grid */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="flex items-center justify-between gap-3.5 mb-2.5">
                    <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">Sua contribuição</div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-semibold bg-[#ECF6F1] text-[#0A3D2E] px-2 py-1 rounded-sm border border-green-200/50">
                      depósito automático
                    </span>
                  </div>
                  <p className="font-sans text-sm text-neutral-500 leading-relaxed mb-6">
                    Você define a taxa mínima do faturamento mensal que entra na treasury. A cada venda lida pela integração, o valor é depositado em USDC. Seu <b className="font-bold text-neutral-900">peso de voto é proporcional</b> a quanto você contribui.
                  </p>
                  
                  {/* custom slider fully functional */}
                  <div className="relative bg-neutral-50 border border-neutral-200 p-5 rounded-md mb-6">
                    <div className="font-sans font-extrabold text-[2rem] text-neutral-900 leading-none tracking-tight mb-4">{rate.toFixed(1)}%</div>
                    <div className="relative pt-2 pb-6">
                      <div className="h-1.5 rounded-full bg-neutral-200 relative overflow-visible">
                        <i className="absolute left-0 top-0 h-full rounded-full bg-gradient-brand" style={{ width: `${((rate - 0.5) / 4.5) * 100}%` }}></i>
                        <b className="absolute w-5 h-5 -mt-[7px] -ml-2.5 rounded-full bg-white border-2 border-green-600 shadow-md transition-all pointer-events-none" style={{ left: `${((rate - 0.5) / 4.5) * 100}%` }}></b>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="5.0"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex justify-between font-mono text-[0.7rem] text-neutral-400 font-semibold mt-4">
                        <span>mín. 0,5%</span>
                        <span>máx. 5,0%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-neutral-50/60 p-4 border border-neutral-200 rounded-sm">
                    <div>
                      <div className="font-mono text-[0.68rem] text-neutral-400 font-semibold uppercase tracking-wider">Faturamento · mai</div>
                      <div className="font-sans font-bold text-sm text-neutral-900 mt-1">R$ 38.400</div>
                    </div>
                    <div>
                      <div className="font-mono text-[0.68rem] text-neutral-400 font-semibold uppercase tracking-wider">Contribuição</div>
                      <div className="font-sans font-bold text-sm text-green-700 mt-1">
                        +{(38400 * (rate / 100) / 5.3).toFixed(0)} <small className="font-mono text-[0.72rem] text-green-800">USDC</small>
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[0.68rem] text-neutral-400 font-semibold uppercase tracking-wider">Peso de voto</div>
                      <div className="font-sans font-bold text-sm text-neutral-900 mt-1">{(rate * 80).toFixed(0)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-3.5 mb-5.5">
                    <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">
                      Integrações
                    </div>
                    <a className="font-sans font-semibold text-[0.82rem] text-green-700 hover:text-green-800 transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                      Gerenciar →
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3.5 p-3 rounded-lg border border-neutral-200 bg-neutral-25">
                      <div className="w-8.5 h-8.5 rounded-sm bg-[#FFE600] text-[#2D3277] flex items-center justify-center font-sans font-extrabold text-[0.85rem] leading-none flex-none shadow-xs">
                        ML
                      </div>
                      <div className="font-sans font-semibold text-sm text-neutral-900 flex-1 leading-tight">
                        Mercado Livre<span className="block font-sans text-[0.72rem] text-neutral-400 font-normal mt-0.5">Vendas + faturamento</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-green-800 bg-green-50 border border-green-200/50 px-2.5 py-1.5 rounded-sm flex-none leading-none shadow-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Conectado
                      </span>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-lg border border-neutral-200 bg-neutral-25">
                      <div className="w-8.5 h-8.5 rounded-sm bg-[#EE4D2D] text-white flex items-center justify-center font-sans font-extrabold text-[0.85rem] leading-none flex-none shadow-xs">
                        SH
                      </div>
                      <div className="font-sans font-semibold text-sm text-neutral-900 flex-1 leading-tight">
                        Shopee<span className="block font-sans text-[0.72rem] text-neutral-400 font-normal mt-0.5">Vendas + recebíveis</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-green-800 bg-green-50 border border-green-200/50 px-2.5 py-1.5 rounded-sm flex-none leading-none shadow-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Conectado
                      </span>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-lg border border-neutral-200 bg-neutral-25">
                      <div className="w-8.5 h-8.5 rounded-sm bg-neutral-900 text-white flex items-center justify-center font-sans font-extrabold text-[0.85rem] leading-none flex-none shadow-xs">
                        TT
                      </div>
                      <div className="font-sans font-semibold text-sm text-neutral-900 flex-1 leading-tight">
                        TikTok Shop<span className="block font-sans text-[0.72rem] text-neutral-400 font-normal mt-0.5">Lives + pedidos</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-green-800 bg-green-50 border border-green-200/50 px-2.5 py-1.5 rounded-sm flex-none leading-none shadow-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        Conectado
                      </span>
                    </div>
                    <div className="flex items-center gap-3.5 p-3 rounded-lg border border-neutral-200 bg-neutral-25">
                      <div className="w-8.5 h-8.5 rounded-sm bg-green-800 text-white flex items-center justify-center font-sans font-extrabold text-[0.85rem] leading-none flex-none shadow-xs">
                        ERP
                      </div>
                      <div className="font-sans font-semibold text-sm text-neutral-900 flex-1 leading-tight">
                        ERP Bling<span className="block font-sans text-[0.72rem] text-neutral-400 font-normal mt-0.5">Estoque + notas fiscais</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-warning-fg bg-warning-bg border border-warning-fg/20 px-2.5 py-1.5 rounded-sm flex-none leading-none shadow-xs">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}>
                          <path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4" />
                        </svg>
                        Sincronizando
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* main page split */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
              <div className="flex flex-col gap-6">
                {/* treasury chart */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3.5 mb-5.5">
                    <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">Evolução do treasury</div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-semibold bg-[#ECF6F1] text-[#0A3D2E] px-2 py-1 rounded-sm border border-green-200/50">
                      USDC on-chain
                    </span>
                  </div>
                  
                  {/* pure CSS chart utilizing absolute heights with state updates */}
                  <div className="flex items-end gap-2.5 h-[160px] pt-2 mb-2">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand-soft transition-all duration-300" style={{ height: chartVisible ? '33%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-400 font-semibold mt-1">Dez</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand-soft transition-all duration-300" style={{ height: chartVisible ? '46%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-400 font-semibold mt-1">Jan</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand-soft transition-all duration-300" style={{ height: chartVisible ? '60%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-400 font-semibold mt-1">Fev</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand-soft transition-all duration-300" style={{ height: chartVisible ? '73%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-400 font-semibold mt-1">Mar</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand-soft transition-all duration-300" style={{ height: chartVisible ? '86%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-400 font-semibold mt-1">Abr</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full max-w-[42px] rounded-t-sm rounded-b-xs bg-gradient-brand shadow-brand transition-all duration-300" style={{ height: chartVisible ? '100%' : '0%' }}></div>
                      <div className="font-sans text-xs text-neutral-800 font-bold mt-1">Mai</div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-6 pt-5 border-t border-neutral-200">
                    <div>
                      <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Aportado no mês</div>
                      <div className="font-sans font-extrabold text-[1.1rem] leading-none text-neutral-900 tracking-tight mt-1.5 tabular-nums">
                        +4.380 <small className="font-mono text-[0.72rem] text-green-700 font-semibold">USDC</small>
                      </div>
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Executado no mês</div>
                      <div className="font-sans font-extrabold text-[1.1rem] leading-none text-neutral-900 tracking-tight mt-1.5 tabular-nums">
                        −9.400 <small className="font-mono text-[0.72rem] text-[#b42a2f] font-semibold">USDC</small>
                      </div>
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Stake médio/seller</div>
                      <div className="font-sans font-extrabold text-[1.1rem] leading-none text-neutral-900 tracking-tight mt-1.5 tabular-nums">
                        525 <small className="font-mono text-[0.72rem] text-green-700 font-semibold">USDC</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* votações */}
                <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3.5 mb-5.5">
                    <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">Votações ativas</div>
                    <Link href="/governanca" className="font-sans font-semibold text-[0.82rem] text-green-700 hover:text-green-800 transition-colors">
                      Ver governança →
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center mb-6">
                    <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/50">
                      <div className="font-sans font-extrabold text-[1.6rem] leading-none text-info-fg tabular-nums">3</div>
                      <div className="font-sans text-[0.75rem] text-neutral-400 font-semibold uppercase mt-2 leading-none">Votando</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/50">
                      <div className="font-sans font-extrabold text-[1.6rem] leading-none text-neutral-700 tabular-nums">18</div>
                      <div className="font-sans text-[0.75rem] text-neutral-400 font-semibold uppercase mt-2 leading-none">Aprovadas</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/50">
                      <div className="font-sans font-extrabold text-[1.6rem] leading-none text-green-700 tabular-nums">15</div>
                      <div className="font-sans text-[0.75rem] text-neutral-400 font-semibold uppercase mt-2 leading-none">Executadas</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md border border-neutral-200/50">
                      <div className="font-sans font-extrabold text-[1.6rem] leading-none text-neutral-400 tabular-nums">4</div>
                      <div className="font-sans text-[0.75rem] text-neutral-400 font-semibold uppercase mt-2 leading-none">Recusadas</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <Link href="/governanca" className="flex items-center gap-3.5 p-3 rounded-md border border-neutral-200 bg-neutral-25 hover:border-green-300 hover:shadow-xs transition-all">
                      <span className="font-mono text-xs text-neutral-400 leading-none">#041</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans font-bold text-sm text-neutral-900 truncate leading-tight">Compra coletiva · 1.200kg poliamida</div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-2 relative">
                          <i className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand" style={{ width: '68%' }}></i>
                        </div>
                      </div>
                      <span className="font-sans font-extrabold text-sm text-green-800 leading-none w-10 text-right tabular-nums">68%</span>
                      <span className="font-sans font-semibold text-[0.75rem] text-[#8a5a00] bg-[#FBF1DC] border border-[#8a5a00]/10 px-2 py-1 rounded-sm flex-none leading-none shadow-xs">41h</span>
                    </Link>
                    <Link href="/governanca" className="flex items-center gap-3.5 p-3 rounded-md border border-neutral-200 bg-neutral-25 hover:border-green-300 hover:shadow-xs transition-all">
                      <span className="font-mono text-xs text-neutral-400 leading-none">#042</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans font-bold text-sm text-neutral-900 truncate leading-tight">Creator pool · Live com @manu.fit</div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-2 relative">
                          <i className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand" style={{ width: '73%' }}></i>
                        </div>
                      </div>
                      <span className="font-sans font-extrabold text-sm text-green-800 leading-none w-10 text-right tabular-nums">73%</span>
                      <span className="font-sans font-semibold text-[0.75rem] text-[#8a5a00] bg-[#FBF1DC] border border-[#8a5a00]/10 px-2 py-1 rounded-sm flex-none leading-none shadow-xs">18h</span>
                    </Link>
                    <Link href="/governanca" className="flex items-center gap-3.5 p-3 rounded-md border border-neutral-200 bg-neutral-25 hover:border-green-300 hover:shadow-xs transition-all">
                      <span className="font-mono text-xs text-neutral-400 leading-none">#043</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-sans font-bold text-sm text-neutral-900 truncate leading-tight">Frete regional · Amazonas Log</div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mt-2 relative">
                          <i className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand" style={{ width: '51%' }}></i>
                        </div>
                      </div>
                      <span className="font-sans font-extrabold text-sm text-green-800 leading-none w-10 text-right tabular-nums">51%</span>
                      <span className="font-sans font-semibold text-[0.75rem] text-[#8a5a00] bg-[#FBF1DC] border border-[#8a5a00]/10 px-2 py-1 rounded-sm flex-none leading-none shadow-xs">60h</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* on-chain activity */}
              <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3.5 mb-5.5">
                  <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">Atividade on-chain</div>
                  <a className="font-sans font-semibold text-[0.82rem] text-green-700 hover:text-green-800 transition-colors" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer">
                    Explorer ↗
                  </a>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-start gap-3 py-3 border-t border-neutral-200 first:border-t-0">
                    <span className="font-mono text-[0.7rem] font-bold bg-green-50 text-green-800 border border-green-200/50 px-2 py-1 rounded-xs flex-none leading-none shadow-xs uppercase">execute</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm text-neutral-900 leading-tight">
                        <b className="font-bold">Compra coletiva</b> · garrafas térmicas (Fornecedor FitPro)
                      </div>
                      <div className="flex gap-2.5 items-center mt-1.5">
                        <a className="font-mono text-[0.72rem] text-green-600 hover:underline leading-none" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer">
                          5xRk2C…9fA2 ↗
                        </a>
                        <span className="font-sans text-xs text-neutral-400 leading-none">há 2h</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[#b42a2f] flex-none leading-none tabular-nums">−5.400</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-t border-neutral-200 first:border-t-0">
                    <span className="font-mono text-[0.7rem] font-bold bg-[#E6EFFE] text-[#1B5FCB] border border-[#1B5FCB]/10 px-2 py-1 rounded-xs flex-none leading-none shadow-xs uppercase">vote</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm text-neutral-900 leading-tight">
                        <b className="font-bold">João Victor</b> votou a favor da proposta #042
                      </div>
                      <div className="flex gap-2.5 items-center mt-1.5">
                        <span className="font-sans text-xs text-neutral-400 leading-none">há 3h</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-t border-neutral-200 first:border-t-0">
                    <span className="font-mono text-[0.7rem] font-bold bg-[#FBF1DC] text-[#8a5a00] border border-[#8a5a00]/10 px-2 py-1 rounded-xs flex-none leading-none shadow-xs uppercase">join_dao</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm text-neutral-900 leading-tight">
                        <b className="font-bold">Tarumã Fit</b> entrou no coletivo
                      </div>
                      <div className="flex gap-2.5 items-center mt-1.5">
                        <span className="font-sans text-xs text-neutral-400 leading-none">há 5h</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-green-700 flex-none leading-none tabular-nums">+10</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-t border-neutral-200 first:border-t-0">
                    <span className="font-mono text-[0.7rem] font-bold bg-green-50 text-green-800 border border-green-200/50 px-2 py-1 rounded-xs flex-none leading-none shadow-xs uppercase">execute</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm text-neutral-900 leading-tight">
                        <b className="font-bold">Meta Ads coletivo</b> · categoria &quot;moda fitness&quot;
                      </div>
                      <div className="flex gap-2.5 items-center mt-1.5">
                        <a className="font-mono text-[0.72rem] text-green-600 hover:underline leading-none" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener noreferrer">
                          8mPq1L…W3kL ↗
                        </a>
                        <span className="font-sans text-xs text-neutral-400 leading-none">há 1d</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[#b42a2f] flex-none leading-none tabular-nums">−4.000</span>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-t border-neutral-200 first:border-t-0">
                    <span className="font-mono text-[0.7rem] font-bold bg-[#F1ECFB] text-[#6D3FC4] border border-[#6D3FC4]/10 px-2 py-1 rounded-xs flex-none leading-none shadow-xs uppercase">propose</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm text-neutral-900 leading-tight">
                        <b className="font-bold">Ana · Serrana Moda Fitness</b> abriu a proposta #043
                      </div>
                      <div className="flex gap-2.5 items-center mt-1.5">
                        <span className="font-sans text-xs text-neutral-400 leading-none">há 1d</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* members & growth */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3.5 mb-5.5">
                <div className="font-sans font-bold text-[1.125rem] text-neutral-900 leading-tight">Membros &amp; crescimento desde a entrada</div>
                <a className="font-sans font-semibold text-[0.82rem] text-green-700 hover:text-green-800 transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                  Ver todos os 47 →
                </a>
              </div>
              <div className="flex flex-col">
                {members.map((m) => (
                  <div className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-3.5 py-3.5 border-t border-neutral-200 first:border-t-0" key={m.nm}>
                    <div className="flex items-center gap-3">
                      <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-sans font-bold text-[0.78rem] leading-none text-white flex-none" style={{ backgroundColor: m.c }}>
                        {m.av}
                      </div>
                      <div className="font-sans font-semibold text-sm text-neutral-900 leading-tight">
                        {m.nm}
                        <small className="block font-sans text-xs text-neutral-400 font-normal mt-1 leading-none">{m.cat}</small>
                      </div>
                    </div>
                    <div className="h-[7px] rounded-full bg-neutral-100 overflow-hidden relative">
                      <i className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand" style={{ width: `${Math.round((m.g / maxG) * 100)}%` }}></i>
                    </div>
                    <div className="font-sans font-extrabold text-sm text-success-fg text-right min-w-[52px] leading-none tabular-nums">+{m.g}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Painel;
