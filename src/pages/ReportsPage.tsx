import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, isOverdue } from '../utils/formatters';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';

export const ReportsPage: React.FC = () => {
  const { 
    transactions, 
    staff, 
    services, 
    auditLogs, 
    exportCsv,
    canViewFinancialMargins
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'ops' | 'finance' | 'workload' | 'audit'>('ops');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter transactions based on date selection
  const filteredTxns = transactions.filter(t => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return t.createdAt >= '2026-09-30' || t.completedDate === '2026-09-30';
    if (dateFilter === 'week') return t.createdAt >= '2026-09-23';
    if (dateFilter === 'month') return t.createdAt >= '2026-09-01';
    return true;
  });

  // 1. Operations Metrics
  const newCount = filteredTxns.filter(t => t.status === 'New').length;
  const completedCount = filteredTxns.filter(t => t.status === 'Completed').length;
  const pendingCount = filteredTxns.filter(t => t.status === 'Requirements Pending' || t.status === 'Waiting on Client' || t.status === 'Waiting on LTO').length;
  const overdueCount = filteredTxns.filter(t => isOverdue(t.targetDate, t.status)).length;

  // By service
  const serviceBreakdown = services.map(s => {
    const list = filteredTxns.filter(t => t.serviceType === s.id);
    return {
      name: s.name,
      count: list.length,
      completed: list.filter(t => t.status === 'Completed').length,
      revenue: list.reduce((sum, t) => sum + t.pricing.serviceFee, 0)
    };
  });

  // 2. Finance Metrics
  const totalQuotedAmount = filteredTxns.reduce((sum, t) => sum + t.pricing.totalAmount, 0);
  const totalServiceFees = filteredTxns.reduce((sum, t) => sum + t.pricing.serviceFee, 0);
  const totalGovFees = filteredTxns.reduce((sum, t) => sum + t.pricing.governmentFee, 0);
  const totalDiscounts = filteredTxns.reduce((sum, t) => sum + t.pricing.discount, 0);
  const completedTxnValue = filteredTxns
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.pricing.totalAmount, 0);

  // 3. Staff Workload Breakdown
  const staffWorkload = staff.map(member => {
    const memberTxns = filteredTxns.filter(t => t.assignedStaffId === member.id);
    return {
      ...member,
      assigned: memberTxns.length,
      completed: memberTxns.filter(t => t.status === 'Completed').length,
      pending: memberTxns.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled').length,
      overdue: memberTxns.filter(t => isOverdue(t.targetDate, t.status)).length
    };
  });

  // CSV Exporters
  const handleExportOps = () => {
    const headers = ['Metric', 'Count', 'Notes'];
    const rows = [
      ['New Transactions', newCount, 'Intake today'],
      ['Completed Transactions', completedCount, 'Official SSS documents & claims released'],
      ['Pending / In Progress', pendingCount, 'Waiting on client/SSS/processing'],
      ['Overdue Transactions', overdueCount, 'Past target completion SLA date']
    ];
    exportCsv('LiaisonServices_Cebu_Operations_Report', headers, rows);
  };

  const handleExportFinance = () => {
    const headers = ['Financial Stream', 'Amount (PHP)', 'Classification'];
    const rows = [
      ['Total Quoted Transaction Volume', totalQuotedAmount, 'Gross Client Volume'],
      ['Liaison Service Fees (Gross Revenue)', totalServiceFees, 'Operational Earnings'],
      ['Pass-through Government Fees', totalGovFees, 'Disbursements to LTO & PMVIC'],
      ['Promotional Discounts & Rebates', totalDiscounts, 'Contra Revenue'],
      ['Realized Completed Cash Volume', completedTxnValue, 'Finalized Collections']
    ];
    exportCsv('LiaisonServices_Cebu_Finance_Report', headers, rows);
  };

  const handleExportWorkload = () => {
    const headers = ['Staff Name', 'Role Title', 'Branch Office', 'Assigned Transactions', 'Completed', 'Active Pending', 'Overdue'];
    const rows = staffWorkload.map(s => [
      s.name,
      s.roleTitle,
      s.assignedBranch,
      s.assigned,
      s.completed,
      s.pending,
      s.overdue
    ]);
    exportCsv('LiaisonServices_Cebu_Staff_Workload_Report', headers, rows);
  };

  const handleExportAudit = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Action', 'Transaction Reference', 'Details'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      l.userName,
      l.userRole,
      l.action,
      l.transactionRef || l.transactionId || 'System',
      l.details
    ]);
    exportCsv('LiaisonServices_Cebu_Audit_Activity_Report', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Operations & Finance Reports
            </h1>
            <InfoTooltip
              badgeText="What is this?"
              title="Operational & Financial Intelligence"
              content="Generates daily business summaries, staff utilization metrics, pass-through government reconciliation, and CSV exports."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-of-day operational reconciliation and staff capacity audit.
          </p>
        </div>

        {/* Date Filter Segmented Bar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === 'today' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === 'week' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === 'month' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                dateFilter === 'all' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveReportTab('ops')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeReportTab === 'ops' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          1. End-of-Day Operations Report
        </button>

        <button
          onClick={() => setActiveReportTab('finance')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeReportTab === 'finance' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          2. End-of-Day Finance Report
        </button>

        <button
          onClick={() => setActiveReportTab('workload')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeReportTab === 'workload' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Staff Workload Report
        </button>

        <button
          onClick={() => setActiveReportTab('audit')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeReportTab === 'audit' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          4. Audit Activity Log Report
        </button>
      </div>

      {/* REPORT CONTENT PANELS */}

      {/* REPORT 1: END OF DAY OPERATIONS */}
      {activeReportTab === 'ops' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                End-of-Day Operations Summary
              </h2>
              <p className="text-xs text-slate-500">
                Active pipeline flow, completed transactions, and SLA adherence across LTO branches.
              </p>
            </div>
            <button
              onClick={handleExportOps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Operations CSV</span>
            </button>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">New Transactions</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">{newCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Intake in period</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Completed Today</div>
              <div className="text-2xl font-bold text-emerald-600 tabular-nums mt-1">{completedCount}</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">OR/CR released</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Pending Processing</div>
              <div className="text-2xl font-bold text-amber-600 tabular-nums mt-1">{pendingCount}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">In liaison queue</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Overdue Target SLA</div>
              <div className="text-2xl font-bold text-rose-600 tabular-nums mt-1">{overdueCount}</div>
              <div className="text-[11px] text-rose-500 mt-0.5">Requires manager action</div>
            </div>
          </div>

          {/* Service Volume Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                Transactions by Service Type
              </h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="py-2.5 px-4">Service Name</th>
                  <th className="py-2.5 px-4 text-center">Total Volume</th>
                  <th className="py-2.5 px-4 text-center">Completed</th>
                  <th className="py-2.5 px-4 text-right">Liaison Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceBreakdown.map(s => (
                  <tr key={s.name} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">{s.count}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-700 font-semibold">{s.completed}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: END OF DAY FINANCE */}
      {activeReportTab === 'finance' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                End-of-Day Financial Ledger Report
              </h2>
              <p className="text-xs text-slate-500">
                Reconciliation of collected client volume against government statutory disbursements.
              </p>
            </div>
            <button
              onClick={handleExportFinance}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Finance CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Quoted Amount</span>
              <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {formatCurrency(totalQuotedAmount)}
              </div>
              <p className="text-[11px] text-slate-400">Total billing value across all orders</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-blue-700">Gross Service Fees (Revenue)</span>
              <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums">
                {formatCurrency(totalServiceFees)}
              </div>
              <p className="text-[11px] text-slate-400">Net retained liaison business revenue</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500">Pass-Through Government Fees</span>
              <div className="text-2xl font-bold font-mono text-slate-700 tabular-nums">
                {formatCurrency(totalGovFees)}
              </div>
              <p className="text-[11px] text-slate-400">Disbursed directly to LTO cashier / PMVIC</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Finance Reconciliation Breakdown
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600 font-sans font-medium">Gross Customer Invoiced Value</span>
                <span className="font-bold text-slate-900">{formatCurrency(totalQuotedAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                <span className="font-sans">Less: LTO Government & PMVIC Disbursements</span>
                <span>-{formatCurrency(totalGovFees)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600">
                <span className="font-sans">Less: Discounts & Special Client Rebates</span>
                <span>-{formatCurrency(totalDiscounts)}</span>
              </div>
              <div className="flex justify-between py-3 bg-slate-900 text-white p-3 rounded-lg font-bold text-sm">
                <span className="font-sans">Net Realized Completed Collections</span>
                <span className="text-amber-400">{formatCurrency(completedTxnValue)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: STAFF WORKLOAD */}
      {activeReportTab === 'workload' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Staff Workload & Capacity Report
              </h2>
              <p className="text-xs text-slate-500">
                Liaison officer distribution, district coverage, and individual bottleneck analysis.
              </p>
            </div>
            <button
              onClick={handleExportWorkload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Workload CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned LTO Branch</th>
                  <th className="py-3 px-4 text-center">Assigned Total</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-center">Active Queue</th>
                  <th className="py-3 px-4 text-center">Overdue</th>
                  <th className="py-3 px-4 text-right">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffWorkload.map(s => {
                  const rate = s.assigned > 0 ? Math.round((s.completed / s.assigned) * 100) : 0;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.roleTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {s.assignedBranch}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{s.assigned}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">{s.completed}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">{s.pending}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600">
                        {s.overdue > 0 ? s.overdue : '0'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: AUDIT ACTIVITY LOG */}
      {activeReportTab === 'audit' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                System Audit & Activity Trail Report
              </h2>
              <p className="text-xs text-slate-500">
                Comprehensive activity log recording timestamps, operators, and action summaries.
              </p>
            </div>
            <button
              onClick={handleExportAudit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Transaction Reference</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {log.userRole}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-blue-700 text-[11px] whitespace-nowrap">
                      {log.transactionRef || log.transactionId || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 text-[11px]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PrototypeNoticeBox 
        note="In the production system, these reports would be generated from live transaction data and protected according to user permissions." 
      />
    </div>
  );
};
