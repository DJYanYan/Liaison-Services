import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  DollarSign, 
  ListFilter, 
  Bell, 
  HelpCircle, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Info, 
  Lock, 
  Edit3,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, ServiceTypeKey } from '../types';
import { formatCurrency } from '../utils/formatters';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';

export const SettingsPage: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    services, 
    staff, 
    updateServicePricing, 
    resetToDefaultData,
    canEditPricing,
    canManageStaff,
    canViewFinancialMargins,
    canDeleteTransactions
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'roles' | 'pricing' | 'staff' | 'about'>('roles');
  
  // Pricing editor state
  const [editingServiceId, setEditingServiceId] = useState<ServiceTypeKey | null>(null);
  const [editGovFee, setEditGovFee] = useState<number>(0);
  const [editServiceFee, setEditServiceFee] = useState<number>(0);
  const [priceSaveNotice, setPriceSaveNotice] = useState(false);

  // Reset confirmation dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const startEditService = (serviceId: ServiceTypeKey) => {
    const s = services.find(item => item.id === serviceId);
    if (!s) return;
    setEditingServiceId(serviceId);
    setEditGovFee(s.baseGovernmentFee);
    setEditServiceFee(s.baseServiceFee);
  };

  const saveServicePricing = () => {
    if (!editingServiceId) return;
    updateServicePricing(editingServiceId, Number(editGovFee), Number(editServiceFee));
    setEditingServiceId(null);
    setPriceSaveNotice(true);
    setTimeout(() => setPriceSaveNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              System Settings & Demo Role Configuration
            </h1>
            <InfoTooltip
              badgeText="What is this?"
              title="System Settings"
              content="Configure the active demonstration role, manage standardized service fees, review staff rosters, and test system permissions."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate role-based access control and calibrate baseline service pricing rules.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Prominent Demo Role Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <strong className="font-bold text-amber-900 block text-sm">
            Demonstration Role Selector
          </strong>
          <p className="mt-0.5 leading-relaxed text-amber-900/90">
            This role selector is for demonstration only. A production system would use secure authentication and server-side authorization. Switching roles immediately demonstrates how UI capabilities adapt between Owners, Managers, and Field Liaison staff.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSettingsTab('roles')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSettingsTab === 'roles' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Demo Role & Permissions
        </button>

        <button
          onClick={() => setActiveSettingsTab('pricing')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSettingsTab === 'pricing' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Services & Standard Pricing
        </button>

        <button
          onClick={() => setActiveSettingsTab('staff')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSettingsTab === 'staff' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Staff & LTO Liaison Directory
        </button>

        <button
          onClick={() => setActiveSettingsTab('about')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSettingsTab === 'about' 
              ? 'border-slate-900 text-slate-900' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          About This Prototype
        </button>
      </div>

      {/* TAB 1: ROLES & PERMISSIONS */}
      {activeSettingsTab === 'roles' && (
        <div className="space-y-6">
          {/* Active Role Selector Cards */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              Select Active User Role:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'owner',
                  title: 'Owner / Admin',
                  name: 'Atty. Rafael Mendoza',
                  desc: 'Executive ownership role. Has complete access to sensitive financial profit margins, pricing rule modifications, and deletion rights.',
                  badge: 'Full Access'
                },
                {
                  id: 'manager',
                  title: 'Operations Manager',
                  name: 'Gina Bautista',
                  desc: 'Day-to-day operations leader. Can reassign staff workloads, monitor queues, generate reports, and verify document requirements.',
                  badge: 'Operational Lead'
                },
                {
                  id: 'processor',
                  title: 'Processor / Staff',
                  name: 'Eduardo "Ed" Ramos',
                  desc: 'Field liaison processor. Updates transaction status, checks document lists, and adds field queue notes. Cannot alter global pricing rules.',
                  badge: 'Field Operations'
                }
              ].map(role => {
                const isSelected = currentRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setCurrentRole(role.id as UserRole)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {role.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>

                      <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {role.title}
                      </h4>
                      <div className={`text-xs font-medium mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-600'}`}>
                        {role.name}
                      </div>

                      <p className={`text-xs mt-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {role.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] font-semibold">
                      {isSelected ? '✓ Current Active Session Role' : 'Click to activate this role →'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Permissions Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                Role Permission Enforcement Matrix
              </h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <th className="py-2.5 px-4">Feature / Action</th>
                  <th className="py-2.5 px-4 text-center">Owner / Admin</th>
                  <th className="py-2.5 px-4 text-center">Operations Manager</th>
                  <th className="py-2.5 px-4 text-center">Processor / Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'View Dashboard & Pipeline Status', owner: true, manager: true, staff: true },
                  { feature: 'Update Transaction Status & Notes', owner: true, manager: true, staff: true },
                  { feature: 'Verify Document Checklist Items', owner: true, manager: true, staff: true },
                  { feature: 'Reassign Staff on Transactions', owner: true, manager: true, staff: false },
                  { feature: 'View End-of-Day Operations Report', owner: true, manager: true, staff: false },
                  { feature: 'View Business Financial Profit Margins', owner: true, manager: true, staff: false },
                  { feature: 'Modify Global Standard Pricing Rates', owner: true, manager: false, staff: false },
                  { feature: 'Delete Transaction Records', owner: true, manager: false, staff: false }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-medium text-slate-800">{row.feature}</td>
                    <td className="py-2.5 px-4 text-center font-bold text-emerald-600">
                      {row.owner ? '✓ Allowed' : '— Restricted'}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      {row.manager ? '✓ Allowed' : <span className="text-slate-300 font-normal">— Restricted</span>}
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      {row.staff ? '✓ Allowed' : <span className="text-slate-300 font-normal">— Restricted</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES & PRICING */}
      {activeSettingsTab === 'pricing' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Service Catalog & Baseline Fee Benchmark
              </h2>
              <p className="text-xs text-slate-500">
                Prototype only — production permissions and approval rules would be added later.
              </p>
            </div>
            {priceSaveNotice && (
              <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-3 py-1 rounded border border-emerald-200 animate-in fade-in">
                Pricing benchmark updated!
              </span>
            )}
          </div>

          <div className="space-y-4">
            {services.map(svc => {
              const isEditing = editingServiceId === svc.id;

              return (
                <div key={svc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{svc.name}</h4>
                      <p className="text-xs text-slate-500">{svc.description}</p>
                    </div>

                    <div>
                      {canEditPricing ? (
                        !isEditing ? (
                          <button
                            onClick={() => startEditService(svc.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Rates</span>
                          </button>
                        ) : null
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Rates locked for {currentRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Base Gov Fee (₱)</label>
                        <input
                          type="number"
                          value={editGovFee}
                          onChange={(e) => setEditGovFee(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Base Service Fee (₱)</label>
                        <input
                          type="number"
                          value={editServiceFee}
                          onChange={(e) => setEditServiceFee(Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs font-mono font-bold text-blue-700"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          onClick={saveServicePricing}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingServiceId(null)}
                          className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-sans">BASE GOV PASS-THROUGH</span>
                        <span className="font-bold text-slate-900">{formatCurrency(svc.baseGovernmentFee)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-sans">BASE LIAISON SERVICE FEE</span>
                        <span className="font-bold text-blue-700">{formatCurrency(svc.baseServiceFee)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-sans">EST. TURNAROUND</span>
                        <span className="text-slate-700">{svc.standardTurnaroundDays} business days</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-sans">AVAILABLE ADD-ONS</span>
                        <span className="text-slate-700">{svc.availableAddOns.length} add-ons</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <PrototypeNoticeBox 
            note="Prototype only — production permissions and approval rules would be added later."
          />
        </div>
      )}

      {/* TAB 3: STAFF DIRECTORY */}
      {activeSettingsTab === 'staff' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Internal Operations Staff & Field Liaison Directory
            </h2>
            <p className="text-xs text-slate-500">
              Designated processors assigned across Cebu Social Security System (SSS) branches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {staff.map(member => (
              <div key={member.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {member.avatarInitials}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">{member.name}</h4>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {member.id}
                    </span>
                  </div>
                  <div className="text-xs text-blue-700 font-medium">{member.roleTitle}</div>
                  <div className="text-[11px] text-slate-600 font-mono">{member.phone} • {member.email}</div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Coverage: <strong>{member.assignedBranch}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ABOUT THIS PROTOTYPE */}
      {activeSettingsTab === 'about' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5 text-xs text-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              About Liaison Services Concept Prototype
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstration build designed for Cebu Social Security System (SSS) liaison and member assistance businesses.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">1. Problem & Context</h3>
            <p className="leading-relaxed">
              Cebu SSS member loan applications, penalty condonation, online DAEM registrations, and benefit claims (maternity, sickness, retirement, funeral, death) involve complex coordination across branches (SSS Cebu City Osmeña Blvd, NRA Galleria, Mandaue, Lapu-Lapu, Talisay, and Toledo). Currently, liaison operators manage these processes manually via paper folders and unorganized messaging groups, causing delayed claim releases and untracked service fees.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">2. Architectural Capabilities</h3>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
              <li><strong>Offline / GitHub Pages Deployment:</strong> Zero backend or external server dependencies. Operates seamlessly as a static Single Page Application.</li>
              <li><strong>Local Persistence:</strong> All mutations (transactions, notes, document verifications, role selections) are safely held in local browser storage.</li>
              <li><strong>Separation of Pass-Through Dues:</strong> Clear demarcation between statutory government MVUC/license fees and gross operational business margin.</li>
              <li><strong>Full Auditability:</strong> Every status transition generates an immutable timestamped log item with assigned officer credentials.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">3. Suggested Discovery Next Steps</h3>
            <p className="leading-relaxed">
              During technical discovery with the business owners, the actual team structure, custom SLA schedules, LTO portal automation (LTMS scraping/webhook integration), and SMS gateway providers (e.g. Semaphore/Globe Labs) would be defined and integrated into a production Cloud SQL / backend environment.
            </p>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <RotateCcw className="w-5 h-5" />
              <span>Reset Prototype Data?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore all sample clients, overdue transactions, staff queues, and activity logs back to their initial demonstration values.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
