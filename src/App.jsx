import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

const PrivateRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return <Navigate to="/login" replace />;
    if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />;
    return children;
};

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="h-screen w-screen bg-black flex items-center justify-center text-emerald-500 font-bold text-sm animate-pulse">Loading Platform...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                
                <Route path="/admin" element={
                    <PrivateRoute allowedRole="ADMIN">
                        <AdminDashboard user={user} />
                    </PrivateRoute>
                } />
                <Route path="/teacher" element={
                    <PrivateRoute allowedRole="TEACHER">
                        <TeacherDashboard user={user} />
                    </PrivateRoute>
                } />
                <Route path="/student" element={
                    <PrivateRoute allowedRole="STUDENT">
                        <StudentDashboard user={user} />
                    </PrivateRoute>
                } />

                <Route
                    path="/"
                    element={
                        user ? (
                            user.role === 'ADMIN' ? <Navigate to="/admin" /> :
                            user.role === 'TEACHER' ? <Navigate to="/teacher" /> :
                            <Navigate to="/student" />
                        ) : <Navigate to="/login" />
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
