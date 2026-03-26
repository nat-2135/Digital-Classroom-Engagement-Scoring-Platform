import React from 'react';
import { User as UserIcon } from 'lucide-react';

const Header = ({ title, userName, role, email }) => {
    // Determine the best display name
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const displayName = userName || storedUser?.name || '';

    return (
        <div className="header sticky top-0 z-10 w-full px-8 py-4 flex items-center justify-between border-b bg-white">
            <h2 className="text-xl font-bold tracking-tight text-gray-800">{title}</h2>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-semibold text-gray-900 capitalize">{displayName}</span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {role || 'Guest'}
                    </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                    <UserIcon size={20} />
                </div>
            </div>
        </div>
    );
};

export default Header;
