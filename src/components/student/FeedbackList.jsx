import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { MessageSquare, Calendar, User, ArrowRight } from 'lucide-react';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await api.get('/api/student/feedbacks');
                setFeedbacks(res.data || []);
            } catch (err) {
                console.error("Failed to load feedbacks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-emerald-600 font-bold">Loading Feedbacks...</div>;

    if (feedbacks.length === 0) return (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[32px] border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Feedbacks Yet</h3>
            <p className="text-gray-500 max-w-sm font-medium">When teachers send you personalized feedback or interventions, they will appear here correctly.</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-900 rounded-2xl text-white shadow-lg">
                    <MessageSquare size={20} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Teacher Feedbacks</h2>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Academic Interventions</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <User size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message From</span>
                                        <span className="text-sm font-bold text-gray-900">{fb.teacher?.name || 'Your Teacher'}</span>
                                    </div>
                                </div>
                                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-50 text-gray-700 leading-relaxed font-medium">
                                    {fb.message}
                                </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-2 shrink-0">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} /> {new Date(fb.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                                    Official Intervention
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-10">
                End of Academic Feedback Record
            </p>
        </div>
    );
};

export default FeedbackList;
