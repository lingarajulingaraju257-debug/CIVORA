import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  RolePermissions,
  ROLE_PERMISSIONS,
  Project,
  ProjectStage,
  Milestone,
  SiteMedia,
  FeedbackItem,
  ChangeRequest,
  Worker,
  MaterialItem,
  Quotation,
  ConstructionDrawing,
  SiteInspection,
  DefectItem,
  QualityCubeTest,
  InternalDiscussion,
  SupportedLanguage,
  ConstructionReport,
  InteriorItem,
  PaymentRecord,
} from '../types';
import {
  DEFAULT_USERS,
  INITIAL_PROJECTS,
  INITIAL_MILESTONES,
  INITIAL_SITE_MEDIA,
  INITIAL_FEEDBACK,
  INITIAL_CHANGE_REQUESTS,
  INITIAL_WORKERS,
  INITIAL_MATERIALS,
  INITIAL_QUOTATIONS,
  INITIAL_DRAWINGS,
  INITIAL_INSPECTIONS,
  INITIAL_DEFECTS,
  INITIAL_CUBE_TESTS,
  INITIAL_INTERNAL_DISCUSSIONS,
  INITIAL_REPORTS,
  INITIAL_INTERIORS,
  INITIAL_PAYMENTS,
} from '../data/mockData';

interface CivoraContextType {
  currentUser: User | null;
  currentRole: UserRole;
  permissions: RolePermissions;
  isLoggedIn: boolean;
  activeProject: Project;
  allProjects: Project[];
  activeProjectId: string;
  milestones: Milestone[];
  media: SiteMedia[];
  feedback: FeedbackItem[];
  changeRequests: ChangeRequest[];
  workers: Worker[];
  materials: MaterialItem[];
  quotations: Quotation[];
  drawings: ConstructionDrawing[];
  inspections: SiteInspection[];
  defects: DefectItem[];
  cubeTests: QualityCubeTest[];
  discussions: InternalDiscussion[];
  reports: ConstructionReport[];
  interiors: InteriorItem[];
  payments: PaymentRecord[];
  selectedLanguage: SupportedLanguage;
  isVoiceAssistantOpen: boolean;
  isPrivateDiscussionOpen: boolean;
  selectedPreviewImage: { url: string; title: string; subtitle?: string } | null;
  selectedReportPreview: ConstructionReport | null;

  // Actions
  loginAsRole: (role: UserRole) => void;
  loginCustom: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setActiveProjectId: (id: string) => void;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  setIsPrivateDiscussionOpen: (open: boolean) => void;
  openImagePreview: (item: { url: string; title: string; subtitle?: string }) => void;
  closeImagePreview: () => void;
  setSelectedReportPreview: (report: ConstructionReport | null) => void;

  // Project Management Mutations
  addProject: (proj: Omit<Project, 'id' | 'code'>) => void;
  updateProjectProgress: (projectId: string, progress: number, currentStage: string) => void;
  updateProjectStage: (projectId: string, stageId: string, progress: number, status: ProjectStage['status']) => void;
  assignProjectTeam: (
    projectId: string,
    contractorId?: string,
    contractorName?: string,
    engineerId?: string,
    engineerName?: string,
    assignedWorkerIds?: string[]
  ) => void;

  // Photo & Progress Tracking
  addSiteMedia: (item: Omit<SiteMedia, 'id'>) => void;
  togglePhotoApproval: (mediaId: string) => void;

  // Feedback & Change Requests
  addFeedback: (item: { category: FeedbackItem['category']; rating: number; message: string }) => void;
  resolveFeedback: (id: string, resolutionNotes: string) => void;
  addChangeRequest: (req: { title: string; description: string; area: string; estimatedCost: number }) => void;
  updateChangeRequestStatus: (id: string, status: ChangeRequest['status'], engineeringNotes?: string) => void;

  // Workforce & Labour
  toggleWorkerAttendance: (workerId: string) => void;
  addWorker: (worker: Omit<Worker, 'id'>) => void;

  // Advanced Materials & Inventory
  updateMaterialStock: (materialId: string, quantity: number) => void;
  recordMaterialShipment: (materialId: string, quantity: number, supplier?: string) => void;
  consumeMaterial: (materialId: string, quantity: number) => void;
  addMaterial: (material: Omit<MaterialItem, 'id'>) => void;
  recordMaterialInward: (
    materialId: string,
    quantity: number,
    supplier?: string,
    referenceNo?: string,
    notes?: string
  ) => void;
  recordMaterialConsumption: (
    materialId: string,
    quantity: number,
    referenceNo?: string,
    notes?: string
  ) => void;
  recordMaterialWastage: (
    materialId: string,
    quantity: number,
    reason?: string,
    notes?: string
  ) => void;

  // BOQ & Quotations
  createQuotation: (quote: Omit<Quotation, 'id' | 'quotationNumber' | 'date'>) => void;
  updateQuotation: (quotation: Quotation) => void;

  // Furniture & Interior Management
  addInteriorItem: (item: Omit<InteriorItem, 'id'>) => void;
  updateInteriorStatus: (id: string, installationStatus: InteriorItem['installationStatus']) => void;
  approveInteriorItem: (id: string, status: InteriorItem['customerApprovalStatus'], notes?: string) => void;

  // Customer Payment Management
  recordCustomerPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => void;

  // Quality & Inspections
  addSiteInspection: (insp: Omit<SiteInspection, 'id' | 'inspectionNumber' | 'date'>) => void;
  addDefect: (defect: Omit<DefectItem, 'id' | 'ticketNumber' | 'reportedDate' | 'status'>) => void;
  updateDefectStatus: (defectId: string, status: DefectItem['status']) => void;

  // Reports & Document Templates
  generateReport: (report: Omit<ConstructionReport, 'id' | 'date' | 'generatedBy' | 'role'>) => void;
  generateTaxInvoiceDocument: (quotation: Quotation) => void;
  generateMaterialStatementDocument: () => void;
  generatePaymentReceiptDocument: (payment: PaymentRecord) => void;

  // Communications & Financials
  addInternalDiscussion: (message: string, priority?: InternalDiscussion['priority']) => void;
  payMilestone: (milestoneId: string) => void;
  resetAllData: () => void;
}

const CivoraContext = createContext<CivoraContextType | undefined>(undefined);

export const CivoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or mock data
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('civora_logged_in') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('civora_role');
    return (saved as UserRole) || 'CUSTOMER';
  });

  const permissions = ROLE_PERMISSIONS[currentRole] || ROLE_PERMISSIONS.CUSTOMER;

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('civora_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USERS[currentRole] || DEFAULT_USERS.CUSTOMER;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return localStorage.getItem('civora_active_proj') || 'proj_azure_01';
  });

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('civora_lang') as SupportedLanguage) || 'English';
  });

  // Domain states
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('civora_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('civora_milestones');
    return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
  });

  const [media, setMedia] = useState<SiteMedia[]>(() => {
    const saved = localStorage.getItem('civora_media');
    return saved ? JSON.parse(saved) : INITIAL_SITE_MEDIA;
  });

  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('civora_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(() => {
    const saved = localStorage.getItem('civora_change_requests');
    return saved ? JSON.parse(saved) : INITIAL_CHANGE_REQUESTS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('civora_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem('civora_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('civora_quotations');
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [drawings] = useState<ConstructionDrawing[]>(() => {
    return INITIAL_DRAWINGS;
  });

  const [inspections, setInspections] = useState<SiteInspection[]>(() => {
    const saved = localStorage.getItem('civora_inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [defects, setDefects] = useState<DefectItem[]>(() => {
    const saved = localStorage.getItem('civora_defects');
    return saved ? JSON.parse(saved) : INITIAL_DEFECTS;
  });

  const [cubeTests] = useState<QualityCubeTest[]>(() => {
    return INITIAL_CUBE_TESTS;
  });

  const [discussions, setDiscussions] = useState<InternalDiscussion[]>(() => {
    const saved = localStorage.getItem('civora_discussions');
    return saved ? JSON.parse(saved) : INITIAL_INTERNAL_DISCUSSIONS;
  });

  const [reports, setReports] = useState<ConstructionReport[]>(() => {
    const saved = localStorage.getItem('civora_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [interiors, setInteriors] = useState<InteriorItem[]>(() => {
    const saved = localStorage.getItem('civora_interiors');
    return saved ? JSON.parse(saved) : INITIAL_INTERIORS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('civora_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // UI Modals
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isPrivateDiscussionOpen, setIsPrivateDiscussionOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [selectedReportPreview, setSelectedReportPreview] = useState<ConstructionReport | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('civora_logged_in', String(isLoggedIn));
    localStorage.setItem('civora_role', currentRole);
    if (currentUser) {
      localStorage.setItem('civora_user', JSON.stringify(currentUser));
    }
    localStorage.setItem('civora_active_proj', activeProjectId);
    localStorage.setItem('civora_lang', selectedLanguage);
  }, [isLoggedIn, currentRole, currentUser, activeProjectId, selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('civora_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('civora_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('civora_interiors', JSON.stringify(interiors));
  }, [interiors]);

  useEffect(() => {
    localStorage.setItem('civora_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('civora_feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('civora_change_requests', JSON.stringify(changeRequests));
  }, [changeRequests]);

  useEffect(() => {
    localStorage.setItem('civora_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('civora_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('civora_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('civora_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('civora_defects', JSON.stringify(defects));
  }, [defects]);

  useEffect(() => {
    localStorage.setItem('civora_media', JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem('civora_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('civora_milestones', JSON.stringify(milestones));
  }, [milestones]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const loginAsRole = (role: UserRole) => {
    const user = DEFAULT_USERS[role];
    setCurrentRole(role);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const loginCustom = (user: User) => {
    setCurrentRole(user.role);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(DEFAULT_USERS[role]);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const openImagePreview = (item: { url: string; title: string; subtitle?: string }) => {
    setSelectedPreviewImage(item);
  };

  const closeImagePreview = () => {
    setSelectedPreviewImage(null);
  };

  // Project Management Actions
  const addProject = (proj: Omit<Project, 'id' | 'code'>) => {
    const code = `CVR-${proj.name.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}`;
    const newProj: Project = {
      ...proj,
      id: `proj_${Date.now()}`,
      code,
      stages: [
        { id: `stg_${Date.now()}_1`, name: 'Substructure & Foundation', progressPercentage: 10, status: 'In Progress', targetDate: '2026-12-31' },
        { id: `stg_${Date.now()}_2`, name: 'RCC Superstructure Frame', progressPercentage: 0, status: 'Upcoming', targetDate: '2027-06-30' },
        { id: `stg_${Date.now()}_3`, name: 'Masonry, Plaster & MEP', progressPercentage: 0, status: 'Upcoming', targetDate: '2027-12-31' },
        { id: `stg_${Date.now()}_4`, name: 'Finishes & Handover', progressPercentage: 0, status: 'Upcoming', targetDate: '2028-06-30' },
      ],
    };
    setProjects((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  };

  const updateProjectProgress = (projectId: string, progress: number, currentStage: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              overallProgress: Math.min(100, Math.max(0, progress)),
              currentStage: currentStage || p.currentStage,
            }
          : p
      )
    );
  };

  const updateProjectStage = (projectId: string, stageId: string, progress: number, status: ProjectStage['status']) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId || !p.stages) return p;
        const updatedStages = p.stages.map((stg) =>
          stg.id === stageId
            ? {
                ...stg,
                progressPercentage: Math.min(100, Math.max(0, progress)),
                status,
                completedDate: progress === 100 ? new Date().toISOString().split('T')[0] : stg.completedDate,
              }
            : stg
        );
        const avg = Math.round(
          updatedStages.reduce((acc, s) => acc + s.progressPercentage, 0) / updatedStages.length
        );
        return {
          ...p,
          stages: updatedStages,
          overallProgress: avg,
        };
      })
    );
  };

  const assignProjectTeam = (
    projectId: string,
    contractorId?: string,
    contractorName?: string,
    engineerId?: string,
    engineerName?: string,
    assignedWorkerIds?: string[]
  ) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              contractorId: contractorId !== undefined ? contractorId : p.contractorId,
              contractorName: contractorName !== undefined ? contractorName : p.contractorName,
              engineerId: engineerId !== undefined ? engineerId : p.engineerId,
              engineerName: engineerName !== undefined ? engineerName : p.engineerName,
              assignedWorkerIds: assignedWorkerIds !== undefined ? assignedWorkerIds : p.assignedWorkerIds,
            }
          : p
      )
    );
  };

  // Photo & Progress Tracking
  const addSiteMedia = (item: Omit<SiteMedia, 'id'>) => {
    const newMedia: SiteMedia = {
      ...item,
      id: `med_${Date.now()}`,
    };
    setMedia((prev) => [newMedia, ...prev]);
  };

  const togglePhotoApproval = (mediaId: string) => {
    setMedia((prev) =>
      prev.map((m) =>
        m.id === mediaId ? { ...m, approvedForCustomer: !m.approvedForCustomer } : m
      )
    );
  };

  // Feedback & Change Requests
  const addFeedback = ({ category, rating, message }: { category: FeedbackItem['category']; rating: number; message: string }) => {
    const newItem: FeedbackItem = {
      id: `fb_${Date.now()}`,
      projectId: activeProjectId,
      customerName: currentUser?.name || 'Valued Customer',
      unitNumber: currentUser?.unitNumber || 'Tower A - Unit 14B',
      category,
      rating,
      message,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Received',
    };
    setFeedback((prev) => [newItem, ...prev]);
  };

  const resolveFeedback = (id: string, resolutionNotes: string) => {
    setFeedback((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: 'Resolved', resolutionNotes } : f
      )
    );
  };

  const addChangeRequest = (req: { title: string; description: string; area: string; estimatedCost: number }) => {
    const newReq: ChangeRequest = {
      id: `cr_${Date.now()}`,
      projectId: activeProjectId,
      customerName: currentUser?.name || 'Customer',
      unitNumber: currentUser?.unitNumber || 'Unit 14B',
      title: req.title,
      description: req.description,
      area: req.area,
      requestedDate: new Date().toISOString().split('T')[0],
      estimatedCost: req.estimatedCost,
      scheduleImpactDays: 2,
      status: 'Under Review',
      engineeringNotes: 'Request queued for structural and MEP clearance.',
    };
    setChangeRequests((prev) => [newReq, ...prev]);
  };

  const updateChangeRequestStatus = (id: string, status: ChangeRequest['status'], engineeringNotes?: string) => {
    setChangeRequests((prev) =>
      prev.map((cr) =>
        cr.id === id
          ? {
              ...cr,
              status,
              engineeringNotes: engineeringNotes || cr.engineeringNotes,
            }
          : cr
      )
    );
  };

  // Workforce Actions
  const toggleWorkerAttendance = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, presentToday: !w.presentToday } : w))
    );
  };

  const addWorker = (worker: Omit<Worker, 'id'>) => {
    const newWorker: Worker = {
      ...worker,
      id: `wrk_${Date.now()}`,
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  // Material Actions
  const updateMaterialStock = (materialId: string, quantity: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              currentStock: Math.max(0, m.currentStock + quantity),
              lastDeliveryDate: quantity > 0 ? new Date().toISOString().split('T')[0] : m.lastDeliveryDate,
            }
          : m
      )
    );
  };

  const recordMaterialShipment = (materialId: string, quantity: number, supplier?: string) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              currentStock: m.currentStock + quantity,
              lastDeliveryDate: new Date().toISOString().split('T')[0],
              supplier: supplier || m.supplier,
            }
          : m
      )
    );
  };

  const consumeMaterial = (materialId: string, quantity: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? {
              ...m,
              currentStock: Math.max(0, m.currentStock - quantity),
            }
          : m
      )
    );
  };

  const addMaterial = (material: Omit<MaterialItem, 'id'>) => {
    const newMaterial: MaterialItem = {
      ...material,
      id: `mat_${Date.now()}`,
    };
    setMaterials((prev) => [...prev, newMaterial]);
  };

  const recordMaterialInward = (
    materialId: string,
    quantity: number,
    supplier?: string,
    referenceNo?: string,
    notes?: string
  ) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== materialId) return m;
        const newTrans = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          materialId,
          type: 'INWARD' as const,
          quantity,
          date: new Date().toISOString().split('T')[0],
          referenceNo: referenceNo || `DC-INW-${Date.now().toString().slice(-4)}`,
          notes: notes || 'Site Inward Delivery',
          recordedBy: currentUser?.name || 'Store Supervisor',
        };
        const totalInward = (m.totalInward || 0) + quantity;
        const currentStock = m.currentStock + quantity;
        return {
          ...m,
          totalInward,
          currentStock,
          lastDeliveryDate: new Date().toISOString().split('T')[0],
          supplier: supplier || m.supplier,
          transactions: [newTrans, ...(m.transactions || [])],
        };
      })
    );
  };

  const recordMaterialConsumption = (
    materialId: string,
    quantity: number,
    referenceNo?: string,
    notes?: string
  ) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== materialId) return m;
        const newTrans = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          materialId,
          type: 'CONSUMPTION' as const,
          quantity,
          date: new Date().toISOString().split('T')[0],
          referenceNo: referenceNo || `ISSUE-${Date.now().toString().slice(-4)}`,
          notes: notes || 'Issued to active floor casting',
          recordedBy: currentUser?.name || 'Site Foreman',
        };
        const totalConsumed = (m.totalConsumed || 0) + quantity;
        const currentStock = Math.max(0, m.currentStock - quantity);
        return {
          ...m,
          totalConsumed,
          currentStock,
          transactions: [newTrans, ...(m.transactions || [])],
        };
      })
    );
  };

  const recordMaterialWastage = (
    materialId: string,
    quantity: number,
    reason?: string,
    notes?: string
  ) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== materialId) return m;
        const newTrans = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          materialId,
          type: 'WASTAGE' as const,
          quantity,
          date: new Date().toISOString().split('T')[0],
          referenceNo: `WST-${Date.now().toString().slice(-4)}`,
          notes: notes || reason || 'Bar end trimming & transit scrap',
          recordedBy: currentUser?.name || 'QA Materials Inspector',
        };
        const totalWastage = (m.totalWastage || 0) + quantity;
        const currentStock = Math.max(0, m.currentStock - quantity);
        return {
          ...m,
          totalWastage,
          currentStock,
          transactions: [newTrans, ...(m.transactions || [])],
        };
      })
    );
  };

  // BOQ & Quotations
  const createQuotation = (quote: Omit<Quotation, 'id' | 'quotationNumber' | 'date'>) => {
    const newQuotation: Quotation = {
      ...quote,
      id: `quot_${Date.now()}`,
      quotationNumber: `QT-APEX-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQuotation, ...prev]);
  };

  const updateQuotation = (quotation: Quotation) => {
    setQuotations((prev) => prev.map((q) => (q.id === quotation.id ? quotation : q)));
  };

  // Furniture & Interior Management
  const addInteriorItem = (item: Omit<InteriorItem, 'id'>) => {
    const newItem: InteriorItem = {
      ...item,
      id: `int_${Date.now()}`,
    };
    setInteriors((prev) => [newItem, ...prev]);
  };

  const updateInteriorStatus = (id: string, installationStatus: InteriorItem['installationStatus']) => {
    setInteriors((prev) =>
      prev.map((it) => (it.id === id ? { ...it, installationStatus } : it))
    );
  };

  const approveInteriorItem = (id: string, status: InteriorItem['customerApprovalStatus'], notes?: string) => {
    setInteriors((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              customerApprovalStatus: status,
              customerNotes: notes || it.customerNotes,
              approvalDate: status === 'Approved by Customer' ? new Date().toISOString().split('T')[0] : it.approvalDate,
            }
          : it
      )
    );
  };

  // Customer Payment Management
  const recordCustomerPayment = (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>) => {
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay_${Date.now()}`,
      receiptNumber,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // If payment is linked to a milestone, mark it as Paid
    if (payment.milestoneId) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === payment.milestoneId
            ? {
                ...m,
                paymentStatus: 'Paid',
                paidDate: payment.paymentDate,
                invoiceNumber: receiptNumber,
              }
            : m
        )
      );
    }
  };

  // Inspections & Defects
  const addSiteInspection = (insp: Omit<SiteInspection, 'id' | 'inspectionNumber' | 'date'>) => {
    const newInsp: SiteInspection = {
      ...insp,
      id: `insp_${Date.now()}`,
      inspectionNumber: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setInspections((prev) => [newInsp, ...prev]);
  };

  const addDefect = (defect: Omit<DefectItem, 'id' | 'ticketNumber' | 'reportedDate' | 'status'>) => {
    const newDefect: DefectItem = {
      ...defect,
      id: `def_${Date.now()}`,
      ticketNumber: `NCR-CVR-2026-${Math.floor(100 + Math.random() * 900)}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
    };
    setDefects((prev) => [newDefect, ...prev]);
  };

  const updateDefectStatus = (defectId: string, status: DefectItem['status']) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === defectId ? { ...d, status } : d))
    );
  };

  // Reports & Document Templates
  const generateReport = (report: Omit<ConstructionReport, 'id' | 'date' | 'generatedBy' | 'role'>) => {
    const newReport: ConstructionReport = {
      ...report,
      id: `rep_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      generatedBy: currentUser?.name || 'Authorized Lead',
      role: currentRole,
    };
    setReports((prev) => [newReport, ...prev]);
    setSelectedReportPreview(newReport);
  };

  const generateTaxInvoiceDocument = (quotation: Quotation) => {
    const newReport: ConstructionReport = {
      id: `inv_${Date.now()}`,
      reportType: 'TAX_INVOICE',
      title: `Tax Invoice - ${quotation.quotationNumber} (${quotation.projectTitle})`,
      projectId: quotation.projectId,
      projectName: activeProject.name,
      date: new Date().toISOString().split('T')[0],
      generatedBy: currentUser?.name || 'Finance & Accounts',
      role: currentRole,
      summary: `Commercial Works Contract Tax Invoice issued for ${quotation.projectTitle}. Direct works subtotal: ₹${quotation.subtotal.toLocaleString('en-IN')}. Overhead (${quotation.overheadRate || 6}%): ₹${(quotation.overheadAmount || 0).toLocaleString('en-IN')}. Contractor Profit Margin (${quotation.profitRate || 15}%): ₹${(quotation.profitAmount || 0).toLocaleString('en-IN')}. Net Contractor Amount: ₹${(quotation.netContractorAmount || quotation.subtotal).toLocaleString('en-IN')}. GST (${quotation.taxRate}% - ${quotation.gstTreatment || 'Standard Works'}): ₹${quotation.taxAmount.toLocaleString('en-IN')}. Total Customer Payable: ₹${quotation.total.toLocaleString('en-IN')}.`,
      metadata: {
        invoiceNumber: quotation.quotationNumber.replace('QT-', 'INV-'),
        clientName: quotation.clientName,
        subtotal: quotation.subtotal,
        overheadAmount: quotation.overheadAmount || 0,
        profitAmount: quotation.profitAmount || 0,
        netContractorAmount: quotation.netContractorAmount || quotation.subtotal,
        gstTreatment: quotation.gstTreatment,
        taxRate: quotation.taxRate,
        taxAmount: quotation.taxAmount,
        totalPayable: quotation.total,
        items: quotation.items,
        paymentTerms: 'Payment due within 15 days of invoice date via RTGS/NEFT.',
      },
    };
    setReports((prev) => [newReport, ...prev]);
    setSelectedReportPreview(newReport);
  };

  const generateMaterialStatementDocument = () => {
    const activeMaterials = materials.filter((m) => m.projectId === activeProjectId);
    const totalValuation = activeMaterials.reduce((acc, m) => acc + m.currentStock * m.purchaseRate, 0);
    const newReport: ConstructionReport = {
      id: `mat_stmt_${Date.now()}`,
      reportType: 'MATERIAL_STATEMENT',
      title: `Reconciled Material Stock Statement - ${activeProject.name}`,
      projectId: activeProject.id,
      projectName: activeProject.name,
      date: new Date().toISOString().split('T')[0],
      generatedBy: currentUser?.name || 'Chief Materials Controller',
      role: currentRole,
      summary: `Consolidated materials audit and stock balance reconciliation report for ${activeProject.name}. Tracks inward deliveries, site consumption, and scrap wastage across 14 material classes. Total closing inventory valuation: ₹${totalValuation.toLocaleString('en-IN')}.`,
      metadata: {
        totalSKUs: activeMaterials.length,
        closingValuationINR: totalValuation,
        auditStatus: 'Physical Verification & Stock Reconciliation Cleared',
      },
    };
    setReports((prev) => [newReport, ...prev]);
    setSelectedReportPreview(newReport);
  };

  const generatePaymentReceiptDocument = (payment: PaymentRecord) => {
    const newReport: ConstructionReport = {
      id: `rcpt_doc_${Date.now()}`,
      reportType: 'PAYMENT_RECEIPT',
      title: `Official Payment Voucher Receipt - ${payment.receiptNumber}`,
      projectId: payment.projectId,
      projectName: activeProject.name,
      date: payment.paymentDate,
      generatedBy: currentUser?.name || 'Civora Treasury Operations',
      role: currentRole,
      summary: `Official receipt of ₹${payment.amount.toLocaleString('en-IN')} received from ${payment.customerName} (${payment.unitNumber}) towards ${payment.paymentType}. Instrument Reference: ${payment.transactionRef} (${payment.paymentMethod}).`,
      metadata: {
        receiptNumber: payment.receiptNumber,
        customerName: payment.customerName,
        unitNumber: payment.unitNumber,
        paymentType: payment.paymentType,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        transactionRef: payment.transactionRef,
        status: payment.status,
        notes: payment.notes || 'Verified against bank ledger credit.',
      },
    };
    setReports((prev) => [newReport, ...prev]);
    setSelectedReportPreview(newReport);
  };

  // Communications & Financials
  const addInternalDiscussion = (message: string, priority: InternalDiscussion['priority'] = 'Routine') => {
    if (currentRole === 'CUSTOMER') return; // Customers cannot post in internal engineering discussions
    const newDiscussion: InternalDiscussion = {
      id: `disc_${Date.now()}`,
      projectId: activeProjectId,
      authorRole: currentRole as 'CONTRACTOR' | 'ENGINEER' | 'BUILDER',
      authorName: currentUser?.name || 'Site Professional',
      authorTitle: currentUser?.organization || 'Civora Engineering Unit',
      message,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      priority,
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
  };

  const payMilestone = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              paymentStatus: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
              invoiceNumber: m.invoiceNumber || `INV-CVR-2026-${Math.floor(100 + Math.random() * 900)}`,
            }
          : m
      )
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setProjects(INITIAL_PROJECTS);
    setMilestones(INITIAL_MILESTONES);
    setMedia(INITIAL_SITE_MEDIA);
    setFeedback(INITIAL_FEEDBACK);
    setChangeRequests(INITIAL_CHANGE_REQUESTS);
    setWorkers(INITIAL_WORKERS);
    setMaterials(INITIAL_MATERIALS);
    setQuotations(INITIAL_QUOTATIONS);
    setInspections(INITIAL_INSPECTIONS);
    setDefects(INITIAL_DEFECTS);
    setDiscussions(INITIAL_INTERNAL_DISCUSSIONS);
    setReports(INITIAL_REPORTS);
    setInteriors(INITIAL_INTERIORS);
    setPayments(INITIAL_PAYMENTS);
    setCurrentRole('CUSTOMER');
    setCurrentUser(DEFAULT_USERS.CUSTOMER);
  };

  return (
    <CivoraContext.Provider
      value={{
        currentUser,
        currentRole,
        permissions,
        isLoggedIn,
        activeProject,
        allProjects: projects,
        activeProjectId,
        milestones: milestones.filter((m) => m.projectId === activeProjectId),
        media: media.filter((m) => m.projectId === activeProjectId),
        feedback: feedback.filter((f) => f.projectId === activeProjectId),
        changeRequests: changeRequests.filter((cr) => cr.projectId === activeProjectId),
        workers,
        materials: materials.filter((mat) => mat.projectId === activeProjectId),
        quotations: quotations.filter((q) => q.projectId === activeProjectId),
        drawings,
        inspections: inspections.filter((i) => i.projectId === activeProjectId),
        defects: defects.filter((d) => d.projectId === activeProjectId),
        cubeTests,
        discussions: discussions.filter((disc) => disc.projectId === activeProjectId),
        reports: reports.filter((r) => r.projectId === activeProjectId || r.projectId === 'all'),
        interiors: interiors.filter((it) => it.projectId === activeProjectId),
        payments: payments.filter((p) => p.projectId === activeProjectId),
        selectedLanguage,
        isVoiceAssistantOpen,
        isPrivateDiscussionOpen,
        selectedPreviewImage,
        selectedReportPreview,
        loginAsRole,
        loginCustom,
        logout,
        switchRole,
        setActiveProjectId,
        setSelectedLanguage,
        setIsVoiceAssistantOpen,
        setIsPrivateDiscussionOpen,
        openImagePreview,
        closeImagePreview,
        setSelectedReportPreview,
        addProject,
        updateProjectProgress,
        updateProjectStage,
        assignProjectTeam,
        addSiteMedia,
        togglePhotoApproval,
        addFeedback,
        resolveFeedback,
        addChangeRequest,
        updateChangeRequestStatus,
        toggleWorkerAttendance,
        addWorker,
        updateMaterialStock,
        recordMaterialShipment,
        consumeMaterial,
        addMaterial,
        recordMaterialInward,
        recordMaterialConsumption,
        recordMaterialWastage,
        createQuotation,
        updateQuotation,
        addInteriorItem,
        updateInteriorStatus,
        approveInteriorItem,
        recordCustomerPayment,
        addSiteInspection,
        addDefect,
        updateDefectStatus,
        generateReport,
        generateTaxInvoiceDocument,
        generateMaterialStatementDocument,
        generatePaymentReceiptDocument,
        addInternalDiscussion,
        payMilestone,
        resetAllData,
      }}
    >
      {children}
    </CivoraContext.Provider>
  );
};

export const useCivora = () => {
  const context = useContext(CivoraContext);
  if (!context) {
    throw new Error('useCivora must be used within a CivoraProvider');
  }
  return context;
};
