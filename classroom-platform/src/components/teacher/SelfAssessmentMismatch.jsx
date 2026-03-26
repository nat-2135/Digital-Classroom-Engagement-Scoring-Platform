import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import StatCard from '../shared/StatCard';
import { LoadingSkeletons, ErrorRetry } from '../shared/StateUI';

const StarBar = ({ value, max = 5, color }) => (
    <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <div key={i} className={`h-1.5 w-6 rounded-full ${i < value ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            ))}
        </div>
        <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{value}/{max}</span>
    </div>
);

const MismatchBar = ({ studentVal, teacherVal }) => {
    const diff = Math.abs(studentVal - teacherVal);
    const getStatus = () => {
        if (diff > 2) return { label: 'High Mismatch', color: 'text-red-600', bg: 'bg-red-600' };
        if (diff === 2) return { label: 'Moderate Mismatch', color: 'text-amber-600', bg: 'bg-amber-600' };
        return { label: 'Aligned', color: 'text-emerald-600', bg: 'bg-emerald-600' };
    };
    const status = getStatus();

    return (
        <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <span>Student Self-Rating: {studentVal}/5</span>
                <span>Teacher Evaluation: {teacherVal}/5</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${status.bg} transition-all duration-700`} 
                    style={{ width: `${(Math.max(studentVal, teacherVal) / 5) * 100}%` }}
                />
            </div>
            <div className={`mt-2 text-[10px] uppercase font-black tracking-[0.2em] ${status.color}`}>
                {status.label}
            </div>
        </div>
    );
};

const SelfAssessmentMismatch = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const res = await api.get('/api/teacher/self-assessments');
            if (res.status === 204) setData([]);
            else setData(res.data || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAddNote = async (studentId, week) => {
        const note = prompt("Enter observation note for this student:");
        if (!note) return;
        try {
            await api.post('/api/teacher/assessment-note', { studentId, week, note });
            alert("Note added successfully!");
        } catch {
            alert("Failed to add note.");
        }
    };

    if (loading) return <LoadingSkeletons count={2} />;
    if (error) return <ErrorRetry onRetry={fetchData} />;
    if (data.length === 0) return (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-1">No Assessments Found</h3>
            <p className="text-gray-500 text-sm font-medium">No student self-assessments have been submitted for the current week.</p>
        </div>
    );

    const stats = {
        total: data.length,
        high: data.filter(d => Math.abs(d.participationRating - (d.teacherRating || 3)) > 2).length,
        mod: data.filter(d => Math.abs(d.participationRating - (d.teacherRating || 3)) === 2).length,
        aligned: data.filter(d => Math.abs(d.participationRating - (d.teacherRating || 3)) < 2).length,
    };

    const displayData = data.filter(d => {
        const diff = Math.abs(d.participationRating - (d.teacherRating || 3));
        if (filter === 'HIGH') return diff > 2;
        if (filter === 'MOD') return diff === 2;
        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'DM Sans, sans-serif' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard label="Total" value={stats.total} color="#3b82f6" />
                <StatCard label="High Mismatch" value={stats.high} color="#ef4444" />
                <StatCard label="Moderate" value={stats.mod} color="#f59e0b" />
                <StatCard label="Aligned" value={stats.aligned} color="#059669" />
            </div>

            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
                {['ALL', 'HIGH', 'MOD'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, border: 'none',
                        background: filter === f ? '#059669' : '#f3f4f6',
                        color: filter === f ? '#fff' : '#4b5563',
                        fontFamily: 'DM Sans, sans-serif'
                    }}>
                        {f === 'ALL' ? 'All' : f === 'HIGH' ? 'High Mismatch' : 'Moderate'}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {displayData.map((d, i) => (
                    <div key={i} style={{
                        background: '#fff', borderRadius: 12,
                        border: '1px solid #e5e7eb',
                        padding: 20
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ fontWeight: 600 }}>{d.student?.name || 'Student'} (Week {d.week})</div>
                            <button onClick={() => handleAddNote(d.student?.id, d.week)} style={{
                                background: 'transparent', border: '1px solid #d1d5db',
                                borderRadius: 6, padding: '4px 12px', fontSize: 13,
                                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif'
                            }}>Add Note</button>
                        </div>
                        <MismatchBar studentVal={d.participationRating} teacherVal={d.teacherRating || 3} />
                        <div style={{ marginTop: 16, background: '#f9fafb', padding: 12, borderRadius: 8, fontSize: 13, color: '#4b5563' }}>
                            <span style={{ fontWeight: 600 }}>Insight:</span> {d.insight || "No specific insights. Student rating and Teacher rating significantly misaligned."}
                        </div>
                    </div>
                ))}
                {displayData.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontSize: 14 }}>
                        No assessments match this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelfAssessmentMismatch;
