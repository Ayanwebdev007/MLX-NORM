import React from 'react';
import { User, Globe, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

const ScientistDetailsStep = () => {
  const {
    closingScientistName, setClosingScientistName, closingScientistInstitution, setClosingScientistInstitution, closingScientistId, setClosingScientistId,
    openingScientistName, setOpeningScientistName, openingScientistInstitution, setOpeningScientistInstitution, openingScientistId, setOpeningScientistId,
    formError, setFormError, setWizardState, handleSubmitRegistration
  } = useRegistration();

  const fields = [
    { label: 'Name', icon: <User size={18} />, placeholder: 'e.g. Dr. Jane Smith' },
    { label: 'Institution Name', icon: <Globe size={18} />, placeholder: 'e.g. National Physics Lab' },
    { label: 'ID Number', icon: <FileText size={18} />, placeholder: 'e.g. SCI-77665' },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 select-none">
        <div>
          <span className="text-[10px] font-normal text-green-600 uppercase tracking-widest block">Step 4 of 5</span>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">Scientist Details</h2>
        </div>
        <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">Scientists</span>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-normal mt-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><span className="font-medium">Missing Details:</span> {formError}</div>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-10 mt-6">
        {[
          { title: 'Closing Scientist Details', values: [closingScientistName, closingScientistInstitution, closingScientistId], setters: [setClosingScientistName, setClosingScientistInstitution, setClosingScientistId] },
          { title: 'Opening Scientist Details', values: [openingScientistName, openingScientistInstitution, openingScientistId], setters: [setOpeningScientistName, setOpeningScientistInstitution, setOpeningScientistId] },
        ].map((section, si) => (
          <div key={si} className="space-y-4">
            <div className={si > 0 ? 'pb-1 pt-2' : 'pb-1'}>
              <h3 className="text-sm font-normal text-slate-800 uppercase tracking-wider">{section.title}</h3>
              <div className="h-[1px] bg-slate-200 w-full mt-1.5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {fields.map((f, fi) => (
                <div key={fi}>
                  <label className="block text-sm font-normal text-slate-900 mb-2">{f.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800">{f.icon}</div>
                    <input type="text" required placeholder={f.placeholder} value={section.values[fi]} onChange={(e) => section.setters[fi](e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200 select-none z-10 mt-10">
          <button type="button" onClick={() => setWizardState('step3')} className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-normal text-slate-900 transition-colors cursor-pointer bg-white shadow-sm">Back</button>
          <button type="button" onClick={() => { setFormError(''); setWizardState('step5'); }} className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md">
            <span>Next Step</span><ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScientistDetailsStep;
