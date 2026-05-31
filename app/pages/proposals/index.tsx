import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '../../src/components/ui/Navbar';
import { Button } from '../../src/components/ui/Button';
import {
  MOCK_PROPOSALS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ProposalStatus,
  type ProposalCategory,
} from '../../src/lib/mockProposals';

const TREASURY = 847320;

function timeLeft(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return 'Encerrada';
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h restantes`;
  return `${Math.floor(hours / 24)}d restantes`;
}

function StatusBadge({ status }: { status: ProposalStatus }) {
  const map = {
    active: { label: 'Aberta', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    approved: { label: 'Aprovada', bg: 'bg-green-500/10 text-green-400 border-green-500/20' },
    rejected: { label: 'Rejeitada', bg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };
  const { label, bg } = map[status];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${bg}`}>{label}</span>
  );
}

function VoteBar({ votesFor, total }: { votesFor: number; total: number }) {
  const pct = total > 0 ? Math.round((votesFor / total) * 100) : 0;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>{pct}% a favor</span>
        <span>{100 - pct}% contra</span>
      </div>
      <div className="h-1.5 bg-[#1e1e35] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #9945FF, #14F195)',
          }}
        />
      </div>
    </div>
  );
}

const Proposals: NextPage = () => {
  const [filter, setFilter] = useState<ProposalStatus | 'all'>('all');

  const filtered =
    filter === 'all' ? MOCK_PROPOSALS : MOCK_PROPOSALS.filter((p) => p.status === filter);

  const active = MOCK_PROPOSALS.filter((p) => p.status === 'active').length;

  return (
    <>
      <Head>
        <title>Propostas — SellerDAO</title>
      </Head>

      <Navbar />

      <main className="pt-16 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Propostas</h1>
            <p className="text-gray-400">
              {active} proposta{active !== 1 ? 's' : ''} ativa{active !== 1 ? 's' : ''} · vote e
              decida como o treasury é usado
            </p>
          </div>
          <Link href="/proposals/new">
            <Button>+ Nova proposta</Button>
          </Link>
        </div>

        {/* Treasury banner */}
        <div
          className="rounded-2xl p-px mb-8"
          style={{ background: 'linear-gradient(135deg, #9945FF20, #14F19520)' }}
        >
          <div className="bg-[#0d0d1a] rounded-2xl px-6 py-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Treasury coletivo</div>
              <div
                className="text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #9945FF, #14F195)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                R$ {TREASURY.toLocaleString('pt-BR')}
              </div>
            </div>
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-gray-500 mb-0.5">Membros</div>
                <div className="font-semibold">142</div>
              </div>
              <div>
                <div className="text-gray-500 mb-0.5">Aprovadas</div>
                <div className="font-semibold">23</div>
              </div>
              <div>
                <div className="text-gray-500 mb-0.5">Executadas</div>
                <div className="font-semibold">21</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'active', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filter === f
                  ? 'border-[#9945FF] text-[#9945FF] bg-[#9945FF]/10'
                  : 'border-[#1e1e35] text-gray-400 hover:border-gray-500'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Abertas' : f === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
            </button>
          ))}
        </div>

        {/* Proposal cards */}
        <div className="space-y-4">
          {filtered.map((p) => {
            const color = CATEGORY_COLORS[p.category as ProposalCategory];
            return (
              <Link key={p.id} href={`/proposals/${p.id}`}>
                <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-6 hover:border-[#9945FF]/40 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
                        style={{ background: `${color}20` }}
                      >
                        {p.category === 'estoque' ? '📦' : p.category === 'creator' ? '🎥' : p.category === 'midia' ? '📣' : '💸'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ color, background: `${color}20` }}
                          >
                            {CATEGORY_LABELS[p.category as ProposalCategory]}
                          </span>
                          <StatusBadge status={p.status} />
                        </div>
                        <h3 className="font-semibold text-base group-hover:text-[#9945FF] transition-colors truncate">
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-lg">
                        R$ {p.requestedAmount.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{timeLeft(p.endsAt)}</div>
                    </div>
                  </div>

                  <VoteBar votesFor={p.votesFor} total={p.totalVotingPower} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Proposals;
