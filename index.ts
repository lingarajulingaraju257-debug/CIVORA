export type UserRole = 'CUSTOMER' | 'CONTRACTOR' | 'ENGINEER' | 'BUILDER';

export interface RolePermissions {
  canApprovePhotos: boolean;
  canViewInternalIssues: boolean;
  canManageDrawings: boolean;
  canCreateQuotation: boolean;
  canLogInspections: boolean;
  canLogDefects: boolean;
  canManageProjects: boolean;
  canManageTeams: boolean;
  canManageBudgets: boolean;
  canSubmitFeedback: boolean;
  canRequestDesignChanges: boolean;
  canReviewDesignChanges: boolean;
  canGenerateReports: boolean;
  canManageInteriors: boolean;
  canApproveInteriors: boolean;
  canManagePayments: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  organization: string;
  avatar?: string;
  unitNumber?: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  progressPercentage: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  targetDate: string;
  completedDate?: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  tagline: string;
  clientName: string;
  location: string;
  type: 'High-Rise Residential' | 'Commercial Tech Park' | 'Masterplanned Township' | 'Luxury Villas';
  totalAreaSqFt: number;
  budgetTotal: number;
  budgetSpent: number;
  startDate: string;
  targetCompletionDate: string;
  overallProgress: number; // 0 to 100
  currentStage: string;
  heroImage: string;
  status: 'In Progress' | 'On Schedule' | 'Ahead of Schedule' | 'Critical Milestone';
  stages?: ProjectStage[];
  contractorId?: string;
  contractorName?: string;
  engineerId?: string;
  engineerName?: string;
  assignedWorkerIds?: string[];
  advancePaid?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  stageName: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  progressPercentage: number;
  paymentAmount: number;
  paymentStatus: 'Paid' | 'Due' | 'Upcoming';
  invoiceNumber?: string;
  paidDate?: string;
  approvalStatus: 'Certified' | 'Inspected - Passed' | 'Under Work';
}

export interface SiteMedia {
  id: string;
  projectId: string;
  title: string;
  stage: string;
  date: string;
  type: 'photo' | 'video';
  url: string;
  approvedForCustomer: boolean;
  approvedBy: string;
  tags: string[];
  description: string;
}

export interface FeedbackItem {
  id: string;
  projectId: string;
  customerName: string;
  unitNumber: string;
  category: 'Finishes' | 'Plumbing/Electrical' | 'Timeline' | 'Site Visit' | 'Design Query';
  rating: number; // 1 - 5
  message: string;
  timestamp: string;
  status: 'Received' | 'In Review' | 'Resolved';
  resolutionNotes?: string;
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  customerName: string;
  unitNumber: string;
  title: string;
  description: string;
  area: string;
  requestedDate: string;
  estimatedCost: number;
  scheduleImpactDays: number;
  status: 'Under Review' | 'Approved' | 'In Progress' | 'Rejected';
  engineeringNotes?: string;
}

export interface Worker {
  id: string;
  name: string;
  trade: 'Steel Fixer' | 'Mason' | 'Carpenter' | 'Welder' | 'Electrician' | 'Plumber' | 'Safety Marshal' | 'Helper';
  shift: 'Day' | 'Night';
  dailyWage: number;
  presentToday: boolean;
  safetyInductionValid: boolean;
  phone: string;
}

export type MaterialCategory =
  | 'Cement'
  | 'TMT Steel'
  | 'River Sand'
  | 'M-Sand'
  | 'Aggregates'
  | 'Red Bricks'
  | 'AAC Blocks'
  | 'Tiles & Marble'
  | 'Paint & Primer'
  | 'Electrical Materials'
  | 'Plumbing Materials'
  | 'Doors & Windows'
  | 'Hardware & Fasteners';

export interface MaterialTransaction {
  id: string;
  materialId: string;
  type: 'INWARD' | 'CONSUMPTION' | 'WASTAGE' | 'STOCK_AUDIT';
  quantity: number;
  date: string;
  referenceNo?: string;
  notes?: string;
  recordedBy: string;
}

export interface MaterialItem {
  id: string;
  projectId: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  purchaseRate: number;      // INR per unit
  currentStock: number;      // Closing stock in real-time
  openingStock: number;
  totalInward: number;
  totalConsumed: number;
  totalWastage: number;
  reorderLevel: number;
  unitCost: number;          // Backward compatibility alias for purchaseRate
  lastDeliveryDate: string;
  supplier: string;
  supplierContact?: string;
  transactions?: MaterialTransaction[];
}

export interface QuotationItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  category?: 'Structural' | 'Civil' | 'Finishes' | 'MEP' | 'Interior & Joinery';
  materialCost: number;        // Direct material cost per unit
  labourCost: number;          // Direct labor cost per unit
  equipmentCost: number;       // Direct plant & machinery cost per unit
  transportationCost: number;  // Freight & hauling cost per unit
  rate: number;                // Combined unit direct rate = material + labour + equipment + transport
  amount: number;              // Total direct cost = quantity * rate
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  projectId: string;
  clientName: string;
  projectTitle: string;
  date: string;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;            // Total direct costs
  overheadRate: number;        // Overhead percentage (e.g. 6%)
  overheadAmount: number;      // Overhead amount
  profitRate: number;          // Profit percentage (e.g. 15%)
  profitAmount: number;        // Profit amount
  netContractorAmount: number; // Subtotal + Overhead + Profit
  gstTreatment: 'Exempt / Zero Rated' | '5% (Residential RERA)' | '12% (Affordable Housing Works)' | '18% (Standard Works Contract)' | '28% (Commercial/Luxury Works)' | 'Custom %';
  taxRate: number;             // GST % (e.g. 18)
  taxAmount: number;           // GST amount
  total: number;               // Final customer payable amount
  status: 'Draft' | 'Issued' | 'Approved by Client' | 'Revised';
  notes?: string;
}

export type InteriorCategory =
  | 'Modular Kitchen'
  | 'Wardrobe'
  | 'Bedroom Furniture'
  | 'Living Room Furniture'
  | 'TV Unit'
  | 'False Ceiling'
  | 'Doors & Windows'
  | 'Custom Furniture';

export interface InteriorItem {
  id: string;
  projectId: string;
  unitNumber: string;
  title: string;
  category: InteriorCategory;
  room: string;
  dimensions: string;
  materials: string;
  designNotes: string;
  pricing: number;
  installationStatus: 'Design Phase' | 'Material Sourced' | 'Carpentry & Joinery' | 'Installed' | 'Quality Cleared';
  customerApprovalStatus: 'Pending Customer Review' | 'Approved by Customer' | 'Revision Requested';
  customerNotes?: string;
  imageUrl?: string;
  approvalDate?: string;
  targetInstallationDate: string;
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  receiptNumber: string;
  customerName: string;
  unitNumber: string;
  paymentType: 'Advance Booking Token' | 'Stage-Wise Installment' | 'Change Request Payment' | 'Interior Customization Deposit' | 'Final Handover Settlement';
  milestoneId?: string;
  amount: number;
  paymentMethod: 'NEFT / RTGS' | 'UPI / IMPS' | 'Demand Draft' | 'Cheque' | 'Corporate Wire';
  transactionRef: string;
  paymentDate: string;
  status: 'Cleared & Verified' | 'Processing Bank Settlement';
  notes?: string;
  stageOrMilestone?: string;
}

export interface ConstructionDrawing {
  id: string;
  drawingNumber: string;
  title: string;
  discipline: 'Structural' | 'Architectural' | 'MEP Services' | 'Civil/Foundation';
  revision: string;
  uploadDate: string;
  status: 'Approved for Construction (AFC)' | 'Under Review' | 'Revision Required';
  approvedBy: string;
  fileUrl: string;
  sheetSize: 'A0' | 'A1' | 'A2';
  scale: string;
}

export interface InspectionCheckItem {
  item: string;
  pass: boolean;
  remarks: string;
}

export interface SiteInspection {
  id: string;
  projectId: string;
  inspectionNumber: string;
  date: string;
  inspectorName: string;
  inspectionType: 'Pre-Pour Rebar & Shuttering' | 'Concrete Compressive Testing' | 'Masonry Line, Level & Plumb' | 'Safety Harness & Edge Protection';
  locationDetails: string;
  passed: boolean;
  itemsChecked: InspectionCheckItem[];
  photos: string[];
  digitalSignature: string;
}

export interface DefectItem {
  id: string;
  projectId: string;
  ticketNumber: string;
  title: string;
  category: 'Structural Integrity' | 'Workmanship' | 'Safety Hazard' | 'MEP Non-Conformance';
  severity: 'Critical' | 'Major' | 'Minor';
  location: string;
  reportedBy: string;
  reportedDate: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'Remediation In Progress' | 'Rectified - Pending QA' | 'Closed';
  photoUrl?: string;
  internalNotes: string;
  correctiveAction: string;
}

export interface QualityCubeTest {
  id: string;
  batchId: string;
  location: string;
  grade: 'M25' | 'M30' | 'M35' | 'M40';
  castingDate: string;
  testDate7Days: string;
  testDate28Days: string;
  targetStrengthMPa: number;
  strength7DaysMPa: number;
  strength28DaysMPa: number;
  status: 'Compliant' | 'Pending 28-Day' | 'Investigation Needed';
}

export interface InternalDiscussion {
  id: string;
  projectId: string;
  authorRole: 'CONTRACTOR' | 'ENGINEER' | 'BUILDER';
  authorName: string;
  authorTitle: string;
  message: string;
  timestamp: string;
  priority: 'Routine' | 'Urgent' | 'Action Required';
}

export type SupportedLanguage = 'English' | 'Kannada' | 'Hindi' | 'Tamil' | 'Telugu';

export interface VoiceAssistantQuery {
  id: string;
  prompt: string;
  language: SupportedLanguage;
  reply: string;
  timestamp: string;
}

export type ReportType =
  | 'DAILY_PROGRESS'
  | 'QUALITY_CUBE_TEST'
  | 'SAFETY_INSPECTION'
  | 'BOQ_ESTIMATION'
  | 'CLIENT_HANDOVER'
  | 'TAX_INVOICE'
  | 'MATERIAL_STATEMENT'
  | 'PAYMENT_RECEIPT';

export interface ConstructionReport {
  id: string;
  reportType: ReportType;
  title: string;
  projectId: string;
  projectName: string;
  date: string;
  generatedBy: string;
  role: UserRole;
  summary: string;
  metadata?: Record<string, any>;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  CUSTOMER: {
    canApprovePhotos: false,
    canViewInternalIssues: false,
    canManageDrawings: false,
    canCreateQuotation: false,
    canLogInspections: false,
    canLogDefects: false,
    canManageProjects: false,
    canManageTeams: false,
    canManageBudgets: false,
    canSubmitFeedback: true,
    canRequestDesignChanges: true,
    canReviewDesignChanges: false,
    canGenerateReports: true,
    canManageInteriors: false,
    canApproveInteriors: true,
    canManagePayments: true,
  },
  CONTRACTOR: {
    canApprovePhotos: false,
    canViewInternalIssues: true,
    canManageDrawings: false,
    canCreateQuotation: true,
    canLogInspections: false,
    canLogDefects: true,
    canManageProjects: false,
    canManageTeams: false,
    canManageBudgets: false,
    canSubmitFeedback: false,
    canRequestDesignChanges: false,
    canReviewDesignChanges: true,
    canGenerateReports: true,
    canManageInteriors: true,
    canApproveInteriors: false,
    canManagePayments: false,
  },
  ENGINEER: {
    canApprovePhotos: true,
    canViewInternalIssues: true,
    canManageDrawings: true,
    canCreateQuotation: false,
    canLogInspections: true,
    canLogDefects: true,
    canManageProjects: false,
    canManageTeams: false,
    canManageBudgets: false,
    canSubmitFeedback: false,
    canRequestDesignChanges: false,
    canReviewDesignChanges: true,
    canGenerateReports: true,
    canManageInteriors: true,
    canApproveInteriors: true,
    canManagePayments: false,
  },
  BUILDER: {
    canApprovePhotos: true,
    canViewInternalIssues: true,
    canManageDrawings: true,
    canCreateQuotation: true,
    canLogInspections: true,
    canLogDefects: true,
    canManageProjects: true,
    canManageTeams: true,
    canManageBudgets: true,
    canSubmitFeedback: false,
    canRequestDesignChanges: false,
    canReviewDesignChanges: true,
    canGenerateReports: true,
    canManageInteriors: true,
    canApproveInteriors: true,
    canManagePayments: true,
  },
};
