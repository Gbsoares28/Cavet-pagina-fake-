import React from 'react';
import { GoogleReviewModal } from './components/GoogleReviewModal';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#1e1f20] flex items-center justify-center p-4 sm:p-6 selection:bg-[#8ab4f8]/30 selection:text-[#8ab4f8]">
      {/* Centered Google Dark Review Card (Foreground Only) */}
      <div className="w-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
        <GoogleReviewModal />
      </div>
    </div>
  );
}
