import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  UserPlus, Users, LogOut, ShieldCheck, Mail, KeyRound, User, CircleAlert, 
  CircleCheck, X, Pencil, Trash2, FileText, CheckCircle2, AlertCircle, RefreshCw, Eye,
  ArrowLeft, ChevronRight, Clock
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/config';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [applicationsList, setApplicationsList] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [lightboxUrl, setLightboxUrl] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [reviewingApp, setReviewingApp] = useState(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const [reviewStatus, setReviewStatus] = useState('Pending');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewTab, setReviewTab] = useState('step1');
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [dashError, setDashError] = useState('');
  const [dashSuccess, setDashSuccess] = useState('');

  const standardUsersOnly = usersList.filter(acc => acc.role !== 'admin');

  const fetchRegisteredUsers = async () => {
    if (!user) return;
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUsersList(data);
      } else {
        if (response.status === 401) {
          setDashError('Active administrative session has expired or is stale (database was seeded). Please click Sign Out and sign in again to sync credentials.');
        } else {
          setDashError(data.message || 'Failed to retrieve registered user logs.');
        }
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setDashError('Network error occurred while fetching user credentials.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    setLoadingApplications(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setApplicationsList(data);
      } else {
        if (response.status !== 401) {
          setDashError(data.message || 'Failed to retrieve application registrations.');
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setDashError('Network error occurred while fetching registrations.');
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchRegisteredUsers();
    fetchApplications();
  }, [user]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) {
      setFormError('Please fill in all user credential fields.');
      setFormSuccess('');
      return;
    }
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: 'user' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Account creation failed');
      setFormSuccess(`Account successfully generated for ${data.name}!`);
      setNewName(''); setNewEmail(''); setNewPassword('');
      setTimeout(() => { setShowCreateModal(false); setFormSuccess(''); }, 1500);
      fetchRegisteredUsers();
    } catch (err) {
      setFormError(err.message || 'An error occurred during account creation.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEdit = (acc) => {
    setEditingUser(acc);
    setEditName(acc.name);
    setEditEmail(acc.email);
    setEditPassword('');
    setFormError('');
    setFormSuccess('');
    setShowEditModal(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editName || !editEmail) {
      setFormError('Name and Email fields are required.');
      setFormSuccess('');
      return;
    }
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const bodyPayload = { name: editName, email: editEmail, role: editingUser.role };
      if (editPassword) bodyPayload.password = editPassword;
      const response = await fetch(`${API_BASE_URL}/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(bodyPayload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Account update failed');
      setFormSuccess(`Account successfully updated for ${data.name}!`);
      setTimeout(() => { setShowEditModal(false); setEditingUser(null); setFormSuccess(''); }, 1500);
      fetchRegisteredUsers();
    } catch (err) {
      setFormError(err.message || 'An error occurred while updating the account.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (id === user._id) {
      setDashError('Action Restrained: You cannot delete your own administrative account.');
      setDashSuccess('');
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to permanently delete the user account for "${name}"?`)) return;
    setDashError(''); setDashSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Account deletion failed');
      setDashSuccess(`Account for "${name}" was successfully deleted.`);
      fetchRegisteredUsers();
    } catch (err) {
      setDashError(err.message || 'An error occurred during account deletion.');
    }
  };

  const handleOpenReview = (app) => {
    setReviewingApp(app);
    setReviewStatus(app.status || 'Pending');
    setReviewRemarks(app.adminRemarks || '');
    setReviewTab('step1');
    setFormError('');
    setFormSuccess('');
  };

  const handleBackToList = () => {
    setReviewingApp(null);
    setFormError('');
    setFormSuccess('');
    setReviewRemarks('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${reviewingApp._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ status: reviewStatus, adminRemarks: reviewRemarks })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update application review status');
      setFormSuccess('Registration review status updated successfully!');
      fetchApplications();
      setReviewingApp(prev => ({ ...prev, status: reviewStatus, adminRemarks: reviewRemarks }));
    } catch (err) {
      setFormError(err.message || 'An error occurred while updating status.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteApplication = async (appId, appName) => {
    if (!window.confirm(`Are you sure you want to permanently delete the application for "${appName}"? This action cannot be undone.`)) return;
    setDashError(''); setDashSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Application deletion failed');
      setDashSuccess(`Application for "${appName}" was successfully deleted.`);
      fetchApplications();
      if (reviewingApp && reviewingApp._id === appId) {
        setReviewingApp(null);
      }
    } catch (err) {
      setDashError(err.message || 'An error occurred during application deletion.');
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false); setFormError(''); setFormSuccess('');
    setNewName(''); setNewEmail(''); setNewPassword('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false); setEditingUser(null); setFormError(''); setFormSuccess('');
    setEditName(''); setEditEmail(''); setEditPassword('');
  };

  // Helper components
  const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-normal uppercase tracking-wider border select-none ${
      status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200'
      : status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-green-50 text-green-700 border-green-200'
    }`}>
      {status === 'Approved' && <CheckCircle2 size={10} />}
      {status === 'Rejected' && <AlertCircle size={10} />}
      {status === 'Under Review' && <RefreshCw size={10} className="animate-spin" />}
      {status === 'Pending' && <Clock size={10} />}
      <span>{status}</span>
    </span>
  );

  const DataRow = ({ label, value, full }) => (
    <div className={`py-3 border-b border-slate-100 flex items-start justify-between gap-4 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm font-medium text-slate-800 shrink-0">{label}</span>
      <span className="text-sm font-normal text-slate-800 text-right">{value || <span className="text-slate-800 italic font-normal">—</span>}</span>
    </div>
  );

  const ImagePreview = ({ url, label }) => (
    <div>
      <span className="text-[10px] font-normal text-slate-800 uppercase tracking-wider block mb-2">{label}</span>
      <div
        onClick={() => setLightboxUrl(url)}
        className="h-32 rounded-xl border border-slate-200 overflow-hidden cursor-pointer relative group shadow-sm"
      >
        <img src={`${API_BASE_URL}${url}`} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye size={16} className="text-white drop-shadow-md" />
        </div>
      </div>
    </div>
  );

  const reviewSteps = [
    { key: 'step1', label: 'Article Description', num: 1 },
    { key: 'step2', label: 'Owner Details', num: 2 },
    { key: 'step3', label: 'Working Authority', num: 3 },
    { key: 'step4', label: 'Scientists', num: 4 },
    { key: 'step5', label: 'Chemicals', num: 5 },
  ];

  return (
    <div className="h-screen flex bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar - Fixed, never scrolls with content */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white h-screen overflow-y-auto flex flex-col justify-between select-none">
        <div>
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100/50 shadow-sm">
              <ShieldCheck size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-medium text-slate-900 tracking-tight text-sm block">MLX Portal</span>
              <span className="text-[10px] text-slate-800 font-medium uppercase tracking-wider block">Admin Suite</span>
            </div>
          </div>

          <div className="p-4 space-y-1.5">
            <p className="text-[10px] font-medium text-slate-800 uppercase tracking-wider px-3 mb-2">Management Controls</p>
            <button
              onClick={() => { setActiveTab('users'); setReviewingApp(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none ${
                activeTab === 'users' ? 'bg-green-50 text-green-600 shadow-sm' : 'text-slate-900 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={16} /><span>Users Registry</span>
            </button>
            <button
              onClick={() => { setActiveTab('applications'); setReviewingApp(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none ${
                activeTab === 'applications' ? 'bg-green-50 text-green-600 shadow-sm' : 'text-slate-900 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText size={16} /><span>Applications</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <div className="font-medium text-slate-800 text-xs truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-800 truncate">{user?.email}</div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-100 hover:border-red-200 text-xs font-medium text-red-600 hover:bg-rose-50 active:scale-[0.98] transition-all duration-150 cursor-pointer bg-white focus:outline-none">
            <LogOut size={14} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel - Scrolls independently */}
      <main className="flex-grow overflow-y-auto p-8 sm:p-10">
        
        {/* Dashboard Notifications */}
        <div className="max-w-5xl mx-auto mb-6">
          {dashError && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs mb-4">
              <CircleAlert size={16} className="shrink-0 stroke-[2.5] mt-0.5" />
              <div><span className="font-medium">Access Restrained:</span> {dashError}</div>
            </div>
          )}
          {dashSuccess && (
            <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-700 text-xs mb-4">
              <CircleCheck size={16} className="shrink-0 stroke-[2.5] mt-0.5" />
              <div>{dashSuccess}</div>
            </div>
          )}
        </div>

        {/* ═══════════ USERS TAB ═══════════ */}
        {activeTab === 'users' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Registered Users</h1>
                <p className="text-sm text-slate-800 font-medium mt-0.5">Manage registered system accounts and access credentials.</p>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-green-600 hover:bg-green-500 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg shadow-blue-600/10 self-start sm:self-auto">
                <UserPlus size={14} /><span>Create User</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 justify-between select-none">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-slate-800" />
                  <span className="font-medium text-slate-700 text-sm">System Registry Log</span>
                </div>
                <span className="bg-slate-100 text-slate-900 text-xs font-medium px-2.5 py-1 rounded-full">{standardUsersOnly.length} Accounts Active</span>
              </div>

              {loadingUsers && standardUsersOnly.length === 0 ? (
                <div className="text-center py-12 text-slate-800 text-sm">Fetching registered credential logs...</div>
              ) : standardUsersOnly.length === 0 ? (
                <div className="text-center py-12 text-slate-800 text-sm">No registered standard user accounts found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-800 text-xs font-medium uppercase tracking-wider select-none">
                        <th className="pb-3 font-normal">User Coordinates</th>
                        <th className="pb-3 font-normal">System Email</th>
                        <th className="pb-3 font-normal">Actual Password</th>
                        <th className="pb-3 font-normal text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standardUsersOnly.map((acc) => (
                        <tr key={acc._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 text-xs font-medium shrink-0 select-none">{acc.name.substring(0, 2).toUpperCase()}</div>
                              <span className="font-medium text-slate-800 text-sm">{acc.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-xs font-normal text-slate-900">{acc.email}</td>
                          <td className="py-4 text-xs select-all font-mono">
                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-700 font-medium">{acc.plainPassword || '••••••••'}</span>
                          </td>
                          <td className="py-4 text-right select-none">
                            <div className="inline-flex gap-1.5">
                              <button onClick={() => handleOpenEdit(acc)} className="text-green-600 hover:text-blue-500 hover:bg-green-50 p-1.5 rounded-lg transition-colors cursor-pointer" title="Edit User Details"><Pencil size={14} /></button>
                              <button onClick={() => handleDeleteUser(acc._id, acc.name)} className="text-rose-600 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer" title="Delete User Account"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ APPLICATIONS LIST VIEW ═══════════ */}
        {activeTab === 'applications' && !reviewingApp && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Article Applications</h1>
              <p className="text-sm text-slate-800 font-medium mt-0.5">Select an application to review all submitted details step-by-step.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 justify-between select-none">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-slate-800" />
                  <span className="font-medium text-slate-700 text-sm">Applications Registry</span>
                </div>
                <span className="bg-slate-100 text-slate-900 text-xs font-medium px-2.5 py-1 rounded-full">{applicationsList.length} Submissions</span>
              </div>

              {loadingApplications && applicationsList.length === 0 ? (
                <div className="text-center py-12 text-slate-800 text-sm">Fetching submitted application details...</div>
              ) : applicationsList.length === 0 ? (
                <div className="text-center py-12 text-slate-800 text-sm">No article registration applications found.</div>
              ) : (
                <div className="space-y-2">
                  {applicationsList.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all duration-150 group"
                    >
                      <div onClick={() => handleOpenReview(app)} className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer">
                        <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 text-sm font-normal shrink-0 select-none group-hover:bg-blue-100 group-hover:text-green-600 group-hover:border-green-200 transition-colors">
                          {app.user ? app.user.name.substring(0, 2).toUpperCase() : '??'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-normal text-slate-800 text-sm truncate">
                            {app.user ? app.user.name : <span className="text-rose-500 italic">Deleted User</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {app.registrationNumber ? (
                              <span className="text-xs font-normal text-green-600 uppercase tracking-wider">REG: {app.registrationNumber}</span>
                            ) : (
                              <span className="text-xs text-slate-800 italic">No reg number</span>
                            )}
                            <span className="text-slate-800 text-xs hidden sm:inline">•</span>
                            <span className="text-[10px] text-slate-800 font-medium hidden sm:inline">{app.user?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge status={app.status} />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app._id, app.user?.name || 'Unknown'); }}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Delete Application"
                        >
                          <Trash2 size={15} />
                        </button>
                        <ChevronRight onClick={() => handleOpenReview(app)} size={18} className="text-slate-800 group-hover:text-blue-500 transition-colors cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ APPLICATION DETAIL VIEW ═══════════ */}
        {activeTab === 'applications' && reviewingApp && (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Back button */}
            <button onClick={handleBackToList} className="flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-green-600 transition-colors cursor-pointer group">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Applications</span>
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 text-lg font-normal shrink-0 select-none">
                    {reviewingApp.user ? reviewingApp.user.name.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <div>
                    <h1 className="text-xl font-normal text-slate-800 tracking-tight">
                      {reviewingApp.user ? reviewingApp.user.name : 'Deleted User Account'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      {reviewingApp.user?.email && <span className="text-xs text-slate-800 font-medium">{reviewingApp.user.email}</span>}
                      {reviewingApp.registrationNumber && (
                        <>
                          <span className="text-slate-800 text-xs hidden sm:inline">•</span>
                          <span className="text-xs font-normal text-green-600 uppercase tracking-wider">REG: {reviewingApp.registrationNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <StatusBadge status={reviewingApp.status} />
                <button
                  onClick={() => handleDeleteApplication(reviewingApp._id, reviewingApp.user?.name || 'Unknown')}
                  className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-normal text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
              {reviewingApp.adminRemarks && (
                <div className="mt-5 p-4 rounded-xl border border-amber-100 bg-amber-50/50 text-xs text-amber-900">
                  <span className="font-normal">Previous Feedback:</span>{' '}
                  <span className="text-slate-700 font-medium">{reviewingApp.adminRemarks}</span>
                </div>
              )}
            </div>

            {/* Step Tabs + Content Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="flex border-b border-slate-100 select-none">
                {reviewSteps.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setReviewTab(s.key)}
                    className={`flex-1 py-4 text-center text-sm font-medium transition-all cursor-pointer relative ${
                      reviewTab === s.key ? 'text-green-600 bg-green-50/50' : 'text-slate-800 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[10px] font-normal uppercase tracking-wider mb-0.5">Step {s.num}</span>
                    <span className="block text-xs font-normal">{s.label}</span>
                    {reviewTab === s.key && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-600" />}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">

                {/* Step 1: Article */}
                {reviewTab === 'step1' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Article Description Details</h3>
                    {reviewingApp.articleDescription ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                          <DataRow label="Inspection Date" value={reviewingApp.articleDescription.date ? reviewingApp.articleDescription.date.substring(0, 10) : ''} />
                          <DataRow label="Physical Shape" value={reviewingApp.articleDescription.shape} />
                          <DataRow label="Dimensions / Size" value={reviewingApp.articleDescription.size} />
                          <DataRow label="Net Weight" value={reviewingApp.articleDescription.weight} />
                          <DataRow label="Year of Establishment" value={reviewingApp.articleDescription.yearOfEstablishment} />
                          <DataRow label="Origin" value={reviewingApp.articleDescription.origin} />
                          <DataRow label="MR (Max Radiation)" value={reviewingApp.articleDescription.mr} />
                          <DataRow label="RR (Residual Radiation)" value={reviewingApp.articleDescription.rr} />
                          <DataRow label="Operation Condition" value={
                            <span className="bg-green-50 text-green-700 text-xs font-normal px-2.5 py-1 rounded-lg border border-green-200">{reviewingApp.articleDescription.conditionOfOperation}</span>
                          } full />
                        </div>
                        {reviewingApp.articleDescription.imageUrl && (
                          <div className="pt-2">
                            <span className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-2">Article Image Proof</span>
                            <div onClick={() => setLightboxUrl(reviewingApp.articleDescription.imageUrl)} className="w-full max-w-md h-48 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer relative group shadow-sm">
                              <img src={`${API_BASE_URL}${reviewingApp.articleDescription.imageUrl}`} alt="Article Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white/90 text-slate-700 text-xs font-normal px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Eye size={14} /> View Full Size</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : <div className="text-center py-10 text-slate-800 italic text-sm">No article description details submitted.</div>}
                  </div>
                )}

                {/* Step 2: Owner & Media */}
                {reviewTab === 'step2' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Owner Details</h3>
                    {reviewingApp.ownerDetails ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                          <DataRow label="Owner Name" value={reviewingApp.ownerDetails.name} />
                          <DataRow label="Mobile Number" value={reviewingApp.ownerDetails.mobileNumber} />
                          <DataRow label="Email Address" value={reviewingApp.ownerDetails.email} />
                          <DataRow label="Physical Address" value={reviewingApp.ownerDetails.address} />
                          <DataRow label="Aadhaar Card No." value={reviewingApp.ownerDetails.aadharCardNumber} />
                          <DataRow label="PAN Card No." value={reviewingApp.ownerDetails.panCardNumber} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {reviewingApp.ownerDetails.ownerImageUrl && <ImagePreview url={reviewingApp.ownerDetails.ownerImageUrl} label="Owner Photo" />}
                          {reviewingApp.ownerDetails.signatureUrl && <ImagePreview url={reviewingApp.ownerDetails.signatureUrl} label="Signature" />}
                        </div>
                      </>
                    ) : <div className="text-center py-10 text-slate-800 italic text-sm">No owner details submitted.</div>}
                  </div>
                )}

                {/* Step 3: Working Authority */}
                {reviewTab === 'step3' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Working Authority Details</h3>
                    {reviewingApp.workingAuthority ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        <DataRow label="Authority Type" value={
                          <span className="bg-green-50 text-green-700 text-xs font-normal px-2.5 py-1 rounded-lg border border-green-200">{reviewingApp.workingAuthority.authorityType}</span>
                        } />
                        <DataRow label="Authority / Company Name" value={reviewingApp.workingAuthority.name} />
                        <DataRow label="Contact Number" value={reviewingApp.workingAuthority.contactNumber} />
                        <DataRow label="License Number" value={reviewingApp.workingAuthority.licenseNumber} />
                        <DataRow label="Working Code No." value={reviewingApp.workingAuthority.workingCodeNumber} />
                        <DataRow label="Physical Address" value={reviewingApp.workingAuthority.address} full />
                      </div>
                    ) : <div className="text-center py-10 text-slate-800 italic text-sm">No working authority details submitted.</div>}
                  </div>
                )}

                {/* Step 4: Scientists */}
                {reviewTab === 'step4' && (
                  <div className="space-y-8">
                    <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Scientist Details</h3>
                    {reviewingApp.scientistDetails ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-3">
                          <h4 className="text-xs font-normal text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">Closing Scientist</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">Name</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.closingScientist?.name || 'N/A'}</span></div>
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">Institution</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.closingScientist?.institutionName || 'N/A'}</span></div>
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">ID Number</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.closingScientist?.idNumber || 'N/A'}</span></div>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-3">
                          <h4 className="text-xs font-normal text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">Opening Scientist</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">Name</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.openingScientist?.name || 'N/A'}</span></div>
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">Institution</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.openingScientist?.institutionName || 'N/A'}</span></div>
                            <div className="flex justify-between text-sm py-1"><span className="text-slate-800 font-medium">ID Number</span><span className="font-normal text-slate-800">{reviewingApp.scientistDetails.openingScientist?.idNumber || 'N/A'}</span></div>
                          </div>
                        </div>
                      </div>
                    ) : <div className="text-center py-10 text-slate-800 italic text-sm">No scientist details submitted.</div>}
                  </div>
                )}

                {/* Step 5: Chemicals */}
                {reviewTab === 'step5' && (
                  <div className="space-y-8">
                    <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider">Chemical Details</h3>
                    {reviewingApp.chemicalDetails ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { title: 'Closing Chemicals', data: reviewingApp.chemicalDetails.closingChemicals },
                          { title: 'Packing Chemicals', data: reviewingApp.chemicalDetails.packingChemicals },
                          { title: 'Opening Chemicals', data: reviewingApp.chemicalDetails.openingChemicals },
                        ].map(({ title, data }) => (
                          <div key={title} className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-3">
                            <h4 className="text-xs font-normal text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-200">{title}</h4>
                            {data?.length > 0 ? (
                              <ul className="space-y-1.5">
                                {data.map((chem, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <span className="text-xs text-slate-800 font-mono font-normal w-5 text-right">{idx + 1}.</span>
                                    <span className="text-slate-700 font-medium">{chem}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : <span className="text-xs text-slate-800 italic">None declared</span>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="text-center py-10 text-slate-800 italic text-sm">No chemical details submitted.</div>}
                  </div>
                )}
              </div>
            </div>

            {/* Status Update & Feedback Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
              <h3 className="text-sm font-normal text-slate-700 uppercase tracking-wider mb-6">Review Decision & Feedback</h3>

              {formError && (
                <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs mb-5">
                  <CircleAlert size={15} className="shrink-0 stroke-[2.5] mt-0.5" />
                  <div><span className="font-medium">Error:</span> {formError}</div>
                </div>
              )}
              {formSuccess && (
                <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-700 text-xs mb-5">
                  <CircleCheck size={15} className="shrink-0 stroke-[2.5] mt-0.5" />
                  <div>{formSuccess}</div>
                </div>
              )}

              <form onSubmit={handleUpdateStatus} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-800 mb-2 select-none">Set Review Status</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-800"><ShieldCheck size={16} /></div>
                      <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm appearance-none cursor-pointer font-medium">
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-800">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="block text-xs font-normal uppercase tracking-wider text-slate-800 mb-2 select-none">Current Status</label>
                    <div className="py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl"><StatusBadge status={reviewingApp.status} /></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal uppercase tracking-wider text-slate-800 mb-2 select-none">Feedback Remarks</label>
                  <textarea placeholder="e.g. Dimensions verified. Image proof matches radiation rr metrics." value={reviewRemarks} onChange={(e) => setReviewRemarks(e.target.value)}
                    className="block w-full p-4 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm min-h-[120px] font-medium" />
                </div>

                <button type="submit" disabled={formLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-transparent text-sm font-normal rounded-xl text-white bg-green-600 hover:bg-green-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-60">
                  {formLoading ? <><RefreshCw size={16} className="animate-spin" /> Saving Review...</> : <><CheckCircle2 size={16} /> Save Review Decision</>}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs select-none">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
            <button onClick={handleCloseCreateModal} className="absolute top-4 right-4 text-slate-800 hover:text-slate-900 active:scale-90 transition-all p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"><X size={16} /></button>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <UserPlus size={18} className="text-blue-500" />
              <h2 className="text-lg font-medium text-slate-900">Create New System Account</h2>
            </div>
            {formError && <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs mb-5"><CircleAlert size={15} className="shrink-0 stroke-[2.5] mt-0.5" /><div><span className="font-medium">Invalid Entry:</span> {formError}</div></div>}
            {formSuccess && <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-700 text-xs mb-5"><CircleCheck size={15} className="shrink-0 stroke-[2.5] mt-0.5" /><div>{formSuccess}</div></div>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-800 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><User size={14} /></div>
                  <input type="text" required placeholder="Jane Doe" value={newName} onChange={(e) => setNewName(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-800 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><Mail size={14} /></div>
                  <input type="email" required placeholder="email@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-800 mb-1.5">Credentials Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><KeyRound size={14} /></div>
                  <input type="password" required placeholder="Minimum 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" minLength={6} />
                </div>
              </div>
              <button type="submit" disabled={formLoading} className="w-full flex items-center justify-center gap-1.5 py-3 px-4 mt-6 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20">
                {formLoading ? 'Creating User...' : 'Generate Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs select-none">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl w-full max-w-md p-6 sm:p-8 relative">
            <button onClick={handleCloseEditModal} className="absolute top-4 right-4 text-slate-800 hover:text-slate-900 active:scale-90 transition-all p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer"><X size={16} /></button>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <Pencil size={18} className="text-blue-500" />
              <h2 className="text-lg font-medium text-slate-900">Edit System Account</h2>
            </div>
            {formError && <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs mb-5"><CircleAlert size={15} className="shrink-0 stroke-[2.5] mt-0.5" /><div><span className="font-medium">Invalid Entry:</span> {formError}</div></div>}
            {formSuccess && <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-700 text-xs mb-5"><CircleCheck size={15} className="shrink-0 stroke-[2.5] mt-0.5" /><div>{formSuccess}</div></div>}
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-800 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><User size={14} /></div>
                  <input type="text" required placeholder="Jane Doe" value={editName} onChange={(e) => setEditName(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-800 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><Mail size={14} /></div>
                  <input type="email" required placeholder="email@example.com" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-800">New Password</label>
                  <span className="text-[10px] font-medium text-slate-800 uppercase select-none">Optional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-800"><KeyRound size={14} /></div>
                  <input type="password" placeholder="Leave blank to keep password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-sm" minLength={6} />
                </div>
              </div>
              <button type="submit" disabled={formLoading} className="w-full flex items-center justify-center gap-1.5 py-3 px-4 mt-6 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-500 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer shadow-lg shadow-blue-500/20">
                {formLoading ? 'Saving Changes...' : 'Save Account Details'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setLightboxUrl('')}>
          <div className="relative max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxUrl('')} className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-2 transition-colors cursor-pointer z-10 hover:scale-105 active:scale-95"><X size={16} /></button>
            <img src={`${API_BASE_URL}${lightboxUrl}`} alt="Proof Lightbox" className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-inner" />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
