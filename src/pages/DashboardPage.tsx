import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Plus, 
  BarChart3, 
  Bell, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuggestedDemoFlow } from '../components/SuggestedDemoFlow';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';
import { formatCurrency, getStatusBadgeStyle, isOverdue } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { 
    transactions, 
    staff, 
    auditLogs, 
    setActiveTab, 
    setSelectedTransactionId,
    setIsCreateTxnModalOpen,
    openHelpModal,
    canViewFinancialMargins
  } = useApp();

  // Calculations
  const activeTransactions = transactions.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled');
  const completedToday = transactions.filter(t => t.status === 'Completed' && (t.completedDate === '2026-09-30' || t.completedDate === '2026-09-29'));
  const pendingRequirements = transactions.filter(t => t.status === 'Requirements Pending' || t.status === 'Waiting on Client');
  
  const overdueTransactions = transactions.filter(t => isOverdue(t.targetDate, t.status));
  
  const totalServiceFeeRevenue = transactions
    .filter(t => t.status !== 'Cancelled')
    .reduce((sum, t) => sum + t.pricing.serviceFee, 0);

  const completedRevenue = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.pricing.serviceFee, 0);

  // Group by service type
  const serviceCounts: Record<string, number> = {};
  transactions.forEach(t => {
    serviceCounts[t.serviceName] = (serviceCounts[t.serviceName] || 0) + 1;
  });

  // Distinct list of transactions needing attention today (overdue prioritized, then pending requirements, deduplicated)
  const attentionItems = React.useMemo(() => {
    const map = new Map<string, (typeof transactions)[0]>();
    overdueTransactions.forEach(t => map.set(t.id, t));
    pendingRequirements.forEach(t => {
      if (!map.has(t.id)) {
        map.set(t.id, t);
      }
    });
    return Array.from(map.values());
  }, [overdueTransactions, pendingRequirements]);

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Operations & Liaison Dashboard
            </h1>
            <button
              onClick={() => openHelpModal('dashboard')}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              title="What is this page?"
            >
              <InfoTooltip 
                badgeText="What is this?" 
                title="Operations Dashboard Overview"
                content="This dashboard gives owners and managers a quick view of transactions requiring urgent attention today, real-time staff queues, and revenue pipeline."
              />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This page helps owners and managers understand the current state of operations without asking staff for individual updates.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateTxnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transaction</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('transactions');
              // Let table filter by overdue
              window.sessionStorage.setItem('liaisonservices_filter_overdue', 'true');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>View Overdue ({overdueCount(overdueTransactions)})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Open Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* Suggested Demo Flow Box */}
      <SuggestedDemoFlow />

      {/* Primary KPI Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Active Transactions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Pipeline</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {activeTransactions.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across {staff.length} liaison officers
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              {completedToday.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Official OR/CR released
            </div>
          </div>
        </div>

        {/* Pending Client Requirements */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending Requirements</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-600 tabular-nums">
              {pendingRequirements.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Awaiting client documents
            </div>
          </div>
        </div>

        {/* Overdue Transactions */}
        <div 
          onClick={() => setActiveTab('transactions')}
          className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 shadow-xs flex flex-col justify-between cursor-pointer hover:bg-rose-50 transition-colors"
        >
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Overdue Target Date</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-rose-700 tabular-nums">
              {overdueTransactions.length}
            </div>
            <div className="text-[11px] text-rose-600/90 mt-0.5 font-medium flex items-center justify-between">
              <span>Requires escalation</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Estimated Service-Fee Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="flex items-center gap-1">
              <span>Service Fee Pipeline</span>
              <InfoTooltip
                title="Service Fee Revenue"
                content="Gross business earnings from SSS liaison service fees."
              />
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 tabular-nums truncate">
              {formatCurrency(totalServiceFeeRevenue)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {formatCurrency(completedRevenue)} realized
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Needs Attention Today (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Needs Attention Today Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Needs Attention Today
                </h3>
                <span className="text-[11px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                  {attentionItems.length} transactions
                </span>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View all in table</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {attentionItems.slice(0, 5).map(txn => {
                const badge = getStatusBadgeStyle(txn.status);
                const isOver = isOverdue(txn.targetDate, txn.status);

                return (
                  <div
                    key={txn.id}
                    onClick={() => {
                      setSelectedTransactionId(txn.id);
                    }}
                    className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {txn.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-800">
                          {txn.clientName}
                        </span>
                        {isOver && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            Overdue
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="text-slate-700 font-medium">{txn.serviceName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {txn.referenceNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Assigned: <strong className="text-slate-700">{txn.assignedStaffName}</strong></span>
                      </div>

                      {txn.internalNotes && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                          "{txn.internalNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
                          <span>{badge.label}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          Target: {txn.targetDate}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transactions by Service Type Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Volume by Service Type</span>
              <span className="text-xs text-slate-400 font-normal">Active & historical portfolio</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(serviceCounts).map(([name, count]) => {
                const percentage = Math.round((count / transactions.length) * 100);
                return (
                  <div key={name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800 truncate pr-2">{name}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-slate-700 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>Share of transactions</span>
                      <span className="tabular-nums">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Staff Workload & Recent Activity Log (1 Col wide) */}
        <div className="space-y-6">
          {/* Staff Workload Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Staff Workload Summary
              </h3>
              <InfoTooltip
                title="Staff Responsibility"
                content="The assigned staff member is responsible for the next action on this transaction."
              />
            </div>

            <div className="space-y-3.5">
              {staff.map(member => {
                const memberTxns = transactions.filter(
                  t => t.assignedStaffId === member.id && t.status !== 'Completed' && t.status !== 'Cancelled'
                );
                const memberOverdue = memberTxns.filter(t => isOverdue(t.targetDate, t.status)).length;

                return (
                  <div key={member.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-semibold text-[10px] flex items-center justify-center">
                          {member.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{member.name}</div>
                          <div className="text-[10px] text-slate-400">{member.assignedBranch.split('/')[0]}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 tabular-nums">
                          {memberTxns.length} active
                        </span>
                        {memberOverdue > 0 && (
                          <div className="text-[10px] text-rose-600 font-semibold tabular-nums">
                            {memberOverdue} overdue
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${memberOverdue > 0 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, (memberTxns.length / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900">
                Recent Activity & Audit
              </h3>
              <button 
                onClick={() => setActiveTab('reports')}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                All logs
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="text-xs pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="font-semibold text-slate-700">{log.userName}</span>
                    <span className="font-mono text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="font-medium text-slate-800 mt-0.5">{log.action}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{log.details}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              In production, every change is signed and saved to an immutable audit trail.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function overdueCount(overdueList: any[]): number {
  return overdueList.length;
}
