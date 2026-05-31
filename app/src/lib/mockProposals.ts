export type ProposalCategory = 'estoque' | 'creator' | 'midia' | 'credito';
export type ProposalStatus = 'active' | 'approved' | 'rejected';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  status: ProposalStatus;
  requestedAmount: number;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  endsAt: number; // timestamp
  createdAt: number;
}

const now = Date.now();
const day = 86400000;

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Compra coletiva de fita stretch com Videolar-Santafé',
    description:
      'Negociamos com a Videolar-Santafé um pedido mínimo de 10 toneladas de fita stretch para embalagem. O preço de atacado é R$ 8,20/kg contra R$ 14,50/kg no varejo — economia de 43%. O pedido será fracionado proporcionalmente ao stake de cada membro. A entrega é em 15 dias após aprovação.',
    category: 'estoque',
    status: 'active',
    requestedAmount: 82000,
    proposer: 'Rodrigo M.',
    votesFor: 68,
    votesAgainst: 12,
    totalVotingPower: 100,
    endsAt: now + 2 * day,
    createdAt: now - day,
  },
  {
    id: '2',
    title: 'Live no TikTok Shop com @felipecampeao (2,1M seguidores)',
    description:
      'Contratamos o creator Felipe Campeão para uma live de 3 horas no TikTok Shop. O creator tem média de 18k visualizações por live e taxa de conversão de 4,2%. Cada seller participante expõe até 3 SKUs durante a transmissão. Custo dividido proporcionalmente ao stake.',
    category: 'creator',
    status: 'active',
    requestedAmount: 15000,
    proposer: 'Ana C.',
    votesFor: 82,
    votesAgainst: 5,
    totalVotingPower: 100,
    endsAt: now + day + 4 * 3600000,
    createdAt: now - 2 * day,
  },
  {
    id: '3',
    title: 'Campanha de mídia paga no Mercado Ads — Q3',
    description:
      'Verba coletiva de R$ 45k para Mercado Ads durante julho e agosto. Com essa verba atingimos CPM negociado de R$ 4,20 contra R$ 9,80 individual. Targeting: compradores de eletrônicos e casa nos estados SP, RJ, MG.',
    category: 'midia',
    status: 'approved',
    requestedAmount: 45000,
    proposer: 'Marcelo T.',
    votesFor: 91,
    votesAgainst: 9,
    totalVotingPower: 100,
    endsAt: now - day,
    createdAt: now - 4 * day,
  },
  {
    id: '4',
    title: 'Fundo de crédito rotativo para capital de giro',
    description:
      'Separar R$ 120k do treasury como fundo de crédito interno. Sellers podem solicitar até 30% do seu stake em empréstimo, taxa de 1,2% ao mês (vs 4% no mercado). Prazo máximo 90 dias.',
    category: 'credito',
    status: 'rejected',
    requestedAmount: 120000,
    proposer: 'Patricia L.',
    votesFor: 38,
    votesAgainst: 62,
    totalVotingPower: 100,
    endsAt: now - 2 * day,
    createdAt: now - 5 * day,
  },
];

export const CATEGORY_LABELS: Record<ProposalCategory, string> = {
  estoque: 'Estoque',
  creator: 'Creator',
  midia: 'Mídia',
  credito: 'Crédito',
};

export const CATEGORY_COLORS: Record<ProposalCategory, string> = {
  estoque: '#14F195',
  creator: '#FF6B6B',
  midia: '#4ECDC4',
  credito: '#FFD93D',
};
