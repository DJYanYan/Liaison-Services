import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Transaction,
  Client,
  StaffMember,
  ServiceConfig,
  NotificationItem,
  AuditLogEntry,
  TransactionStatus,
  ServiceTypeKey
} from '../types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_CLIENTS,
  INITIAL_STAFF,
  INITIAL_SERVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/sampleData';

interface AppContextType {
  // Data
  transactions: Transaction[];
  clients: Client[];
  staff: StaffMember[];
  services: ServiceConfig[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
  currentRole: UserRole;
  activeTab: string;
  
  // Modals & Navigation
  selectedTransactionId: string | null;
  selectedClientId: string | null;
  isCreateTxnModalOpen: boolean;
  createTxnPreFill: any | null;
  isHelpModalOpen: boolean;
  helpTopic: string | null;

  // Setters
  setActiveTab: (tab: string) => void;
  setCurrentRole: (role: UserRole) => void;
  setSelectedTransactionId: (id: string | null) => void;
  setSelectedClientId: (id: string | null) => void;
  setIsCreateTxnModalOpen: (open: boolean) => void;
  setCreateTxnPreFill: (data: any | null) => void;
  openHelpModal: (topic?: string) => void;
  closeHelpModal: () => void;

  // Business Actions
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'activityTimeline'>) => Transaction;
  updateTransactionStatus: (id: string, newStatus: TransactionStatus, noteText?: string) => void;
  updateTransactionStaff: (id: string, staffId: string) => void;
  updateTransactionNotes: (id: string, notes: string) => void;
  toggleChecklistItem: (txnId: string, itemId: string, verified: boolean) => void;
  updateTransactionPricing: (id: string, newPricing: Transaction['pricing']) => void;
  deleteTransaction: (id: string) => void;
  
  createClient: (clientData: Omit<Client, 'id' | 'totalTransactions' | 'activeTransactions' | 'createdAt'>) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  updateServicePricing: (serviceId: ServiceTypeKey, baseGovFee: number, baseServiceFee: number) => void;
  resetToDefaultData: () => void;
  exportCsv: (filename: string, headers: string[], rows: (string | number)[][]) => void;

  // Role permissions helpers
  canEditPricing: boolean;
  canManageStaff: boolean;
  canViewFinancialMargins: boolean;
  canDeleteTransactions: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'liaisonservices_sss_transactions_v4',
  CLIENTS: 'liaisonservices_sss_clients_v4',
  STAFF: 'liaisonservices_sss_staff_v4',
  SERVICES: 'liaisonservices_sss_services_v4',
  NOTIFICATIONS: 'liaisonservices_sss_notifications_v4',
  AUDIT_LOGS: 'liaisonservices_sss_audit_logs_v4',
  ROLE: 'liaisonservices_sss_user_role_v4',
  TAB: 'liaisonservices_sss_active_tab_v4'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or fall back to sample data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [services, setServices] = useState<ServiceConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'owner';
    } catch {
      return 'owner';
    }
  });

  // Client-side hash routing or state tab
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'transactions', 'clients', 'calculator', 'reports', 'notifications', 'settings'].includes(hash)) {
      return hash;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateTxnModalOpen, setIsCreateTxnModalOpen] = useState<boolean>(false);
  const [createTxnPreFill, setCreateTxnPreFill] = useState<any | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [helpTopic, setHelpTopic] = useState<string | null>(null);

  // Sync activeTab with URL hash for easy sharing and back button support
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    // Scroll to top of window when changing tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  };

  // Listen to hash changes (e.g. browser back button)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'transactions', 'clients', 'calculator', 'reports', 'notifications', 'settings'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [auditLogs]);

  // Role permissions matrix
  const canEditPricing = currentRole === 'owner';
  const canManageStaff = currentRole === 'owner' || currentRole === 'manager';
  const canViewFinancialMargins = currentRole === 'owner' || currentRole === 'manager';
  const canDeleteTransactions = currentRole === 'owner';

  const getUserDisplayName = () => {
    switch (currentRole) {
      case 'owner':
        return { name: 'Atty. Rafael Mendoza', role: 'Owner / Admin' };
      case 'manager':
        return { name: 'Gina Bautista', role: 'Operations Supervisor' };
      case 'processor':
        return { name: 'Eduardo "Ed" Ramos', role: 'Field Liaison Officer' };
    }
  };

  const getFormattedNow = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const openHelpModal = (topic?: string) => {
    setHelpTopic(topic || null);
    setIsHelpModalOpen(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalOpen(false);
    setHelpTopic(null);
  };

  // Actions
  const createTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'activityTimeline'>) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();
    const dateStr = now.split(' ')[0];
    
    // Generate readable ID e.g. TXN-2026-0940
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `TXN-2026-${randomSuffix}`;

    const newTxn: Transaction = {
      ...data,
      id,
      createdAt: dateStr,
      activityTimeline: [
        {
          id: `act_${Date.now()}`,
          timestamp: now,
          userName: user.name,
          userRole: user.role,
          action: 'Created Transaction',
          details: `Transaction initiated for ${data.clientName} (${data.serviceName}). Priority: ${data.priority}.`
        }
      ]
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Update client transaction count
    setClients(prev => prev.map(c => {
      if (c.id === data.clientId) {
        return {
          ...c,
          totalTransactions: c.totalTransactions + 1,
          activeTransactions: c.activeTransactions + 1
        };
      }
      return c;
    }));

    // Add Audit Log
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: now,
      userName: user.name,
      userRole: user.role,
      action: 'Created Transaction',
      transactionId: id,
      transactionRef: data.referenceNumber,
      details: `New transaction created for ${data.clientName} - ${data.serviceName} (${data.referenceNumber}).`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Add Notification if rush or high priority
    if (data.priority === 'Rush' || data.priority === 'Urgent') {
      const newNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        type: 'assignment',
        title: `${data.priority} Transaction Created: ${id}`,
        message: `${data.serviceName} for ${data.clientName} assigned to ${data.assignedStaffName}. Target: ${data.targetDate}.`,
        timestamp: now,
        read: false,
        transactionId: id,
        priority: data.priority === 'Urgent' ? 'urgent' : 'high'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return newTxn;
  };

  const updateTransactionStatus = (id: string, newStatus: TransactionStatus, noteText?: string) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();
    const dateStr = now.split(' ')[0];

    setTransactions(prev => prev.map(txn => {
      if (txn.id !== id) return txn;

      const isBecomingCompleted = newStatus === 'Completed' && txn.status !== 'Completed';
      const wasCompleted = txn.status === 'Completed' && newStatus !== 'Completed';

      const timelineItem = {
        id: `act_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: `Status Change: ${newStatus}`,
        details: noteText || `Status transitioned from "${txn.status}" to "${newStatus}".`
      };

      return {
        ...txn,
        status: newStatus,
        completedDate: isBecomingCompleted ? dateStr : wasCompleted ? undefined : txn.completedDate,
        activityTimeline: [timelineItem, ...txn.activityTimeline]
      };
    }));

    // Audit Log
    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: `Status Change: ${newStatus}`,
        transactionId: id,
        details: noteText || `Changed transaction status to ${newStatus}.`
      },
      ...prev
    ]);

    // If completed, add notification
    if (newStatus === 'Completed') {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          type: 'completion',
          title: `Transaction Completed: ${id}`,
          message: `Official documents cleared for transaction ${id}. Ready for client turnover.`,
          timestamp: now,
          read: false,
          transactionId: id,
          priority: 'normal'
        },
        ...prev
      ]);
    }
  };

  const updateTransactionStaff = (id: string, staffId: string) => {
    const assignedStaff = staff.find(s => s.id === staffId);
    if (!assignedStaff) return;
    const user = getUserDisplayName();
    const now = getFormattedNow();

    setTransactions(prev => prev.map(txn => {
      if (txn.id !== id) return txn;
      return {
        ...txn,
        assignedStaffId: assignedStaff.id,
        assignedStaffName: assignedStaff.name,
        activityTimeline: [
          {
            id: `act_${Date.now()}`,
            timestamp: now,
            userName: user.name,
            userRole: user.role,
            action: 'Reassigned Staff Member',
            details: `Assigned responsibility to ${assignedStaff.name} (${assignedStaff.roleTitle}).`
          },
          ...txn.activityTimeline
        ]
      };
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: 'Reassigned Staff',
        transactionId: id,
        details: `Assigned transaction to ${assignedStaff.name}.`
      },
      ...prev
    ]);
  };

  const updateTransactionNotes = (id: string, notes: string) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();

    setTransactions(prev => prev.map(txn => {
      if (txn.id !== id) return txn;
      return {
        ...txn,
        internalNotes: notes,
        activityTimeline: [
          {
            id: `act_${Date.now()}`,
            timestamp: now,
            userName: user.name,
            userRole: user.role,
            action: 'Updated Internal Notes',
            details: 'Internal operations notes modified.'
          },
          ...txn.activityTimeline
        ]
      };
    }));
  };

  const toggleChecklistItem = (txnId: string, itemId: string, verified: boolean) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();
    const dateStr = now.split(' ')[0];

    setTransactions(prev => prev.map(txn => {
      if (txn.id !== txnId) return txn;

      let changedItemName = '';
      const updatedChecklist = txn.checklist.map(item => {
        if (item.id === itemId) {
          changedItemName = item.name;
          return {
            ...item,
            submitted: verified,
            verified: verified,
            verifiedAt: verified ? dateStr : undefined
          };
        }
        return item;
      });

      return {
        ...txn,
        checklist: updatedChecklist,
        activityTimeline: [
          {
            id: `act_${Date.now()}`,
            timestamp: now,
            userName: user.name,
            userRole: user.role,
            action: verified ? 'Document Verified' : 'Document Marked Pending',
            details: `Requirement "${changedItemName}" ${verified ? 'verified and validated' : 'reset to unverified'}.`
          },
          ...txn.activityTimeline
        ]
      };
    }));
  };

  const updateTransactionPricing = (id: string, newPricing: Transaction['pricing']) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();

    setTransactions(prev => prev.map(txn => {
      if (txn.id !== id) return txn;
      return {
        ...txn,
        pricing: newPricing,
        activityTimeline: [
          {
            id: `act_${Date.now()}`,
            timestamp: now,
            userName: user.name,
            userRole: user.role,
            action: 'Updated Pricing Breakdown',
            details: `Total adjusted to ₱${newPricing.totalAmount.toLocaleString()} (Service: ₱${newPricing.serviceFee.toLocaleString()}, Gov: ₱${newPricing.governmentFee.toLocaleString()}).`
          },
          ...txn.activityTimeline
        ]
      };
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: 'Price Adjusted',
        transactionId: id,
        details: `Adjusted transaction price to ₱${newPricing.totalAmount.toLocaleString()}.`
      },
      ...prev
    ]);
  };

  const deleteTransaction = (id: string) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();
    const target = transactions.find(t => t.id === id);

    setTransactions(prev => prev.filter(t => t.id !== id));
    if (selectedTransactionId === id) setSelectedTransactionId(null);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: 'Deleted Transaction',
        transactionId: id,
        transactionRef: target?.referenceNumber,
        details: `Transaction ${id} (${target?.clientName}) was deleted from demo records.`
      },
      ...prev
    ]);
  };

  const createClient = (clientData: Omit<Client, 'id' | 'totalTransactions' | 'activeTransactions' | 'createdAt'>) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();
    const dateStr = now.split(' ')[0];
    const id = `client_${Date.now()}`;

    const newClient: Client = {
      ...clientData,
      id,
      totalTransactions: 0,
      activeTransactions: 0,
      createdAt: dateStr
    };

    setClients(prev => [newClient, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: 'Created Client',
        details: `New client profile added: ${newClient.fullName} (${newClient.city}).`
      },
      ...prev
    ]);

    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateServicePricing = (serviceId: ServiceTypeKey, baseGovFee: number, baseServiceFee: number) => {
    const user = getUserDisplayName();
    const now = getFormattedNow();

    setServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          baseGovernmentFee: baseGovFee,
          baseServiceFee: baseServiceFee
        };
      }
      return s;
    }));

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        userName: user.name,
        userRole: user.role,
        action: 'Updated Service Pricing Benchmark',
        details: `Updated ${serviceId} default fees to Gov: ₱${baseGovFee.toLocaleString()}, Service: ₱${baseServiceFee.toLocaleString()}.`
      },
      ...prev
    ]);
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);

    setTransactions(INITIAL_TRANSACTIONS);
    setClients(INITIAL_CLIENTS);
    setStaff(INITIAL_STAFF);
    setServices(INITIAL_SERVICES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedTransactionId(null);
    setSelectedClientId(null);
  };

  // Helper to generate & download real CSV in browser
  const exportCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (val: string | number) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCell).join(','),
      ...rows.map(row => row.map(escapeCell).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        clients,
        staff,
        services,
        notifications,
        auditLogs,
        currentRole,
        activeTab,
        selectedTransactionId,
        selectedClientId,
        isCreateTxnModalOpen,
        createTxnPreFill,
        isHelpModalOpen,
        helpTopic,
        setActiveTab,
        setCurrentRole,
        setSelectedTransactionId,
        setSelectedClientId,
        setIsCreateTxnModalOpen,
        setCreateTxnPreFill,
        openHelpModal,
        closeHelpModal,
        createTransaction,
        updateTransactionStatus,
        updateTransactionStaff,
        updateTransactionNotes,
        toggleChecklistItem,
        updateTransactionPricing,
        deleteTransaction,
        createClient,
        updateClient,
        markNotificationRead,
        markAllNotificationsRead,
        updateServicePricing,
        resetToDefaultData,
        exportCsv,
        canEditPricing,
        canManageStaff,
        canViewFinancialMargins,
        canDeleteTransactions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
