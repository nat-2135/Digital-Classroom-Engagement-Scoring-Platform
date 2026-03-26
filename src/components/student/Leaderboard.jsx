import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { Trophy, Medal, RefreshCw } from 'lucide-react';

const Leaderboard = ({ viewAs = 'student' }) => {
    const [board, setBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showName, setShowName] = useState(true);

    const [selectedWeek, setSelectedWeek] = useState(1);
    const endpoint = viewAs === 'admin' ? '/api/admin/leaderboard' : viewAs === 'teacher' ? '/api/teacher/leaderboard' : '/api/student/leaderboard';

    const fetchBoard = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.get(`${endpoint}?week=${selectedWeek}`);
            setBoard(res.data || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBoard(); }, [endpoint, selectedWeek]);

    const togglePrivacy = async () => {
        const newVal = !showName;
        setShowName(newVal);
        try {
            await api.post('/api/student/leaderboard/privacy', { showName: newVal });
            fetchBoard();
        } catch {
            setShowName(!newVal);
        }
    };

    const podiumColors = {
        1: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', label: '1st Place' },
        2: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-900', label: '2nd Place' },
        3: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', label: '3rd Place' }
    };

    const getTrendColor = (score) => {
        if (score >= 75) return 'text-emerald-600';
        if (score >= 50) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreColor = (score) => score >= 70 ? 'text-emerald-700' : score >= 50 ? 'text-amber-700' : 'text-red-700';

    if (loading) return (
        <div className="p-8 flex flex-col gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 h-20 rounded-2xl animate-pulse" />
            ))}
        </div>
    );

    if (error) return (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-red-600 font-bold mb-4">Failed to load leaderboard data.</p>
            <button onClick={fetchBoard} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all">Retry</button>
        </div>
    );

    if (!board.length) return (
        <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Trophy size={32} className="text-gray-300" />
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-gray-900">No Data for Week {selectedWeek}</h3>
                    <div className="flex items-center gap-3 justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Change Week:</span>
                        <select 
                            value={selectedWeek} 
                            onChange={(e) => setSelectedWeek(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                                <option key={w} value={w}>Week {w}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const top3 = board.slice(0, 3);
    const rest = board.slice(3, 10);
    const currentUser = board.find(s => s.isCurrentUser);
    const currentUserInRest = rest.find(s => s.isCurrentUser);
    const currentUserBelow = !top3.find(s => s.isCurrentUser) && !currentUserInRest ? currentUser : null;

    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-900 rounded-xl text-white shadow-lg"><Trophy size={20} /></div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 uppercase">Academic Leaderboard</h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Classroom Excellence</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selection:</span>
                        <select 
                            value={selectedWeek} 
                            onChange={(e) => setSelectedWeek(Number(e.target.value))}
                            className="bg-white border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(w => (
                                <option key={w} value={w}>Week {w} Metrics</option>
                            ))}
                        </select>
                    </div>
                    {viewAs === 'student' && (
                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none">
                            <input type="checkbox" checked={showName} onChange={togglePrivacy} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer" /> 
                            <span>Display Identity</span>
                        </label>
                    )}
                    <button onClick={fetchBoard} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                        <RefreshCw size={12} /> Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map(student => {
                    const style = podiumColors[student.rank];
                    return (
                        <div key={student.rank} className={`${style?.bg || 'bg-white'} border ${style?.border || 'border-gray-100'} p-8 rounded-2xl text-center flex flex-col items-center gap-2 transition-all duration-300 hover:shadow-md`}>
                            <div className={`text-[10px] font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full ${style?.text || 'text-gray-500'} bg-white/50 border ${style?.border || 'border-gray-100'} mb-2`}>{style?.label || `Rank #${student.rank}`}</div>
                            <div className={`text-lg font-semibold ${student.isCurrentUser ? 'text-emerald-700 underline underline-offset-4 decoration-2' : 'text-gray-900'}`}>
                                {student.displayName}
                            </div>
                            <div className={`text-4xl font-bold ${getScoreColor(student.engagementScore)} mt-2`}>
                                {Math.round(student.engagementScore || 0)}
                            </div>
                            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-4">
                                Score Index Verified
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-center gap-3 border-l-4 border-emerald-600 pl-4">
                    <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tight">Full Performance Details</h3>
                </div>
                
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Rank</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Student Identity</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Attendance</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Participation</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Assignment</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Test Score</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest text-center">Final Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {board.map((s) => {
                                return (
                                    <tr key={s.rank} className={`hover:bg-emerald-50/30 transition-all duration-300 ${s.isCurrentUser ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''}`}>
                                        <td className="px-6 py-5 font-medium text-gray-400 tabular-nums text-sm">#{s.rank}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-semibold text-base ${s.isCurrentUser ? 'text-emerald-800' : 'text-gray-900'}`}>{s.displayName}</span>
                                                    {s.isCurrentUser && <span className="text-[8px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{s.isAnonymous ? 'Restricted' : 'Verified'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-sm font-semibold text-gray-700">{Math.round(s.attendanceAvg || 0)}%</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-sm font-semibold text-gray-700">{Math.round(s.participationAvg || 0)}/5</span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-sm font-semibold text-gray-700">
                                            {Math.round(s.assignmentAvg || 0)}%
                                        </td>
                                        <td className="px-6 py-5 text-center text-sm font-semibold text-gray-700">
                                            {Math.round(s.testScoreAvg || 0)}%
                                        </td>
                                        <td className={`px-6 py-5 font-bold text-center text-lg ${getScoreColor(s.engagementScore)}`}>
                                            {Math.round(s.engagementScore || 0)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center mt-6">Leaderboard updates automatically after each data entry</p>
        </div>
    );
};

export default Leaderboard;
