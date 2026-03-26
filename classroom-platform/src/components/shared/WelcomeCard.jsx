import React from 'react';

const WelcomeCard = ({ name, role, email }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    };

    const formatDate = () => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    };

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = name || storedUser?.name || '';

    return (
        <div className="card mb-8 flex flex-col items-center justify-between gap-6 px-10 py-8 bg-white border border-gray-200 shadow-sm md:flex-row rounded-2xl transition-all duration-300">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    Good {getGreeting()}{displayName ? `, ` : ''}<span className="text-emerald-600 capitalize">{displayName}</span>
                </h1>
                <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-widest">{role} Dashboard Overview</p>
            </div>
            <div className="flex items-center gap-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">{formatDate()}</span>
            </div>
        </div>
    );
};

export default WelcomeCard;
