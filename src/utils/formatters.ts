import { TransactionStatus, PriorityLevel, ServiceTypeKey } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getStatusBadgeStyle = (status: TransactionStatus): {
  badgeClass: string;
  dotColor: string;
  label: string;
} => {
  switch (status) {
    case 'Completed':
      return {
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-600',
        label: 'Completed'
      };
    case 'In Progress':
      return {
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        dotColor: 'bg-sky-600',
        label: 'In Progress'
      };
    case 'Ready for Processing':
      return {
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-600',
        label: 'Ready for Processing'
      };
    case 'Waiting on SSS':
    case 'Waiting on LTO':
      return {
        badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        dotColor: 'bg-indigo-600',
        label: 'Waiting on SSS'
      };
    case 'Requirements Pending':
      return {
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        label: 'Requirements Pending'
      };
    case 'Waiting on Client':
      return {
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
        dotColor: 'bg-orange-500',
        label: 'Waiting on Client'
      };
    case 'Cancelled':
      return {
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-600',
        label: 'Cancelled'
      };
    case 'New':
    default:
      return {
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        dotColor: 'bg-slate-500',
        label: 'New'
      };
  }
};

export const getPriorityBadgeStyle = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-50 text-red-700 border-red-200 font-semibold';
    case 'Rush':
      return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
    case 'Normal':
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200 font-normal';
  }
};

export const isOverdue = (targetDate: string, status: TransactionStatus): boolean => {
  if (status === 'Completed' || status === 'Cancelled') return false;
  const target = new Date(targetDate);
  const now = new Date('2026-09-30'); // Reference prototype date
  return target < now;
};
