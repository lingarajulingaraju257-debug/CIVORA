import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Image as ImageIcon,
  MessageSquare,
  PlusCircle,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  Download,
  AlertCircle,
  ShieldCheck,
  Send,
  Eye,
  Armchair,
  Plus,
  Receipt,
  ArrowUpRight,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { FeedbackItem, ConstructionReport, InteriorItem, InteriorCategory, PaymentRecord } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const {
    activeProject,
    currentUser,
    milestones,
    media,
    feedback,
    changeRequests,
    reports,
    interiors,
    payments,
    addFeedback,
    addChangeRequest,
    payMilestone,
    openImagePreview,
    setSelectedReportPreview,
    approveInteriorItem,
    recordCustomerPayment,
    generatePaymentReceiptDocument,
  } = useCivora();

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'progress' | 'media' | 'payments' | 'interiors' | 'changes' | 'feedback' | 'reports'
  >('progress');

  // Interior category filter
  const [interiorFilter, setInteriorFilter] = useState<string>('ALL');

  // Revision request modal state
  const [revisionItem, setRevisionItem] = useState<InteriorItem | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payType, setPayType] = useState<PaymentRecord['paymentType']>('Stage-Wise Installment');
  const [payMilestoneId, setPayMilestoneId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(2500000);
  const [payMethod, setPayMethod] = useState<PaymentRecord['paymentMethod']>('NEFT / RTGS');
  const [payRef, setPayRef] = useState<string>('CMS/HDFC/2026/899120');
  const [payNotes, setPayNotes] = useState<string>('5th Floor Slab casting installment');

  // Feedback form state
  const [fbCategory, setFbCategory] = useState<FeedbackItem['category']>('Finishes');
  const [fbRating, setFbRating] = useState<number>(5);
  const [fbMessage, setFbMessage] = useState('');
  const [fbSuccess, setFbSuccess] = useState(false);

  // Change request modal state
  const [isCrModalOpen, setIsCrModalOpen] = useState(false);
  const [crTitle, setCrTitle] = useState('');
  const [crDesc, setCrDesc] = useState('');
  const [crArea, setCrArea] = useState('Master Bedroom');
  const [crCost, setCrCost] = useState(850);

  // Filter approved media only! Customer must NEVER see internal unapproved engineering inspection photos
  const approvedMedia = media.filter((m) => m.approvedForCustomer);

  // Payments calculations
  const totalAgreedContractValue = 18500000; // ₹1.85 Cr
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalAdvancePaid = payments
    .filter((p) => p.paymentType === 'Advance Booking Token' || (p.notes && p.notes.toLowerCase().includes('token')) || (p.notes && p.notes.toLowerCase().includes('advance')))
    .reduce((acc, p) => acc + p.amount, 0);
  const outstandingBalance = Math.max(0, totalAgreedContractValue - totalPaid);

  const filteredInteriors = interiorFilter === 'ALL'
    ? interiors
    : interiors.filter((it) => it.category === interiorFilter);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;
    addFeedback({
      category: fbCategory,
      rating: fbRating,
      message: fbMessage,
    });
    setFbMessage('');
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 3000);
  };

  const handleCrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crTitle.trim()) return;
    addChangeRequest({
      title: crTitle,
      description: crDesc,
      area: crArea,
      estimatedCost: Number(crCost),
    });
    setCrTitle('');
    setCrDesc('');
    setIsCrModalOpen(false);
  };

  const handleApproveInterior = (itemId: string) => {
    approveInteriorItem(itemId, 'Approved by Customer');
  };

  const handleOpenRevisionModal = (item: InteriorItem) => {
    setRevisionItem(item);
    setRevisionNotes(item.customerNotes || '');
  };

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionItem || !revisionNotes.trim()) return;
    approveInteriorItem(revisionItem.id, 'Revision Requested', revisionNotes.trim());
    setRevisionItem(null);
    setRevisionNotes('');
  };

  const handleMakePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || payAmount <= 0) return;

    recordCustomerPayment({
      projectId: activeProject.id,
      customerName: currentUser?.name || 'Venkatesh Rao',
      unitNumber: currentUser?.unitNumber || 'Tower A - Unit 14B',
      milestoneId: payMilestoneId || undefined,
      stageOrMilestone: payType === 'Stage-Wise Installment' && payMilestoneId
        ? milestones.find((m) => m.id === payMilestoneId)?.title || 'Stage-Wise Installment'
        : payType,
      amount: Number(payAmount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      transactionRef: payRef.trim() || `UTR-${Date.now()}`,
      status: 'Cleared & Verified',
      paymentType: payType,
      notes: payNotes.trim() || 'Electronic bank transfer cleared.',
    });

    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Customer Residence Portal
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">
                {currentUser?.unitNumber || 'Tower A - Unit 14B'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {activeProject.name} — Current Stage:{' '}
              <span className="text-blue-300 font-semibold">{activeProject.currentStage}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800/80 px-4 py-3 rounded-xl shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Overall Construction</div>
              <div className="text-2xl font-black font-mono text-blue-400 tabular-nums">
                {activeProject.overallProgress}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-blue-500 flex items-center justify-center font-bold text-xs text-white">
              {activeProject.status === 'On Schedule' ? '✓' : '⚡'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'progress'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Construction Progress</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Site Photos ({approvedMedia.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('interiors')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'interiors'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Armchair className="w-4 h-4" />
          <span>Furniture & Interiors ({interiors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Payments & Receipts ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('changes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'changes'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Design Changes ({changeRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Certificates & Reports</span>
        </button>
      </div>

      {/* TAB 1: Construction Progress */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* Progress Timeline Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Structural & Architectural Execution</h3>
                <p className="text-xs text-slate-400">
                  Verified against IS 456 / NBC 2016 engineering standards by Civora Chartered Engineers
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Phase 1 Delivery: April 2027
              </span>
            </div>

            {/* Stage Progress Bars */}
            <div className="space-y-4">
              {[
                { stage: '1. Foundation & Substructure Mass Pour', pct: 100, status: 'Completed & Certified', date: 'Jul 2024' },
                { stage: '2. Basement B1-B3 & Podium Post-Tension Deck', pct: 100, status: 'Completed & Certified', date: 'Dec 2024' },
                { stage: '3. RCC Superstructure Framing (Floors 1-14)', pct: 90, status: 'Active Structural Pour', date: 'Nov 2026' },
                { stage: '4. Internal Brickwork, Plastering & AAC Walls', pct: 65, status: 'In Progress (Floor 12)', date: 'Jan 2027' },
                { stage: '5. Electrical Conduits & Sanitary Plumbing', pct: 55, status: 'In Progress', date: 'Feb 2027' },
                { stage: '6. Premium Flooring, Fenestration & Finishing', pct: 15, status: 'Upcoming', date: 'Apr 2027' },
              ].map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{s.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{s.status} · {s.date}</span>
                      <span className="font-mono font-bold text-blue-400 tabular-nums">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        s.pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Your Residence Details</div>
              <div className="text-sm font-bold text-white mb-2">{currentUser?.unitNumber}</div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Super Built-up Area:</span>
                  <span className="font-mono">2,480 sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Typology:</span>
                  <span>3 BHK + Staff Room</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Facing:</span>
                  <span>East-facing Pool Deck</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Assigned Supervising Team</div>
              <div className="text-sm font-bold text-white mb-2">Lead Site Professionals</div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Structural QA:</span>{' '}
                  <span className="text-slate-200 font-medium">Er. Sneha Kulkarni</span>
                </div>
                <div>
                  <span className="text-slate-400">Contracting Lead:</span>{' '}
                  <span className="text-slate-200 font-medium">Ramesh Naik (Apex Infra)</span>
                </div>
                <div>
                  <span className="text-slate-400">Client CRM:</span>{' '}
                  <span className="text-slate-200 font-medium">Deepa Menon</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Quality & Safety Index</div>
              <div className="text-sm font-bold text-white mb-2">Zero Critical Defects</div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>M35 Concrete Strength: Passed</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  28-day cube strength achieved 39.4 MPa against target 35 MPa. Rebar tensile strength certified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Approved Site Photos & Videos */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Certified Site Photography</h3>
              <p className="text-xs text-slate-400">
                Photos verified and cleared by Chief Structural Engineer for client viewing
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              QA Certified Media Only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedMedia.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-md"
              >
                <div>
                  <div
                    onClick={() =>
                      openImagePreview({
                        url: m.url,
                        title: m.title,
                        subtitle: `${m.stage} · Certified by ${m.approvedBy} on ${m.date}`,
                      })
                    }
                    className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={m.url}
                      alt={m.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold text-white drop-shadow truncate">
                          {m.stage}
                        </span>
                        <span className="text-[10px] bg-emerald-950/90 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{m.date}</span>
                  <button
                    onClick={() =>
                      openImagePreview({
                        url: m.url,
                        title: m.title,
                        subtitle: `${m.stage} · Certified by ${m.approvedBy}`,
                      })
                    }
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Inspection</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Furniture & Interior Management */}
      {activeTab === 'interiors' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Joinery, Millwork & False Ceilings
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300">Unit 14B Custom Fitout</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">Furniture & Interior Specifications</h3>
                <p className="text-xs text-slate-400">
                  Review specifications, materials, hardware brands, dimensions, and approve designs for factory fabrication.
                </p>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">Total Interior Package</div>
                <div className="text-lg font-bold font-mono text-amber-400">
                  ₹{interiors.reduce((acc, it) => acc + it.pricing, 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Filter Pills for 8 Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                'ALL',
                'Modular Kitchen',
                'Wardrobe',
                'Bedroom Furniture',
                'Living Room Furniture',
                'TV Unit',
                'False Ceiling',
                'Doors & Windows',
                'Custom Furniture',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInteriorFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                    interiorFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'All Fitouts' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInteriors.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
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

                    <div className="text-right shrink-0">
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

                  {/* Dimensions, Materials, Specs Box */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Dimensions: </span>
                      <span className="font-mono text-slate-200">{item.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Materials & Hardware: </span>
                      <span className="text-slate-200">{item.materials}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Design Specifications: </span>
                      <span className="text-slate-300">{item.designNotes}</span>
                    </div>
                    {item.customerNotes && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                        <span className="font-semibold">Your Revision Note: </span>
                        {item.customerNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Installation Progress:</span>
                    <span className="font-semibold text-blue-400 font-mono">{item.installationStatus}</span>
                  </div>
                </div>

                {/* Customer Approval Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {item.customerApprovalStatus === 'Approved by Customer'
                      ? '✓ Specifications Approved'
                      : 'Requires Customer Sign-off'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRevisionModal(item)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                    >
                      <span>Request Revision</span>
                    </button>
                    {item.customerApprovalStatus !== 'Approved by Customer' && (
                      <button
                        type="button"
                        onClick={() => handleApproveInterior(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Design</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revision Request Modal */}
          {revisionItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Request Design Revision</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{revisionItem.title} ({revisionItem.room})</p>
                  </div>
                  <button onClick={() => setRevisionItem(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmitRevision} className="space-y-4 text-xs">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400">Current Materials: <span className="text-slate-200">{revisionItem.materials}</span></div>
                    <div className="text-slate-400">Dimensions: <span className="text-slate-200 font-mono">{revisionItem.dimensions}</span></div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      Specify Required Changes / Color / Hardware Modifications
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      placeholder="e.g. Please change cabinet finish from Gloss Laminate to Matte Fluted Oak; add 2 additional internal pull-out wire baskets and soft-close Blum runners..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRevisionItem(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-sm"
                    >
                      Submit Revision Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Customer Payment Management */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Financial Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Total Unit Contract Value</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                ₹{totalAgreedContractValue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Agreement of Sale (Unit 14B)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Advance Token Paid</div>
              <div className="text-xl font-bold font-mono text-blue-400 tabular-nums">
                ₹{totalAdvancePaid.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-blue-400/80 mt-1">Booking & Foundation Deposit</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Total Paid to Date</div>
              <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                ₹{totalPaid.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1">{payments.length} Cleared Transactions</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 mb-1">Outstanding Balance</div>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                ₹{outstandingBalance.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1">Linked to Stage Milestones</div>
            </div>
          </div>

          {/* Payment Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-white">Payment Ledger & Milestone Installments</h3>
              <p className="text-xs text-slate-400">
                Official RERA registered receipts with RTGS / NEFT verification
              </p>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Make Payment / Record Deposit</span>
            </button>
          </div>

          {/* Official Payment Records Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Cleared Payment Receipts History</h3>
                <p className="text-xs text-slate-400">
                  Instant printable payment receipt vouchers for tax and audit records
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">{payments.length} Payments Recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Stage / Payment Type</th>
                    <th className="py-3 px-4">Payment Method & Ref</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {p.paymentDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{p.stageOrMilestone}</div>
                        <div className="text-[11px] text-slate-400">{p.notes || p.paymentType}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-200 font-medium">{p.paymentMethod}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.transactionRef}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => generatePaymentReceiptDocument(p)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto border border-slate-700 shadow-sm"
                        >
                          <Receipt className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Milestone Schedule Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Stage-wise Milestone Payment Schedule</h3>
                <p className="text-xs text-slate-400">
                  Construction installments are unlocked strictly after certified structural inspection
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Milestone Event</th>
                    <th className="py-3 px-4">Target Date</th>
                    <th className="py-3 px-4">Engineering Status</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Payment Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {milestones.map((ms) => (
                    <tr key={ms.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{ms.title}</div>
                        <div className="text-[11px] text-slate-400">{ms.description}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {ms.targetDate}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            ms.approvalStatus === 'Certified'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : ms.approvalStatus === 'Inspected - Passed'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ms.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                        ₹{ms.paymentAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {ms.paymentStatus === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        ) : ms.paymentStatus === 'Due' ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            Due Now
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Upcoming</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {ms.paymentStatus === 'Due' ? (
                          <button
                            onClick={() => {
                              setPayMilestoneId(ms.id);
                              setPayAmount(ms.paymentAmount);
                              setPayType('Stage-Wise Installment');
                              setPayNotes(`Payment for ${ms.title}`);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                          >
                            Pay Installment
                          </button>
                        ) : ms.paymentStatus === 'Paid' ? (
                          <button
                            onClick={() => {
                              const matchingPayment = payments.find((p) => p.milestoneId === ms.id) || payments[0];
                              if (matchingPayment) {
                                generatePaymentReceiptDocument(matchingPayment);
                              }
                            }}
                            className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1.5 ml-auto border border-slate-700"
                          >
                            <Download className="w-3 h-3 text-slate-400" />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Make Payment Modal */}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Make Customer Payment / Deposit</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Generates certified official receipt voucher</p>
                  </div>
                  <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleMakePaymentSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Payment Category</label>
                      <select
                        value={payType}
                        onChange={(e) => setPayType(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="Stage-Wise Installment">Stage-Wise Installment</option>
                        <option value="Advance Booking Token">Advance Booking Token</option>
                        <option value="Interior Customization Deposit">Interior Customization Deposit</option>
                        <option value="Change Request Payment">Change Request Payment</option>
                        <option value="Final Handover Settlement">Final Handover Settlement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Linked Milestone</label>
                      <select
                        value={payMilestoneId}
                        onChange={(e) => {
                          const mId = e.target.value;
                          setPayMilestoneId(mId);
                          const m = milestones.find((x) => x.id === mId);
                          if (m) setPayAmount(m.paymentAmount);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="">-- Direct Advance / Deposit --</option>
                        {milestones.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title} (₹{m.paymentAmount.toLocaleString('en-IN')})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={payAmount}
                        onChange={(e) => setPayAmount(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Payment Mode</label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                      >
                        <option value="NEFT / RTGS">NEFT / RTGS Bank Transfer</option>
                        <option value="UPI / IMPS">UPI / IMPS Electronic</option>
                        <option value="Bank Demand Draft">Bank Demand Draft (DD)</option>
                        <option value="Account Payee Cheque">Account Payee Cheque</option>
                        <option value="International Wire (SWIFT)">International Wire (SWIFT)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Bank Transaction Reference / UTR Number
                    </label>
                    <input
                      type="text"
                      required
                      value={payRef}
                      onChange={(e) => setPayRef(e.target.value)}
                      placeholder="e.g. HDFC/CMS/2026/889219 or UPI UTR"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Transaction Notes</label>
                    <input
                      type="text"
                      value={payNotes}
                      onChange={(e) => setPayNotes(e.target.value)}
                      placeholder="e.g. Payment towards 5th floor slab casting certificate"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                    >
                      Process & Issue Receipt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Design Changes */}
      {activeTab === 'changes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Client Design Modification Requests</h3>
              <p className="text-xs text-slate-400">
                Submit architectural customizations or electrical alterations with transparent engineering review
              </p>
            </div>
            <button
              onClick={() => setIsCrModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Design Change</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {changeRequests.map((cr) => (
              <div
                key={cr.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Area: {cr.area}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{cr.title}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                      cr.status === 'Approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : cr.status === 'Under Review'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {cr.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cr.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Estimated Cost:</span>{' '}
                    <strong className="text-white font-mono">${cr.estimatedCost}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Schedule Impact:</span>{' '}
                    <span className="text-slate-300 font-mono">+{cr.scheduleImpactDays} days</span>
                  </div>
                </div>

                {cr.engineeringNotes && (
                  <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300">
                    <strong className="text-blue-400">Site Engineer Note:</strong> {cr.engineeringNotes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Change Request Modal */}
          {isCrModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">New Design Change Request</h3>
                  <button
                    onClick={() => setIsCrModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCrSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Change Request Title
                    </label>
                    <input
                      type="text"
                      required
                      value={crTitle}
                      onChange={(e) => setCrTitle(e.target.value)}
                      placeholder="e.g. Additional 20A AC Socket in Bedroom 2"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Room / Area Affected
                    </label>
                    <select
                      value={crArea}
                      onChange={(e) => setCrArea(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Master Bedroom">Master Bedroom</option>
                      <option value="Living & Dining Area">Living & Dining Area</option>
                      <option value="Kitchen & Utility Balcony">Kitchen & Utility Balcony</option>
                      <option value="Guest Bedroom">Guest Bedroom</option>
                      <option value="En-suite Bathroom">En-suite Bathroom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Detailed Technical Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={crDesc}
                      onChange={(e) => setCrDesc(e.target.value)}
                      placeholder="Describe the requested layout modification, material switch, or fixture changes..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Estimated Cost Budget ($)
                    </label>
                    <input
                      type="number"
                      value={crCost}
                      onChange={(e) => setCrCost(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCrModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                    >
                      Submit for Structural Clearance
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Submit Feedback */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submission Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Submit Site & Construction Feedback</h3>
              <p className="text-xs text-slate-400">
                Your feedback is directly reviewed by the project manager and chief site engineer
              </p>
            </div>

            {fbSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Feedback submitted successfully. Your site team has been notified.</span>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Feedback Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Finishes', 'Plumbing/Electrical', 'Timeline', 'Site Visit', 'Design Query'] as FeedbackItem['category'][]).map(
                    (cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFbCategory(cat)}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          fbCategory === cat
                            ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Overall Experience Rating (1 to 5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFbRating(star)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${
                        fbRating >= star
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Your Comments & Observations</label>
                <textarea
                  rows={4}
                  required
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Share your thoughts on mock-up finishing, site visit experience, or progress timeline..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit Feedback to Site Lead</span>
              </button>
            </form>
          </div>

          {/* Feedback History */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Your Past Submissions</h3>
            <div className="space-y-3">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400">{item.category}</span>
                    <span className="font-mono text-amber-400">{'★'.repeat(item.rating)}</span>
                  </div>
                  <p className="text-slate-200">{item.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>{item.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.resolutionNotes && (
                    <div className="bg-slate-950/70 p-2.5 rounded-lg text-[11px] text-slate-300 mt-2">
                      <strong className="text-slate-400">Response:</strong> {item.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Official Certificates & Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Official Engineering Certificates & Documentation</h3>
              <p className="text-xs text-slate-400">
                Verified structural milestone certificates, concrete QA approvals, and handover documentation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-md hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {rep.reportType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rep.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{rep.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {rep.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Issued by: {rep.generatedBy}</span>
                  <button
                    onClick={() => setSelectedReportPreview(rep)}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Official Document</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
