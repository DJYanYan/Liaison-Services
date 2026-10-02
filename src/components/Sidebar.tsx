import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calculator, 
  BarChart3, 
  Bell, 
  Settings, 
  AlertTriangle,
  Sparkles,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    transactions, 
    notifications, 
    currentRole,
    openHelpModal
  } = useApp();

  const overdueCount = transactions.filter(t => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    return new Date(t.targetDate) < new Date('2026-09-30');
  }).length;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: overdueCount > 0 ? `${overdueCount} due` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: FileText,
      badge: `${transactions.length}`,
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users
    },
    {
      id: 'calculator',
      label: 'Price Calculator',
      icon: Calculator
    },
    {
      id: 'reports',
      label: 'Reports & Audit',
      icon: BarChart3
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'settings',
      label: 'Settings & Roles',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 hidden md:flex flex-col border-r border-slate-800 justify-between min-h-[calc(100vh-57px)]">
      {/* Top Nav links */}
      <div className="p-4 space-y-6">
        {/* Quick Operational Status */}
        <div className="px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">Current Role</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="mt-1 font-semibold text-white capitalize flex items-center justify-between">
            <span>{currentRole === 'owner' ? 'Owner / Admin' : currentRole === 'manager' ? 'Operations Manager' : 'Processor / Staff'}</span>
          </div>
          <div className="mt-0.5 text-[11px] text-slate-400">
            {currentRole === 'owner' ? 'Full administrative & financial access' : currentRole === 'manager' ? 'Ops supervisor & assignment control' : 'Processing & checklist update access'}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive 
                    ? 'bg-amber-400/15 text-amber-300 font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Hub Info & Suggested Flow Shortcut */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-[11px] mb-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            SSS Cebu Branch Coverage
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Cebu City (Osmeña Blvd), NRA (Galleria), Mandaue, Lapu-Lapu, Talisay, Danao & Toledo Branches.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('dashboard');
            setTimeout(() => {
              const el = document.getElementById('demo-flow-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Self-Guided Tour
        </button>

        <div className="text-[10px] text-slate-500 text-center font-mono">
          Prototype v1.0 • Client Demo
        </div>
      </div>
    </aside>
  );
};

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, transactions, notifications } = useApp();

  const overdueCount = transactions.filter(t => {
    if (t.status === 'Completed' || t.status === 'Cancelled') return false;
    return new Date(t.targetDate) < new Date('2026-09-30');
  }).length;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: overdueCount > 0 ? overdueCount : undefined },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-30 px-1 py-1 flex justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1.5 px-2 rounded text-[10px] relative transition-colors ${
              isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="truncate max-w-[55px]">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
