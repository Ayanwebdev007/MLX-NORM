import React from 'react';
import { User, Globe, FileText, X, RefreshCw, UploadCloud, ArrowRight, AlertCircle } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { API_BASE_URL } from '../../utils/config';

const OwnerMediaStep = () => {
  const {
    ownerName, setOwnerName, ownerAddress, setOwnerAddress, aadharCardNumber, setAadharCardNumber,
    panCardNumber, setPanCardNumber, ownerMobile, setOwnerMobile, ownerEmail, setOwnerEmail,
    ownerImageUrl, setOwnerImageUrl, ownerSignatureUrl, setOwnerSignatureUrl,
    formError, setFormError, setWizardState, handleSubmitRegistration, handleFileUpload,
    uploadingOwnerImage, ownerImageError, uploadingSignature, signatureError,
  } = useRegistration();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 select-none">
        <div>
          <span className="text-[10px] font-normal text-green-600 uppercase tracking-widest block">Step 2 of 5</span>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">Owner Details</h2>
        </div>
        <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">Owner Details</span>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-normal mt-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><span className="font-medium">Missing Details:</span> {formError}</div>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-10 mt-6">
        <div className="pb-1">
          <h3 className="text-sm font-normal text-slate-800 uppercase tracking-wider">Owner Information</h3>
          <div className="h-[1px] bg-slate-200 w-full mt-1.5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { label: 'Owner Name', icon: <User size={18} />, type: 'text', placeholder: 'e.g. John Doe', value: ownerName, onChange: setOwnerName },
            { label: 'Owner Address', icon: <Globe size={18} />, type: 'text', placeholder: 'e.g. 123 Main St, New York', value: ownerAddress, onChange: setOwnerAddress },
            { label: 'Aadhar Card Number', icon: <FileText size={18} />, type: 'text', placeholder: 'e.g. 1234 5678 9012', value: aadharCardNumber, onChange: setAadharCardNumber },
            { label: 'PAN Card Number', icon: <FileText size={18} />, type: 'text', placeholder: 'e.g. ABCDE1234F', value: panCardNumber, onChange: setPanCardNumber },
            { label: 'Mobile Number', icon: <Globe size={18} />, type: 'tel', placeholder: 'e.g. +91 9876543210', value: ownerMobile, onChange: setOwnerMobile },
            { label: 'Email Address', icon: <User size={18} />, type: 'email', placeholder: 'e.g. owner@example.com', value: ownerEmail, onChange: setOwnerEmail },
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Owner Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-normal text-slate-900">Owner Photo</label>
            {ownerImageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 group max-w-xs">
                <img src={`${API_BASE_URL}${ownerImageUrl}`} alt="Owner Profile" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button type="button" onClick={() => setOwnerImageUrl('')} className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-1.5 px-3 text-xs font-normal flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"><X size={12} /><span>Remove</span></button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-green-400 rounded-2xl p-4 transition-colors duration-200 bg-white flex flex-col items-center justify-center text-center cursor-pointer relative group min-h-[120px]">
                {uploadingOwnerImage ? <RefreshCw size={20} className="text-green-600 animate-spin" /> : (
                  <><UploadCloud size={20} className="text-slate-800 group-hover:scale-105 transition-transform" /><span className="text-[10px] font-normal text-slate-900 mt-1">Upload Owner Photo</span></>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'owner')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingOwnerImage} />
              </div>
            )}
            {ownerImageError && <span className="text-[10px] font-normal text-rose-600 block">{ownerImageError}</span>}
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <label className="block text-sm font-normal text-slate-900">Signature Upload</label>
            {ownerSignatureUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 group max-w-xs">
                <img src={`${API_BASE_URL}${ownerSignatureUrl}`} alt="Signature" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button type="button" onClick={() => setOwnerSignatureUrl('')} className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-1.5 px-3 text-xs font-normal flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"><X size={12} /><span>Remove</span></button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-green-400 rounded-2xl p-4 transition-colors duration-200 bg-white flex flex-col items-center justify-center text-center cursor-pointer relative group min-h-[120px]">
                {uploadingSignature ? <RefreshCw size={20} className="text-green-600 animate-spin" /> : (
                  <><UploadCloud size={20} className="text-slate-800 group-hover:scale-105 transition-transform" /><span className="text-[10px] font-normal text-slate-900 mt-1">Upload Signature</span></>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingSignature} />
              </div>
            )}
            {signatureError && <span className="text-[10px] font-normal text-rose-600 block">{signatureError}</span>}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md flex items-center justify-between gap-3 pt-4 pb-2 border-t border-slate-200 select-none z-10 mt-10">
          <button type="button" onClick={() => setWizardState('step1')} className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-normal text-slate-900 transition-colors cursor-pointer bg-white shadow-sm">Back</button>
          <button type="button" onClick={() => { setFormError(''); setWizardState('step3'); }} className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md">
            <span>Next Step</span><ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerMediaStep;
