import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Eye, 
  RotateCcw,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionStatus, ServiceTypeKey, PriorityLevel } from '../types';
import { formatCurrency, getStatusBadgeStyle, getPriorityBadgeStyle, isOverdue } from '../utils/formatters';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';
import { TransactionDetailModal } from './TransactionDetailModal';

export const TransactionsPage: React.FC = () => {
  const { 
    transactions, 
    staff, 
    services, 
    selectedTransactionId, 
    setSelectedTransactionId,
    setIsCreateTxnModalOpen,
    openHelpModal,
    exportCsv
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isOverdueOnly, setIsOverdueOnly] = useState<boolean>(false);

  // Check if session filter for overdue was requested from dashboard
  useEffect(() => {
    const shouldFilterOverdue = window.sessionStorage.getItem('liaisonservices_filter_overdue');
    if (shouldFilterOverdue === 'true') {
      setIsOverdueOnly(true);
      window.sessionStorage.removeItem('liaisonservices_filter_overdue');
    }
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = txn.id.toLowerCase().includes(q);
        const matchesClient = txn.clientName.toLowerCase().includes(q);
        const matchesRef = txn.referenceNumber.toLowerCase().includes(q);
        const matchesStaff = txn.assignedStaffName.toLowerCase().includes(q);
        const matchesService = txn.serviceName.toLowerCase().includes(q);
        if (!matchesId && !matchesClient && !matchesRef && !matchesStaff && !matchesService) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && txn.status !== statusFilter) return false;

      // Service
      if (serviceFilter !== 'all' && txn.serviceType !== serviceFilter) return false;

      // Staff
      if (staffFilter !== 'all' && txn.assignedStaffId !== staffFilter) return false;

      // Priority
      if (priorityFilter !== 'all' && txn.priority !== priorityFilter) return false;

      // Overdue
      if (isOverdueOnly && !isOverdue(txn.targetDate, txn.status)) return false;

      return true;
    });
  }, [transactions, searchQuery, statusFilter, serviceFilter, staffFilter, priorityFilter, isOverdueOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setServiceFilter('all');
    setStaffFilter('all');
    setPriorityFilter('all');
    setIsOverdueOnly(false);
  };

  const handleExportList = () => {
    const headers = ['Transaction ID', 'Client Name', 'Phone', 'Service', 'Reference', 'Staff', 'Status', 'Priority', 'Target Date', 'Total Amount'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.clientName,
      t.clientPhone,
      t.serviceName,
      t.referenceNumber,
      t.assignedStaffName,
      t.status,
      t.priority,
      t.targetDate,
      t.pricing.totalAmount
    ]);
    exportCsv('LiaisonServices_Transactions', headers, rows);
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
    <div className="space-y-5">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SSS Service Transactions
            </h1>
            <InfoTooltip
              badgeText="What is this?"
              title="Transactions Directory"
              content="A transaction represents one client request for an SSS-related liaison service or benefit claim."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track and process all active SSS loans, portal registrations, PRN generation, DAEM enrollment, and member benefit claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateTxnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, Member name, SSS No. (e.g. 06-3829104-5), or Staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses ({transactions.length})</option>
              {allStatuses.map(st => (
                <option key={st} value={st}>
                  {st} ({transactions.filter(t => t.status === st).length})
                </option>
              ))}
            </select>
          </div>

          {/* Service Dropdown */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Service Types</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Staff Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Staff:</span>
              <select
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
              >
                <option value="all">All Staff</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name.split(' ')[0]}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
              >
                <option value="all">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Rush">Rush</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Overdue Only Toggle */}
            <label className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer transition-colors ${
              isOverdueOnly ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}>
              <input
                type="checkbox"
                checked={isOverdueOnly}
                onChange={(e) => setIsOverdueOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Overdue Target Date Only</span>
            </label>
          </div>

          {/* Results count & Clear */}
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Showing <strong className="text-slate-900 tabular-nums">{filteredTransactions.length}</strong> of {transactions.length} transactions</span>
            {(searchQuery || statusFilter !== 'all' || serviceFilter !== 'all' || staffFilter !== 'all' || priorityFilter !== 'all' || isOverdueOnly) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service & Reference</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4 text-right">Total Price</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-700 text-sm">No transactions match your criteria</div>
                      <p className="text-xs text-slate-400">Try adjusting your filters, search keyword, or create a new transaction record.</p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => {
                  const badge = getStatusBadgeStyle(txn.status);
                  const priorityClass = getPriorityBadgeStyle(txn.priority);
                  const isOver = isOverdue(txn.targetDate, txn.status);

                  return (
                    <tr 
                      key={txn.id}
                      onClick={() => setSelectedTransactionId(txn.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{txn.id}</span>
                          {isOver && (
                            <span className="w-2 h-2 rounded-full bg-rose-600" title="Target date overdue" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal font-sans">
                          Created {txn.createdAt}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {txn.clientName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {txn.clientPhone}
                        </div>
                      </td>

                      {/* Service & Ref */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {txn.serviceName}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {txn.referenceNumber}
                        </div>
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {txn.assignedStaffName}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Target Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span className={isOver ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {txn.targetDate}
                        </span>
                        {isOver && (
                          <span className="block text-[10px] text-rose-500 font-sans font-semibold">
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatCurrency(txn.pricing.totalAmount)}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] border ${priorityClass}`}>
                          {txn.priority}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedTransactionId(txn.id)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>In the production system, clicking any transaction allows authorized personnel to sign off documents and print LTO receipts.</span>
          <span className="font-mono text-slate-400">Total Records: {transactions.length}</span>
        </div>
      </div>

      {/* Render Transaction Detail Modal if one is selected */}
      {selectedTransactionId && (
        <TransactionDetailModal
          transactionId={selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
        />
      )}
    </div>
  );
};
