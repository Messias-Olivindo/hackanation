import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '../../src/components/ui/Navbar';
import { Button } from '../../src/components/ui/Button';
import {
  MOCK_PROPOSALS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type Proposal,
  type ProposalCategory,
} from '../../src/lib/mockProposals';

function timeLeft(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return 'Encerrada';
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h restantes`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h restantes`;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  proposal: Proposal;
}

const ProposalDetail: NextPage<Props> = ({ proposal }) => {
  const [voted, setVoted] = useState<'for' | 'against' | null>(null);
  const [votes, setVotes] = useState({ for: proposal.votesFor, against: proposal.votesAgainst });

  const total = votes.for + votes.against;
  const pctFor = total > 0 ? Math.round((votes.for / total) * 100) : 0;
  const color = CATEGORY_COLORS[proposal.category as ProposalCategory];
  const isActive = proposal.status === 'active';

  const handleVote = (side: 'for' | 'against') => {
    if (voted || !isActive) return;
    setVoted(side);
    setVotes((prev) => ({
      ...prev,
      [side === 'for' ? 'for' : 'against']: prev[side === 'for' ? 'for' : 'against'] + 5,
    }));
  };

  return (
    <>
      <Head>
        <title>{proposal.title} — SellerDAO</title>
      </Head>

      <Navbar />

      <main className="pt-16 max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/proposals" className="hover:text-white transition-colors">
            Propostas
          </Link>
          <span>/</span>
          <span className="text-gray-300">#{proposal.id}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Title card */}
            <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ color, background: `${color}20` }}
                >
                  {CATEGORY_LABELS[proposal.category as ProposalCategory]}
                </span>
                <span className="text-xs text-gray-500">Proposta #{proposal.id}</span>
              </div>
              <h1 className="text-2xl font-bold mb-3 leading-snug">{proposal.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Por <strong className="text-white">{proposal.proposer}</strong></span>
                <span>·</span>
                <span>{formatDate(proposal.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Descrição</h2>
              <p className="text-gray-300 leading-relaxed">{proposal.description}</p>
            </div>

            {/* Vote result / feedback */}
            {voted && (
              <div className="bg-[#111120] border border-[#14F195]/30 rounded-2xl p-5 flex items-center gap-3">
                <span className="text-[#14F195] text-xl">✓</span>
                <div>
                  <div className="font-medium">Voto registrado on-chain</div>
                  <div className="text-sm text-gray-400">
                    Você votou <strong>{voted === 'for' ? 'a favor' : 'contra'}</strong> com 5
                    tokens de governança.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-5">
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">Valor solicitado</div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #9945FF, #14F195)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  R$ {proposal.requestedAmount.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={
                      proposal.status === 'active'
                        ? 'text-blue-400'
                        : proposal.status === 'approved'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {proposal.status === 'active'
                      ? 'Aberta'
                      : proposal.status === 'approved'
                      ? 'Aprovada'
                      : 'Rejeitada'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prazo</span>
                  <span>{timeLeft(proposal.endsAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quórum</span>
                  <span>{total} votos</span>
                </div>
              </div>
            </div>

            {/* Voting */}
            <div className="bg-[#111120] border border-[#1e1e35] rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Votação</h3>

              {/* Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-400 font-medium">{pctFor}% a favor</span>
                  <span className="text-red-400 font-medium">{100 - pctFor}% contra</span>
                </div>
                <div className="h-3 bg-[#1e1e35] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pctFor}%`,
                      background: 'linear-gradient(90deg, #9945FF, #14F195)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                  <span>{votes.for} votos</span>
                  <span>{votes.against} votos</span>
                </div>
              </div>

              {isActive ? (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleVote('for')}
                    disabled={!!voted}
                    className="w-full"
                    size="md"
                  >
                    {voted === 'for' ? '✓ Votou a favor' : 'Votar a favor'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVote('against')}
                    disabled={!!voted}
                    className={`w-full ${voted === 'against' ? 'border-red-500 text-red-400' : ''}`}
                    size="md"
                  >
                    {voted === 'against' ? '✓ Votou contra' : 'Votar contra'}
                  </Button>
                  {!voted && (
                    <p className="text-xs text-gray-500 text-center pt-1">
                      Você tem 5 tokens de governança
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 py-2">
                  Votação encerrada
                </div>
              )}
            </div>

            <Link href="/proposals">
              <Button variant="ghost" size="sm" className="w-full">
                ← Voltar para propostas
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const proposal = MOCK_PROPOSALS.find((p) => p.id === id);

  if (!proposal) {
    return { notFound: true };
  }

  return { props: { proposal } };
};

export default ProposalDetail;
