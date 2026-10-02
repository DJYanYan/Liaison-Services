import React, { useState } from 'react';
import { AlertCircle, HelpCircle, X, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DemoBanner: React.FC = () => {
  const { openHelpModal, currentRole, setActiveTab } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-amber-900 font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>DEMO MODE — Sample Data Only • Interactive Concept Prototype • Not connected to LTO systems</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openHelpModal('demo_overview')} 
            className="text-amber-800 underline hover:text-amber-950 font-medium cursor-pointer"
          >
            About this prototype
          </button>
          <button 
            onClick={() => setIsDismissed(false)}
            className="text-amber-700 hover:text-amber-900 text-[11px] bg-amber-100/80 px-2 py-0.5 rounded cursor-pointer"
          >
            Show full banner
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside aria-label="Demo mode warning" className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2.5 shadow-sm border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-white/20 rounded shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide uppercase bg-black/25 px-2 py-0.5 rounded text-[10px] text-amber-200">
                Demo Mode
              </span>
              <span className="font-semibold text-amber-50 text-[13px]">
                Internal Operations Dashboard Prototype — Sample Data Only
              </span>
            </div>
            <p className="text-amber-100/90 text-[11px] mt-0.5">
              Simulated Cebu SSS liaison workflow. Local changes persist in your browser session. Role active:{' '}
              <strong className="text-white capitalize">{currentRole}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              const el = document.getElementById('demo-flow-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-amber-900 font-semibold text-xs hover:bg-amber-50 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Self-Guided Tour
          </button>

          <button
            onClick={() => openHelpModal('demo_overview')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/20 hover:bg-black/30 text-white text-xs font-medium transition-colors cursor-pointer"
            title="Learn about this prototype"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
            Prototype Notes
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-amber-200 hover:text-white rounded hover:bg-black/20 transition-colors cursor-pointer"
            aria-label="Dismiss demo banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
