import React, { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import WelcomeCard from '../components/shared/WelcomeCard';
import AtRiskPanel from '../components/teacher/AtRiskPanel';
import TrendSparkline from '../components/teacher/TrendSparkline';
import WeeklyTestManagement from '../components/teacher/WeeklyTestManagement';
import SelfAssessmentMismatch from '../components/teacher/SelfAssessmentMismatch';
import StudentEngagementTable from '../components/shared/StudentEngagementTable';
import Leaderboard from '../components/student/Leaderboard';
import AnalyticsReport from '../components/teacher/AnalyticsReport';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import api from '../utils/axiosInstance';

const TeacherEngagementEnter = ({ studentsList, selectedStudentId, setSelectedStudentId, formState, setFormState, toast, setToast, handleSaveScore, hasExisting, refreshTrigger }) => {
    const [weekTestInfo, setWeekTestInfo] = useState({ score: 0, total: 100, exists: false });

    useEffect(() => {
        if (selectedStudentId && formState.week) {
            api.get(`/api/teacher/students/${selectedStudentId}/full-engagement`)
                .then(res => {
                    const test = res.data.testHistory?.find(t => t.test.weekNumber === parseInt(formState.week));
                    if (test) setWeekTestInfo({ score: test.score, total: test.totalMarks, exists: true });
                    else setWeekTestInfo({ score: 0, total: 100, exists: false });
                }).catch(() => {});
        }
    }, [selectedStudentId, formState.week]);

    const calculateScore = () => {
        const att = parseFloat(formState.attendance) || 0;
        const part = parseFloat(formState.participation) || 0;
        let pScore = 0;
        if (formState.assignmentStatus === 'ON_TIME') pScore = 20;
        if (formState.assignmentStatus === 'LATE') pScore = 10;
        const score = (att * 0.5) + ((part / 5) * 100 * 0.3) + pScore;
        return score.toFixed(1);
    };

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Enter Student Scores</h3>
            
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100 mb-6 max-w-4xl">
                {toast.show && <div className={`mb-8 p-4 rounded-2xl font-bold text-center uppercase tracking-widest text-[10px] ${toast.type === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{toast.message}</div>}
                
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Select Target Student</label>
                <select className="w-full border-2 border-gray-50 p-5 rounded-3xl mb-10 bg-gray-50/50 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-lg text-gray-900" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                    <option value="">-- Choose a Student Profile --</option>
                    {studentsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                {selectedStudentId && (
                    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Academic Week</label>
                                <input type="number" className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-emerald-500 outline-none font-bold bg-white shadow-sm" value={formState.week} onChange={e => setFormState({ ...formState, week: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Attendance %</label>
                                <input type="number" min="0" max="100" className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-emerald-500 outline-none font-bold bg-white shadow-sm" value={formState.attendance} onChange={e => setFormState({ ...formState, attendance: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Classroom Participation (1-5)</label>
                                <input type="number" min="1" max="5" className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-emerald-500 outline-none font-bold bg-white shadow-sm" value={formState.participation} onChange={e => setFormState({ ...formState, participation: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Assignment Submission Status</label>
                                <select className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-emerald-500 outline-none font-bold bg-white shadow-sm" value={formState.assignmentStatus} onChange={e => setFormState({ ...formState, assignmentStatus: e.target.value })}>
                                    <option value="ON_TIME">On Time (Excellence)</option>
                                    <option value="LATE">Late Submission</option>
                                    <option value="NOT_SUBMITTED">No Submission Detected</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="bg-emerald-50/50 p-8 rounded-[30px] border-2 border-emerald-100 flex flex-col gap-1 transition-all hover:shadow-lg">
                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest opacity-60">Calculated Score Preview</span>
                                <span className="text-4xl font-black text-emerald-600 tracking-tighter">{calculateScore()} <span className="text-sm font-bold opacity-30">/ 100</span></span>
                            </div>
                            <div className={`p-8 rounded-[30px] border-2 flex flex-col gap-1 transition-all hover:shadow-lg ${weekTestInfo.exists ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                                <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${weekTestInfo.exists ? 'text-blue-800' : 'text-gray-500'}`}>Weekly Assessment Result</span>
                                <span className={`text-4xl font-black tracking-tighter ${weekTestInfo.exists ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {weekTestInfo.exists ? weekTestInfo.score.toFixed(1) : '—'} 
                                    <span className="text-sm font-bold opacity-30"> / {weekTestInfo.exists ? weekTestInfo.total : '00'}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            {hasExisting ? (
                                <button onClick={handleSaveScore} className="flex-1 bg-white border-4 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white py-6 rounded-[30px] text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]">Synchronize Record</button>
                            ) : (
                                <button onClick={handleSaveScore} className="flex-1 bg-emerald-600 text-white hover:bg-black py-6 rounded-[30px] text-sm font-black uppercase tracking-widest transition-all shadow-2xl shadow-emerald-200 active:scale-[0.98]">Finalize Performance Entry</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {selectedStudentId && (
                <div className="animate-in fade-in duration-1000">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6 ml-4 border-l-4 border-emerald-500 pl-4 italic">Engagement History Ledger</h3>
                    <StudentEngagementTable studentId={selectedStudentId} role="TEACHER" refreshTrigger={refreshTrigger} />
                </div>
            )}
        </div>
    );
};

const TeacherOverview = ({ user, studentsList }) => {
    const [stats, setStats] = useState({ total: 0, atRisk: 0, avgScore: 0, topPerformers: 0 });

    useEffect(() => {
        api.get('/api/teacher/students/engagement-history')
            .then(res => {
                const students = res.data || [];
                const scores = students.map(s => {
                    const hist = s.history || [];
                    return hist.length > 0 ? hist[hist.length - 1].engagementScore : 0;
                });
                const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                setStats({
                    total: students.length,
                    atRisk: students.filter(s => {
                        const hist = s.history || [];
                        const sc = hist.length > 0 ? hist[hist.length - 1].engagementScore : 0;
                        return sc < 50;
                    }).length,
                    avgScore: avg.toFixed(1),
                    topPerformers: scores.filter(s => s > 80).length
                });
            })
            .catch(() => {});
    }, []);

    return (
        <div className="flex flex-col gap-10">
            <WelcomeCard name={user?.name} role="Teacher" />

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Students</span>
                    <span className="text-4xl font-extrabold text-gray-900">{stats.total}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">Active</span>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">At Risk</span>
                    <span className="text-4xl font-extrabold text-red-600">{stats.atRisk}</span>
                    <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">Need Attention</span>
                </div>
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Avg. Score</span>
                    <span className="text-4xl font-extrabold text-blue-700">{stats.avgScore}</span>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">Class Average</span>
                </div>
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Top Performers</span>
                    <span className="text-4xl font-extrabold text-amber-600">{stats.topPerformers}</span>
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">Score &gt; 80</span>
                </div>
            </div>

            {/* Panels */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-500 rounded-full inline-block"></span>
                            Students Needing Help
                        </h3>
                        <AtRiskPanel />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
                            Self-Assessment Mismatches
                        </h3>
                        <SelfAssessmentMismatch />
                    </div>
                </div>
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                            Quick Info
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <p className="text-sm font-semibold text-emerald-800">{stats.total} students enrolled</p>
                                <p className="text-xs text-emerald-600/70 mt-1 uppercase tracking-wider font-bold">Monitor progress in sidebar</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-sm font-semibold text-blue-800">Weekly Score Updates</p>
                                <p className="text-xs text-blue-600/70 mt-1 uppercase tracking-wider font-bold">Ensure data is kept current</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <p className="text-sm font-semibold text-amber-800">Performance Rankings</p>
                                <p className="text-xs text-amber-600/70 mt-1 uppercase tracking-wider font-bold">View top performing students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeacherDashboard = ({ user }) => {
    const [activePage, setActivePage] = useState('overview');
    const [studentsList, setStudentsList] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [formState, setFormState] = useState({ week: '', attendance: '', participation: '', assignmentStatus: 'ON_TIME' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [hasExisting, setHasExisting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        api.get('/api/teacher/students').then(res => setStudentsList(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            api.get(`/api/teacher/students/${selectedStudentId}/latest-engagement`)
                .then(res => {
                    if (res.status === 204 || !res.data) {
                        setFormState({ week: '', attendance: '', participation: '', assignmentStatus: 'ON_TIME' });
                        setHasExisting(false);
                    } else {
                        setFormState({
                            week: res.data.week,
                            attendance: res.data.attendance,
                            participation: res.data.participation,
                            assignmentStatus: res.data.assignmentStatus
                        });
                        setHasExisting(true);
                    }
                }).catch(console.error);
        } else {
            setFormState({ week: '', attendance: '', participation: '', assignmentStatus: 'ON_TIME' });
            setHasExisting(false);
        }
    }, [selectedStudentId]);

    const handleSaveScore = async () => {
        try {
            const endpoint = hasExisting ? `/api/teacher/engagement/${selectedStudentId}` : `/api/teacher/engagement`;
            const method = hasExisting ? api.put : api.post;
            await method(endpoint, { studentId: selectedStudentId, ...formState });
            const sName = studentsList.find(s => s.id.toString() === selectedStudentId?.toString())?.name;
            setToast({ show: true, message: `Score saved for ${sName}!`, type: 'green' });
            setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
            setHasExisting(true);
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            setToast({ show: true, message: 'Failed to save. Please try again.', type: 'red' });
            setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
        }
    };

    const renderContent = () => {
        switch (activePage) {
            case 'overview':
                return <TeacherOverview user={user} />;
            case 'engagement':
                return <TeacherEngagementEnter studentsList={studentsList} selectedStudentId={selectedStudentId} setSelectedStudentId={setSelectedStudentId} formState={formState} setFormState={setFormState} toast={toast} setToast={setToast} handleSaveScore={handleSaveScore} hasExisting={hasExisting} refreshTrigger={refreshTrigger} />;
            case 'tests':
                return <WeeklyTestManagement />;
            case 'students':
                return (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                My Students
                            </h3>
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">{studentsList.length} enrolled</span>
                        </div>
                        <StudentEngagementTable role="TEACHER" refreshTrigger={refreshTrigger} />
                    </div>
                );
            case 'atrisk':
                return <AtRiskPanel />;
            case 'assessment':
                return <SelfAssessmentMismatch />;
            case 'leaderboard':
                return <Leaderboard viewAs="teacher" />;
            case 'reports':
                return <AnalyticsReport />;
            default:
                return <TeacherOverview user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Sidebar role="TEACHER" activeTab={activePage} setActiveTab={setActivePage} />
            <Header title="Teacher Dashboard" userName={user?.name} role="Teacher" />
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

export default TeacherDashboard;
