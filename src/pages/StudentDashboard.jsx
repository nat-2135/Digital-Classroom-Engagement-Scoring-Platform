import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import WelcomeCard from '../components/shared/WelcomeCard';
import StudentTrendCard from '../components/student/StudentTrendCard';
import WeeklyTest from '../components/student/WeeklyTest';
import BadgeDisplay from '../components/student/BadgeDisplay';
import Leaderboard from '../components/student/Leaderboard';
import SelfAssessmentForm from '../components/student/SelfAssessmentForm';
import StudentEngagementTable from '../components/shared/StudentEngagementTable';
import StatCard from '../components/shared/StatCard';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { LoadingSkeletons } from '../components/shared/StateUI';
import api from '../utils/axiosInstance';
import FeedbackList from '../components/student/FeedbackList';

const StudentOverview = ({ studentData, loading }) => {
    if (loading) return <LoadingSkeletons />;
    return (
        <div>
            <WelcomeCard name={studentData?.name} role="Student" />
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16, marginBottom: 24,
                fontFamily: 'DM Sans, sans-serif'
            }}>
                <StatCard
                    label="Current Score"
                    value={studentData?.currentScore ?? '--'}
                    color="#059669" />
                <StatCard
                    label="This Week's Attendance"
                    value={studentData?.attendance ? studentData.attendance : '--'}
                    suffix={studentData?.attendance ? '%' : ''}
                    color="#3b82f6" />
            </div>
            <div className="flex flex-col gap-6 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 border-l-8 border-emerald-600 pl-4">My Progress</h3>
                <StudentTrendCard />
            </div>
        </div>
    );
};

const WeeklyHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/student/full-engagement')
            .then(res => setHistory(res.data?.history || []))
            .catch(() => setHistory([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeletons />;
    if (!history.length) return (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-1">No history yet</h3>
            <p className="text-gray-500 text-sm font-medium">Your weekly scores will appear here once they are recorded by your teacher.</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-gray-900">Score History</h3>
            <div className="flex flex-col gap-4">
                {history.map((week, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 flex justify-between items-center hover:shadow-md transition-shadow">
                        <div>
                            <p className="font-bold text-gray-900">Week {week.week}</p>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                Attendance: {week.attendance}% | Participation: {week.participation}/5
                            </p>
                        </div>
                        <div className={`text-2xl font-black ${week.engagementScore >= 70 ? 'text-emerald-600' : week.engagementScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {Math.round(week.engagementScore || 0)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import FeedbackBar from '../components/student/FeedbackBar';

const StudentDashboard = ({ user }) => {
    const [activePage, setActivePage] = useState('dashboard');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/student/full-engagement')
            .then(res => {
                const history = res.data?.history || [];
                const latest = history.length > 0 ? history[history.length - 1] : null;
                setStudentData({
                    name: user?.name,
                    attendance: latest?.attendance,
                    currentScore: Math.round(latest?.engagementScore || 0),
                    badgeCount: 3
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user?.name]);

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <StudentOverview studentData={studentData} loading={loading} />;
            case 'scores':
                return <StudentEngagementTable viewAs="student" />;
            case 'test':
                return <WeeklyTest />;
            case 'feedbacks':
                return <FeedbackList />;
            case 'trend':
                return <StudentTrendCard />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'assessment':
                return <SelfAssessmentForm />;
            case 'history':
                return <WeeklyHistory />;
            default:
                return <StudentOverview studentData={studentData} loading={loading} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Sidebar role="STUDENT" activeTab={activePage} setActiveTab={setActivePage} />
            <Header title="Student Dashboard" userName={user?.name} role="Student" />
            <main className="main-content">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <ErrorBoundary key={activePage}>
                        {renderContent()}
                    </ErrorBoundary>
                </div>
            </main>
            <FeedbackBar />
        </div>
    );
};

export default StudentDashboard;
