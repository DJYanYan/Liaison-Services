export type UserRole = 'owner' | 'manager' | 'processor';

export type ServiceTypeKey = 
  // SSS Services
  | 'loan_condonation'
  | 'pension_loan'
  | 'salary_loan'
  | 'emergency_loan'
  | 'reset_email_contribution'
  | 'prn_generation'
  | 'e1_registration'
  | 'web_registration'
  | 'atm_requirements'
  | 'daem_enrollment'
  | 'maternity_notification'
  | 'maternity_claim'
  | 'sickness_claim'
  | 'disability_claim'
  | 'funeral_claim'
  | 'death_claim'
  | 'unemployment_claim'
  | 'retirement_claim'
  | 'my_sss_id'
  // Legacy / fallback
  | 'reg_renewal' 
  | 'ownership_transfer' 
  | 'license_renewal' 
  | 'new_license'
  | string;

export type TransactionStatus = 
  | 'New'
  | 'Requirements Pending'
  | 'Ready for Processing'
  | 'In Progress'
  | 'Waiting on SSS'
  | 'Waiting on LTO'
  | 'Waiting on Client'
  | 'Completed'
  | 'Cancelled';

export type PriorityLevel = 'Normal' | 'Rush' | 'Urgent';

export interface ServiceConfig {
  id: ServiceTypeKey;
  name: string;
  category: 'Loans' | 'Online & Account' | 'Benefit Claims' | 'Vehicle' | 'Driver' | string;
  description: string;
  baseGovernmentFee: number;
  baseServiceFee: number;
  standardTurnaroundDays: number;
  availableAddOns: {
    id: string;
    name: string;
    description: string;
    fee: number;
    isGovernmentPassThrough: boolean;
  }[];
  defaultRequirements: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  roleTitle: string;
  email: string;
  phone: string;
  assignedBranch: string;
  activeTransactionsCount: number;
  avatarInitials: string;
}

export interface Client {
  id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  tinOrIdNumber?: string;
  primaryReference: string; // e.g. "SSS No: 06-3829104-5"
  totalTransactions: number;
  activeTransactions: number;
  createdAt: string;
  notes: string;
}

export interface DocumentChecklistItem {
  id: string;
  name: string;
  required: boolean;
  submitted: boolean;
  verified: boolean;
  verifiedAt?: string;
  notes?: string;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details?: string;
}

export interface SssMemberDetails {
  sssNumber: string;
  crnOrUmid?: string;
  memberType: 'Employed' | 'Self-Employed' | 'Voluntary' | 'OFW' | 'Non-Working Spouse' | 'Pensioner' | string;
  employerName?: string;
  employerId?: string;
  disbursementBank?: string; // e.g. "GCash", "UnionBank", "LandBank", "Maya"
  bankAccountNumber?: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceType: ServiceTypeKey;
  serviceName: string;
  assignedStaffId: string;
  assignedStaffName: string;
  status: TransactionStatus;
  priority: PriorityLevel;
  createdAt: string;
  targetDate: string;
  completedDate?: string;
  
  // Specific SSS reference details
  referenceNumber: string; // e.g. SSS No. or CRN
  sssDetails?: SssMemberDetails;
  
  // Legacy optional details
  vehicleDetails?: {
    makeModel: string;
    year: string;
    plateNumber: string;
    mvFileNumber?: string;
    chassisNumber?: string;
    engineNumber?: string;
    classification?: string;
  };
  licenseDetails?: {
    licenseNumber: string;
    currentExpirationDate?: string;
    licenseType?: string;
    restrictions?: string;
  };

  // Pricing breakdown
  pricing: {
    governmentFee: number;
    serviceFee: number;
    addOns: {
      id: string;
      name: string;
      amount: number;
    }[];
    discount: number;
    discountReason?: string;
    totalAmount: number;
  };

  // Requirements checklist
  checklist: DocumentChecklistItem[];

  // Notes & history
  internalNotes: string;
  activityTimeline: ActivityTimelineItem[];
}

export interface NotificationItem {
  id: string;
  type: 'overdue' | 'target_date' | 'requirement' | 'assignment' | 'price' | 'completion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  transactionId?: string;
  priority?: 'normal' | 'high' | 'urgent';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  transactionId?: string;
  transactionRef?: string;
  details: string;
}
