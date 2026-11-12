import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Download,
  Calendar,
  Building,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Compass,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { ConstructionReport, ReportType } from '../../types';

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ isOpen, onClose }) => {
  const {
    selectedReportPreview,
    setSelectedReportPreview,
    reports,
    materials,
    generateReport,
    activeProject,
    currentRole,
    currentUser,
    permissions,
  } = useCivora();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [repType, setRepType] = useState<ReportType>('DAILY_PROGRESS');
  const [repTitle, setRepTitle] = useState('');
  const [repSummary, setRepSummary] = useState('');

  if (!isOpen) return null;

  const activeReport = selectedReportPreview || reports[0];

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repSummary.trim()) return;

    generateReport({
      reportType: repType,
      title: repTitle,
      projectId: activeProject.id,
      projectName: activeProject.name,
      summary: repSummary,
      metadata: {
        stage: activeProject.currentStage,
        overallProgress: `${activeProject.overallProgress}%`,
        status: activeProject.status,
      },
    });

    setRepTitle('');
    setRepSummary('');
    setIsCreateOpen(false);
  };

  const getReportTypeBadge = (type: ReportType) => {
    switch (type) {
      case 'DAILY_PROGRESS':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">DPR</span>;
      case 'QUALITY_CUBE_TEST':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">QA Cube Test</span>;
      case 'SAFETY_INSPECTION':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">Safety Audit</span>;
      case 'BOQ_ESTIMATION':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">Cost BOQ</span>;
      case 'CLIENT_HANDOVER':
        return <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-mono">Handover Cert</span>;
      case 'TAX_INVOICE':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">Tax Invoice</span>;
      case 'MATERIAL_STATEMENT':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">Material Stmt</span>;
      case 'PAYMENT_RECEIPT':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">Money Receipt</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">Official Doc</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">CIVORA Professional Engineering Reports</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {reports.length} Available
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Daily Progress, Quality Assurance (IS 456/516), Safety Audits & Handover Certificates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {permissions.canGenerateReports && (
              <button
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate Report</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: List of Reports */}
          <div className="w-full md:w-80 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-4 overflow-y-auto space-y-2 shrink-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Document
            </div>
            {reports.map((rep) => {
              const isSelected = activeReport?.id === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => {
                    setSelectedReportPreview(rep);
                    setIsCreateOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getReportTypeBadge(rep.reportType)}
                    <span className="text-[10px] text-slate-400 font-mono">{rep.date}</span>
                  </div>
                  <div className="font-semibold text-slate-100 line-clamp-1">{rep.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{rep.generatedBy}</div>
                </button>
              );
            })}
          </div>

          {/* Right Main Viewport */}
          <div className="flex-1 bg-slate-900 overflow-y-auto p-6 md:p-8">
            {isCreateOpen ? (
              /* Generate Report Form */
              <div className="max-w-xl mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base">Generate New Formal Report</h4>
                  <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white text-xs">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Document Classification</label>
                    <select
                      value={repType}
                      onChange={(e) => setRepType(e.target.value as ReportType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="DAILY_PROGRESS">Daily Site Progress Report (DPR)</option>
                      <option value="QUALITY_CUBE_TEST">Quality Assurance & Concrete Cube Test Certificate</option>
                      <option value="SAFETY_INSPECTION">Site Safety & Edge Protection Audit Report</option>
                      <option value="BOQ_ESTIMATION">Construction Cost & BOQ Summary</option>
                      <option value="TAX_INVOICE">Tax Invoice (Works Contract)</option>
                      <option value="MATERIAL_STATEMENT">Reconciled Material Stock Statement</option>
                      <option value="PAYMENT_RECEIPT">Customer Payment Voucher Receipt</option>
                      <option value="CLIENT_HANDOVER">Milestone Handover Readiness Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Document Title</label>
                    <input
                      type="text"
                      required
                      value={repTitle}
                      onChange={(e) => setRepTitle(e.target.value)}
                      placeholder="e.g. Daily Site Progress Report (DPR) - Tower A 15th Floor"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Executive Summary & Technical Notes</label>
                    <textarea
                      rows={5}
                      required
                      value={repSummary}
                      onChange={(e) => setRepSummary(e.target.value)}
                      placeholder="Detail labor attendance, concrete volume poured, slump test, rebar cover clearances, safety compliance..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm"
                    >
                      Certify & Save Document
                    </button>
                  </div>
                </form>
              </div>
            ) : activeReport ? (
              /* Printable Professional Document Sheet */
              <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-xl p-8 sm:p-10 shadow-2xl border border-slate-200 print:m-0 print:p-0 print:border-none print:shadow-none">
                {/* Official Letterhead Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-black tracking-tight text-blue-900">CIVORA</span>
                      <span className="text-xs uppercase font-mono text-slate-500 border-l border-slate-300 pl-2">
                        Engineering Services
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      Civil & Structural Project Governance System · NBC 2016 Compliant
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-600 space-y-0.5">
                    <div className="font-mono font-bold text-slate-900">REF: {activeReport.id.toUpperCase()}</div>
                    <div>Date: <span className="font-mono font-semibold">{activeReport.date}</span></div>
                    <div>Project: <strong className="text-slate-900">{activeReport.projectName}</strong></div>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
                    {activeReport.reportType.replace(/_/g, ' ')}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {activeReport.title}
                  </h1>
                </div>

                {/* Document Metadata Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100 rounded-lg text-xs mb-6 border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Issued By</span>
                    <strong className="text-slate-900">{activeReport.generatedBy}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Author Role</span>
                    <strong className="text-slate-900">{activeReport.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Project ID</span>
                    <span className="font-mono text-slate-900 font-bold">{activeReport.projectId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Clearance Status</span>
                    <span className="text-emerald-700 font-bold">VERIFIED</span>
                  </div>
                </div>

                {/* Document Body Variants */}
                {activeReport.reportType === 'TAX_INVOICE' ? (
                  /* Tax Invoice Layout */
                  <div className="space-y-6 mb-8 text-xs">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-500">Service Provider / Contractor</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">Apex Structural Contractors & Infra Pvt Ltd</div>
                        <div className="text-slate-600 mt-1">GSTIN: <span className="font-mono font-bold text-slate-900">29AAACP9988C1Z4</span></div>
                        <div className="text-slate-600">PAN: <span className="font-mono font-bold text-slate-900">AAACP9988C</span></div>
                        <div className="text-slate-600">Service Accounting Code (SAC): <span className="font-mono font-bold text-slate-900">9954</span> (Works Contract)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Bill To / Developer</div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {activeReport.metadata?.clientName || 'Prestige Horizon Properties Ltd'}
                        </div>
                        <div className="text-slate-600 mt-1">Project: <strong className="text-slate-900">{activeReport.projectName}</strong></div>
                        <div className="text-slate-600">Tax Invoice No: <span className="font-mono font-bold text-slate-900">{activeReport.metadata?.invoiceNumber || activeReport.id.toUpperCase()}</span></div>
                        <div className="text-slate-600">GST Classification: <strong className="text-slate-900">{activeReport.metadata?.gstTreatment || 'Works Contract (18%)'}</strong></div>
                      </div>
                    </div>

                    {/* Invoice Items Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Description of Work / Civil Item</th>
                            <th className="py-2.5 px-3 text-center">Unit</th>
                            <th className="py-2.5 px-3 text-right">Qty</th>
                            <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                            <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Array.isArray(activeReport.metadata?.items) && activeReport.metadata.items.length > 0 ? (
                            activeReport.metadata.items.map((item: any, idx: number) => (
                              <tr key={item.id || idx}>
                                <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                                <td className="py-2 px-3 font-medium text-slate-900">{item.description}</td>
                                <td className="py-2 px-3 text-center text-slate-600 font-mono">{item.unit}</td>
                                <td className="py-2 px-3 text-right font-mono">{item.quantity}</td>
                                <td className="py-2 px-3 text-right font-mono">₹{Number(item.rate).toLocaleString('en-IN')}</td>
                                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                                  ₹{Number(item.amount).toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-2 px-3 text-slate-500">1</td>
                              <td className="py-2 px-3 font-medium text-slate-900">Executing civil and structural superstructure casting works</td>
                              <td className="py-2 px-3 text-center text-slate-600 font-mono">L.S.</td>
                              <td className="py-2 px-3 text-right font-mono">1</td>
                              <td className="py-2 px-3 text-right font-mono">₹{Number(activeReport.metadata?.subtotal || 6118000).toLocaleString('en-IN')}</td>
                              <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                                ₹{Number(activeReport.metadata?.subtotal || 6118000).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Tax & Total Calculation Breakup */}
                    <div className="flex justify-end">
                      <div className="w-full sm:w-80 space-y-1.5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Direct Works Subtotal:</span>
                          <span className="font-mono font-semibold">₹{Number(activeReport.metadata?.subtotal || 0).toLocaleString('en-IN')}</span>
                        </div>
                        {activeReport.metadata?.overheadAmount ? (
                          <div className="flex justify-between text-slate-600">
                            <span>Contractor Overhead:</span>
                            <span className="font-mono">₹{Number(activeReport.metadata?.overheadAmount).toLocaleString('en-IN')}</span>
                          </div>
                        ) : null}
                        {activeReport.metadata?.profitAmount ? (
                          <div className="flex justify-between text-slate-600">
                            <span>Contractor Profit Margin:</span>
                            <span className="font-mono">₹{Number(activeReport.metadata?.profitAmount).toLocaleString('en-IN')}</span>
                          </div>
                        ) : null}
                        <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-1.5">
                          <span>Net Taxable Works Amount:</span>
                          <span className="font-mono">₹{Number(activeReport.metadata?.netContractorAmount || activeReport.metadata?.subtotal || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>CGST ({(Number(activeReport.metadata?.taxRate || 18) / 2).toFixed(1)}%):</span>
                          <span className="font-mono">₹{Math.round(Number(activeReport.metadata?.taxAmount || 0) / 2).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>SGST ({(Number(activeReport.metadata?.taxRate || 18) / 2).toFixed(1)}%):</span>
                          <span className="font-mono">₹{Math.round(Number(activeReport.metadata?.taxAmount || 0) / 2).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-black text-sm border-t-2 border-slate-900 pt-2">
                          <span>Total Amount Payable:</span>
                          <span className="font-mono text-blue-900">₹{Number(activeReport.metadata?.totalPayable || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-[11px] text-slate-600">
                      <strong>Remittance Bank:</strong> HDFC Bank Ltd · Branch: Richmond Road, Bangalore · A/C No: 50200034991209 · IFSC: HDFC0000045 · Electronic Wire / RTGS mandate only.
                    </div>
                  </div>
                ) : activeReport.reportType === 'MATERIAL_STATEMENT' ? (
                  /* Reconciled Material Stock Statement */
                  <div className="space-y-6 mb-8 text-xs">
                    <p className="text-slate-700 leading-relaxed">{activeReport.summary}</p>
                    
                    {/* Material Table across all 14 categories */}
                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3">Item Description</th>
                            <th className="py-2.5 px-2">Category</th>
                            <th className="py-2.5 px-2 text-center">Unit</th>
                            <th className="py-2.5 px-2 text-right">Opening</th>
                            <th className="py-2.5 px-2 text-right text-emerald-700">+ Inward</th>
                            <th className="py-2.5 px-2 text-right text-blue-700">- Consumed</th>
                            <th className="py-2.5 px-2 text-right text-rose-700">- Wastage</th>
                            <th className="py-2.5 px-2 text-right font-bold text-slate-900">= Closing</th>
                            <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                            <th className="py-2.5 px-3 text-right">Valuation (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {materials.map((m) => {
                            const opening = m.openingStock ?? m.currentStock;
                            const inward = m.totalInward ?? 0;
                            const consumed = m.totalConsumed ?? 0;
                            const wastage = m.totalWastage ?? 0;
                            const closing = m.currentStock;
                            const valuation = closing * m.purchaseRate;

                            return (
                              <tr key={m.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-semibold text-slate-900">{m.name}</td>
                                <td className="py-2 px-2 text-slate-600">{m.category}</td>
                                <td className="py-2 px-2 text-center font-mono text-slate-500">{m.unit}</td>
                                <td className="py-2 px-2 text-right font-mono">{opening.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-mono text-emerald-700 font-medium">+{inward.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-mono text-blue-700 font-medium">-{consumed.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-mono text-rose-700 font-medium">-{wastage.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">{closing.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right font-mono">₹{m.purchaseRate.toLocaleString('en-IN')}</td>
                                <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">₹{valuation.toLocaleString('en-IN')}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-slate-600">
                        Formula: <span className="font-mono text-slate-900 font-semibold">Closing Balance = Opening + Inward - Site Consumption - Scrap Wastage</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 mr-2">Total Closing Inventory Valuation:</span>
                        <strong className="text-sm font-mono text-blue-900">
                          ₹{materials.reduce((acc, m) => acc + m.currentStock * m.purchaseRate, 0).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : activeReport.reportType === 'PAYMENT_RECEIPT' ? (
                  /* Formal Payment Receipt Voucher */
                  <div className="space-y-6 mb-8 text-xs">
                    <div className="border-2 border-slate-900 rounded-xl p-6 bg-slate-50/50 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-500">Official Payment Voucher</div>
                          <h2 className="text-lg font-black text-slate-900">RECEIPT #{activeReport.metadata?.receiptNumber || 'RCPT-2026-0001'}</h2>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500">Payment Date</div>
                          <div className="font-mono font-bold text-slate-900">{activeReport.date}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Received with Thanks From:</span>
                          <strong className="text-sm text-slate-900 block">{activeReport.metadata?.customerName || 'Customer'}</strong>
                          <span className="text-slate-600 font-mono text-xs">{activeReport.metadata?.unitNumber || 'Unit 14B'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px]">Amount Received:</span>
                          <div className="text-xl font-black text-emerald-800 font-mono">
                            ₹{Number(activeReport.metadata?.amount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Account Head / Purpose:</span>
                          <strong className="text-slate-900">{activeReport.metadata?.paymentType || 'Stage-Wise Installment'}</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px]">Payment Method:</span>
                          <strong className="text-slate-900">{activeReport.metadata?.paymentMethod || 'NEFT / RTGS'}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-3">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Bank Transaction / UTR Ref:</span>
                          <span className="font-mono font-bold text-slate-900">{activeReport.metadata?.transactionRef || 'N/A'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[10px]">Clearance Status:</span>
                          <span className="text-emerald-700 font-black tracking-wider uppercase">CLEARED & SETTLED</span>
                        </div>
                      </div>

                      {activeReport.metadata?.notes && (
                        <div className="text-slate-600 text-[11px] italic bg-white p-2.5 rounded border border-slate-200">
                          Note: {activeReport.metadata.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard Technical Inspection / DPR / Quality / Handover Sheet */
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                      Technical Summary & Site Findings
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {activeReport.summary}
                    </p>

                    {/* Metadata key values if present */}
                    {activeReport.metadata && Object.keys(activeReport.metadata).length > 0 && (
                      <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3">Field Parameter</th>
                              <th className="py-2 px-3">Recorded Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {Object.entries(activeReport.metadata).map(([key, value]) => (
                              <tr key={key}>
                                <td className="py-2 px-3 font-medium text-slate-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </td>
                                <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                                  {String(value)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Sign-off Blocks */}
                <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
                  <div>
                    <div className="font-semibold text-slate-900 mb-6">Inspecting Authority:</div>
                    <div className="font-mono text-xs border-b border-slate-300 pb-1 text-slate-900 font-bold">
                      {activeReport.generatedBy}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Digital Cryptographic Verification Stamp · CIVORA
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-slate-900 mb-6">Authorized Signatory / Sponsor:</div>
                    <div className="font-mono text-xs border-b border-slate-300 pb-1 text-slate-900 font-bold">
                      Prestige Horizon Engineering Directorate
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Conforms to National Building Code (NBC) 2016
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
