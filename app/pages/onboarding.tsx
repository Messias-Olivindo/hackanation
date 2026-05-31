import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '../src/components/ui/Button';

const MARKETPLACES = [
  { id: 'mercadolivre', name: 'Mercado Livre', icon: '🛒' },
  { id: 'shopee', name: 'Shopee', icon: '🛍️' },
  { id: 'tiktokshop', name: 'TikTok Shop', icon: '🎵' },
  { id: 'amazon', name: 'Amazon', icon: '📦' },
];

const CONTRIBUTION_OPTIONS = [
  { value: 0.5, label: '0,5%', monthly: 150 },
  { value: 1, label: '1%', monthly: 300 },
  { value: 2, label: '2%', monthly: 600 },
];

type Step = 1 | 2 | 3;

interface FormState {
  marketplace: string;
  storeName: string;
  monthlyRevenue: string;
  walletAddress: string;
  contribution: number;
}

const StepIndicator: React.FC<{ current: Step }> = ({ current }) => {
  const steps = [
    { n: 1, label: 'Marketplace' },
    { n: 2, label: 'Carteira' },
    { n: 3, label: 'Contribuição' },
  ];

  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                s.n < current
                  ? 'text-black'
                  : s.n === current
                  ? 'text-black'
                  : 'bg-[#1e1e35] text-gray-500'
              }`}
              style={
                s.n <= current
                  ? { background: 'linear-gradient(135deg, #9945FF, #14F195)' }
                  : {}
              }
            >
              {s.n < current ? '✓' : s.n}
            </div>
            <span className={`text-sm ${s.n === current ? 'text-white' : 'text-gray-500'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px w-12 ${s.n < current ? 'bg-[#9945FF]' : 'bg-[#1e1e35]'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const Step1: React.FC<{
  form: FormState;
  onChange: (key: keyof FormState, val: string) => void;
  onNext: () => void;
}> = ({ form, onChange, onNext }) => {
  const canAdvance = form.marketplace && form.storeName && form.monthlyRevenue;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Conecte seu marketplace</h2>
      <p className="text-gray-400 mb-8">Selecione onde você vende e informe seus dados básicos.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {MARKETPLACES.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange('marketplace', m.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              form.marketplace === m.id
                ? 'border-[#9945FF] bg-[#9945FF]/10'
                : 'border-[#1e1e35] bg-[#111120] hover:border-[#9945FF]/40'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <div className="mt-2 text-sm font-medium">{m.name}</div>
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Nome da loja</label>
          <input
            type="text"
            placeholder="Ex: Loja do João"
            value={form.storeName}
            onChange={(e) => onChange('storeName', e.target.value)}
            className="w-full bg-[#111120] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9945FF] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Faturamento mensal médio (R$)</label>
          <input
            type="number"
            placeholder="Ex: 30000"
            value={form.monthlyRevenue}
            onChange={(e) => onChange('monthlyRevenue', e.target.value)}
            className="w-full bg-[#111120] border border-[#1e1e35] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#9945FF] transition-colors"
          />
        </div>
      </div>

      <Button onClick={onNext} disabled={!canAdvance} className="w-full">
        Continuar
      </Button>
    </div>
  );
};

const Step2: React.FC<{
  form: FormState;
  onChange: (key: keyof FormState, val: string) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ form, onChange, onNext, onBack }) => {
  const [connecting, setConnecting] = useState(false);

  const handlePhantom = () => {
    setConnecting(true);
    setTimeout(() => {
      onChange('walletAddress', '7vD8qgK845WwZ5R3L1nHt2N8jQ7rW1Yb8i1dJ9x3jL4p');
      setConnecting(false);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Conecte sua carteira</h2>
      <p className="text-gray-400 mb-8">
        Sua carteira Solana é sua identidade na DAO. Usamos ela para registrar votos e receber
        tokens de governança.
      </p>

      {form.walletAddress ? (
        <div className="bg-[#111120] border border-[#14F195]/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[#14F195] text-lg">✓</span>
            <div>
              <div className="text-sm text-gray-400">Carteira conectada</div>
              <div className="font-mono text-sm">
                {form.walletAddress.slice(0, 8)}...{form.walletAddress.slice(-6)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          <button
            onClick={handlePhantom}
            disabled={connecting}
            className="w-full bg-[#111120] border border-[#1e1e35] rounded-xl p-4 flex items-center gap-4 hover:border-[#9945FF]/40 transition-colors disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-lg">
              👻
            </div>
            <div className="text-left">
              <div className="font-medium">Phantom</div>
              <div className="text-sm text-gray-500">Carteira mais popular na Solana</div>
            </div>
            {connecting && <div className="ml-auto text-gray-500 text-sm">Conectando...</div>}
          </button>

          <button className="w-full bg-[#111120] border border-[#1e1e35] rounded-xl p-4 flex items-center gap-4 hover:border-[#9945FF]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg">
              🔵
            </div>
            <div className="text-left">
              <div className="font-medium">Solflare</div>
              <div className="text-sm text-gray-500">Alternativa robusta</div>
            </div>
          </button>
        </div>
      )}

      <div className="bg-[#111120] border border-[#1e1e35] rounded-xl p-4 mb-8 text-sm text-gray-400">
        <span className="text-yellow-400">⚠️</span> Não temos acesso à sua chave privada.
        Só lemos o endereço público da sua carteira.
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={!form.walletAddress} className="flex-1">Continuar</Button>
      </div>
    </div>
  );
};

const Step3: React.FC<{
  form: FormState;
  onChange: (key: keyof FormState, val: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}> = ({ form, onChange, onSubmit, onBack }) => {
  const revenue = Number(form.monthlyRevenue) || 0;
  const monthly = (revenue * form.contribution) / 100;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Defina sua contribuição</h2>
      <p className="text-gray-400 mb-8">
        1% do faturamento validado vai para o treasury coletivo. Você decide o percentual.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {CONTRIBUTION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange('contribution', String(opt.value))}
            className={`p-4 rounded-xl border text-center transition-all ${
              form.contribution === opt.value
                ? 'border-[#9945FF] bg-[#9945FF]/10'
                : 'border-[#1e1e35] bg-[#111120] hover:border-[#9945FF]/40'
            }`}
          >
            <div className="text-xl font-bold">{opt.label}</div>
            <div className="text-xs text-gray-500 mt-1">do faturamento</div>
          </button>
        ))}
      </div>

      {revenue > 0 && (
        <div className="bg-[#111120] border border-[#1e1e35] rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Sua contribuição mensal estimada</span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            R$ {monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            <span className="text-sm text-gray-500 ml-2" style={{ WebkitTextFillColor: '#6b7280' }}>
              /mês
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Baseado em R$ {Number(revenue).toLocaleString('pt-BR')} de faturamento × {form.contribution}%
          </div>
        </div>
      )}

      <div className="bg-[#111120] border border-[#1e1e35] rounded-xl p-4 mb-8 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Marketplace</span>
          <span className="capitalize">{form.marketplace}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Loja</span>
          <span>{form.storeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Carteira</span>
          <span className="font-mono">
            {form.walletAddress.slice(0, 6)}...{form.walletAddress.slice(-4)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onSubmit} className="flex-1">Entrar na DAO</Button>
      </div>
    </div>
  );
};

const Onboarding: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({
    marketplace: '',
    storeName: '',
    monthlyRevenue: '',
    walletAddress: '',
    contribution: 1,
  });

  const update = (key: keyof FormState, val: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === 'contribution' ? Number(val) : val,
    }));
  };

  const handleSubmit = () => {
    router.push('/proposals');
  };

  return (
    <>
      <Head>
        <title>Entrar na DAO — SellerDAO</title>
      </Head>

      <div className="min-h-screen flex">
        {/* Left panel */}
        <div className="hidden md:flex w-96 flex-col justify-between p-10 border-r border-[#1e1e35]">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
            />
            <span className="font-bold text-lg">SellerDAO</span>
          </Link>

          <div>
            <h3 className="font-semibold mb-6 text-gray-400 text-sm uppercase tracking-wider">
              Por que entrar?
            </h3>
            <div className="space-y-5">
              {[
                { icon: '📦', text: 'Compra coletiva de estoque com preço de indústria' },
                { icon: '🎥', text: 'Lives com creators de audiência real' },
                { icon: '💸', text: 'Crédito interno com taxa justa' },
                { icon: '🔐', text: 'Treasury on-chain — ninguém guarda o dinheiro' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-gray-400 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-600">
            Construído na Solana · Hackanation 2026
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <StepIndicator current={step} />

            {step === 1 && <Step1 form={form} onChange={update} onNext={() => setStep(2)} />}
            {step === 2 && (
              <Step2
                form={form}
                onChange={update}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                form={form}
                onChange={update}
                onSubmit={handleSubmit}
                onBack={() => setStep(2)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
