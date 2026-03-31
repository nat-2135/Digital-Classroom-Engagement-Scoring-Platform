import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { calculateTrend } from '../../utils/predictionEngine';
import { Users, AlertCircle, TrendingUp, Target, Zap, ShieldCheck, Activity, Award, CheckCircle2, Search, Filter } from 'lucide-react';

const AdminInsightsPanel = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ studentCount: 0, teacherCount: 0, totalCount: 0 });
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyResp, statsResp, rosterResp] = await Promise.all([
                    api.get('/api/admin/all-students/engagement-history'),
                    api.get('/api/admin/stats'),
                    api.get('/api/admin/students')
                ]);
                setData(historyResp.data);
                setStats(statsResp.data);
                setRoster(rosterResp.data);
            } catch (e) { } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 animate-pulse">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold text-gray-900">Initializing Secure Server...</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Waking up Render instance (typically 30-60s on cold start)</p>
            </div>
        </div>
    );

    const analyzed = (data || []).map(student => {
        const scores = student.history ? student.history.map(h => h.engagementScore) : [];
        return { ...student, trend: calculateTrend(scores.length >= 2 ? scores : [0, 0]), scores };
    });

    const atRisk = analyzed.filter(s => s.trend.status === 'at_risk');
    const recovering = analyzed.filter(s => s.trend.status === 'recovering');
    const steady = analyzed.filter(s => s.trend.status === 'steady');

    const totalAvg = analyzed.length > 0 
        ? analyzed.reduce((acc, s) => acc + (s.scores[s.scores.length - 1] || 0), 0) / analyzed.length 
        : 0;

    const chartData = [
        { name: 'At Risk', value: atRisk.length, color: '#ef4444' },
        { name: 'Recovering', value: recovering.length, color: '#10b981' },
        { name: 'Steady', value: steady.length, color: '#3b82f6' }
    ];

    return (
        <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-8 bg-black border-none shadow-lg relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Total System Users</span>
                        <span className="text-5xl font-black mt-2 text-white">{stats.totalCount}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000 text-white"><Users size={150} /></div>
                    <div className="mt-6 flex items-center gap-2 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">System Active</span>
                    </div>
                </div>

                <div className="card p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Students</span>
                        <span className="text-5xl font-black text-blue-900 mt-2">{stats.studentCount}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-blue-600 group-hover:scale-110 transition-transform duration-1000"><Users size={150} /></div>
                    <div className="mt-6">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Academic Roster</span>
                    </div>
                </div>

                <div className="card p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Teachers</span>
                        <span className="text-5xl font-black text-purple-900 mt-2">{stats.teacherCount}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-purple-600 group-hover:scale-110 transition-transform duration-1000"><ShieldCheck size={150} /></div>
                    <div className="mt-6">
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-purple-100">Faculty Members</span>
                    </div>
                </div>

                <div className="card p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">At-Risk Students</span>
                        <span className="text-5xl font-black text-red-900 mt-2">{atRisk.length}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-red-600 group-hover:scale-110 transition-transform duration-1000"><AlertCircle size={150} /></div>
                    <div className="mt-6">
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-red-100">Requires Intervention</span>
                    </div>
                </div>

                <div className="card p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Average Score</span>
                        <span className="text-5xl font-black text-emerald-900 mt-2">{Math.round(totalAvg)}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-emerald-600 group-hover:scale-110 transition-transform duration-1000"><Activity size={150} /></div>
                    <div className="mt-6">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">Global Average</span>
                    </div>
                </div>

                <div className="card p-8 bg-white border border-gray-100 shadow-sm relative overflow-hidden group rounded-2xl transition-all duration-300">
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Top Performers</span>
                        <span className="text-5xl font-black text-amber-900 mt-2">{analyzed.filter(s => (s.scores[s.scores.length - 1] || 0) > 85).length}</span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 text-amber-600 group-hover:scale-110 transition-transform duration-1000"><Award size={150} /></div>
                    <div className="mt-6">
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-100">Excellence Count</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card shadow-md p-8 bg-white border border-gray-100 rounded-2xl flex flex-col gap-8 transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-900 rounded-xl text-white shadow-lg"><Activity size={20} /></div>
                            <div className="flex flex-col">
                                <h4 className="text-xl font-bold text-gray-900">Score Distribution</h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classroom Overview</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '350px' }} className="mt-2 p-6 bg-gray-50/50 rounded-xl border border-gray-100">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartData.length > 0 && chartData.reduce((acc, curr) => acc + curr.value, 0) > 0 ? (
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }}
                                    padding={{ left: 50, right: 50 }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px', backgroundColor: '#000', color: '#fff' }}
                                    itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', fontFamily: 'DM Sans, sans-serif' }}
                                    labelStyle={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 900, fontFamily: 'DM Sans, sans-serif' }}
                                />
                                <Bar dataKey="value" radius={[20, 20, 0, 0]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                            ) : (
                                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontFamily: 'DM Sans, sans-serif'}}>
                                    No chart data to display
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card shadow-md p-0 overflow-hidden bg-white border border-gray-100 rounded-2xl flex flex-col transition-all duration-300">
                    <div className="p-8 bg-red-600 flex items-center justify-between text-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><AlertCircle size={20} /></div>
                            <div className="flex flex-col">
                                <h4 className="text-xl font-bold">Urgent Alerts</h4>
                                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Students needing attention</span>
                            </div>
                        </div>
                        <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">Count: {atRisk.length}</span>
                    </div>
                    <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[440px]">
                        {atRisk.map((s) => (
                            <div key={s.studentId} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-white transition-all duration-200 cursor-default group/risk">
                                <div className="flex flex-col gap-1">
                                    <h5 className="text-sm font-bold text-gray-900">{s.studentName}</h5>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{s.trend.label}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Velocity</span>
                                        <span className="text-lg font-bold text-red-700">{Math.round(s.trend.slope)}</span>
                                    </div>
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover/risk:bg-red-600 group-hover/risk:text-white transition-colors duration-200">
                                        <Search size={16} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {atRisk.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <CheckCircle2 size={48} className="text-emerald-500 opacity-20" />
                                <div className="flex flex-col gap-1">
                                    <p className="text-lg font-bold text-gray-900">All students are on track</p>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No immediate action required</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-auto p-6 border-t border-gray-50 bg-gray-50/20">
                        <button className="w-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest py-5 rounded-xl transition-all flex items-center justify-center gap-3 group hover:bg-black">
                            <ShieldCheck size={16} /> Monitor All Students
                        </button>
                    </div>
                </div>
            </div>
            <div className="card shadow-md bg-white border border-gray-100 rounded-2xl overflow-hidden mt-8">
                <div className="p-8 border-b border-gray-50 bg-gray-50/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-900 rounded-xl text-white shadow-lg"><Users size={20} /></div>
                        <div className="flex flex-col">
                            <h4 className="text-xl font-bold text-gray-900 uppercase tracking-tight">System Roster</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active User Directory</span>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(roster || []).slice(0, 5).map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-5 font-bold text-gray-900 tracking-tight">{user.name}</td>
                                    <td className="px-10 py-5 text-gray-600 font-medium">{user.email}</td>
                                    <td className="px-10 py-5 text-center">
                                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                                    </td>
                                </tr>
                            ))}
                            {(roster || []).length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-10 py-12 text-center text-gray-400 font-medium">No system users found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                    <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">View All Directory Entries</button>
                </div>
            </div>
        </div>
    );
};

export default AdminInsightsPanel;
