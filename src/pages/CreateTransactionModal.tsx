import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  User, 
  Car, 
  FileText, 
  DollarSign, 
  Calendar,
  Sparkles,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceTypeKey, PriorityLevel, DocumentChecklistItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { InfoTooltip } from '../components/InfoTooltip';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preFillData?: any;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
  preFillData
}) => {
  const { 
    clients, 
    staff, 
    services, 
    createTransaction, 
    createClient,
    setSelectedTransactionId
  } = useApp();

  // Mode: existing client vs create new client inline
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  
  // New Client Fields
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientCity, setNewClientCity] = useState('Cebu City');

  // Service & Details
  const [serviceType, setServiceType] = useState<ServiceTypeKey>(services[0]?.id || 'loan_condonation');
  const [referenceNumber, setReferenceNumber] = useState('SSS No: 06-3829104-5');
  const [memberType, setMemberType] = useState<string>('Employed');
  const [disbursementBank, setDisbursementBank] = useState<string>('UnionBank');
  const [bankAccountNumber, setBankAccountNumber] = useState<string>('1092-8812-40');
  const [crnOrUmid, setCrnOrUmid] = useState<string>('');

  // Staff & Priority
  const [assignedStaffId, setAssignedStaffId] = useState<string>(staff[0]?.id || '');
  const [priority, setPriority] = useState<PriorityLevel>('Normal');

  // Dates
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  // Checklist items
  const [checklist, setChecklist] = useState<DocumentChecklistItem[]>([]);

  // Pricing
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState<string>('');

  // Internal Notes
  const [internalNotes, setInternalNotes] = useState('');

  // Validation & Feedback
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Active Service Object
  const currentService = services.find(s => s.id === serviceType) || services[0];

  // Initialize or update checklist and pricing when service changes
  useEffect(() => {
    if (currentService) {
      setChecklist(
        currentService.defaultRequirements.map((req, idx) => ({
          id: `req_${idx}`,
          name: req,
          required: true,
          submitted: false,
          verified: false
        }))
      );

      // Default target date based on turnaround days
      const d = new Date();
      d.setDate(d.getDate() + currentService.standardTurnaroundDays);
      setTargetDate(d.toISOString().split('T')[0]);
    }
  }, [serviceType]);

  // Handle pre-fill if triggered from Price Calculator
  useEffect(() => {
    if (preFillData) {
      if (preFillData.serviceType) setServiceType(preFillData.serviceType);
      if (preFillData.addOnIds) setSelectedAddOnIds(preFillData.addOnIds);
      if (preFillData.discount) setDiscountAmount(preFillData.discount);
      if (preFillData.priority) setPriority(preFillData.priority);
      if (preFillData.referenceNumber) {
        setReferenceNumber(preFillData.referenceNumber);
      }
    }
  }, [preFillData]);

  if (!isOpen) return null;

  // Calculate pricing breakdown
  const baseGov = currentService.baseGovernmentFee;
  const baseService = currentService.baseServiceFee;
  
  const chosenAddOns = currentService.availableAddOns
    .filter(a => selectedAddOnIds.includes(a.id))
    .map(a => ({ id: a.id, name: a.name, amount: a.fee }));

  const addOnsTotal = chosenAddOns.reduce((sum, a) => sum + a.amount, 0);
  const totalAmount = Math.max(0, baseGov + baseService + addOnsTotal - discountAmount);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (isNewClientMode) {
      if (!newClientName.trim()) errs.clientName = 'Client full name is required.';
      if (!newClientPhone.trim()) errs.clientPhone = 'Valid contact number is required.';
    } else {
      if (!selectedClientId) errs.client = 'Please select an existing client.';
    }

    if (!referenceNumber.trim()) {
      errs.referenceNumber = 'Vehicle Plate Number or Driver License No. is required.';
    }

    if (!targetDate) {
      errs.targetDate = 'Target completion date is required.';
    }

    if (discountAmount < 0) {
      errs.discount = 'Discount cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalClientId = selectedClientId;
    let finalClientName = '';
    let finalClientPhone = '';

    if (isNewClientMode) {
      const created = createClient({
        fullName: newClientName.trim(),
        contactNumber: newClientPhone.trim(),
        email: newClientEmail.trim() || `${newClientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: 'Metro Cebu',
        city: newClientCity,
        primaryReference: referenceNumber,
        notes: 'Client added via quick transaction intake form.'
      });
      finalClientId = created.id;
      finalClientName = created.fullName;
      finalClientPhone = created.contactNumber;
    } else {
      const client = clients.find(c => c.id === selectedClientId);
      finalClientName = client?.fullName || 'Client';
      finalClientPhone = client?.contactNumber || '+63 9XX XXX XXXX';
    }

    const assignedStaff = staff.find(s => s.id === assignedStaffId) || staff[0];

    const isVehicleService = currentService.category === 'Vehicle';

    const newTxn = createTransaction({
      clientId: finalClientId,
      clientName: finalClientName,
      clientPhone: finalClientPhone,
      serviceType: currentService.id,
      serviceName: currentService.name,
      assignedStaffId: assignedStaff.id,
      assignedStaffName: assignedStaff.name,
      status: 'New',
      priority,
      targetDate,
      referenceNumber,
      sssDetails: {
        sssNumber: referenceNumber.replace('SSS No:', '').replace('SSS:', '').trim(),
        crnOrUmid: crnOrUmid || undefined,
        memberType,
        disbursementBank: disbursementBank || undefined,
        bankAccountNumber: bankAccountNumber || undefined
      },
      pricing: {
        governmentFee: baseGov,
        serviceFee: baseService,
        addOns: chosenAddOns,
        discount: discountAmount,
        discountReason: discountReason || undefined,
        totalAmount
      },
      checklist,
      internalNotes: internalNotes.trim()
    });

    setSuccessToast('Demo transaction created successfully.');

    setTimeout(() => {
      onClose();
      setSelectedTransactionId(newTxn.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                Intake Form
              </span>
              <h2 className="text-lg font-bold">Create New LTO Service Transaction</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized order creation with auto-calculated fees and document requirements
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-1">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successToast} Opening transaction record...
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-5">
          {/* Prototype Tooltip Info */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-[11px] text-sky-950 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong>Prototype note:</strong> This creates a sample transaction for demonstration purposes. A production version would also validate permissions and save the record securely.
              </div>
            </div>
            <InfoTooltip
              title="Transaction Creation"
              content="Changes are saved in browser state/localStorage so the demo remains fully interactive after refreshing."
            />
          </div>

          {/* Section 1: Client Selection or Creation */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                1. Client Information
              </label>
              <button
                type="button"
                onClick={() => setIsNewClientMode(!isNewClientMode)}
                className="text-blue-600 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                {isNewClientMode ? '← Choose Existing Client' : '+ Create New Client'}
              </button>
            </div>

            {!isNewClientMode ? (
              <div>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.primaryReference} ({c.city})
                    </option>
                  ))}
                </select>
                {errors.client && <p className="text-rose-600 text-[11px] mt-1">{errors.client}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Maria Clarissa Ramos"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                  {errors.clientName && <p className="text-rose-600 text-[10px] mt-0.5">{errors.clientName}</p>}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-medium">Mobile Contact *</label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                  />
                  {errors.clientPhone && <p className="text-rose-600 text-[10px] mt-0.5">{errors.clientPhone}</p>}
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-medium">City / Municipality</label>
                  <input
                    type="text"
                    value={newClientCity}
                    onChange={(e) => setNewClientCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Service Type Selection */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                2. SSS Service Selection
              </label>
              <span className="text-[11px] text-blue-700 font-bold font-mono">
                Liaison Fee: {formatCurrency(currentService.baseServiceFee)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {services.map(svc => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setServiceType(svc.id)}
                  className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                    serviceType === svc.id 
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-1 ring-amber-500' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs truncate">{svc.name}</span>
                    <span className="text-[11px] font-mono font-semibold text-blue-700 shrink-0">
                      ₱{svc.baseServiceFee}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{svc.category} • {svc.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: SSS Member & Disbursement Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-slate-500" />
              3. SSS Number & Member Disbursement Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">SS Number / Reference *</label>
                <input
                  type="text"
                  placeholder="e.g. SSS No: 06-3829104-5"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                />
                {errors.referenceNumber && <p className="text-rose-600 text-[10px] mt-0.5">{errors.referenceNumber}</p>}
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Member Classification</label>
                <select
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Voluntary">Voluntary Member</option>
                  <option value="OFW">OFW</option>
                  <option value="Non-Working Spouse">Non-Working Spouse</option>
                  <option value="Pensioner">Retiree Pensioner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">CRN / UMID No. (Optional)</label>
                <input
                  type="text"
                  placeholder="0033-XXXXXXX-X"
                  value={crnOrUmid}
                  onChange={(e) => setCrnOrUmid(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">DAEM Disbursement Channel</label>
                <select
                  value={disbursementBank}
                  onChange={(e) => setDisbursementBank(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                >
                  <option value="UnionBank">UnionBank (PESONet)</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="LandBank">LandBank of the Philippines</option>
                  <option value="BDO">BDO Unibank</option>
                  <option value="BPI">Bank of the Philippine Islands (BPI)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Account / Mobile Number for Payout</label>
                <input
                  type="text"
                  placeholder="e.g. 1092-8812-40 or +63 9XX XXX XXXX"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Staff Assignment, Priority, & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-1">Assigned Staff</label>
              <select
                value={assignedStaffId}
                onChange={(e) => setAssignedStaffId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.roleTitle.split('&')[0]})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-semibold"
              >
                <option value="Normal">Normal (Standard)</option>
                <option value="Rush">Rush (Priority Liaison)</option>
                <option value="Urgent">Urgent (Immediate Filing)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-1">Target Completion Date *</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
              />
              {errors.targetDate && <p className="text-rose-600 text-[10px] mt-0.5">{errors.targetDate}</p>}
            </div>
          </div>

          {/* Section 5: Add-ons & Live Price Calculation */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                5. Standardized Price Calculation
              </label>
              <InfoTooltip
                title="Transparent Billing"
                content="Government fees are standard LTO disbursements. Service fee is retained business revenue."
              />
            </div>

            {/* Add-on toggles */}
            {currentService.availableAddOns.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-600">Select Optional Add-ons:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentService.availableAddOns.map(addon => {
                    const isChecked = selectedAddOnIds.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked ? 'bg-white border-blue-400 shadow-2xs' : 'bg-slate-100/60 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddOn(addon.id)}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 flex justify-between">
                            <span>{addon.name}</span>
                            <span className="font-mono text-slate-900">{formatCurrency(addon.fee)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{addon.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Discount input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Discount (₱)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Discount Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Loyalty rebate, Senior citizen"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Live Price Summary Box */}
            <div className="bg-slate-900 text-white p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 font-mono">
              <div className="text-xs space-y-0.5">
                <div className="text-slate-400 text-[11px]">
                  Gov: {formatCurrency(baseGov)} + Service: {formatCurrency(baseService)} + Add-ons: {formatCurrency(addOnsTotal)}
                  {discountAmount > 0 && ` - Disc: ${formatCurrency(discountAmount)}`}
                </div>
                <div className="text-white text-xs font-sans font-semibold">
                  Grand Total for Client Quoting:
                </div>
              </div>
              <div className="text-xl font-bold text-amber-400 tabular-nums">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* Section 6: Internal Notes */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-900 text-xs">
              Internal Operations Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Urgent client departure abroad on Oct 10; needs express LTO clearance..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Liaison Services • Transaction Creator
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Create Sample Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
