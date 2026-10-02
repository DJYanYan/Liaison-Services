import {
  Client,
  StaffMember,
  ServiceConfig,
  Transaction,
  NotificationItem,
  AuditLogEntry
} from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff_1',
    name: 'Eduardo "Ed" Ramos',
    roleTitle: 'Senior Field Liaison Officer',
    email: 'ed.ramos@liaisonservices.ph',
    phone: '+63 917 555 3821',
    assignedBranch: 'SSS Cebu City Branch (Osmeña Blvd)',
    activeTransactionsCount: 7,
    avatarInitials: 'ER'
  },
  {
    id: 'staff_2',
    name: 'Gina Bautista',
    roleTitle: 'Operations Supervisor & Online Processing',
    email: 'gina.bautista@liaisonservices.ph',
    phone: '+63 920 888 4192',
    assignedBranch: 'Main Office - Cebu IT Park SSS Desk',
    activeTransactionsCount: 5,
    avatarInitials: 'GB'
  },
  {
    id: 'staff_3',
    name: 'Mark Anthony Tan',
    roleTitle: 'Field Processor & Claims Liaison',
    email: 'mark.tan@liaisonservices.ph',
    phone: '+63 918 333 9044',
    assignedBranch: 'SSS Mandaue & Lapu-Lapu Branches',
    activeTransactionsCount: 6,
    avatarInitials: 'MT'
  },
  {
    id: 'staff_4',
    name: 'Rochelle Dizon',
    roleTitle: 'Member Accounts & DAEM Specialist',
    email: 'rochelle.dizon@liaisonservices.ph',
    phone: '+63 927 444 1928',
    assignedBranch: 'SSS Talisay & Toledo Branches',
    activeTransactionsCount: 4,
    avatarInitials: 'RD'
  }
];

export const INITIAL_SERVICES: ServiceConfig[] = [
  // 1. Loan Condonation (200)
  {
    id: 'loan_condonation',
    name: 'Loan Condonation',
    category: 'Loans',
    description: 'Assistance in filing SSS Short-Term Member Loan Penalty Condonation (consolidation & waiver of accumulated penalties).',
    baseGovernmentFee: 0,
    baseServiceFee: 200,
    standardTurnaroundDays: 5,
    availableAddOns: [
      { id: 'addon_soa_print', name: 'Member Loan SOA Audit & Computation Printout', fee: 50, isGovernmentPassThrough: false, description: 'Detailed ledger computation printout' },
      { id: 'addon_notary_undertaking', name: 'Affidavit / Undertaking Notarization', fee: 150, isGovernmentPassThrough: false, description: 'Legal acknowledgment of condonation agreement' }
    ],
    defaultRequirements: [
      'SSS Digitized ID / UMID Card or 2 Valid Government IDs',
      'My.SSS Online Portal Credentials',
      'Latest Statement of Account (SOA) on Past Member Loans',
      'Certificate of Separation from Last Employer (if applicable)'
    ]
  },
  // 2. Pension Loan (200)
  {
    id: 'pension_loan',
    name: 'Pension Loan',
    category: 'Loans',
    description: 'Application liaison for low-interest SSS Pension Loan Program (PLP) for qualified retiree-pensioners.',
    baseGovernmentFee: 0,
    baseServiceFee: 200,
    standardTurnaroundDays: 4,
    availableAddOns: [
      { id: 'addon_bank_cert', name: 'Disbursement Bank Account Certification', fee: 100, isGovernmentPassThrough: false, description: 'Bank passbook / card confirmation liaison' }
    ],
    defaultRequirements: [
      'Retiree Pensioner SSS ID / UMID Card',
      '2 Valid Government-issued IDs with signature & photo',
      'Active SSS Pension ATM / Passbook Account (DAEM-enrolled)',
      'Recent 3-Month Pension Payment History Slip'
    ]
  },
  // 3. Salary Loan (100)
  {
    id: 'salary_loan',
    name: 'Salary Loan',
    category: 'Loans',
    description: 'Online application and liaison for SSS One-Month or Two-Month Salary Loan via My.SSS portal.',
    baseGovernmentFee: 0,
    baseServiceFee: 100,
    standardTurnaroundDays: 3,
    availableAddOns: [
      { id: 'addon_daem_check', name: 'DAEM Disbursement Account Verification', fee: 50, isGovernmentPassThrough: false, description: 'Check if bank account is active for loan credit' }
    ],
    defaultRequirements: [
      'Active SSS Number and My.SSS Member Portal Login',
      'At least 36 posted monthly contributions (6 within last 12 months)',
      'Valid Government-issued ID',
      'Employer My.SSS Portal Certification (for currently employed)'
    ]
  },
  // 4. Emergency Loan (100)
  {
    id: 'emergency_loan',
    name: 'Emergency Loan',
    category: 'Loans',
    description: 'Filing assistance for SSS Calamity / Emergency Assistance Loan for members in declared state of calamity.',
    baseGovernmentFee: 0,
    baseServiceFee: 100,
    standardTurnaroundDays: 3,
    availableAddOns: [
      { id: 'addon_brgy_cert', name: 'Barangay Calamity Certificate Assistance', fee: 50, isGovernmentPassThrough: false, description: 'Assistance in acquiring local residency certification' }
    ],
    defaultRequirements: [
      'Barangay Certificate of Residency stating area in calamity',
      'My.SSS Online Portal Access',
      'At least 36 monthly contributions (6 posted in past 12 months)',
      'Enrolled Disbursement Account (DAEM)'
    ]
  },
  // 5. Reset / New Email / Print Contribution (50)
  {
    id: 'reset_email_contribution',
    name: 'Reset / New Email / Print Contribution',
    category: 'Online & Account',
    description: 'Account recovery assistance, email address updating, password reset, and certified SSS contribution history printing.',
    baseGovernmentFee: 0,
    baseServiceFee: 50,
    standardTurnaroundDays: 1,
    availableAddOns: [
      { id: 'addon_color_print', name: 'Certified Colored SSS Contribution Printout', fee: 30, isGovernmentPassThrough: false, description: 'Complete itemized employment contribution history' }
    ],
    defaultRequirements: [
      'Registered Full Name, Date of Birth, and SSS Number',
      '1 Valid Primary Government ID with photo & signature',
      'New Active Personal Email Address (Gmail preferred)',
      'Member Selfie holding the valid ID for identity verification'
    ]
  },
  // 6. PRN (30)
  {
    id: 'prn_generation',
    name: 'PRN',
    category: 'Online & Account',
    description: 'Real-Time Processing of SSS Payment Reference Number (PRN) for Voluntary, Self-Employed, OFW, or Non-Working Spouse contributions and loan amortizations.',
    baseGovernmentFee: 0,
    baseServiceFee: 30,
    standardTurnaroundDays: 1,
    availableAddOns: [],
    defaultRequirements: [
      'SSS Number',
      'Membership Category (Self-Employed / Voluntary / OFW / Non-Working Spouse)',
      'Applicable Month(s) or Quarter and Desired Monthly Contribution Level'
    ]
  },
  // 7. E1 Registration (200)
  {
    id: 'e1_registration',
    name: 'E1 Registration',
    category: 'Online & Account',
    description: 'First-time SSS member registration, issuance of SS Number, and Personal Record Form (E-1) processing.',
    baseGovernmentFee: 0,
    baseServiceFee: 200,
    standardTurnaroundDays: 2,
    availableAddOns: [
      { id: 'addon_laminated_card', name: 'Laminated SS Number Card Slip', fee: 50, isGovernmentPassThrough: false, description: 'Protective lamination of official SS Number slip' }
    ],
    defaultRequirements: [
      'Original & Photocopy of PSA Birth Certificate',
      'Valid Primary Government ID (Passport, National ID, Driver\'s License, Voter\'s ID)',
      'Marriage Certificate (for married female applicants)',
      'Active Personal Email Address'
    ]
  },
  // 8. Web Registration (150)
  {
    id: 'web_registration',
    name: 'Web Registration',
    category: 'Online & Account',
    description: 'Creation and activation of official My.SSS Member Portal account for 24/7 online inquiries and applications.',
    baseGovernmentFee: 0,
    baseServiceFee: 150,
    standardTurnaroundDays: 1,
    availableAddOns: [],
    defaultRequirements: [
      'Valid SSS Number',
      'Active Personal Email Address',
      'One previous SSS transaction reference (e.g. Paid PRN, Loan account, or SBN Employer ID)'
    ]
  },
  // 9. ATM Requirements (100)
  {
    id: 'atm_requirements',
    name: 'ATM Requirements',
    category: 'Online & Account',
    description: 'Assistance in acquiring SSS Letter of Introduction (LOI) and bank account opening compliance for pension or loan ATM debit cards.',
    baseGovernmentFee: 0,
    baseServiceFee: 100,
    standardTurnaroundDays: 2,
    availableAddOns: [],
    defaultRequirements: [
      'SSS Member ID or SS Number Confirmation Slip',
      '2 Valid Government-issued IDs',
      'Two (2) 1x1 or 2x2 recent ID Photos',
      'Proof of Billing / Address Verification'
    ]
  },
  // 10. DAEM Enrollment (150)
  {
    id: 'daem_enrollment',
    name: 'DAEM Enrollment',
    category: 'Online & Account',
    description: 'Disbursement Account Enrollment Module registration to link bank accounts (PESONet) or digital wallets (GCash/Maya) for cash benefit deposits.',
    baseGovernmentFee: 0,
    baseServiceFee: 150,
    standardTurnaroundDays: 2,
    availableAddOns: [],
    defaultRequirements: [
      'My.SSS Member Portal Credentials',
      'Photo of ATM card showing Account Number & Member Name, or Bank Passbook / e-Wallet Certificate',
      'Valid Government ID',
      'Selfie holding valid ID and proof of account'
    ]
  },
  // 11. Maternity Notification (Mat 1) (50)
  {
    id: 'maternity_notification',
    name: 'Maternity Notification (Mat 1)',
    category: 'Benefit Claims',
    description: 'Initial pregnancy notification filing with SSS via portal or branch within the required gestation period.',
    baseGovernmentFee: 0,
    baseServiceFee: 50,
    standardTurnaroundDays: 1,
    availableAddOns: [],
    defaultRequirements: [
      'Ultrasound Report confirming pregnancy and Expected Date of Delivery (EDD)',
      'Medical Certificate from Attending OB-GYN',
      'My.SSS Member Portal Credentials',
      'Valid Government ID'
    ]
  },
  // 12. Maternity Claim (Mat 2) (300)
  {
    id: 'maternity_claim',
    name: 'Maternity Claim (Mat 2)',
    category: 'Benefit Claims',
    description: 'Filing of Maternity Benefit Claim reimbursement following delivery, miscarriage, or emergency termination of pregnancy.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 5,
    availableAddOns: [
      { id: 'addon_expedited_audit', name: 'Priority Document Review & Verification', fee: 100, isGovernmentPassThrough: false, description: 'Pre-audit of hospital and civil registry papers' }
    ],
    defaultRequirements: [
      'PSA Child Birth Certificate (or Fetal Death Certificate)',
      'Hospital Discharge Summary or Operating Room Record (for C-section)',
      'Approved Mat-1 Maternity Notification Acknowledgement',
      'Enrolled DAEM Disbursement Account'
    ]
  },
  // 13. Sickness Claim (300)
  {
    id: 'sickness_claim',
    name: 'Sickness Claim',
    category: 'Benefit Claims',
    description: 'Assistance for daily cash allowance reimbursement for days a member is unable to work due to sickness or injury.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 5,
    availableAddOns: [],
    defaultRequirements: [
      'SSS Sickness Benefit Application (SS Form CLD-9N)',
      'Medical Certificate with Clinical Abstract and recuperation days',
      'Diagnostic / Laboratory Test Results supporting illness',
      'Certificate of Approved Leave of Absence from Employer'
    ]
  },
  // 14. Disability Claim (300)
  {
    id: 'disability_claim',
    name: 'Disability Claim',
    category: 'Benefit Claims',
    description: 'Claim application for monthly pension or lump-sum benefit for members suffering partial or total permanent disability.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 7,
    availableAddOns: [],
    defaultRequirements: [
      'SSS Disability Claim Application Form',
      'Medical Certificate with physical examination findings',
      'Laboratory & Imaging reports (X-ray, MRI, CT scan)',
      'Member SSS ID / UMID and 2 Valid Government IDs'
    ]
  },
  // 15. Funeral Claim (300)
  {
    id: 'funeral_claim',
    name: 'Funeral Claim',
    category: 'Benefit Claims',
    description: 'Filing for funeral cash benefit (up to ₱60,000) payable to whoever defrayed the deceased member\'s burial expenses.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 4,
    availableAddOns: [],
    defaultRequirements: [
      'PSA Certified Death Certificate of deceased SSS member',
      'Official Receipt of Funeral Expenses issued in claimant name',
      'Valid Government ID of Claimant',
      'Enrolled DAEM Disbursement Account of Claimant'
    ]
  },
  // 16. Death Claim (300)
  {
    id: 'death_claim',
    name: 'Death Claim',
    category: 'Benefit Claims',
    description: 'Application for monthly death pension or lump sum for surviving primary beneficiaries (spouse and minor children).',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 7,
    availableAddOns: [],
    defaultRequirements: [
      'PSA Certified Death Certificate',
      'PSA Marriage Contract between member and surviving spouse',
      'PSA Birth Certificates of minor dependent children',
      'SSS DDR-1 Claim Form and Claimant IDs'
    ]
  },
  // 17. Unemployment Claim (300)
  {
    id: 'unemployment_claim',
    name: 'Unemployment Claim',
    category: 'Benefit Claims',
    description: 'Cash benefit liaison for involuntarily separated workers (retrenchment, closure, redundancy, or disease).',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 4,
    availableAddOns: [],
    defaultRequirements: [
      'DOLE Certificate of Involuntary Separation',
      'Notice of Termination from Employer',
      '2 Valid Government-issued IDs',
      'Enrolled DAEM Bank / e-Wallet Account'
    ]
  },
  // 18. Retirement Claim (300)
  {
    id: 'retirement_claim',
    name: 'Retirement Claim',
    category: 'Benefit Claims',
    description: 'End-to-end filing for SSS Monthly Retirement Pension or Lump-Sum Benefit for members reaching 60 (optional) or 65 (mandatory) years old.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 6,
    availableAddOns: [],
    defaultRequirements: [
      'SSS Retirement Claim Application (SS Form DDR-1)',
      'Member SSS ID / UMID or 2 Valid Government IDs',
      'Enrolled DAEM Pension Disbursement Bank Account (Passbook / ATM)',
      'Certificate of Separation from Last Employer (if filing between 60 to 64 years old)'
    ]
  },
  // 19. My SSS ID (300)
  {
    id: 'my_sss_id',
    name: 'My SSS ID',
    category: 'Online & Account',
    description: 'Assistance with My.SSS Digital ID generation, UMID biometric appointment scheduling, and ID verification.',
    baseGovernmentFee: 0,
    baseServiceFee: 300,
    standardTurnaroundDays: 3,
    availableAddOns: [],
    defaultRequirements: [
      'PSA Birth Certificate',
      'Valid Primary Government ID',
      'My.SSS Online Portal Credentials',
      'Appointment Confirmation Slip for Biometric Capture'
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client_1',
    fullName: 'Maria Lourdes Santos',
    contactNumber: '+63 917 842 1904',
    email: 'ml.santos@gmail.com',
    address: '42 Gorordo Ave, Lahug',
    city: 'Cebu City',
    tinOrIdNumber: 'TIN: 241-893-102-000',
    primaryReference: 'SSS No: 06-3829104-5',
    totalTransactions: 3,
    activeTransactions: 1,
    createdAt: '2025-11-12',
    notes: 'Employed member. Corporate distribution staff in Cebu City. Regularly inquires for salary loans.'
  },
  {
    id: 'client_2',
    fullName: 'Juan Miguel Dela Cruz',
    contactNumber: '+63 920 914 8320',
    email: 'jmdelacruz@yahoo.com',
    address: 'Unit 14B, Subangdaku Commercial Complex',
    city: 'Mandaue City',
    tinOrIdNumber: 'TIN: 189-204-512-000',
    primaryReference: 'SSS No: 06-1920482-1',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-01-15',
    notes: 'Self-employed businessman in Mandaue. Processing DAEM enrollment for UnionBank account.'
  },
  {
    id: 'client_3',
    fullName: 'Engr. Ferdinand Cruz',
    contactNumber: '+63 918 732 5591',
    email: 'fcruz.structural@gmail.com',
    address: '15 Mactan Marina Promenade, Pajo',
    city: 'Lapu-Lapu City',
    tinOrIdNumber: 'TIN: 104-552-881-000',
    primaryReference: 'CRN: 0033-9182741-9',
    totalTransactions: 4,
    activeTransactions: 1,
    createdAt: '2025-08-20',
    notes: 'Structural engineer in Lapu-Lapu. Needed email reset and contribution ledger printing.'
  },
  {
    id: 'client_4',
    fullName: 'Carmela Reyes-Aquino',
    contactNumber: '+63 927 381 0422',
    email: 'carmela.reyes@sanmiguel.com.ph',
    address: '77 Corona del Mar, Pooc',
    city: 'Talisay City',
    tinOrIdNumber: 'TIN: 312-901-447-000',
    primaryReference: 'SSS No: 06-4418290-3',
    totalTransactions: 1,
    activeTransactions: 1,
    createdAt: '2026-02-10',
    notes: 'Voluntary member in Talisay. Applying for SSS Short-Term Loan Penalty Condonation.'
  },
  {
    id: 'client_5',
    fullName: 'Roberto "Bert" Gonzales',
    contactNumber: '+63 915 628 3941',
    email: 'bert.gonzales@transglobal.ph',
    address: '28 Modena Subdivision, Calajoan',
    city: 'Minglanilla',
    tinOrIdNumber: 'TIN: 122-384-910-000',
    primaryReference: 'SSS No: 06-1182904-8',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-03-01',
    notes: 'Retiree pensioner in Minglanilla. Processing SSS Pension Loan (PLP) application.'
  },
  {
    id: 'client_6',
    fullName: 'Dr. Patricia Nicole Lim',
    contactNumber: '+63 917 339 8812',
    email: 'dr.patricia.lim@chonghua.com.ph',
    address: 'Chong Hua Medical Arts, Fuente Osmeña',
    city: 'Cebu City',
    tinOrIdNumber: 'TIN: 278-490-112-000',
    primaryReference: 'SSS No: 06-5591024-7',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2025-10-04',
    notes: 'Physician at Chong Hua Hospital. Self-employed voluntary contributor needing monthly PRN.'
  },
  {
    id: 'client_7',
    fullName: 'Danilo Macapagal',
    contactNumber: '+63 922 419 0284',
    email: 'danny.macapagal@gmail.com',
    address: '110 Cansaga Bayview, Pitogo',
    city: 'Consolacion',
    tinOrIdNumber: 'TIN: 190-843-021-000',
    primaryReference: 'SSS No: 06-2819034-2',
    totalTransactions: 1,
    activeTransactions: 1,
    createdAt: '2026-04-12',
    notes: 'Resident in Consolacion. Applying for SSS Emergency / Calamity Loan following flood damage.'
  },
  {
    id: 'client_8',
    fullName: 'Jasmine Rose Soriano',
    contactNumber: '+63 926 771 9043',
    email: 'jasmine.soriano@designstudio.ph',
    address: 'Unit 903, Avida Towers Riala, Cebu IT Park',
    city: 'Cebu City',
    tinOrIdNumber: 'TIN: 402-118-933-000',
    primaryReference: 'SSS No: 06-7281940-6',
    totalTransactions: 1,
    activeTransactions: 1,
    createdAt: '2026-05-18',
    notes: 'IT professional expecting first baby. Filed Maternity Notification (Mat 1).'
  },
  {
    id: 'client_9',
    fullName: 'Antonio "Tony" Villanueva',
    contactNumber: '+63 919 220 5418',
    email: 'tony.villanueva@outlook.com',
    address: '88 Yati Coastal Road',
    city: 'Liloan',
    tinOrIdNumber: 'TIN: 145-882-990-000',
    primaryReference: 'SSS No: 06-0049281-9',
    totalTransactions: 3,
    activeTransactions: 0,
    createdAt: '2025-06-11',
    notes: 'Senior citizen in Liloan. Recently finalized SSS Retirement Pension at SSS Danao Branch.'
  },
  {
    id: 'client_10',
    fullName: 'Beatriz "Bea" Aquino',
    contactNumber: '+63 917 602 1845',
    email: 'bea.aquino@fintechsolutions.com',
    address: '14 Maria Luisa Estate Park, Banilad',
    city: 'Cebu City',
    tinOrIdNumber: 'TIN: 388-921-705-000',
    primaryReference: 'SSS No: 06-6910482-4',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-06-02',
    notes: 'Fintech executive. Completed Maternity Claim (Mat 2) for direct deposit.'
  },
  {
    id: 'client_11',
    fullName: 'Ricardo Valenzuela',
    contactNumber: '+63 928 901 3412',
    email: 'r.valenzuela@copper.ph',
    address: '54 Carmen Copper Heights, Don Andres Soriano',
    city: 'Toledo City',
    tinOrIdNumber: 'TIN: 109-382-716-000',
    primaryReference: 'SSS No: 06-3918204-0',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-07-14',
    notes: 'Former mining mechanic in Toledo City. Filing SSS Unemployment Involuntary Separation benefit.'
  },
  {
    id: 'client_12',
    fullName: 'Grace Ann Manalo',
    contactNumber: '+63 916 448 9102',
    email: 'graceann.manalo@gmail.com',
    address: '22 Oceanview Heights, Poblacion',
    city: 'Naga City',
    tinOrIdNumber: 'TIN: 320-119-482-000',
    primaryReference: 'SSS No: 06-8819024-1',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-08-01',
    notes: 'First-time jobseeker in Naga City. Processing E-1 Registration and ATM requirements.'
  },
  {
    id: 'client_13',
    fullName: 'Rolando P. Dizon',
    contactNumber: '+63 917 502 8841',
    email: 'rolando.dizon@dizonagri.ph',
    address: '8 Sabang Coastal Highway',
    city: 'Danao City',
    tinOrIdNumber: 'TIN: 118-902-334-000',
    primaryReference: 'SSS No: 06-1928401-7',
    totalTransactions: 2,
    activeTransactions: 1,
    createdAt: '2026-08-15',
    notes: 'Claimant in Danao City. Filing SSS Funeral Claim for deceased parent.'
  },
  {
    id: 'client_14',
    fullName: 'Karen Joy Mendoza',
    contactNumber: '+63 920 318 4901',
    email: 'karen.mendoza@bpi.com.ph',
    address: '102 Poblacion I, Carcar Heritage District',
    city: 'Carcar City',
    tinOrIdNumber: 'TIN: 290-481-670-000',
    primaryReference: 'SSS No: 06-4491820-2',
    totalTransactions: 1,
    activeTransactions: 0,
    createdAt: '2026-08-25',
    notes: 'Bank employee in Carcar. Processed Sickness Benefit following surgery.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // 1. OVERDUE PENSION LOAN - Case study target for demo flow
  {
    id: 'TXN-2026-0914',
    clientId: 'client_5',
    clientName: 'Roberto "Bert" Gonzales',
    clientPhone: '+63 915 628 3941',
    serviceType: 'pension_loan',
    serviceName: 'Pension Loan',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'In Progress',
    priority: 'Urgent',
    createdAt: '2026-09-18',
    targetDate: '2026-09-24', // Past due
    referenceNumber: 'SSS No: 06-1182904-8',
    sssDetails: {
      sssNumber: '06-1182904-8',
      crnOrUmid: '0033-4918204-1',
      memberType: 'Pensioner',
      disbursementBank: 'LandBank Tabunok',
      bankAccountNumber: '0981-2291-04'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 200,
      addOns: [
        { id: 'addon_bank_cert', name: 'Disbursement Bank Account Certification', amount: 100 }
      ],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'Retiree Pensioner SSS ID / UMID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-19' },
      { id: 'c2', name: '2 Valid IDs with 3 Specimen Signatures', required: true, submitted: true, verified: true, verifiedAt: '2026-09-19' },
      { id: 'c3', name: 'Active SSS Pension ATM / Passbook (DAEM-Validated)', required: true, submitted: true, verified: false, notes: 'Awaiting SSS Cebu branch verification of DAEM bank account link' },
      { id: 'c4', name: 'Recent 3-Month Pension Payment History Slip', required: true, submitted: true, verified: true, verifiedAt: '2026-09-20' }
    ],
    internalNotes: 'Target date missed due to SSS DAEM module sync delay between SSS Cebu City (Osmeña Blvd) and LandBank Tabunok branch. Ed Ramos scheduled for in-person branch verification this morning.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-18 09:30', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Client requested Pension Loan application assistance.' },
      { id: 'a2', timestamp: '2026-09-18 10:15', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Assigned Staff', details: 'Assigned to Eduardo "Ed" Ramos (SSS Cebu City Branch liaison).' },
      { id: 'a3', timestamp: '2026-09-19 14:20', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Verified Documents', details: 'Verified retiree ID and pension history.' },
      { id: 'a4', timestamp: '2026-09-22 11:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Status Update', details: 'Changed status to In Progress. Awaiting DAEM bank account validation.' },
      { id: 'a5', timestamp: '2026-09-25 08:30', userName: 'System Alert', userRole: 'System', action: 'Deadline Flagged', details: 'Transaction exceeded target date of September 24, 2026.' }
    ]
  },

  // 2. OVERDUE LOAN CONDONATION - Waiting on Client
  {
    id: 'TXN-2026-0911',
    clientId: 'client_4',
    clientName: 'Carmela Reyes-Aquino',
    clientPhone: '+63 927 381 0422',
    serviceType: 'loan_condonation',
    serviceName: 'Loan Condonation',
    assignedStaffId: 'staff_3',
    assignedStaffName: 'Mark Anthony Tan',
    status: 'Waiting on Client',
    priority: 'Rush',
    createdAt: '2026-09-15',
    targetDate: '2026-09-26', // Past due
    referenceNumber: 'SSS No: 06-4418290-3',
    sssDetails: {
      sssNumber: '06-4418290-3',
      memberType: 'Voluntary',
      disbursementBank: 'UnionBank Cebu',
      bankAccountNumber: '1098-4491-88'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 200,
      addOns: [
        { id: 'addon_soa_print', name: 'Member Loan SOA Audit & Computation', amount: 50 },
        { id: 'addon_notary_undertaking', name: 'Affidavit / Undertaking Notarization', amount: 150 }
      ],
      discount: 0,
      totalAmount: 400
    },
    checklist: [
      { id: 'c1', name: 'SSS Digitized ID / UMID Card', required: true, submitted: true, verified: true, verifiedAt: '2026-09-16' },
      { id: 'c2', name: 'My.SSS Online Portal Credentials', required: true, submitted: true, verified: true, verifiedAt: '2026-09-16' },
      { id: 'c3', name: 'Member Loan Statement of Account (SOA)', required: true, submitted: true, verified: true, verifiedAt: '2026-09-16' },
      { id: 'c4', name: 'Signed Condonation Promissory Undertaking', required: true, submitted: false, verified: false, notes: 'Awaiting client signature on Page 2 and notarization' }
    ],
    internalNotes: 'Client in Talisay contacted on Sept 22 and 26. Client has not yet signed the consolidated loan restructuring agreement.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-15 11:00', userName: 'Rochelle Dizon', userRole: 'Member Accounts Specialist', action: 'Created Transaction', details: 'Client submitted condonation documents.' },
      { id: 'a2', timestamp: '2026-09-16 09:30', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Document Audit', details: 'SOA computed; outstanding principal separated from waived penalties.' },
      { id: 'a3', timestamp: '2026-09-21 16:45', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Status Update', details: 'Moved to Waiting on Client for signed promissory undertaking.' }
    ]
  },

  // 3. OVERDUE EMERGENCY LOAN - Requirements Pending
  {
    id: 'TXN-2026-0908',
    clientId: 'client_7',
    clientName: 'Danilo Macapagal',
    clientPhone: '+63 922 419 0284',
    serviceType: 'emergency_loan',
    serviceName: 'Emergency Loan',
    assignedStaffId: 'staff_4',
    assignedStaffName: 'Rochelle Dizon',
    status: 'Requirements Pending',
    priority: 'Normal',
    createdAt: '2026-09-12',
    targetDate: '2026-09-27', // Past due
    referenceNumber: 'SSS No: 06-2819034-2',
    sssDetails: {
      sssNumber: '06-2819034-2',
      memberType: 'Self-Employed'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 100,
      addOns: [],
      discount: 0,
      totalAmount: 100
    },
    checklist: [
      { id: 'c1', name: 'Barangay Certificate of Calamity Residency', required: true, submitted: false, verified: false, notes: 'Client requested extension to get barangay seal in Consolacion' },
      { id: 'c2', name: 'My.SSS Online Portal Credentials', required: true, submitted: true, verified: true, verifiedAt: '2026-09-13' },
      { id: 'c3', name: 'Valid Government-issued ID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-13' },
      { id: 'c4', name: 'Enrolled DAEM Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-13' }
    ],
    internalNotes: 'Danilo in Consolacion has not yet submitted his official Barangay Calamity Certificate. SMS reminder sent today.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-12 14:00', userName: 'Rochelle Dizon', userRole: 'Member Accounts Specialist', action: 'Created Transaction', details: 'Emergency loan application intake.' }
    ]
  },

  // 4. OVERDUE UNEMPLOYMENT CLAIM - Waiting on SSS
  {
    id: 'TXN-2026-0905',
    clientId: 'client_11',
    clientName: 'Ricardo Valenzuela',
    clientPhone: '+63 928 901 3412',
    serviceType: 'unemployment_claim',
    serviceName: 'Unemployment Claim',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Waiting on SSS',
    priority: 'Normal',
    createdAt: '2026-09-10',
    targetDate: '2026-09-25', // Past due
    referenceNumber: 'SSS No: 06-3918204-0',
    sssDetails: {
      sssNumber: '06-3918204-0',
      memberType: 'Employed',
      employerName: 'Carmen Copper Corp',
      disbursementBank: 'GCash',
      bankAccountNumber: '+63 928 901 3412'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 50,
      discountReason: 'Referral discount',
      totalAmount: 250
    },
    checklist: [
      { id: 'c1', name: 'DOLE Certificate of Involuntary Separation', required: true, submitted: true, verified: true, verifiedAt: '2026-09-11' },
      { id: 'c2', name: 'Notice of Termination from Employer', required: true, submitted: true, verified: true, verifiedAt: '2026-09-11' },
      { id: 'c3', name: '2 Valid Government IDs', required: true, submitted: true, verified: true, verifiedAt: '2026-09-11' },
      { id: 'c4', name: 'Enrolled DAEM GCash Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-11' }
    ],
    internalNotes: 'Endorsed to SSS Toledo Branch claims department. Waiting for SSS branch supervisor approval and automated PESONet payout trigger.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-10 10:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Unemployment benefit intake.' },
      { id: 'a2', timestamp: '2026-09-16 15:30', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Status Update', details: 'DOLE cert certified. Status changed to Waiting on SSS.' }
    ]
  },

  // 5. READY FOR PROCESSING - Salary Loan
  {
    id: 'TXN-2026-0920',
    clientId: 'client_1',
    clientName: 'Maria Lourdes Santos',
    clientPhone: '+63 917 842 1904',
    serviceType: 'salary_loan',
    serviceName: 'Salary Loan',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Ready for Processing',
    priority: 'Rush',
    createdAt: '2026-09-28',
    targetDate: '2026-10-02',
    referenceNumber: 'SSS No: 06-3829104-5',
    sssDetails: {
      sssNumber: '06-3829104-5',
      memberType: 'Employed',
      employerName: 'Santos Logistics Cebu',
      disbursementBank: 'UnionBank',
      bankAccountNumber: '1092-8812-40'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 100,
      addOns: [
        { id: 'addon_daem_check', name: 'DAEM Disbursement Account Verification', amount: 50 }
      ],
      discount: 0,
      totalAmount: 150
    },
    checklist: [
      { id: 'c1', name: 'My.SSS Member Portal Credentials', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c2', name: '36 Posted Monthly Contributions Verification', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c3', name: 'Employer Certification on Portal', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' },
      { id: 'c4', name: 'Active Enrolled DAEM Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' }
    ],
    internalNotes: 'All 4 requirements validated. Employer approved request on employer portal. Scheduled for submission batch today.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-28 10:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Salary loan request for 2-month entitlement.' },
      { id: 'a2', timestamp: '2026-09-29 17:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Status Update', details: 'Status moved to Ready for Processing.' }
    ]
  },

  // 6. IN PROGRESS - PRN Generation
  {
    id: 'TXN-2026-0922',
    clientId: 'client_6',
    clientName: 'Dr. Patricia Nicole Lim',
    clientPhone: '+63 917 339 8812',
    serviceType: 'prn_generation',
    serviceName: 'PRN',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Gina Bautista',
    status: 'In Progress',
    priority: 'Normal',
    createdAt: '2026-09-28',
    targetDate: '2026-10-01',
    referenceNumber: 'SSS No: 06-5591024-7',
    sssDetails: {
      sssNumber: '06-5591024-7',
      memberType: 'Self-Employed'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 30,
      addOns: [],
      discount: 0,
      totalAmount: 30
    },
    checklist: [
      { id: 'c1', name: 'SSS Number & Name Confirmation', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c2', name: 'Applicable Contribution Quarter Breakdown', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' }
    ],
    internalNotes: 'Generating PRN for Q3/Q4 voluntary contributions for physician member in Cebu City.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-28 11:30', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'PRN generation intake.' }
    ]
  },

  // 7. IN PROGRESS - Reset Email & Contribution Print
  {
    id: 'TXN-2026-0925',
    clientId: 'client_3',
    clientName: 'Engr. Ferdinand Cruz',
    clientPhone: '+63 918 732 5591',
    serviceType: 'reset_email_contribution',
    serviceName: 'Reset / New Email / Print Contribution',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'In Progress',
    priority: 'Normal',
    createdAt: '2026-09-27',
    targetDate: '2026-10-04',
    referenceNumber: 'CRN: 0033-9182741-9',
    sssDetails: {
      sssNumber: '06-2918401-9',
      crnOrUmid: '0033-9182741-9',
      memberType: 'Employed'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 50,
      addOns: [
        { id: 'addon_color_print', name: 'Certified Colored SSS Contribution Printout', amount: 30 }
      ],
      discount: 0,
      totalAmount: 80
    },
    checklist: [
      { id: 'c1', name: 'Valid Primary ID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-27' },
      { id: 'c2', name: 'New Personal Gmail Address', required: true, submitted: true, verified: true, verifiedAt: '2026-09-27' },
      { id: 'c3', name: 'Member Selfie with ID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' }
    ],
    internalNotes: 'Email reset request submitted to SSS Cebu City e-center. Awaiting temporary password link dispatch.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-27 09:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Created Transaction', details: 'Account recovery ticket opened.' }
    ]
  },

  // 8. WAITING ON SSS - DAEM Enrollment
  {
    id: 'TXN-2026-0926',
    clientId: 'client_2',
    clientName: 'Juan Miguel Dela Cruz',
    clientPhone: '+63 920 914 8320',
    serviceType: 'daem_enrollment',
    serviceName: 'DAEM Enrollment',
    assignedStaffId: 'staff_3',
    assignedStaffName: 'Mark Anthony Tan',
    status: 'Waiting on SSS',
    priority: 'Rush',
    createdAt: '2026-09-28',
    targetDate: '2026-10-01',
    referenceNumber: 'SSS No: 06-1920482-1',
    sssDetails: {
      sssNumber: '06-1920482-1',
      memberType: 'Self-Employed',
      disbursementBank: 'UnionBank Mandaue',
      bankAccountNumber: '1098-3391-20'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 150,
      addOns: [],
      discount: 0,
      totalAmount: 150
    },
    checklist: [
      { id: 'c1', name: 'My.SSS Member Portal Credentials', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c2', name: 'Bank Passbook / Card Screenshot', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c3', name: 'Valid Government ID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c4', name: 'Selfie holding ID and Bank Card', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' }
    ],
    internalNotes: 'DAEM enrollment submitted online for UnionBank account. SSS Mandaue reviewing documents for PESONet activation.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-28 08:30', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Created Transaction', details: 'DAEM enrollment intake.' },
      { id: 'a2', timestamp: '2026-09-29 11:30', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Portal Submission', details: 'Uploaded proof of account. Waiting on SSS approval.' }
    ]
  },

  // 9. REQUIREMENTS PENDING - E1 Registration
  {
    id: 'TXN-2026-0928',
    clientId: 'client_12',
    clientName: 'Grace Ann Manalo',
    clientPhone: '+63 916 448 9102',
    serviceType: 'e1_registration',
    serviceName: 'E1 Registration',
    assignedStaffId: 'staff_4',
    assignedStaffName: 'Rochelle Dizon',
    status: 'Requirements Pending',
    priority: 'Normal',
    createdAt: '2026-09-29',
    targetDate: '2026-10-06',
    referenceNumber: 'Ref: E1-NAGA-2026',
    pricing: {
      governmentFee: 0,
      serviceFee: 200,
      addOns: [
        { id: 'addon_laminated_card', name: 'Laminated SS Number Card Slip', amount: 50 }
      ],
      discount: 0,
      totalAmount: 250
    },
    checklist: [
      { id: 'c1', name: 'PSA Birth Certificate (Clear Copy)', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' },
      { id: 'c2', name: 'Valid Primary ID', required: true, submitted: false, verified: false, notes: 'Client waiting for printed National ID (PhilID) from barangay' },
      { id: 'c3', name: 'Active Personal Email Address', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' }
    ],
    internalNotes: 'First-time worker in Naga City. Awaiting secondary or primary ID to complete E-1 application.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-29 10:15', userName: 'Rochelle Dizon', userRole: 'Member Accounts Specialist', action: 'Created Transaction', details: 'E-1 registration intake.' }
    ]
  },

  // 10. NEW - Maternity Notification (Mat 1)
  {
    id: 'TXN-2026-0930',
    clientId: 'client_8',
    clientName: 'Jasmine Rose Soriano',
    clientPhone: '+63 926 771 9043',
    serviceType: 'maternity_notification',
    serviceName: 'Maternity Notification (Mat 1)',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Gina Bautista',
    status: 'New',
    priority: 'Normal',
    createdAt: '2026-09-30',
    targetDate: '2026-10-05',
    referenceNumber: 'SSS No: 06-7281940-6',
    sssDetails: {
      sssNumber: '06-7281940-6',
      memberType: 'Employed',
      employerName: 'Design Studio Cebu'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 50,
      addOns: [],
      discount: 0,
      totalAmount: 50
    },
    checklist: [
      { id: 'c1', name: 'Ultrasound Report confirming EDD', required: true, submitted: false, verified: false },
      { id: 'c2', name: 'Medical Certificate from OB-GYN', required: true, submitted: false, verified: false },
      { id: 'c3', name: 'My.SSS Portal Credentials', required: true, submitted: false, verified: false }
    ],
    internalNotes: 'Inquiry received via phone. Client will submit ultrasound scan from Cebu Doctors Hospital today.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-30 08:45', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Mat-1 notification record created.' }
    ]
  },

  // 11. COMPLETED TODAY - Maternity Claim (Mat 2)
  {
    id: 'TXN-2026-0919',
    clientId: 'client_10',
    clientName: 'Beatriz "Bea" Aquino',
    clientPhone: '+63 917 602 1845',
    serviceType: 'maternity_claim',
    serviceName: 'Maternity Claim (Mat 2)',
    assignedStaffId: 'staff_3',
    assignedStaffName: 'Mark Anthony Tan',
    status: 'Completed',
    priority: 'Rush',
    createdAt: '2026-09-26',
    targetDate: '2026-09-30',
    completedDate: '2026-09-30',
    referenceNumber: 'SSS No: 06-6910482-4',
    sssDetails: {
      sssNumber: '06-6910482-4',
      memberType: 'Employed',
      employerName: 'Fintech Solutions',
      disbursementBank: 'Maya',
      bankAccountNumber: '+63 917 602 1845'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [
        { id: 'addon_expedited_audit', name: 'Priority Document Review & Verification', amount: 100 }
      ],
      discount: 0,
      totalAmount: 400
    },
    checklist: [
      { id: 'c1', name: 'PSA Child Birth Certificate', required: true, submitted: true, verified: true, verifiedAt: '2026-09-26' },
      { id: 'c2', name: 'Operating Room Record (CS Delivery)', required: true, submitted: true, verified: true, verifiedAt: '2026-09-26' },
      { id: 'c3', name: 'Approved Mat-1 Acknowledgment Slip', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c4', name: 'Enrolled DAEM Maya Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' }
    ],
    internalNotes: 'Maternity benefit of ₱70,000 successfully approved by SSS Cebu. Disbursement confirmed credited to client\'s enrolled Maya account.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-26 10:00', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Created Transaction', details: 'Mat-2 claim filed.' },
      { id: 'a2', timestamp: '2026-09-30 11:15', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Status Update', details: 'Benefit payout credited. Completed.' }
    ]
  },

  // 12. COMPLETED TODAY - Sickness Claim
  {
    id: 'TXN-2026-0917',
    clientId: 'client_14',
    clientName: 'Karen Joy Mendoza',
    clientPhone: '+63 920 318 4901',
    serviceType: 'sickness_claim',
    serviceName: 'Sickness Claim',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Completed',
    priority: 'Normal',
    createdAt: '2026-09-22',
    targetDate: '2026-09-30',
    completedDate: '2026-09-30',
    referenceNumber: 'SSS No: 06-4491820-2',
    sssDetails: {
      sssNumber: '06-4491820-2',
      memberType: 'Employed',
      employerName: 'BPI Carcar',
      disbursementBank: 'BPI',
      bankAccountNumber: '3819-2049-11'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'SSS Sickness Benefit Application (CLD-9N)', required: true, submitted: true, verified: true, verifiedAt: '2026-09-22' },
      { id: 'c2', name: 'Medical Certificate with Clinical Abstract', required: true, submitted: true, verified: true, verifiedAt: '2026-09-22' },
      { id: 'c3', name: 'Diagnostic Test Results', required: true, submitted: true, verified: true, verifiedAt: '2026-09-25' },
      { id: 'c4', name: 'Approved Leave of Absence Certification', required: true, submitted: true, verified: true, verifiedAt: '2026-09-25' }
    ],
    internalNotes: 'Sickness claim approved by SSS medical doctor. 14 days sickness allowance granted.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-22 14:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Created Transaction', details: 'Sickness claim filed.' },
      { id: 'a2', timestamp: '2026-09-30 10:45', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Status Update', details: 'SSS approved. Completed.' }
    ]
  },

  // 13. COMPLETED YESTERDAY - Retirement Claim
  {
    id: 'TXN-2026-0915',
    clientId: 'client_9',
    clientName: 'Antonio "Tony" Villanueva',
    clientPhone: '+63 919 220 5418',
    serviceType: 'retirement_claim',
    serviceName: 'Retirement Claim',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Gina Bautista',
    status: 'Completed',
    priority: 'Normal',
    createdAt: '2026-09-24',
    targetDate: '2026-09-29',
    completedDate: '2026-09-29',
    referenceNumber: 'SSS No: 06-0049281-9',
    sssDetails: {
      sssNumber: '06-0049281-9',
      crnOrUmid: '0033-1092834-0',
      memberType: 'Pensioner',
      disbursementBank: 'LandBank Danao',
      bankAccountNumber: '0981-4412-90'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 50,
      discountReason: 'Senior citizen concession',
      totalAmount: 250
    },
    checklist: [
      { id: 'c1', name: 'Retirement Claim Application (Form DDR-1)', required: true, submitted: true, verified: true },
      { id: 'c2', name: 'Member SSS / UMID ID', required: true, submitted: true, verified: true },
      { id: 'c3', name: 'Enrolled DAEM LandBank Pension Passbook', required: true, submitted: true, verified: true }
    ],
    internalNotes: 'Monthly pension approved at SSS Danao Branch. First pension disbursement scheduled on next payroll run.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-24 09:30', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Retirement claim filed.' },
      { id: 'a2', timestamp: '2026-09-29 16:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Status Update', details: 'Pension confirmed. Completed.' }
    ]
  },

  // 14. READY FOR PROCESSING - Funeral Claim
  {
    id: 'TXN-2026-0929',
    clientId: 'client_13',
    clientName: 'Rolando P. Dizon',
    clientPhone: '+63 917 502 8841',
    serviceType: 'funeral_claim',
    serviceName: 'Funeral Claim',
    assignedStaffId: 'staff_3',
    assignedStaffName: 'Mark Anthony Tan',
    status: 'Ready for Processing',
    priority: 'Normal',
    createdAt: '2026-09-29',
    targetDate: '2026-10-03',
    referenceNumber: 'Deceased SS: 06-1928401-7',
    sssDetails: {
      sssNumber: '06-1928401-7',
      memberType: 'Pensioner',
      disbursementBank: 'BDO Danao',
      bankAccountNumber: '0019-2049-11'
    },
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'PSA Death Certificate of SSS Member', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' },
      { id: 'c2', name: 'Official Receipt of Funeral / Burial Expenses', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' },
      { id: 'c3', name: 'Claimant Valid Government ID', required: true, submitted: true, verified: true, verifiedAt: '2026-09-30' },
      { id: 'c4', name: 'Claimant DAEM Enrolled Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' }
    ],
    internalNotes: 'Official funeral receipt verified in claimant name. Ready for SSS Danao claims intake counter.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-29 11:00', userName: 'Mark Anthony Tan', userRole: 'Field Processor', action: 'Created Transaction', details: 'Funeral claim intake.' }
    ]
  },

  // 15. CANCELLED - ATM Requirements
  {
    id: 'TXN-2026-0902',
    clientId: 'client_9',
    clientName: 'Antonio "Tony" Villanueva',
    clientPhone: '+63 919 220 5418',
    serviceType: 'atm_requirements',
    serviceName: 'ATM Requirements',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Cancelled',
    priority: 'Normal',
    createdAt: '2026-09-08',
    targetDate: '2026-09-18',
    referenceNumber: 'SSS No: 06-0049281-9',
    pricing: {
      governmentFee: 0,
      serviceFee: 100,
      addOns: [],
      discount: 0,
      totalAmount: 100
    },
    checklist: [
      { id: 'c1', name: 'Letter of Introduction (LOI)', required: true, submitted: false, verified: false }
    ],
    internalNotes: 'Client opted to use an existing active LandBank debit card instead of requesting a new SSS LOI. Cancelled with zero fee.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-08 10:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Initial ATM request.' },
      { id: 'a2', timestamp: '2026-09-10 14:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Status Update', details: 'Cancelled per client request.' }
    ]
  },

  // 16. COMPLETED LAST WEEK - Web Registration
  {
    id: 'TXN-2026-0901',
    clientId: 'client_1',
    clientName: 'Maria Lourdes Santos',
    clientPhone: '+63 917 842 1904',
    serviceType: 'web_registration',
    serviceName: 'Web Registration',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Completed',
    priority: 'Normal',
    createdAt: '2026-09-05',
    targetDate: '2026-09-10',
    completedDate: '2026-09-10',
    referenceNumber: 'SSS No: 06-3829104-5',
    pricing: {
      governmentFee: 0,
      serviceFee: 150,
      addOns: [],
      discount: 0,
      totalAmount: 150
    },
    checklist: [
      { id: 'c1', name: 'Valid SSS Number', required: true, submitted: true, verified: true },
      { id: 'c2', name: 'Active Personal Email Address', required: true, submitted: true, verified: true }
    ],
    internalNotes: 'My.SSS account successfully activated with 2-factor authentication.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-05 09:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Created Transaction', details: 'Web portal registration.' },
      { id: 'a2', timestamp: '2026-09-10 15:30', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Status Update', details: 'Activation complete.' }
    ]
  },

  // 17. COMPLETED LAST WEEK - My SSS ID
  {
    id: 'TXN-2026-0898',
    clientId: 'client_3',
    clientName: 'Engr. Ferdinand Cruz',
    clientPhone: '+63 918 732 5591',
    serviceType: 'my_sss_id',
    serviceName: 'My SSS ID',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'Completed',
    priority: 'Normal',
    createdAt: '2026-09-02',
    targetDate: '2026-09-07',
    completedDate: '2026-09-06',
    referenceNumber: 'CRN: 0033-9182741-9',
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'PSA Birth Certificate & Valid ID', required: true, submitted: true, verified: true },
      { id: 'c2', name: 'Biometric Appointment Slip', required: true, submitted: true, verified: true }
    ],
    internalNotes: 'UMID / My.SSS digital ID appointment scheduled and biometrics recorded at SSS Lapu-Lapu Branch.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-02 10:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Created Transaction', details: 'ID appointment booked.' },
      { id: 'a2', timestamp: '2026-09-06 14:00', userName: 'Eduardo "Ed" Ramos', userRole: 'Senior Field Liaison', action: 'Status Update', details: 'Biometrics confirmed. Completed.' }
    ]
  },

  // 18. NEW - Reset / New Email
  {
    id: 'TXN-2026-0931',
    clientId: 'client_5',
    clientName: 'Roberto "Bert" Gonzales',
    clientPhone: '+63 915 628 3941',
    serviceType: 'reset_email_contribution',
    serviceName: 'Reset / New Email / Print Contribution',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Gina Bautista',
    status: 'New',
    priority: 'Normal',
    createdAt: '2026-09-30',
    targetDate: '2026-10-07',
    referenceNumber: 'SSS No: 06-1182904-8',
    pricing: {
      governmentFee: 0,
      serviceFee: 50,
      addOns: [],
      discount: 0,
      totalAmount: 50
    },
    checklist: [
      { id: 'c1', name: 'Registered Name & SSS Number', required: true, submitted: false, verified: false },
      { id: 'c2', name: 'Valid Government ID', required: true, submitted: false, verified: false }
    ],
    internalNotes: 'Bert in Minglanilla requested email update on his My.SSS profile.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-30 09:15', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Email reset request logged.' }
    ]
  },

  // 19. REQUIREMENTS PENDING - Disability Claim
  {
    id: 'TXN-2026-0927',
    clientId: 'client_11',
    clientName: 'Ricardo Valenzuela',
    clientPhone: '+63 928 901 3412',
    serviceType: 'disability_claim',
    serviceName: 'Disability Claim',
    assignedStaffId: 'staff_4',
    assignedStaffName: 'Rochelle Dizon',
    status: 'Requirements Pending',
    priority: 'Normal',
    createdAt: '2026-09-29',
    targetDate: '2026-10-08',
    referenceNumber: 'SSS No: 06-3918204-0',
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'SSS Disability Claim Application Form', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' },
      { id: 'c2', name: 'Clinical Abstract & Attending Physician Findings', required: true, submitted: false, verified: false, notes: 'Awaiting orthopedic specialist diagnostic signature in Toledo' }
    ],
    internalNotes: 'Doctor in Toledo Hospital scheduled to complete medical report on Friday.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-29 15:45', userName: 'Rochelle Dizon', userRole: 'Member Accounts Specialist', action: 'Created Transaction', details: 'Disability claim intake.' }
    ]
  },

  // 20. READY FOR PROCESSING - Death Claim
  {
    id: 'TXN-2026-0924',
    clientId: 'client_2',
    clientName: 'Juan Miguel Dela Cruz',
    clientPhone: '+63 920 914 8320',
    serviceType: 'death_claim',
    serviceName: 'Death Claim',
    assignedStaffId: 'staff_2',
    assignedStaffName: 'Gina Bautista',
    status: 'Ready for Processing',
    priority: 'Rush',
    createdAt: '2026-09-28',
    targetDate: '2026-10-02',
    referenceNumber: 'Deceased SS: 06-0941829-5',
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'PSA Certified Death Certificate', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c2', name: 'PSA Marriage Certificate of Beneficiary', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' },
      { id: 'c3', name: 'Enrolled DAEM Account', required: true, submitted: true, verified: true, verifiedAt: '2026-09-29' }
    ],
    internalNotes: 'All primary beneficiary documents certified. Scheduled for submission at SSS Mandaue Branch.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-28 14:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Death benefit claim filed.' },
      { id: 'a2', timestamp: '2026-09-29 17:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Status Update', details: 'Moved to Ready for Processing.' }
    ]
  },

  // 21. IN PROGRESS - ATM Requirements
  {
    id: 'TXN-2026-0921',
    clientId: 'client_12',
    clientName: 'Grace Ann Manalo',
    clientPhone: '+63 916 448 9102',
    serviceType: 'atm_requirements',
    serviceName: 'ATM Requirements',
    assignedStaffId: 'staff_4',
    assignedStaffName: 'Rochelle Dizon',
    status: 'In Progress',
    priority: 'Normal',
    createdAt: '2026-09-27',
    targetDate: '2026-10-04',
    referenceNumber: 'SSS No: 06-8819024-1',
    pricing: {
      governmentFee: 0,
      serviceFee: 100,
      addOns: [],
      discount: 0,
      totalAmount: 100
    },
    checklist: [
      { id: 'c1', name: 'SSS Confirmation Letter', required: true, submitted: true, verified: true, verifiedAt: '2026-09-27' },
      { id: 'c2', name: '2 Valid IDs and 2x2 Photos', required: true, submitted: true, verified: true, verifiedAt: '2026-09-27' },
      { id: 'c3', name: 'Proof of Billing', required: true, submitted: true, verified: true, verifiedAt: '2026-09-28' }
    ],
    internalNotes: 'Letter of Introduction (LOI) prepared for UnionBank Naga / Talisay branch.',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-27 10:30', userName: 'Rochelle Dizon', userRole: 'Member Accounts Specialist', action: 'Created Transaction', details: 'ATM LOI intake.' }
    ]
  },

  // 22. NEW - My SSS ID
  {
    id: 'TXN-2026-0932',
    clientId: 'client_7',
    clientName: 'Danilo Macapagal',
    clientPhone: '+63 922 419 0284',
    serviceType: 'my_sss_id',
    serviceName: 'My SSS ID',
    assignedStaffId: 'staff_1',
    assignedStaffName: 'Eduardo "Ed" Ramos',
    status: 'New',
    priority: 'Normal',
    createdAt: '2026-09-30',
    targetDate: '2026-10-06',
    referenceNumber: 'SSS No: 06-2819034-2',
    pricing: {
      governmentFee: 0,
      serviceFee: 300,
      addOns: [],
      discount: 0,
      totalAmount: 300
    },
    checklist: [
      { id: 'c1', name: 'PSA Birth Certificate', required: true, submitted: false, verified: false },
      { id: 'c2', name: 'Valid Primary ID', required: true, submitted: false, verified: false }
    ],
    internalNotes: 'Danilo inquiring to schedule UMID biometrics at SSS Cebu - NRA Branch (Galleria).',
    activityTimeline: [
      { id: 'a1', timestamp: '2026-09-30 08:00', userName: 'Gina Bautista', userRole: 'Operations Supervisor', action: 'Created Transaction', details: 'Initial record created.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'overdue',
    title: 'Overdue Transaction: TXN-2026-0914',
    message: 'Pension Loan application for Roberto Gonzales in Minglanilla missed target date (Sept 24). Awaiting DAEM bank account validation at SSS Cebu City.',
    timestamp: '2026-09-30 08:15',
    read: false,
    transactionId: 'TXN-2026-0914',
    priority: 'urgent'
  },
  {
    id: 'notif_2',
    type: 'overdue',
    title: 'Overdue Transaction: TXN-2026-0911',
    message: 'Loan Condonation for Carmela Reyes in Talisay is pending signed promissory undertaking from member.',
    timestamp: '2026-09-30 07:30',
    read: false,
    transactionId: 'TXN-2026-0911',
    priority: 'urgent'
  },
  {
    id: 'notif_3',
    type: 'requirement',
    title: 'Missing Document: TXN-2026-0908',
    message: 'Danilo Macapagal in Consolacion has not yet submitted Barangay Calamity Certificate for Emergency Loan.',
    timestamp: '2026-09-29 16:45',
    read: false,
    transactionId: 'TXN-2026-0908',
    priority: 'high'
  },
  {
    id: 'notif_4',
    type: 'target_date',
    title: 'Upcoming Target: TXN-2026-0922',
    message: 'Dr. Patricia Lim PRN Generation reaches target date tomorrow (Oct 1).',
    timestamp: '2026-09-29 14:00',
    read: true,
    transactionId: 'TXN-2026-0922',
    priority: 'normal'
  },
  {
    id: 'notif_5',
    type: 'assignment',
    title: 'Staff Workload Alert: Eduardo Ramos',
    message: 'Eduardo "Ed" Ramos currently has 7 active SSS cases across SSS Cebu City & Toledo. 2 are overdue.',
    timestamp: '2026-09-29 11:20',
    read: true,
    priority: 'high'
  },
  {
    id: 'notif_6',
    type: 'completion',
    title: 'Transaction Completed: TXN-2026-0919',
    message: 'Beatriz Aquino\'s Maternity Claim (Mat 2) approved by SSS and payout credited to Maya account.',
    timestamp: '2026-09-30 11:15',
    read: false,
    transactionId: 'TXN-2026-0919',
    priority: 'normal'
  },
  {
    id: 'notif_7',
    type: 'price',
    title: 'SSS Liaison Pricing Guide Synced',
    message: 'Service fees updated to standardized SSS liaison catalog (₱30 PRN to ₱300 Claims & ID).',
    timestamp: '2026-09-28 09:00',
    read: true,
    priority: 'normal'
  },
  {
    id: 'notif_8',
    type: 'completion',
    title: 'Transaction Completed: TXN-2026-0917',
    message: 'Karen Joy Mendoza Sickness Claim finalized and approved by SSS Carcar liaison.',
    timestamp: '2026-09-30 10:45',
    read: false,
    transactionId: 'TXN-2026-0917',
    priority: 'normal'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_1',
    timestamp: '2026-09-30 11:15',
    userName: 'Mark Anthony Tan',
    userRole: 'Field Processor',
    action: 'Status Change: Completed',
    transactionId: 'TXN-2026-0919',
    transactionRef: 'SSS No: 06-6910482-4',
    details: 'Marked Maternity Claim (Mat 2) as Completed. Benefit credited via DAEM Maya.'
  },
  {
    id: 'log_2',
    timestamp: '2026-09-30 10:45',
    userName: 'Eduardo "Ed" Ramos',
    userRole: 'Senior Field Liaison',
    action: 'Status Change: Completed',
    transactionId: 'TXN-2026-0917',
    transactionRef: 'SSS No: 06-4491820-2',
    details: 'Sickness Claim approved by SSS medical evaluator.'
  },
  {
    id: 'log_3',
    timestamp: '2026-09-30 09:15',
    userName: 'Gina Bautista',
    userRole: 'Operations Supervisor',
    action: 'Created Transaction',
    transactionId: 'TXN-2026-0931',
    transactionRef: 'SSS No: 06-1182904-8',
    details: 'New email reset booked for Roberto Gonzales in Minglanilla.'
  },
  {
    id: 'log_4',
    timestamp: '2026-09-30 08:45',
    userName: 'Gina Bautista',
    userRole: 'Operations Supervisor',
    action: 'Created Transaction',
    transactionId: 'TXN-2026-0930',
    transactionRef: 'SSS No: 06-7281940-6',
    details: 'New Maternity Notification (Mat 1) created for Jasmine Soriano at Cebu IT Park.'
  },
  {
    id: 'log_5',
    timestamp: '2026-09-29 17:00',
    userName: 'Gina Bautista',
    userRole: 'Operations Supervisor',
    action: 'Status Change: Ready for Processing',
    transactionId: 'TXN-2026-0920',
    transactionRef: 'SSS No: 06-3829104-5',
    details: 'All requirements verified. Ready for SSS salary loan submission.'
  },
  {
    id: 'log_6',
    timestamp: '2026-09-29 16:30',
    userName: 'Rochelle Dizon',
    userRole: 'Member Accounts Specialist',
    action: 'Checklist Verification',
    transactionId: 'TXN-2026-0920',
    transactionRef: 'SSS No: 06-3829104-5',
    details: 'Verified employer portal certification and DAEM bank active status.'
  },
  {
    id: 'log_7',
    timestamp: '2026-09-29 15:00',
    userName: 'Eduardo "Ed" Ramos',
    userRole: 'Senior Field Liaison',
    action: 'Document Upload / Verification',
    transactionId: 'TXN-2026-0925',
    transactionRef: 'CRN: 0033-9182741-9',
    details: 'Verified member selfie and ID for portal email reset.'
  },
  {
    id: 'log_8',
    timestamp: '2026-09-29 11:30',
    userName: 'Mark Anthony Tan',
    userRole: 'Field Processor',
    action: 'Status Change: Waiting on SSS',
    transactionId: 'TXN-2026-0926',
    transactionRef: 'SSS No: 06-1920482-1',
    details: 'DAEM enrollment submitted. Waiting for SSS Mandaue PESONet verification.'
  },
  {
    id: 'log_9',
    timestamp: '2026-09-28 16:00',
    userName: 'Gina Bautista',
    userRole: 'Operations Supervisor',
    action: 'Internal Note Added',
    transactionId: 'TXN-2026-0914',
    transactionRef: 'SSS No: 06-1182904-8',
    details: 'Logged DAEM LandBank account sync delay on SSS pension loan system.'
  },
  {
    id: 'log_10',
    timestamp: '2026-09-28 14:00',
    userName: 'Atty. Rafael Mendoza',
    userRole: 'Owner / Admin',
    action: 'Pricing Rule Updated',
    details: 'Configured standard SSS service pricing catalog.'
  }
];
