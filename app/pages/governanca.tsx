import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

type Proposal = {
  id: string;
  status: 'voting' | 'approved' | 'executed' | 'rejected';
  time: string;
  title: string;
  desc: string;
  creator: string;
  category: string;
  amount: string;
  votes: number;
  votesMax: number;
  voted: boolean;
};

const initialProposals: Proposal[] = [
  {
    id: '#041',
    status: 'voting',
    time: '41h restantes',
    title: 'Compra coletiva · 1.200kg Poliamida (Fornecedor Rhodia)',
    desc: 'Pedido mínimo para destravar desconto de distribuidor de volume. A poliamida será estocada na transportadora parceira em Manaus e rateada proporcionalmente ao stake no treasury.',
    creator: 'Tarumã Fit',
    category: 'Estoque',
    amount: '12.400 USDC',
    votes: 408,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#042',
    status: 'voting',
    time: '18h restantes',
    title: 'Creator pool · Live Shopping com @manu.fit',
    desc: 'Contratação coletiva de influenciador fitness para live shop em bloco. O link de compras será dinâmico direcionando tráfego proporcionalmente para os anúncios ativos dos membros.',
    creator: 'Flex Studio Wear',
    category: 'Creators',
    amount: '4.000 USDC',
    votes: 438,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#043',
    status: 'voting',
    time: '60h restantes',
    title: 'Frete regional · Negociação de contrato Amazonas Log',
    desc: 'Contrato corporativo para frete de canais próprios na região norte. O volume agregado dos 47 sellers garante tabela fixa de R$ 14,00 por pacote para todo o estado do Amazonas.',
    creator: 'Serrana Moda Fitness',
    category: 'Frete',
    amount: '6.200 USDC',
    votes: 306,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#038',
    status: 'approved',
    time: 'Aprovada e aguardando Pix',
    title: 'Estoque · 200 fardos sacolas biodegradáveis personalizadas',
    desc: 'Compra de suprimentos para embalagem ecológica coletiva. Logotipo unificado "Sellers Sustentáveis de Manaus" impresso nas sacolas.',
    creator: 'Norte Power Nutrition',
    category: 'Estoque',
    amount: '3.800 USDC',
    votes: 490,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#039',
    status: 'executed',
    time: 'Executada em 14/05/2026',
    title: 'Compra coletiva · 400 garrafas térmicas alumínio 1L',
    desc: 'Destravando lote no atacado direto da fábrica na zona franca. Produto de altíssima saída para a temporada de calor.',
    creator: 'Manaus Active Wear',
    category: 'Estoque',
    amount: '5.400 USDC',
    votes: 510,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#040',
    status: 'executed',
    time: 'Executada em 18/05/2026',
    title: 'Mídia · Campanha de tráfego pago unificado - Shorts fitness',
    desc: 'Fundo de tráfego apontando para catálogo geral. Compradores selecionam a loja baseada na localidade geográfica.',
    creator: 'Amazon Fit Suplementos',
    category: 'Mídia',
    amount: '4.000 USDC',
    votes: 460,
    votesMax: 600,
    voted: false,
  },
  {
    id: '#036',
    status: 'rejected',
    time: 'Recusada em 02/05/2026',
    title: 'Creators · Live shopping externa no canal @fit.br',
    desc: 'Live de alcance nacional em canal de audiência genérica. Rejeitada pela baixa conversão estimada para sellers locais.',
    creator: 'Equador Sportswear',
    category: 'Creators',
    amount: '8.000 USDC',
    votes: 180,
    votesMax: 600,
    voted: false,
  },
];

const Governanca: NextPage = () => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [tab, setTab] = useState<'all' | 'voting' | 'approved' | 'executed' | 'rejected'>('all');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; title: string; tx: string }>({
    visible: false,
    title: '',
    tx: '',
  });

  // Form states
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('Estoque');

  const triggerToast = (title: string, tx: string) => {
    setToast({ visible: true, title, tx });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3500);
  };

  const handleVote = (id: string) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isVoted = !p.voted;
          // user vote weight is 120
          const diff = isVoted ? 120 : -120;
          if (isVoted) {
            triggerToast(
              'Voto computado com sucesso!',
              'Tx: ' + Math.random().toString(36).substring(2, 10).toUpperCase() + '…voted'
            );
          } else {
            triggerToast(
              'Voto desfeito com sucesso!',
              'Tx: ' + Math.random().toString(36).substring(2, 10).toUpperCase() + '…cancel'
            );
          }
          return { ...p, voted: isVoted, votes: p.votes + diff };
        }
        return p;
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !amount) return;

    const newProp: Proposal = {
      id: '#' + (proposals.length + 35).toString().padStart(3, '0'),
      status: 'voting',
      time: '72h restantes',
      title,
      desc,
      creator: 'João Victor (Você)',
      category,
      amount: parseInt(amount).toLocaleString('en-US') + ' USDC',
      votes: 120, // automatic vote weight of creator
      votesMax: 600,
      voted: true,
    };

    setProposals([newProp, ...proposals]);
    setShowModal(false);
    
    // clear fields
    setTitle('');
    setDesc('');
    setAmount('');
    setSupplier('');
    setCategory('Estoque');

    triggerToast(
      'Proposta aberta on-chain!',
      'Tx: ' + Math.random().toString(36).substring(2, 10).toUpperCase() + '…create'
    );
  };

  const filtered = proposals.filter((p) => {
    if (tab === 'all') return true;
    return p.status === tab;
  });

  const getCount = (status: 'all' | 'voting' | 'approved' | 'executed' | 'rejected') => {
    if (status === 'all') return proposals.length;
    return proposals.filter((p) => p.status === status).length;
  };

  const getStatusText = (status: Proposal['status']) => {
    switch (status) {
      case 'voting':
        return 'Em votação';
      case 'approved':
        return 'Aprovada';
      case 'executed':
        return 'Executada';
      case 'rejected':
        return 'Recusada';
    }
  };

  return (
    <div className="bg-neutral-50 text-neutral-900 font-sans min-h-screen">
      <Head>
        <title>Compre Fitness Manaus — Governança</title>
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
            <Link href="/painel" className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-medium text-[0.9rem] leading-none text-emerald-100/78 hover:bg-white/5 hover:text-white transition-all">
              <svg className="w-[18px] h-[18px] opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
              Painel
            </Link>
            <Link href="/governanca" className="flex items-center gap-[11px] p-2.5 rounded-sm font-sans font-semibold text-[0.9rem] leading-none bg-green-500 text-[#042A20] transition-all">
              <svg className="w-[18px] h-[18px] opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
              <div className="font-sans font-extrabold text-[1.375rem] leading-none tracking-tight text-neutral-900">Governança coletiva</div>
              <div className="font-sans text-xs text-neutral-500">Toda decisão financeira do treasury passa por aqui</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-green-900 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-xs">
                <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(7,217,157,0.2)]"></span>
                Solana · Devnet
              </span>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-[0.9375rem] leading-none px-[18px] py-[11px] rounded-sm bg-green-500 text-[#042A20] hover:bg-green-400 active:translate-y-[1px] transition-all shadow-brand cursor-pointer">
                <svg className="w-[17px] h-[17px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Nova proposta
              </button>
            </div>
          </header>

          <div className="p-6 md:p-9 flex flex-col gap-6 max-w-[1200px] w-full mx-auto">
            {/* tab filter buttons */}
            <div className="flex gap-2 flex-wrap mb-2">
              <button
                className={`inline-flex items-center gap-2 font-sans font-semibold text-[0.875rem] leading-none px-4 py-3 rounded-full cursor-pointer hover:border-green-300 transition-all border ${
                  tab === 'all'
                    ? 'bg-green-950 text-white border-transparent'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
                onClick={() => setTab('all')}
              >
                Todas <span className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${tab === 'all' ? 'bg-white/16 text-green-300' : 'bg-neutral-100 text-neutral-500'}`}>{getCount('all')}</span>
              </button>
              <button
                className={`inline-flex items-center gap-2 font-sans font-semibold text-[0.875rem] leading-none px-4 py-3 rounded-full cursor-pointer hover:border-green-300 transition-all border ${
                  tab === 'voting'
                    ? 'bg-green-950 text-white border-transparent'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
                onClick={() => setTab('voting')}
              >
                Em votação <span className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${tab === 'voting' ? 'bg-white/16 text-green-300' : 'bg-neutral-100 text-neutral-500'}`}>{getCount('voting')}</span>
              </button>
              <button
                className={`inline-flex items-center gap-2 font-sans font-semibold text-[0.875rem] leading-none px-4 py-3 rounded-full cursor-pointer hover:border-green-300 transition-all border ${
                  tab === 'approved'
                    ? 'bg-green-950 text-white border-transparent'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
                onClick={() => setTab('approved')}
              >
                Aprovadas <span className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${tab === 'approved' ? 'bg-white/16 text-green-300' : 'bg-neutral-100 text-neutral-500'}`}>{getCount('approved')}</span>
              </button>
              <button
                className={`inline-flex items-center gap-2 font-sans font-semibold text-[0.875rem] leading-none px-4 py-3 rounded-full cursor-pointer hover:border-green-300 transition-all border ${
                  tab === 'executed'
                    ? 'bg-green-950 text-white border-transparent'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
                onClick={() => setTab('executed')}
              >
                Executadas <span className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${tab === 'executed' ? 'bg-white/16 text-green-300' : 'bg-neutral-100 text-neutral-500'}`}>{getCount('executed')}</span>
              </button>
              <button
                className={`inline-flex items-center gap-2 font-sans font-semibold text-[0.875rem] leading-none px-4 py-3 rounded-full cursor-pointer hover:border-green-300 transition-all border ${
                  tab === 'rejected'
                    ? 'bg-green-950 text-white border-transparent'
                    : 'bg-white text-neutral-600 border-neutral-200'
                }`}
                onClick={() => setTab('rejected')}
              >
                Recusadas <span className={`font-mono text-[0.72rem] px-2 py-0.5 rounded-full ${tab === 'rejected' ? 'bg-white/16 text-green-300' : 'bg-neutral-100 text-neutral-500'}`}>{getCount('rejected')}</span>
              </button>
            </div>

            {/* proposals list */}
            <div className="flex flex-col gap-6">
              {filtered.map((p) => {
                const percent = Math.min(Math.round((p.votes / p.votesMax) * 100), 100);
                const isPassedQuorum = p.votes >= 300; // 300 USDC minimum quorum (50% of 600)
                
                return (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-xs" key={p.id}>
                    <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
                      <span className="font-mono text-[0.78rem] text-neutral-400 font-semibold">{p.id}</span>
                      <span className={`inline-flex items-center gap-1 font-sans text-xs px-2 py-1 rounded-sm leading-none font-bold uppercase shadow-xs border ${
                        p.status === 'voting'
                          ? 'text-warning-fg bg-warning-bg border-warning-fg/10'
                          : p.status === 'approved'
                          ? 'text-info-fg bg-info-bg border-[#1b5fcb]/10'
                          : p.status === 'executed'
                          ? 'text-green-800 bg-green-50 border-green-200/50'
                          : 'text-danger-fg bg-danger-bg border-danger-fg/10'
                      }`}>
                        {getStatusText(p.status)}
                      </span>
                      <div className="flex-1"></div>
                      <span className={`font-sans text-xs flex items-center gap-1.5 leading-none shadow-xs font-semibold px-2.5 py-1.5 rounded-sm border ${
                        p.status === 'voting' ? 'text-warning-fg bg-warning-bg border-warning-fg/10' : 'text-neutral-500 bg-neutral-50 border-neutral-200'
                      }`}>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {p.time}
                      </span>
                    </div>

                    <h3 className="font-sans font-extrabold text-[1.25rem] leading-snug tracking-tight text-neutral-900 mb-1.5">{p.title}</h3>
                    <p className="font-sans text-sm text-neutral-500 max-w-[64ch] leading-relaxed">{p.desc}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3.5 my-4 py-4 border-y border-neutral-200">
                      <div>
                        <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Aportado por</div>
                        <div className="font-sans font-bold text-sm text-neutral-900 mt-1.5 flex items-center gap-1.5 leading-none">{p.creator}</div>
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Categoria</div>
                        <div className="font-sans font-bold text-sm text-neutral-900 mt-1.5 flex items-center gap-1.5 leading-none">
                          <span className={`w-2 h-2 rounded-full ${
                            p.category === 'Estoque' ? 'bg-green-600' : p.category === 'Creators' ? 'bg-purple-600' : 'bg-blue-600'
                          }`}></span>
                          {p.category}
                        </div>
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Destino pix</div>
                        <div className="font-sans font-bold text-sm text-neutral-900 mt-1.5 flex items-center gap-1.5 leading-none">Fornecedor FitPro</div>
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-[0.72rem] tracking-[0.12em] uppercase text-neutral-400">Valor total</div>
                        <div className="font-sans font-bold text-sm text-green-700 mt-1.5 flex items-center gap-1.5 leading-none tabular-nums">{p.amount}</div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 flex items-center justify-between gap-5 flex-wrap">
                      <div className="flex items-center gap-3.5 flex-wrap">
                        {p.status === 'voting' ? (
                          <button
                            className={`inline-flex items-center justify-center gap-2 font-sans font-bold text-[0.875rem] leading-none px-5 py-3.5 rounded-sm transition-all shadow-xs cursor-pointer border ${
                              p.voted
                                ? 'bg-danger-bg text-[#b42a2f] border-danger-fg/10 hover:bg-danger-bg/80'
                                : 'bg-green-500 text-[#042A20] border-transparent hover:bg-green-400'
                            }`}
                            onClick={() => handleVote(p.id)}
                          >
                            <svg className="w-[17px] h-[17px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              {p.voted ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M20 6L9 17l-5-5" />}
                            </svg>
                            {p.voted ? 'Desfazer meu voto' : 'Votar a favor (Sim)'}
                          </button>
                        ) : (
                          <span className="font-sans text-sm text-neutral-500 font-semibold leading-none flex items-center gap-2">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                              <circle cx="12" cy="12" r="10" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                            Decisão consolidada
                          </span>
                        )}
                        {p.voted && (
                          <span className="font-sans text-xs text-green-800 bg-green-50 border border-green-200 px-3 py-2 rounded-xs leading-none shadow-xs font-semibold">
                            Seu voto (120 pesos) está computado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-5 flex-1 min-w-[280px] justify-end">
                        <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
                          <span className="font-sans font-semibold text-xs text-neutral-400 uppercase leading-none">Votos</span>
                          <div className="h-[7px] rounded-full bg-neutral-200 overflow-hidden relative flex-1">
                            <i className="absolute top-0 left-0 h-full rounded-full bg-gradient-brand shadow-brand transition-all" style={{ width: `${percent}%` }}></i>
                          </div>
                          <span className="font-sans font-extrabold text-sm text-green-700 min-w-[42px] text-right tabular-nums">{percent}%</span>
                        </div>
                        <div className="font-sans text-xs text-neutral-400 leading-none flex items-center gap-1.5 flex-none font-semibold">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isPassedQuorum ? '#06BF8B' : '#76847E'} strokeWidth="2.4" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          Quórum: {p.votes}/{p.votesMax} USDC {isPassedQuorum ? '(Atingido)' : '(Pendente)'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TOASTS NOTIFICATIONS */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-950 text-white rounded-lg p-4 border border-green-200/18 shadow-lg max-w-[340px] flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-green-400/16 text-green-300 grid place-items-center flex-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-sans font-bold text-sm leading-tight text-white">{toast.title}</div>
            <div className="font-mono text-[0.72rem] text-green-300 mt-1 break-all leading-none">{toast.tx}</div>
            <div className="font-sans text-[0.7rem] text-green-200/50 mt-1.5 leading-none">Confirmado via Solana Devnet</div>
          </div>
        </div>
      )}

      {/* NEW PROPOSAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-green-950/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-xl p-8 max-w-[560px] w-full shadow-lg relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 grid place-items-center cursor-pointer transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-6">
              <h2 className="font-sans font-extrabold text-[1.5rem] leading-none tracking-tight text-neutral-900">Nova proposta financeira</h2>
              <p className="font-sans text-xs text-neutral-400 mt-2">Os recursos serão movimentados diretamente via PDA caso a proposta seja aprovada.</p>
            </div>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-sans font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-neutral-500">Título descritivo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de suprimentos atacado FitPro"
                  className="font-sans text-sm text-neutral-900 border border-neutral-200 rounded-xs p-3.5 focus:border-green-500 focus:outline-none bg-neutral-50/50"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-neutral-500">Valor em USDC</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 5400"
                    className="font-sans text-sm text-neutral-900 border border-neutral-200 rounded-xs p-3.5 focus:border-green-500 focus:outline-none bg-neutral-50/50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-neutral-500">Fornecedor Pix / CNPJ</label>
                  <input
                    type="text"
                    required
                    placeholder="FitPro Distribuidora LTDA"
                    className="font-sans text-sm text-neutral-900 border border-neutral-200 rounded-xs p-3.5 focus:border-green-500 focus:outline-none bg-neutral-50/50"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-neutral-500">Categoria da proposta</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Estoque', 'Creators', 'Frete'].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`border rounded-md p-3 flex flex-col gap-1.5 text-center cursor-pointer transition-all ${
                        category === cat
                          ? 'border-green-500 bg-green-50/50 font-bold text-green-950 shadow-xs'
                          : 'border-neutral-200 bg-neutral-50/30 text-neutral-600 hover:border-green-300'
                      }`}
                    >
                      <span className="font-sans text-xs leading-none">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-neutral-500">Descrição detalhada &amp; justificativa de escala</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Justifique como essa transação beneficia o grupo..."
                  className="font-sans text-sm text-neutral-900 border border-neutral-200 rounded-xs p-3.5 focus:border-green-500 focus:outline-none bg-neutral-50/50 resize-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 justify-end mt-4 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="font-sans font-bold text-[0.9375rem] leading-none px-6 py-3.5 border border-neutral-300 hover:border-green-300 rounded-sm cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="font-sans font-bold text-[0.9375rem] leading-none px-6 py-3.5 bg-green-500 hover:bg-green-400 text-[#042A20] rounded-sm cursor-pointer transition-all shadow-brand"
                >
                  Propor no treasury
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governanca;
