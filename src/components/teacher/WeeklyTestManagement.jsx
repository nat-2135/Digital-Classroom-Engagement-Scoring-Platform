import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { Plus, CheckCircle, ClipboardList, Eye, Trash2, Send, Save, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const WeeklyTestManagement = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [editingScore, setEditingScore] = useState({});

    // Test creation state
    const [newTest, setNewTest] = useState({
        title: '',
        subject: '',
        weekNumber: 1,
        instructions: '',
        marksPerQuestion: 10,
        timeLimit: 30,
        dueDate: '',
        questions: []
    });

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/api/teacher/tests');
            const sorted = resp.data.sort((a, b) => b.id - a.id);
            setTests(sorted);
        } catch (e) {} finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (tests.length > 0 && !selectedTestId) {
            fetchSubmissions(tests[0].id);
        }
    }, [tests]);

    const handleCreateTest = async () => {
        try {
            await api.post('/api/teacher/tests/create', {
                ...newTest,
                questions: JSON.stringify(newTest.questions)
            });
            setActiveTab('submissions');
            fetchData();
        } catch (e) { }
    };

    const addQuestion = (type) => {
        const q = { id: Date.now(), type, text: '', options: type === 'MC' ? ['', '', '', ''] : [], correctAnswer: '' };
        setNewTest({ ...newTest, questions: [...newTest.questions, q] });
    };

    const updateQuestion = (id, field, value) => {
        const qs = newTest.questions.map(q => q.id === id ? { ...q, [field]: value } : q);
        setNewTest({ ...newTest, questions: qs });
    };

    const fetchSubmissions = async (testId) => {
        setSelectedTestId(testId);
        try {
            const resp = await api.get(`/api/teacher/tests/${testId}/submissions`);
            setSubmissions(resp.data);
            setExpandedRows({});
            setEditingScore({});
        } catch (e) { }
    };

    const updateScore = async (subId, newScore) => {
        try {
            await api.put(`/api/teacher/tests/submissions/${subId}`, { score: parseInt(newScore) || 0 });
            setSubmissions(submissions.map(s => s.id === subId ? { ...s, score: parseInt(newScore) || 0 } : s));
            setEditingScore(prev => { const n = { ...prev }; delete n[subId]; return n; });
        } catch(e) {}
    };

    return (
        <div className="card shadow-lg p-0 overflow-hidden border-emerald-100 rounded-[32px] bg-white">
            <div className="flex border-b border-emerald-50 bg-emerald-50/10">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center gap-3 px-10 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-gray-400 hover:bg-gray-50/50'}`}
                >
                    <Plus size={16} /> Create Assessment
                </button>
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`flex items-center gap-3 px-10 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'submissions' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-gray-400 hover:bg-gray-50/50'}`}
                >
                    <CheckCircle size={16} /> Evaluation Registry
                </button>
            </div>

            <div className={`overflow-hidden ${activeTab === 'submissions' ? 'p-0' : 'p-10'}`}>
                {activeTab === 'create' ? (
                    <div className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 shadow-sm">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                                <input className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.title} onChange={(e) => setNewTest({ ...newTest, title: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                                <input className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.subject} onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Week</label>
                                <input type="number" className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.weekNumber} onChange={(e) => setNewTest({ ...newTest, weekNumber: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Points/Q</label>
                                <input type="number" className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.marksPerQuestion} onChange={(e) => setNewTest({ ...newTest, marksPerQuestion: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Time (Min)</label>
                                <input type="number" className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.timeLimit} onChange={(e) => setNewTest({ ...newTest, timeLimit: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Deadline</label>
                                <input type="datetime-local" className="w-full text-sm font-bold border border-gray-100 bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none rounded-2xl p-5 shadow-sm transition-all" value={newTest.dueDate} onChange={(e) => setNewTest({ ...newTest, dueDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Intelligence Matrix Formulation</h4>
                                <div className="flex gap-3">
                                    <button onClick={() => addQuestion('MC')} className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-gray-200"><Plus size={14} /> MC</button>
                                    <button onClick={() => addQuestion('TF')} className="text-[10px] font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-full hover:border-black transition-all flex items-center gap-2 shadow-sm"><Plus size={14} /> T/F</button>
                                </div>
                            </div>
                            {newTest.questions.map((q, idx) => (
                                <div key={q.id} className="p-8 bg-gray-50/30 border border-gray-100 rounded-[32px] flex flex-col gap-6 relative group">
                                    <button onClick={() => setNewTest({ ...newTest, questions: newTest.questions.filter(qu => qu.id !== q.id) })} className="absolute -top-3 -right-3 bg-red-50 text-red-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-red-100 shadow-lg"><Trash2 size={16} /></button>
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-black text-emerald-600/10 italic">0{idx + 1}</span>
                                        <input className="flex-1 text-base font-black bg-white border-2 border-gray-100 focus:border-emerald-500 rounded-2xl p-6 outline-none shadow-sm placeholder:text-gray-200 italic" placeholder="Formulate inquiry..." value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} />
                                    </div>
                                    {q.type === 'MC' && (
                                        <div className="grid grid-cols-2 gap-4 ml-12">
                                            {q.options.map((opt, oIdx) => (
                                                <input key={oIdx} className="text-xs font-bold bg-white border border-gray-100 focus:border-emerald-500 rounded-xl p-4" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => { const n = [...q.options]; n[oIdx] = e.target.value; updateQuestion(q.id, 'options', n); }} />
                                            ))}
                                            <select className="col-span-2 text-xs font-black bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 outline-none uppercase tracking-widest" value={q.correctAnswer} onChange={(e) => updateQuestion(q.id, 'correctAnswer', e.target.value)}>
                                                <option value="">Define Target Logic</option>
                                                {q.options.filter(o => o.trim()).map((o, i) => <option key={i} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleCreateTest} className="mt-6 bg-emerald-600 text-white py-6 text-sm font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 italic">Deploy Evaluation Protocol</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {loading && tests.length === 0 ? (
                            <div className="bg-white text-center py-20 animate-pulse text-emerald-600 font-black uppercase tracking-widest italic">Synchronizing Assessment Registry...</div>
                        ) : tests.length === 0 ? (
                            <div className="m-10 text-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-[32px] flex flex-col items-center gap-6">
                                <ClipboardList size={40} className="text-gray-200" />
                                <h5 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">No Active Assessments Found</h5>
                                <button onClick={() => setActiveTab('create')} className="bg-emerald-600 text-white text-[10px] font-black px-10 py-4 rounded-full shadow-2xl shadow-emerald-200 uppercase tracking-widest hover:scale-105 transition-all">Launch First Protocol</button>
                            </div>
                        ) : !selectedTestId ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
                                {tests.map((test) => (
                                    <div key={test.id} onClick={() => fetchSubmissions(test.id)} className="p-8 bg-white border border-gray-100 rounded-[32px] cursor-pointer hover:border-emerald-500 transition-all group flex flex-col gap-6 shadow-sm hover:shadow-2xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">Week {test.weekNumber}</span>
                                            <Eye size={18} className="text-gray-200 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h5 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">{test.title}</h5>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{test.subject}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col animate-in fade-in duration-500">
                                <div className="p-10 bg-gray-900 flex items-center justify-between text-white">
                                    <div className="flex items-center gap-10">
                                        <div className="flex flex-col">
                                            <h5 className="text-xl font-black uppercase tracking-tighter italic">Evaluation Ledger</h5>
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Verified Submissions Log</span>
                                        </div>
                                        <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                                        <div className="flex-col hidden md:flex">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Selected Protocol</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm font-black text-emerald-100 uppercase italic">{tests.find(t => t.id === selectedTestId)?.title}</span>
                                                <span className="text-[10px] font-black bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">W{tests.find(t => t.id === selectedTestId)?.weekNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTestId(null)} className="text-[10px] font-black bg-white/5 hover:bg-white/10 text-emerald-100 px-8 py-4 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md transition-all">Change Protocol</button>
                                </div>
                                <div className="overflow-x-auto bg-white">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Student Profile</th>
                                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Engagement Score</th>
                                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 text-center">Inquiry Review</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {submissions.map((sub) => {
                                                const answers = sub.answers ? (typeof sub.answers === 'string' ? JSON.parse(sub.answers) : sub.answers) : {};
                                                const qList = JSON.parse(tests.find(t => t.id === selectedTestId)?.questions || '[]');
                                                return (
                                                    <React.Fragment key={sub.id}>
                                                        <tr className="hover:bg-emerald-50/20 transition-all duration-300">
                                                            <td className="px-10 py-8 font-black text-gray-900 italic">{sub.student.name}</td>
                                                            <td className="px-10 py-8">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-2xl font-black text-emerald-700 tabular-nums">{Math.round(sub.score)}</span>
                                                                    <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-emerald-500" style={{ width: `${(sub.score/sub.totalMarks)*100}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-10 py-8 text-center">
                                                                <button onClick={() => setExpandedRows({...expandedRows, [sub.id]: !expandedRows[sub.id]})} className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full transition-all ${expandedRows[sub.id] ? 'bg-gray-900 text-white shadow-xl' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                                                                    {expandedRows[sub.id] ? 'Close Review' : 'Perform Review'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {expandedRows[sub.id] && (
                                                            <tr className="bg-gray-50/50">
                                                                <td colSpan="3" className="px-10 py-12">
                                                                    <div className="grid grid-cols-1 gap-4">
                                                                        {qList.map((q, idx) => (
                                                                            <div key={idx} className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm">
                                                                                <p className="text-sm font-black text-gray-900 mb-4 flex items-center gap-3">
                                                                                    <span className="text-emerald-500/20 tabular-nums">0{idx+1}</span> {q.text}
                                                                                </p>
                                                                                <div className="grid grid-cols-2 gap-4">
                                                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Student Entry</span>
                                                                                        <p className={`text-sm font-bold ${answers[q.id] === q.correctAnswer ? 'text-emerald-700' : 'text-red-500'}`}>"{answers[q.id] || 'NULL'}"</p>
                                                                                    </div>
                                                                                    <div className="p-4 bg-gray-900 rounded-xl border border-black shadow-lg">
                                                                                        <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest block mb-1">Target Key</span>
                                                                                        <p className="text-sm font-bold text-emerald-400">"{q.correctAnswer}"</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                            {submissions.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="py-20 text-center text-gray-400 font-black uppercase tracking-widest text-xs italic">
                                                        <AlertCircle size={32} className="mx-auto mb-4 opacity-20" />
                                                        No submissions detected
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeeklyTestManagement;
