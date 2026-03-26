import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Users, Award, ChevronRight, Activity } from 'lucide-react';
import api from '../../utils/axiosInstance';

const AnalyticsReport = () => {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ avgScore: 0, highestScore: 0, lowestScore: 0, studentsCount: 0 });
    const [weeklyTrend, setWeeklyTrend] = useState([]);

    useEffect(() => {
        api.get('/api/teacher/students/engagement-history')
            .then(res => {
                const students = res.data || [];
                setData(students);
                
                // Aggregate stats
                let totalScore = 0;
                let high = 0;
                let low = 100;
                let count = 0;
                const weekMap = {};

                students.forEach(s => {
                    const hist = s.history || [];
                    if (hist.length > 0) {
                        const current = hist[hist.length - 1].engagementScore;
                        totalScore += current;
                        if (current > high) high = current;
                        if (current < low) low = current;
                        count++;

                        // Collect weekly data for class average trend
                        hist.forEach(h => {
                            if (!weekMap[h.week]) weekMap[h.week] = { week: h.week, total: 0, count: 0 };
                            weekMap[h.week].total += h.engagementScore;
                            weekMap[h.week].count += 1;
                        });
                    }
                });

                setStats({
                    avgScore: count > 0 ? (totalScore / count).toFixed(1) : 0,
                    highestScore: high,
                    lowestScore: count > 0 ? low : 0,
                    studentsCount: students.length
                });

                const sortedTrend = Object.values(weekMap)
                    .sort((a, b) => a.week - b.week)
                    .map(w => ({
                        week: `Week ${w.week}`,
                        average: (w.total / w.count).toFixed(1)
                    }));
                setWeeklyTrend(sortedTrend);
            })
            .catch(console.error);
    }, []);

    const scoreDistribution = [
        { range: '0-20', count: data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc <= 20; }).length },
        { range: '21-40', count: data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc > 20 && sc <= 40; }).length },
        { range: '41-60', count: data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc > 40 && sc <= 60; }).length },
        { range: '61-80', count: data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc > 60 && sc <= 80; }).length },
        { range: '81-100', count: data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc > 80; }).length },
    ];

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Academic Intelligence</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Performance Analysis</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-50 px-6 py-4 rounded-2xl flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class Health</span>
                        <span className="text-xl font-black text-emerald-600">EXCELLENT</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Enrollment', value: stats.studentsCount, icon: Users, color: 'blue' },
                    { label: 'Mean Engagement', value: stats.avgScore, icon: TrendingUp, color: 'emerald' },
                    { label: 'High Benchmark', value: stats.highestScore, icon: Award, color: 'amber' },
                    { label: 'Success Velocity', value: '4.2%', icon: Activity, color: 'purple' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:translate-y-[-4px] transition-all">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-2xl font-black text-gray-900">{stat.value}</span>
                        </div>
                        <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Engagement Trend */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Class Engagement Velocity</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Weekly average score progression</p>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"><ChevronRight size={20} /></button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyTrend}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                    itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#10b981'}}
                                />
                                <Area type="monotone" dataKey="average" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAvg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Score Distribution</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Volumetric analysis of class performance</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} allowDecimals={false} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Insights Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-emerald-900 p-10 rounded-[40px] text-white flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                    <h4 className="text-lg font-bold uppercase tracking-widest text-emerald-400">Strategic Performance Insight</h4>
                    <p className="text-xl font-medium leading-relaxed opacity-90 italic">"The class average is currently <span className="text-emerald-300 font-black">{stats.avgScore}</span>. Focusing on the <span className="text-emerald-300 font-black">{data.filter(s => { const h = s.history || []; const sc = h.length > 0 ? h[h.length-1].engagementScore : 0; return sc < 50; }).length}</span> students in the bottom percentile could boost the cumulative score index by up to 12%."</p>
                </div>
                <div className="bg-gray-900 p-10 rounded-[40px] text-white flex flex-col gap-6 relative overflow-hidden group">
                    <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                    <h4 className="text-lg font-bold uppercase tracking-widest text-blue-400">Next Recommended Action</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-black">1</div>
                            <p className="text-sm opacity-80 mt-1">Deploy Week {weeklyTrend.length + 1} Assessment to maintain data continuity.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-black">2</div>
                            <p className="text-sm opacity-80 mt-1">Review the top performers list and assign peer mentorship badges.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsReport;
