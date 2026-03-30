import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { Star, MessageSquare, CheckCircle, Save, PenTool, Edit3, MessageCircle, RefreshCcw } from 'lucide-react';

const SelfAssessmentForm = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        participationRating: 0,
        confidenceRating: 0,
        comments: '',
        week: 1 // In real app, this would be dynamic
    });
    const [saving, setSaving] = useState(false);

    const fetchCurrent = async () => {
        try {
            const resp = await api.get(`/api/student/self-assessment/current-week?week=${data.week}`);
            if (resp.data) {
                setData(resp.data);
                setSubmitted(true);
            }
        } catch (e) { } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchCurrent();
    }, [data.week]);

    const handleSubmit = async () => {
        if (data.participationRating === 0 || data.confidenceRating === 0) return;
        setSaving(true);
        try {
            await api.post('/api/student/self-assessment', data);
            setSubmitted(true);
            setSaving(false);
        } catch (e) { setSaving(false); }
    };

    const setRating = (field, val) => {
        if (submitted) return;
        setData({ ...data, [field]: data[field] === val ? 0 : val });
    };

    if (loading) return <div className="text-center p-20 text-emerald-700 animate-pulse font-black uppercase tracking-widest text-sm">Synchronizing Reflection Database...</div>;

    return (
        <div className="card shadow-2xl p-0 overflow-hidden border-emerald-50 bg-white group hover:shadow-emerald-100 transition-all duration-700">
            <div className={`p-10 lg:p-12 border-b-4 flex items-center justify-between transition-colors duration-500 ${submitted ? 'bg-emerald-600 border-emerald-700 shadow-lg' : 'bg-emerald-50 border-emerald-100 shadow-inner'}`}>
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center backdrop-blur-md transition-transform duration-500 group-hover:rotate-6 ${submitted ? 'bg-white/20' : 'bg-emerald-600'}`}>
                        {submitted ? <CheckCircle size={28} className="text-white" /> : <PenTool size={28} className="text-white" />}
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`text-2xl font-black tracking-tighter uppercase italic ${submitted ? 'text-white' : 'text-emerald-900'}`}>{submitted ? "Reflection Synchronized" : "Weekly Metacognitive Analysis"}</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest pl-1 ${submitted ? 'text-white/70' : 'text-emerald-600/50'}`}>{submitted ? "Your weekly self-assessment has been authenticated." : "Self-Correction Cycle: Week 1 Reflection"}</p>
                    </div>
                </div>
                {submitted && (
                    <div className="px-5 py-2 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in duration-500">
                        <CheckCircle size={12} /> Milestone Achieved
                    </div>
                )}
            </div>

            <div className="p-10 lg:p-14">
                {submitted ? (
                    <div className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-emerald-50/20 p-10 rounded-[40px] border-2 border-emerald-50/50 shadow-inner relative overflow-hidden group/inner">
                            <div className="flex flex-col items-center gap-6 text-center group-hover/inner:translate-y-[-4px] transition-transform duration-500">
                                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest opacity-40">Participation Perception</span>
                                <div className="flex items-center gap-2 bg-white p-4 rounded-3xl border border-emerald-100 shadow-xl">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={32} className={s <= data.participationRating ? 'fill-emerald-500 text-emerald-500 scale-110 drop-shadow-md' : 'text-emerald-50'} />
                                    ))}
                                </div>
                                <span className="text-sm font-black text-emerald-700 bg-white px-6 py-2 rounded-full uppercase italic border border-emerald-100 shadow-inner">P: {data.participationRating} / 5 Rating</span>
                            </div>
                            <div className="flex flex-col items-center gap-6 text-center group-hover/inner:translate-y-[-4px] transition-transform duration-500">
                                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest opacity-40">Confidence Coefficient</span>
                                <div className="flex items-center gap-2 bg-white p-4 rounded-3xl border border-emerald-100 shadow-xl">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={32} className={s <= data.confidenceRating ? 'fill-blue-500 text-blue-500 scale-110 drop-shadow-md' : 'text-blue-50'} />
                                    ))}
                                </div>
                                <span className="text-sm font-black text-blue-700 bg-white px-6 py-2 rounded-full uppercase italic border border-blue-100 shadow-inner">C: {data.confidenceRating} / 5 Rating</span>
                            </div>
                        </div>

                        <div className={`p-10 rounded-[40px] border-2 flex flex-col gap-4 shadow-xl relative transition-all duration-700 ${data.teacherNote ? 'bg-amber-50 border-amber-100 mt-4' : 'bg-gray-50/30 border-gray-100 mt-4'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-2xl ${data.teacherNote ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Self-Reflective Analysis Content</span>
                                </div>
                            </div>
                            <p className="text-base font-black text-gray-800 leading-relaxed indent-8 italic">"{data.comments || "No qualitative data provided for this cycle."}"</p>

                            {data.teacherNote && (
                                <div className="mt-8 pt-8 border-t-2 border-amber-200/50 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-1000">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-4 py-1.5 rounded-full bg-white shadow-sm">Official Faculty Feedback Response</span>
                                    </div>
                                    <p className="text-sm font-bold text-amber-900 leading-relaxed bg-white/50 p-6 rounded-3xl italic">"{data.teacherNote}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="flex flex-col gap-6 items-center text-center p-10 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-emerald-100 group/rate1 transition-all">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] font-black uppercase tracking-tighter text-emerald-800 italic">Participation Investigation</span>
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Rate your active lesson engagement today</p>
                                </div>
                                <div className="flex items-center gap-1 p-2 bg-white rounded-3xl border border-gray-100 shadow-xl group-hover/rate1:scale-110 transition-transform">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={36}
                                            className={`cursor-pointer transition-all duration-300 ${s <= data.participationRating ? 'fill-emerald-500 text-emerald-500 scale-110 drop-shadow-md' : 'text-gray-100 hover:text-emerald-200'}`}
                                            onClick={() => setRating('participationRating', s)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 items-center text-center p-10 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-blue-100 group/rate2 transition-all">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[12px] font-black uppercase tracking-tighter text-blue-800 italic">Curriculum Confidence</span>
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Cognitive clarity regarding lesson material</p>
                                </div>
                                <div className="flex items-center gap-1 p-2 bg-white rounded-3xl border border-gray-100 shadow-xl group-hover/rate2:scale-110 transition-transform">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={36}
                                            className={`cursor-pointer transition-all duration-300 ${s <= data.confidenceRating ? 'fill-blue-500 text-blue-500 scale-110 drop-shadow-md' : 'text-gray-100 hover:text-blue-200'}`}
                                            onClick={() => setRating('confidenceRating', s)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 relative">
                            <div className="flex items-center justify-between px-4">
                                <span className="text-[11px] font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2 italic">
                                    <Edit3 size={14} /> Qualitative Reflection Workspace
                                </span>
                                <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter ${data.comments.length > 250 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {data.comments.length} / 300 Bytes
                                </span>
                            </div>
                            <textarea
                                className="w-full text-base font-black border-4 border-gray-100 focus:border-emerald-600 rounded-[40px] p-10 shadow-2xl transition-all resize-none bg-white placeholder:text-gray-100 leading-relaxed italic"
                                placeholder="Synthesize your learning journey for this week... what were the cognitive breakthroughs or blockers encountered?"
                                rows={5}
                                maxLength={300}
                                value={data.comments}
                                onChange={(e) => setData({ ...data, comments: e.target.value })}
                            />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                        </div>

                        <button
                            disabled={data.participationRating === 0 || data.confidenceRating === 0 || saving}
                            onClick={handleSubmit}
                            className={`flex items-center justify-center gap-5 w-full bg-black text-white py-10 text-sm font-black uppercase tracking-widest rounded-[50px] transition-all shadow-2xl hover:bg-emerald-600 active:scale-[0.98] mt-4 shadow-emerald-100 ${data.participationRating === 0 || data.confidenceRating === 0 ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:-translate-y-1'}`}
                        >
                            {saving ? (
                                'Transmitting Reflection Data...'
                            ) : (
                                <><Save size={20} className="animate-bounce" /> Synchronize Weekly Self-Analysis</>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelfAssessmentForm;
