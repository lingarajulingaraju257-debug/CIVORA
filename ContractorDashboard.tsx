import React, { useState } from 'react';
import {
  HardHat,
  Users,
  Package,
  FileSpreadsheet,
  TrendingUp,
  Plus,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Download,
  Calendar,
  Truck,
  Layers,
  Check,
  ShieldCheck,
  Printer,
  Wrench,
  Clock,
  FileText,
  HelpCircle,
  ArrowRight,
  Filter,
  Search,
  Armchair,
  FileCheck2,
  Receipt,
  Eye,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import {
  Worker,
  MaterialItem,
  MaterialCategory,
  QuotationItem,
  Quotation,
  DefectItem,
  InteriorItem,
  InteriorCategory,
} from '../../types';

export const ContractorDashboard: React.FC = () => {
  const {
    activeProject,
    currentUser,
    workers,
    materials,
    quotations,
    defects,
    changeRequests,
    interiors,
    toggleWorkerAttendance,
    addWorker,
    updateMaterialStock,
    recordMaterialShipment,
    consumeMaterial,
    recordMaterialInward,
    recordMaterialConsumption,
    recordMaterialWastage,
    addMaterial,
    createQuotation,
    updateQuotation,
    addInteriorItem,
    updateInteriorStatus,
    updateDefectStatus,
    generateReport,
    generateTaxInvoiceDocument,
    generateMaterialStatementDocument,
    setSelectedReportPreview,
    setIsPrivateDiscussionOpen,
  } = useCivora();

  const [activeTab, setActiveTab] = useState<
    'workers' | 'materials' | 'issues' | 'quotations' | 'changeRequests' | 'profitability' | 'interiors'
  >('workers');

  // Add Worker Modal
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [wName, setWName] = useState('');
  const [wTrade, setWTrade] = useState<Worker['trade']>('Mason');
  const [wShift, setWShift] = useState<'Day' | 'Night'>('Day');
  const [wWage, setWWage] = useState(1200);
  const [wPhone, setWPhone] = useState('');

  // Advanced Materials Inventory State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<MaterialCategory | 'ALL'>('ALL');
  const [materialSearchQuery, setMaterialSearchQuery] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [selectedMaterialAudit, setSelectedMaterialAudit] = useState<MaterialItem | null>(null);

  // Material Inward Delivery Modal
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [inwardMatId, setInwardMatId] = useState('');
  const [inwardQty, setInwardQty] = useState(100);
  const [inwardRef, setInwardRef] = useState('');
  const [inwardSupplier, setInwardSupplier] = useState('');
  const [inwardNotes, setInwardNotes] = useState('');

  // Material Consumption Modal
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
  const [consumeMatId, setConsumeMatId] = useState('');
  const [consumeQty, setConsumeQty] = useState(25);
  const [consumeRef, setConsumeRef] = useState('');
  const [consumeNotes, setConsumeNotes] = useState('');

  // Material Wastage Modal
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);
  const [wastageMatId, setWastageMatId] = useState('');
  const [wastageQty, setWastageQty] = useState(5);
  const [wastageReason, setWastageReason] = useState('Bar cut-off trimming & scrap');
  const [wastageNotes, setWastageNotes] = useState('');

  // Add New Material SKU Modal
  const [isAddSkuOpen, setIsAddSkuOpen] = useState(false);
  const [skuName, setSkuName] = useState('');
  const [skuCategory, setSkuCategory] = useState<MaterialCategory>('Cement');
  const [skuUnit, setSkuUnit] = useState('Bags');
  const [skuRate, setSkuRate] = useState(430);
  const [skuOpening, setSkuOpening] = useState(200);
  const [skuReorder, setSkuReorder] = useState(80);
  const [skuSupplier, setSkuSupplier] = useState('UltraTech Cement Ltd');

  // Complete BOQ Quotation Builder Modal
  const [isQuoteBuilderOpen, setIsQuoteBuilderOpen] = useState(false);
  const [quoteClient, setQuoteClient] = useState('Prestige Horizon Properties Ltd');
  const [quoteTitle, setQuoteTitle] = useState(
    'Tower A - 15th to 18th Floor Superstructure Casting Package'
  );
  const [overheadPct, setOverheadPct] = useState(6);
  const [profitPct, setProfitPct] = useState(15);
  const [gstTreatment, setGstTreatment] = useState<Quotation['gstTreatment']>(
    '18% (Standard Works Contract)'
  );
  const [customTaxRate, setCustomTaxRate] = useState(18);

  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    {
      id: '1',
      description: 'Supply & pumping of Ready-Mix Concrete Grade M35 design mix',
      unit: 'm³',
      quantity: 340,
      materialCost: 3800,
      labourCost: 950,
      equipmentCost: 750,
      transportationCost: 300,
      rate: 5800,
      amount: 1972000,
      category: 'Structural',
    },
    {
      id: '2',
      description: 'Cutting, bending, binding & fixing in position of Fe550D TMT reinforcement rebars',
      unit: 'MT',
      quantity: 38,
      materialCost: 61500,
      labourCost: 9200,
      equipmentCost: 2800,
      transportationCost: 2500,
      rate: 76000,
      amount: 2888000,
      category: 'Structural',
    },
    {
      id: '3',
      description: 'Engineered film-faced shuttering formwork for columns, beams and slab soffits',
      unit: 'm²',
      quantity: 1850,
      materialCost: 320,
      labourCost: 240,
      equipmentCost: 80,
      transportationCost: 40,
      rate: 680,
      amount: 1258000,
      category: 'Civil',
    },
  ]);

  // Quotation item builder line fields
  const [itemDesc, setItemDesc] = useState('');
  const [itemCat, setItemCat] = useState<QuotationItem['category']>('Structural');
  const [itemUnit, setItemUnit] = useState('m³');
  const [itemQty, setItemQty] = useState(100);
  const [itemMatCost, setItemMatCost] = useState(300);
  const [itemLabCost, setItemLabCost] = useState(150);
  const [itemEqCost, setItemEqCost] = useState(50);
  const [itemTransCost, setItemTransCost] = useState(25);

  // Interior Management State
  const [isAddInteriorOpen, setIsAddInteriorOpen] = useState(false);
  const [intTitle, setIntTitle] = useState('');
  const [intCategory, setIntCategory] = useState<InteriorCategory>('Modular Kitchen');
  const [intRoom, setIntRoom] = useState('Main Kitchen');
  const [intDimensions, setIntDimensions] = useState("12'0\" x 10'6\" L-Shape");
  const [intMaterials, setIntMaterials] = useState('HDHMR Action TESA, Merino High Gloss Laminate, Hafele Tandem Boxes');
  const [intDesignNotes, setIntDesignNotes] = useState('Quartz island counter, soft-close hardware, chimney duct provision');
  const [intPricing, setIntPricing] = useState(385000);
  const [intTargetDate, setIntTargetDate] = useState('2027-01-30');

  // Defect status filter
  const [defectFilter, setDefectFilter] = useState<'all' | 'Open' | 'Remediation In Progress' | 'Rectified - Pending QA' | 'Closed'>('all');

  // Metrics
  const presentWorkersCount = workers.filter((w) => w.presentToday).length;
  const dailyWageTotal = workers
    .filter((w) => w.presentToday)
    .reduce((acc, w) => acc + w.dailyWage, 0);

  const materialsBelowReorder = materials.filter((m) => m.currentStock <= m.reorderLevel);

  // Filtered materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCategory = selectedCategoryFilter === 'ALL' || m.category === selectedCategoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
      m.supplier.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(materialSearchQuery.toLowerCase());
    const matchesLowStock = !lowStockOnly || m.currentStock <= m.reorderLevel;
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const projectDefects = defects.filter((d) => d.projectId === activeProject.id);
  const filteredDefects =
    defectFilter === 'all'
      ? projectDefects
      : projectDefects.filter((d) => d.status === defectFilter);

  // Profitability calculation
  const contractValue = 38500000;
  const spentMaterials = 16420000;
  const spentLabor = 8240000;
  const spentPlantMachinery = 4120000;
  const totalActualCost = spentMaterials + spentLabor + spentPlantMachinery;
  const grossProfit = contractValue - totalActualCost;
  const grossMarginPct = ((grossProfit / contractValue) * 100).toFixed(1);

  // Calculations for quotation builder
  const subtotalDirect = quoteItems.reduce((acc, item) => acc + item.amount, 0);
  const overheadAmount = Math.round((subtotalDirect * overheadPct) / 100);
  const profitAmount = Math.round(((subtotalDirect + overheadAmount) * profitPct) / 100);
  const netContractorAmount = subtotalDirect + overheadAmount + profitAmount;

  // Resolve tax rate
  let activeTaxRate = 18;
  if (gstTreatment === 'Exempt / Zero Rated') activeTaxRate = 0;
  else if (gstTreatment === '5% (Residential RERA)') activeTaxRate = 5;
  else if (gstTreatment === '12% (Affordable Housing Works)') activeTaxRate = 12;
  else if (gstTreatment === '18% (Standard Works Contract)') activeTaxRate = 18;
  else if (gstTreatment === '28% (Commercial/Luxury Works)') activeTaxRate = 28;
  else if (gstTreatment === 'Custom %') activeTaxRate = customTaxRate;

  const taxAmount = Math.round((netContractorAmount * activeTaxRate) / 100);
  const quoteTotal = netContractorAmount + taxAmount;

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wName.trim()) return;
    addWorker({
      name: wName,
      trade: wTrade,
      shift: wShift,
      dailyWage: Number(wWage),
      presentToday: true,
      safetyInductionValid: true,
      phone: wPhone || '+91 90000 00000',
    });
    setWName('');
    setWPhone('');
    setIsAddWorkerOpen(false);
  };

  const handleRecordInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inwardMatId || inwardQty <= 0) return;
    recordMaterialInward(
      inwardMatId,
      Number(inwardQty),
      inwardSupplier || undefined,
      inwardRef || undefined,
      inwardNotes || undefined
    );
    setIsDeliveryModalOpen(false);
    setInwardMatId('');
    setInwardRef('');
    setInwardNotes('');
  };

  const handleRecordConsumptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeMatId || consumeQty <= 0) return;
    recordMaterialConsumption(
      consumeMatId,
      Number(consumeQty),
      consumeRef || undefined,
      consumeNotes || undefined
    );
    setIsConsumeModalOpen(false);
    setConsumeMatId('');
    setConsumeRef('');
    setConsumeNotes('');
  };

  const handleRecordWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageMatId || wastageQty <= 0) return;
    recordMaterialWastage(
      wastageMatId,
      Number(wastageQty),
      wastageReason,
      wastageNotes || undefined
    );
    setIsWastageModalOpen(false);
    setWastageMatId('');
    setWastageNotes('');
  };

  const handleAddNewSkuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuName.trim()) return;
    addMaterial({
      projectId: activeProject.id,
      name: skuName,
      category: skuCategory,
      unit: skuUnit,
      purchaseRate: Number(skuRate),
      currentStock: Number(skuOpening),
      openingStock: Number(skuOpening),
      totalInward: 0,
      totalConsumed: 0,
      totalWastage: 0,
      reorderLevel: Number(skuReorder),
      unitCost: Number(skuRate),
      lastDeliveryDate: new Date().toISOString().split('T')[0],
      supplier: skuSupplier,
      transactions: [
        {
          id: `tx_open_${Date.now()}`,
          materialId: `mat_${Date.now()}`,
          type: 'STOCK_AUDIT',
          quantity: Number(skuOpening),
          date: new Date().toISOString().split('T')[0],
          referenceNo: 'INIT-AUDIT',
          notes: 'Initial opening stock intake',
          recordedBy: currentUser?.name || 'Chief Storekeeper',
        },
      ],
    });
    setSkuName('');
    setIsAddSkuOpen(false);
  };

  const handleAddItemToQuote = () => {
    if (!itemDesc.trim()) return;
    const combinedRate = Number(itemMatCost) + Number(itemLabCost) + Number(itemEqCost) + Number(itemTransCost);
    const itemAmount = itemQty * combinedRate;
    setQuoteItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: itemDesc,
        category: itemCat,
        unit: itemUnit,
        quantity: itemQty,
        materialCost: Number(itemMatCost),
        labourCost: Number(itemLabCost),
        equipmentCost: Number(itemEqCost),
        transportationCost: Number(itemTransCost),
        rate: combinedRate,
        amount: itemAmount,
      },
    ]);
    setItemDesc('');
    setItemQty(100);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveQuotation = () => {
    createQuotation({
      projectId: activeProject.id,
      clientName: quoteClient,
      projectTitle: quoteTitle,
      validUntil: '2026-12-31',
      items: quoteItems,
      subtotal: subtotalDirect,
      overheadRate: overheadPct,
      overheadAmount,
      profitRate: profitPct,
      profitAmount,
      netContractorAmount,
      gstTreatment,
      taxRate: activeTaxRate,
      taxAmount,
      total: quoteTotal,
      status: 'Issued',
    });
    setIsQuoteBuilderOpen(false);
  };

  const handleAddInteriorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle.trim()) return;
    addInteriorItem({
      projectId: activeProject.id,
      unitNumber: 'Tower A - Unit 14B',
      title: intTitle,
      category: intCategory,
      room: intRoom,
      dimensions: intDimensions,
      materials: intMaterials,
      designNotes: intDesignNotes,
      pricing: Number(intPricing),
      installationStatus: 'Carpentry & Joinery',
      customerApprovalStatus: 'Pending Customer Review',
      targetInstallationDate: intTargetDate,
      imageUrl: '/src/assets/images/civora_luxury_interior_1794313019373.jpg',
    });
    setIntTitle('');
    setIsAddInteriorOpen(false);
  };

  const handleGenerateDPR = () => {
    generateReport({
      projectId: activeProject.id,
      projectName: activeProject.name,
      title: `Daily Progress Report (DPR) - ${new Date().toLocaleDateString('en-IN')}`,
      reportType: 'DAILY_PROGRESS',
      summary: `Site operations ongoing at ${activeProject.name}. ${presentWorkersCount} workers on-site across ${workers.length} registered roster. Daily wage burn: ₹${dailyWageTotal.toLocaleString()}. No lost-time safety incidents recorded.`,
      metadata: {
        activeWorkers: presentWorkersCount,
        dailyWage: dailyWageTotal,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Contractor Site Command
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">
                {currentUser?.organization || 'Apex Structural Infra Pvt Ltd'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Site Operations: {activeProject.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Current Contract Stage:{' '}
              <span className="text-amber-300 font-semibold">{activeProject.currentStage}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsPrivateDiscussionOpen(true)}
              className="px-3 py-2 bg-amber-950/70 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HardHat className="w-4 h-4" />
              <span>Internal Site Memos</span>
            </button>
            <button
              onClick={handleGenerateDPR}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Generate DPR</span>
            </button>
            <button
              onClick={() => setIsQuoteBuilderOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create BOQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">On-Site Workers Today</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {presentWorkersCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {workers.length} active roster</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Daily Wage Outlay: ₹{dailyWageTotal.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Material Inventory Health</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {materials.length}
            </span>
            <span className="text-xs text-slate-400">tracked SKUs</span>
          </div>
          <div className="text-[11px] mt-1">
            {materialsBelowReorder.length > 0 ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {materialsBelowReorder.length} item(s) below reorder level
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">All stocks nominal</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Assigned Remediation NCRs</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {projectDefects.filter((d) => d.status !== 'Closed').length}
            </span>
            <span className="text-xs text-slate-400">pending resolution</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {projectDefects.filter((d) => d.severity === 'Critical').length} critical issues
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Project Gross Profit Margin</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {grossMarginPct}%
            </span>
            <span className="text-xs text-slate-400 font-mono">gross yield</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: 22.0% · Actual: +{Number(grossMarginPct) - 22}% variance
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'workers'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Workers & Muster ({workers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Materials & Inventory ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'issues'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Remediation Work Orders ({projectDefects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'quotations'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Quotations & BOQ ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('changeRequests')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'changeRequests'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Client Change Requests ({changeRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profitability')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profitability'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Job Costing & Yield</span>
        </button>

        <button
          onClick={() => setActiveTab('interiors')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'interiors'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Armchair className="w-4 h-4" />
          <span>Furniture & Joinery ({interiors.length})</span>
        </button>
      </div>

      {/* TAB 1: Workers & Attendance */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daily Labor Muster & Shift Roster</h3>
              <p className="text-xs text-slate-400">
                Toggle daily site attendance to calculate daily disbursements and enforce safety induction records
              </p>
            </div>
            <button
              onClick={() => setIsAddWorkerOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Skilled Worker</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Trade Specialization</th>
                    <th className="py-3 px-4">Shift</th>
                    <th className="py-3 px-4">Daily Wage Rate</th>
                    <th className="py-3 px-4">Safety Induction</th>
                    <th className="py-3 px-4 text-center">Today's Attendance</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{w.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{w.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                          {w.trade}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{w.shift} Shift</td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        ₹{w.dailyWage.toLocaleString()} / day
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certified
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleWorkerAttendance(w.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            w.presentToday
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 ring-2 ring-emerald-500/20'
                              : 'bg-rose-950 text-rose-300 border border-rose-800 opacity-70'
                          }`}
                        >
                          {w.presentToday ? '✓ Present' : '✕ Absent'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleWorkerAttendance(w.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                          Toggle State
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Worker Modal */}
          {isAddWorkerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">Add Skilled Site Worker</h3>
                  <button onClick={() => setIsAddWorkerOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddWorkerSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={wName}
                      onChange={(e) => setWName(e.target.value)}
                      placeholder="e.g. Gururaj Naik"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Trade / Craft</label>
                    <select
                      value={wTrade}
                      onChange={(e) => setWTrade(e.target.value as Worker['trade'])}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Steel Fixer">Steel Fixer (Bar Bender)</option>
                      <option value="Mason">Mason (Brick & Blockwork)</option>
                      <option value="Carpenter">Carpenter (Formwork Shuttering)</option>
                      <option value="Welder">Welder (Structural Fabrication)</option>
                      <option value="Electrician">Electrician (MEP Conduits)</option>
                      <option value="Plumber">Plumber (Sanitary Piping)</option>
                      <option value="Safety Marshal">Safety Marshal</option>
                      <option value="Helper">General Site Helper</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Shift</label>
                      <select
                        value={wShift}
                        onChange={(e) => setWShift(e.target.value as 'Day' | 'Night')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Day">Day Shift (08:00 - 18:00)</option>
                        <option value="Night">Night Shift (20:00 - 06:00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Daily Wage (₹)</label>
                      <input
                        type="number"
                        required
                        value={wWage}
                        onChange={(e) => setWWage(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={wPhone}
                      onChange={(e) => setWPhone(e.target.value)}
                      placeholder="+91 94400 12345"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddWorkerOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                    >
                      Enroll Worker
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Materials & Inventory */}
      {activeTab === 'materials' && (
        <div className="space-y-5">
          {/* Header Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Store & Supply Chain Control
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300">14 Construction Material Categories</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Advanced Material Inventory & Stock Reconciliation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking: Cement, TMT steel, river sand, M-sand, aggregate, bricks, blocks, tiles, paint, MEP, doors/windows & hardware.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => generateMaterialStatementDocument()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Print Reconciled Stock Statement"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Stock Stmt</span>
              </button>

              <button
                onClick={() => setIsWastageModalOpen(true)}
                className="px-3 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Log Scrap / Wastage</span>
              </button>

              <button
                onClick={() => setIsConsumeModalOpen(true)}
                className="px-3 py-2 bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Log Site Issue</span>
              </button>

              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Truck className="w-4 h-4" />
                <span>Inward Consignment</span>
              </button>

              <button
                onClick={() => setIsAddSkuOpen(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ New SKU</span>
              </button>
            </div>
          </div>

          {/* KPI Inventory Reconciliation Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active SKUs</span>
              <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
                {materials.length} <span className="text-xs font-normal text-slate-400">items</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Across 14 categories</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Inward Received</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                +{materials.reduce((acc, m) => acc + (m.totalInward || 0), 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Cumulative deliveries</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Site Consumption</span>
              <div className="text-xl font-bold font-mono text-blue-400 mt-1 tabular-nums">
                -{materials.reduce((acc, m) => acc + (m.totalConsumed || 0), 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Issued to casting decks</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Scrap / Wastage</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
                -{materials.reduce((acc, m) => acc + (m.totalWastage || 0), 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Trimming & transit loss</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-900/60 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Closing Stock Value</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                ₹{(materials.reduce((acc, m) => acc + m.currentStock * m.purchaseRate, 0) / 100000).toFixed(2)}L
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Reconciled inventory</span>
            </div>
          </div>

          {/* Search, Category Filter & Low-Stock Toggle */}
          <div className="space-y-2.5 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={materialSearchQuery}
                  onChange={(e) => setMaterialSearchQuery(e.target.value)}
                  placeholder="Search materials by SKU name, supplier, or grade..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap border ${
                  lowStockOnly
                    ? 'bg-rose-950 text-rose-200 border-rose-700'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Low Stock Alerts ({materialsBelowReorder.length})</span>
              </button>
            </div>

            {/* Category Filter Pills (All 14 Categories) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  'ALL',
                  'Cement',
                  'TMT Steel',
                  'River Sand',
                  'M-Sand',
                  'Aggregates',
                  'Red Bricks',
                  'AAC Blocks',
                  'Tiles & Marble',
                  'Paint & Primer',
                  'Electrical Materials',
                  'Plumbing Materials',
                  'Doors & Windows',
                  'Hardware & Fasteners',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Material Cards & Live Reconciliation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((m) => {
              const isLow = m.currentStock <= m.reorderLevel;
              const opening = m.openingStock ?? m.currentStock;
              const inward = m.totalInward ?? 0;
              const consumed = m.totalConsumed ?? 0;
              const wastage = m.totalWastage ?? 0;
              const closing = m.currentStock;
              const valuation = closing * m.purchaseRate;

              return (
                <div
                  key={m.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-3.5 shadow-md flex flex-col justify-between ${
                    isLow ? 'border-rose-500/60 bg-rose-950/10' : 'border-slate-800'
                  }`}
                >
                  <div>
                    {/* Top Row: Category + Low Stock Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
                          {m.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">{m.name}</h4>
                      </div>
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          Reorder Due
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold shrink-0">
                          Nominal
                        </span>
                      )}
                    </div>

                    {/* Stock Math Breakdown */}
                    <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between items-center text-slate-400 text-[11px]">
                        <span>Opening Intake:</span>
                        <span className="text-slate-200">{opening} {m.unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-400 text-[11px]">
                        <span>+ Inward Received:</span>
                        <span>+{inward} {m.unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-400 text-[11px]">
                        <span>- Site Consumption:</span>
                        <span>-{consumed} {m.unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-rose-400 text-[11px]">
                        <span>- Scrap Wastage:</span>
                        <span>-{wastage} {m.unit}</span>
                      </div>
                      <div className="flex justify-between items-center text-white font-bold pt-1 border-t border-slate-800 text-xs">
                        <span className="text-amber-300 font-sans font-semibold">Closing Balance:</span>
                        <span className="text-base text-white">{closing} {m.unit}</span>
                      </div>
                    </div>

                    {/* Pricing & Supplier Metadata */}
                    <div className="mt-3 text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Purchase Rate:</span>
                        <span className="font-mono text-slate-200">₹{m.purchaseRate.toLocaleString('en-IN')}/{m.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Closing Valuation:</span>
                        <span className="font-mono font-bold text-amber-300">₹{valuation.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Vendor:</span>
                        <span className="text-slate-200 truncate max-w-[160px]">{m.supplier}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Safety Reorder Level:</span>
                        <span className="font-mono text-slate-300">{m.reorderLevel} {m.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Button Strip */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => {
                        setInwardMatId(m.id);
                        setInwardSupplier(m.supplier);
                        setIsDeliveryModalOpen(true);
                      }}
                      className="flex-1 py-1 px-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/80 rounded-lg text-xs font-semibold transition-colors"
                      title="Record inward delivery"
                    >
                      + Inward
                    </button>
                    <button
                      onClick={() => {
                        setConsumeMatId(m.id);
                        setIsConsumeModalOpen(true);
                      }}
                      className="flex-1 py-1 px-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/80 rounded-lg text-xs font-semibold transition-colors"
                      title="Log floor consumption"
                    >
                      - Use
                    </button>
                    <button
                      onClick={() => {
                        setWastageMatId(m.id);
                        setIsWastageModalOpen(true);
                      }}
                      className="py-1 px-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition-colors"
                      title="Log scrap wastage"
                    >
                      Scrap
                    </button>
                    <button
                      onClick={() => setSelectedMaterialAudit(m)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      title="View Stock Audit Ledger"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Record Inward Delivery Modal */}
          {isDeliveryModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Record Inward Delivery Consignment</h3>
                    <p className="text-xs text-slate-400">Add verified material shipment to closing inventory</p>
                  </div>
                  <button onClick={() => setIsDeliveryModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleRecordInwardSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Select Material Item</label>
                    <select
                      value={inwardMatId}
                      onChange={(e) => {
                        setInwardMatId(e.target.value);
                        const found = materials.find((m) => m.id === e.target.value);
                        if (found) setInwardSupplier(found.supplier);
                      }}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Choose Material Item --</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.category}] {m.name} (Current Stock: {m.currentStock} {m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Delivered Quantity</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={inwardQty}
                        onChange={(e) => setInwardQty(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Invoice / Challan #</label>
                      <input
                        type="text"
                        value={inwardRef}
                        onChange={(e) => setInwardRef(e.target.value)}
                        placeholder="e.g. DC-2026-8819"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Vendor / Truck Logistics</label>
                    <input
                      type="text"
                      value={inwardSupplier}
                      onChange={(e) => setInwardSupplier(e.target.value)}
                      placeholder="e.g. UltraTech Logistics KA-04-E-1829"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Gate Pass & Quality Notes</label>
                    <input
                      type="text"
                      value={inwardNotes}
                      onChange={(e) => setInwardNotes(e.target.value)}
                      placeholder="e.g. Batch test certificate verified, no transit moisture damage"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDeliveryModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!inwardMatId}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg"
                    >
                      Verify & Add to Stock
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Log Consumption Modal */}
          {isConsumeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Record Site Consumption / Issue</h3>
                    <p className="text-xs text-slate-400">Issue material from site warehouse to active floor work</p>
                  </div>
                  <button onClick={() => setIsConsumeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleRecordConsumptionSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Material Item</label>
                    <select
                      value={consumeMatId}
                      onChange={(e) => setConsumeMatId(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Choose Material Item --</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.category}] {m.name} (Available: {m.currentStock} {m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Quantity Issued</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={consumeQty}
                        onChange={(e) => setConsumeQty(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Issue Slip #</label>
                      <input
                        type="text"
                        value={consumeRef}
                        onChange={(e) => setConsumeRef(e.target.value)}
                        placeholder="e.g. ISS-FL15-01"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Location & Purpose</label>
                    <input
                      type="text"
                      value={consumeNotes}
                      onChange={(e) => setConsumeNotes(e.target.value)}
                      placeholder="e.g. Tower A 15th floor slab casting grid 1-6"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConsumeModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!consumeMatId}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-lg"
                    >
                      Deduct from On-Site Stock
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Record Wastage Modal */}
          {isWastageModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Record Material Wastage & Scrap</h3>
                    <p className="text-xs text-slate-400">Account for bar off-cuts, transit damage, and mortar drop loss</p>
                  </div>
                  <button onClick={() => setIsWastageModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleRecordWastageSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Material Item</label>
                    <select
                      value={wastageMatId}
                      onChange={(e) => setWastageMatId(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Choose Material Item --</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.category}] {m.name} (Current: {m.currentStock} {m.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Wastage Quantity</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={wastageQty}
                        onChange={(e) => setWastageQty(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Wastage Classification</label>
                      <select
                        value={wastageReason}
                        onChange={(e) => setWastageReason(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="Bar cut-off trimming & scrap">Rebar Cut-off Ends</option>
                        <option value="Transit handling breakage">Transit Handling Breakage</option>
                        <option value="Moisture & weather damage">Moisture / Weather Loss</option>
                        <option value="Tile cutting scrap & off-cuts">Tile / Marble Cutting Scrap</option>
                        <option value="Plumbing pipe off-cuts">Pipe / Conduit Off-cuts</option>
                        <option value="Excess mortar batch set">Expired Wet Batch</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Engineer / Foreman Notes</label>
                    <input
                      type="text"
                      value={wastageNotes}
                      onChange={(e) => setWastageNotes(e.target.value)}
                      placeholder="e.g. Sorted and weighed at scrap yard"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWastageModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!wastageMatId}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-lg"
                    >
                      Record Scrap Deduction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add New SKU Modal across all 14 categories */}
          {isAddSkuOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Register New Construction Material SKU</h3>
                    <p className="text-xs text-slate-400">Classify under standard 14 building material categories</p>
                  </div>
                  <button onClick={() => setIsAddSkuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddNewSkuSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Material Name & Specification</label>
                    <input
                      type="text"
                      required
                      value={skuName}
                      onChange={(e) => setSkuName(e.target.value)}
                      placeholder="e.g. Asian Paints Apex Ultima White Exterior Emulsion"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Material Category</label>
                      <select
                        value={skuCategory}
                        onChange={(e) => setSkuCategory(e.target.value as MaterialCategory)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="Cement">Cement</option>
                        <option value="TMT Steel">TMT Steel</option>
                        <option value="River Sand">River Sand</option>
                        <option value="M-Sand">M-Sand</option>
                        <option value="Aggregates">Aggregates</option>
                        <option value="Red Bricks">Red Bricks</option>
                        <option value="AAC Blocks">AAC Blocks</option>
                        <option value="Tiles & Marble">Tiles & Marble</option>
                        <option value="Paint & Primer">Paint & Primer</option>
                        <option value="Electrical Materials">Electrical Materials</option>
                        <option value="Plumbing Materials">Plumbing Materials</option>
                        <option value="Doors & Windows">Doors & Windows</option>
                        <option value="Hardware & Fasteners">Hardware & Fasteners</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Unit of Measurement</label>
                      <input
                        type="text"
                        required
                        value={skuUnit}
                        onChange={(e) => setSkuUnit(e.target.value)}
                        placeholder="e.g. Bags, MT, Tonnes, m³, Litres, Nos"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Purchase Rate (₹)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={skuRate}
                        onChange={(e) => setSkuRate(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Initial Opening Stock</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={skuOpening}
                        onChange={(e) => setSkuOpening(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Reorder Threshold</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={skuReorder}
                        onChange={(e) => setSkuReorder(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Primary Supplier / Manufacturer</label>
                    <input
                      type="text"
                      required
                      value={skuSupplier}
                      onChange={(e) => setSkuSupplier(e.target.value)}
                      placeholder="e.g. Pidilite Industries / Tata Steel Direct"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddSkuOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                    >
                      Save Material SKU
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stock Transaction Audit Ledger Drawer / Modal */}
          {selectedMaterialAudit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-amber-400 font-mono">Stock Audit History</div>
                    <h3 className="font-bold text-white text-base">{selectedMaterialAudit.name}</h3>
                    <p className="text-xs text-slate-400">
                      Closing Stock: <strong className="text-white font-mono">{selectedMaterialAudit.currentStock} {selectedMaterialAudit.unit}</strong> · Supplier: {selectedMaterialAudit.supplier}
                    </p>
                  </div>
                  <button onClick={() => setSelectedMaterialAudit(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
                  {selectedMaterialAudit.transactions && selectedMaterialAudit.transactions.length > 0 ? (
                    selectedMaterialAudit.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                tx.type === 'INWARD'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : tx.type === 'CONSUMPTION'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : tx.type === 'WASTAGE'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-purple-950 text-purple-300 border border-purple-800'
                              }`}
                            >
                              {tx.type}
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">{tx.date}</span>
                            {tx.referenceNo && (
                              <span className="text-slate-400 font-mono text-[11px]">Ref: {tx.referenceNo}</span>
                            )}
                          </div>
                          <div className="text-slate-200">{tx.notes || 'Routine Site Entry'}</div>
                          <div className="text-[10px] text-slate-400">Logged by: {tx.recordedBy}</div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-base font-bold font-mono ${
                              tx.type === 'INWARD'
                                ? 'text-emerald-400'
                                : tx.type === 'CONSUMPTION'
                                ? 'text-blue-400'
                                : tx.type === 'WASTAGE'
                                ? 'text-rose-400'
                                : 'text-slate-200'
                            }`}
                          >
                            {tx.type === 'INWARD' ? '+' : tx.type === 'CONSUMPTION' || tx.type === 'WASTAGE' ? '-' : ''}
                            {tx.quantity} {selectedMaterialAudit.unit}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No transaction entries recorded yet.
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedMaterialAudit(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                  >
                    Close Ledger
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Remediation Work Orders (NCR Issues) */}
      {activeTab === 'issues' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Private Remediation Work Orders (NCR)</h3>
              <p className="text-xs text-slate-400">
                Corrective action tickets raised by Structural Engineers. Keep internal until resolved.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <span className="text-slate-400 px-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['all', 'Open', 'Remediation In Progress', 'Rectified - Pending QA', 'Closed'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setDefectFilter(filterOption)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    defectFilter === filterOption
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredDefects.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
                No tickets matching this status filter.
              </div>
            ) : (
              filteredDefects.map((defect) => {
                const isCritical = defect.severity === 'Critical';
                return (
                  <div
                    key={defect.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            {defect.ticketNumber}
                          </span>
                          <span className="text-slate-500">·</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCritical
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : defect.severity === 'Major'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {defect.severity} Severity
                          </span>
                          <span className="text-slate-500">·</span>
                          <span className="text-xs text-slate-400">{defect.category}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{defect.title}</h4>
                        <div className="text-xs text-slate-400">
                          Location: <span className="text-slate-200">{defect.location}</span> · Reported by{' '}
                          <span className="text-slate-300 font-semibold">{defect.reportedBy}</span> on{' '}
                          {defect.reportedDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            defect.status === 'Closed' || defect.status === 'Rectified - Pending QA'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : defect.status === 'Remediation In Progress'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          ● {defect.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                      <div>
                        <div className="text-[11px] font-semibold text-amber-400 mb-0.5">
                          Engineer Required Corrective Action:
                        </div>
                        <p className="text-slate-200">{defect.correctiveAction}</p>
                      </div>
                      {defect.internalNotes && (
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                            Internal Engineering Observations:
                          </div>
                          <p className="text-slate-300 italic">{defect.internalNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Contractor Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Due for completion: <span className="text-slate-200 font-mono">{defect.dueDate}</span></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">Update Status:</span>
                        {defect.status !== 'Remediation In Progress' && (
                          <button
                            onClick={() => updateDefectStatus(defect.id, 'Remediation In Progress')}
                            className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {defect.status !== 'Rectified - Pending QA' && (
                          <button
                            onClick={() => updateDefectStatus(defect.id, 'Rectified - Pending QA')}
                            className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            ✓ Remediated (Ready for Inspection)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Quotations & BOQ */}
      {activeTab === 'quotations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Commercial Estimations & Works Contracts
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300">Section 31 CGST Act Compliant</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Itemized Bill of Quantities (BOQ) & Quotations</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Itemized direct costs (materials, labor, plant/machinery, transport), contractor overhead %, profit margin %, and variable GST treatments.
              </p>
            </div>
            <button
              onClick={() => setIsQuoteBuilderOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Itemized BOQ</span>
            </button>
          </div>

          <div className="space-y-5">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {q.quotationNumber}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-300">Dated {q.date}</span>
                      <span className="text-slate-400">·</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold">
                        {q.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mt-1">{q.projectTitle}</h4>
                    <p className="text-xs text-slate-400">
                      Billed to: <strong className="text-slate-200">{q.clientName}</strong> · Valid Until: {q.validUntil}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Final Customer Amount</div>
                      <div className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                        ₹{q.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Includes {q.gstTreatment || `${q.taxRate}% GST`}
                      </div>
                    </div>
                    <button
                      onClick={() => generateTaxInvoiceDocument(q)}
                      className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Generate Official GST Tax Invoice"
                    >
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      <span>Tax Invoice</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                      title="Print / Save PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items Table with Direct Cost Breakdown */}
                <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-2 text-center">Unit</th>
                        <th className="py-2.5 px-2 text-right">Qty</th>
                        <th className="py-2.5 px-2 text-right">Material (₹)</th>
                        <th className="py-2.5 px-2 text-right">Labour (₹)</th>
                        <th className="py-2.5 px-2 text-right">Equip / Trp (₹)</th>
                        <th className="py-2.5 px-2 text-right font-bold text-slate-200">Rate (₹)</th>
                        <th className="py-2.5 px-3 text-right font-bold text-white">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {q.items.map((it, idx) => {
                        const mat = it.materialCost ?? Math.round(it.rate * 0.65);
                        const lab = it.labourCost ?? Math.round(it.rate * 0.22);
                        const eqTrp = (it.equipmentCost ?? 0) + (it.transportationCost ?? Math.round(it.rate * 0.13));

                        return (
                          <tr key={it.id || idx} className="hover:bg-slate-850/50">
                            <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 max-w-sm">
                              <div className="font-semibold text-slate-100">{it.description}</div>
                              {it.category && (
                                <span className="text-[10px] font-mono text-amber-400/80">{it.category}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-2 text-center font-mono text-slate-400">{it.unit}</td>
                            <td className="py-2.5 px-2 text-right font-mono font-medium">{it.quantity}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-400">₹{mat.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-400">₹{lab.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-2 text-right font-mono text-slate-400">₹{eqTrp.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-2 text-right font-mono font-semibold text-slate-200">₹{it.rate.toLocaleString('en-IN')}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-white">₹{it.amount.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary & Breakdown Grid */}
                <div className="flex flex-col sm:flex-row justify-end items-end gap-4 text-xs font-mono">
                  <div className="w-full sm:w-96 p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Direct Construction Costs:</span>
                      <span className="font-semibold text-white">₹{q.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Contractor Overhead ({q.overheadRate || 6}%):</span>
                      <span className="text-slate-300">
                        +₹{(q.overheadAmount || Math.round(q.subtotal * 0.06)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Contractor Profit Margin ({q.profitRate || 15}%):</span>
                      <span className="text-slate-300">
                        +₹{(q.profitAmount || Math.round(q.subtotal * 0.15)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-200 font-semibold border-t border-slate-800 pt-1.5">
                      <span>Net Contractor Amount:</span>
                      <span className="text-white">
                        ₹{(q.netContractorAmount || Math.round(q.subtotal * 1.21)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span className="text-[11px] truncate max-w-[200px]">{q.gstTreatment || `GST (${q.taxRate}%)`}:</span>
                      <span className="text-slate-300">+₹{q.taxAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-amber-400 font-bold text-sm border-t-2 border-slate-800 pt-2">
                      <span className="font-sans">Final Customer Total:</span>
                      <span className="text-base">₹{q.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Itemized Quotation Builder Modal */}
          {isQuoteBuilderOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Complete Itemized BOQ & Quotation Builder</h3>
                    <p className="text-xs text-slate-400">
                      Specify direct materials, labour, equipment & haulage costs with variable overhead %, profit %, and GST treatments.
                    </p>
                  </div>
                  <button onClick={() => setIsQuoteBuilderOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Client Organization / Developer</label>
                      <input
                        type="text"
                        value={quoteClient}
                        onChange={(e) => setQuoteClient(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Contract Works Package Title</label>
                      <input
                        type="text"
                        value={quoteTitle}
                        onChange={(e) => setQuoteTitle(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Add Item Row with 4 Cost Breakdown Inputs */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-blue-400 text-xs">Add Detailed Cost Item to BOQ:</div>
                      <span className="text-[10px] text-slate-400 font-mono">Rate = Material + Labour + Equipment + Transport</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 mb-1">Item Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Polyurethane structural joint sealants..."
                          value={itemDesc}
                          onChange={(e) => setItemDesc(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Trade Category</label>
                        <select
                          value={itemCat}
                          onChange={(e) => setItemCat(e.target.value as any)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                        >
                          <option value="Structural">Structural</option>
                          <option value="Civil">Civil</option>
                          <option value="Finishes">Finishes</option>
                          <option value="MEP">MEP Services</option>
                          <option value="Interior & Joinery">Interior & Joinery</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">Unit & Qty</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Unit"
                            value={itemUnit}
                            onChange={(e) => setItemUnit(e.target.value)}
                            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            value={itemQty}
                            onChange={(e) => setItemQty(Number(e.target.value))}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4 Direct Cost Inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-850">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Material Cost/Unit (₹)</label>
                        <input
                          type="number"
                          value={itemMatCost}
                          onChange={(e) => setItemMatCost(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Labour Cost/Unit (₹)</label>
                        <input
                          type="number"
                          value={itemLabCost}
                          onChange={(e) => setItemLabCost(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Equipment/Plant (₹)</label>
                        <input
                          type="number"
                          value={itemEqCost}
                          onChange={(e) => setItemEqCost(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5">Transport/Haulage (₹)</label>
                        <input
                          type="number"
                          value={itemTransCost}
                          onChange={(e) => setItemTransCost(Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Calculated Unit Rate: <strong className="text-white">₹{Number(itemMatCost) + Number(itemLabCost) + Number(itemEqCost) + Number(itemTransCost)}</strong>/{itemUnit} · Line Amount: <strong className="text-amber-400">₹{((Number(itemMatCost) + Number(itemLabCost) + Number(itemEqCost) + Number(itemTransCost)) * itemQty).toLocaleString('en-IN')}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddItemToQuote}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs shadow-sm"
                      >
                        + Insert into BOQ
                      </button>
                    </div>
                  </div>

                  {/* Active Items Table */}
                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="py-2 px-3">Item Description</th>
                          <th className="py-2 px-2 text-center">Unit</th>
                          <th className="py-2 px-2 text-right">Qty</th>
                          <th className="py-2 px-2 text-right">Rate (₹)</th>
                          <th className="py-2 px-3 text-right">Amount (₹)</th>
                          <th className="py-2 px-2 text-center">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {quoteItems.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 px-3">
                              <span className="font-medium text-white">{item.description}</span>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Mat: ₹{item.materialCost || 0} · Lab: ₹{item.labourCost || 0} · Eq: ₹{item.equipmentCost || 0} · Trp: ₹{item.transportationCost || 0}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center font-mono">{item.unit}</td>
                            <td className="py-2 px-2 text-right font-mono">{item.quantity}</td>
                            <td className="py-2 px-2 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-white">₹{item.amount.toLocaleString('en-IN')}</td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveQuoteItem(item.id)}
                                className="text-rose-400 hover:text-rose-300 font-bold px-1"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Overheads, Profit & Flexible GST Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Contractor Overhead Rate (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={overheadPct}
                        onChange={(e) => setOverheadPct(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                        Overhead: ₹{overheadAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Contractor Profit Margin (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={profitPct}
                        onChange={(e) => setProfitPct(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                        Profit Margin: ₹{profitAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        GST Treatment Scheme
                      </label>
                      <select
                        value={gstTreatment}
                        onChange={(e) => setGstTreatment(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs"
                      >
                        <option value="18% (Standard Works Contract)">18% (Standard Works Contract)</option>
                        <option value="5% (Residential RERA)">5% (Residential RERA Scheme)</option>
                        <option value="12% (Affordable Housing Works)">12% (Affordable Housing Subcontract)</option>
                        <option value="28% (Commercial/Luxury Works)">28% (Commercial/Luxury Works)</option>
                        <option value="Exempt / Zero Rated">Exempt / Zero-Rated Works</option>
                        <option value="Custom %">Custom Tax Rate</option>
                      </select>
                      {gstTreatment === 'Custom %' && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={40}
                            value={customTaxRate}
                            onChange={(e) => setCustomTaxRate(Number(e.target.value))}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs"
                          />
                          <span className="text-slate-400">%</span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                        GST Outlay: ₹{taxAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Direct Subtotal: ₹{subtotalDirect.toLocaleString('en-IN')}</span>
                      <span>Overhead ({overheadPct}%): ₹{overheadAmount.toLocaleString('en-IN')}</span>
                      <span>Profit ({profitPct}%): ₹{profitAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-200 border-t border-slate-800 pt-2 text-sm">
                      <span className="font-sans font-semibold text-slate-300">Net Contractor Amount:</span>
                      <span className="font-bold text-white">₹{netContractorAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-400 font-bold text-base border-t border-slate-800 pt-2">
                      <span className="font-sans">Final Customer Amount (with GST):</span>
                      <span className="text-lg">₹{quoteTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteBuilderOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuotation}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md"
                  >
                    Issue & Save Quotation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Client Change Requests (Contractor View) */}
      {activeTab === 'changeRequests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Customer Change Request Cost Impact</h3>
              <p className="text-xs text-slate-400">
                Track modifications requested by property buyers. Evaluate site feasibility and material implications.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {changeRequests.map((cr) => (
              <div
                key={cr.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-400">{cr.area}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-400">Requested {cr.requestedDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-0.5">{cr.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{cr.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Estimated Cost</div>
                      <div className="text-base font-bold font-mono text-amber-400">
                        ₹{cr.estimatedCost.toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cr.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : cr.status === 'Under Review'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {cr.status}
                    </span>
                  </div>
                </div>

                {cr.engineeringNotes && (
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Structural Engineering Note: </span>
                    {cr.engineeringNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Profitability & Job Costing */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
            <div>
              <h3 className="text-base font-bold text-white">Project Job Costing & Gross Profit Realization</h3>
              <p className="text-xs text-slate-400">
                Real-time tracking of contracted milestone revenue against actual labor, material, and equipment burn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Agreed Contract Value</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                  ₹{contractValue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Prestige Horizon Fixed Bid</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Total Actual Costs to Date</div>
                <div className="text-2xl font-bold font-mono text-slate-200 mt-1 tabular-nums">
                  ₹{totalActualCost.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">74.7% of contract spent</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Projected Gross Profit</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  ₹{grossProfit.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">{grossMarginPct}% gross profit yield</div>
              </div>
            </div>

            {/* Expense Breakdown Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Expenditure Distribution
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Materials (Cement, Steel Rebar, Aggregate, AAC)</span>
                    <span className="font-mono text-white">₹{spentMaterials.toLocaleString()} (57.1%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '57.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Direct Labor & Skilled Trades (Attendance Muster)</span>
                    <span className="font-mono text-white">₹{spentLabor.toLocaleString()} (28.6%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '28.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Plant, Machinery & Scaffolding (Tower Cranes, Booms)</span>
                    <span className="font-mono text-white">₹{spentPlantMachinery.toLocaleString()} (14.3%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14.3%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Furniture & Interior Joinery Management */}
      {activeTab === 'interiors' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Bespoke Joinery & Millwork
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300">8 Interior Fitout Categories</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Furniture, Millwork & Interior Package Control</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fabricate and install modular kitchens, wardrobes, bedroom/living furniture, TV units, false ceilings & architectural doors.
              </p>
            </div>

            <button
              onClick={() => setIsAddInteriorOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Interior Unit</span>
            </button>
          </div>

          {/* Grid of Interior Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interiors.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                          {item.category}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-300 font-medium">{item.room}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">{item.title}</h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Target Installation: {item.targetInstallationDate}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          item.customerApprovalStatus === 'Approved by Customer'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.customerApprovalStatus === 'Revision Requested'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {item.customerApprovalStatus}
                      </span>
                      <div className="text-sm font-bold font-mono text-white mt-1">
                        ₹{item.pricing.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Dimensions & Specifications */}
                  <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Dimensions: </span>
                      <span className="font-mono text-slate-200">{item.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Materials & Hardware: </span>
                      <span className="text-slate-200">{item.materials}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Design Notes: </span>
                      <span className="text-slate-300">{item.designNotes}</span>
                    </div>
                    {item.customerNotes && (
                      <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300">
                        <span className="font-semibold">Customer Note: </span>
                        {item.customerNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Selector Control */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Installation Stage:</span>
                  <select
                    value={item.installationStatus}
                    onChange={(e) => updateInteriorStatus(item.id, e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-semibold"
                  >
                    <option value="Design Phase">Design Phase</option>
                    <option value="Material Sourced">Material Sourced</option>
                    <option value="Carpentry & Joinery">Carpentry & Joinery</option>
                    <option value="Installed">Installed on Site</option>
                    <option value="Quality Cleared">Quality Cleared</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Interior Modal */}
          {isAddInteriorOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Add Interior & Joinery Item</h3>
                    <p className="text-xs text-slate-400">Configure bespoke furniture or false ceiling specs</p>
                  </div>
                  <button onClick={() => setIsAddInteriorOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddInteriorSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Item Title</label>
                    <input
                      type="text"
                      required
                      value={intTitle}
                      onChange={(e) => setIntTitle(e.target.value)}
                      placeholder="e.g. Master Bedroom Floor-to-Ceiling Sliding Wardrobe"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Interior Category</label>
                      <select
                        value={intCategory}
                        onChange={(e) => setIntCategory(e.target.value as InteriorCategory)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="Modular Kitchen">Modular Kitchen</option>
                        <option value="Wardrobe">Wardrobe</option>
                        <option value="Bedroom Furniture">Bedroom Furniture</option>
                        <option value="Living Room Furniture">Living Room Furniture</option>
                        <option value="TV Unit">TV Unit</option>
                        <option value="False Ceiling">False Ceiling</option>
                        <option value="Doors & Windows">Doors & Windows</option>
                        <option value="Custom Furniture">Custom Furniture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Room / Space</label>
                      <input
                        type="text"
                        required
                        value={intRoom}
                        onChange={(e) => setIntRoom(e.target.value)}
                        placeholder="e.g. Master Bedroom, Dining, Foyer"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Dimensions</label>
                      <input
                        type="text"
                        required
                        value={intDimensions}
                        onChange={(e) => setIntDimensions(e.target.value)}
                        placeholder="e.g. 10 ft W x 9 ft H x 2.2 ft D"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Estimated Cost (₹)</label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={intPricing}
                        onChange={(e) => setIntPricing(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Materials & Hardware</label>
                    <input
                      type="text"
                      required
                      value={intMaterials}
                      onChange={(e) => setIntMaterials(e.target.value)}
                      placeholder="e.g. BWP Marine Ply, Merino laminate, Hettich soft-close hinges"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Design Specifications</label>
                    <input
                      type="text"
                      value={intDesignNotes}
                      onChange={(e) => setIntDesignNotes(e.target.value)}
                      placeholder="e.g. Integrated LED profile warm light, fluted louvers"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddInteriorOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
                    >
                      Save Interior Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
