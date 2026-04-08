import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { ClipboardList, Clock, ArrowRight, ArrowLeft, Save, CheckCircle2, AlertCircle, XCircle, Timer, Award, ChevronRight, History, Target, Zap, PenTool, RefreshCcw, Send } from 'lucide-react';

// --- SUB-COMPONENT: Test Interface (Separated for logic encapsulation) ---
const TestInterface = ({ test, onComplete, onCancel }) => {
    const [testState, setTestState] = useState('directives'); // 'directives', 'exam', 'finished'
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState((test.timeLimit || 30) * 60);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        let timer;
        if (testState === 'exam' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && testState === 'exam') {
            submitAuto();
        }
        return () => clearInterval(timer);
    }, [testState, timeLeft]);

    const submitAuto = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            const resp = await api.post(`/api/student/tests/${test.id}/submit`, {
                answers: JSON.stringify(answers || {})
            });
            setResult(resp.data);
            setTestState('finished');
            onComplete(); // Triggers a parent registry refresh
        } catch (e) {
            console.error("Submission failed", e);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60) || 0;
        const s = seconds % 60 || 0;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    if (testState === 'directives') {
        return (
            <div className="card shadow-2xl p-0 overflow-hidden border-emerald-50 bg-white group hover:border-emerald-500 transition-all duration-700 rounded-[40px] max-w-2xl mx-auto animate-in slide-in-from-bottom-10">
                <div className="p-12 bg-gray-900 flex flex-col items-center text-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                        <ClipboardList size={28} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{test.title}</h3>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.4em]">{test.subject} | Week {test.weekNumber}</p>
                    </div>
                </div>

                <div className="p-12 flex flex-col gap-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3 p-8 bg-gray-50/50 rounded-3xl border border-gray-100 items-center justify-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Cap</span>
                            <span className="text-2xl font-black text-gray-900">{test.timeLimit} MIN</span>
                        </div>
                        <div className="flex flex-col gap-3 p-8 bg-gray-50/50 rounded-3xl border border-gray-100 items-center justify-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Threshold</span>
                            <span className="text-2xl font-black text-gray-900">{(test.questions?.length || 0) * (test.marksPerQuestion || 0)} P</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 italic p-6 bg-gray-50 rounded-2xl border border-gray-100">{test.instructions || "Standard academic evaluation protocol detected."}</p>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => setTestState('exam')} className="flex items-center justify-center gap-4 w-full bg-emerald-600 text-white py-7 text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] transition-all group">Initialize Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /> </button>
                        <button onClick={onCancel} className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 border-2 border-gray-100 rounded-3xl hover:bg-gray-50 transition-all">Return to Registry</button>
                    </div>
                </div>
            </div>
        );
    }

    if (testState === 'exam') {
        const q = test.questions[currentQ] || { text: 'Inquiry Matrix Missing' };
        return (
            <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in">
                <div className="h-24 bg-gray-900 px-12 flex items-center justify-between shadow-2xl">
                    <div className="flex flex-col">
                        <h4 className="text-white text-xl font-black tracking-tighter uppercase italic">{test.title}</h4>
                        <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Active Sequence</span>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                        <Timer size={20} className="text-emerald-500" />
                        <span className="text-4xl font-black font-mono tabular-nums">{formatTime(timeLeft)}</span>
                    </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[300px] bg-gray-50 border-r p-12 overflow-y-auto hidden lg:block">
                         <div className="grid grid-cols-4 gap-4">
                            {test.questions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentQ(i)} className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-xs font-black transition-all ${currentQ === i ? 'bg-gray-900 text-white shadow-2xl' : answers[_.id] ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-gray-400'}`}>{i + 1}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 p-24 bg-gray-50/20 overflow-y-auto">
                        <div className="max-w-2xl mx-auto flex flex-col gap-16">
                            <h2 className="text-3xl font-black text-gray-900 leading-tight italic">{q.text}</h2>
                            <div className="flex flex-col gap-4">
                                {q.type === 'MC' && q.options.map((opt, oi) => (
                                    <button key={oi} onClick={() => setAnswers({...answers, [q.id]: opt})} className={`p-8 rounded-3xl text-left border-2 transition-all flex items-center gap-6 ${answers[q.id] === opt ? 'bg-emerald-600 border-emerald-700 text-white shadow-xl' : 'bg-white'}`}>
                                        <span className="text-xs font-black p-4 bg-gray-50/50 rounded-xl">{String.fromCharCode(65+oi)}</span>
                                        <span className="text-xl font-bold">{opt}</span>
                                    </button>
                                ))}
                                {q.type === 'TF' && ['True', 'False'].map(opt => (
                                    <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} className={`flex-1 p-12 rounded-3xl text-2xl font-black border-2 transition-all ${answers[q.id] === opt ? 'bg-emerald-600 text-white' : 'bg-white'}`}>{opt}</button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-16 border-t border-gray-100">
                                <button disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">Back</button>
                                {currentQ === test.questions.length - 1 ? (
                                    <button onClick={submitAuto} className="px-16 py-6 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl hover:bg-emerald-700">Seal Protocol</button>
                                ) : (
                                    <button onClick={() => setCurrentQ(prev => prev + 1)} className="px-16 py-6 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-600">Proceed</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (testState === 'finished') {
        return (
            <div className="card shadow-2xl p-0 overflow-hidden border-gray-100 bg-white rounded-[40px] max-w-4xl mx-auto animate-in fade-in">
                <div className="flex flex-col lg:flex-row min-h-[500px]">
                    <div className="lg:w-80 bg-emerald-600 p-12 flex flex-col items-center justify-center text-center gap-8">
                         <div className="w-16 h-16 rounded-[24px] bg-white text-emerald-600 flex items-center justify-center shadow-xl"><CheckCircle2 size={32} /></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest opacity-60">Inquiry Result Retrieval</span>
                            <span className="text-5xl font-black text-white tabular-nums">{Math.round(result?.score)}</span>
                            <span className="text-[10px] font-black text-white uppercase mt-1">/ {result?.totalMarks} Marks</span>
                         </div>
                         <button onClick={onCancel} className="w-full py-4 bg-emerald-800/30 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-800/50 transition-all border border-emerald-400/20 mt-8">Registry Log</button>
                    </div>
                    <div className="flex-1 p-16 bg-gray-50/30 overflow-y-auto">
                        <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-10">Vector Assessment Log</h4>
                        <div className="flex flex-col gap-6">
                            {(test.questions || []).map((q, i) => {
                                const ansObj = JSON.parse(result?.answers || '{}');
                                const isCorrect = String(ansObj[q.id]?.trim() || '').toLowerCase() === String(q.correctAnswer?.trim() || '').toLowerCase();
                                return (
                                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col gap-4">
                                        <p className="text-sm font-black text-gray-900 flex items-center gap-2"><span className="text-emerald-500/20">0{i+1}</span> {q.text}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'} text-xs font-bold`}>"{ansObj[q.id] || 'N/A'}"</div>
                                            <div className="p-4 rounded-xl border bg-gray-900 border-black text-emerald-400 text-xs font-bold">"{q.correctAnswer}"</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// --- MAIN COMPONENT: WeeklyTest Registry + Orchestrator ---
const WeeklyTest = () => {
    const [allTests, setAllTests] = useState([]);
    const [testSubmissions, setTestSubmissions] = useState([]);
    const [activeTest, setActiveTest] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [testsResp, fullEngResp] = await Promise.all([
                api.get('/api/student/tests/current'),
                api.get('/api/student/full-engagement')
            ]);
            setAllTests(testsResp.data || []);
            setTestSubmissions(fullEngResp.data?.testHistory || []);
        } catch (e) {
            console.error("Fetch failure", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const startProtocol = (protocol) => {
        let questions = [];
        try {
            questions = typeof protocol.questions === 'string' ? JSON.parse(protocol.questions) : (protocol.questions || []);
        } catch(e) { questions = []; }

        setActiveTest({
            ...protocol,
            questions: (questions || []).map(q => ({
                id: q.id || Math.random(),
                type: q.type || 'MC',
                text: q.text || 'Inquiry Vector',
                options: q.options || [],
                correctAnswer: q.correctAnswer || ''
            }))
        });
    };

    if (loading) return <div className="text-center p-20 text-emerald-700 animate-pulse font-black uppercase tracking-widest text-xs italic">Synchronizing Registry...</div>;

    if (activeTest) {
        return <TestInterface test={activeTest} onComplete={fetchData} onCancel={() => setActiveTest(null)} />;
    }

    return (
        <div className="flex flex-col gap-10 animate-in fade-in duration-700">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-8 px-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gray-900 rounded-2xl text-white shadow-xl"><ClipboardList size={22} /></div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Weekly Assessment Registry</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Identification Phase</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                {allTests.length === 0 ? (
                    <div className="col-span-full py-32 bg-gray-50 border border-dashed border-gray-200 rounded-[50px] flex flex-col items-center gap-6 text-center">
                        <AlertCircle size={40} className="text-gray-200" />
                        <h4 className="text-xl font-black text-gray-800 uppercase italic">Awaiting Deployment</h4>
                    </div>
                ) : (
                    allTests.map((t) => {
                        const sub = testSubmissions.find(s => s?.test?.id === t.id);
                        return (
                            <div key={t.id} className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500 transition-all duration-500 group flex flex-col gap-8">
                                <div className={`self-end px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${sub ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-black'}`}>
                                    {sub ? 'COMPLETED' : 'READY'}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">{t.title}</h3>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.subject} | Week {t.weekNumber}</span>
                                </div>
                                <button 
                                    onClick={() => startProtocol(t)} 
                                    className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${sub ? 'bg-gray-900 text-white hover:bg-black' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
                                >
                                    {sub ? 'Review Results' : 'Initialize Protocol'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default WeeklyTest;
