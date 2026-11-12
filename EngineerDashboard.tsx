import React, { useState } from 'react';
import {
  Compass,
  FileCheck,
  AlertOctagon,
  CheckCircle2,
  FileText,
  Eye,
  Plus,
  ShieldCheck,
  Download,
  AlertTriangle,
  ZoomIn,
  Camera,
  Layers,
  Lock,
  Check,
  X,
  HelpCircle,
  Clock,
  Printer,
  Upload,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { DefectItem, SiteInspection, ChangeRequest } from '../../types';

export const EngineerDashboard: React.FC = () => {
  const {
    activeProject,
    currentUser,
    drawings,
    inspections,
    defects,
    cubeTests,
    media,
    changeRequests,
    addSiteInspection,
    addDefect,
    updateDefectStatus,
    togglePhotoApproval,
    addSiteMedia,
    updateChangeRequestStatus,
    generateReport,
    setSelectedReportPreview,
    openImagePreview,
    setIsPrivateDiscussionOpen,
  } = useCivora();

  const [activeTab, setActiveTab] = useState<
    'drawings' | 'inspections' | 'defects' | 'quality' | 'changeReviews' | 'mediaApproval'
  >('drawings');

  // New Inspection Modal
  const [isNewInspOpen, setIsNewInspOpen] = useState(false);
  const [inspType, setInspType] = useState<SiteInspection['inspectionType']>('Pre-Pour Rebar & Shuttering');
  const [inspLocation, setInspLocation] = useState('Tower A - 15th Floor Slab Grid 1-6');
  const [checklist, setChecklist] = useState([
    { item: 'Reinforcement bar diameter and spacing conforms to Drawing S-04', pass: true, remarks: 'Verified on site' },
    { item: 'Clear concrete cover blocks (30mm) in position under bottom rebar', pass: true, remarks: 'PVC spacers placed at 1m grid' },
    { item: 'Formwork shuttering joints sealed against cement slurry leakage', pass: true, remarks: 'Sealing foam verified' },
    { item: 'MEP electrical conduits and plumbing sleeves cast-in-place without cutting steel', pass: true, remarks: 'Cleared by electrical engineer' },
    { item: 'Safety perimeter edge cables installed around active slab deck', pass: true, remarks: '100% compliant' },
  ]);

  // New Defect Modal
  const [isNewDefectOpen, setIsNewDefectOpen] = useState(false);
  const [defectTitle, setDefectTitle] = useState('');
  const [defectCategory, setDefectCategory] = useState<DefectItem['category']>('Workmanship');
  const [defectSeverity, setDefectSeverity] = useState<DefectItem['severity']>('Major');
  const [defectLocation, setDefectLocation] = useState('Tower A - 13th Floor Column C-04');
  const [defectCorrective, setDefectCorrective] = useState('');
  const [defectInternalNotes, setDefectInternalNotes] = useState('');

  // Add Photo Modal
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoStage, setPhotoStage] = useState(activeProject.currentStage);
  const [photoApproveNow, setPhotoApproveNow] = useState(false);

  // Reviewing Change Request Notes state
  const [reviewNotes, setReviewNotes] = useState<{ [id: string]: string }>({});

  const openDefects = defects.filter((d) => d.status !== 'Closed');
  const criticalDefects = defects.filter((d) => d.severity === 'Critical' && d.status !== 'Closed');

  const handleToggleCheckItem = (index: number) => {
    setChecklist((prev) =>
      prev.map((c, i) => (i === index ? { ...c, pass: !c.pass } : c))
    );
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const allPassed = checklist.every((c) => c.pass);
    addSiteInspection({
      projectId: activeProject.id,
      inspectorName: currentUser?.name || 'Er. Sneha Kulkarni',
      inspectionType: inspType,
      locationDetails: inspLocation,
      passed: allPassed,
      itemsChecked: checklist,
      photos: media.map((m) => m.url).slice(0, 2),
      digitalSignature: `Digitally certified by ${currentUser?.name || 'Chief Structural Engineer'} (Registration #CE-88219)`,
    });
    setIsNewInspOpen(false);
  };

  const handleSaveDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectTitle.trim()) return;
    addDefect({
      projectId: activeProject.id,
      title: defectTitle,
      category: defectCategory,
      severity: defectSeverity,
      location: defectLocation,
      reportedBy: currentUser?.name || 'Site Quality Engineer',
      assignedTo: 'Apex Infra Contracting Team',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      correctiveAction: defectCorrective || 'Remediate as per IS 456 specification',
      internalNotes: defectInternalNotes || 'Internal observation for engineering record',
    });
    setDefectTitle('');
    setDefectCorrective('');
    setDefectInternalNotes('');
    setIsNewDefectOpen(false);
  };

  const handleAddSitePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;
    addSiteMedia({
      projectId: activeProject.id,
      title: photoTitle,
      stage: photoStage,
      date: new Date().toISOString().split('T')[0],
      url: '/src/assets/images/civora_site_inspection_1794252733858.jpg',
      type: 'photo',
      approvedBy: currentUser?.name || 'Er. Sneha Kulkarni',
      tags: ['Inspection', 'Quality Clearance'],
      description: `Site progress photograph captured during ${photoStage} inspection.`,
      approvedForCustomer: photoApproveNow,
    });
    setPhotoTitle('');
    setIsUploadPhotoOpen(false);
  };

  const handleGenerateCubeReport = () => {
    generateReport({
      projectId: activeProject.id,
      projectName: activeProject.name,
      title: `Concrete Compressive Strength Test Certificate (IS 516:2021) - Batch M35`,
      reportType: 'QUALITY_CUBE_TEST',
      summary: `Standard 150mm concrete cubes sampled during monolithic pour of ${activeProject.currentStage}. Compressive tests performed at 7-day and 28-day curing intervals in NABL-calibrated hydraulic compression machine.`,
      metadata: {
        batchId: 'M35-T1-15F',
        curingDays: 28,
        testedStrength: 39.4,
      },
    });
  };

  const handleGenerateSafetyAudit = () => {
    generateReport({
      projectId: activeProject.id,
      projectName: activeProject.name,
      title: `Structural Safety & QA Site Audit Report`,
      reportType: 'SAFETY_INSPECTION',
      summary: `Comprehensive engineering audit across ${activeProject.name}. Verified rebar tying, clear covers, perimeter safety nets, and shoring structural stability.`,
      metadata: {
        totalDefects: defects.length,
        resolvedDefects: defects.filter((d) => d.status === 'Closed' || d.status === 'Rectified - Pending QA').length,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Engineering & Quality Authority Desk
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">IS 456 / NBC 2016</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {currentUser?.name || 'Chief Structural Engineer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Supervising: <span className="text-emerald-300 font-semibold">{activeProject.name}</span> ·{' '}
              {activeProject.currentStage}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsPrivateDiscussionOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Internal Site Memos</span>
            </button>
            <button
              onClick={() => setIsUploadPhotoOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Upload Site Photo</span>
            </button>
            <button
              onClick={() => setIsNewInspOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Inspection</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">AFC Construction Drawings</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {drawings.length} Active Sheets
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Structural Rev C · Architectural Rev B
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Site Inspections Completed</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {inspections.length} Reports
          </div>
          <div className="text-[11px] text-slate-400 mt-1">100% Pre-Pour Checklist Pass Rate</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Active Defect Tickets (NCR)</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {openDefects.length} Open
          </div>
          <div className="text-[11px] mt-1">
            {criticalDefects.length > 0 ? (
              <span className="text-rose-400 font-semibold">{criticalDefects.length} Critical Issue(s)</span>
            ) : (
              <span className="text-emerald-400">Zero Critical Stop-Work</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">28-Day Concrete Cube Strength</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              39.4 MPa
            </span>
            <span className="text-xs text-slate-400">IS 516</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Exceeds M35 target (35.0 MPa)</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('drawings')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'drawings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Construction Drawings ({drawings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspections')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'inspections'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Site Inspections & Sign-offs ({inspections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('defects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'defects'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Technical Defects & NCR ({defects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'quality'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Concrete Cube Tests & QA</span>
        </button>

        <button
          onClick={() => setActiveTab('changeReviews')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'changeReviews'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Customer Change Requests ({changeRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mediaApproval')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'mediaApproval'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Customer Media Approvals ({media.filter((m) => m.approvedForCustomer).length}/{media.length})</span>
        </button>
      </div>

      {/* TAB 1: Construction Drawings */}
      {activeTab === 'drawings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Approved For Construction (AFC) Blueprint Register</h3>
              <p className="text-xs text-slate-400">
                Click any sheet to launch high-resolution CAD viewer with dimension cross-sections
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drawings.map((dwg) => (
              <div
                key={dwg.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-md group"
              >
                <div>
                  <div
                    onClick={() =>
                      openImagePreview({
                        url: dwg.fileUrl,
                        title: dwg.title,
                        subtitle: `${dwg.drawingNumber} · ${dwg.revision} · Scale ${dwg.scale} · Approved by ${dwg.approvedBy}`,
                      })
                    }
                    className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={dwg.fileUrl}
                      alt={dwg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-blue-900/90 text-blue-200 border border-blue-700 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      {dwg.sheetSize} · {dwg.scale}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {dwg.drawingNumber}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                        {dwg.revision}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {dwg.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Discipline: <span className="text-slate-200 font-medium">{dwg.discipline}</span>
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Approved: {dwg.approvedBy}</span>
                  <button
                    onClick={() =>
                      openImagePreview({
                        url: dwg.fileUrl,
                        title: dwg.title,
                        subtitle: `${dwg.drawingNumber} · ${dwg.revision}`,
                      })
                    }
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Open CAD</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Site Inspections */}
      {activeTab === 'inspections' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Digital Site Inspection Log & Sign-offs</h3>
              <p className="text-xs text-slate-400">
                Mandatory pre-pour checks, structural certifications, and digital engineering stamps
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateSafetyAudit}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Generate Audit Certificate</span>
              </button>
              <button
                onClick={() => setIsNewInspOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Inspection</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {insp.inspectionNumber}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-300 font-semibold">{insp.inspectionType}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{insp.locationDetails}</h4>
                    <p className="text-xs text-slate-400">
                      Conducted on {insp.date} by {insp.inspectorName}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      insp.passed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {insp.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {insp.passed ? 'Passed & Certified' : 'Failed - Rectification Required'}
                  </span>
                </div>

                {/* Items Checked */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Checked Quality & Safety Parameters
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {insp.itemsChecked.map((chk, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-200">{chk.item}</span>
                            {chk.remarks && (
                              <div className="text-[11px] text-slate-400 italic">
                                Remark: {chk.remarks}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-slate-500">{insp.digitalSignature}</span>
                  <button
                    onClick={() => window.print()}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sign-off Record</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Inspection Modal */}
          {isNewInspOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">Record Structural Site Inspection</h3>
                  <button onClick={() => setIsNewInspOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSaveInspection} className="overflow-y-auto flex-1 space-y-4 text-xs pr-1">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Inspection Protocol</label>
                    <select
                      value={inspType}
                      onChange={(e) => setInspType(e.target.value as SiteInspection['inspectionType'])}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Pre-Pour Rebar & Shuttering">Pre-Pour Rebar & Shuttering</option>
                      <option value="Post-Pour Concrete Inspection">Post-Pour Concrete Inspection</option>
                      <option value="MEP Rough-In Inspection">MEP Rough-In Inspection</option>
                      <option value="Waterproofing Membrane Test">Waterproofing Membrane Test</option>
                      <option value="Safety Net & Scaffolding Audit">Safety Net & Scaffolding Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Location Details</label>
                    <input
                      type="text"
                      required
                      value={inspLocation}
                      onChange={(e) => setInspLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-300">Mandatory Verification Checklist</label>
                    {checklist.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleToggleCheckItem(idx)}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                          item.pass
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                            : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                        }`}
                      >
                        <span className="text-xs">{item.item}</span>
                        <span className="font-mono text-xs font-bold">{item.pass ? '✓ PASS' : '✕ FAIL'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsNewInspOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                    >
                      Digitally Sign & Certify
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Technical Defects & NCR */}
      {activeTab === 'defects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Non-Conformance Reports (NCR) & Defect Register</h3>
              <p className="text-xs text-slate-400">
                Raise quality defects, assign corrective action to contractors, and close out remediated items
              </p>
            </div>
            <button
              onClick={() => setIsNewDefectOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log Non-Conformance (NCR)</span>
            </button>
          </div>

          <div className="space-y-4">
            {defects.map((defect) => (
              <div
                key={defect.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {defect.ticketNumber}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          defect.severity === 'Critical'
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
                      Location: <span className="text-slate-200">{defect.location}</span> · Assigned to{' '}
                      <span className="text-slate-300 font-semibold">{defect.assignedTo}</span>
                    </div>
                  </div>

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

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">Engineering Corrective Action: </span>
                    <span className="text-slate-200">{defect.correctiveAction}</span>
                  </div>
                  {defect.internalNotes && (
                    <div>
                      <span className="text-slate-400 font-semibold">Internal Investigation: </span>
                      <span className="text-slate-300 italic">{defect.internalNotes}</span>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-400">Due: <span className="font-mono text-slate-300">{defect.dueDate}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Engineer Action:</span>
                    {defect.status !== 'Closed' && (
                      <button
                        onClick={() => updateDefectStatus(defect.id, 'Closed')}
                        className="px-3 py-1.5 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        ✓ Verify & Close Ticket
                      </button>
                    )}
                    {defect.status === 'Closed' && (
                      <button
                        onClick={() => updateDefectStatus(defect.id, 'Remediation In Progress')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Re-open for Inspection
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Defect Modal */}
          {isNewDefectOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">Issue Non-Conformance Notice (NCR)</h3>
                  <button onClick={() => setIsNewDefectOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSaveDefect} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Defect Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honeycombing at column joint C-04"
                      value={defectTitle}
                      onChange={(e) => setDefectTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Severity</label>
                      <select
                        value={defectSeverity}
                        onChange={(e) => setDefectSeverity(e.target.value as DefectItem['severity'])}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="Minor">Minor</option>
                        <option value="Major">Major</option>
                        <option value="Critical">Critical (Stop-Work)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={defectCategory}
                        onChange={(e) => setDefectCategory(e.target.value as DefectItem['category'])}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="Workmanship">Workmanship</option>
                        <option value="Material Quality">Material Quality</option>
                        <option value="Safety">Safety Protocol</option>
                        <option value="Dimension Deviation">Dimension Deviation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Location Details</label>
                    <input
                      type="text"
                      required
                      value={defectLocation}
                      onChange={(e) => setDefectLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Corrective Remediation Action</label>
                    <textarea
                      rows={2}
                      required
                      value={defectCorrective}
                      onChange={(e) => setDefectCorrective(e.target.value)}
                      placeholder="Specify required repair methodology, epoxy injection, re-scaffolding..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNewDefectOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-md"
                    >
                      Dispatch Work Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Concrete Cube Tests & Quality Reports */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Compressive Concrete Cube Strength Logs</h3>
                <p className="text-xs text-slate-400">
                  150mm cast cubes tested in calibrated hydraulic compression test machine per IS 516
                </p>
              </div>
              <button
                onClick={handleGenerateCubeReport}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Issue Cube Test Certificate</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Batch Number</th>
                    <th className="py-3 px-4">Location Poured</th>
                    <th className="py-3 px-4">Mix Grade</th>
                    <th className="py-3 px-4">Casting Date</th>
                    <th className="py-3 px-4 text-right">Target (MPa)</th>
                    <th className="py-3 px-4 text-right">7-Day Actual</th>
                    <th className="py-3 px-4 text-right">28-Day Actual</th>
                    <th className="py-3 px-4 text-center">QA Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {cubeTests.map((ct) => (
                    <tr key={ct.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {ct.batchId}
                      </td>
                      <td className="py-3 px-4">{ct.location}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-white">{ct.grade}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{ct.castingDate}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">{ct.targetStrengthMPa} MPa</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-200 tabular-nums">
                        {ct.strength7DaysMPa} MPa
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 tabular-nums">
                        {ct.strength28DaysMPa > 0 ? `${ct.strength28DaysMPa} MPa` : 'Pending'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ct.status === 'Compliant'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {ct.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Customer Change Request Engineering Reviews */}
      {activeTab === 'changeReviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Engineering Review of Customer Change Requests</h3>
              <p className="text-xs text-slate-400">
                Approve or reject buyer modifications based on structural columns, MEP conduits, and load calculations
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {changeRequests.map((cr) => (
              <div
                key={cr.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{cr.area}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-xs text-slate-400">Submitted {cr.requestedDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{cr.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{cr.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
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

                {cr.engineeringNotes ? (
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <span className="font-semibold text-emerald-400">Engineering Clearance Remark: </span>
                    {cr.engineeringNotes}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Add engineering assessment remarks..."
                      value={reviewNotes[cr.id] || ''}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({ ...prev, [cr.id]: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-400">
                    Estimated Cost: <span className="font-mono font-bold text-white">₹{cr.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateChangeRequestStatus(
                          cr.id,
                          'Rejected',
                          reviewNotes[cr.id] || 'Rejected: Modifies structural load-bearing member or shear wall.'
                        )
                      }
                      className="px-3 py-1.5 bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 rounded-lg text-xs font-semibold transition-colors"
                    >
                      ✕ Reject Request
                    </button>
                    <button
                      onClick={() =>
                        updateChangeRequestStatus(
                          cr.id,
                          'Approved',
                          reviewNotes[cr.id] || 'Structurally cleared. No load-bearing members impacted.'
                        )
                      }
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                    >
                      ✓ Approve Clearance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Customer Media Approval Manager */}
      {activeTab === 'mediaApproval' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Customer Media Access Control & Curation</h3>
              <p className="text-xs text-slate-400">
                Only photos toggled & approved by engineering are visible on the Customer Residence Portal
              </p>
            </div>
            <button
              onClick={() => setIsUploadPhotoOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Site Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {media.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div
                    onClick={() =>
                      openImagePreview({
                        url: m.url,
                        title: m.title,
                        subtitle: `${m.stage} · ${m.date} · Approved by ${m.approvedBy}`,
                      })
                    }
                    className="aspect-video bg-slate-950 rounded-lg overflow-hidden relative cursor-pointer"
                  >
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        m.approvedForCustomer
                          ? 'bg-emerald-900/90 text-emerald-200 border border-emerald-700'
                          : 'bg-amber-900/90 text-amber-200 border border-amber-700'
                      }`}
                    >
                      {m.approvedForCustomer ? 'Public to Customer' : 'Internal Only'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-white truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-400">{m.stage} · {m.date}</div>
                </div>

                <button
                  onClick={() => togglePhotoApproval(m.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
                    m.approvedForCustomer
                      ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  {m.approvedForCustomer ? 'Revoke Customer Access' : '✓ Approve for Customer View'}
                </button>
              </div>
            ))}
          </div>

          {/* Upload Photo Modal */}
          {isUploadPhotoOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">Record & Upload Site Photo</h3>
                  <button onClick={() => setIsUploadPhotoOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddSitePhoto} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Photo Description / Milestone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15th Floor Slab Rebar Tying Completed"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Associated Stage</label>
                    <input
                      type="text"
                      value={photoStage}
                      onChange={(e) => setPhotoStage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={photoApproveNow}
                      onChange={(e) => setPhotoApproveNow(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-slate-300">Immediately approve for Customer Residence Portal</span>
                  </label>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadPhotoOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md"
                    >
                      Save Site Photo
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
