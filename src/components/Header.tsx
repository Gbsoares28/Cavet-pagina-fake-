import React from 'react';
import { CavetLogo } from './CavetLogo';
import { COMPANY_INFO } from '../constants/config';

interface HeaderProps {
  onOpenAdminInbox?: () => void;
  feedbacksCount?: number;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="w-full bg-white border-b border-slate-100 py-6 sm:py-8">
      {/* Main branding & prompt banner */}
      <div className="max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Logo and company branding */}
        <div className="mb-3">
          <CavetLogo size="lg" />
        </div>

        <p className="text-xs uppercase tracking-widest text-[#00A8B5] font-bold mb-1">
          {COMPANY_INFO.name}
        </p>

        {/* Section Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Avalie sua experiência
        </h1>

        {/* Support text */}
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Sua opinião é importante para nós.
        </p>
      </div>
    </header>
  );
};
