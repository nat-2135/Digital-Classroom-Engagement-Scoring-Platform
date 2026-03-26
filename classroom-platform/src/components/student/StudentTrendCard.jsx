import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getStudentTrendMessage } from '../../utils/predictionEngine';
import { TrendingUp, Award, Target, Zap, CheckCircle2, AlertCircle, HelpCircle, Activity } from 'lucide-react';

const StudentTrendCard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const resp = await axios.get('http://localhost:8080/api/student/engagement-history', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setHistory(resp.data);
            } catch (e) { } finally { setLoading(false); }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center p-20 text-emerald-700 animate-pulse font-black uppercase tracking-widest text-sm">Synchronizing Historical Growth Metrics...</div>;

    const scores = history.map(h => h.engagementScore);
    const trend = getStudentTrendMessage(scores);
    const chartData = history.map(h => ({ week: `W${h.week}`, score: h.engagementScore }));

    const lastScore = scores.length > 0 ? scores[scores.length - 1] : 0;
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

    return (
        <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card border-2 border-emerald-100 bg-white p-8 flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all duration-700 group relative overflow-hidden rounded-3xl">
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Zap size={100} className="text-emerald-600 fill-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-125 transition-transform duration-500">
                            <Target size={22} className="animate-pulse" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Current Velocity</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-gray-900">{lastScore.toFixed(1)}</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Latest Engagement Scalar</p>
                    </div>
                </div>

                <div className="card border-2 border-blue-100 bg-white p-8 flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all duration-700 group relative overflow-hidden rounded-3xl">
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Activity size={100} className="text-blue-600 fill-blue-600" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-125 transition-transform duration-500">
                            <TrendingUp size={22} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Mean Efficiency</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-gray-900">{avgScore.toFixed(1)}</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lifecycle Engagement Base</p>
                    </div>
                </div>

                <div className="card border-2 border-purple-100 bg-white p-8 flex flex-col gap-4 shadow-xl hover:shadow-2xl transition-all duration-700 group relative overflow-hidden rounded-3xl">
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Award size={100} className="text-purple-600 fill-purple-600" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-125 transition-transform duration-500">
                            <Zap size={22} className="fill-purple-300" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-purple-600">Peak Saturation</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-4xl font-bold text-gray-900">{maxScore.toFixed(1)}</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Historical Maximum Engagement</p>
                    </div>
                </div>
            </div>

            <div className="card p-10 lg:p-12 shadow-2xl border-emerald-50 bg-white rounded-[40px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-12 border-b-2 border-emerald-50/50 pb-8 flex-wrap gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={32} className="text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl font-bold text-gray-900 grow group-hover:translate-x-1 transition-transform">Longitudinal Study: Engagement Growth</h3>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Multi-Week Historical Progression Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-3xl border border-emerald-100 shadow-inner group-hover:shadow-emerald-100 transition-all duration-700">
                        <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-emerald-800 animate-pulse">{trend.emoji} {trend.message}</span>
                            </div>
                            <div className="h-1.5 w-48 bg-emerald-200/50 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 h-full animate-progress" style={{ width: '100%', backgroundColor: trend.color }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ height: '350px' }} className="mt-8 relative z-10 p-6 bg-white/50 rounded-3xl border border-gray-50 flex flex-col gap-8 shadow-inner">
                    {chartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-4xl mb-4">📈</span>
                            <span className="font-semibold text-lg">Insufficient Data</span>
                            <span className="text-sm mt-1">Check back once your scores are recorded.</span>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={trend.color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={trend.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 900 }}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#000',
                                        border: 'none',
                                        borderRadius: '16px',
                                        color: '#fff',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                        padding: '16px 20px'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', fontFamily: 'DM Sans' }}
                                    labelStyle={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '900' }}
                                    allowEscapeViewBox={{ x: true, y: true }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke={trend.color}
                                    strokeWidth={5}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    animationDuration={2500}
                                    animationEasing="ease-in-out"
                                    activeDot={{ r: 10, strokeWidth: 0, fill: '#000', shadow: '0 0 20px rgba(0,0,0,0.2)' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTrendCard;
