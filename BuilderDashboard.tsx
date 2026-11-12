import React, { useState } from 'react';
import {
  Building2,
  Users,
  DollarSign,
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Edit3,
  CheckCircle2,
  FileText,
  Sliders,
  Check,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { Project, ProjectStage } from '../../types';

export const BuilderDashboard: React.FC = () => {
  const {
    allProjects,
    activeProjectId,
    setActiveProjectId,
    activeProject,
    currentUser,
    addProject,
    updateProjectProgress,
    updateProjectStage,
    assignProjectTeam,
    payments,
    generateReport,
    setSelectedReportPreview,
    setIsPrivateDiscussionOpen,
  } = useCivora();

  const [activeTab, setActiveTab] = useState<'projects' | 'stages' | 'teams' | 'budgets' | 'analytics'>('projects');

  // New Project Modal
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projLocation, setProjLocation] = useState('');
  const [projType, setProjType] = useState<Project['type']>('High-Rise Residential');
  const [projBudget, setProjBudget] = useState(45000000);
  const [projArea, setProjArea] = useState(350000);
  const [projDelivery, setProjDelivery] = useState('2027-06-30');
  const [projContractor, setProjContractor] = useState('Apex Structural Infra (Ramesh Naik)');
  const [projEngineer, setProjEngineer] = useState('Er. Sneha Kulkarni, M.Tech');
  const [projWorkers, setProjWorkers] = useState(48);

  // Reassign Project Team Modal
  const [reassignModalProject, setReassignModalProject] = useState<Project | null>(null);
  const [reassignContractor, setReassignContractor] = useState('');
  const [reassignEngineer, setReassignEngineer] = useState('');
  const [reassignWorkersCount, setReassignWorkersCount] = useState(45);

  // Stage Editor State
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageProgressVal, setStageProgressVal] = useState(50);
  const [stageStatusVal, setStageStatusVal] = useState<ProjectStage['status']>('In Progress');

  // Master Portfolio Totals
  const totalCapex = allProjects.reduce((acc, p) => acc + p.budgetTotal, 0);
  const totalSpent = allProjects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const totalArea = allProjects.reduce((acc, p) => acc + p.totalAreaSqFt, 0);
  const averageProgress = Math.round(
    allProjects.reduce((acc, p) => acc + p.overallProgress, 0) / allProjects.length
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !projLocation.trim()) return;

    addProject({
      name: projName,
      location: projLocation,
      type: projType,
      currentStage: 'Site Clearance & Excavation',
      overallProgress: 5,
      budgetTotal: Number(projBudget),
      budgetSpent: Math.round(Number(projBudget) * 0.05),
      targetCompletionDate: projDelivery,
      totalAreaSqFt: Number(projArea),
      heroImage: '/src/assets/images/civora_township_development_1794252733788.jpg',
      status: 'On Schedule',
      clientName: 'Prestige Horizon Properties Ltd',
      tagline: 'Premium Development by CIVORA',
      startDate: new Date().toISOString().split('T')[0],
      contractorName: projContractor,
      engineerName: projEngineer,
      assignedWorkerIds: ['wrk-1', 'wrk-2', 'wrk-3'],
      stages: [
        { id: 'stg-1', name: 'Site Clearance & Piling', progressPercentage: 100, status: 'Completed', targetDate: '2026-03-31', completedDate: '2026-03-30' },
        { id: 'stg-2', name: 'Substructure & Foundation', progressPercentage: 40, status: 'In Progress', targetDate: '2026-07-31' },
        { id: 'stg-3', name: 'Superstructure Framework', progressPercentage: 0, status: 'Upcoming', targetDate: '2026-12-31' },
        { id: 'stg-4', name: 'MEP & Facade Enclosure', progressPercentage: 0, status: 'Upcoming', targetDate: '2027-04-30' },
        { id: 'stg-5', name: 'Internal Finishing & Handover', progressPercentage: 0, status: 'Upcoming', targetDate: '2027-06-30' },
      ],
    });

    setProjName('');
    setProjLocation('');
    setIsNewProjectOpen(false);
  };

  const handleUpdateStageSubmit = (stageId: string) => {
    updateProjectStage(activeProject.id, stageId, Number(stageProgressVal), stageStatusVal);
    setEditingStageId(null);
  };

  const handleGenerateHandoverCertificate = () => {
    generateReport({
      projectId: activeProject.id,
      projectName: activeProject.name,
      title: `Executive Handover & Occupancy Readiness Certificate - ${activeProject.name}`,
      reportType: 'CLIENT_HANDOVER',
      summary: `Formal structural and engineering completion certificate issued by Prestige Horizon Properties Ltd. Validates that ${activeProject.name} satisfies all local municipal building bylaws, National Building Code fire safety provisions, and structural compliance tests.`,
      metadata: {
        certificationDate: new Date().toISOString().split('T')[0],
        authority: 'Prestige Horizon Engineering Board',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Developer & Sponsor Executive Console
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-300">
                {currentUser?.organization || 'Prestige Horizon Properties Ltd'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Enterprise Portfolio Command
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Active Developments: <span className="text-purple-300 font-semibold">{allProjects.length} Flagship Sites</span> ·{' '}
              <span className="font-mono text-slate-200">{(totalArea / 1000000).toFixed(2)}M sq.ft</span> Total Development Pipeline
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsPrivateDiscussionOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Internal Site Memos</span>
            </button>
            <button
              onClick={handleGenerateHandoverCertificate}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Issue Handover Certificate</span>
            </button>
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Master Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Portfolio KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Total Committed Portfolio CAPEX</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            ₹{(totalCapex / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Disbursed: ₹{(totalSpent / 10000000).toFixed(2)} Cr ({Math.round((totalSpent / totalCapex) * 100)}%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Portfolio Delivery Velocity</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {averageProgress}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Weighted Average On-Time
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Active Projects in Pipeline</div>
          <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
            {allProjects.length} Projects
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Residential, Commercial & Townships</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Safety & Vendor Compliance</div>
          <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
            99.2%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Zero Stop-Work Notices Issued</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Manage Projects ({allProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stages')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'stages'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Milestone & Stage Controller ({activeProject.stages?.length || 5})</span>
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'teams'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Project Teams & Staffing</span>
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'budgets'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Master Budgets & Cashflow</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Business Intelligence</span>
        </button>
      </div>

      {/* TAB 1: Manage Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Multi-Project Development Portfolio</h3>
              <p className="text-xs text-slate-400">
                Click any project to switch executive workspace focus or configure construction parameters
              </p>
            </div>
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Development Site</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allProjects.map((p) => {
              const isSelected = p.id === activeProjectId;
              return (
                <div
                  key={p.id}
                  className={`bg-slate-900 border rounded-2xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-200 shadow-md ${
                    isSelected ? 'border-purple-500/80 ring-2 ring-purple-500/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">{p.code}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-xs text-slate-400">{p.type}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">{p.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{p.location}</span>
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'Ahead of Schedule'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : p.status === 'On Schedule'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : p.status === 'Critical Milestone'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Overall Construction Progress</span>
                        <span className="font-mono font-bold text-white tabular-nums">
                          {p.overallProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${p.overallProgress}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 italic truncate">
                        Active Stage: {p.currentStage}
                      </div>
                    </div>

                    {/* Financial & Scale Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-400">Total Capex Budget:</span>
                        <div className="font-mono font-bold text-white tabular-nums">
                          ₹{(p.budgetTotal / 10000000).toFixed(2)} Cr
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Disbursed to Date:</span>
                        <div className="font-mono font-bold text-purple-400 tabular-nums">
                          ₹{(p.budgetSpent / 10000000).toFixed(2)} Cr
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Built-Up Area:</span>
                        <div className="font-mono text-slate-300">
                          {p.totalAreaSqFt.toLocaleString()} sq.ft
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Target Delivery:</span>
                        <div className="font-mono text-slate-300">{p.targetCompletionDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {isSelected ? '✓ Currently Active Workspace' : 'Standby Development'}
                    </span>
                    <button
                      onClick={() => setActiveProjectId(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isSelected ? 'Active Workspace' : 'Switch Focus to Here'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Project Modal */}
          {isNewProjectOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base">Launch New Construction Project</h3>
                  <button onClick={() => setIsNewProjectOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Development Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prestige HighLine Commercial Towers"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Site Location & City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Whitefield Main Road, Bengaluru"
                      value={projLocation}
                      onChange={(e) => setProjLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Project Type</label>
                      <select
                        value={projType}
                        onChange={(e) => setProjType(e.target.value as Project['type'])}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="Residential">Residential Luxury</option>
                        <option value="Commercial">Commercial IT Park</option>
                        <option value="Township">Integrated Township</option>
                        <option value="Villa Community">Villa Community</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Total CAPEX (₹)</label>
                      <input
                        type="number"
                        required
                        value={projBudget}
                        onChange={(e) => setProjBudget(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Built-Up Area (sq.ft)</label>
                      <input
                        type="number"
                        required
                        value={projArea}
                        onChange={(e) => setProjArea(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Target Handover</label>
                      <input
                        type="date"
                        required
                        value={projDelivery}
                        onChange={(e) => setProjDelivery(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Prime General Contractor</label>
                      <select
                        value={projContractor}
                        onChange={(e) => setProjContractor(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs"
                      >
                        <option value="Apex Structural Infra (Ramesh Naik)">Apex Structural Infra (Ramesh Naik)</option>
                        <option value="Sobha-Prestige Joint Venture">Sobha-Prestige Joint Venture</option>
                        <option value="L&T Heavy Civil Engineering">L&T Heavy Civil Engineering</option>
                        <option value="Afcons Marine Engineering">Afcons Marine Engineering</option>
                        <option value="Shapoorji Pallonji EPC">Shapoorji Pallonji EPC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Lead Structural Engineer</label>
                      <select
                        value={projEngineer}
                        onChange={(e) => setProjEngineer(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white text-xs"
                      >
                        <option value="Er. Sneha Kulkarni, M.Tech">Er. Sneha Kulkarni, M.Tech</option>
                        <option value="Er. K. Venkataraman">Er. K. Venkataraman</option>
                        <option value="Er. Vivek Nair (Lead MEP)">Er. Vivek Nair (Lead MEP)</option>
                        <option value="Er. R. S. Deshmukh">Er. R. S. Deshmukh</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Assigned Workforce Crew Size</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={projWorkers}
                      onChange={(e) => setProjWorkers(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsNewProjectOpen(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-md"
                    >
                      Initialize Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Stage & Milestone Controller */}
      {activeTab === 'stages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Stage & Milestone Progress Controller</h3>
              <p className="text-xs text-slate-400">
                Update progress percentages and operational statuses for each construction phase in <span className="text-purple-300 font-semibold">{activeProject.name}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(activeProject.stages || []).map((stg) => {
              const isEditing = editingStageId === stg.id;
              return (
                <div
                  key={stg.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-400">Phase</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400">
                          Target Completion: {stg.targetDate}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">{stg.name}</h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        stg.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : stg.status === 'In Progress'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      ● {stg.status} ({stg.progressPercentage}%)
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        stg.status === 'Completed'
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}
                      style={{ width: `${stg.progressPercentage}%` }}
                    />
                  </div>

                  {/* Editing Panel */}
                  {isEditing ? (
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">
                            Progress Completion: {stageProgressVal}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stageProgressVal}
                            onChange={(e) => setStageProgressVal(Number(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-semibold mb-1">
                            Operational Status
                          </label>
                          <select
                            value={stageStatusVal}
                            onChange={(e) => setStageStatusVal(e.target.value as ProjectStage['status'])}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingStageId(null)}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateStageSubmit(stg.id)}
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm"
                        >
                          Save Stage Progress
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        {stg.progressPercentage === 100 ? 'Stage certified' : `${100 - stg.progressPercentage}% remaining`}
                      </span>
                      <button
                        onClick={() => {
                          setEditingStageId(stg.id);
                          setStageProgressVal(stg.progressPercentage);
                          setStageStatusVal(stg.status);
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-purple-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Adjust Stage %</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Project Teams & Staffing */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Cross-Project Team Allocation Matrix</h3>
                <p className="text-xs text-slate-400">
                  Assign prime contractors, lead structural engineers, and site workers across your active developments
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 font-semibold">{allProjects.length} Developments Staffed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Lead Structural Engineer</th>
                    <th className="py-3 px-4">Prime General Contractor</th>
                    <th className="py-3 px-4 text-center">Active Workforce</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {allProjects.map((p) => {
                    const eng = p.engineerName || 'Er. Sneha Kulkarni, M.Tech';
                    const cont = p.contractorName || 'Apex Structural Infra (Ramesh Naik)';
                    const crewCount = p.assignedWorkerIds?.length ? p.assignedWorkerIds.length * 16 : 48;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.code} · {p.location}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-emerald-400">
                          {eng}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-amber-400">
                          {cont}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                          {crewCount} Workers
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setReassignModalProject(p);
                              setReassignContractor(cont);
                              setReassignEngineer(eng);
                              setReassignWorkersCount(crewCount);
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Reassign Team</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reassign Team Modal */}
          {reassignModalProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">Reassign Site Management Team</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{reassignModalProject.name}</p>
                  </div>
                  <button onClick={() => setReassignModalProject(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reassignModalProject) return;
                    assignProjectTeam(
                      reassignModalProject.id,
                      undefined,
                      reassignContractor,
                      undefined,
                      reassignEngineer
                    );
                    setReassignModalProject(null);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Prime General Contractor</label>
                    <select
                      value={reassignContractor}
                      onChange={(e) => setReassignContractor(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      <option value="Apex Structural Infra (Ramesh Naik)">Apex Structural Infra (Ramesh Naik)</option>
                      <option value="Sobha-Prestige Joint Venture">Sobha-Prestige Joint Venture</option>
                      <option value="L&T Heavy Civil Engineering">L&T Heavy Civil Engineering</option>
                      <option value="Afcons Marine Engineering">Afcons Marine Engineering</option>
                      <option value="Shapoorji Pallonji EPC">Shapoorji Pallonji EPC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Lead Structural Engineer</label>
                    <select
                      value={reassignEngineer}
                      onChange={(e) => setReassignEngineer(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                    >
                      <option value="Er. Sneha Kulkarni, M.Tech">Er. Sneha Kulkarni, M.Tech</option>
                      <option value="Er. K. Venkataraman">Er. K. Venkataraman</option>
                      <option value="Er. Vivek Nair (Lead MEP)">Er. Vivek Nair (Lead MEP)</option>
                      <option value="Er. R. S. Deshmukh">Er. R. S. Deshmukh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Workforce Crew Count</label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={reassignWorkersCount}
                      onChange={(e) => setReassignWorkersCount(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReassignModalProject(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm"
                    >
                      Confirm Reassignment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Master Budgets & Cashflow */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          {/* Inflow vs Outflow Cashflow Cards */}
          {(() => {
            const totalCustomerCollections = payments.reduce((acc, p) => acc + p.amount, 0);
            const totalRevenueBilled = 18500000 * allProjects.length; // across projects
            const netCashflow = totalCustomerCollections - (totalSpent * 0.05); // active site cash liquidity
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 mb-1">Total Portfolio CAPEX</div>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    ₹{(totalCapex / 10000000).toFixed(2)} Cr
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Authorized Capital Allocation</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 mb-1">Total CAPEX Disbursed</div>
                  <div className="text-xl font-bold font-mono text-purple-400 tabular-nums">
                    ₹{(totalSpent / 10000000).toFixed(2)} Cr
                  </div>
                  <div className="text-[11px] text-purple-400/80 mt-1">Contractor Invoices Cleared</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 mb-1">Customer Inflow Realized</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    ₹{(totalCustomerCollections / 100000).toFixed(2)} Lakhs
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-1">{payments.length} Payments Received</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs text-slate-400 mb-1">Site Working Capital Buffer</div>
                  <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                    ₹{(((totalCapex - totalSpent) * 0.15) / 10000000).toFixed(2)} Cr
                  </div>
                  <div className="text-[11px] text-amber-400/80 mt-1">15% Contingency Float</div>
                </div>
              </div>
            );
          })()}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
            <div>
              <h3 className="text-base font-bold text-white">Project-by-Project Financial Burn Rate & Contingencies</h3>
              <p className="text-xs text-slate-400">
                CAPEX committed vs disbursed with contingency reserve analysis across active balance sheets
              </p>
            </div>

            <div className="space-y-4">
              {allProjects.map((p) => {
                const spentPct = Math.round((p.budgetSpent / p.budgetTotal) * 100);
                return (
                  <div key={p.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      <div className="font-mono text-xs">
                        <span className="text-purple-400 font-bold">₹{(p.budgetSpent / 10000000).toFixed(2)} Cr</span> /{' '}
                        <span className="text-slate-400">₹{(p.budgetTotal / 10000000).toFixed(2)} Cr Total</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                        style={{ width: `${spentPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{spentPct}% Disbursed</span>
                      <span>Contingency Reserve: ₹{(((p.budgetTotal - p.budgetSpent) * 0.15) / 10000000).toFixed(2)} Cr</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Business Intelligence */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <h3 className="text-base font-bold text-white">Cross-Project Milestone Velocity</h3>
            <p className="text-xs text-slate-400">
              Contract schedule adherence and milestone completion speed across all flagship sites
            </p>
            <div className="space-y-3 pt-2 text-xs">
              {allProjects.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-200 font-medium">{p.name}</span>
                    <span className="font-mono font-bold text-purple-400">{p.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.overallProgress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
            <h3 className="text-base font-bold text-white">Customer Satisfaction & Handover Readiness</h3>
            <p className="text-xs text-slate-400">
              Buyer sentiment index and architectural customization approvals
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Customer Net Promoter Score (NPS)</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">+74 NPS</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Design Change Approval Turnaround</span>
                <span className="font-bold text-white font-mono text-sm">48 Hours Avg</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Milestone Installment Realization Rate</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">96.8% On Time</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-300">Quality Cube Test Pass Ratio</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">100% Compliant</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
