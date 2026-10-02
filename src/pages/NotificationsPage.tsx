import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  UserCheck, 
  FileWarning, 
  Filter, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setSelectedTransactionId,
    setActiveTab
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const filteredNotifs = notifications.filter(n => {
    if (unreadOnly && n.read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'target_date':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'requirement':
        return <FileWarning className="w-4 h-4 text-orange-600" />;
      case 'assignment':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'completion':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'price':
        return <DollarSign className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (n: NotificationItem) => {
    markNotificationRead(n.id);
    if (n.transactionId) {
      setSelectedTransactionId(n.transactionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Operations Notifications & Alerts
            </h1>
            <InfoTooltip
              badgeText="What is this?"
              title="Operational Alerts"
              content="Real-time alerts for impending SLA deadlines, missing customer documents, new liaison assignments, and completed releases."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulated notifications queue with automated alert triggers.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 text-[11px] font-semibold">Filter by Category:</span>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'overdue', label: 'Overdue' },
            { id: 'requirement', label: 'Missing Documents' },
            { id: 'target_date', label: 'Upcoming Target' },
            { id: 'assignment', label: 'Workload & Staff' },
            { id: 'completion', label: 'Completed' },
            { id: 'price', label: 'Pricing Rules' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                typeFilter === f.id 
                  ? 'bg-slate-900 text-white font-semibold' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Unread alerts only</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No notifications found</p>
            <p className="text-xs text-slate-400 mt-0.5">All alerts have been read or cleared.</p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                !n.read ? 'bg-amber-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${!n.read ? 'text-slate-950 font-bold' : 'text-slate-800'}`}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                    )}
                    {n.priority === 'urgent' && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded uppercase">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-0.5">
                    <span>{n.timestamp}</span>
                    {n.transactionId && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-600 font-medium hover:underline inline-flex items-center gap-0.5">
                          View {n.transactionId} <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-center">
                {!n.read ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                  >
                    Mark read
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Read</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <PrototypeNoticeBox 
        note="This prototype displays simulated notifications. Email or WhatsApp delivery would be configured separately in the production system." 
      />
    </div>
  );
};
