import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { MessageSquare, X } from 'lucide-react';

const FeedbackBar = () => {
    const [latestFeedback, setLatestFeedback] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await api.get('/api/student/feedbacks');
                if (res.data && res.data.length > 0) {
                    setLatestFeedback(res.data[0]);
                }
            } catch (err) {
                console.error("Feedback bar fetch error", err);
            }
        };
        fetchLatest();
    }, []);

    if (!latestFeedback || dismissed) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-4rem)] max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-emerald-600 text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-6 border border-emerald-500/50 backdrop-blur-xl">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquare size={24} />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Latest Feedback from {latestFeedback.teacher?.name || 'Teacher'}</p>
                    <p className="font-bold text-sm truncate">{latestFeedback.message}</p>
                </div>
                <button 
                    onClick={() => setDismissed(true)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default FeedbackBar;
