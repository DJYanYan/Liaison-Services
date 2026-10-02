import React from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
  badgeText?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title, className = '', badgeText }) => {
  return (
    <div className={`group relative inline-flex items-center align-middle ${className}`}>
      {badgeText ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-help bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          <span>{badgeText}</span>
        </span>
      ) : (
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600 focus:text-slate-800 p-0.5 rounded transition-colors cursor-help"
          aria-label={title || 'Help info'}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popover tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block group-focus-within:block w-72 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none transition-all duration-150 border border-slate-700/60 leading-relaxed">
        {title && <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> {title}</div>}
        <div className="text-slate-200 text-[11px]">{content}</div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};

export const PrototypeNoticeBox: React.FC<{ note: string; title?: string }> = ({ note, title = "Prototype Note" }) => {
  return (
    <div className="bg-sky-50/70 border border-sky-200 rounded-lg p-3 text-xs text-sky-950 flex items-start gap-2.5 my-3">
      <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-sky-900">{title}: </span>
        <span className="text-sky-800 leading-relaxed">{note}</span>
      </div>
    </div>
  );
};
