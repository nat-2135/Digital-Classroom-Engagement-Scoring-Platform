import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { ClipboardList, Clock, ArrowRight, Save, CheckCircle2, AlertCircle, XCircle, Timer, Award, ChevronRight, History, Target, Zap, PenTool } from 'lucide-react';

const WeeklyTest = () => {
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testState, setTestState] = useState('available'); // available, ongoing, submitted
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submission, setSubmission] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const resp = await api.get('/api/student/tests/current');
                if (resp.data && resp.data.length > 0) {
                    const submissionsResp = await api.get(`/api/student/full-engagement`);
                    const submittedIds = (submissionsResp.data.testHistory || []).map(s => s.test.id);

                    const unsubmittedTests = resp.data.filter(t => !submittedIds.includes(t.id));
                    let activeTest = unsubmittedTests.length > 0 
                        ? unsubmittedTests[unsubmittedTests.length - 1] 
                        : resp.data[resp.data.length - 1];

                    // Robust questioning parsing logic
                    let questions = [];
                    if (activeTest?.questions) {
                        if (typeof activeTest.questions === 'string') {
                            try {
                                questions = JSON.parse(activeTest.questions);
                            } catch(e) {
                                console.error("Failed to parse test questions", e);
                                questions = [];
                            }
                        } else if (Array.isArray(activeTest.questions)) {
                            questions = activeTest.questions;
                        }
                    }
                    
                    // Sanitize questions - ensure each has expected properties
                    const cleanQuestions = (questions || []).map(q => ({
                        id: q?.id || Math.random(),
                        type: q?.type || 'MC',
                        text: q?.text || 'Standard Inquiry Vector',
                        options: Array.isArray(q?.options) ? q.options : [],
                        correctAnswer: q?.correctAnswer || ''
                    }));

                    const sanitizedTest = {
                        ...activeTest,
                        questions: cleanQuestions,
                        marksPerQuestion: activeTest?.marksPerQuestion || 10,
                        timeLimit: activeTest?.timeLimit || 30,
                        title: activeTest?.title || 'Academic Evaluation Protocol',
                        subject: activeTest?.subject || 'Behavioral Sciences'
                    };
                    
                    setTest(sanitizedTest);
                    setTimeLeft(sanitizedTest.timeLimit * 60);

                    // Check if already submitted with safe navigation
                    const existing = (submissionsResp.data?.testHistory || []).find(s => s?.test?.id === sanitizedTest.id);
                    if (existing) {
                        setSubmission(existing);
                        setTestState('submitted');
                    }
                }
            } catch (e) {
                console.error("Test fetch failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, []);

    useEffect(() => {
        let timer;
        if (testState === 'ongoing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && testState === 'ongoing') {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [testState, timeLeft]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const resp = await api.post(`/api/student/tests/${test?.id}/submit`, {
                answers: JSON.stringify(answers || {})
            });
            setSubmission(resp.data);
            setTestState('submitted');
            setSubmitting(false);
        } catch (e) { 
            console.error("Submission failed", e);
            setSubmitting(false); 
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60) || 0;
        const s = seconds % 60 || 0;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="text-center p-20 text-emerald-700 animate-pulse font-black uppercase tracking-widest text-xs italic">Synchronizing Assessment Database...</div>;
    if (!test) return (
        <div className="text-center p-24 bg-gray-50 border border-dashed border-gray-200 rounded-[50px] flex flex-col items-center gap-8 shadow-inner overflow-hidden relative max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300"><ClipboardList size={28} /></div>
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">No Active Assessments</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Return later for newly deployed evaluation protocols.</p>
            </div>
        </div>
    );

    if (testState === 'available') {
        if (!test.questions || test.questions.length === 0) {
            return (
                <div className="text-center p-24 bg-gray-50 border border-dashed border-gray-200 rounded-[50px] flex flex-col items-center gap-8 shadow-inner overflow-hidden relative max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><AlertCircle size={28} /></div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic text-amber-700">Incomplete Assessment Object</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed px-10">The instructor has deployed a protocol without inquiry vectors. Content synchronization required.</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="card shadow-2xl p-0 overflow-hidden border-emerald-50 bg-white group hover:border-emerald-500 transition-all duration-700 rounded-[40px] max-w-2xl mx-auto animate-in slide-in-from-bottom-10">
                <div className="p-12 bg-gray-900 flex flex-col items-center text-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                        <ClipboardList size={28} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{test.title}</h3>
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.4em]">{test.subject} | Phase Week {test.weekNumber}</p>
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
                            <span className="text-2xl font-black text-gray-900">{(test.questions?.length || 0) * (test.marksPerQuestion || 0)} PTS</span>
                        </div>
                    </div>

                    <div className="p-8 bg-emerald-50/30 rounded-3xl border border-emerald-100 flex flex-col gap-4 italic font-bold">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={14} className="text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Protocol Directives</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-1">{test.instructions || "Standard academic evaluation protocol detected. Proceeed with maximum fidelity."}</p>
                    </div>

                    <button
                        onClick={() => setTestState('ongoing')}
                        className="flex items-center justify-center gap-4 w-full bg-emerald-600 text-white py-7 text-[11px] font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all group"
                    >
                        Initialize Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    if (testState === 'ongoing') {
        const currentQuestion = test.questions?.[currentQ] || { text: 'Unknown Vector', options: [], type: 'MC', id: currentQ };
        
        return (
            <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-1000">
                <div className="h-24 bg-gray-900 px-12 flex items-center justify-between shadow-2xl relative">
                    <div className="flex items-center gap-10">
                        <div className="flex flex-col">
                            <h4 className="text-white text-xl font-black tracking-tighter uppercase italic">{test.title}</h4>
                            <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest">Active Evaluation Sequence</span>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Temporal Synchronizer</span>
                            <div className="flex items-center gap-4 text-white">
                                <Timer size={20} className="text-emerald-500 animate-pulse" />
                                <span className="text-4xl font-black font-mono tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                        <div className="bg-emerald-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / ((test.timeLimit || 30) * 60)) * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[300px] bg-gray-50 border-r border-gray-100 p-12 flex flex-col gap-10 overflow-y-auto hidden lg:flex">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Inquiry Vector Labs</h5>
                        <div className="grid grid-cols-4 gap-4">
                            {test.questions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQ(i)}
                                    className={`w-12 h-12 rounded-[18px] flex items-center justify-center text-xs font-black transition-all ${currentQ === i ? 'bg-gray-900 text-white shadow-2xl scale-110' : answers?.[q?.id] ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 p-12 lg:p-24 overflow-y-auto bg-gray-50/20">
                        <div className="max-w-2xl mx-auto flex flex-col gap-16">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-6xl font-black text-emerald-600/10 italic tabular-nums">0{currentQ + 1}</span>
                                    <div className="h-px flex-1 bg-gray-100"></div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tighter grow italic">{currentQuestion.text}</h2>
                            </div>

                            <div className="flex flex-col gap-8">
                                {currentQuestion.type === 'MC' && (
                                    <div className="grid grid-cols-1 gap-4">
                                        {(currentQuestion.options || []).map((opt, oIdx) => (
                                            <button
                                                key={oIdx}
                                                onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                                                className={`p-10 rounded-3xl text-left border-2 transition-all flex items-center gap-8 group/opt ${answers?.[currentQuestion.id] === opt ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xl shadow-emerald-200' : 'bg-white border-gray-100 text-gray-700 hover:border-emerald-500'}`}
                                            >
                                                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-colors ${answers?.[currentQuestion.id] === opt ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover/opt:bg-emerald-500 group-hover/opt:text-white'}`}>{String.fromCharCode(65 + oIdx)}</span>
                                                <span className="text-xl font-bold italic grow">{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.type === 'TF' && (
                                    <div className="flex gap-8">
                                        {['True', 'False'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setAnswers({ ...answers, [currentQuestion.id]: opt })}
                                                className={`flex-1 p-16 rounded-[40px] text-4xl font-black uppercase tracking-tighter border-2 shadow-2xl transition-all duration-500 ${answers?.[currentQuestion.id] === opt ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-white border-gray-50 text-gray-900 hover:border-emerald-100'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.type === 'SA' && (
                                    <textarea
                                        className="w-full text-2xl font-black border-4 border-gray-50 focus:border-emerald-600 rounded-[40px] p-16 shadow-2xl transition-all resize-none bg-white min-h-[300px] italic"
                                        placeholder="Synthesize analysis..."
                                        value={answers?.[currentQuestion.id] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                                    />
                                )}
                            </div>

                            <div className="mt-10 flex items-center justify-between gap-12 border-t border-gray-100 pt-16">
                                <button
                                    disabled={currentQ === 0}
                                    onClick={() => setCurrentQ(prev => prev - 1)}
                                    className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all"
                                >
                                    Back
                                </button>
                                {currentQ === (test.questions?.length || 0) - 1 ? (
                                    <button
                                        disabled={submitting}
                                        onClick={handleSubmit}
                                        className="px-20 py-6 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl hover:bg-emerald-700 transition-all active:scale-95 italic"
                                    >
                                        Seal Protocol
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQ(prev => prev + 1)}
                                        className="flex items-center gap-4 px-16 py-6 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl hover:bg-emerald-600 transition-all group"
                                    >
                                        Proceed <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (testState === 'submitted') return (
        <div className="card shadow-2xl p-0 overflow-hidden border-gray-100 bg-white group rounded-[40px] max-w-6xl mx-auto animate-in fade-in duration-1000">
            <div className="flex flex-col lg:flex-row min-h-[700px]">
                {/* Left Side: Professional Result Sidebar (Sticky) */}
                <div className="lg:w-96 bg-emerald-600 p-12 flex flex-col items-center justify-between gap-12 text-center shrink-0 relative">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-700/20"></div>
                    
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-[32px] bg-white text-emerald-600 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/30">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Synthesized Result</h2>
                            <p className="text-[10px] text-emerald-100 font-semibold uppercase tracking-widest opacity-80 bg-emerald-800/20 px-4 py-2 rounded-full">Week {test.weekNumber} Concluded</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em] opacity-80 italic">Acquisition Index</span>
                        <div className="relative w-44 h-44">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="88" cy="88" r="78" stroke="rgba(255,255,255,0.1)" strokeWidth="15" fill="none" />
                                <circle
                                    cx="88" cy="88" r="78" stroke="white" strokeWidth="15" fill="none"
                                    strokeDasharray={78 * 2 * Math.PI}
                                    strokeDashoffset={78 * 2 * Math.PI * (1 - ((submission?.score || 0) / (submission?.totalMarks || 1)))}
                                    strokeLinecap="round"
                                    className="transition-all duration-[2000ms] delay-500 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-white tabular-nums">{Math.round(submission?.score || 0)}</span>
                                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-tighter">/ {submission?.totalMarks || 100} Marks</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => (window.location.href = '/')}
                        className="w-full py-5 bg-emerald-800/30 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl border border-emerald-400/20 hover:bg-emerald-800/50 transition-all transition-all active:scale-[0.98] mt-auto"
                    >
                        Finalize Return
                    </button>
                </div>

                {/* Right Side: Detailed Narrative Log */}
                <div className="flex-1 p-12 lg:p-16 bg-white overflow-y-auto">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-4">
                            <div className="h-1.5 w-24 bg-emerald-600 rounded-full"></div>
                            <h4 className="text-3xl font-bold text-gray-900 tracking-tight">Inquiry Retrieval Log</h4>
                            <p className="text-sm text-gray-400 font-medium">A detailed breakdown of your diagnostic response accuracy across the evaluated inquiry vectors.</p>
                        </div>

                        <div className="flex flex-col gap-6">
                            {(test.questions || []).map((q, i) => {
                                let ansObj = {};
                                try { ansObj = JSON.parse(submission?.answers || '{}'); } catch(e) {}
                                const studentAns = ansObj?.[q?.id] || 'N/A';
                                const isCorrect = q?.correctAnswer && studentAns && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                                return (
                                    <div key={i} className="p-8 bg-gray-50 border border-gray-100 rounded-[32px] flex flex-col gap-6 hover:bg-white hover:shadow-xl hover:border-emerald-200 transition-all duration-700 group/log">
                                        <div className="flex items-start gap-4">
                                            <span className="text-4xl font-black text-emerald-600/10 shrink-0 group-hover/log:text-emerald-500/20 transition-colors">0{i + 1}</span>
                                            <h5 className="text-lg font-bold text-gray-900 leading-snug grow italic">{q.text}</h5>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-12">
                                            <div className={`p-6 rounded-2xl border-2 transition-all ${isCorrect ? 'bg-emerald-50/50 border-emerald-100 shadow-emerald-50' : 'bg-red-50/50 border-red-100 shadow-red-50'}`}>
                                                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-400 block mb-2">Captured Entry</span>
                                                <p className={`text-sm font-black italic ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>"{studentAns}"</p>
                                            </div>
                                            <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 shadow-sm">
                                                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-emerald-500/40 block mb-2">Target Logic</span>
                                                <p className="text-sm font-black text-emerald-400 italic">"{q.correctAnswer}"</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="pt-10 border-t border-gray-100 text-center">
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Academic Integrity Protocol Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyTest;
