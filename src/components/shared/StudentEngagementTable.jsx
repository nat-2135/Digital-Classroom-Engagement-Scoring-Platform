import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { Star, AlertTriangle, Info } from 'lucide-react';

const StudentEngagementTable = ({ studentId, role, refreshTrigger }) => {
    const [data, setData] = useState(null);
    const [allStudents, setAllStudents] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                if (role === 'TEACHER' && !studentId) {
                    const response = await api.get(`/api/teacher/students/engagement-history`);
                    if (isMounted) {
                        setAllStudents(response.data);
                        setLoading(false);
                    }
                    return;
                }

                const endpoint = role === 'TEACHER'
                    ? `/api/teacher/students/${studentId}/full-engagement`
                    : `/api/student/full-engagement`;

                const response = await api.get(endpoint);

                if (isMounted) {
                    setData(response.data);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                }
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [studentId, role, refreshTrigger]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading engagement data...</div>;

    if (role === 'TEACHER' && !studentId && allStudents) {
        let activeData = selectedStudentId ? allStudents.find(s => s.studentId.toString() === selectedStudentId) : null;
        return (
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700">Select Student:</label>
                    <select 
                        className="flex-1 p-3 border-2 border-emerald-100 rounded-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-700 max-w-sm" 
                        onChange={e => setSelectedStudentId(e.target.value)}
                        value={selectedStudentId}
                    >
                        <option value="">-- Choose a Student --</option>
                        {allStudents.map(s => (
                            <option key={s.studentId} value={s.studentId}>{s.studentName}</option>
                        ))}
                    </select>
                </div>
                {activeData ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <StudentEngagementTable studentId={selectedStudentId} role="TEACHER" refreshTrigger={refreshTrigger} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 bg-white border-2 border-dashed border-emerald-100 rounded-xl text-emerald-800 gap-4">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                            <Info size={32} className="text-emerald-500" />
                        </div>
                        <h4 className="text-xl font-bold">No Student Selected</h4>
                        <p className="text-emerald-600/70 text-center max-w-sm">Please select a student from the dropdown above to view their engagement history and performance metrics.</p>
                    </div>
                )}
            </div>
        );
    }

    if (!data || !data.history || data.history.length === 0) return <div className="card text-center p-8 bg-gray-50 border-dashed">No engagement data recorded yet.</div>;

    const getTestScore = (week) => {
        const test = data.testHistory?.find(t => t.test.weekNumber === week);
        if (!test) return { score: "—", skipped: true };
        return { score: `${test.score.toFixed(1)} / ${test.totalMarks}`, skipped: false };
    };

    const getSelfAssessment = (week) => {
        return data.assessments?.find(a => a.week === week);
    };

    return (
        <div className="card overflow-x-auto shadow-sm border-gray-100 p-0">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-emerald-50/50">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Week</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Attendance %</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Participation</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Assignment</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Engagement Score</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b bg-blue-50/50">Test Score</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">Self-Assessment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.history.map((record, index) => {
                        const test = getTestScore(record.week);
                        const assessment = getSelfAssessment(record.week);
                        const mismatch = assessment && Math.abs(assessment.participationRating - record.participation) > 2;

                        return (
                            <tr key={record.id || index} className="table-row hover:bg-emerald-50/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 border-r border-gray-50/50">W{record.week}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-emerald-500 h-full" style={{ width: `${record.attendance}%` }}></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">{record.attendance}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={14} className={s <= record.participation ? 'fill-emerald-500 text-emerald-500' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${record.assignmentStatus === 'ON_TIME' ? 'bg-emerald-100 text-emerald-700' :
                                            record.assignmentStatus === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.assignmentStatus.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-base font-bold text-emerald-700">{record.engagementScore.toFixed(1)}</span>
                                </td>
                                <td className="px-6 py-4 bg-blue-50/30">
                                    <div className="flex items-center justify-between gap-2 group">
                                        <span className={`text-sm font-bold ${test.skipped ? 'text-gray-400 italic' : 'text-blue-700'}`}>{test.score}</span>
                                        {test.skipped && (
                                            <div className="relative group/tooltip">
                                                <span className="bg-red-100 text-red-700 text-[10px] font-black px-1.5 py-0.5 rounded-full cursor-help">SKIPPED</span>
                                                <div className="absolute bottom-full right-0 mb-2 invisible group-hover/tooltip:visible bg-gray-900 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-50">
                                                    Student missed the weekly test.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {assessment ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={12} className={s <= assessment.participationRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                                    ))}
                                                </div>
                                                {mismatch && (
                                                    <div className="relative group/mismatch">
                                                        <AlertTriangle size={14} className="text-red-500 cursor-help" />
                                                        <div className="absolute bottom-full right-0 mb-1 invisible group-hover/mismatch:visible bg-red-600 text-white text-[10px] p-2 rounded shadow-2xl z-50 w-48 font-bold">
                                                            Mismatch: Student rated {assessment.participationRating} but Teacher rated {record.participation}.
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic font-medium">Pending...</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StudentEngagementTable;
