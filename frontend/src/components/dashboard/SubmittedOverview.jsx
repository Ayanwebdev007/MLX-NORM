import React from 'react';
import { FileText, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, Trash2, Download } from 'lucide-react';
import { generateCertificatePDF } from '../../utils/certificateGenerator';
import { useRegistration } from '../../context/RegistrationContext';
import { API_BASE_URL } from '../../utils/config';

const SubmittedOverview = () => {
  const { application, handleDeleteApplication, deletingApp, setWizardState } = useRegistration();

  if (!application) return null;

  const triggerReEdit = () => setWizardState('step1');

  const statusConfig = {
    Approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
    Rejected: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', icon: <AlertCircle size={14} /> },
    'Under Review': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: <RefreshCw size={14} className="animate-spin" /> },
    Pending: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: <RefreshCw size={14} /> },
  };

  const sc = statusConfig[application.status] || statusConfig.Pending;

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-light text-slate-800">{label}</span>
      <span className="text-sm font-normal text-slate-800">{value || '—'}</span>
    </div>
  );

  const SectionTitle = ({ icon, title, accent }) => (
    <div className="flex items-center gap-3 pb-4">
      <div className={`h-8 w-8 rounded-lg ${accent || 'bg-slate-100'} flex items-center justify-center text-slate-800 shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-normal text-slate-800 uppercase tracking-widest">{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Status Banner */}
      <div className={`${sc.bg} border ${sc.border} rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl ${sc.bg} border ${sc.border} flex items-center justify-center ${sc.text}`}>
            {sc.icon}
          </div>
          <div>
            <h2 className="text-lg font-normal text-slate-800 tracking-tight">Application Submitted</h2>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5 select-none">
              {application.registrationNumber && (
                <span className="text-xs text-green-600 font-normal tracking-wider uppercase">REG: {application.registrationNumber}</span>
              )}
              <span className="text-slate-800 text-xs hidden sm:inline">&bull;</span>
              <span className="text-[10px] text-slate-800 font-light uppercase tracking-wider">ID: {application._id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-normal uppercase tracking-wider border select-none ${sc.bg} ${sc.text} ${sc.border}`}>
            {sc.icon}
            <span>{application.status}</span>
          </div>
          {application.status === 'Approved' && (
            <button
              onClick={() => generateCertificatePDF(application)}
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <Download size={14} />
              <span>Download Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Feedback */}
      {application.adminRemarks && (
        <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/60 flex items-start gap-3">
          <MessageSquare size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-normal text-amber-700 uppercase tracking-wider block mb-1">Admin Feedback</span>
            <p className="text-sm font-light text-slate-700 leading-relaxed">{application.adminRemarks}</p>
          </div>
        </div>
      )}

      {/* Section 1: Article Description */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <SectionTitle icon={<FileText size={16} />} title="Article Description" accent="bg-green-50" />
          <div className="divide-y divide-slate-100">
            <InfoRow label="Inspection Date" value={application.articleDescription?.date?.substring(0, 10)} />
            <InfoRow label="Physical Shape" value={application.articleDescription?.shape} />
            <InfoRow label="Dimensions" value={application.articleDescription?.size} />
            <InfoRow label="Net Weight" value={application.articleDescription?.weight} />
            <InfoRow label="Year of Establishment" value={application.articleDescription?.yearOfEstablishment} />
            <InfoRow label="Origin" value={application.articleDescription?.origin} />
            <InfoRow label="Max Radiation (MR)" value={application.articleDescription?.mr} />
            <InfoRow label="Residual Radiation (RR)" value={application.articleDescription?.rr} />
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-light text-slate-800">Operation Condition</span>
              <span className="bg-green-50 text-green-700 text-xs font-normal px-3 py-1 rounded-lg border border-green-200">
                {application.articleDescription?.conditionOfOperation}
              </span>
            </div>
          </div>

          {application.articleDescription?.imageUrl && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-normal text-slate-800 uppercase tracking-widest block mb-3">Article Image</span>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-w-sm shadow-xs">
                <img src={`${API_BASE_URL}${application.articleDescription.imageUrl}`} alt="Article" className="w-full h-44 object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Owner & Media */}
      {application.ownerDetails && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <SectionTitle icon={<FileText size={16} />} title="Owner & Media Details" accent="bg-blue-50" />
            <div className="divide-y divide-slate-100">
              <InfoRow label="Owner Name" value={application.ownerDetails.name} />
              <InfoRow label="Owner Address" value={application.ownerDetails.address} />
              <InfoRow label="Aadhar Card" value={application.ownerDetails.aadharCardNumber} />
              <InfoRow label="PAN Card" value={application.ownerDetails.panCardNumber} />
              <InfoRow label="Mobile" value={application.ownerDetails.mobileNumber} />
              <InfoRow label="Email" value={application.ownerDetails.email} />
            </div>

            {/* Images row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 mt-4 border-t border-slate-100">
              {[
                { url: application.ownerDetails.ownerImageUrl, label: 'Owner Photo' },
                { url: application.ownerDetails.signatureUrl, label: 'Signature' },
                { url: application.ownerDetails.mediaDetails?.mediaUrl, label: 'Media File' },
              ].filter(img => img.url).map((img, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-[10px] font-normal text-slate-800 uppercase tracking-widest block">{img.label}</span>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={`${API_BASE_URL}${img.url}`} alt={img.label} className="w-full h-28 object-cover" />
                  </div>
                </div>
              ))}
            </div>

            {/* Media details sub-section */}
            {application.ownerDetails.mediaDetails && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-normal text-slate-800 uppercase tracking-widest block mb-3">Media Owner Info</span>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Media Owner" value={application.ownerDetails.mediaDetails.name} />
                  <InfoRow label="Media Address" value={application.ownerDetails.mediaDetails.address} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 3: Working Authority */}
      {application.workingAuthority && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <SectionTitle icon={<FileText size={16} />} title="Working Authority" accent="bg-violet-50" />
            <div className="divide-y divide-slate-100">
              <InfoRow label="Authority Type" value={application.workingAuthority.authorityType} />
              <InfoRow label="Name" value={application.workingAuthority.name} />
              <InfoRow label="Contact" value={application.workingAuthority.contactNumber} />
              <InfoRow label="License No." value={application.workingAuthority.licenseNumber} />
              <InfoRow label="Working Code" value={application.workingAuthority.workingCodeNumber} />
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Scientists */}
      {application.scientistDetails && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <SectionTitle icon={<FileText size={16} />} title="Scientist Details" accent="bg-orange-50" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Closing Scientist', data: application.scientistDetails.closingScientist },
                { title: 'Opening Scientist', data: application.scientistDetails.openingScientist },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50/60 rounded-xl border border-slate-100 p-5">
                  <span className="text-[11px] font-normal text-slate-800 uppercase tracking-wider block mb-3">{s.title}</span>
                  <div className="divide-y divide-slate-100/80">
                    <div className="flex justify-between text-sm py-2">
                      <span className="font-light text-slate-800">Name</span>
                      <span className="font-normal text-slate-700">{s.data?.name || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="font-light text-slate-800">Institution</span>
                      <span className="font-normal text-slate-700">{s.data?.institutionName || '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                      <span className="font-light text-slate-800">ID Number</span>
                      <span className="font-normal text-slate-700">{s.data?.idNumber || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Chemicals */}
      {application.chemicalDetails && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6">
            <SectionTitle icon={<FileText size={16} />} title="Chemical Details" accent="bg-teal-50" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Closing Chemicals', data: application.chemicalDetails.closingChemicals },
                { title: 'Packing Chemicals', data: application.chemicalDetails.packingChemicals },
                { title: 'Opening Chemicals', data: application.chemicalDetails.openingChemicals },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50/60 rounded-xl border border-slate-100 p-5">
                  <span className="text-[11px] font-normal text-slate-800 uppercase tracking-wider block mb-3">{s.title}</span>
                  {s.data?.length > 0 ? (
                    <ul className="space-y-2">
                      {s.data.map((chem, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-sm">
                          <span className="text-xs text-slate-800 font-mono w-4 text-right">{idx + 1}.</span>
                          <span className="text-slate-700 font-light">{chem}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-slate-800 italic font-light">None declared</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {application.status !== 'Approved' && (
        <div className="flex justify-end gap-3 select-none pt-2">
          <button
            onClick={handleDeleteApplication}
            disabled={deletingApp}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl text-xs font-normal text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={13} />
            <span>{deletingApp ? 'Deleting...' : 'Delete Application'}</span>
          </button>
          <button
            onClick={triggerReEdit}
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-normal text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} />
            <span>Modify Details</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmittedOverview;
