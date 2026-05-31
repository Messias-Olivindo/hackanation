import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e35] bg-[#0a0a14]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)' }}
          />
          <span className="font-bold text-lg tracking-tight">SellerDAO</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/proposals">
            <Button variant="ghost" size="sm">Propostas</Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm">Entrar na DAO</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
