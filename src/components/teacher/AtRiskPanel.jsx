import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { calculateTrend } from '../../utils/predictionEngine';
import TrendSparkline from './TrendSparkline';
import WelcomeCard from '../shared/WelcomeCard';
import { LoadingSkeletons, ErrorRetry } from '../shared/StateUI';

const AllOnTrack = () => (
    <div className="text-center py-20 px-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Status: All On Track</h3>
        <p className="text-gray-500 text-sm font-medium">No students require immediate intervention at this time.</p>
    </div>
);

const AtRiskPanel = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [sent, setSent] = useState({});

    // Added generateFeedback since it was missing from the snippet
    const generateFeedback = (scores, name) => {
        return `Hi ${name}, I noticed your engagement scores have been trending down. Let's talk about how to get back on track.`;
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.get('/api/teacher/students/engagement-history');
            const atRisk = res.data.filter(s => {
                const historyScores = s.history ? s.history.map(h => h.engagementScore) : [];
                const trend = calculateTrend(historyScores.length >= 2 ? historyScores : [0, 0]);
                return trend.status === 'at_risk';
            });
            const fb = {};
            atRisk.forEach(s => {
                const historyScores = s.history ? s.history.map(h => h.engagementScore) : [];
                fb[s.studentId] = generateFeedback(historyScores, s.studentName);
            });
            setFeedback(fb);
            setStudents(atRisk);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const sendFeedback = async (studentId) => {
        console.log(`DEBUG: Sending feedback to studentId: ${studentId}`);
        try {
            await api.post('/api/teacher/feedback', { studentId, message: feedback[studentId] });
            setSent(prev => ({ ...prev, [studentId]: true }));
        } catch (err) {
            console.error('Failed to send feedback', err);
            alert('Failed to send feedback. Try again.');
        }
    };

    if (loading) return <LoadingSkeletons />;
    if (error) return <ErrorRetry onRetry={fetchData} />;
    if (students.length === 0) return <AllOnTrack />;

    return (
        <div>
            {students.map(s => {
                const historyScores = s.history ? s.history.map(h => h.engagementScore) : [];
                return (
                    <div key={s.studentId} style={{
                        background: '#fff', borderRadius: 12,
                        borderLeft: '4px solid #ef4444',
                        padding: 20, marginBottom: 16,
                        border: '1px solid #e5e7eb'
                        
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div>
                                <span style={{ fontWeight: 600, fontSize: 16, fontFamily: 'DM Sans, sans-serif' }}>
                                    {s.studentName}
                                </span>
                                <span style={{
                                    background: '#fef2f2', color: '#dc2626',
                                    fontSize: 11, padding: '2px 8px',
                                    borderRadius: 20, marginLeft: 8,
                                    fontFamily: 'DM Sans, sans-serif', fontWeight: 600
                                }}>At Risk</span>
                            </div>
                        </div>
                        <div style={{ height: 60, marginBottom: 12 }}>
                            <TrendSparkline scores={historyScores} color="#ef4444" />
                        </div>
                        <textarea
                            value={feedback[s.studentId] || ''}
                            onChange={e => setFeedback(prev => ({ ...prev, [s.studentId]: e.target.value }))}
                            style={{
                                width: '100%', padding: 12,
                                background: '#fffbeb',
                                border: '1px solid #fcd34d',
                                borderRadius: 8, fontSize: 13,
                                minHeight: 80, resize: 'vertical',
                                fontFamily: 'DM Sans, sans-serif'
                            }}
                        />
                        <button
                            onClick={() => sendFeedback(s.studentId)}
                            disabled={sent[s.studentId]}
                            style={{
                                marginTop: 10,
                                background: sent[s.studentId] ? '#d1fae5' : '#059669',
                                color: sent[s.studentId] ? '#065f46' : '#fff',
                                border: 'none', borderRadius: 8,
                                padding: '10px 20px', cursor: 'pointer',
                                fontFamily: 'DM Sans, sans-serif',
                                fontWeight: 600
                            }}
                        >
                            {sent[s.studentId] ? '✓ Feedback Sent' : 'Send Feedback'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AtRiskPanel;
