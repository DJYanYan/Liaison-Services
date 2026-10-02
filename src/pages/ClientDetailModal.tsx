import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Clock, 
  Plus, 
  Calendar, 
  ExternalLink,
  Shield,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { formatCurrency, getStatusBadgeStyle } from '../utils/formatters';
import { PrototypeNoticeBox } from '../components/InfoTooltip';

interface ClientDetailModalProps {
  clientId: string;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  clientId,
  onClose
}) => {
  const { 
    clients, 
    transactions, 
    updateClient, 
    setSelectedTransactionId, 
    setIsCreateTxnModalOpen, 
    setCreateTxnPreFill 
  } = useApp();

  const client = clients.find(c => c.id === clientId);

  const [notesText, setNotesText] = useState(client?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!client) return null;

  // Transactions linked to this client
  const clientTransactions = transactions.filter(t => t.clientId === client.id);

  const handleSaveNotes = () => {
    updateClient(client.id, { notes: notesText });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCreateTxnForClient = () => {
    onClose();
    setCreateTxnPreFill({
      selectedClientId: client.id,
      referenceNumber: client.primaryReference
    });
    setIsCreateTxnModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-sm border border-slate-700">
              {client.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-1.5 py-0.2 rounded">
                  Client ID: {client.id}
                </span>
                <span className="text-[11px] text-amber-300 font-medium">
                  {client.city}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {client.fullName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateTxnForClient}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Transaction</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-5">
          {/* Contact Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">CONTACT NUMBER</span>
              <span className="font-bold text-slate-900">{client.contactNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">EMAIL ADDRESS</span>
              <span className="text-slate-800 truncate block">{client.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">TIN / VALID ID</span>
              <span className="text-slate-800">{client.tinOrIdNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-sans">SSS MEMBER REFERENCE</span>
              <span className="font-bold text-blue-700">{client.primaryReference}</span>
            </div>
          </div>

          {/* Client Notes & Service Context */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="client-notes" className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Client Profile Notes & Preferences
              </label>
              {isSaved && (
                <span className="text-emerald-600 font-medium text-[11px] animate-in fade-in">
                  Notes updated!
                </span>
              )}
            </div>
            <textarea
              id="client-notes"
              rows={2}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g. VIP client, preferred liaison branch, special invoice instructions..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>

          {/* Transaction History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Transaction History</span>
                <span className="text-slate-400 font-normal text-xs">
                  ({clientTransactions.length} records)
                </span>
              </h3>
            </div>

            {clientTransactions.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                No transactions recorded yet for this client.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Transaction</th>
                      <th className="py-2.5 px-3">Service & Reference</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Target Date</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientTransactions.map(t => {
                      const badge = getStatusBadgeStyle(t.status);
                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {t.id}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-800">{t.serviceName}</div>
                            <div className="font-mono text-[11px] text-slate-500">{t.referenceNumber}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
                              <span>{badge.label}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {t.targetDate}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatCurrency(t.pricing.totalAmount)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                onClose();
                                setSelectedTransactionId(t.id);
                              }}
                              className="text-blue-600 hover:underline font-semibold text-[11px] cursor-pointer inline-flex items-center gap-0.5"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <PrototypeNoticeBox 
            note="Client records in the real system would be protected by role-based access and privacy controls (Republic Act 10173 - Data Privacy Act of 2012)."
          />
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Joined {client.createdAt}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
