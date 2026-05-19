import React from 'react';
import { User, Globe, FileText, Layers, Compass, ArrowRight, AlertCircle } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';

const WorkingAuthorityStep = () => {
  const {
    authorityType, setAuthorityType, authorityName, setAuthorityName, authorityAddress, setAuthorityAddress,
    workingCodeNumber, setWorkingCodeNumber, authorityContact, setAuthorityContact, licenseNumber, setLicenseNumber,
    formError, setFormError, setWizardState, handleSubmitRegistration
  } = useRegistration();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 select-none">
        <div>
          <span className="text-[10px] font-normal text-green-600 uppercase tracking-widest block">Step 3 of 5</span>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">Working Authority</h2>
        </div>
        <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">Authority</span>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-normal mt-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><span className="font-medium">Missing Details:</span> {formError}</div>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-10 mt-6">
        <div className="pb-1">
          <h3 className="text-sm font-normal text-slate-800 uppercase tracking-wider">Authority Type Selection</h3>
          <div className="h-[1px] bg-slate-200 w-full mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
          {[
            { value: 'Company', label: 'Company', desc: 'Register as a registered corporate entity' },
            { value: 'Auctioneer', label: 'Auctioneer', desc: 'Register as a certified independent auctioneer' },
          ].map(opt => (
            <label key={opt.value} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${authorityType === opt.value ? 'border-green-500 bg-green-50/20' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-[18px] w-[18px] rounded-full border flex items-center justify-center transition-colors ${authorityType === opt.value ? 'border-green-600 bg-green-600' : 'border-slate-300 bg-white'}`}>
                  {authorityType === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <div className="text-sm">
                  <span className="block font-medium text-slate-800">{opt.label}</span>
                  <span className="text-xs text-slate-800 font-light mt-0.5">{opt.desc}</span>
                </div>
              </div>
              <input type="radio" name="authorityType" value={opt.value} checked={authorityType === opt.value} onChange={() => setAuthorityType(opt.value)} className="sr-only" />
            </label>
          ))}
        </div>

        <div className="pb-1 pt-2">
          <h3 className="text-sm font-normal text-slate-800 uppercase tracking-wider">Working Details</h3>
          <div className="h-[1px] bg-slate-200 w-full mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { label: 'Authority / Company Name', icon: <User size={18} />, value: authorityName, onChange: setAuthorityName, placeholder: 'e.g. Acme Corp', type: 'text' },
            { label: 'Contact Number', icon: <Globe size={18} />, value: authorityContact, onChange: setAuthorityContact, placeholder: 'e.g. +91 9999999999', type: 'tel' },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-normal text-slate-900 mb-2">{f.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800">{f.icon}</div>
                <input type={f.type} required placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
              </div>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm font-normal text-slate-900 mb-2">Physical Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Compass size={18} /></div>
              <input type="text" required placeholder="e.g. Suite 404, Tech Park, San Francisco" value={authorityAddress} onChange={(e) => setAuthorityAddress(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          {[
            { label: 'Working Code Number', icon: <Layers size={18} />, value: workingCodeNumber, onChange: setWorkingCodeNumber, placeholder: 'e.g. WC-987654' },
            { label: 'License Number', icon: <FileText size={18} />, value: licenseNumber, onChange: setLicenseNumber, placeholder: 'e.g. LIC-ABC-12345' },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-sm font-normal text-slate-900 mb-2">{f.label}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800">{f.icon}</div>
                <input type="text" required placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200 select-none z-10 mt-10">
          <button type="button" onClick={() => setWizardState('step2')} className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-normal text-slate-900 transition-colors cursor-pointer bg-white shadow-sm">Back</button>
          <button type="button" onClick={() => { setFormError(''); setWizardState('step4'); }} className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md">
            <span>Next Step</span><ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkingAuthorityStep;
