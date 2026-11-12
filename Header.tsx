import React, { useState } from 'react';
import {
  HardHat,
  Mic,
  Lock,
  ChevronDown,
  Building2,
  Users,
  Compass,
  Briefcase,
  Globe,
  LogOut,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useCivora } from '../../context/CivoraContext';
import { UserRole, SupportedLanguage } from '../../types';

interface HeaderProps {
  onOpenReports?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReports }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    allProjects,
    activeProjectId,
    setActiveProjectId,
    selectedLanguage,
    setSelectedLanguage,
    setIsVoiceAssistantOpen,
    setIsPrivateDiscussionOpen,
    logout,
    resetAllData,
  } = useCivora();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'CUSTOMER',
      label: 'Customer Portal',
      icon: <Users className="w-4 h-4 text-sky-400" />,
      desc: 'Progress, milestones, payments & feedback',
    },
    {
      role: 'CONTRACTOR',
      label: 'Contractor Suite',
      icon: <HardHat className="w-4 h-4 text-amber-400" />,
      desc: 'Labor, materials, quotations & margins',
    },
    {
      role: 'ENGINEER',
      label: 'Engineering Desk',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      desc: 'Drawings, site inspections, defects & QA',
    },
    {
      role: 'BUILDER',
      label: 'Developer Console',
      icon: <Building2 className="w-4 h-4 text-purple-400" />,
      desc: 'Portfolio analytics, teams & master budget',
    },
  ];

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'English', label: 'English', native: 'EN' },
    { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
    { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  ];

  const currentRoleInfo = roles.find((r) => r.role === currentRole);
  const activeProj = allProjects.find((p) => p.id === activeProjectId);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left Zone: Brand Wordmark & Project Selector */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-white shadow-sm shadow-blue-500/20">
                <span className="text-lg font-black tracking-tighter">CV</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                  CIVORA
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:inline">
                  Build Smarter · Manage Better
                </span>
              </div>
            </div>

            {/* Project Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700/80 transition-colors"
                title="Change Active Construction Project"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="max-w-[150px] truncate">{activeProj?.name || 'Select Project'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProjectMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsProjectMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Construction Project
                  </div>
                  {allProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProjectId(p.id);
                        setIsProjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-slate-800 transition-colors ${
                        p.id === activeProjectId ? 'bg-blue-950/60 text-blue-300 font-medium' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{p.overallProgress}%</span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">{p.type} · {p.location.split(',')[1] || p.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Zone: Active Role Pill & Switcher */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 hover:bg-blue-900/40 text-blue-200 transition-colors"
              >
                {currentRoleInfo?.icon}
                <span className="text-xs font-semibold">{currentRoleInfo?.label}</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-blue-900/80 text-blue-300 rounded border border-blue-700/50">
                  Switch Role
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
              </button>

              {isRoleMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Select CIVORA Workspace Role
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start gap-2.5 hover:bg-slate-800 transition-colors ${
                        r.role === currentRole ? 'bg-blue-900/30 text-blue-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="mt-0.5">{r.icon}</div>
                      <div>
                        <div className="font-medium text-slate-200">{r.label}</div>
                        <div className="text-[11px] text-slate-400">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Zone: AI Voice Assistant, Internal Memos, Language & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual AI Voice Assistant Trigger */}
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-blue-500/25 transition-all"
              title="Launch Civora Multilingual AI Voice Copilot"
            >
              <Mic className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
              <span className="hidden sm:inline">AI Voice Copilot</span>
              <span className="text-[10px] bg-blue-800/80 px-1 py-0.2 rounded font-mono text-blue-100">
                {languages.find((l) => l.code === selectedLanguage)?.native || 'EN'}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-md border border-slate-700/80 transition-colors"
                title="Select Assistant Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">{selectedLanguage}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50"
                  onMouseLeave={() => setIsLangMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Voice Assistant Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLanguage(l.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                        l.code === selectedLanguage ? 'text-blue-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="font-mono text-[11px] text-slate-400">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reports System Button */}
            {onOpenReports && (
              <button
                onClick={onOpenReports}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-750 border border-slate-700 rounded-md transition-colors"
                title="Professional Site Reports & Certificates"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Reports</span>
              </button>
            )}

            {/* Internal Memos Button (strictly for Contractor, Engineer, Builder) */}
            {currentRole !== 'CUSTOMER' && (
              <button
                onClick={() => setIsPrivateDiscussionOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-md transition-colors"
                title="Confidential Internal Site Memos (Hidden from Customer)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Internal Memo</span>
              </button>
            )}

            {/* User Profile & Quick Actions */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-slate-200">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser?.organization}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                title="Log Out of Civora"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Switch Role
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs ${
                    r.role === currentRole
                      ? 'bg-blue-900/40 border-blue-700 text-blue-200 font-semibold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Project: {activeProj?.name}</span>
              <button
                onClick={resetAllData}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Banner / Prototype Environment Notice */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>
              Active Role: <strong className="text-slate-200">{currentRole}</strong> ({currentUser?.name}) ·{' '}
              <span className="text-slate-400">Project: {activeProj?.name}</span>
            </span>
          </div>
          <div className="text-[10px] text-slate-400 hidden md:block">
            Civil Prototype · Enterprise Role Simulation
          </div>
        </div>
      </div>
    </header>
  );
};
