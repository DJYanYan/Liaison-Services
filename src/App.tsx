import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Sidebar, MobileNav } from './components/Sidebar';
import { HelpModal } from './components/HelpModal';
import { CreateTransactionModal } from './pages/CreateTransactionModal';

import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ClientsPage } from './pages/ClientsPage';
import { PriceCalculatorPage } from './pages/PriceCalculatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isCreateTxnModalOpen, 
    setIsCreateTxnModalOpen, 
    createTxnPreFill, 
    setCreateTxnPreFill,
    openHelpModal
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'calculator':
        return <PriceCalculatorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Global Demo Mode Warning Banner */}
      <DemoBanner />

      {/* 2. Top Bar Navigation Contract */}
      <Header />

      {/* 3. Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </div>

          {/* Clean Footer note as required */}
          <footer className="mt-auto px-6 py-4 border-t border-slate-200 bg-white/70 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-slate-500">
                Interactive concept prototype. Sample data only. Not connected to LTO systems.
              </span>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <button
                  onClick={() => openHelpModal('prototype_limits')}
                  className="hover:text-slate-700 underline cursor-pointer"
                >
                  Prototype Boundaries
                </button>
                <span>·</span>
                <span>Liaison Services — Cebu v1.0</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals */}
      <HelpModal />

      <CreateTransactionModal
        isOpen={isCreateTxnModalOpen}
        onClose={() => {
          setIsCreateTxnModalOpen(false);
          setCreateTxnPreFill(null);
        }}
        preFillData={createTxnPreFill}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
