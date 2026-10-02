import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  Car, 
  FileCheck, 
  DollarSign, 
  MessageSquare, 
  Trash2, 
  AlertTriangle,
  Send,
  Plus,
  ArrowRight,
  ShieldAlert,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionStatus, PriorityLevel } from '../types';
import { formatCurrency, getStatusBadgeStyle, getPriorityBadgeStyle, isOverdue } from '../utils/formatters';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';

interface TransactionDetailModalProps {
  transactionId: string;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transactionId,
  onClose
}) => {
  const { 
    transactions, 
    staff, 
    updateTransactionStatus, 
    updateTransactionStaff, 
    updateTransactionNotes, 
    toggleChecklistItem, 
    deleteTransaction,
    canDeleteTransactions,
    setSelectedClientId,
    setActiveTab
  } = useApp();

  const txn = transactions.find(t => t.id === transactionId);

  const [activeTab, setActiveTabLocal] = useState<'details' | 'checklist' | 'pricing' | 'timeline'>('details');
  const [newStatus, setNewStatus] = useState<TransactionStatus>(txn?.status || 'New');
  const [statusNote, setStatusNote] = useState('');
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  const [internalNotesText, setInternalNotesText] = useState(txn?.internalNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [newTimelineNote, setNewTimelineNote] = useState('');

  if (!txn) return null;

  const isOver = isOverdue(txn.targetDate, txn.status);
  const badge = getStatusBadgeStyle(txn.status);
  const priorityClass = getPriorityBadgeStyle(txn.priority);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTransactionStatus(txn.id, newStatus, statusNote);
    setIsChangingStatus(false);
    setStatusNote('');
  };

  const handleNotesSave = () => {
    updateTransactionNotes(txn.id, internalNotesText);
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 2000);
  };

  const handleTimelineNoteAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineNote.trim()) return;
    updateTransactionStatus(txn.id, txn.status, newTimelineNote.trim());
    setNewTimelineNote('');
  };

  const allStatuses: TransactionStatus[] = [
    'New',
    'Requirements Pending',
    'Ready for Processing',
    'In Progress',
    'Waiting on SSS',
    'Waiting on Client',
    'Completed',
    'Cancelled'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-amber-400 font-bold text-sm tracking-wide">
                {txn.id}
              </span>
              <span className="text-slate-500">·</span>
              <span className={`px-2 py-0.5 rounded text-xs border font-medium ${priorityClass}`}>
                {txn.priority} Priority
              </span>
              {isOver && (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded text-xs font-semibold">
                  Overdue
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{txn.serviceName}</span>
              <span className="text-slate-400 text-xs font-mono font-normal">
                ({txn.referenceNumber})
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsChangingStatus(!isChangingStatus)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              Update Status
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

        {/* Status quick changer bar (if toggled) */}
        {isChangingStatus && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleStatusSubmit} className="space-y-3">
              <div className="text-xs font-semibold text-amber-950 flex items-center justify-between">
                <span>Change Transaction Status & Log Reason:</span>
                <span className="text-[11px] text-amber-700">Audit entry will be added automatically</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TransactionStatus)}
                  className="bg-white border border-amber-300 text-slate-800 text-xs rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                >
                  {allStatuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Optional status update note / action taken..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="sm:col-span-2 bg-white border border-amber-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingStatus(false)}
                  className="px-3 py-1 text-xs text-amber-900 hover:bg-amber-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs transition-colors cursor-pointer"
                >
                  Confirm & Log Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Sub-navigation Bar */}
        <div className="px-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-1.5">
            <button
              onClick={() => setActiveTabLocal('details')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'details' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview & Details
            </button>
            <button
              onClick={() => setActiveTabLocal('checklist')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Requirements</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full font-mono">
                {txn.checklist.filter(c => c.verified).length}/{txn.checklist.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTabLocal('pricing')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'pricing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Price Breakdown ({formatCurrency(txn.pricing.totalAmount)})
            </button>
            <button
              onClick={() => setActiveTabLocal('timeline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Timeline & Notes</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded-full font-mono">
                {txn.activityTimeline.length}
              </span>
            </button>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
              <span>{badge.label}</span>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-5">
          {/* TAB 1: DETAILS & OVERVIEW */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Info Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Client Profile
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        setSelectedClientId(txn.clientId);
                        setActiveTab('clients');
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View in Clients
                    </button>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{txn.clientName}</div>
                    <div className="font-mono text-slate-600 mt-0.5">{txn.clientPhone}</div>
                  </div>
                </div>

                {/* Assigned Staff Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-slate-500 font-medium flex items-center justify-between">
                    <span>Assigned Staff Member</span>
                    <InfoTooltip
                      title="Staff Assignment"
                      content="The assigned staff member is responsible for the next action on this transaction."
                    />
                  </div>
                  <div>
                    <select
                      value={txn.assignedStaffId}
                      onChange={(e) => updateTransactionStaff(txn.id, e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.roleTitle.split('&')[0]})
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Updates instantly notify staff member queue.
                    </div>
                  </div>
                </div>

                {/* Target Dates Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-slate-500 font-medium flex items-center justify-between">
                    <span>Timeline & Target Date</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-slate-800">
                      <span>Created On:</span>
                      <strong className="font-mono">{txn.createdAt}</strong>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-slate-800">
                      <span>Target Completion:</span>
                      <strong className={`font-mono ${isOver ? 'text-rose-600 font-bold' : ''}`}>
                        {txn.targetDate}
                      </strong>
                    </div>
                    {txn.completedDate && (
                      <div className="flex items-center justify-between mt-1 text-emerald-700">
                        <span>Released Date:</span>
                        <strong className="font-mono">{txn.completedDate}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SSS Member & Disbursement Details */}
              {txn.sssDetails && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    SSS Member Profile & DAEM Disbursement Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">SS NUMBER</span>
                      <span className="font-bold text-slate-900 text-xs">{txn.sssDetails.sssNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">MEMBER TYPE</span>
                      <span className="text-slate-800">{txn.sssDetails.memberType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CRN / UMID</span>
                      <span className="text-slate-800">{txn.sssDetails.crnOrUmid || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">EMPLOYER / BUSINESS</span>
                      <span className="text-slate-800">{txn.sssDetails.employerName || 'Self / Voluntary'}</span>
                    </div>
                    {txn.sssDetails.disbursementBank && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">DAEM BANK / WALLET</span>
                        <span className="text-blue-700 font-bold">{txn.sssDetails.disbursementBank}</span>
                      </div>
                    )}
                    {txn.sssDetails.bankAccountNumber && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">ACCOUNT NUMBER</span>
                        <span className="text-slate-800 font-bold">{txn.sssDetails.bankAccountNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicle / License Details */}
              {txn.vehicleDetails && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-600" />
                    Vehicle Identification & LTO Registration Specs
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">PLATE NUMBER</span>
                      <span className="font-bold text-slate-900 text-xs">{txn.vehicleDetails.plateNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">MAKE & MODEL</span>
                      <span className="text-slate-800">{txn.vehicleDetails.makeModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">YEAR MODEL</span>
                      <span className="text-slate-800">{txn.vehicleDetails.year}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">MV FILE NUMBER</span>
                      <span className="text-slate-800">{txn.vehicleDetails.mvFileNumber || '1301-XXXXXX'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CHASSIS / VIN</span>
                      <span className="text-slate-800">{txn.vehicleDetails.chassisNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ENGINE NUMBER</span>
                      <span className="text-slate-800">{txn.vehicleDetails.engineNumber || 'N/A'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">MVUC CLASSIFICATION</span>
                      <span className="text-slate-800">{txn.vehicleDetails.classification || 'Light Passenger'}</span>
                    </div>
                  </div>
                </div>
              )}

              {txn.licenseDetails && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-slate-600" />
                    Driver's License Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">LICENSE NUMBER</span>
                      <span className="font-bold text-slate-900 text-xs">{txn.licenseDetails.licenseNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CLASSIFICATION</span>
                      <span className="text-slate-800">{txn.licenseDetails.licenseType || 'Non-Professional'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">EXPIRATION</span>
                      <span className="text-slate-800">{txn.licenseDetails.currentExpirationDate || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DL CODES / CONDITIONS</span>
                      <span className="text-slate-800">{txn.licenseDetails.restrictions || 'Codes A, B'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Internal Operations Notes Editor */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="txn-internal-notes" className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    Internal Operations Notes & Special Instructions
                  </label>
                  {isNotesSaved && (
                    <span className="text-emerald-600 font-medium text-[11px] animate-in fade-in">
                      Saved to session!
                    </span>
                  )}
                </div>
                <textarea
                  id="txn-internal-notes"
                  rows={3}
                  value={internalNotesText}
                  onChange={(e) => setInternalNotesText(e.target.value)}
                  placeholder="Record queue notes, emission test results, courier tracking codes, or client follow-ups..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleNotesSave}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Save Operational Note
                  </button>
                </div>
              </div>

              <PrototypeNoticeBox 
                note="In the production system, status changes would be saved to a secure database and included in the audit trail." 
              />
            </div>
          )}

          {/* TAB 2: REQUIREMENTS CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Mandatory LTO Document Checklist
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Click checkboxes to toggle verification of submitted papers. Each action logs a timestamp.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-slate-900">
                    {txn.checklist.filter(c => c.verified).length}
                  </span>
                  <span className="text-slate-400"> / {txn.checklist.length} Verified</span>
                </div>
              </div>

              <div className="space-y-2">
                {txn.checklist.map(item => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      item.verified 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.verified}
                        onChange={(e) => toggleChecklistItem(txn.id, item.id, e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        id={`check_${item.id}`}
                      />
                      <label htmlFor={`check_${item.id}`} className="cursor-pointer">
                        <div className={`font-semibold ${item.verified ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                          {item.name}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200/60">
                            <strong>Note:</strong> {item.notes}
                          </div>
                        )}
                        {item.verified && item.verifiedAt && (
                          <div className="text-[10px] text-emerald-700 font-mono mt-1">
                            Verified on {item.verifiedAt}
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="shrink-0">
                      {item.verified ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRICING BREAKDOWN */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Standardized Cost & Fee Breakdown
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Transparent separation between government pass-through disbursements and liaison service fee revenue.
                  </p>
                </div>
                <InfoTooltip 
                  title="Pricing Components"
                  content="Government fee is paid directly to LTO/PMVIC/Insurance. Service fee represents business earnings. Discounts are applied to service fees."
                />
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">1. Base Government Fee (Pass-through)</span>
                    <span className="block text-[11px] text-slate-500">
                      MVUC, IT Computer Fee, Plate/Sticker, or License Card Fee
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(txn.pricing.governmentFee)}
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">2. Business / Liaison Service Fee</span>
                    <span className="block text-[11px] text-slate-500">
                      Field processor liaison, document verification, and queue management
                    </span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {formatCurrency(txn.pricing.serviceFee)}
                  </span>
                </div>

                {txn.pricing.addOns.length > 0 && (
                  <div className="p-3.5 space-y-1.5">
                    <span className="font-semibold text-slate-800 block">3. Selected Add-on Services</span>
                    {txn.pricing.addOns.map(add => (
                      <div key={add.id} className="flex items-center justify-between pl-3 text-slate-600">
                        <span>• {add.name}</span>
                        <span className="font-mono font-medium">{formatCurrency(add.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {txn.pricing.discount > 0 && (
                  <div className="p-3.5 flex items-center justify-between text-rose-700 bg-rose-50/50">
                    <div>
                      <span className="font-semibold">Discount Applied</span>
                      {txn.pricing.discountReason && (
                        <span className="block text-[11px] text-rose-600">
                          Reason: {txn.pricing.discountReason}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-sm">
                      -{formatCurrency(txn.pricing.discount)}
                    </span>
                  </div>
                )}

                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                      Total Quoted Amount
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Inclusive of all official receipts & service delivery
                    </span>
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                    {formatCurrency(txn.pricing.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE & AUDIT LOGS */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Activity & Audit Trail
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Chronological immutable history of every status change, assignment, and liaison note.
                  </p>
                </div>
              </div>

              {/* Add Quick Log Entry Form */}
              <form onSubmit={handleTimelineNoteAdd} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Add timestamped activity note (e.g. 'Paid cashier at LTO Pasay')..."
                  value={newTimelineNote}
                  onChange={(e) => setNewTimelineNote(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Log</span>
                </button>
              </form>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {txn.activityTimeline.map((item, idx) => (
                  <div key={item.id} className="relative">
                    <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 ring-4 ring-white"></span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{item.action}</span>
                        <span className="font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>By <strong>{item.userName}</strong> ({item.userRole})</span>
                      </div>
                      {item.details && (
                        <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                          {item.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {canDeleteTransactions ? (
              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="text-rose-600 hover:text-rose-800 font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Transaction</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">
                Delete restricted to Owner/Admin role
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Deletion */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Transaction Deletion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete transaction <strong>{txn.id}</strong> for <strong>{txn.clientName}</strong>? This action will remove the record from demo storage and log an audit entry.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTransaction(txn.id);
                  setIsConfirmDeleteOpen(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
