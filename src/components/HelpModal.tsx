import React from 'react';
import { X, CheckCircle, ShieldCheck, DollarSign, Clock, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HelpModal: React.FC = () => {
  const { isHelpModalOpen, closeHelpModal, helpTopic } = useApp();

  if (!isHelpModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                Prototype Guide
              </span>
              <h2 className="text-lg font-bold">About Liaison Services & Demo Walkthrough</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Internal Social Security System (SSS) process and transaction tracking system — Cebu Operations
            </p>
          </div>
          <button
            onClick={closeHelpModal}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Quick Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <span className="text-base">🇵🇭</span>
            <div>
              <strong className="text-amber-950 font-semibold">Purpose of this prototype:</strong>
              <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                This clickable demonstration was built for Cebu business owners and liaison teams handling SSS member transactions, loans, online portal registrations, and benefit claims across Cebu City, Mandaue, Lapu-Lapu, Talisay, and surrounding municipalities.
              </p>
            </div>
          </div>

          {/* Core Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                SSS Liaison Pricing Architecture
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In this business model, <strong>Service Fees</strong> represent the fixed liaison service rates (ranging from ₱30 for PRN, ₱50 for Email Reset, ₱100–₱200 for Loans & E-1, up to ₱300 for Claims and My SSS ID). Statutory loan disbursements and claim payouts are credited directly to the member's DAEM bank or e-wallet account.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Target Dates & Overdue Logic
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every transaction receives an SLA target completion date based on standard SSS branch and online processing turnarounds. Transactions exceeding their target date are highlighted in red on all dashboards and trigger overdue escalation.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Demo User Roles
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can switch between <strong>Owner/Admin</strong> (full financial margins & pricing rule editing), <strong>Operations Manager</strong> (workload reassignments & daily reports), and <strong>Processor/Staff</strong> in the Settings tab.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Auditing & Document Checklists
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every document verified (OR/CR, Deed of Sale, PMVIC, PNP-HPG clearance) and every status change automatically appends an audit entry with user timestamp to maintain compliance and traceability.
              </p>
            </div>
          </div>

          {/* Technical Production Roadmap Note */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
              Production Architecture Roadmap
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>LTO LTMS Integration:</strong> Direct API or automated status sync with LTO Land Transportation Management System.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>SMS & WhatsApp Gateway:</strong> Automated SMS notifications to clients when documents are ready or pending requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Role-Based Access Control:</strong> Strict server-side authorization and encrypted audit logging for Data Privacy Act (RA 10173) compliance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>BIR e-Receipts & Payment Gateways:</strong> Integration with GCash, Maya, and official Bir electronic receipts.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Liaison Services • Cebu Prototype Build v1.0
          </span>
          <button
            onClick={closeHelpModal}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Got it, continue exploring
          </button>
        </div>
      </div>
    </div>
  );
};
