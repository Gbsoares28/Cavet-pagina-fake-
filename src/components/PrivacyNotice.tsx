import React from 'react';

export const PrivacyNotice: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 text-center">
      <p className="text-[11px] text-slate-400">
        © {new Date().getFullYear()} CAVET — Hospital Veterinário Tijuca 24h.
      </p>
    </footer>
  );
};
