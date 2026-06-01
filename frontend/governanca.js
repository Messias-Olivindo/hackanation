/* ============================================================
   Governança — Compre Fitness Manaus
   Propostas, votação ao vivo, abertura de proposta (propose)
   ============================================================ */

const MY_WEIGHT = 120; // peso de voto do seller logado (João Victor)

const CATS = {
  estoque:  { label: 'Estoque',  cls: 'cat--estoque' },
  creators: { label: 'Creators', cls: 'cat--creators' },
  midia:    { label: 'Mídia',    cls: 'cat--midia' },
  credito:  { label: 'Crédito',  cls: 'cat--credito' },
  frete:    { label: 'Frete',    cls: 'cat--frete' },
};

let proposals = [
  {
    id: 41, cat: 'estoque', status: 'voto', timeLeft: '41h restantes',
    title: 'Compra coletiva · 1.200kg de poliamida',
    desc: 'Fornecedor Malhas do Sul oferece 35% de desconto a partir de 1.000kg. O treasury paga, o tecido é rateado proporcionalmente ao volume de cada seller. Economia estimada de R$ 11/metro.',
    proposer: 'Manaus Active Wear', av: 'MA', avc: '#07F2B0',
    amount: '9.600', recipient: 'Malhas do Sul · custodial',
    forV: 1480, againstV: 320, abstainV: 210, quorum: 1200, you: null,
  },
  {
    id: 42, cat: 'creators', status: 'voto', timeLeft: '18h restantes',
    title: 'Creator pool · Live TikTok Shop com @manu.fit (180k)',
    desc: 'Cachê de R$ 13.000 dividido entre 10 sellers — cada um exibe 3 produtos por R$ 1.300. Revenue share distribuído automaticamente via smart contract conforme as vendas por produto.',
    proposer: 'TechFit Acessórios', av: 'TA', avc: '#96D9C0',
    amount: '2.400', recipient: 'Agência @manu.fit · custodial',
    forV: 1690, againstV: 180, abstainV: 240, quorum: 1200, you: null,
  },
  {
    id: 43, cat: 'frete', status: 'voto', timeLeft: '60h restantes',
    title: 'Contrato de frete regional · Amazonas Log',
    desc: 'Volume coletivo para negociar contrato direto com a transportadora regional. Frete de R$ 28 → R$ 15/pacote nos canais próprios (Instagram, WhatsApp). Etiquetas via API, crédito descontado do treasury.',
    proposer: 'Ana · Serrana Moda Fitness', av: 'SM', avc: '#06BF8B',
    amount: '3.000', recipient: 'Amazonas Log · custodial',
    forV: 1040, againstV: 280, abstainV: 160, quorum: 1200, you: null,
  },
  {
    id: 40, cat: 'frete', status: 'aprovada', timeLeft: 'Janela encerra em 6h',
    title: 'Etiquetas Jadlog · lote mensal do coletivo',
    desc: 'Aprovada por maioria simples. Aguardando o fim da janela de 72h para execução automática via PDA do treasury.',
    proposer: 'Flex Studio Wear', av: 'FS', avc: '#2EE6A6',
    amount: '3.200', recipient: 'Jadlog · custodial',
    forV: 1610, againstV: 240, abstainV: 90, quorum: 1200, you: 'for',
  },
  {
    id: 39, cat: 'midia', status: 'executada',
    title: 'Fundo coletivo de mídia · Meta Ads "moda fitness"',
    desc: 'Campanha externa por categoria apontando para os anúncios do coletivo no ML. Cliques distribuídos entre membros por volume.',
    proposer: 'Amazon Fit Suplementos', av: 'AF', avc: '#5BE8BE',
    amount: '4.000', recipient: 'Meta Ads · custodial',
    forV: 1720, againstV: 150, abstainV: 130, quorum: 1200, you: 'for',
    txHash: '8mPq1L…W3kL', benefit: '−40% de CPM · 31 sellers beneficiados',
  },
  {
    id: 37, cat: 'estoque', status: 'executada',
    title: 'Compra coletiva · 800 garrafas térmicas FitPro',
    desc: 'Pedido mínimo de 500un destravado pelo coletivo. Rateio proporcional entregue aos sellers de acessórios.',
    proposer: 'Tarumã Fit', av: 'TF', avc: '#07D99D',
    amount: '5.400', recipient: 'FitPro Indústria · custodial',
    forV: 1540, againstV: 260, abstainV: 110, quorum: 1200, you: 'for',
    txHash: '5xRk2C…9fA2', benefit: '−34% no custo unitário',
  },
  {
    id: 34, cat: 'credito', status: 'executada',
    title: 'Antecipação coletiva de recebíveis · Shopee',
    desc: 'Empréstimo do treasury a 1,5% a.m. (vs 4% de fintechs). Reembolso descontado automaticamente das próximas contribuições, com stake como colateral.',
    proposer: 'Norte Power Nutrition', av: 'NP', avc: '#06BF8B',
    amount: '6.800', recipient: '6 sellers · interno',
    forV: 1450, againstV: 410, abstainV: 90, quorum: 1200, you: null,
    txHash: '3kT9a7…Lp02', benefit: 'Economia de 2,5% a.m. em juros',
  },
  {
    id: 38, cat: 'midia', status: 'recusada',
    title: 'Patrocínio do evento Manaus Fit Expo',
    desc: 'Proposta de patrocínio coletivo do estande no evento regional.',
    proposer: 'Equador Sportswear', av: 'ES', avc: '#5BE8BE',
    amount: '5.000', recipient: 'Manaus Fit Expo · custodial',
    forV: 760, againstV: 980, abstainV: 120, quorum: 1200, you: 'against',
    reason: 'Não atingiu maioria simples — 42% a favor. Treasury preservado para compras de estoque.',
  },
];

const FILTERS = [
  { key: 'voto',     label: 'Em votação' },
  { key: 'aprovada', label: 'Aprovadas' },
  { key: 'executada',label: 'Executadas' },
  { key: 'recusada', label: 'Recusadas' },
];
let activeFilter = 'voto';

/* ---------- helpers ---------- */
const pct = (a, b, c) => { const t = a + b + c || 1; return Math.round(a / t * 100); };

function statusBadge(s) {
  if (s === 'voto') return '<span class="badge badge--voto"><span class="d"></span>Em votação</span>';
  if (s === 'aprovada') return '<span class="badge badge--ativo"><span class="d"></span>Aprovada</span>';
  if (s === 'executada') return '<span class="badge badge--exec"><span class="d"></span>Executada</span>';
  if (s === 'recusada') return '<span class="badge badge--rej"><span class="d"></span>Recusada</span>';
  return '';
}

function cardHTML(p) {
  const total = p.forV + p.againstV + p.abstainV;
  const fp = pct(p.forV, p.againstV, p.abstainV);
  const ap = pct(p.againstV, p.forV, p.abstainV);
  const bp = 100 - fp - ap;
  const quorumOk = total >= p.quorum;
  const c = CATS[p.cat];

  let foot = '';
  if (p.status === 'voto') {
    if (p.you) {
      const lbl = p.you === 'for' ? 'a favor' : p.you === 'against' ? 'contra' : 'abstenção';
      foot = `<div class="prop-foot">
        <span class="voted-tag"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Você votou ${lbl} · peso ${MY_WEIGHT}</span>
        <button class="btn btn--ghost btn--sm" onclick="undoVote(${p.id})">Desfazer</button>
      </div>`;
    } else {
      foot = `<div class="prop-foot">
        <button class="btn btn--primary" onclick="vote(${p.id},'for')">Votar a favor</button>
        <button class="btn btn--secondary" onclick="vote(${p.id},'against')">Votar contra</button>
        <button class="btn btn--ghost btn--sm" onclick="vote(${p.id},'abstain')">Abster</button>
      </div>`;
    }
  } else if (p.status === 'aprovada') {
    foot = `<div class="exec-strip">
      <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div>
      <div class="tt">Aprovada por maioria simples<small>${p.timeLeft} · execução automática via PDA do treasury</small></div>
    </div>`;
  } else if (p.status === 'executada') {
    foot = `<div class="exec-strip">
      <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
      <div class="tt">Treasury executou ${p.amount} USDC · Pix enviado ao fornecedor<small>${p.benefit}</small></div>
      <a class="hash" href="https://explorer.solana.com/?cluster=devnet" target="_blank" rel="noopener">${p.txHash} ↗</a>
    </div>`;
  } else if (p.status === 'recusada') {
    foot = `<div class="rej-strip"><b>Recusada.</b> ${p.reason}</div>`;
  }

  const timeChip = p.status === 'voto'
    ? `<span class="time"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${p.timeLeft}</span>`
    : '';

  return `<div class="card prop">
    <div class="prop-top">
      <span class="cat ${c.cls}">${c.label}</span>
      <span class="id">#0${p.id}</span>
      ${statusBadge(p.status)}
      <span class="spacer"></span>
      ${timeChip}
    </div>
    <h3>${p.title}</h3>
    <p class="desc">${p.desc}</p>

    <div class="prop-meta">
      <div class="m"><div class="k">Proponente</div><div class="v"><span class="av" style="background:${p.avc}">${p.av}</span>${p.proposer}</div></div>
      <div class="m"><div class="k">Valor</div><div class="v amt">${p.amount} <small>USDC</small></div></div>
      <div class="m"><div class="k">Destinatário</div><div class="v mono">${p.recipient}</div></div>
    </div>

    <div class="votes">
      <div class="vline"><div class="top"><span>A favor</span><span class="pct">${fp}% · ${p.forV.toLocaleString('pt-BR')}</span></div><div class="vbar"><i style="width:${fp}%;background:var(--gradient-brand)"></i></div></div>
      <div class="vline"><div class="top"><span>Contra</span><span class="pct">${ap}% · ${p.againstV.toLocaleString('pt-BR')}</span></div><div class="vbar"><i style="width:${ap}%;background:var(--neutral-400)"></i></div></div>
      <div class="vline"><div class="top"><span>Abstenção</span><span class="pct">${bp}% · ${p.abstainV.toLocaleString('pt-BR')}</span></div><div class="vbar"><i style="width:${bp}%;background:var(--neutral-300)"></i></div></div>
    </div>
    <div class="quorum">
      <span>Quórum: ${total.toLocaleString('pt-BR')} / ${p.quorum.toLocaleString('pt-BR')} votos de peso</span>
      ${quorumOk ? '<span class="ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Quórum atingido</span>' : '<span>Faltam ' + (p.quorum-total).toLocaleString('pt-BR') + '</span>'}
    </div>

    ${foot}
  </div>`;
}

function render() {
  // tabs
  document.getElementById('tabs').innerHTML = FILTERS.map(f => {
    const n = proposals.filter(p => p.status === f.key).length;
    return `<button class="tab ${activeFilter === f.key ? 'active' : ''}" onclick="setFilter('${f.key}')">${f.label}<span class="cnt">${n}</span></button>`;
  }).join('');
  // list
  const list = proposals.filter(p => p.status === activeFilter);
  const wrap = document.getElementById('plist');
  if (!list.length) {
    wrap.innerHTML = `<div class="card card--pad" style="text-align:center;color:var(--fg-tertiary)">Nenhuma proposta nesta categoria ainda.</div>`;
  } else {
    wrap.innerHTML = list.map(cardHTML).join('');
  }
}

function setFilter(k) { activeFilter = k; render(); }

function vote(id, choice) {
  const p = proposals.find(x => x.id === id);
  if (!p || p.you) return;
  p.you = choice;
  if (choice === 'for') p.forV += MY_WEIGHT;
  else if (choice === 'against') p.againstV += MY_WEIGHT;
  else p.abstainV += MY_WEIGHT;
  render();
  const lbl = choice === 'for' ? 'a favor' : choice === 'against' ? 'contra' : 'abstenção';
  toast('Voto registrado on-chain', `vote · #0${id} · ${lbl} · peso ${MY_WEIGHT}`);
}

function undoVote(id) {
  const p = proposals.find(x => x.id === id);
  if (!p || !p.you) return;
  if (p.you === 'for') p.forV -= MY_WEIGHT;
  else if (p.you === 'against') p.againstV -= MY_WEIGHT;
  else p.abstainV -= MY_WEIGHT;
  p.you = null;
  render();
}

/* ---------- toast ---------- */
function toast(msg, sub) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="dot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span><div>${msg}${sub ? `<small>${sub}</small>` : ''}</div>`;
  document.getElementById('toasts').appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 260); }, 3200);
}

/* ---------- modal: nova proposta ---------- */
const scrim = document.getElementById('scrim');
function openModal() { scrim.classList.add('open'); }
function closeModal() { scrim.classList.remove('open'); }
document.getElementById('openProp').addEventListener('click', openModal);
document.getElementById('closeProp').addEventListener('click', closeModal);
document.getElementById('cancelProp').addEventListener('click', closeModal);
scrim.addEventListener('click', e => { if (e.target === scrim) closeModal(); });

let nextId = 44;
document.getElementById('submitProp').addEventListener('click', () => {
  const cat = document.querySelector('input[name="cat"]:checked').value;
  const title = document.getElementById('f-title').value.trim() || 'Nova proposta do coletivo';
  const desc = document.getElementById('f-desc').value.trim() || 'Proposta aberta para votação do coletivo.';
  const amount = document.getElementById('f-amount').value.trim() || '0';
  const wallet = document.getElementById('f-wallet').value.trim() || 'destinatário · custodial';
  const id = nextId++;
  proposals.unshift({
    id, cat, status: 'voto', timeLeft: '72h restantes',
    title, desc, proposer: 'João Victor (você)', av: 'JV', avc: '#06BF8B',
    amount, recipient: wallet, forV: 0, againstV: 0, abstainV: 0, quorum: 1200, you: null,
  });
  // reset
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-amount').value = '';
  document.getElementById('f-wallet').value = '';
  closeModal();
  activeFilter = 'voto';
  render();
  toast(`Proposta #0${id} aberta on-chain`, `propose · janela de votação de 72h iniciada`);
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

render();
