import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import WelcomeCard from '../components/shared/WelcomeCard';
import AdminInsightsPanel from '../components/admin/AdminInsightsPanel';
import StudentEngagementTable from '../components/shared/StudentEngagementTable';
import Leaderboard from '../components/student/Leaderboard';
import { Pencil, Trash2, Plus, X, AlertTriangle } from 'lucide-react';
import api from '../utils/axiosInstance';
import ErrorBoundary from '../components/shared/ErrorBoundary';

const AdminSettings = () => {
    const [platformName, setPlatformName] = useState(localStorage.getItem('platformName') || 'EduTrack');
    const [saved, setSaved] = useState(false);

    const saveSettings = () => {
        localStorage.setItem('platformName', platformName);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div>
            <WelcomeCard />
            <div style={{
                background: '#fff', borderRadius: 32,
                border: '1px solid #e5e7eb', padding: 32,
                maxWidth: 600
            }}>
                <h2 style={{
                    fontSize: 20, fontWeight: 600,
                    marginBottom: 24, color: '#1f2937'
                }}>Platform Settings</h2>

                <div style={{ marginBottom: 20 }}>
                    <label style={{
                        display: 'block', fontSize: 13,
                        color: '#374151', marginBottom: 6,
                        fontWeight: 500
                    }}>Platform Name</label>
                    <input
                        value={platformName}
                        onChange={e => setPlatformName(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 16, fontSize: 14
                        }}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{
                        display: 'block', fontSize: 13,
                        color: '#374151', marginBottom: 6,
                        fontWeight: 500
                    }}>Academic Year</label>
                    <select style={{
                        width: '100%', padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 16, fontSize: 14
                    }}>
                        <option>2025 - 2026</option>
                        <option>2026 - 2027</option>
                    </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{
                        display: 'block', fontSize: 13,
                        color: '#374151', marginBottom: 6,
                        fontWeight: 500
                    }}>Default Passing Score</label>
                    <input
                        type="number" defaultValue={60} min={0} max={100}
                        style={{
                            width: '100%', padding: '10px 14px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 16, fontSize: 14
                        }}
                    />
                </div>

                <div style={{
                    padding: 16, background: '#f9fafb',
                    borderRadius: 24, marginBottom: 20
                }}>
                    <p style={{
                        fontSize: 13, fontWeight: 500,
                        color: '#374151', marginBottom: 12
                    }}>Notification Preferences</p>
                    {[
                        'Email alerts for at-risk students',
                        'Weekly summary report',
                        'New student registration alerts'
                    ].map((item, i) => (
                        <label key={i} style={{
                            display: 'flex', alignItems: 'center',
                            gap: 10, marginBottom: 8,
                            fontSize: 13, color: '#4b5563',
                            cursor: 'pointer'
                        }}>
                            <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: '#059669' }} />
                            {item}
                        </label>
                    ))}
                </div>

                <button
                    onClick={saveSettings}
                    style={{
                        background: saved ? '#d1fae5' : '#059669',
                        color: saved ? '#065f46' : '#fff',
                        border: 'none', borderRadius: 16,
                        padding: '12px 28px', fontSize: 14,
                        cursor: 'pointer',
                        fontWeight: 500, transition: 'all 0.2s'
                    }}
                >
                    {saved ? '✓ Settings Saved!' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

const CrudTable = ({ type }) => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(null);
    const [formData, setFormData] = useState({ id: null, name: '', email: '', password: '' });
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = async () => {
        const url = `/api/admin/${type === 'STUDENT' ? 'students' : 'teachers'}`;
        try {
            const res = await api.get(url);
            setUsers(res.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchUsers(); }, [type]);

    const handleSave = async () => {
        const isStudent = type === 'STUDENT';
        const url = `/api/admin/${isStudent ? 'students' : 'teachers'}`;
        
        if (!formData.name?.trim()) { setFormError('Name is required'); return; }
        if (!formData.email?.trim()) { setFormError('Email is required'); return; }
        if (!formData.id && !formData.password?.trim()) { setFormError('Password is required'); return; }
        
        setFormError('');
        setSaving(true);
        try {
            const body = { name: formData.name.trim(), email: formData.email.trim(), role: type };
            if (formData.password?.trim()) { body.password = formData.password.trim(); }
            
            if (formData.id) {
                const res = await api.put(`${url}/${formData.id}`, body);
                setUsers(prev => prev.map(u => u.id === formData.id ? res.data : u));
                showToast(`${isStudent ? 'Student' : 'Teacher'} updated successfully!`, 'success');
            } else {
                const res = await api.post(url, body);
                setUsers(prev => [...prev, res.data]);
                showToast(`${isStudent ? 'Student' : 'Teacher'} added successfully!`, 'success');
            }
            setShowModal(false);
            setFormData({ id: null, name: '', email: '', password: '' });
        } catch (err) {
            const msg = err.response?.data?.error || `Failed to save ${isStudent ? 'student' : 'teacher'}`;
            setFormError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const isStudent = type === 'STUDENT';
        const url = `/api/admin/${isStudent ? 'students' : 'teachers'}/${showConfirm.id}`;
        try {
            await api.delete(url);
            setUsers(prev => prev.filter(u => u.id !== showConfirm.id));
            showToast(`${isStudent ? 'Student' : 'Teacher'} removed!`, 'success');
        } catch (err) {
            showToast(`Failed to delete ${isStudent ? 'student' : 'teacher'}`, 'error');
        } finally {
            setShowConfirm(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Manage {type === 'STUDENT' ? 'Students' : 'Teachers'}</h3>
                <button
                    onClick={() => { setFormData({ id: null, name: '', email: '', password: '' }); setShowModal(true); }}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                    <Plus size={18} /> Add {type === 'STUDENT' ? 'Student' : 'Teacher'}
                </button>
            </div>

            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, padding: '12px 20px',
                    background: toast.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: toast.type === 'success' ? '#065f46' : '#991b1b',
                    borderRadius: 8, border: `1px solid ${toast.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
                    zIndex: 9999, fontSize: 14, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {toast.type === 'success' ? '✓ ' : '✕ '}
                    {toast.message}
                </div>
            )}

            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                            {type === 'STUDENT' && <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>}
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600">Joined Date</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((u, idx) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-10 py-5 text-sm font-bold text-emerald-600">#{idx + 1}</td>
                                <td className="px-10 py-5 font-bold text-gray-900 tracking-tight">{u.name}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                {type === 'STUDENT' && <td className="px-6 py-4">{u.role}</td>}
                                <td className="px-6 py-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => { setFormData({ id: u.id, name: u.name, email: u.email, password: '' }); setShowModal(true); }} className="text-emerald-600 hover:text-emerald-800 mr-4">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => setShowConfirm(u)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No records found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                        <h2 className="text-xl font-bold mb-6">{formData.id ? 'Edit' : 'Add'} {type === 'STUDENT' ? 'Student' : 'Teacher'}</h2>
                        {formError && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded border border-red-200">{formError}</div>}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Full Name</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={saving} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Email</label>
                                <input type="email" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={saving} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Password {formData.id && '(leave blank to keep)'}</label>
                                <input type="password" className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={saving} />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50">
                                    {saving ? 'Saving...' : formData.id ? 'Update' : 'Save'}
                                </button>
                                <button onClick={() => { setShowModal(false); setFormError(''); }} disabled={saving} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                        <h2 className="text-lg font-bold mb-2">Are you sure you want to remove {showConfirm.name}?</h2>
                        <div className="flex gap-4 mt-6">
                            <button onClick={() => setShowConfirm(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard = ({ user }) => {
    const [activePage, setActivePage] = useState('overview');

    const renderContent = () => {
        switch (activePage) {
            case 'overview':
                return (
                    <div className="flex flex-col gap-14 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <WelcomeCard name={user?.name} role="Administrator" />
                        <AdminInsightsPanel />
                    </div>
                );
            case 'analytics':
                return (
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl font-bold text-gray-900 border-l-8 border-emerald-600 pl-4">Score Data</h3>
                        <StudentEngagementTable role="ADMIN" />
                    </div>
                );
            case 'leaderboard':
                return <Leaderboard viewAs="admin" />;
            case 'insights':
                return <AdminInsightsPanel />;
            case 'settings':
                return <AdminSettings />;
            case 'students':
                return <CrudTable type="STUDENT" />;
            case 'teachers':
                return <CrudTable type="TEACHER" />;
            default:
                return (
                    <div className="flex flex-col gap-14 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <WelcomeCard name={user?.name} role="Administrator" />
                        <AdminInsightsPanel />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Sidebar role="ADMIN" activeTab={activePage} setActiveTab={setActivePage} />
            <Header title="Admin Dashboard" userName={user?.name} role="Admin" />
            <main className="main-content">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <ErrorBoundary key={activePage}>
                        {renderContent()}
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
