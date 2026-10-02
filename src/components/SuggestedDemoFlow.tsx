import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Clock, 
  ListChecks, 
  Calculator, 
  PlusCircle, 
  BarChart2, 
  Shield 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SuggestedDemoFlow: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedTransactionId, 
    setIsCreateTxnModalOpen,
    setCurrentRole
  } = useApp();

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Explore the Transactions table',
      description: 'Review the high-density table with SSS status badges, priorities, and assigned staff filters.',
      actionText: 'View Transactions',
      icon: FileText,
      handler: () => {
        setActiveTab('transactions');
        if (!completedSteps.includes(1)) toggleStep(1);
      }
    },
    {
      num: 2,
      title: 'Open an overdue case',
      description: 'Inspect transaction TXN-2026-0914 (Pension Loan for Roberto Gonzales in Minglanilla) flagged red for exceeding its target date.',
      actionText: 'Inspect Overdue Case',
      icon: Clock,
      handler: () => {
        setActiveTab('transactions');
        setSelectedTransactionId('TXN-2026-0914');
        if (!completedSteps.includes(2)) toggleStep(2);
      }
    },
    {
      num: 3,
      title: 'Check requirements & activity timeline',
      description: 'Toggle document verification checkmarks and add an internal operations note to see the live audit trail.',
      actionText: 'Test Checklist & Notes',
      icon: ListChecks,
      handler: () => {
        setActiveTab('transactions');
        setSelectedTransactionId('TXN-2026-0914');
        if (!completedSteps.includes(3)) toggleStep(3);
      }
    },
    {
      num: 4,
      title: 'Test the Price Calculator',
      description: 'Explore the standardized SSS service catalog pricing (from ₱30 PRN, ₱50 Email Reset, to ₱300 Claims & ID).',
      actionText: 'Open Calculator',
      icon: Calculator,
      handler: () => {
        setActiveTab('calculator');
        if (!completedSteps.includes(4)) toggleStep(4);
      }
    },
    {
      num: 5,
      title: 'Create a sample transaction',
      description: 'Fill out an order intake form with automatic pricing calculation, document checklists, and staff assignment.',
      actionText: 'Create Sample Order',
      icon: PlusCircle,
      handler: () => {
        setIsCreateTxnModalOpen(true);
        if (!completedSteps.includes(5)) toggleStep(5);
      }
    },
    {
      num: 6,
      title: 'Review Operations & Finance Reports',
      description: 'Explore daily End-of-Day Operations, Finance reports, Staff Workload, and export live data to CSV.',
      actionText: 'View Reports & Exports',
      icon: BarChart2,
      handler: () => {
        setActiveTab('reports');
        if (!completedSteps.includes(6)) toggleStep(6);
      }
    },
    {
      num: 7,
      title: 'Switch user roles in Settings',
      description: 'Switch between Owner/Admin, Operations Manager, and Processor/Staff to see how permissions adjust.',
      actionText: 'Try Role Switcher',
      icon: Shield,
      handler: () => {
        setActiveTab('settings');
        if (!completedSteps.includes(7)) toggleStep(7);
      }
    }
  ];

  return (
    <div id="demo-flow-anchor" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-400/20 text-amber-300 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <span>Self-Guided Feature Tour</span>
              <span className="text-[11px] font-normal text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded">
                7-Step Quick Walkthrough
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore the key features, workflow stages, and user roles at your own pace.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-300">
          <span>{completedSteps.length} of 7 steps explored</span>
          <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 bg-slate-50/50">
        {steps.map(step => {
          const isDone = completedSteps.includes(step.num);

          return (
            <div 
              key={step.num}
              className={`p-3.5 rounded-lg border transition-all ${
                isDone 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {step.num}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {step.title}
                  </span>
                </div>
                <button
                  onClick={() => toggleStep(step.num)}
                  className={`text-[11px] p-0.5 rounded transition-colors cursor-pointer ${
                    isDone ? 'text-emerald-700' : 'text-slate-300 hover:text-slate-500'
                  }`}
                  title={isDone ? 'Mark as unexplored' : 'Mark as explored'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-600 leading-normal min-h-[34px] mb-3">
                {step.description}
              </p>

              <button
                onClick={step.handler}
                className={`w-full py-1.5 px-2.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{step.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
