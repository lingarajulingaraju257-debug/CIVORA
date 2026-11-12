import React from 'react';
import { CivoraProvider, useCivora } from './context/CivoraContext';
import { Header } from './components/common/Header';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { ContractorDashboard } from './components/dashboards/ContractorDashboard';
import { EngineerDashboard } from './components/dashboards/EngineerDashboard';
import { BuilderDashboard } from './components/dashboards/BuilderDashboard';
import { VoiceAssistantModal } from './components/common/VoiceAssistantModal';
import { PrivateDiscussionModal } from './components/common/PrivateDiscussionModal';
import { ImageModal } from './components/common/ImageModal';
import { ReportViewerModal } from './components/common/ReportViewerModal';
import { HardHat, Users, Compass, Building2, Mic, Lock, FileText } from 'lucide-react';
import { UserRole } from './types';

const MainApp: React.FC = () => {
  const {
    isLoggedIn,
    currentRole,
    switchRole,
    setIsVoiceAssistantOpen,
    setIsPrivateDiscussionOpen,
  } = useCivora();

  const [isReportsOpen, setIsReportsOpen] = React.useState(false);

  if (!isLoggedIn) {
    return <WelcomeScreen />;
  }

  const roleButtons: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'CUSTOMER', label: 'Customer', icon: <Users className="w-3.5 h-3.5" /> },
    { role: 'CONTRACTOR', label: 'Contractor', icon: <HardHat className="w-3.5 h-3.5" /> },
    { role: 'ENGINEER', label: 'Engineer', icon: <Compass className="w-3.5 h-3.5" /> },
    { role: 'BUILDER', label: 'Builder', icon: <Building2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header onOpenReports={() => setIsReportsOpen(true)} />

      {/* Main Role Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12">
        {currentRole === 'CUSTOMER' && <CustomerDashboard />}
        {currentRole === 'CONTRACTOR' && <ContractorDashboard />}
        {currentRole === 'ENGINEER' && <EngineerDashboard />}
        {currentRole === 'BUILDER' && <BuilderDashboard />}
      </main>

      {/* Floating Quick Floating Action Bar for Mobile & Instant Multi-Role Inspection */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 border border-slate-700/90 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md flex items-center gap-1.5 max-w-[94vw] overflow-x-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-2 pr-1 hidden sm:inline">
          Test Role:
        </span>
        {roleButtons.map((rb) => (
          <button
            key={rb.role}
            onClick={() => switchRole(rb.role)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              currentRole === rb.role
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {rb.icon}
            <span>{rb.label}</span>
          </button>
        ))}

        <div className="h-4 w-[1px] bg-slate-700 mx-1 hidden sm:block" />

        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          title="Multilingual AI Voice Assistant"
        >
          <Mic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Voice</span>
        </button>

        <button
          onClick={() => setIsReportsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:bg-slate-750 transition-colors whitespace-nowrap shadow-sm"
          title="Professional Construction Reports"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Reports</span>
        </button>

        {currentRole !== 'CUSTOMER' && (
          <button
            onClick={() => setIsPrivateDiscussionOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80 hover:bg-amber-900/80 transition-colors whitespace-nowrap"
            title="Private Internal Site Memo"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Internal</span>
          </button>
        )}
      </div>

      {/* Global Modals */}
      <VoiceAssistantModal />
      <PrivateDiscussionModal />
      <ImageModal />
      <ReportViewerModal isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <CivoraProvider>
      <MainApp />
    </CivoraProvider>
  );
}
