import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  HelpCircle, 
  User, 
  ChevronDown, 
  Shield, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    notifications, 
    setIsCreateTxnModalOpen, 
    openHelpModal, 
    setActiveTab,
    activeTab,
    setSelectedTransactionId
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { title: string; subtitle: string; color: string }> = {
    owner: { title: 'Atty. Rafael Mendoza', subtitle: 'Owner / Admin', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    manager: { title: 'Gina Bautista', subtitle: 'Operations Manager', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    processor: { title: 'Eduardo "Ed" Ramos', subtitle: 'Processor / Staff', color: 'bg-slate-100 text-slate-800 border-slate-300' }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single clean text wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs">
              LS
            </span>
            <div>
              <a 
                href="#dashboard" 
                onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} 
                className="text-base font-bold tracking-tight text-slate-900 hover:text-slate-700"
              >
                Liaison Services
              </a>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 ml-2 font-mono">
                Cebu SSS Operations
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Breadcrumbs or Active View Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <span>Portal</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-[11px] text-slate-400">Cebu SSS Regional & Branch Liaison</span>
        </div>

        {/* Zone 3: Primary Actions (Role Switcher, Notifications, Quick Create) */}
        <div className="flex items-center gap-2.5">
          {/* Global Help Trigger */}
          <button
            onClick={() => openHelpModal()}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Prototype Notes & Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsNotifDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Notifications ({unreadCount} unread)</span>
                  <button 
                    onClick={() => { setActiveTab('notifications'); setIsNotifDropdownOpen(false); }}
                    className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    View all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 4).map(n => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        if (n.transactionId) {
                          setSelectedTransactionId(n.transactionId);
                        } else {
                          setActiveTab('notifications');
                        }
                        setIsNotifDropdownOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-amber-50/40' : ''}`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span className="truncate pr-2">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>}
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors cursor-pointer text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-[10px]">
                {currentRole === 'owner' ? 'RM' : currentRole === 'manager' ? 'GB' : 'ER'}
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-slate-900 leading-tight">
                  {roleLabels[currentRole].title.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500">
                  {roleLabels[currentRole].subtitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isRoleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsRoleDropdownOpen(false)}
              >
                <div className="px-3.5 py-1.5 border-b border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Demo Role</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Test UI permissions across team roles:</div>
                </div>

                <div className="py-1">
                  {(['owner', 'manager', 'processor'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${currentRole === role ? 'bg-slate-50 font-semibold text-slate-900' : 'text-slate-700'}`}
                    >
                      <div>
                        <div className="text-xs">{roleLabels[role].subtitle}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{roleLabels[role].title}</div>
                      </div>
                      {currentRole === role && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>

                <div className="px-3.5 pt-2 pb-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    View role permissions matrix
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Create Transaction CTA */}
          <button
            onClick={() => setIsCreateTxnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Transaction</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
