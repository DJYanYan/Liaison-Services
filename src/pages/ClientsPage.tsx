import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  FileText, 
  ChevronRight, 
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import { InfoTooltip, PrototypeNoticeBox } from '../components/InfoTooltip';
import { ClientDetailModal } from './ClientDetailModal';

export const ClientsPage: React.FC = () => {
  const { 
    clients, 
    transactions, 
    selectedClientId, 
    setSelectedClientId,
    createClient,
    exportCsv
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // New Client Form state
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Cebu City');
  const [tin, setTin] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Extract cities
  const cities = useMemo(() => {
    const set = new Set(clients.map(c => c.city));
    return Array.from(set);
  }, [clients]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.fullName.toLowerCase().includes(q);
        const matchesPhone = c.contactNumber.toLowerCase().includes(q);
        const matchesRef = c.primaryReference.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesRef && !matchesCity) return false;
      }

      if (cityFilter !== 'all' && c.city !== cityFilter) return false;

      return true;
    });
  }, [clients, searchQuery, cityFilter]);

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactNumber.trim()) {
      setFormError('Client name and phone number are required.');
      return;
    }

    const created = createClient({
      fullName: fullName.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: address.trim() || 'Cebu',
      city,
      tinOrIdNumber: tin.trim() || undefined,
      primaryReference: reference.trim() || 'Plate: TBD',
      notes: notes.trim()
    });

    setIsAddClientModalOpen(false);
    // Reset form
    setFullName('');
    setContactNumber('');
    setEmail('');
    setAddress('');
    setTin('');
    setReference('');
    setNotes('');
    setFormError('');
    setSelectedClientId(created.id);
  };

  const handleExportClients = () => {
    const headers = ['Client ID', 'Full Name', 'Contact Number', 'Email', 'City', 'Primary Reference', 'Total Transactions', 'Active Transactions'];
    const rows = filteredClients.map(c => [
      c.id,
      c.fullName,
      c.contactNumber,
      c.email,
      c.city,
      c.primaryReference,
      c.totalTransactions,
      c.activeTransactions
    ]);
    exportCsv('LiaisonServices_Clients', headers, rows);
  };

  return (
    <div className="space-y-5">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Client Profiles & Directory
            </h1>
            <InfoTooltip
              badgeText="What is this?"
              title="Client Management Directory"
              content="Store SSS member client information, SS Numbers, disbursement channels, and transaction histories."
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain member records, contact coordinates, and historical SSS transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportClients}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddClientModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by member name, mobile (+63), SSS No., or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-56 shrink-0">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cities ({clients.length})</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4">Primary Vehicle / License</th>
                <th className="py-3 px-4 text-center">Transactions</th>
                <th className="py-3 px-4">Latest Transaction</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No client profiles match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => {
                  // Linked transactions
                  const clientTxns = transactions.filter(t => t.clientId === client.id);
                  const latestTxn = clientTxns[0];
                  const hasActive = clientTxns.some(t => t.status !== 'Completed' && t.status !== 'Cancelled');

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-[10px] shrink-0">
                            {client.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {client.fullName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {client.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="font-bold text-slate-800">{client.contactNumber}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{client.email}</div>
                      </td>

                      {/* Primary Ref */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-semibold text-blue-800 bg-blue-50/80 border border-blue-200/60 px-2 py-0.5 rounded inline-block">
                          {client.primaryReference}
                        </span>
                      </td>

                      {/* Transactions Count */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                        {clientTxns.length}
                      </td>

                      {/* Latest Transaction */}
                      <td className="py-3.5 px-4">
                        {latestTxn ? (
                          <div>
                            <span className="font-mono font-bold text-slate-900 text-[11px] block">
                              {latestTxn.id}
                            </span>
                            <span className="text-slate-500 text-[11px] truncate block max-w-[140px]">
                              {latestTxn.serviceName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {hasActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                            <span>Active Case</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <span>Idle / Closed</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedClientId(client.id)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded font-semibold text-xs transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Client records in the real system would be protected by role-based access and privacy controls.</span>
          <span className="font-mono text-slate-400">Total: {clients.length} Clients</span>
        </div>
      </div>

      {/* Render Client Detail Modal if one is selected */}
      {selectedClientId && (
        <ClientDetailModal
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}

      {/* Add Client Modal */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm">Add New Client Profile</h3>
              <button
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="p-5 space-y-3 text-xs">
              {formError && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Atty. Vincent Gabriel Tan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Number *</label>
                  <input
                    type="text"
                    placeholder="+63 9XX XXX XXXX"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Location</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  >
                    <option value="Cebu City">Cebu City</option>
                    <option value="Mandaue City">Mandaue City</option>
                    <option value="Lapu-Lapu City">Lapu-Lapu City</option>
                    <option value="Talisay City">Talisay City</option>
                    <option value="Consolacion">Consolacion</option>
                    <option value="Liloan">Liloan</option>
                    <option value="Minglanilla">Minglanilla</option>
                    <option value="Toledo City">Toledo City</option>
                    <option value="Naga City">Naga City</option>
                    <option value="Danao City">Danao City</option>
                    <option value="Carcar City">Carcar City</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Reference (SSS No. or CRN)</label>
                <input
                  type="text"
                  placeholder="e.g. SSS No: 06-3829104-5"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Notes</label>
                <textarea
                  rows={2}
                  placeholder="Preferences, corporate billing, or referral details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
