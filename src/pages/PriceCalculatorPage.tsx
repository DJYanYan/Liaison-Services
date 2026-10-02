import React, { useState } from 'react';
import { 
  Calculator, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Plus, 
  Tag, 
  FileText, 
  Info,
  Shield,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceTypeKey } from '../types';
import { formatCurrency } from '../utils/formatters';
import { InfoTooltip } from '../components/InfoTooltip';

export const PriceCalculatorPage: React.FC = () => {
  const { 
    services, 
    setIsCreateTxnModalOpen, 
    setCreateTxnPreFill, 
    openHelpModal,
    setActiveTab
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceTypeKey>(services[0]?.id || 'loan_condonation');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [sampleSssNumber, setSampleSssNumber] = useState('06-3829104-5');

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];

  const baseGovFee = currentService.baseGovernmentFee;
  const baseServiceFee = currentService.baseServiceFee;

  // Selected add-ons
  const selectedAddOns = currentService.availableAddOns.filter(a => 
    selectedAddOnIds.includes(a.id)
  );

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.fee, 0);

  // Discount calculation
  let calculatedDiscount = 0;
  if (discountType === 'fixed') {
    calculatedDiscount = Math.min(baseServiceFee, Number(discountValue) || 0);
  } else {
    calculatedDiscount = Math.round((baseServiceFee * (Number(discountValue) || 0)) / 100);
  }

  const grandTotal = Math.max(0, baseGovFee + baseServiceFee + addOnsTotal - calculatedDiscount);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleStartTransactionWithQuote = () => {
    setCreateTxnPreFill({
      serviceType: currentService.id,
      addOnIds: selectedAddOnIds,
      discount: calculatedDiscount,
      referenceNumber: `SSS No: ${sampleSssNumber}`
    });
    setIsCreateTxnModalOpen(true);
  };

  const categories = ['All', 'Loans', 'Online & Account', 'Benefit Claims'];

  const filteredServices = services.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Interactive SSS Service Price Calculator
            </h1>
            <InfoTooltip
              badgeText="Standard SSS Rates"
              title="Standardized SSS Liaison Pricing"
              content="Calculates fixed liaison fees based on the 19 standard SSS service categories (from ₱30 PRN, ₱50 Email Reset, ₱100–₱200 Loans, to ₱300 Claims & ID)."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate service quotes for SSS members, apply promotional discounts, and configure add-on services before filing.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('settings')}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Configure default rates in Settings →</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs & Add-ons (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Service Selection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                Select SSS Service (19 Services Available)
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Category: <strong>{currentService.category}</strong>
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredServices.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => {
                    setSelectedServiceId(svc.id);
                    setSelectedAddOnIds([]);
                  }}
                  className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                    selectedServiceId === svc.id 
                      ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-1 ring-amber-500' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900">{svc.name}</span>
                    <span className="font-mono font-bold text-xs text-blue-700 shrink-0">
                      ₱{svc.baseServiceFee}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{svc.description}</div>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    Est. Turnaround: {svc.standardTurnaroundDays} business days
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Member SS Number Preview */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              Member SSS Identification
            </label>
            <div>
              <label className="block text-[11px] text-slate-600 mb-1 font-medium">SS Number / Member Reference</label>
              <input
                type="text"
                value={sampleSssNumber}
                onChange={(e) => setSampleSssNumber(e.target.value)}
                placeholder="06-XXXXXXXX-X"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Optional Add-Ons */}
          {currentService.availableAddOns.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-slate-500" />
                  Optional Add-On Services
                </label>
                <span className="text-[11px] text-slate-400">
                  {selectedAddOnIds.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {currentService.availableAddOns.map(addon => {
                  const isChecked = selectedAddOnIds.includes(addon.id);

                  return (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300' 
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900">{addon.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{addon.description}</div>
                        </div>
                      </div>

                      <div className="font-mono font-bold text-xs text-slate-900 shrink-0">
                        +{formatCurrency(addon.fee)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Promotional Discount */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500" />
                Service Fee Discount & Concessions
              </label>
              <InfoTooltip
                title="Discount Application"
                content="Discounts apply to liaison service fees for senior citizens, PWDs, or loyalty volume clients."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Discount Type</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setDiscountType('fixed')}
                    className={`flex-1 py-1 text-xs font-semibold rounded ${
                      discountType === 'fixed' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Fixed (₱)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`flex-1 py-1 text-xs font-semibold rounded ${
                      discountType === 'percent' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Percent (%)
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">
                  {discountType === 'fixed' ? 'Discount Amount in PHP (₱)' : 'Discount Percentage (%)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percent' ? 100 : baseServiceFee}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Breakdown Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 p-5 space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  Live Quotation Engine
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Itemized SSS Fee Summary
                </h3>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            {/* Line items */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <div>
                  <span className="font-semibold text-white">1. SSS Liaison Service Fee</span>
                  <span className="block text-[11px] text-slate-400">
                    {currentService.name} (Official Catalog Rate)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-300 text-base">
                  {formatCurrency(baseServiceFee)}
                </span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="border-t border-slate-800 pt-2 space-y-1.5">
                  <span className="text-slate-400 text-[11px] font-semibold block uppercase">
                    Add-on Services ({selectedAddOns.length}):
                  </span>
                  {selectedAddOns.map(addon => (
                    <div key={addon.id} className="flex justify-between text-slate-300 text-[11px] pl-2">
                      <span className="truncate pr-2">• {addon.name}</span>
                      <span className="font-mono font-medium">{formatCurrency(addon.fee)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-slate-200 text-xs font-semibold pt-1 border-t border-slate-800/60">
                    <span>Add-ons Subtotal</span>
                    <span className="font-mono">{formatCurrency(addOnsTotal)}</span>
                  </div>
                </div>
              )}

              {calculatedDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 border-t border-slate-800 pt-2">
                  <span>Client Discount Concession</span>
                  <span className="font-mono font-semibold">-{formatCurrency(calculatedDiscount)}</span>
                </div>
              )}

              {/* Total Card */}
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/80 space-y-1 mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Total Quoted Service Fee
                  </span>
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700">
                  <span>Estimated Processing SLA</span>
                  <span className="font-mono text-slate-300">{currentService.standardTurnaroundDays} business days</span>
                </div>
              </div>
            </div>

            {/* Default Requirements Checklist Preview */}
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Required SSS Member Documents ({currentService.defaultRequirements.length}):
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {currentService.defaultRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Launch Action */}
            <button
              onClick={handleStartTransactionWithQuote}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Create Transaction with this Quote</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
