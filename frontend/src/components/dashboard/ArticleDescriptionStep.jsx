import React from 'react';
import { Calendar, Layers, Compass, Scale, Globe, ShieldAlert, X, RefreshCw, UploadCloud, ArrowRight, AlertCircle } from 'lucide-react';
import { useRegistration } from '../../context/RegistrationContext';
import { API_BASE_URL } from '../../utils/config';

const ArticleDescriptionStep = () => {
  const {
    date, setDate, shape, setShape, size, setSize, weight, setWeight, yearOfEstablishment, setYearOfEstablishment,
    mr, setMr, rr, setRr, conditionOfOperation, setConditionOfOperation, origin, setOrigin, imageUrl, setImageUrl,
    formError, setFormError, setWizardState, handleSubmitRegistration, handleFileUpload,
    uploadingImage, uploadError, cancelRegistration
  } = useRegistration();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 select-none">
        <div>
          <span className="text-[10px] font-normal text-green-600 uppercase tracking-widest block">Step 1 of 5</span>
          <h2 className="text-2xl font-light text-slate-800 tracking-tight">Article Description</h2>
        </div>
        <span className="bg-green-50 border border-green-100 text-green-700 text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-wider">
          Description
        </span>
      </div>

      {formError && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-normal mt-6">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div><span className="font-medium">Missing Details:</span> {formError}</div>
        </div>
      )}

      <form onSubmit={handleSubmitRegistration} className="space-y-10 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Inspection Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Calendar size={18} /></div>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Physical Shape</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Layers size={18} /></div>
              <input type="text" required placeholder="e.g. Round Cylindrical" value={shape} onChange={(e) => setShape(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Dimensions / Size</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Compass size={18} /></div>
              <input type="text" required placeholder="e.g. 150mm x 50mm" value={size} onChange={(e) => setSize(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Net Weight</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Scale size={18} /></div>
              <input type="text" required placeholder="e.g. 1.2 kg" value={weight} onChange={(e) => setWeight(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Year of Establishment</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Calendar size={18} /></div>
              <input type="text" required placeholder="e.g. 2021" value={yearOfEstablishment} onChange={(e) => setYearOfEstablishment(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">Origin of the Article</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Globe size={18} /></div>
              <input type="text" required placeholder="e.g. Germany, Berlin Hub" value={origin} onChange={(e) => setOrigin(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">MR (Max Radiation Index)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><ShieldAlert size={18} /></div>
              <input type="text" required placeholder="e.g. 0.45 mSv/h" value={mr} onChange={(e) => setMr(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-normal text-slate-900 mb-2">RR (Residual Radiation Index)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><ShieldAlert size={18} /></div>
              <input type="text" required placeholder="e.g. 0.12 mSv/h" value={rr} onChange={(e) => setRr(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm font-normal" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-normal text-slate-900 mb-2">Condition at the time of operation</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><Layers size={18} /></div>
            <select value={conditionOfOperation} onChange={(e) => setConditionOfOperation(e.target.value)}
              className="block w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm appearance-none cursor-pointer font-normal">
              <option value="Chemical Pack">Chemical Pack</option>
              <option value="Normal Pack">Normal Pack</option>
              <option value="Gel Pack">Gel Pack</option>
              <option value="Dry Ice Pack">Dry Ice Pack</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-800">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-normal text-slate-900">Article Image Proof</label>
          {imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 group max-w-sm">
              <img src={`${API_BASE_URL}${imageUrl}`} alt="Uploaded proof" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button type="button" onClick={() => setImageUrl('')} className="bg-red-600 hover:bg-red-500 text-white rounded-xl py-2 px-3.5 text-xs font-normal flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer shadow-sm">
                  <X size={14} /><span>Remove Image</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 hover:border-green-400 rounded-2xl p-6 transition-colors duration-200 bg-white flex flex-col items-center justify-center text-center cursor-pointer relative group min-h-[160px]">
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw size={24} className="text-green-600 animate-spin" />
                  <span className="text-[10px] font-normal text-slate-800 uppercase tracking-wider">Uploading file to server...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100/50 group-hover:scale-105 transition-transform">
                    <UploadCloud size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Click or Drop Image to Upload</span>
                    <span className="text-[10px] text-slate-800 block mt-0.5 font-light">JPEG, PNG, WebP or GIF (Max 5MB)</span>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'article')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingImage} />
            </div>
          )}
          {uploadError && <span className="text-[10px] font-normal text-rose-600 block">{uploadError}</span>}
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md flex items-center justify-end gap-3 pt-4 pb-2 border-t border-slate-200 select-none z-10">
          <button type="button" onClick={cancelRegistration}
            className="py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-sm font-normal text-slate-900 transition-colors cursor-pointer bg-white shadow-sm">Cancel</button>
          <button type="button" onClick={() => { setFormError(''); setWizardState('step2'); }}
            className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md">
            <span>Next Step</span><ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleDescriptionStep;
