import React from 'react';
import { LayoutDashboard, Users, PenTool, ClipboardList, AlertCircle, MessageSquare, Award, BarChart3, History, LogOut, Settings, Trophy } from 'lucide-react';
import { logout } from '../../utils/auth';

const NavItem = ({ icon: Icon, label, pageKey, activePage, onNavigate }) => (
    <div
        onClick={() => onNavigate(pageKey)}
        className={`flex items-center gap-4 px-6 py-4 cursor-pointer rounded-xl mx-2 my-1 transition-all duration-200 border-l-4 ${
            activePage === pageKey 
                ? 'bg-emerald-700/50 border-white text-white font-bold' 
                : 'border-transparent text-emerald-100 hover:bg-emerald-700/30'
        }`}
    >
        <Icon size={16} className={activePage === pageKey ? 'opacity-100' : 'opacity-70'} />
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
    </div>
);

const Sidebar = ({ role, activeTab, setActiveTab }) => {
    const activePage = activeTab;
    const onNavigate = setActiveTab;

    const items = {
        ADMIN: [
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'teachers', label: 'Teachers', icon: Users },
            { id: 'analytics', label: 'Engagement Data', icon: BarChart3 },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'insights', label: 'System Insights', icon: AlertCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
        ],
        TEACHER: [
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'students', label: 'Student Roster', icon: Users },
            { id: 'engagement', label: 'Score Entry', icon: PenTool },
            { id: 'tests', label: 'Assessments', icon: ClipboardList },
            { id: 'atrisk', label: 'Interventions', icon: AlertCircle },
            { id: 'assessment', label: 'Self-Assessments', icon: MessageSquare },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'reports', label: 'Analytics', icon: BarChart3 },
        ],
        STUDENT: [
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'scores', label: 'My Engagement', icon: PenTool },
            { id: 'test', label: 'Weekly Test', icon: ClipboardList },
            { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
            { id: 'trend', label: 'Performance', icon: BarChart3 },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { id: 'assessment', label: 'Self-Check', icon: PenTool },
            { id: 'history', label: 'History', icon: History },
        ]
    };

    const navItems = items[role] || [];

    return (
        <div className="sidebar flex flex-col pt-8 bg-emerald-900 border-r border-emerald-800 text-white min-h-screen">
            <div className="px-8 mb-10">
                <h1 className="text-3xl font-black tracking-tighter text-white">ENGAGE</h1>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Institutional Portal</p>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        pageKey={item.id}
                        activePage={activePage}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
            <div className="mt-auto p-4 border-t border-emerald-800 bg-emerald-950/30">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-6 py-4 text-sm font-bold text-emerald-100 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
