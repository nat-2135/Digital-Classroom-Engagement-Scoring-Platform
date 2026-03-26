import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Lock, CheckCircle2, Star, Zap, Target, UserCheck, TrendingUp, CheckSquare, Dumbbell, Sprout, Search } from 'lucide-react';

const BadgeDisplay = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    const badgeIcons = {
        "5 Week Streak": { icon: Zap, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
        "10 Week Streak": { icon: Zap, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
        "Perfect Attendance": { icon: Target, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
        "Full Participation": { icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
        "Test Topper": { icon: Award, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
        "Most Improved": { icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
        "Assignment Master": { icon: CheckSquare, color: "text-teal-500", bg: "bg-teal-50", border: "border-teal-200" },
        "Comeback Kid": { icon: Dumbbell, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" },
        "Consistent Learner": { icon: Sprout, color: "text-lime-500", bg: "bg-lime-50", border: "border-lime-200" },
        "Self-Aware": { icon: Search, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200" }
    };

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const resp = await axios.get('http://localhost:8080/api/student/badges', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setBadges(resp.data);
            } catch (e) { } finally { setLoading(false); }
        };
        fetchBadges();
    }, []);

    if (loading) return <div className="text-center p-12 text-gray-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading achievements...</div>;

    return (
        <div className="card shadow-md p-8 border-gray-100 bg-white rounded-2xl">
            <div className="flex items-center gap-5 mb-10 border-b border-gray-100 pb-8">
                <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg">
                    <Award size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Achievements</h3>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Earned {badges.filter(b => b.earned).length} of {badges.length} available badges</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {badges.map((badge) => {
                    const config = badgeIcons[badge.name] || { icon: Award, color: "text-gray-400", bg: "bg-gray-50", border: "border-gray-100" };
                    const Icon = config.icon;

                    return (
                        <div
                            key={badge.name}
                            className={`relative card p-8 flex flex-col items-center text-center gap-4 border transition-all duration-300 rounded-2xl ${badge.earned
                                    ? `bg-white border-emerald-100 shadow-sm hover:shadow-md`
                                    : 'bg-gray-50/50 border-gray-200 opacity-60 grayscale'
                                }`}
                        >
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner mb-2 transition-transform group-hover:rotate-12 ${badge.earned ? 'bg-white shadow-emerald-100' : 'bg-gray-100 shadow-gray-200'}`}>
                                {badge.earned ? (
                                    <Icon size={48} className={`${config.color} drop-shadow-md`} />
                                ) : (
                                    <Lock size={40} className="text-gray-300" />
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <h4 className={`text-lg font-bold ${badge.earned ? 'text-gray-900' : 'text-gray-400'}`}>{badge.name}</h4>
                                <p className={`text-[11px] font-medium leading-relaxed px-2 ${badge.earned ? 'text-gray-600' : 'text-gray-300'}`}>{badge.description}</p>
                            </div>

                            {badge.earned && (
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-100">
                                        <CheckCircle2 size={10} /> Completed
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Awarded: {new Date(badge.earnedAt).toLocaleDateString()}</span>
                                </div>
                            )}

                            {badge.earned && (
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Star size={60} className="text-white fill-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BadgeDisplay;
