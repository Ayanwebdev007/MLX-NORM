import React from 'react';
import { Plus, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

const ChemicalDetailsStep = () => {
  const {
    closingChemicals, packingChemicals, openingChemicals,
    handleChemicalChange, addChemicalField, removeChemicalField,
    formError, submittingForm, handleSubmitRegistration, setWizardState
  } = useRegistration();

  const sections = [
    { key: 'closing', title: 'Closing Chemical Details (if any)', data: closingChemicals },
    { key: 'packing', title: 'Chemical Used at the Time of Packing', data: packingChemicals },
    { key: 'opening', title: 'Chemical Used to Open (if any)', data: openingChemicals },
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 select-none">
        <div>
          <span className="text-[10px] font-normal text-green-600 uppercase tracking-widest block">Step 5 of 5</span>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">Chemical Details</h2>
        </div>
        <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">Chemicals</span>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-normal mt-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><span className="font-medium">Missing Details:</span> {formError}</div>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-8 mt-6">
        {sections.map((section, si) => (
          <div key={section.key} className={`space-y-4 ${si > 0 ? 'pt-4' : ''}`}>
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-normal text-slate-800 uppercase tracking-wider">{section.title}</h3>
              <button type="button" onClick={() => addChemicalField(section.key)} disabled={section.data.length >= 20}
                className="py-1.5 px-3 text-green-600 hover:bg-green-50 rounded-xl active:scale-95 transition-all flex items-center gap-1.5 text-xs font-normal border border-green-200 disabled:opacity-50 cursor-pointer bg-white">
                <Plus size={14} /><span>Add Field</span>
              </button>
            </div>
            <div className="h-[1px] bg-slate-200 w-full mt-1.5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.data.map((chem, idx) => (
                <div key={`${section.key}-${idx}`} className="relative flex items-center gap-2">
                  <span className="text-xs text-slate-800 font-mono w-6 text-right font-normal">{idx + 1}.</span>
                  <input type="text" placeholder="Chemical name / formula" value={chem} onChange={(e) => handleChemicalChange(section.key, idx, e.target.value)}
                    className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
                  {section.data.length > 4 && (
                    <button type="button" onClick={() => removeChemicalField(section.key, idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg active:scale-90 transition-all cursor-pointer border border-transparent hover:border-red-100">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200 select-none z-10 mt-10">
          <button type="button" onClick={() => setWizardState('step4')} className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-normal text-slate-900 transition-colors cursor-pointer bg-white shadow-sm">Back</button>
          <button type="submit" disabled={submittingForm}
            className="flex items-center gap-2 py-3 px-8 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-70 shadow-md">
            {submittingForm ? <><RefreshCw size={18} className="animate-spin" /><span>Submitting...</span></> : <span>Submit Application</span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChemicalDetailsStep;
