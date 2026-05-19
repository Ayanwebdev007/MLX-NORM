import React from 'react';
import { ArrowRight, Award, FileText, UserCheck, ShieldCheck, Beaker } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { useAuth } from '../../context/AuthContext';

const WelcomeStep = () => {
  const { startRegistration } = useRegistration();
  const { user } = useAuth();

  const stepsList = [
    { num: '1', label: 'Article', icon: <FileText size={20} /> },
    { num: '2', label: 'Owner', icon: <UserCheck size={20} /> },
    { num: '3', label: 'Authority', icon: <ShieldCheck size={20} /> },
    { num: '4', label: 'Scientists', icon: <UserCheck size={20} /> },
    { num: '5', label: 'Chemicals', icon: <Beaker size={20} /> },
  ];

  return (
    <div className="w-full bg-gradient-to-br from-green-600 to-green-700 rounded-3xl overflow-hidden shadow-2xl border border-green-800 select-none mt-6 text-white">
      
      {/* Side-by-Side Flex Layout */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/15 min-h-[420px]">
        
        {/* Left Column: Call to Action & Account (45%) */}
        <div className="w-full md:w-[45%] p-10 md:p-12 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white w-fit">
              <Award size={16} className="text-white animate-pulse" />
              <span className="text-xs md:text-sm font-normal tracking-wider uppercase">Verified Certificate Portal</span>
            </div>

            {/* Title & Desc */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-light tracking-wider uppercase text-white leading-tight">
                MLX NORM <br className="hidden lg:inline" />REGISTRATION
              </h1>
              <p className="text-base lg:text-lg font-light text-white leading-relaxed opacity-95">
                Start your 5 step registration process.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={startRegistration}
              className="w-full inline-flex items-center justify-center gap-3 py-4.5 px-8 rounded-2xl text-base font-normal text-green-700 bg-white hover:bg-green-50 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl"
            >
              <span>Start Registration</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Footnote */}
          <div className="pt-6 border-t border-white/10 text-sm font-light text-white opacity-80">
            Account: <span className="font-normal text-white">{user?.email}</span>
          </div>
        </div>

        {/* Right Column: Roadmap & Certificate Preview (55%) */}
        <div className="w-full md:w-[55%] p-10 md:p-12 bg-black/10 space-y-8 flex flex-col justify-center">
          
          {/* Graphical Roadmap */}
          <div className="space-y-3">
            <span className="text-sm font-normal tracking-wider text-white uppercase block opacity-90">Process Map</span>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between relative">
                {/* Connector Line */}
                <div className="absolute top-7 left-[10%] right-[10%] h-[1px] bg-white/25 -z-0" />
                
                {stepsList.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center relative z-10 space-y-1.5">
                    <div className="h-14 w-14 rounded-full bg-white text-green-600 flex items-center justify-center shadow-md text-base font-normal">
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] font-normal text-white/90">Step {step.num}</span>
                      <span className="block text-xs font-normal text-white">{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certificate Promo */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
            {/* Mock Certificate Preview */}
            <div className="w-48 bg-white border-2 border-green-700 rounded-xl p-4 shadow-md shrink-0 relative overflow-hidden select-none">
              <div className="absolute inset-0.5 border border-green-150" />
              <div className="relative space-y-2.5 text-center py-1">
                <div className="text-[7px] text-green-600 font-normal uppercase tracking-widest leading-none">MLX Authority</div>
                <div className="text-[9px] font-normal text-slate-900 leading-none">APPROVAL CERTIFICATE</div>
                <div className="h-[0.5px] bg-green-200 w-1/2 mx-auto" />
                <div className="text-[6px] text-slate-800 font-light leading-snug">Verified compliance standards code.</div>
                <div className="flex justify-between items-center text-[5px] text-slate-800 font-light pt-1 px-1">
                  <span>Online Link</span>
                  <div className="h-3 w-3 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-[7px] font-bold">✓</div>
                  <span>Officer</span>
                </div>
              </div>
            </div>
            
            {/* Certificate description */}
            <div className="space-y-2">
              <h3 className="text-base font-normal text-white">Compliance Certificate</h3>
              <p className="text-sm text-white font-light leading-relaxed opacity-95">
                Immediately download your official compliance certificate in PDF format once approved.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WelcomeStep;
