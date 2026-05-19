import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, RefreshCw } from 'lucide-react';
import { RegistrationProvider, useRegistration } from '../context/RegistrationContext';

import DashboardStepper from '../components/dashboard/DashboardStepper';
import WelcomeStep from '../components/dashboard/WelcomeStep';
import ArticleDescriptionStep from '../components/dashboard/ArticleDescriptionStep';
import OwnerMediaStep from '../components/dashboard/OwnerMediaStep';
import WorkingAuthorityStep from '../components/dashboard/WorkingAuthorityStep';
import ScientistDetailsStep from '../components/dashboard/ScientistDetailsStep';
import ChemicalDetailsStep from '../components/dashboard/ChemicalDetailsStep';
import SubmittedOverview from '../components/dashboard/SubmittedOverview';

const DashboardContent = () => {
  const { logout } = useAuth();
  const { loadingApp, wizardState } = useRegistration();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans pb-20">
      {/* Header Bar */}
      <header className="bg-green-50 border-b border-green-100 py-4 px-6 mb-8 sticky top-0 z-40 select-none shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-green-600 border border-green-200 shadow-xs">
              <User size={18} />
            </div>
            <div>
              <h1 className="text-base font-normal text-slate-900 tracking-tight">Customer Portal</h1>
              <p className="text-[10px] text-green-700 font-normal uppercase tracking-wider">MLX NORM REGISTRATION</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-green-200 hover:border-green-300 text-green-700 hover:bg-green-100/50 active:scale-95 transition-all duration-150 cursor-pointer bg-white"
          >
            <LogOut size={14} />
            <span className="text-xs font-normal">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {loadingApp ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw size={28} className="text-green-600 animate-spin" />
            <span className="text-xs font-light text-slate-800 uppercase tracking-wider">Loading your registration...</span>
          </div>
        ) : (
          <div className="space-y-8">
            <DashboardStepper />
            {wizardState === 'welcome' && <WelcomeStep />}
            {wizardState === 'step1' && <ArticleDescriptionStep />}
            {wizardState === 'step2' && <OwnerMediaStep />}
            {wizardState === 'step3' && <WorkingAuthorityStep />}
            {wizardState === 'step4' && <ScientistDetailsStep />}
            {wizardState === 'step5' && <ChemicalDetailsStep />}
            {wizardState === 'submitted' && <SubmittedOverview />}
          </div>
        )}
      </main>
    </div>
  );
};

const UserDashboard = () => (
  <RegistrationProvider>
    <DashboardContent />
  </RegistrationProvider>
);

export default UserDashboard;
