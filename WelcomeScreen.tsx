import React, { useState } from 'react';
import {
  Building2,
  HardHat,
  Compass,
  Users,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { UserRole, User } from '../../types';
import { DEFAULT_USERS, HERO_IMAGE, TOWNSHIP_IMAGE } from '../../data/mockData';

export const WelcomeScreen: React.FC = () => {
  const { loginAsRole, loginCustom } = useCivora();

  const [activeTab, setActiveTab] = useState<'welcome' | 'register' | 'login'>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: selectedRole,
      organization: org || 'Civora Member',
      phone: phone || '+91 98000 00000',
      unitNumber: selectedRole === 'CUSTOMER' ? unitNo || 'Tower A - Unit 14B' : undefined,
    };
    loginCustom(newUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In prototype simulation mode, logging in with selected role connects user
    loginAsRole(selectedRole);
  };

  const roleCards: {
    role: UserRole;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    capabilities: string[];
    defaultPerson: string;
  }[] = [
    {
      role: 'CUSTOMER',
      title: 'Customer',
      tagline: 'Homebuyer & Investor Portal',
      icon: <Users className="w-6 h-6 text-sky-400" />,
      color: 'from-sky-500/10 to-blue-500/10',
      borderColor: 'border-sky-500/30 hover:border-sky-500/60',
      capabilities: [
        'Live progress timeline & stage tracking',
        'Verified & approved site photos/videos',
        'Direct feedback submission to site team',
        'Design change requests with cost impact',
        'Milestone payment schedule & receipts',
      ],
      defaultPerson: 'Rajesh & Priya Varma (Tower A - Unit 14B)',
    },
    {
      role: 'CONTRACTOR',
      title: 'Contractor',
      tagline: 'Site Operations & Resource Command',
      icon: <HardHat className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      capabilities: [
        'Contract velocity & project schedules',
        'Labor attendance, trades & daily wage logging',
        'Material inventory & reorder triggers',
        'Dynamic BOQ quotation generator',
        'Job costing & gross profitability margins',
      ],
      defaultPerson: 'Ramesh Naik (Apex Structural Infra Pvt Ltd)',
    },
    {
      role: 'ENGINEER',
      title: 'Engineer',
      tagline: 'Quality Assurance & Technical Authority',
      icon: <Compass className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      capabilities: [
        'Structural & CAD drawing review with AFC stamps',
        'Digital site inspection checklist & signatures',
        'Defect tagging (Critical / Major / Minor)',
        'Concrete cube compressive test logs (7 & 28-day)',
        'Sign-off on media approved for customer view',
      ],
      defaultPerson: 'Er. Sneha Kulkarni, M.Tech Civil (Chief Structural)',
    },
    {
      role: 'BUILDER',
      title: 'Builder / Developer',
      tagline: 'Enterprise Portfolio & Financials',
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/10 to-indigo-500/10',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      capabilities: [
        'Multi-project portfolio oversight',
        'Cross-disciplinary team assignments',
        'Master CAPEX, budget & cashflow monitoring',
        'Delivery velocity & safety compliance score',
        'Executive business analytics & milestone forecasts',
      ],
      defaultPerson: 'Vikramaditya Rao (MD, Prestige Horizon)',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <span className="text-lg font-black tracking-tighter">CV</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white">CIVORA</span>
              <span className="text-slate-400 text-xs ml-2 hidden sm:inline font-normal">
                Build Smarter. Manage Better.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('login')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-blue-300 hover:bg-slate-750 border border-slate-700'
              }`}
            >
              Register Organization
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {activeTab === 'welcome' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Construction Management Software</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Build Smarter. <span className="text-blue-500">Manage Better.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                CIVORA is the unified construction operating system connecting Customers, Contractors, Structural Engineers, and Builders with real-time site transparency, quality control, and multilingual AI voice coordination.
              </p>
            </div>

            {/* 4 Role Selection Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Select a Role to Enter Workspace</h2>
                  <p className="text-xs text-slate-400">
                    Click any persona below for instant 1-click test access with complete preloaded data
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-mono hidden sm:inline">
                  Prototype Live Environment
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roleCards.map((rc) => (
                  <div
                    key={rc.role}
                    className={`bg-slate-900/90 rounded-2xl border ${rc.borderColor} p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg group relative overflow-hidden`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center">
                          {rc.icon}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {rc.role}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                          {rc.title}
                        </h3>
                        <p className="text-xs text-slate-400">{rc.tagline}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        {rc.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800">
                      <div className="text-[11px] text-slate-400 truncate mb-2">
                        Demo: <span className="text-slate-200">{rc.defaultPerson}</span>
                      </div>
                      <button
                        onClick={() => loginAsRole(rc.role)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Launch as {rc.title}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Highlights & Multilingual Voice Notice */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-900/40 border border-blue-800 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Multilingual AI Voice Assistant</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed for Indian & international jobsites. Speak in English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Tamil (தமிழ்), or Telugu (తెలుగు) for instant audio site progress, material logs, and defect status.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-800 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Confidential Professional Memos</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Role-strict permission walls ensure internal structural calculations, raw contractor subcontractor rates, and sensitive defects remain sealed away from customer view.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-800 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Full-Stack Civil Workflow</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Integrated Bill of Quantities (BOQ), concrete cube compressive strength logs (M25–M40), digital inspection sign-offs, and customer change requests with real cost impacts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Register Tab */}
        {activeTab === 'register' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create Your CIVORA Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your role and initialize your construction organization profile
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Your Operational Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['CUSTOMER', 'CONTRACTOR', 'ENGINEER', 'BUILDER'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`p-3 rounded-xl border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                        selectedRole === r
                          ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-bold">{r}</span>
                      <span className="text-[10px] opacity-80">
                        {r === 'CUSTOMER' && 'Buyer / Investor'}
                        {r === 'CONTRACTOR' && 'General Contractor'}
                        {r === 'ENGINEER' && 'Structural & QA'}
                        {r === 'BUILDER' && 'Developer / Sponsor'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Naik or Priya Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Apex Infra Pvt Ltd"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {selectedRole === 'CUSTOMER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit / Flat Identification</label>
                  <input
                    type="text"
                    value={unitNo}
                    onChange={(e) => setUnitNo(e.target.value)}
                    placeholder="e.g. Skyline Azure - Tower A, Unit 14B"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Set Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  Complete Registration & Enter Workspace
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('welcome')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Return to Demo Role Selector
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Login Tab */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">Sign In to CIVORA</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials or choose your assigned role
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Active Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="CUSTOMER">Customer (Rajesh & Priya Varma)</option>
                  <option value="CONTRACTOR">Contractor (Ramesh Naik - Apex Infra)</option>
                  <option value="ENGINEER">Engineer (Er. Sneha Kulkarni)</option>
                  <option value="BUILDER">Builder / Developer (Vikramaditya Rao)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email / Username</label>
                <input
                  type="email"
                  defaultValue={DEFAULT_USERS[selectedRole]?.email}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="civora2026demo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  Enter Workspace as {selectedRole}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('welcome')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Return to Demo Role Selector
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Honest Prototype Notice & Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-slate-300 font-medium">CIVORA Construction Management Platform</span>
            <span>·</span>
            <span className="text-[11px] text-slate-400">Build Smarter. Manage Better.</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            <span>Prototype Environment — Role-Based Access Simulation.</span>{' '}
            <span className="text-slate-400">Production SSO & cryptographic audit trail in deployment pipeline.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
